# 這是 waterfall.py 的內容
import json
import asyncio
import time
from pyscript import document
from pyodide.http import pyfetch

async def create_waterfall():
    status = document.querySelector('#status-bar')
    output = document.querySelector('#waterfall-output')
    
    try:
        status.innerHTML = '🔍 正在載入筆記...'
        ts = int(time.time())
        # 注意：在 GitHub Pages 上路徑可能需要調整
        response = await pyfetch(f'contentIndex.json?t={ts}')
        
        if not response.ok:
            status.innerHTML = '❌ 找不到 contentIndex.json'
            return
            
        data = await response.json()
        html_segments = []

        for path, info in data.items():
            if path == '' or any(ex in path for ex in ['index', '404', 'tags/']):
                continue

            title = info.get('title', '無標題')
            desc = info.get('description', '')[:60].replace('\n', ' ')
            
            card_html = f'<div class="note-card"><a href="./{path}" style="text-decoration:none;color:inherit;"><h3 style="margin-top:0;">{title}</h3><p style="font-size:0.9em;opacity:0.8;">{desc}...</p></a></div>'
            html_segments.append(card_html)

        if html_segments:
            output.innerHTML = ''.join(html_segments)
            status.innerHTML = f'✅ 成功載入 {len(html_segments)} 篇筆記'
        else:
            status.innerHTML = '⚠️ 沒有符合條件的筆記'

    except Exception as e:
        status.innerHTML = f'🔥 執行錯誤: {str(e)}'

asyncio.ensure_future(create_waterfall())
