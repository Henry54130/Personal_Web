---
title: 🚀 宿舍電腦遠端工作站：Moonlight + Sunshine + Tailscale 指南
aliases: []
tags:
  - coding
  - Sofware
  - digital-life
  - game
date created: 2026-01-21 10-19-10
date modified: 2026-03-23 08-52-53
level: 1
note:
published: true
---


> [!abstract] 簡介
> 出門在外時，利用 iPad 透過虛擬區網連回宿舍電腦，享受低延遲、高性能的體驗。

---

## 🛠️ 第一階段：建立虛擬區網 (Tailscale)
*解決「出門在外連不到家裡電腦」的問題。*

- [ ] **電腦端安裝**：
    1. 前往 [Tailscale 官網](https://tailscale.com/download/windows) 下載並安裝。
    2. 使用 Google 或 GitHub 帳號登入。
    3. **記下 IP**：點擊右下角圖示，複製 **100.x.x.x** 開頭的 IP 地址。
- [ ] **iPad 端安裝**：
    1. 在 App Store 下載 Tailscale。
    2. 登入相同帳號，點擊 **Connect** 並允許 VPN 權限。


---

## 🖥️ 第二階段：配置主機服務 (Sunshine)
*讓你的 Windows 電腦具備高性能串流能力。*

- [ ] **安裝 Sunshine**：
    1. 從 [GitHub Releases](https://github.com/LizardByte/Sunshine/releases) 下載 `.exe` 並安裝。
- [ ] **設定管理頁面**：
    1. 瀏覽器開啟 `https://localhost:47990`。
    2. 首次進入需自定義 **Username** 與 **Password**（務必記住）。
---

## 📱 第三階段：iPad 連線與配對 (Moonlight)
*將 iPad 變身為你的電腦螢幕。*

1. **手動添加主機**：在 iPad 打開 Moonlight，點擊右上角 `+`。
2. **輸入 IP**：填入剛才 Tailscale 的 **100.x.x.x** 位址。
3. **配對 PIN**：
    - iPad 顯示 4 位數代碼。
    - 回到電腦 Sunshine 網頁 -> 點擊頂部 `PIN` 標籤 -> 輸入代碼 -> 點擊 `Send`。
4. **開始串流**：點擊 `Desktop` 進入桌面。

## ⚠️ 重要清單 (防斷連)

- [ ] **電源設定**：`控制台` -> `電源選項` -> `變更電腦睡眠時間` -> **「使電腦進入睡眠狀態」設為「從不」**
- [ ] **防火牆**：若連不上，請確保 Windows 防火牆允許 `Sunshine.exe` 通過。
- [ ] 因為電腦螢幕蓋起來時會連不上(就算設定'do nothing'，螢幕暗掉就無法連接)，所以參考 [[how to make virtual screen]] 來使用虛擬營幕解決

## reference 
- https://ivonblog.com/posts/windows-sunshine-remote-gaming/