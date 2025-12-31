---  
title: 我的筆記瀑布流 (iPad 優化版)  
---  
  
<link rel="stylesheet" href="https://pyscript.net/releases/2024.1.1/core.css" />  
<script type="module" src="https://pyscript.net/releases/2024.1.1/core.js" ></script>  
  
<style>  
    .status-box { background: #222; color: #ffca28; padding: 10px; border-radius: 5px; font-family: monospace; margin-bottom: 10px; border: 1px solid #444; }  
    .note-card { border: 1px solid #333; padding: 15px; margin-bottom: 15px; border-radius: 10px; background: #1a1a1a; }  
</style>  
  
<div id="status-bar" class="status-box">⏳ 正在連線至 PyScript 伺服器...</div>  
  
<div id="waterfall-output">  
    </div>  
  
<script type="py">  
import json  
import asyncio  
from pyscript import document  
from pyodide.http import pyfetch  
  
# ==========================================  
# 篩選條件設定區  
# ==========================================  
FILTER_TAGS = [""]    
FILTER_FOLDER = ""        
EXCLUDE_LIST = ["index", "404"]  
  
async def create_waterfall():  
    status = document.querySelector("#status-bar")  
    output = document.querySelector("#waterfall-output")  
      
    try:  
        status.innerHTML = "🚀 Python 啟動成功，正在抓取 contentIndex.json..."  
          
        # iPad 容易有快取問題，我們手動在網址後加上時間戳記  
        import time  
        ts = int(time.time())  
        response = await pyfetch(f"contentIndex.json?t={ts}")  
          
        if not response.ok:  
            status.innerHTML = f"❌ 讀取失敗 (HTTP {response.status})。請確認檔案在根目錄。"  
            return  
              
        data = await response.json()  
        status.innerHTML = f"✅ 已成功抓取 {len(data)} 筆筆記，過濾中..."  
  
        html_segments = []  
        for path, info in data.items():  
            if path == "" or any(ex in path for ex in EXCLUDE_LIST):  
                continue  
            
            # 標籤過濾  
            tags = info.get("tags", [])  
            if FILTER_TAGS and not any(t in tags for t in FILTER_TAGS):  
                continue  
  
            title = info.get("title", "無標題")  
            description = info.get("description", "")[:60] + "..."  
              
            card_html = f"""  
            <div class="note-card">  
                <a href="./{path}" style="text-decoration:none; color:inherit;">  
                    <h3 style="margin-top:0;">{title}</h3>  
                    <p style="font-size:0.9em; opacity:0.8;">{description}</p>  
                </a>  
            </div>  
            """  
            html_segments.append(card_html)  
  
        if html_segments:  
            output.innerHTML = "".join(html_segments)  
            status.innerHTML = f"✨ 成功渲染 {len(html_segments)} 篇筆記！"  
        else:  
            status.innerHTML = "⚠️ 找不到符合篩選條件的筆記。"  
  
    except Exception as e:  
        status.innerHTML = f"🔥 執行出錯: {str(e)}"  
  
# 確保環境穩定後再執行  
asyncio.ensure_future(create_waterfall())  
</script>  
