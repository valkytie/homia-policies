# Homia / 嚮家 Support and Data Deletion 客服與資料刪除

_Last updated / 最後更新：2026-09-03_

## English

### Support

For support, privacy, or data questions, contact: valkytie@gmail.com. When reporting an issue, please include the app version, platform, device model, and an approximate event time. Never send passwords, full store credentials, private keys, or an unrestricted ZIP backup in messages. Redact logs and screenshots before sharing.

### Local data

Before pairing, data is stored in Drift / SQLite and app-managed files on the device. You may create a ZIP backup before deletion. Removing the app or erasing its storage removes app-managed local data subject to operating-system backup behavior. A ZIP backup already copied elsewhere is independent and must be deleted from that location by you.

### Firebase family sync data

Firebase family sync data belongs to an authorized family context. A deletion request authenticates the requesting account and distinguishes between leaving a family, deleting the requester's account-owned data, and deleting an entire family. One caregiver cannot erase another caregiver's data without the required role and confirmation.

### Optional cloud-photo data

Cloud-photo objects keep content ownership and quota ownership separate. Subscription expiry starts a 30-day cloud retention period; it does not delete local photos. An authenticated deletion request may remove eligible account-owned cloud objects sooner, subject to shared-family rights, fraud prevention, transaction retention, and legal obligations.

### ZIP backup and your own cloud drive

ZIP backup is not Firebase family sync. A ZIP saved to your own cloud drive is controlled through that provider. Homia cannot delete a file from iCloud Drive, Google Drive, or another destination after you have exported it there.

### How to request account deletion

If account deletion is available in your app version, open the app and use Settings → Account & data → Delete account; the app will guide you through re-authentication and confirmation. If you cannot use the in-app flow (for example, the app is no longer installed), email valkytie@gmail.com from the address associated with the account and request deletion. We will verify the request, confirm the deletion scope with you, and complete the deletion. Sessions and tokens are revoked when account deletion is confirmed.

## 繁體中文

### 客服

客服、隱私或資料問題請聯絡：valkytie@gmail.com。回報問題時請附上 App 版本、平台、裝置型號與大約發生時間。請勿在訊息中提供密碼、完整商店憑證、私密金鑰或未限制內容的 ZIP 備份；分享 log 或截圖前請先遮蔽敏感資料。

### 本機資料

尚未配對時，資料保存在裝置的 Drift / SQLite 與 App 管理檔案中。刪除前可先建立 ZIP 備份。移除 App 或清除其儲存空間，會依作業系統備份行為移除 App 管理的本機資料。已複製到其他位置的 ZIP 備份是獨立檔案，必須由你到該位置刪除。

### Firebase 家庭同步資料

Firebase 家庭同步資料屬於已授權家庭範圍。刪除要求會驗證提出要求的帳號，並區分退出家庭、刪除提出者帳號所屬的資料，以及刪除整個家庭。照顧者不得在沒有相應角色與確認時刪除另一位照顧者的資料。

### 選用照片雲端資料

照片雲端物件會分開保存內容擁有者與容量擁有者。訂閱到期會開始 30 天雲端保留，不會刪除本機照片。通過驗證的刪除要求可提早刪除符合資格的帳號所屬雲端物件，但仍需遵守家庭共享權限、詐欺防治、交易保留與法律義務。

### ZIP 備份與自己的雲端硬碟

ZIP 備份不是 Firebase 家庭同步。存到自己的雲端硬碟的 ZIP 由該服務管理；你匯出到 iCloud Drive、Google Drive 或其他位置後，嚮家無法代替你刪除該檔案。

### 如何提出帳號刪除要求

若你的 App 版本已提供帳號刪除功能，請開啟 App 並使用「設定 → 帳號與資料 → 刪除帳號」；App 會引導你完成重新驗證與確認。若無法使用 App 內流程（例如已移除 App），請以帳號關聯的電子郵件地址寄信到 valkytie@gmail.com 提出刪除要求。我們會驗證要求、與你確認刪除範圍並完成刪除。帳號刪除確認後，session 與 token 都會撤銷。
