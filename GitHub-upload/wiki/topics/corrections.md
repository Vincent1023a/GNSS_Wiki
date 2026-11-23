# 改正資料與原始觀測

前者用於改善解算，後者是儀器從衛星訊號量得的資料。

**改正資料** 在本 Wiki 的入門語境裡泛指即時定位用的參考站資料或改正訊息。實際傳送內容依技術和格式而異，例如 [e-GNSS](e-gnss.md) 的虛擬基準站服務可回傳虛擬站觀測資料。[RTK](rtk.md) 的移動站會把這類資訊和自己的觀測一起用於解算。

**原始觀測** 是接收機從訊號量得的紀錄，例如用來細量距離變化的載波相位。傳統 [PPK](ppk.md) 需要移動站有可供後處理的觀測紀錄，並取得相同時段且相容的參考資料。只匯出地圖點位或坐標表，通常無法用於這類後處理解算。

## 來源

- [Trimble Access — GNSS surveys](../sources/trimble-gnss-surveys.md)
- [Trimble Access — To start a postprocessed rover survey](../sources/trimble-ppk-rover.md)
- [國土測繪中心 — e-GNSS 服務供應要點](../sources/nlsc-egnss-service.md)

[返回索引](../index.md)
