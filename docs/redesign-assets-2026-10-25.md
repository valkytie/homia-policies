# 重設計素材來源

日期：2026-10-25。本輪只使用既有插畫、官方字型及真實產品截圖，無新增生成圖／假UI。

## Android 首頁

- 官網檔案：`assets/app-home.jpg`，1080×2344，986,512 bytes。
- SHA256：`328a52b191bfc290b9c473b91d00b902348c36eee06a08ffbe318e98b442d9b6`。
- 原始來源：mama-helper repo `docs/release/play-assets/android-2026-10-19/phone-home-zh-TW.jpg`；同目錄README記錄本人2026-10-19於vivo V2515／Android16／Play簽署1.0.0(12)手動截取，runtime `33cfd501bf81ab28d220f5d1e5feaf7714cc7b45`。
- 畫面為已恢復的虛構審查家庭；既有文件及本輪目視確認無帳號、邀請碼、QR或私人照片。系統狀態列保留原樣；畫面未包含使用者真實健康資料。
- 官網副本與原始JPEG逐byte相同，沒有裁切、縮圖重編碼、拉伸或生成替代內容。CSS完整等比例縮放，點擊可讀完整原圖；圖說標示Android版及示範資料。
- 這是首頁快覽與快速記錄畫面，未誤稱為時間軸、任務或Watch畫面。同日後續從Apple商店找到任務／獎勵公開真圖，已依下節補充；Watch支援畫面仍未新增。

## 字型

- 官方固定來源：<https://raw.githubusercontent.com/notofonts/noto-cjk/Serif2.003/Serif/SubsetOTF/TC/NotoSerifTC-Medium.otf>。
- 來源內嵌版本：`Version 2.003;hotconv 1.1.1;makeotfexe 2.6.0`。
- 原OTF SHA256：`fd3936ff7cb87be3610d63a2d961ff06bd9ee2de9c0bb5a37890400487027e0f`。
- 官方授權來源：<https://raw.githubusercontent.com/notofonts/noto-cjk/Serif2.003/Serif/LICENSE>，全文保留於`assets/fonts/OFL.txt`；來源字型內嵌copyright及授權name紀錄亦保留。
- `tools/subset-font.py`使用fontTools4.67.0與Brotli1.2.1產生WOFF2，不放整包OTF進repo。更新功能標題／截圖圖說後共284必要字元，輸出71,028bytes，低於180KiB預算。
- `tools/font-manifest.json`記錄SHA256及字集，`--check`直接開WOFF2比對cmap；Node測試另檢查首頁文案與manifest，避免新字悄悄fallback。
- `.home`限定宋體，政策頁body沒有home class且不加font preload；CSS共用但政策標題／正文用系統黑體。IAB已確認首頁字型載入、政策頁無preload且宋體未載入；LCP比較仍待驗證，不能用cmap檢查冒充。

## iPhone 任務與獎勵

2026-10-25，Apple官方Lookup `https://itunes.apple.com/lookup?id=6809411558&country=tw` 對嚮家1.0.0回傳已公開的PUB-04_tasks與PUB-05_rewards素材。使用同一Apple CDN路徑的高解析輸出；下載後逐byte複製至網站，未裁切、重編碼或生成UI。兩張均1284×2778，保留QA示範名稱並標示「App Store公開截圖，示範資料」，無帳號、邀請碼、QR或私人照片。

| 檔案 | bytes | SHA256 |
|---|---|---|
| assets/app-tasks.png | 1218818 | bb2ae66eb75e726a470bdc3c0f45bb22f736efd3566535929ba2153f7b534f9f |
| assets/app-rewards.png | 1151480 | 718c6e93bde31345eb706e05ba139c4fc4c7df71d1bc6d9e0b66c2e908d3ec1d |

- 任務：<https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a0/38/6a/a0386a76-6971-9c61-0dd0-403ec4c00605/PUB-04_tasks_zh-Hant_iPhone-sim.png/1320x2868bb.png>。
- 獎勵：<https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a6/e5/5b/a6e55b7b-9126-18d6-12d3-8fafaf38d9b6/PUB-05_rewards_zh-Hant_iPhone-sim.png/1320x2868bb.png>。

URL輸出尺寸參數不代表實際圖片尺寸，以實讀1284×2778為準。這些是商店已公開的模擬器產品截圖，不宣稱為本輪新實機捕捉。網站只請求本機assets路徑；原生details預設收合，保持手機首讀篇幅，展開後可按原圖放大。
