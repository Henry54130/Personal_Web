---
date created: 2026-04-15 02-22-42
date modified: 2026-04-15 02-38-52
title: Sunshine + iPad 虛擬延伸螢幕
aliases: []
tags:
  - digital-life
  - remote-destop
  - iPad
level: 1
link:
note:
published: false
---
在開始之前，你要先知道如何使用 [[Moonlight sunshine+ tailscale]]
### Step 1：找出 Display ID
Sunshine 預設會抓取主螢幕，我們要強制它抓取剛建立的「虛擬螢幕」。

1. **開啟 Sunshine 管理介面**：由右下角背景程式選單右鍵開啟
2. **登入**
3. **切換至日誌頁面**：點擊上方選單的 「Troubleshooting」（疑難排解）並查看 「Log」。
4. **定位 ID**：
   * 找到與`"friendly_name": "Linux FHD"`同一區的`"device_id": "
   * **複製編號(包含大括號)**：例如 `{那串英數}`。

### Step 2：設定 Sunshine 改用延伸螢幕
1. **進入設定**：點擊 Sunshine 頂部的 「Configuration」。
2. **修改輸出螢幕**：
   * 找到「Audio/Video」區塊中的 「display ID」。
   * 將空白
的內容改為剛才在 Log 找到的`{英數}`
1. **儲存並重啟**：點擊下方的 「Save」及「apply」。
### Step 3：Windows 顯示設定 (延伸模式)
為了讓 iPad 成為真正的第二個螢幕，而不是鏡像畫面：

1. 按下鍵盤 `Win + P`，選擇 **「延伸」 (Extend)**。
2. 如果比例不對、進入「系統」 > 「顯示器」，你會看到兩個正方形。
3. 點選那個代表虛擬螢幕的小框（通常是 2 號）：
   * **解析度**：選擇你在 option.txt 設定的 iPad 解析度。
   * **縮放**：建議設定在 150% - 200%，否則 iPad 上的圖示會太小。
### Step 4：iPad 連線 (Moonlight)
1. 在 iPad 開啟 Moonlight 並連線至電腦。
2. 此時 iPad 應該會直接顯示 Windows 的第二螢幕畫面。
### 常見問題排除
* **滑鼠移不過去？**：在 Windows 顯示設定裡，用滑鼠拖動 1 號與 2 號螢幕的排列位置，對齊你 iPad 擺放的實際位置（左邊或右邊）。
* **開啟延伸螢幕還是顯示第一主螢幕？**：先`wins P`切換至「只顯示第二螢幕」再切回「延伸螢幕」。