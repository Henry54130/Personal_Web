---
title: 我的筆記瀑布流
---

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@pyscript/core@2024.1.1/dist/core.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@pyscript/core@2024.1.1/dist/core.js"></script>


這裡是我利用 PyScript 製作的動態筆記牆：

<div id="waterfall-output" class="waterfall-container">
    正在從 contentIndex.json 載入數據...
</div>

<script type="py">
import json
from pyscript import document
from pyodide.http import pyfetch

async def create_waterfall():
    # 注意：路徑要指向 Quartz 產生的靜態資源
    response = await pyfetch("/static/contentIndex.json")
    data = await response.json()
    
    container = document.querySelector("#photo")
    container.innerHTML = ""
    
    # ... 這裡放我之前給你的 Python 邏輯 ...
    # 產生的 HTML 內容 ...
    container.innerHTML = html_cards

import asyncio
asyncio.ensure_future(create_waterfall())
</script>
