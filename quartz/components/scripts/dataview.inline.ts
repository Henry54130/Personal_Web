import { FullSlug, getFullSlug, resolveRelative, pathToRoot } from "../../util/path"

interface ContentDetails {
  slug: FullSlug
  filePath: string
  title: string
  links: string[]
  tags: string[]
  content: string
  date?: string
}

type ContentIndex = Record<FullSlug, ContentDetails>

let contentIndexCache: ContentIndex | null = null
let contentIndexPromise: Promise<ContentIndex> | null = null

async function getContentIndex(currentSlug: FullSlug): Promise<ContentIndex> {
  if (contentIndexCache) return contentIndexCache

  const session = sessionStorage.getItem("quartz_content_index")
  if (session) {
    try {
      contentIndexCache = JSON.parse(session) as ContentIndex
      return contentIndexCache
    } catch {
      // ignore cache error
    }
  }

  if (!contentIndexPromise) {
    const url = pathToRoot(currentSlug) + "/static/contentIndex.json"
    contentIndexPromise = fetch(url)
      .catch(() => fetch("/static/contentIndex.json"))
      .then((res) => res.json())
      .then((data: ContentIndex) => {
        contentIndexCache = data
        try {
          sessionStorage.setItem("quartz_content_index", JSON.stringify(data))
        } catch {
          // ignore quota
        }
        return data
      })
  }

  return contentIndexPromise
}

interface DQLQuery {
  type: "LIST" | "TABLE" | "UNSUPPORTED"
  columns?: { name: string; alias?: string }[]
  fromTags: string[]
  fromFolder: string
  whereExprs: WhereExpr[]
  sortField?: string
  sortDesc?: boolean
  limit?: number
  unsupportedFeatures: string[]
}

interface WhereExpr {
  negated: boolean
  field: string
  op: "contains" | "eq" | "neq" | "gt" | "lt"
  value: string
}

