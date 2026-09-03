---
tags:
  - google
  - AI
  - google-Gemma
  - AI-model
created: 2026-07-29
alias: google PLE
published: true
---

# 📝 用記憶體查表換取極致算力

> PLE 的本質在於 **「將計算量 (FLOPs) 與參數量 (Memory) 解耦」**——模型在**訓練階段**預先透過反向傳播學習各層的靜態特徵表，而在**推理階段**完全不需要進行高開銷的矩陣乘法，只需從 **RAM 做靜態查表 (Static Lookup)**。這正是 Gemma 4 命名中 **`E` (Effective)** 的真正含義（用 2B 的算力消耗，跑出 5B 規模的知識容量）。

---

## 比喻：閉卷考試 vs. 開卷提示卡

* **傳統 Standard Transformer ➔ 閉卷考試 (Closed-Book Exam)**
  * 學生在進入考場時**只看一眼題目**（第 0 層 Embedding 查表）。
  * 後續所有推導（Layer 1 到 Layer L）完全不能再看參考資料，只能靠心算與中途記憶硬算。
  * **痛點**：小模型（如 2B）就像大腦容量不夠的學生，推導到後面容易丟失原始細節。

* **PLE Transformer ➔ 帶提示卡的開卷考試 (Open-Book Exam with Step-by-Step Tips)**
  * 學生在做每一步推導時（Layer 1 到 Layer L），身邊都有一本**各步驟提示大補帖（RAM 中的 PLE Tables）**。
  * 做第 1 步時翻第 1 頁查提示，做第 2 步時翻第 2 頁查提示。
  * **優勢**：學生（晶片/算力）不用死記硬背所有細節，只需發揮基本計算能力，因為每一層都有現成提示可以**位址直取 ($O(1)$ RAM Lookup)**！

---

## 🔑 核心重點 1：`gemma4:e2b` 的 `E` 代表 Effective（有效算力）

傳統大模型中，參數量直接等於計算量。但在 PLE 架構下，參數被分為兩種：

1. **Active Compute / FLOPs（動態矩陣運算）**：Self-Attention 與 FFN 矩陣乘法，消耗 GPU/NPU 算力。
2. **Memory Lookup / RAM（靜態記憶體查表）**：PLE 向量提取，僅消耗 DRAM/VRAM 頻寬，**算力開銷幾乎為 0**。

| 模型標籤 | 有效動態算力 (**Effective Compute**) | 總記憶體佔用 (**Total Parameters**) | 關鍵意義 |
| :--- | :--- | :--- | :--- |
| **`gemma4:e2b`** | **~2.3B** (FLOPs) | **~5.1B** (RAM) | **僅需 2B 的晶片算力負擔，即享有 5B 規模的表達容量** |
| **`gemma4:e4b`** | **~4.0B** (FLOPs) | **~8.0B+** (RAM) | **以 4B 算力預算達到 8B 級別的模型能力** |

---

## 🔑 核心重點 2：訓練與推理的核心分工 (Training vs. Inference)

PLE 的核心設計哲學在於**訓練時算好、推理時直取**：

```
【訓練階段 (Training)】
Token ID ──► 端到端反向傳播 (Backprop) ──► 自動學習並優化各層 PLE 靜態權重表 (E_ple)

【推理階段 (Inference)】
Token ID ──► DRAM/VRAM 靜態查表 O(1) ──► 取得小維度向量 ──► 門控殘差注入隱藏層
            (無須矩陣乘法！直接位址讀取)
```

1. **訓練階段 (Training Phase)**：
   * 各層的 PLE Table ($E_{ple}^{(l)}$) 是獨立學習的靜態權重矩陣。
   * 透過梯度下降，讓第 1 層學會語法特徵、中層學語意關係、深層學高階邏輯。
2. **推理階段 (Inference Phase)**：
   * **完全不需要矩陣乘法**來生成 Token 的層級特徵。
   * 處理器僅需利用 Token ID 做**記憶體陣列索引（Gather Operation）**，直接從 RAM/VRAM 抓取 $E_{ple}^{(l)}[\text{token\_id}]$。
   * 節省下來的算力 (FLOPs) 專心留給 Self-Attention 處理動態上下文。

---

## 📐 運作機制與下一個 Token 決策鏈

當模型要預測下一個 Token 時（以輸入 Token $x_t$ 進入第 $l$ 層為例）：

```
[ 上一個 Token ID ]
       │
       ├─► 每一層 PLE 靜態查表 (RAM Lookup O(1))
       │      └─► e_t^{(l)} = Lookup(E_ple^{(l)}, x_t)
       │
       └─► 結合 Self-Attention 動態上下文
              └─► h_t^{(l)} = TransformerLayer(h_t^{(l-1)}) + g_t^{(l)} ⊙ Proj(e_t^{(l)})
                                       │
                                       ▼
                              [ 最終隱藏向量 h_final ]
                                       │
                                       ▼
                              [ Unembedding (W_vocab) ] ──► Logits
                                       │
                                       ▼
                              [ Softmax 機率分佈 ] ──► 決策下一個 Token
```

---

## ⚡ 為什麼這對端側 AI (Edge AI) 至關重要？

在手機、單板電腦 (Raspberry Pi) 或筆電 NPU 上，**算力 (FLOPs) 是最昂貴且易發熱的資源，但 RAM 記憶體空間相對寬裕**。

* **傳統做法**：為了省算力縮小模型到 2B，導致模型語義消歧能力大幅下降。
* **PLE 做法**：保持算力負擔在 2B (**`e2b`**)，把額外的語義資訊以 PLE 靜態表形式存放在 RAM 中，用 **DRAM 讀取頻寬替代 ALU 矩陣乘法**。

---

## 📌 總結

> **Per-Layer Embeddings (PLE)** 的核心邏輯就是：  
> **「訓練時把各層的 Token 特徵算好存成表，推理時用 RAM 位址直取 ($O(1)$ 查表) 替代昂貴的矩陣乘法，從而在 `E` (Effective) 低算力預算下取得大模型的實體容量。」**