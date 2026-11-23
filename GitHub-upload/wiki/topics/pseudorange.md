# 測距碼與虛擬距離

接收機在收到衛星訊號後，把其中的測距碼與本機產生的副本對齊。碼的偏移提供時間差資訊。接收機用自己時鐘的接收時刻減去衛星時鐘的發射時刻，得到觀測時間差 $\Delta t$，再乘上真空光速 $c$，得到碼虛擬距離 $P$。時間差用秒表示，虛擬距離用公尺表示。[GNSS-03](../sources/GNSS-03.md) [GNSS-11](../sources/GNSS-11.md)

$$
P = c\,\Delta t
$$

教學模型加入時鐘與傳播效應：

$$
P = \rho + c(\delta t_r - \delta t_s) + I + T + \varepsilon
$$

$\rho$ 是幾何距離，$\delta t_r$ 與 $\delta t_s$ 是兩端時鐘讀值相對 GPS 時標的秒差，$I$、$T$ 分別是電離層與對流層碼延遲。這裡用 $\varepsilon$ 合併儀器延遲、反射與雜訊等其他項，並以公尺表示。正的 $\delta t_r$ 讓同一時刻的 $P$ 增大。[GNSS-03](../sources/GNSS-03.md) [GNSS-04](../sources/GNSS-04.md)

用[二維圓](clock-geometry.md)看偏移，或接著看[三維單點定位](single-point.md)。[差分示例](between-receiver.md)沿用同一個符號。

[返回 Wiki 索引](../index.md)
