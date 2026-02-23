---
date created: 2026-01-25 03-49-48
date modified: 2026-02-22 06-11-06
published: false
---
## 1️⃣ Sigmoid 函數定義

$$
\sigma(x) = \frac{1}{1 + e^{-x}}
$$

## 2️⃣ 求導

我們要求：

$$
\frac{d}{dx} \sigma(x)
$$

使用鏈式法則：

$$
\sigma(x) = (1 + e^{-x})^{-1}
$$

$$
\frac{d}{dx} \sigma(x) = -1 \cdot (1 + e^{-x})^{-2} \cdot \frac{d}{dx}(1 + e^{-x})
$$

$$
\frac{d}{dx}(1 + e^{-x}) = -e^{-x}
$$

所以：

$$
\frac{d}{dx} \sigma(x) = - (1 + e^{-x})^{-2} \cdot (-e^{-x}) = \frac{e^{-x}}{(1 + e^{-x})^2}
$$

## 3️⃣ 化簡成 Sigmoid 本身的形式

注意：

$$
\sigma(x) = \frac{1}{1 + e^{-x}} \quad \Rightarrow \quad 1 - \sigma(x) = \frac{e^{-x}}{1 + e^{-x}}
$$

所以：

$$
\frac{d}{dx} \sigma(x) = \frac{1}{1 + e^{-x}} \cdot \frac{e^{-x}}{1 + e^{-x}} = \sigma(x) \big( 1 - \sigma(x) \big)
$$

## ✅ 結論

$$
\sigma'(x) = \sigma(x)(1 - \sigma(x))
$$
