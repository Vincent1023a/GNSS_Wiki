# PPK（後處理動態定位）

先記錄觀測，再用同時段的參考資料計算位置。

PPK 是 Post-Processed Kinematic。常見流程是在外業記錄移動站的原始衛星觀測，作業後取得相同時段且相容的基準站觀測，再用軟體一起解算停點或連續路徑的坐標。

例如山區道路沿線的行動網路不穩，工作只需要事後交付已量測的點位。若有適合的衛星觀測條件，且能保存移動站資料、取得相容的參考觀測，就可以評估 PPK。外業可在沒有即時改正資料連線的情況下記錄觀測。回去後才能取得這套流程的解算成果，收工前要確認所需資料有記錄，以降低補測風險。

延伸閱讀見[基準站與移動站](base-and-rover.md)、[改正資料與原始觀測](corrections.md)和 [RTK／PPK 比較](rtk-vs-ppk.md)。

## 來源

- [Trimble Access — GNSS surveys](../sources/trimble-gnss-surveys.md)
- [Trimble Access — To start a postprocessed rover survey](../sources/trimble-ppk-rover.md)

[返回索引](../index.md)
