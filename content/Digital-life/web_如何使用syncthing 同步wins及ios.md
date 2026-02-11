---
date created: 2026-02-10 03-55-06
date modified: 2026-02-11 08-36-52
tags:
  - syncthing
  - windows
  - apple
  - ios
aliases:
  - Syncthing (Windows & iOS) 同步教學
title: Syncthing (Windows & iOS) 同步教學
---
## 1. 下載與啟動

### Windows 端：
* 前往 **Syncthing 官網** 下載 `syncthing-windows-amd64` 的 ZIP 檔。
* 解壓縮後，點擊 `syncthing.exe` 啟動。
* **注意：** 會彈出一個黑色視窗（不可關閉）和一個瀏覽器管理介面 (`127.0.0.1:8384`)。

### iOS 端：
* 在 **App Store** 搜尋並下載 `Mobius Sync`。
* 開啟 App，「允許」搜尋區域網路裝置。

---

## 2. 連結裝置 (配對)

* **電腦端：** 在網頁管理介面點擊右上角的 「動作」 (Actions)  $\to$ 「顯示識別碼」 (Show ID)，你會看到一個 QR Code。
* **手機端：**
  * 點擊 Devices 分頁 $\to$ 右上角 「+」 $\to$ Scan QR Code。
  * 掃描電腦上的 QR Code 後按 Save。
* **關鍵最後一步：** 回到電腦瀏覽器，畫面上方會跳出「新增裝置」請求，點擊 「新增裝置」 並儲存。

---

## 3. 指定資料夾 (也可以從電腦指定給手機)

### 手機端設定 (發起者)：
* 進入 Mobius Sync 的 Folders 分頁 $\to$ 點擊 「+」。
* **Folder Label：** 輸入 `SyncTest`。
* **Directory：** 點擊後選擇一個手機內的資料夾（例如「我的 iPhone」下新建一個 Sync 資料夾）。（要付錢$150才能購買「選擇外部資料夾」功能，沒購買的話，有總量1GB及只能在程式沙盒內創建資料夾）
* **Sharing：** 勾選你的電腦名稱。
* 點擊右上角 Save。

### 電腦端接收：
* 電腦瀏覽器會跳出「裝置請求分享資料夾 SyncTest」，點擊 「新增」。
* 在「資料夾路徑」選取你要存放在電腦的位置（例如 `D:\SyncTest`）。
* 點擊 儲存。

---

## 4. 創建一個 .txt 來測試

現在，兩邊的狀態應該都會顯示為「閒置」或「最新」。

### 手機端操作：
* 開啟 iOS 內建的 **「檔案」App**。
* 找到你剛剛指定的同步資料夾，在裡面點擊空白處「新增文件」，取名為 `hello.txt`。
* 打開它，隨便輸入一些文字（例如：`Hello Syncthing!`）並儲存。

### 電腦端檢查：
* 稍等幾秒鐘（觀察 Mobius Sync 的狀態條是否有在跑）。
* 開啟電腦上對應的資料夾，你會發現 `hello.txt` 已經自動出現了！

### 反向測試：
* 在電腦上修改這個 `hello.txt` 內容並存檔。
* 回到手機檔案 App 查看，內容應該也會同步更新。

## 5.常見問題
1. 連線太慢
	- 可使用tailscale創建虛擬網域 
	- 連接到同一wifi
2. 有時候電腦版點擊exe卻閃退
	- 通常是syncthing 已經在背景執行了，需要進工作管理員關閉，然後再重啟
3. 要同步就要開著終端機好煩
	- 使用syncthingtray來達成「開機啟動」及「背景執行」

