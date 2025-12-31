<script type="py">
import json
import asyncio
import time
from pyscript import document
from pyodide.http import pyfetch

async def create_waterfall():
    # 使用單引號避開轉義問題
    status = document.querySelector('#status-bar')
    output = document.querySelector('#waterfall-output')
    
    try:
        status.innerHTML = 'Loading...'
        ts = int(time.time())
        # 這裡也換成單引號
        url = f'./contentIndex.json?t={ts}'
        response = await pyfetch(url)
        
        if not response.ok:
            status.innerHTML = 'Error: Cannot find JSON'
            return
            
        data = await response.json()
        segments = []

        for path, info in data.items():
            if path == '' or any(ex in path for ex in ['index', '404', 'tags/']):
                continue

            title = info.get('title', 'Untitled')
            desc = info.get('description', '')[:50]
            
            # 使用 f-string 並注意內外引號區隔
            card = f'<div class="note-card"><a href="./{path}" style="text-decoration:none;color:inherit;"><h3 style="margin-top:0;">{title}</h3><p style="font-size:0.9em;opacity:0.8;">{desc}...</p></a></div>'
            segments.append(card)

        output.innerHTML = ''.join(segments)
        status.innerHTML = f'Success: {len(segments)} notes loaded'

    except Exception as e:
        status.innerHTML = 'Python Error'
        print(str(e))

asyncio.ensure_future(create_waterfall())
</script>
