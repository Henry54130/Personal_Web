---
title: 我的筆記瀑布流
---

<script type="module" src="https://unpkg.com/@pyscript/core" ></script>
<link rel="stylesheet" href="https://unpkg.com/@pyscript/core/dist/core.css" >

<div id="waterfall-output" class="waterfall-container">
    正在載入筆記牆...
</div>

<script type="py">
import json
import asyncio
from pyscript import document
from pyodide.http import pyfetch

async def create_waterfall():
    
    # ---------------------------------------------------------
    # 1. 取得 DOM 容器與抓取數據
    # ---------------------------------------------------------
    
    container = document.querySelector("#waterfall-output")
    
    try:
        # 抓取 Quartz 自動生成的索引檔
        response = await pyfetch("contentIndex.json")
        
        if not response.ok:
            container.innerHTML = "找不到 contentIndex.json，請確認檔案路徑。"
            return
            
        data = await response.json()
        
    except Exception as e:
        container.innerHTML = f"載入過程發生錯誤: {e}"
        return


    # ---------------------------------------------------------
    # 2. 清空容器並準備處理數據
    # ---------------------------------------------------------
    
    container.innerHTML = ""
    
    html_segments = []


    # ---------------------------------------------------------
    # 3. 遍歷數據並建立卡片結構
    # ---------------------------------------------------------
    
    for path, info in data.items():
        
        # 排除不需要顯示的頁面（如 index 或特殊頁面）
        if path == "index" or path == "":
            continue
            
        # 提取標題與描述
        title = info.get("title", "無標題")
        
        description = info.get("description", "")
        
        # 限制摘要長度
        if len(description) > 100:
            description = description[:100] + "..."
            
        # 組裝 HTML 片段 (對應你在 custom.scss 定義的 class)
        card_html = f"""
        <div class="note-card">
            <a href="./{path}">
                <div class="card-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </a>
        </div>
        """
        
        html_segments.append(card_html)


    # ---------------------------------------------------------
    # 4. 將生成的 HTML 注入頁面
    # ---------------------------------------------------------
    
    if html_segments:
        # 使用換行符號連接所有卡片並渲染
        container.innerHTML = "\n\n".join(html_segments)
    else:
        container.innerHTML = "目前沒有可顯示的筆記。"


# 執行非同步程式
asyncio.ensure_future(create_waterfall())

</script>
