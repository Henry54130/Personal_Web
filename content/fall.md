---  
title: 我的筆記瀑布流  
---  
  
<script type="module" src="https://unpkg.com/@pyscript/core" ></script>  
<link rel="stylesheet" href="https://unpkg.com/@pyscript/core/dist/core.css">  
  
<div id="waterfall-output" class="waterfall-container">  
    正在載入筆記牆...  
</div>  
  
<script type="py">  
import json  
import asyncio  
from pyscript import document  
from pyodide.http import pyfetch  
  
# ==========================================  
# 1. 篩選條件設定區 (在這裡修改你的需求)  
# ==========================================  
  
# [標籤篩選]：填入想顯示的標籤名稱，例如 ["Python", "生活"]。若不篩選請設為 []  
FILTER_TAGS = ["Daily_Capture"]    
  
# [路徑篩選]：填入想顯示的資料夾路徑，例如 "posts/"。若不篩選請設為 ""  
FILTER_FOLDER = ""        
  
# [排除清單]：填入不想顯示的特定檔名或路徑  
EXCLUDE_LIST = ["index", "404", "tags"]  
  
# [摘要長度]：設定卡片文字預覽的字數限制  
MAX_DESCRIPTION_LENGTH = 100  
  
  
# ==========================================  
# 2. 核心邏輯區  
# ==========================================  
  
async def create_waterfall():  
    # 取得網頁上的容器元素  
    container = document.querySelector("#waterfall-output")  
      
    try:  
        # 抓取 Quartz 自動生成的內容索引檔  
        response = await pyfetch("contentIndex.json")  
          
        if not response.ok:  
            container.innerHTML = "找不到 contentIndex.json，請確認檔案是否存在。"  
            return  
              
        # 將 JSON 轉為 Python 字典  
        data = await response.json()  
          
    except Exception as e:  
        container.innerHTML = f"載入過程發生錯誤: {e}"  
        return  
  
    # 初始化：清空容器內容並準備存放 HTML 的清單  
    container.innerHTML = ""  
    html_segments = []  
  
    # 開始逐一檢查每一篇筆記  
    for path, info in data.items():  
          
        # --- 執行篩選邏輯 ---  
          
        # A. 排除特定頁面 (如首頁或 EXCLUDE_LIST 中的內容)  
        if path == "" or any(ex in path for ex in EXCLUDE_LIST):  
            continue  
          
        # B. 資料夾路徑篩選 (如果設定了資料夾，則只顯示該路徑開頭的筆記)  
        if FILTER_FOLDER and not path.startswith(FILTER_FOLDER):  
            continue  
  
        # 提取該筆記的標籤與內容  
        note_tags = info.get("tags", [])  
        title = info.get("title", "無標題")  
        description = info.get("description", "")  
  
        # C. 標籤篩選 (如果有設定標籤，則筆記必須包含其中至少一個標籤)  
        if FILTER_TAGS:  
            # 檢查筆記標籤與篩選標籤是否有交集  
            if not any(tag in note_tags for tag in FILTER_TAGS):  
                continue  
  
        # --- 處理顯示格式 ---  
          
        # 限制摘要長度，超過則顯示省略號  
        if len(description) > MAX_DESCRIPTION_LENGTH:  
            description = description[:MAX_DESCRIPTION_LENGTH] + "..."  
              
        # 組裝 HTML 卡片結構 (對應 CSS 的 class)  
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
          
        # 將合格的卡片加入清單  
        html_segments.append(card_html)  
  
  
    # --- 最後一步：渲染 ---  
  
    if html_segments:  
        # 將所有卡片連接起來，注入到網頁容器中  
        container.innerHTML = "\n\n".join(html_segments)  
    else:  
        # 如果經過篩選後沒半篇符合，顯示提示訊息  
        container.innerHTML = "目前沒有符合篩選條件的筆記。"  
  
  
# 啟動非同步任務執行以上程式  
asyncio.ensure_future(create_waterfall())  
  
</script>  
