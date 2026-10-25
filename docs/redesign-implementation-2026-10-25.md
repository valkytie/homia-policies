# 嚮家官網重設計執行計畫

使用者於2026-10-25核准「按照建議執行」，承接redesign-spec-2026-10-25.md及同日審查。此文件為已核准方向的執行補充，衝突時以本文件為準。

**Goal:** 保留設計者原文與完整下載流程，以字體、閱讀節奏及真實產品畫面減少模板感。

**Architecture:** 保留純HTML／CSS、Node建置及Cloudflare資產架構。只在test開發並push，不合併main、不部署；完成可檢查的本機產物。不要新增第三方網頁請求或JS依賴。

**Tech Stack:** HTML、CSS、Node24、內建node:test；字型由官方Noto Serif TC Medium子集化為自架WOFF2。

## 核准修正

- 標題用宋體，正文黑體；去黑底icon及裝飾編號，只保留Android真正的六步。
- 初衷改窄欄家書，六段原文逐字保留；日期只留一次，署名「嚮家的設計者」。
- Watch獨立深綠區塊並使用h2／步驟h3；保留原說明與通知限制，不擴張功能宣稱。
- Hero維持有邊界的拱形插畫（依target圖），不強制出血到視窗邊緣。避免把6px圓角與完全沒有hover視為去AI的必要條件；刪除多餘箭頭位移，保留顏色／底線回饋。
- 至少一張真實產品圖提前至日常區：使用mama-helper/docs/release/play-assets/android-2026-10-19/phone-home-zh-TW.jpg原檔副本，虛構審查資料，完整不修改像素。未找到可公開任務／Watch支援截圖時不補造。
- 手機16px正文、左右至少20px；390px每行約22字是合理結果，不追求28–34字而縮字。
- 不加紙紋、手寫圖、動態或colophon裝飾。Hero可採已建議的重複詞刪減，FAQ標題用「關於下載與使用，先看這裡。」；原六段故事及七題FAQ答案不改。
- 原四份政策Markdown、全部正式網址、legacy轉址、下載QR、無JS可讀／焦點／觸控／減少動態保留。

## 執行與檢查

- [ ] Task 1：先修測試漏洞。讓含屬性的body擷取失敗時明確報錯，測試先RED再GREEN；加入故事與政策相對b87489c的固定內容保護。
- [ ] Task 2：依規格Phase1與上述修正完成tokens、宋體、自架授權與維護工具、裝飾減量；npm test與build後獨立審查。
- [ ] Task 3：依Phase2完成家書、Watch、FAQ與版面；提早加入真實Android首頁及來源文件。前兩階段逐次commit，可獨立回滾。
- [ ] Task 4：核對正式Wrangler本機首頁、四政策、404、所有資產、QR、字型覆蓋與政策無字型下載；有可用IAB時驗1440／768／390及全部指定斷點、鍵盤、FAQ、字型與網路請求；無可用surface時明列缺證據，不改用其他瀏覽器。
- [ ] Task 5：獨立規格及程式審查；完整Flutter test／analyze／format（App只改QA文件）、網站test／build／diff gate；更新QA矩陣與知識筆記、commit／pull rebase／push test，保留原SwiftPM私人修改。

本輪QA矩陣位於mama-helper/docs/qa/website-redesign-2026-10-25.md。自動測試與靜態結構檢查不等於目視或實機驗收；正式站保持舊版，部署仍需擁有者另行決定。
