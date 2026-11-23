# GNSS 衛星定位原理

這份 Wiki 給第一次接觸衛星定位測量的大學生。以 GPS 為例，跟著訊號走一遍，理解手機定位點如何出現在地圖上。

[開始教學簡報](../slides/blue-dot.html) · [教學主張與來源](../reports/claims.md) · [來源清冊](../raw/catalog.md)

## 本課概念

- [導航電文與廣播星曆](topics/navigation-message.md)
- [測距碼與虛擬距離](topics/pseudorange.md)
- [二維測距圓與共用鐘差](topics/clock-geometry.md)
- [單點定位與四個未知數](topics/single-point.md)
- [ECEF、經緯度與地圖](topics/ecef-map.md)
- [手機的藍點從哪裡來](topics/blue-dot.md)
- [高樓遮蔽、多路徑與電離層](topics/position-errors.md)
- [地面一次差（跨接收機）](topics/between-receiver.md)

## 本課來源摘要

- [GNSS-01 GPS Navigation Message](sources/GNSS-01.md)
- [GNSS-02 GPS and Galileo Satellite Coordinates Computation](sources/GNSS-02.md)
- [GNSS-03 GNSS Basic Observables](sources/GNSS-03.md)
- [GNSS-04 Code Based Positioning (SPS)](sources/GNSS-04.md)
- [GNSS-05 Ellipsoidal and Cartesian Coordinates Conversion](sources/GNSS-05.md)
- [GNSS-06 Fused Location Provider API](sources/GNSS-06.md)
- [GNSS-07 Find & improve your location’s accuracy in Google Maps](sources/GNSS-07.md)
- [GNSS-08 GPS Accuracy](sources/GNSS-08.md)
- [GNSS-09 GAMIT/GLOBK 2.1 Phase and Pseudorange Observations](sources/GNSS-09.md)
- [GNSS-10 Precise GPS Positioning in the Marine Environment](sources/GNSS-10.md)
- [GNSS-11 GNSS Receivers General Introduction](sources/GNSS-11.md)
- [GNSS-12 Map and Tile Coordinates](sources/GNSS-12.md)
- [GNSS-13 IS-GPS-200N](sources/GNSS-13.md)

## 既有 RTK／PPK 入門教材

第一次接觸衛星定位，建議先讀 [GNSS](topics/gnss.md)，再用 [RTK 和 PPK 怎麼選？](topics/rtk-vs-ppk.md) 練習。也可以從[第一份 HTML 教學簡報](../slides/gnss-rtk-ppk.html)開始。

### 入門詞條

- [GNSS（全球導航衛星系統）](topics/gnss.md) · 提供定位、導航和授時的衛星系統總稱。
- [基準站與移動站](topics/base-and-rover.md) · 一端提供參考，另一端在待測位置蒐集資料。
- [改正資料與原始觀測](topics/corrections.md) · 前者用於改善解算，後者是儀器從衛星訊號量得的資料。
- [RTK（即時動態定位）](topics/rtk.md) · 測量時取得參考資料，在現場解算位置。
- [PPK（後處理動態定位）](topics/ppk.md) · 先記錄觀測，再用同時段的參考資料計算位置。
- [台灣 e-GNSS](topics/e-gnss.md) · 國土測繪中心提供的衛星定位服務，可作為網路 RTK 的台灣例子。
- [RTK 和 PPK 怎麼選？](topics/rtk-vs-ppk.md) · 先確認現場是否需要坐標，再檢查即時連線與可保留的觀測資料。

### 來源

- [Karpathy — LLM Wiki](sources/karpathy-llm-wiki.md) · 三層架構，以及納入、查詢、品質檢查的分工。
- [GPS.gov — GPS 與其他 GNSS](sources/gps-gov-gnss.md) · GNSS 的範圍，以及 GPS、Galileo、北斗和 GLONASS 的例子。
- [GPS.gov — GPS](sources/gps-gov-gps.md) · 衛星廣播位置與時間資訊，接收機用這些訊號計算位置與時間。
- [Trimble Access — GNSS surveys](sources/trimble-gnss-surveys.md) · 用設備原廠的說明對照 RTK 資料傳輸、PPK 原始觀測及混合工作流程。設備操作僅適用於文件標明的產品版本。
- [Trimble Access — To start a postprocessed rover survey](sources/trimble-ppk-rover.md) · 補充 PPK 的外業設定與初始化條件。網頁路徑為 latest，引用產品操作時需重新核對版本。
- [國土測繪中心 — e-GNSS 即時動態定位系統](sources/nlsc-egnss.md) · 官方入口介紹。服務申請與最新資訊請回查官方中文入口。
- [國土測繪中心 — e-GNSS 服務供應要點](sources/nlsc-egnss-service.md) · 以明列的虛擬基準站觀測資料回傳流程說明台灣案例。現行服務細節請回查官方公告。

[Wiki 維護規則](../AGENTS.md)
