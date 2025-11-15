# UKDailyEvent
Find the UK Event for you on Daily and Daily

Event Source List:

Manchester:
https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json

## 功能簡介

- `index.html` 會串接遠端 JSON，將活動資訊以卡片方式顯示並處理載入或錯誤狀態訊息。
- `css/styles.css` 包含版面與配色設定，並定義活動卡片、可點擊地點、單行顯示的活動連結與聯絡我們區塊樣式。
- `js/main.js` 擔負資料載入、轉換與 DOM 產生，使用 JSON 原始連結文字並讓地點欄位可跳轉到 Google Maps 搜尋，並在連結、價錢、簡介等欄位為 N/A 時自動省略顯示。

## 開發指引

 - 每次開發前，也應該先讀取 README.md 的內容
 - 每次開發後，也應該更新回 README.md 的內容
 - 每個獨立頁面，應該有其獨立的 html, js 和 css 檔，除非是共有 common 的部分
