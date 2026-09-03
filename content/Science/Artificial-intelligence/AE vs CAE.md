---
title: AE vs CAE
aliases:
  - Convolution auto-encoder
tags:
  - AI
  - auto-encoder
  - convolution
level: 1
link: "[[Auto encoder|AE]]"
note:
published: true
---


**CAE 就是在自編碼器 (AE) 的結構中，將卷積層插入並進行特徵提取工作**

*   **AE (auto-encoder)：** 負責學習數據的**整體結構**和**壓縮/解壓縮**的過程。
*   **CAE (convolution auto-encoder)：** 負責學習**圖像特有的、空間上的細節特徵**（例如，圖片中的輪廓、顏色塊、紋理等），用這些特徵來重建圖像。

> **CAE = AE + CNN **。

## Reference 
https://www.sciencedirect.com/topics/computer-science/convolutional-auto-encoder