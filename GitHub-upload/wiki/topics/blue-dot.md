# 手機的藍點從哪裡來

以 Android 上的 Google 地圖為例，藍點代表應用程式取得的位置估計。Android 的手機定位服務可以結合 GPS、Wi-Fi 等來源。產品文件支持這種融合能力，但沒有公開每次藍點更新的來源比例。[GNSS-06](../sources/GNSS-06.md) [GNSS-07](../sources/GNSS-07.md)

以 GPS 說明一條資料路徑：讀取[導航電文](navigation-message.md)，取得衛星位置所需資料。用[測距碼](pseudorange.md)估計每顆衛星的虛擬距離。用多筆觀測[解三維坐標及接收機鐘差](single-point.md)，再將解算出的地固位置[轉成經緯度](ecef-map.md)送入地圖顯示。四步是教學順序，接收機實際會持續追蹤與處理訊號。[GNSS-01](../sources/GNSS-01.md) [GNSS-02](../sources/GNSS-02.md) [GNSS-03](../sources/GNSS-03.md) [GNSS-04](../sources/GNSS-04.md) [GNSS-05](../sources/GNSS-05.md) [GNSS-07](../sources/GNSS-07.md) [GNSS-11](../sources/GNSS-11.md)

Google 地圖用淡藍圈傳達不確定性。課程橘色標示是誤差或受影響訊號的教學圖例，不代表裝置的實測誤差。也可讀[街道定位誤差](position-errors.md)。[GNSS-07](../sources/GNSS-07.md)

[返回 Wiki 索引](../index.md)
