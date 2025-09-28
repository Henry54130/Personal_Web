## Basic
Table 2-6 from textbook

| 時間函數 (Time Function) | 轉換函數 (Transform Function) | 時間函數 (Time Function) | 轉換函數 (Transform Function) |
| :---: | :---: | :---: | :---: |
| $\delta(t)$ | $1$ | $\sin \omega t$ | $\frac{\omega}{s^2 + \omega^2}$ |
| $1$ | $\frac{1}{s}$ | $\cos \omega t$ | $\frac{s}{s^2 + \omega^2}$ |
| $t^n$ | $\frac{n!}{s^{n+1}}$ | $e^{at} \sin \omega t$ | $\frac{\omega}{(s-a)^2 + \omega^2}$ |
| $e^{at}$ | $\frac{1}{s-a}$ | $e^{at} \cos \omega t$ | $\frac{s-a}{(s-a)^2 + \omega^2}$ |

<hr>

<h2>微分轉換</h2>
<p>已知</p>
<p>
$$
F(s) = \mathcal{L}\{f(t)\} = \int_0^\infty f(t)e^{-st}\,dt
$$
</p>

<hr>

<h3>n 階導數的拉氏轉換</h3>
<p>
$$
\mathcal{L}\{f^{(n)}(t)\} 
= s^n F(s) 
- s^{n-1} f(0^+) 
- s^{n-2} f'(0^+) 
- \cdots 
- f^{(n-1)}(0^+)
$$
</p>

<hr>

<h3>例</h3>
<p><strong>一階導數</strong></p>
<p>
$$
\mathcal{L}\{f'(t)\} = sF(s) - f(0^+)
$$
</p>

<p><strong>二階導數</strong></p>
<p>
$$
\mathcal{L}\{f''(t)\} = s^2F(s) - s f(0^+) - f'(0^+)
$$
</p>
