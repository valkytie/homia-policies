# Homia / 嚮家 Privacy Policy 隱私權政策

_Last updated / 最後更新：2026-09-03 · Effective date / 生效日期：2026-09-03_

## English

### Who the app is for

Homia is for parents and adult caregivers. Children do not create or manage accounts and are not the intended operators of the app. Caregivers may enter information about a baby under their care.

### Local data

The local core works without sign-in. Before pairing, care records, baby details, settings, and local media references are stored in Drift / SQLite and app-managed files on the device. Homia does not treat sign-in by itself as permission to upload unpaired local records.

### Firebase family sync

Firebase family sync is optional and begins only after an authorized caregiver completes QR-code or invitation-code pairing. Firebase Authentication identifies the account. Firestore synchronizes authorized family data, Firebase Storage holds the supported cloud media objects, Cloud Functions perform sensitive server operations, and Firebase Cloud Messaging delivers notifications. The app interface continues to read and write the local database first.

### Photos and optional cloud-photo subscriptions

The free paired-family sync area handles compressed previews and core sync data as separately limited categories. A cloud-photo subscription may later store original photos and additional previews under the purchasing account's 5 GB allowance. Two active subscribers in a paired family may display 10 GB in total, while each allowance remains owned by its purchasing account.

When a subscription actually expires, affected cloud files are retained for 30 days. Cloud retention or cleanup does not delete local photos or local care records. Original-photo downloads are available only to authorized mother/father accounts. The app stores the latest 10 successful download records on the device; the service keeps security and rate-limit records for the documented operational retention period.

### ZIP backup and your own cloud drive

A ZIP backup is a manual, open export created at the caregiver's request. Firebase family sync, ZIP backup, and a file saved to your own cloud drive are separate services. If you save a ZIP file to iCloud Drive, Google Drive, or another provider, that provider processes the file under its own terms and privacy policy.

### Notifications

When notifications are enabled, the app registers a Firebase Cloud Messaging token with an effective locale such as English or Traditional Chinese. Family-event notifications exclude the source member where supported. Notification payloads retain stable technical routing fields.

### Advertising and consent

The free experience may display Google AdMob advertising. Where required, Google's User Messaging Platform is used to request consent or show privacy options. Google may process device, advertising, diagnostic, and interaction data according to the choices available in that region and Google's policies. Paid ad-free entitlements remove Homia's ad placements but do not retroactively control data already processed by platform providers.

### Purchases

For the Taiwan App Store first release, Apple processes payment details. Homia receives Apple transaction information needed for trusted receipt verification, entitlement status, restoration, refunds, revocation, and subscription expiry. The app does not store full payment-card details and does not grant paid access from an unverified device result.

### Deletion and retention

Local app data remains on the device until it is deleted through app controls where available, the app is uninstalled, or the device storage is erased. Cloud-family and account deletion require authenticated handling so one caregiver cannot delete another caregiver's data without authority. Deletion requests are handled through the authenticated in-app account-deletion flow and the public data-deletion request channel described on the [Homia Support and Data Deletion](support-and-data-deletion.html) page. Legal, fraud-prevention, security, and transaction records may be retained where required.

### Contact and policy changes

For privacy, support, or data questions, contact: valkytie@gmail.com. If we change this policy, we will update this page and revise the “last updated” date above.

## 繁體中文

### 適用對象

嚮家（Homia）提供父母與成年照顧者使用。兒童不會建立或管理帳號，也不是 App 的操作對象；照顧者可以為其照護的嬰幼兒輸入資料。

### 本機資料

本機核心不需登入即可使用。尚未配對時，照顧紀錄、嬰幼兒資料、設定與本機媒體參照會保存在裝置的 Drift / SQLite 與 App 管理檔案中。嚮家不會把「登入」本身當作上傳未配對本機紀錄的授權。

### Firebase 家庭同步

Firebase 家庭同步為選用功能，只有在已授權的照顧者完成 QR 碼或邀請碼配對後才開始。Firebase Authentication 識別帳號；Firestore 同步已授權的家庭資料；Firebase Storage 保存支援的雲端媒體物件；Cloud Functions 執行敏感的伺服器操作；Firebase Cloud Messaging 傳送通知。App 介面仍以本機資料庫為優先讀寫對象。

### 照片與選用照片雲端訂閱

免費配對家庭同步處理壓縮預覽圖與核心同步資料，兩者為分開的限量類別。照片雲端訂閱日後可在購買帳號的 5 GB 額度內存放原始照片與額外預覽圖。配對家庭中兩位有效訂閱者合計可顯示 10 GB，但每一份額度仍歸購買帳號所有。

訂閱實際到期時，受影響的雲端檔案保留 30 天。雲端保留或清理不會刪除本機照片或本機照顧紀錄。原始照片下載僅提供給已授權的媽媽／爸爸帳號。App 在裝置上保留最近 10 筆成功下載紀錄；服務端依文件化的營運保留期間保存安全與速率限制紀錄。

### ZIP 備份與自己的雲端硬碟

ZIP 備份是照顧者主動建立的手動、開放式匯出。Firebase 家庭同步、ZIP 備份，與存到自己的雲端硬碟的檔案是三種不同服務。若把 ZIP 存到 iCloud Drive、Google Drive 或其他服務，該服務會依自己的條款與隱私權政策處理該檔案。

### 通知

啟用通知時，App 會以有效語言（如英文或繁體中文）註冊 Firebase Cloud Messaging token。家庭事件通知在支援時排除來源成員。通知內容保留穩定的技術路由欄位。

### 廣告與同意

免費體驗可能顯示 Google AdMob 廣告。在需要時，會使用 Google 的 User Messaging Platform 徵求同意或顯示隱私選項。Google 可能依該地區可用的選項與 Google 政策處理裝置、廣告、診斷與互動資料。付費去廣告權益會移除嚮家的廣告版位，但不會回溯控制平台業者已處理的資料。

### 購買

台灣 App Store 首發的付款資料由 Apple 處理。嚮家會收到 Apple 交易資訊，用於可信收據驗證、權益狀態、還原購買、退款、撤銷與訂閱到期。App 不儲存完整信用卡資料，也不會僅憑未驗證的裝置結果授予付費權益。

### 刪除與保留

本機資料會保留在裝置上，直到使用者透過可用的 App 控制刪除、移除 App，或清除裝置儲存空間。家庭雲端與帳號刪除必須先驗證身分與權限，避免一位照顧者無權刪除另一位照顧者的資料。刪除要求會透過 App 內經過驗證的帳號刪除流程，與 [嚮家客服與資料刪除說明](support-and-data-deletion.html) 頁面描述的公開資料刪除管道處理。依法規、詐欺防治、安全與交易紀錄需求，部分資料可能需保留。

### 聯絡與政策變更

隱私、客服或資料問題請聯絡：valkytie@gmail.com。若本政策變更，我們會更新本頁並修訂上方「最後更新」日期。
