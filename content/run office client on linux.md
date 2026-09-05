---
aliases:
  - How to setup WinApps Client on Remote Linux
link:
  - "[[how to use winapps]]"
tags:
  - Linux
  - windows
---


## 一、主機（Host）確認

### 1. 確認 Windows 容器對外監聽通訊埠
**效果**：驗證主機的 RDP 服務監聽於外部或虛擬通道（如 Tailscale），而非僅限 127.0.0.1。
```bash
ss -tulpn | grep 3389
```

---

## 二、客戶端（Client）建置

### 1. 安裝 FreeRDP 與桌面相依套件
**效果**：在遠端 Linux 客戶端安裝連線核心工具與圖形捷徑資料庫管理程式。
```bash
sudo apt update && sudo apt install -y freerdp2-x11 desktop-file-utils curl
```

### 2. 下載圖示
**效果**：直接從官方倉庫抓取 Office 三件套之向量圖示檔存放至本地目錄。
```bash
mkdir -p ~/.local/share/icons/winapps && curl -sSL https://raw.githubusercontent.com/winapps-org/winapps/main/apps/word/icon.svg -o ~/.local/share/icons/winapps/word.svg && curl -sSL https://raw.githubusercontent.com/winapps-org/winapps/main/apps/excel/icon.svg -o ~/.local/share/icons/winapps/excel.svg && curl -sSL https://raw.githubusercontent.com/winapps-org/winapps/main/apps/powerpoint/icon.svg -o ~/.local/share/icons/winapps/powerpoint.svg
```

### 3. 部署動態螢幕遠端啟動器
**效果**：以 Base64 解碼寫入通用啟動腳本，具備動態 DISPLAY 識別、非全螢幕原生視窗化、雙向剪貼簿與家目錄自動掛載。
```bash
mkdir -p ~/.local/bin && echo "IyEvYmluL2Jhc2gKSE9TVF9JVD0iPFlPVVJfSE9TVF9JUD4iIAojIOirgroup6bmsbLkuLvkupTkubPohbDmsbJvclRhaWxzY2FsZUlQClJEUF9VU0VFPSJhZG1pbiIKUkRQX1BBU1M9ImFkbWluIgpBUFBfVFlQRT0iJDEiCnNoaWZ0CgppZiBbIC16ICIkRElTUExBWSIgXTsgdGhlbgogICAgZXhwb3J0IERJU1BMQVk9JChscyAtMSAvdG1wLy5YMTEtdW5peC9YKiAyPi9kZXYvbnVsbCB8IGhlYWQgLW4gMSB8IHNlZCAnc3wvdG1wLy5YMTEtdW5peC9YfDp8JykKICAgIFsgLXogIiRESVNQTEFZIiBdICYmIGV4cG9ydCBESVNQTEFZPSI6MCIKZmkKCmNhc2UgIiRBUFBfVFlQRSIgaW4KICAgIHdvcmQpCiAgICAgICAgQVBQX1BBVEg9J0M6XFByb2dyYW0gRmlsZXNcTWljcm9zb2Z0IE9mZmljZVxyb290XE9mZmljZTE2XFdJTldPUkQuRVhFJwogICAgICAgIDs7CiAgICBleGNlbCkKICAgICAgICBBUFBfUEFUSD0nQzpcUHJvZ3JhbSBGaWxlc1xNaWNyb3NvZnQgT2ZmaWNlXHJvb3RcT2ZmaWNlMTZcRVhDRUwuRVhFJwogICAgICAgIDs7CiAgICBwb3dlcnBvaW50fHBwdCkKICAgICAgICBBUFBfUEFUSD0nQzpcUHJvZ3JhbSBGaWxlc1xNaWNyb3NvZnQgT2ZmaWNlXHJvb3RcT2ZmaWNlMTZcUE9XRVJQTlQuRVhFJwogICAgICAgIDs7CiAgICAqKQogICAgICAgIGV4aXQgMQogICAgICAgIDs7CmVzYWMKCm5vaHVwIHhmcmVlcmRwIC91OiIkUkRQX1VTRVIiIC9wOiIkUkRQX1BBU1MiIC92OiIkSE9TVF9JUCI6MzM4OSBcCiAgICAvYXBwOiIkQVBQX1BBVEgiIFwKICAgICtjbGlwYm9hcmQgXAogICAgL2R5bmFtaWMtcmVzb2x1dGlvbiBcCiAgICAvd29ya2FyZWEgXAogICAgL2NlcnQ6aWdub3JlIFwKICAgIC9kcml2ZTpob21lLCIkSE9NRSIgIiRAIiA+L2Rldi9udWxsIDI+JjEgJgo=" | base64 -d > ~/.local/bin/office-remote && chmod +x ~/.local/bin/office-remote
```

