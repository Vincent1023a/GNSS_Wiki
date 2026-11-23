# GNSS 衛星定位原理

## 合併兩個 ZIP

把 LLM Wiki 與 HTML 簡報兩個 ZIP 的內容解壓到同一個 repository 根目錄，保留各自的資料夾路徑。兩包合併後，可直接開啟 `dist/index.html` 預覽。用 Git 上傳時，`dist/` 由 GitHub Actions 重新建置。若用 GitHub 網頁上傳，請保留 `.github/workflows/pages.yml` 和所有原始檔，並略過本機預覽用的 `dist/`。

## 本機建置

使用 Node.js 22 或更新版本，執行 `npm ci`、`npm run check` 和 `npm run build`。輸出至 `dist/`，可直接用瀏覽器開啟其中的 `index.html`。執行 `npm run preview` 可用 http://127.0.0.1:4173/gnss-course/ 預覽專案子路徑。

建置後執行 `npm run test:browser` 可重跑瀏覽器驗證。Windows 預設使用 Microsoft Edge，也可用 `GNSS_BROWSER` 指定支援 Chromium DevTools 的瀏覽器執行檔。

- `raw/` 存來源清冊、書目與原始 GPS 規格。
- `wiki/` 是可維護的 Markdown 原稿。建置會轉成同名 HTML 並改寫 Markdown 相對路徑。
- `course/` 保存正式投影片內容與生成前的審查資料。
- `reports/claims.md` 是投影片、Wiki 與原文的對照。
- `site/` 與 `scripts/` 提供靜態樣式、互動、產生器與驗證。

數學公式以 LaTeX 撰寫，建置時由 KaTeX 排版。輸出包含本機字型，可離線閱讀。

維護課程內容時，依 `AGENTS.md` 核對 Wiki 原文和引用，更新 `course/review-input.json` 後執行 `node scripts/review.mjs --record` 重新留存審查。建置會檢查最新詞條與講稿是否吻合已審版本。此機械檢查應搭配人工逐項讀原文。

## GitHub Pages

專案的 GitHub Actions 工作流程已備妥。將原始檔推至指定的 GitHub repository，在 Settings → Pages 選擇 GitHub Actions 作為來源，再執行 `Publish GNSS course to Pages`。流程也會在推至 repository 的預設分支時執行。使用 workflow 回報的 Pages URL 開啟首頁、簡報及投影片到原文的路徑。[GitHub Pages 自訂工作流程文件](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
