---  
title: 我的筆記瀑布流 (iPad 偵錯版)  
---  
  
<link rel="stylesheet" href="https://pyscript.net/releases/2024.1.1/core.css" />  
<style>  
    .debug-log { background: #1e1e1e; color: #00ff00; padding: 10px; font-family: monospace; font-size: 12px; border-radius: 5px; margin-bottom: 20px; white-space: pre-wrap; }  
    .note-card { border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 8px; }  
</style>  
  
<div id="debug-console" class="debug-log">🔍 系統狀態：等待 PyScript 初始化...</div>  
  
<div id="waterfall-output" class="waterfall-container">  
    </div>  
  
<script type="module" src="https://pyscript.net/releases/2024.1.1/core.js"></script>  
  
<script type="py">  
import json  
import asyncio  
import sys  
from pyscript import document  
from pyodide.http import pyfetch  
  
# --- 篩選條件區 ---  
FILTER_TAGS = ["精選"]  
EXCLUDE_LIST = ["index", "404"]  
  
# --- 自定義記錄器 (讓你在 iPad 畫面上看到報錯) ---  
def log(message):  
    console_div = document.querySelector("#debug-console")  
    console_div.innerHTML += f"\n> {message}"  
  
async def create_waterfall():  
    output = document.querySelector("#waterfall-output")  
    log("Python 引擎已啟動")  
      
    try:  
        log("正在抓取 contentIndex.json...")  
        # 增加 cache="no-cache" 確保 iPad 不會讀到舊資料  
        response = await pyfetch("contentIndex.json", cache="no-cache")  
          
        if not response.ok:  
            log(f"❌ 讀取失敗: HTTP {response.status}")  
            return  
              
        data = await response.json()  
        log(f"✅ 成功取得資料，共 {len(data)} 筆")  
  
        html_segments = []  
        for path, info in data.items():  
            # 排除邏輯  
            if path == "" or any(ex in path for ex in EXCLUDE_LIST):  
                continue  
              
            tags = info.get("tags", [])  
            title = info.get("title", "無標題")  
  
            # 標籤過濾  
            if FILTER_TAGS and not any(t in tags for t in FILTER_TAGS):  
                continue  
  
            card = f"""  
            <div class="note-card">  
                <a href="./{path}"><h3>{title}</h3></a>  
            </div>  
            """  
            html_segments.append(card)  
  
        if html_segments:  
            output.innerHTML = "".join(html_segments)  
            log("✨ 渲染完成")  
        else:  
            output.innerHTML = "沒有符合篩選條件的筆記。"  
            log("⚠️ 篩選後無結果")  
  
    except Exception as e:  
        log(f"🔥 發生崩潰: {str(e)}")  
  
# 啟動非同步執行  
asyncio.ensure_future(create_waterfall())  
</script>  
