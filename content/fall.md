
---  
title: 我的筆記瀑布流  
---  

<link rel="stylesheet" href="https://pyscript.net/releases/2024.1.1/core.css" />  
<script type="module" src="https://pyscript.net/releases/2024.1.1/core.js" ></script>  

<div id="status-bar" style="font-family: monospace; color: #888; margin-bottom: 20px;">⏳ 載入中...</div>  

<div id="waterfall-output" class="waterfall-container"></div>  

<script type="py">  
import json  
import asyncio  
import time
from pyscript import document  
from pyodide.http import pyfetch  

# ==========================================  
# 篩選條件設定  
# ==========================================  
FILTER_TAGS = []          
FILTER_FOLDER = ""        
EXCLUDE_LIST = ["index", "404", "tags/"]  

async def create_waterfall():  
    status = document.querySelector("#status-bar")  
    output = document.querySelector("#waterfall-output")  
    
    try:  
        # 抓取資料庫
        ts = int(time.time())  
        response = await pyfetch(f"contentIndex.json?t={ts}")  
        
        if not response.ok:  
            status.innerHTML = "❌ 找不到 contentIndex.json"  
            return  
            
        data = await response.json()  
        html_segments = []  

        for path, info in data.items():  
            # 過濾邏輯
            if path == "" or any(ex in path for ex in EXCLUDE_LIST):  
                continue  
            if FILTER_FOLDER and FILTER_FOLDER not in path:
                continue
            tags = info.get("tags", [])  
            if FILTER_TAGS and not any(t in tags for t in FILTER_TAGS):  
                continue  

            # 提取資料
            title = info.get("title", "無標題")  
            description = info.get("description", "")[:60] + "..."  
            
            # 建立與 SCSS 相符的 HTML 結構
            # 使用你的 .note-card 類別
            card_html = f"""  
            <div class="note-card">  
                <a href="./{path}" style="text-decoration:none; color:inherit;">  
                    <h3 style="margin-top:0;">{title}</h3>  
                    <p style="font-size:0.9em; opacity:0.8; line-height:1.5;">{description}</p>  
                    <div style="margin-top:10px; font-size:0.8em; color:#666;">
                        {' '.join([f'#{t}' for t in tags])}
                    </div>
                </a>  
            </div>  
            """  
            html_segments.append(card_html)  

        if html_segments:  
            output.innerHTML = "".join(html_segments)  
            status.innerHTML = f"✅ 已載入 {len(html_segments)} 篇筆記"  
        else:  
            status.innerHTML = "⚠️ 沒有符合條件的筆記"  

    except Exception as e:  
        status.innerHTML = f"🔥 錯誤: {str(e)}"  

asyncio.ensure_future(create_waterfall())  
</script>
