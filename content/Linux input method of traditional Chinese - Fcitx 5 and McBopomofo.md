---
title: Linux input method of traditional Chinese - Fcitx 5 and McBopomofo
aliases: []
tags: [Linux, Taiwan, digital-life]
level: 1
published: true
---






> install McBopomofo on Linux and get Zuyhin input method
## 🛠️ 第一步：安裝編譯所需要的工具與環境

打開terminal，整行複製並貼上以下指令安裝編譯所需的依賴套件：

```Bash
sudo apt install git pkg-config fcitx5 libfcitx5core-dev libfcitx5config-dev libfcitx5utils-dev fcitx5-modules-dev cmake extra-cmake-modules gettext libfmt-dev libicu-dev libjson-c-dev -y
```

## 第二步：下載並編譯安裝「小麥注音」Linux 版

接下來，直接下載小麥注音的原原始碼，並在本機上進行編譯。：
```Bash
# 1. 複製小麥注音專案到你的電腦
git clone https://github.com/openvanilla/fcitx5-mcbopomofo.git

# 2. 進入該資料夾
cd fcitx5-mcbopomofo

# 3. 建立並執行編譯
cmake -B build -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release
cmake --build build

# 4. 安裝到系統中
sudo cmake --install build

# 5. 更新圖示快取，讓小麥注音的 icon 正常顯示
sudo update-icon-caches /usr/share/icons/*
```

## 第三步：重啟 Fcitx 5 輸入法

為了讓剛剛裝好的小麥注音生效，要重啟 Fcitx 5：

```Bash
fcitx5 -r
```

## 第四步：在 Fcitx 5 中加入「小麥注音」

1. 在桌面右下角工作列，找到 Fcitx 5 的鍵盤圖示，點擊右鍵選擇 **「設定 (Configure)」**。
    
2. 在彈出的設定視窗中：
    
    - 找到 **「僅顯示當前語言 (Only Show Current Language)」** 的勾選框，**取消勾選**。
        
    - 在右側的搜尋框中輸入：**`mcbopomofo`** 。
        
    - 會看到 **「小麥注音 (McBopomofo)」** 出現了！
        
    - 點選它，然後點擊中間的 **`<-` (向左箭頭)** 移到左側。
        
3. 點擊 **套用 (Apply)**。