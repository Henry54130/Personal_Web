import { Root as HTMLRoot } from "hast"
import { toString } from "hast-util-to-string"
import { QuartzTransformerPlugin } from "../types"
import { escapeHTML } from "../../util/escape"

export interface Options {
  descriptionLength: number
  maxDescriptionLength: number
  replaceExternalLinks: boolean
}

const defaultOptions: Options = {
  descriptionLength: 150,
  maxDescriptionLength: 300,
  replaceExternalLinks: true,
}

const urlRegex = new RegExp(
  /(https?:\/\/)?(?<domain>([\da-z\.-]+)\.([a-z\.]{2,6})(:\d+)?)(?<path>[\/\w\.-]*)(\?[\/\w\.=&;-]*)?/,
  "g",
)

export const Description: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "Description",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file) => {
            const fm = file.data.frontmatter as any
            
            // 優先抓取 note 或 description
            const noteValue = fm?.note ?? fm?.Note ?? fm?.description ?? ""
            
            // 處理 HTML 跳脫字元並取得內文 text (這是給 Search 搜尋功能用的，必須保留)
            let text = escapeHTML(toString(tree))

            if (opts.replaceExternalLinks) {
              text = text.replace(urlRegex, "$<domain>$<path>")
            }

            // 核心邏輯修改：有 note 才寫入 description，沒有就設為 undefined，不自動抓摘要
            if (noteValue && String(noteValue).trim() !== "") {
              file.data.description = String(noteValue).replace(urlRegex, "$<domain>$<path>")
            } else {
              file.data.description = undefined
            }

            // 寫入純文字供全文搜尋使用
            file.data.text = text
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    description?: string
    text: string
  }
}