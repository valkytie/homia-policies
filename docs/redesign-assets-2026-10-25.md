# 重設計素材來源

日期：2026-10-25。本輪只使用既有插畫、官方字型及真實產品截圖，無新增生成圖／假UI。

## Android 首頁

- 官網檔案：`assets/app-home.jpg`，1080×2344，986,512 bytes。
- SHA256：`328a52b191bfc290b9c473b91d00b902348c36eee06a08ffbe318e98b442d9b6`。
- 原始來源：mama-helper repo `docs/release/play-assets/android-2026-10-19/phone-home-zh-TW.jpg`；同目錄README記錄本人2026-10-19於vivo V2515／Android16／Play簽署1.0.0(12)手動截取，runtime `33cfd501bf81ab28d220f5d1e5feaf7714cc7b45`。
- 畫面為已恢復的虛構審查家庭；既有文件及本輪目視確認無帳號、邀請碼、QR或私人照片。系統狀態列保留原樣；畫面未包含使用者真實健康資料。
- 官網副本與原始JPEG逐byte相同，沒有裁切、縮圖重編碼、拉伸或生成替代內容。CSS完整等比例縮放，點擊可讀完整原圖；圖說標示Android版及示範資料。
- 這是首頁快覽與快速記錄畫面，未誤稱為時間軸、任務或Watch畫面。尚無合適的任務／Watch支援可公開真圖，因此本輪不放這兩項。

## 字型

- 官方固定來源：<https://raw.githubusercontent.com/notofonts/noto-cjk/Serif2.003/Serif/SubsetOTF/TC/NotoSerifTC-Medium.otf>。
- 來源內嵌版本：`Version 2.003;hotconv 1.1.1;makeotfexe 2.6.0`。
- 原OTF SHA256：`fd3936ff7cb87be3610d63a2d961ff06bd9ee2de9c0bb5a37890400487027e0f`。
- 官方授權來源：<https://raw.githubusercontent.com/notofonts/noto-cjk/Serif2.003/Serif/LICENSE>，全文保留於`assets/fonts/OFL.txt`；來源字型內嵌copyright及授權name紀錄亦保留。
- `tools/subset-font.py`使用fontTools4.67.0與Brotli1.2.1產生WOFF2，不放整包OTF進repo。只取首頁指定標題／信件標籤／圖說字元及ASCII標點，共282必要字元，輸出69,728bytes，低於180KiB預算。
- `tools/font-manifest.json`記錄SHA256及字集，`--check`直接開WOFF2比對cmap；Node測試另檢查首頁文案與manifest，避免新字悄悄fallback。
- `.home`限定宋體，政策頁body沒有home class且不加font preload；CSS共用但政策標題／正文用系統黑體。實際字型下載請求及LCP尚待可用瀏覽器驗證，不能用cmap檢查冒充。
