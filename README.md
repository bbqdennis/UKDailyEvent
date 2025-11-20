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

- `index.html` 會串接遠端 JSON，將活動資訊以卡片方式顯示並處理載入或錯誤狀態訊息。
- `css/styles.css` 包含版面與配色設定，並定義活動卡片、可點擊地點、多行且自動換行的活動連結、聯絡我們區塊與帶提示的複製按鈕樣式。
- `js/main.js` 擔負資料載入、轉換與 DOM 產生，會在資料來源後動態附加 `?v=YYYY-MM-DD` 以避免快取；同時使用 JSON 原始連結文字並讓地點欄位可跳轉到 Google Maps 搜尋，在連結、價錢、簡介等欄位為 N/A 時自動省略顯示，提供具提示訊息的複製卡片功能，非 http(s) 開頭的活動連結會直接帶你到 Google 搜尋，且若 API 回傳 `event_ticket_link`（非 `N/A`）也會在價錢區塊顯示「點擊購票」提示並開啟購票頁面，現在也能透過地區清單在 Manchester、London、Marlborough、Nottingham 之間切換並顯示對應的活動，複製分享連結會自動補上當前地區的網址 hash（如 `/#manchester`），並可依網址的 hash 或路徑自動預設載入對應地區。
- `favicon.ico` 採用品牌配色，提供瀏覽器分頁與捷徑的圖示。

## 本地開發小提醒

- 在本地請使用 hash 切換地區，例如 `http://localhost:8000/#manchester`、`/#london` 等，不需建立對應子資料夾。
- `index.html` 使用 `<base href=\"/\" />`，確保在子路徑或 hash 下引用的 JS/CSS 仍能正確載入。

## 開發指引

 - 每次開發前，也應該先讀取 README.md 的內容
 - 每次開發後，也應該更新回 README.md 的內容
 - 每個獨立頁面，應該有其獨立的 html, js 和 css 檔，除非是共有 common 的部分
