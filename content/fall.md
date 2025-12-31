---
title: 我的筆記瀑布流
---

<script type="module" src="https://unpkg.com/@pyscript/core"></script>
<link rel="stylesheet" href="https://unpkg.com/@pyscript/core/dist/core.css">

<div id="waterfall-output" class="waterfall-container">
    正在從 contentIndex.json 載入數據...
</div>  

<script type="py">
import json
from pyscript import document
from pyodide.http import pyfetch

async def create_waterfall():
    try:
        # 抓取 Quartz 的內容索引 (路徑通常在根目錄)
        response = await pyfetch("contentIndex.json")
        data = await response.json()
    except Exception as e:
        document.querySelector("#waterfall-output").innerHTML = f"載入失敗: {e}"
        return

    container = document.querySelector("#waterfall-output")
    container.innerHTML = ""
    
    html_cards = ""
    
    # 遍歷數據並生成符合 SCSS 結構的 HTML
    for path, info in data.items():
        if path == "index": continue
        
        title = info.get("title", "無標題")
        # 取得純文字摘要
        description = info.get("description", "（尚無描述）")
        link = f"./{path}" 
        
        html_cards += f"""
        <div class="note-card">
            <a href="{link}">
                <h3>{title}</h3>
                <p>{description}</p>
            </a>
        </div>
        """
    
    container.innerHTML = html_cards

import asyncio
asyncio.ensure_future(create_waterfall())
</script>
