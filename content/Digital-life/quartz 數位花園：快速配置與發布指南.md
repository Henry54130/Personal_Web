---
title: Quartz 數位花園：快速配置與發布指南
aliases: []
tags:
  - obsidian
  - quartz
  - self-media
  - personal-website
  - git
level: 1
Essence:
---

# 💎 Quartz 數位花園：快速配置與發布指南

紀錄了我從 Jekyll 遷移至 **Quartz v4** 的實戰經驗，特別是針對 **Node.js 22** 環境與 **GitHub Actions** 的正確配置。

---

## 🏗️ 1. 下載與環境初始化
Quartz 是基於 Node.js 的系統，安裝環境是成功的第一步。

1. **取得原始碼**：
   建一個資料夾，在終端機執行 `git clone https://github.com/jackyzha0/quartz.git`。
2. **安裝組件**：
   進入資料夾後執行 `npm install`。這會產生 `package-lock.json`，是雲端編譯成功的關鍵。

---

## 📂 2. 目錄結構規範
Quartz 對路徑有嚴格要求，確認：

* **`content/` 資料夾**：必須是 **全小寫**。所有 Obsidian 筆記放這裡。
* **`content/index.md`**：這是網站首頁，必須存在於 content 資料夾內。
* **刪除舊檔**：根目錄若有 `_config.yml` (舊 Jekyll 檔) 務必刪除，否則會導致 GitHub 編譯衝突。

---

## 🚀 3. 關鍵部署檔案：`deploy.yml`
在根目錄建立 `.github/workflows/deploy.yml`。針對 **Quartz v4.5.2+**，必須指定 **Node 22**：

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - main  # 如果你的分支叫 master，請改為 master

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22 # 關鍵：必須使用 Node 22 以上版本
      - name: Install Dependencies
        run: npm install
      - name: Build Quartz
        run: npx quartz build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps: deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        
```

## 🛠️ 4. 網站基礎設定
修改根目錄的 .ts 檔案來客製化網站：
 * quartz.config.ts (大腦)：
   * pageTitle: 修改網站標題。
   * 避坑指南：若因 Emoji (如 1️⃣) 導致編譯失敗，請在 emitters 區塊中將 Plugin.CustomOgImages() 註解掉。
 * quartz.layout.ts (骨架)：
   * 調整側邊欄顯示內容（檔案樹、圖譜、最近更新）。
## 🌐 5. GitHub 伺服器設定
檔案推送後，必須叫 GitHub 放棄 Jekyll，改用 Actions：
 * 進入 GitHub Repo -> Settings -> Pages。
 * Build and deployment > Source：下拉選單選 GitHub Actions。
## 📤 6. 日常更新流程
每次在 Obsidian 寫完筆記後，執行 Git 指令即可：
```git bash
git add .
git commit -m "更新筆記"
git push origin main
```

推送後可在 GitHub 的 Actions 分頁確認是否出現綠色勾勾 ✅。

