# 地面一次差（跨接收機）

令兩台地面接收機 $A$、$B$ 在對齊的觀測時刻追蹤同一顆衛星 $s$ 的同一碼訊號。依[碼虛擬距離模型](pseudorange.md)，用固定順序 $B-A$ 相減。[GNSS-03](../sources/GNSS-03.md) [GNSS-09](../sources/GNSS-09.md) [GNSS-10](../sources/GNSS-10.md)

$$
\begin{aligned}
P_A &= \rho_A + c(\delta t_A-\delta t_s) \\
    &\quad + I_A + T_A + \varepsilon_A \\
P_B &= \rho_B + c(\delta t_B-\delta t_s) \\
    &\quad + I_B + T_B + \varepsilon_B \\
\Delta P &= P_B-P_A \\
    &= (\rho_B-\rho_A) + c(\delta t_B-\delta t_A) \\
    &\quad + (I_B-I_A) + (T_B-T_A) \\
    &\quad + (\varepsilon_B-\varepsilon_A)
\end{aligned}
$$

模型使用相同的衛星鐘項，故在相減後抵消。實際接收時刻要對齊，並在有必要時處理不同發射時刻對衛星鐘模型的影響。同訊號的共用衛星硬體項也可在適用的模型假設下抵消。兩台接收機相近且傳播路徑的誤差高度相關時，大氣項與軌道誤差通常減弱。接收機相對鐘差、地點各異的多路徑和接收機雜訊仍可能存在。幾何距離差仍是有用的資訊。[GNSS-03](../sources/GNSS-03.md) [GNSS-09](../sources/GNSS-09.md) [GNSS-10](../sources/GNSS-10.md)

以人造數值示範，$A$ 的幾何距離為 20,000,000 公尺，接收機鐘項為 $+60\,\mathrm{m}$。$B$ 的幾何距離為 20,000,004 公尺，接收機鐘項為 $+63\,\mathrm{m}$。兩者都含相同的衛星鐘貢獻 $-20\,\mathrm{m}$。先略去其他項，得到：

$$
\begin{aligned}
P_A &= 20{,}000{,}040\,\mathrm{m} \\
P_B &= 20{,}000{,}047\,\mathrm{m} \\
\Delta P &= 4\,\mathrm{m}+3\,\mathrm{m}=7\,\mathrm{m}
\end{aligned}
$$

兩筆觀測的差由 4 公尺的幾何距離差與 3 公尺的相對接收機鐘項組成。[GNSS-03](../sources/GNSS-03.md) [GNSS-10](../sources/GNSS-10.md)

延伸可讀[基準站與移動站](base-and-rover.md)、[RTK 與 PPK 比較](rtk-vs-ppk.md)。

[返回 Wiki 索引](../index.md)
