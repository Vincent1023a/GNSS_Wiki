# ECEF、經緯度與地圖

ECEF 是 Earth-Centered, Earth-Fixed，也就是以地球中心為原點、與地球一起轉的直角坐標系統。同一個定位結果可從 $(X,Y,Z)$ 改用參考橢球上的大地緯度 $\varphi$、經度 $\lambda$ 和橢球高 $h$ 表示。GPS 規格的廣播星曆給出 WGS 84 地固框架中的衛星位置。[GNSS-05](../sources/GNSS-05.md) [GNSS-13](../sources/GNSS-13.md)

在一般情況，可從 $X$、$Y$ 的方向用 $\lambda=\operatorname{atan2}(Y,X)$ 求經度，並配合相容的參考橢球求大地緯度和橢球高。換表示法時，幾何上的點維持相同。在地圖顯示階段，可將經緯度投影為地圖坐標，再依縮放與視窗決定畫面位置。[GNSS-05](../sources/GNSS-05.md) [GNSS-07](../sources/GNSS-07.md) [GNSS-12](../sources/GNSS-12.md)

這是從 GNSS 解算結果到畫面的一條資料路徑。實際傳給應用程式的位置可能由[手機定位服務](blue-dot.md)融合多種來源。

[返回 Wiki 索引](../index.md)
