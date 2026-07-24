---
title: ASUS motherboard + linux +coolercontrol
aliases: []
tags: [ASUS, motherboard, Linux]
level: 1
published: true
---




How to control fan by ASUS motherboard with Linux


## 步驟一：檢查與解鎖 ASUS 驅動模組
ASUS 主機板的風扇與溫度感測器通常隱藏在 WMI 或 EC（嵌入式控制器）中。我們必須先確保 Linux 核心有載入對應驅動。

1. **檢查系統是否已自動載入 ASUS 相關模組：**
   ```bash
   lsmod | grep asus
   ```
   *若輸出中看見 `asus_wmi_sensors` 或 `asus_wmi_ec_sensors`，代表核心已原生支援，可直接跳至步驟二。*

2. **手動掛載驅動（若上述指令無輸出）：**
   ```bash
   # 嘗試掛載標準 WMI 驅動
   sudo modprobe asus_wmi_sensors

   # 針對較新的 AMD 主機板，掛載 EC 驅動
   sudo modprobe asus_wmi_ec_sensors
   ```

3. **設定開機自動掛載：**
   為了避免每次重啟後風扇控制失效，將驅動寫入設定檔：
   ```bash
   echo "asus_wmi_sensors" | sudo tee -a /etc/modules-load.d/asus.conf
   # 若你是用 ec 晶片，則改寫入 asus_wmi_ec_sensors
   ```

---

## 步驟二：安裝 CoolerControl
`CoolerControl` 是目前 Linux 下最強大、最直覺的華碩主機板風扇控制工具，擁有類似 Windows 軟體的圖形介面。

### 1. Ubuntu / Debian 系列
```bash
# 導入官方 PPA 來源
curl -1sLf '[https://dl.cloudsmith.io/public/coolercontrol/coolercontrol/setup.deb.sh](https://dl.cloudsmith.io/public/coolercontrol/coolercontrol/setup.deb.sh)' | sudo -E bash

# 安裝主程式與背景服務
sudo apt install -y coolercontrol
```

### 2. Arch Linux 系列
```bash
# 使用 yay 從 AUR 安裝
yay -S coolercontrol
```

---

## 步驟三：啟動並進入程式
安裝完成後，必須啟動後台服務（Daemon）並打開圖形介面。

1. **啟動背景服務並設定開機自啟：**
   ```bash
   sudo systemctl enable --now coolercontrold
   ```

2. **進入程式：**
   * 你可以在系統的應用程式選單（Application Menu）中直接搜尋並點擊 **CoolerControl** 開啟。
   * 或者在終端機直接輸入以下指令開啟 GUI 介面：
     ```bash
     coolercontrol-gui
     ```

---

## 步驟四：常見功能與風扇曲線設定

進入 `CoolerControl` 介面後，系統會自動偵測到你的 ASUS 主機板硬體（例如 CPU_FAN、CHA_FAN1、AIO_PUMP 等）。

### 1. 建立自訂風扇曲線 (Custom Curve)
1. 在左側選單點擊 **Profiles** (設定檔)，建立一個新的設定檔（例如命名為 `Daily_Silent`）。
2. 在 **Curves** (曲線) 頁籤中，點擊 **+** 建立一條新曲線：
   * **Temperature Source (溫度源)：** 選擇 `CPU`（或是主機板上溫度最高的感測器）。
   * **Curve Type (類型)：** 選擇 `Graph (圖表)`。
3. 在圖表上點擊節點，拖曳你的風扇曲線。例如：
   * `40°C` ➡️ 轉速 `20%`（維持安靜）
   * `60°C` ➡️ 轉50%
   * `80°C` ➡️ 轉速 `100%`（全力散熱防降頻）

### 2. 綁定風扇與曲線
1. 回到 **Devices** (設備) 頁籤，找到你要控制的實體風扇（例如 `CPU_FAN`）。
2. 將該風扇的控制模式從 `Default` (預設) 改為 `Curve` (曲線)。
3. 在下拉選單中，選擇你剛剛建立的自訂曲線名稱。
4. 點擊 **Save (儲存)**，風扇就會立刻依照你的溫度曲線開始運轉！