function parseDQL(rawQuery: string, currentSlug: FullSlug): DQLQuery {
  const lines = rawQuery
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("//") && !l.startsWith("--"))

  const fullText = lines.join(" ")
  const query: DQLQuery = {
    type: "LIST",
    fromTags: [],
    fromFolder: "",
    whereExprs: [],
    unsupportedFeatures: [],
  }

  if (rawQuery.includes("dataviewjs") || rawQuery.includes("dv.")) {
    query.type = "UNSUPPORTED"
    query.unsupportedFeatures.push("DataviewJS 腳本（JavaScript Dataview 不支援）")
    return query
  }

  // Parse Command type
  const firstWordMatch = fullText.match(/^(LIST|TABLE|TASK|CALENDAR)/i)
  if (!firstWordMatch) {
    query.type = "UNSUPPORTED"
    query.unsupportedFeatures.push("無法識別的 Dataview 語法")
    return query
  }

  const commandType = firstWordMatch[1].toUpperCase()
  if (commandType === "TASK" || commandType === "CALENDAR") {
    query.type = "UNSUPPORTED"
    query.unsupportedFeatures.push(`${commandType} 查詢類型`)
    return query
  }

  query.type = commandType as "LIST" | "TABLE"

  // Parse TABLE columns if applicable
  if (query.type === "TABLE") {
    const tableHeaderMatch = fullText.match(/^TABLE\s+(.*?)\s+(FROM|WHERE|SORT|LIMIT|$)/i)
    if (tableHeaderMatch && tableHeaderMatch[1].trim()) {
      const colsRaw = tableHeaderMatch[1].split(",")
      query.columns = colsRaw.map((colStr) => {
        const asMatch = colStr.match(/(.*?)\s+AS\s+(.*)/i)
        if (asMatch) {
          return { name: asMatch[1].trim(), alias: asMatch[2].trim() }
        }
        return { name: colStr.trim() }
      })
    } else {
      query.columns = [{ name: "file.name", alias: "File" }]
    }
  }

  // Parse FROM
  const fromMatch = fullText.match(/\bFROM\s+([^\s]+(?: AND [^\s]+)?)/i)
  if (fromMatch) {
    const fromVal = fromMatch[1].trim()
    const parts = fromVal.split(/\s+AND\s+/i)
    for (const part of parts) {
      if (part.startsWith("#")) {
        query.fromTags.push(part.substring(1).toLowerCase())
      } else if (part.startsWith('"') && part.endsWith('"')) {
        query.fromFolder = part.slice(1, -1).toLowerCase()
      } else if (part !== '""' && part !== "''") {
        if (part.startsWith("#")) {
          query.fromTags.push(part.substring(1).toLowerCase())
        } else {
          query.fromFolder = part.replace(/^["']|["']$/g, "").toLowerCase()
        }
      }
    }
  }

  // Parse WHERE clauses
  const whereMatch = fullText.match(/\bWHERE\s+(.*?)(?=\s+\b(SORT|LIMIT)\b|$)/i)
  if (whereMatch) {
    const whereClause = whereMatch[1]
    if (whereClause.includes("inlinks")) {
      query.unsupportedFeatures.push("file.inlinks 反向連結過濾")
    }

    const conditions = whereClause.split(/\s+AND\s+/i)
    for (const cond of conditions) {
      const trimmed = cond.trim()
      let negated = false
      let exprStr = trimmed

      if (exprStr.startsWith("!")) {
        negated = true
        exprStr = exprStr.substring(1).trim()
      }

      // Check contains(field, "value")
      const containsMatch = exprStr.match(/^contains\(\s*([\w.]+)\s*,\s*["']?([^"']+)["']?\s*\)/i)
      if (containsMatch) {
        let field = containsMatch[1].toLowerCase()
        const val = containsMatch[2]

        if (field === "file.tags") field = "tags"
        if (
          field !== "tags" &&
          field !== "file.name" &&
          field !== "file.path" &&
          field !== "title"
        ) {
          query.unsupportedFeatures.push(`自訂欄位過濾：${field}`)
        }

        query.whereExprs.push({
          negated,
          field,
          op: "contains",
          value: val,
        })
        continue
      }

      // Check field != this.file.path or field != "value"
      const compMatch = exprStr.match(/^([\w.]+)\s*(!=|==|=)\s*(.*)$/)
      if (compMatch) {
        let field = compMatch[1].toLowerCase()
        const op = compMatch[2] === "!=" ? "neq" : "eq"
        let val = compMatch[3].trim().replace(/^["']|["']$/g, "")

        if (val === "this.file.path" || val === "this.path") {
          val = currentSlug
        }

        query.whereExprs.push({
          negated,
          field,
          op,
          value: val,
        })
        continue
      }
    }
  }

  // Parse SORT
  const sortMatch = fullText.match(/\bSORT\s+([\w.]+)(?:\s+(ASC|DESC))?/i)
  if (sortMatch) {
    const sortField = sortMatch[1].toLowerCase()
    query.sortField = sortField
    query.sortDesc = (sortMatch[2] ?? "ASC").toUpperCase() === "DESC"

    if (sortField.includes("inlinks")) {
      query.unsupportedFeatures.push("file.inlinks 反向連結排序（改為檔名排序）")
      query.sortField = "file.name"
    }
  }

  // Parse LIMIT
  const limitMatch = fullText.match(/\bLIMIT\s+(\d+)/i)
  if (limitMatch) {
    query.limit = parseInt(limitMatch[1], 10)
  }

  return query
}

function evaluateQuery(
  query: DQLQuery,
  index: ContentIndex,
  currentSlug: FullSlug,
): ContentDetails[] {
  let results = Object.values(index)

  // 1. FROM filter
  if (query.fromFolder && query.fromFolder !== "") {
    results = results.filter((item) => item.slug.toLowerCase().startsWith(query.fromFolder))
  }

  if (query.fromTags.length > 0) {
    results = results.filter((item) => {
      const itemTags = (item.tags ?? []).map((t) => t.toLowerCase())
      return query.fromTags.some((tag) =>
        itemTags.some((t) => t === tag || t.startsWith(tag + "/")),
      )
    })
  }

  // 2. WHERE filter
  for (const expr of query.whereExprs) {
    results = results.filter((item) => {
      let matches = false

      if (expr.field === "tags" || expr.field === "file.tags") {
        const itemTags = (item.tags ?? []).map((t) => t.toLowerCase())
        matches = itemTags.some(
          (t) => t === expr.value.toLowerCase() || t.includes(expr.value.toLowerCase()),
        )
      } else if (expr.field === "file.name" || expr.field === "title") {
        const title = (item.title ?? "").toLowerCase()
        matches = title.includes(expr.value.toLowerCase())
      } else if (expr.field === "file.path" || expr.field === "path") {
        const path = (item.slug ?? "").toLowerCase()
        if (expr.op === "eq") {
          matches = path === expr.value.toLowerCase()
        } else if (expr.op === "neq") {
          matches = path !== expr.value.toLowerCase()
        } else {
          matches = path.includes(expr.value.toLowerCase())
        }
      } else {
        matches = false
      }

      return expr.negated ? !matches : matches
    })
  }

  // 3. SORT
  if (query.sortField) {
    const isDesc = query.sortDesc ?? false
    results.sort((a, b) => {
      let valA = ""
      let valB = ""

      if (query.sortField === "file.mtime" || query.sortField === "date") {
        valA = a.date ?? ""
        valB = b.date ?? ""
      } else {
        valA = a.title ?? a.slug
        valB = b.title ?? b.slug
      }

      const cmp = valA.localeCompare(valB)
      return isDesc ? -cmp : cmp
    })
  }

  // 4. LIMIT
  if (query.limit && query.limit > 0) {
    results = results.slice(0, query.limit)
  }

  return results
}

function renderDataview(
  container: HTMLElement,
  query: DQLQuery,
  results: ContentDetails[],
  currentSlug: FullSlug,
) {
  container.innerHTML = ""

  let noticeHtml = ""
  if (query.unsupportedFeatures.length > 0) {
    noticeHtml = `<div class="dataview-notice">ℹ️ 提示：部分進階語法未完全支援（${query.unsupportedFeatures.join(
      ", ",
    )}）</div>`
  }

  if (query.type === "UNSUPPORTED") {
    container.innerHTML = `
      <div class="dataview-unsupported">
        <strong>⚠️ Dataview 語法提示</strong>
        ${noticeHtml}
      </div>
    `
    return
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div class="dataview-empty">
        <em>無符合的筆記結果</em>
        ${noticeHtml}
      </div>
    `
    return
  }

  if (query.type === "LIST") {
    const ul = document.createElement("ul")
    ul.className = "dataview-result-list"

    for (const item of results) {
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.href = resolveRelative(currentSlug, item.slug)
      a.textContent = item.title || item.slug
      li.appendChild(a)
      ul.appendChild(li)
    }

    container.appendChild(ul)
    if (noticeHtml) {
      const noticeDiv = document.createElement("div")
      noticeDiv.innerHTML = noticeHtml
      container.appendChild(noticeDiv)
    }
  } else if (query.type === "TABLE") {
    const table = document.createElement("table")
    table.className = "dataview-result-table"

    const thead = document.createElement("thead")
    const trHead = document.createElement("tr")
    const cols =
      query.columns && query.columns.length > 0 ? query.columns : [{ name: "file.name", alias: "File" }]

    for (const col of cols) {
      const th = document.createElement("th")
      th.textContent = col.alias || col.name
      trHead.appendChild(th)
    }
    thead.appendChild(trHead)
    table.appendChild(thead)

    const tbody = document.createElement("tbody")
    for (const item of results) {
      const tr = document.createElement("tr")
      for (const col of cols) {
        const td = document.createElement("td")
        const colName = col.name.toLowerCase()

        if (
          colName === "file.name" ||
          colName === "file.path" ||
          colName === "title" ||
          colName === "file"
        ) {
          const a = document.createElement("a")
          a.href = resolveRelative(currentSlug, item.slug)
          a.textContent = item.title || item.slug
          td.appendChild(a)
        } else if (colName === "tags" || colName === "file.tags") {
          td.textContent = (item.tags ?? []).map((t) => "#" + t).join(", ")
        } else {
          td.textContent = "—"
        }
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
    table.appendChild(tbody)
    container.appendChild(table)

    if (noticeHtml) {
      const noticeDiv = document.createElement("div")
      noticeDiv.innerHTML = noticeHtml
      container.appendChild(noticeDiv)
    }
  }
}

async function setupDataview() {
  const containers = document.querySelectorAll(".dataview-container") as NodeListOf<HTMLElement>
  if (containers.length === 0) return

  const currentSlug = getFullSlug(window)
  let index: ContentIndex
  try {
    index = await getContentIndex(currentSlug)
  } catch (err) {
    containers.forEach((c) => {
      c.innerHTML = `<div class="dataview-error">載入 contentIndex 失敗</div>`
    })
    return
  }

  containers.forEach((container) => {
    const rawQuery = container.dataset.query ?? ""
    const pageSlug = (container.dataset.slug as FullSlug) || currentSlug

    const query = parseDQL(rawQuery, pageSlug)
    const results = evaluateQuery(query, index, pageSlug)
    renderDataview(container, query, results, pageSlug)
  })
}

document.addEventListener("nav", setupDataview)
