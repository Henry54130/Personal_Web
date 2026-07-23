import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  // 🎯 修正這裡：正確讀取 Frontmatter 裡面的標題
  const title = fileData.frontmatter?.title 
  
  // 這是我們成功抓到的 note
  const description = fileData.description 

  // 保留測試大聲公，你可以看看這次標題有沒有抓到
  // console.log(`[前端渲染測試] 標題: ${title}, 描述: ${description}`)

  if (title) {
    return (
      <div className={classNames(displayClass, "article-title-container")}>
        <h1 className="article-title">{title}</h1>
        {description && (
          <p className="article-description" style={{ color: "var(--gray)", fontSize: "1.1rem", marginTop: "-0.5rem", fontStyle: "italic" }}>
            {description}
          </p>
        )}
      </div>
    )
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor