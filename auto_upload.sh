#!/bin/bash

# 自動上傳 Quartz 變更腳本
# 每日 20:00 自動執行

# 設定 Node 22 與 Git 環境
export PATH="/home/huang/.n/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
REPO_DIR="/home/huang/DATA/code/personal-website"
LOG_FILE="$REPO_DIR/auto_upload.log"

cd "$REPO_DIR" || exit 1

TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] 開始執行每日自動同步..." >> "$LOG_FILE"

# 檢查是否有變更
if [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "auto: 每日定時自動更新 ($TIMESTAMP)"
  
  if git push origin main >> "$LOG_FILE" 2>&1; then
    echo "[$TIMESTAMP] 成功推送到 GitHub！" >> "$LOG_FILE"
  else
    echo "[$TIMESTAMP] 錯誤：推送到 GitHub 失敗。" >> "$LOG_FILE"
  fi
else
  echo "[$TIMESTAMP] 沒有檢測到任何筆記或程式碼變更，跳過上傳。" >> "$LOG_FILE"
fi
