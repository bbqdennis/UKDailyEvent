# UKDailyEvent
Find the UK Event for you on Daily and Daily

Demo Website:
https://uk-daily-event.vercel.app
- Manchester: https://uk-daily-event.vercel.app/#manchester
- London: https://uk-daily-event.vercel.app/#london
- Marlborough: https://uk-daily-event.vercel.app/#marlborough
- Nottingham: https://uk-daily-event.vercel.app/#nottingham

Event Source List:

Manchester:
https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json

London:
https://n8n-media-storage.s3.eu-west-2.amazonaws.com/london.json

Marlborough:
https://n8n-media-storage.s3.eu-west-2.amazonaws.com/marlborough.json

Nottingham:
https://n8n-media-storage.s3.eu-west-2.amazonaws.com/nottingham.json

## 功能簡介

- `index.html` 串接遠端 JSON 並以卡片呈現活動，提供載入中/空資料/錯誤狀態訊息，內建地區選單與聯絡我們區塊。
- `css/styles.css` 定義漸層背景、卡片、價格與購票提示、複製提示、地區選單、可換行的活動連結與聯絡我們按鈕等樣式。
- `js/main.js` 依網址 hash 或 path 決定預設地區並同步地區選單與頁面標題（Manchester、London、Marlborough、Nottingham）。
- `js/main.js` 對每個地區使用主備 JSON 來源，請求時附加 `?v=YYYY-MM-DD` 以避免快取，失敗時會顯示錯誤訊息。
- `js/main.js` 活動卡片會自動隱藏 N/A 欄位，地點連到 Google Maps 搜尋，連結支援多筆且對非 http(s) 開頭自動改為 Google 搜尋。
- `js/main.js` 價格區塊支援購票連結與 hover 提示，沒有購票連結時僅顯示價格徽章。
- `js/main.js` 價錢為「免費」或購票連結未包含 http(s) 前綴時，僅顯示價格徽章不提供點擊。
- `js/main.js` 提供複製按鈕，會帶入地區分享標題、`/#<region>` 分享連結、活動基本資訊與所有連結，並以提示回饋成功/失敗。
- `js/main.js` 監聽地區選單與 hash 變更，即時切換活動並保持網址 hash 與分享連結同步。
- `favicon.ico` 採用品牌配色，提供瀏覽器分頁與捷徑的圖示。

## 本地開發小提醒

- 在本地請使用 hash 切換地區，例如 `http://localhost:8000/#manchester`、`/#london` 等，不需建立對應子資料夾。
- `index.html` 使用 `<base href=\"/\" />`，確保在子路徑或 hash 下引用的 JS/CSS 仍能正確載入。

## 開發指引

 - 每次開發前，也應該先讀取 README.md 的內容
 - 每次開發後，也應該更新回 README.md 的內容，功能寫入時應該用點列形式，一行一點
 - 每個獨立頁面，應該有其獨立的 html, js 和 css 檔，除非是共有 common 的部分
