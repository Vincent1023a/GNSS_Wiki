# 導航電文與廣播星曆

GPS 衛星把導航電文和測距碼等資訊一起承載在無線電訊號上。導航電文包含**廣播星曆**，也就是帶有參考時刻與有效期間的一組軌道參數。電文另有衛星鐘差修正參數。接收機把星曆和估計的**發射時刻**代入軌道計算，得到衛星位置。以 LNAV 為例，規格表 20-IV 的 $t$ 是發射時刻的 GPS 系統時間，$t_{\mathrm{oe}}$ 是星曆參考時刻。[GNSS-01](../sources/GNSS-01.md) [GNSS-02](../sources/GNSS-02.md) [GNSS-11](../sources/GNSS-11.md) [GNSS-13](../sources/GNSS-13.md)

廣播星曆描述單顆衛星的軌道，曆書則用較粗略的資訊幫助搜尋整個星系的衛星。衛星鐘的修正和接收機自己的鐘差是兩件事。後者仍要用多顆衛星的觀測一起解。[GNSS-01](../sources/GNSS-01.md) [GNSS-04](../sources/GNSS-04.md)

接著看[測距碼與虛擬距離](pseudorange.md)和[單點定位](single-point.md)。

[返回 Wiki 索引](../index.md)
