<h2>Basic</h2>
<p>Table 2-6 from textbook</p>

<table border="1" cellpadding="5" cellspacing="0">
  <thead>
    <tr>
      <th>時間函數 (Time Function)</th>
      <th>轉換函數 (Transform Function)</th>
      <th>時間函數 (Time Function)</th>
      <th>轉換函數 (Transform Function)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\(\delta(t)\)</td>
      <td>\(1\)</td>
      <td>\(\sin \omega t\)</td>
      <td>\(\frac{\omega}{s^2 + \omega^2}\)</td>
    </tr>
    <tr>
      <td>\(1\)</td>
      <td>\(\frac{1}{s}\)</td>
      <td>\(\cos \omega t\)</td>
      <td>\(\frac{s}{s^2 + \omega^2}\)</td>
    </tr>
    <tr>
      <td>\(t^n\)</td>
      <td>\(\frac{n!}{s^{n+1}}\)</td>
      <td>\(e^{at} \sin \omega t\)</td>
      <td>\(\frac{\omega}{(s-a)^2 + \omega^2}\)</td>
    </tr>
    <tr>
      <td>\(e^{at}\)</td>
      <td>\(\frac{1}{s-a}\)</td>
      <td>\(e^{at} \cos \omega t\)</td>
      <td>\(\frac{s-a}{(s-a)^2 + \omega^2}\)</td>
    </tr>
  </tbody>
</table>

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
