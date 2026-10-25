# Homia / 嚮家 Public Support Pages

Public bilingual (English / 繁體中文) support pages for the Homia / 嚮家 app.

- **[嚮家介紹與下載](https://homia-official-site.valkytie.workers.dev/)** — 設計初衷、App Store QR 碼與 Android 封閉測試中文加入教學。
- **[Report a bug / 回報問題](report-a-bug.html)** — Android／iOS 問題回報、選填截圖與 Email 備用管道。
- [Privacy Policy / 隱私權政策](privacy-policy.html)
- [Support and Data Deletion / 客服與資料刪除](support-and-data-deletion.html)
- [Terms of Service / 服務條款](terms-of-service.html)

Contact: valkytie@gmail.com

## 官網部署維護

GitHub 保留網站原始碼與既有 Pages 政策入口；正式官網使用 Cloudflare Workers 純靜態資產。部署只上傳 `dist/`，不包含原始碼、設定檔或本機登入憑證。這個網站不需要 Worker 執行程式、資料庫或付費 binding。

環境：Node.js 24 以上；套件版本由 `package-lock.json` 固定。

```sh
npm ci
npm test
npm run build
npm run dev
```

`site.config.json` 的 `url` 是正式 HTTPS 網址；建置會以此產生首頁 canonical、Open Graph 與政策頁 canonical。目前使用帳號已註冊的 `valkytie.workers.dev` 下的 `homia-official-site`。四份政策 Markdown 是內容來源，建置產物不進 Git。

Cloudflare 登入由網站擁有者本人完成。若 macOS Keychain 不允許 CLI 儲存憑證，可使用 Wrangler 官方本機檔案儲存方式；憑證留在使用者設定目錄，不得複製到 repo 或 GitHub Secrets。

```sh
npm exec -- wrangler login --device --browser=false --use-keyring=false --scopes account:read user:read workers:write workers_scripts:write
npm exec -- wrangler whoami
npm exec -- wrangler deploy --dry-run
npm run deploy
```

推送 GitHub 不會自動更新 Cloudflare。每次更新都需執行測試與 `npm run deploy`，再以公開網址檢查首頁、四份政策、QR 與不存在路徑的 404。Wrangler 的標準 HTML 路由會將 `privacy-policy.html` 等入口轉向無副檔名網址，原 `.html` 連結仍可開啟。GitHub Pages 原有政策網址持續保留，既有 App／商店設定可繼續使用。

舊 GitHub Pages 首頁會以 `location.replace` 導向新官網，保留查詢與段落錨點；僅限本 repo 的首頁路徑，不影響任何政策／客服頁。停用 JavaScript 時仍可閱讀原內容，並使用頁尾的「嚮家官網」連結。Cloudflare 官網不會再轉址。