### 4. 設定伺服器目標 IP
**效果**：替換腳本內的 IP 佔位符為實際運行的主機位址。
```bash
sed -i 's/<YOUR_HOST_IP>/<YOUR_HOST_IP>/g' ~/.local/bin/office-remote
```

---

## 三、安裝目標服務與啟動營運

### 1. 建立桌面捷徑並註冊副檔名關聯
**效果**：建立 3 款常用 Office 軟體之系統桌面選單項目，支援圖示顯示與點擊開啟。
```bash
mkdir -p ~/.local/share/applications && sudo bash -c 'cat << "EOF" > ~/.local/share/applications/word.desktop
[Desktop Entry]
Name=Microsoft Word
Exec=/home/'"$USER"'/.local/bin/office-remote word %F
Icon=/home/'"$USER"'/.local/share/icons/winapps/word.svg
Terminal=false
Type=Application
Categories=Office;WordProcessor;
MimeType=application/msword;application/vnd.openxmlformats-officedocument.wordprocessingml.document;
EOF' && sudo bash -c 'cat << "EOF" > ~/.local/share/applications/excel.desktop
[Desktop Entry]
Name=Microsoft Excel
Exec=/home/'"$USER"'/.local/bin/office-remote excel %F
Icon=/home/'"$USER"'/.local/share/icons/winapps/excel.svg
Terminal=false
Type=Application
Categories=Office;Spreadsheet;
MimeType=application/vnd.ms-excel;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;
EOF' && sudo bash -c 'cat << "EOF" > ~/.local/share/applications/powerpoint.desktop
[Desktop Entry]
Name=Microsoft PowerPoint
Exec=/home/'"$USER"'/.local/bin/office-remote powerpoint %F
Icon=/home/'"$USER"'/.local/share/icons/winapps/powerpoint.svg
Terminal=false
Type=Application
Categories=Office;Presentation;
MimeType=application/vnd.ms-powerpoint;application/vnd.openxmlformats-officedocument.presentationml.presentation;
EOF' && update-desktop-database ~/.local/share/applications/ 2>/dev/null
```

### 2. 啟動驗證
**效果**：在背景呼叫主機運算之 Word 軟體，以原生獨立視窗在客戶端螢幕開展。
```bash
~/.local/bin/office-remote word
```

---

## 四、選擇性

### 1. 客戶端配置終端別名
**效果**：允許直接在命令列輸入軟體簡稱啟動遠端 Office。
```bash
cat << 'EOF' >> ~/.bashrc
alias word="$HOME/.local/bin/office-remote word"
alias excel="$HOME/.local/bin/office-remote excel"
alias ppt="$HOME/.local/bin/office-remote powerpoint"
EOF && source ~/.bashrc
```

---

## 五、Debug

### 1. 測試客戶端與主機 RDP 網路通訊
**效果**：排除 Tailscale 通道或網路防火牆阻塞。
```bash
nc -zvw3 <YOUR_HOST_IP> 3389
```

### 2. 排除 Windows 控制台桌面會話搶佔
**效果**：若主機開有 SSH 服務，踢除佔用虛擬機 Console 桌面的連線以釋出 Session。
```bash
ssh -p 2222 admin@<YOUR_HOST_IP> 'logoff 1' 2>/dev/null
```

### 3. 前台除錯模式連線
**效果**：在前台印出所有握手日誌，快速定位參數錯誤或認證異常。
```bash
xfreerdp /u:admin /p:admin /v:<YOUR_HOST_IP>:3389 /app:"C:\Program Files\Microsoft Office\root\Office16\WINWORD.EXE" +clipboard /dynamic-resolution /workarea /cert:ignore /drive:home,"$HOME"
```