import { QuartzTransformerPlugin } from "../types"
import { Root, Code } from "mdast"
import { visit } from "unist-util-visit"
import { JSResource, CSSResource } from "../../util/resources"
// @ts-ignore
import dataviewScript from "../../components/scripts/dataview.inline"
// @ts-ignore
import dataviewStyle from "../../components/styles/dataview.inline.scss"

export interface Options {}

const defaultOptions: Options = {}

export const DataviewQuery: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const _opts = { ...defaultOptions, ...userOpts }

  return {
    name: "DataviewQuery",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            visit(tree, "code", (node: Code, index, parent) => {
              if (node.lang === "dataview" || node.lang === "dataviewjs") {
                const queryText = node.value.trim()
                const currentSlug = file.data.slug ?? ""

                const htmlNode = {
                  type: "html",
                  value: `<div class="dataview-container" data-query="${escapeAttr(
                    queryText,
                  )}" data-slug="${escapeAttr(
                    currentSlug,
                  )}" data-lang="${node.lang}"><div class="dataview-loading"><span>⏳ Loading Dataview query...</span></div></div>`,
                }

                if (parent && index !== undefined) {
                  parent.children.splice(index, 1, htmlNode as any)
                }
              }
            })
          }
        },
      ]
    },
    externalResources() {
      const js: JSResource[] = [
        {
          script: dataviewScript,
          loadTime: "afterDOMReady",
          contentType: "inline",
        },
      ]
      const css: CSSResource[] = [
        {
          content: dataviewStyle,
          inline: true,
        },
      ]
      return { js, css }
    },
  }
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
