---  
title: 我的筆記瀑布流  
---  
  
<script type="module" src="https://unpkg.com/@pyscript/core"></script>  
<link rel="stylesheet" href="https://unpkg.com/@pyscript/core/dist/core.css">  
  
<div id="waterfall-output" class="waterfall-container">  
    正在初始化 PyScript 環境...  
</div>  
  
<script type="py">  
import json  
import asyncio  
from pyscript import document  
from pyodide.http import pyfetch  
  
# ==========================================  
# 1. 篩選條件設定區  
# ==========================================  
FILTER_TAGS = ["精選"]    
FILTER_FOLDER = ""        
EXCLUDE_LIST = ["index", "404", "tags"]  
MAX_DESCRIPTION_LENGTH = 100  
  
# ==========================================  
# 2. 核心邏輯區 (強化偵錯版)  
# ==========================================  
  
async def create_waterfall():  
    container = document.querySelector("#waterfall-output")  
      
    # --- 步驟 1: 檢查檔案讀取 ---  
    container.innerHTML = "正在抓取 contentIndex.json..."  
    try:  
        # 嘗試讀取檔案，加上 cache: "no-cache" 避免抓到舊檔  
        response = await pyfetch("contentIndex.json", cache="no-cache")  
          
        if not response.ok:  
            container.innerHTML = f"❌ 錯誤：找不到 contentIndex.json (狀態碼: {response.status})<br>請確認檔案是否在 Quartz 的根目錄。"  
            return  
              
        data = await response.json()  
        container.innerHTML = f"✅ 成功讀取 JSON，共有 {len(data)} 筆資料，正在篩選..."  
          
    except Exception as e:  
        container.innerHTML = f"❌ 讀取過程發生崩潰: {str(e)}<br>建議按 F12 檢查 Console 報錯。"  
        return  
  
    # --- 步驟 2: 處理資料 ---  
    html_segments = []  
  
    for path, info in data.items():  
        # 排除邏輯  
        if path == "" or any(ex in path for ex in EXCLUDE_LIST):  
            continue  
          
        if FILTER_FOLDER and not path.startswith(FILTER_FOLDER):  
            continue  
  
        note_tags = info.get("tags", [])  
        title = info.get("title", "無標題")  
        description = info.get("description", "")  
  
        if FILTER_TAGS:  
            if not any(tag in note_tags for tag in FILTER_TAGS):  
                continue  
  
        if len(description) > MAX_DESCRIPTION_LENGTH:  
            description = description[:MAX_DESCRIPTION_LENGTH] + "..."  
              
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
  
    # --- 步驟 3: 最後渲染 ---  
    if html_segments:  
        container.innerHTML = "\n\n".join(html_segments)  
    else:  
        container.innerHTML = f"⚠️ 讀取成功，但沒有符合篩選條件 (Tag: {FILTER_TAGS}) 的筆記。"  
  
# 啟動  
asyncio.ensure_future(create_waterfall())  
  
</script>  
