---
title: git basic command
aliases: []
tags:
  - git
  - software
level: 1
link:
note:
published: true
---


## git basic command
```bash
git init # 第一次使該資料夾時用來初始化
git remote add origin <repository_url.git> # 加入欲同步之儲存庫
git branch -M main # 將預設分支名稱改為 main
git add . # 將檔案加入暫存區
git commit -m 'Your commit message here!' # 提交變更至本地
git status # 查看狀態
git push -u origin main # 推送變更至遠端
```