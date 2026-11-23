# 投影片技術主張、Wiki 與原文對照

此表記錄第二輪生成前核對的教學主張。每筆來源 ID 連至 Wiki 來源摘要，摘要頁可開啟原文。最後一頁是導覽與延伸閱讀。

| 投影片 | 技術主張或引用用途 | Wiki 概念頁 | 來源 ID 與原文定位 |
| --- | --- | --- | --- |
| [第 1 頁](../slides/blue-dot.html#page-1) | 藍點是手機位置的估計。手機定位服務可能融合 GPS 與 Wi-Fi。 | [手機的藍點從哪裡來](../wiki/topics/blue-dot.md) | [GNSS-06](../wiki/sources/GNSS-06.md) Simple, battery-efficient location API for Android；[GNSS-07](../wiki/sources/GNSS-07.md) Understand what the blue dot means |
| [第 1 頁](../slides/blue-dot.html#page-1) | 先把導航電文整理成星曆和鐘差參數，再用測距碼估計虛擬距離。 | [手機的藍點從哪裡來](../wiki/topics/blue-dot.md) | [GNSS-01](../wiki/sources/GNSS-01.md) 開頭第 2 段；[GNSS-02](../wiki/sources/GNSS-02.md) $t_k$ 及發射時刻定義；[GNSS-03](../wiki/sources/GNSS-03.md) Pseudorange 第一、二式；[GNSS-11](../wiki/sources/GNSS-11.md) Finding and tracking satellites |
| [第 1 頁](../slides/blue-dot.html#page-1) | 用多顆衛星的觀測解位置和鐘差，位置轉成地圖上的點。四步是教學資料流，接收機持續追蹤。 | [手機的藍點從哪裡來](../wiki/topics/blue-dot.md) | [GNSS-04](../wiki/sources/GNSS-04.md) 開頭及式 (1)–(6)；[GNSS-05](../wiki/sources/GNSS-05.md) From Cartesian to Ellipsoidal coordinates；[GNSS-07](../wiki/sources/GNSS-07.md) Understand what the blue dot means；[GNSS-11](../wiki/sources/GNSS-11.md) Overview 與追蹤迴路 |
| [第 1 頁](../slides/blue-dot.html#page-1) | 顯示時以經緯度換算畫面位置。 | [ECEF、經緯度與地圖](../wiki/topics/ecef-map.md) | [GNSS-12](../wiki/sources/GNSS-12.md) World coordinates 與 Pixel coordinates |
| [第 2 頁](../slides/blue-dot.html#page-2) | 導航電文含星曆和衛星鐘參數。用有效星曆及發射時刻算衛星位置。 | [導航電文與廣播星曆](../wiki/topics/navigation-message.md) | [GNSS-01](../wiki/sources/GNSS-01.md) 開頭第 2–3 段；[GNSS-02](../wiki/sources/GNSS-02.md) Table 1 與 $t_k$；[GNSS-13](../wiki/sources/GNSS-13.md) 表 20-IV 印刷頁 106–107 |
| [第 3 頁](../slides/blue-dot.html#page-3) | 測距碼對齊提供時間差資訊。P 用兩端時刻差乘光速，含鐘差、傳播及反射等項。 | [測距碼與虛擬距離](../wiki/topics/pseudorange.md) | [GNSS-11](../wiki/sources/GNSS-11.md) Finding and tracking satellites；[GNSS-03](../wiki/sources/GNSS-03.md) Pseudorange 公式及其變數說明 |
| [第 4 頁](../slides/blue-dot.html#page-4) | 理想化二維模型以 $P_i=\rho_i+c\,\delta t_r$ 表示，正的接收機鐘差等量增加各半徑。 | [二維測距圓與共用鐘差](../wiki/topics/clock-geometry.md) | [GNSS-03](../wiki/sources/GNSS-03.md) Pseudorange 觀測式；[GNSS-04](../wiki/sources/GNSS-04.md) 式 (1) 共用接收機鐘差 |
| [第 5 頁](../slides/blue-dot.html#page-5) | 同一單系統時刻，每顆衛星提供一個碼距離觀測。解算四個未知數至少需要四顆衛星及足夠的觀測幾何。更多觀測可用來估計同樣的四個量。 | [單點定位與四個未知數](../wiki/topics/single-point.md) | [GNSS-04](../wiki/sources/GNSS-04.md) 開頭、式 (1)–(6) 與設計矩陣 |
| [第 6 頁](../slides/blue-dot.html#page-6) | ECEF 的 X、Y、Z 可依相容參考橢球轉成緯度、經度、橢球高，經緯度可投影到地圖像素。 | [ECEF、經緯度與地圖](../wiki/topics/ecef-map.md) | [GNSS-05](../wiki/sources/GNSS-05.md) From Cartesian to Ellipsoidal coordinates；[GNSS-12](../wiki/sources/GNSS-12.md) World coordinates、Pixel coordinates |
| [第 6 頁](../slides/blue-dot.html#page-6) | 位置服務可以提供融合後的位置估計，地圖用藍點表示。 | [手機的藍點從哪裡來](../wiki/topics/blue-dot.md) | [GNSS-06](../wiki/sources/GNSS-06.md) Simple, battery-efficient location API for Android；[GNSS-07](../wiki/sources/GNSS-07.md) Understand what the blue dot means |
| [第 7 頁](../slides/blue-dot.html#page-7) | 遮蔽使訊號不可用，反射可能改變碼觀測。橘色線和位移只是教學示意。 | [高樓遮蔽、多路徑與電離層](../wiki/topics/position-errors.md) | [GNSS-03](../wiki/sources/GNSS-03.md) Pseudorange 的多路徑項；[GNSS-08](../wiki/sources/GNSS-08.md) Why does GPS sometimes show me in the wrong place? |
| [第 7 頁](../slides/blue-dot.html#page-7) | 手機定位服務也可能融合其他訊號，單看藍點無法識別誤差來源。 | [手機的藍點從哪裡來](../wiki/topics/blue-dot.md) | [GNSS-06](../wiki/sources/GNSS-06.md) 底層 GPS、Wi-Fi 與多感測來源；[GNSS-07](../wiki/sources/GNSS-07.md) 藍點的不確定性說明 |
| [第 8 頁](../slides/blue-dot.html#page-8) | 第一題的答案與回饋以廣播星曆和發射時刻計算衛星位置為依據。 | [導航電文與廣播星曆](../wiki/topics/navigation-message.md) | [GNSS-01](../wiki/sources/GNSS-01.md) 開頭第 2 段；[GNSS-13](../wiki/sources/GNSS-13.md) 表 20-IV 第 1–2 頁 |
| [第 8 頁](../slides/blue-dot.html#page-8) | 第二題的答案與回饋以三個坐標及共用接收機鐘差為依據。 | [單點定位與四個未知數](../wiki/topics/single-point.md) | [GNSS-04](../wiki/sources/GNSS-04.md) 開頭及式 (1) |
| [第 9 頁](../slides/blue-dot.html#page-9) | 延伸入口導至同衛星、同碼、對齊觀測的站間一次差。 | [地面一次差（跨接收機）](../wiki/topics/between-receiver.md) | [GNSS-09](../wiki/sources/GNSS-09.md) §2.1 第 4 段；[GNSS-10](../wiki/sources/GNSS-10.md) §2.4，式 (2.15) 與圖 2.4 |
