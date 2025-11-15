# UKDailyEvent
Find the UK Event for you on Daily and Daily

Event Source List:

Manchester:
https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json

## 本地開發

S3 並沒有開啟 CORS，所以瀏覽器無法直接向上面連結發出請求。請用專案附帶的 Python 伺服器將資料轉接成同源 (same origin) 請求即可。

1. 安裝相依：macOS / Linux 內建的 `python3` 即可使用，無需額外套件。
2. 在專案根目錄執行：
   ```bash
   python3 server.py
   ```
   伺服器會在 `http://localhost:8000` 服務 `index.html`，並透過 `/events` 端點 proxy 遠端 JSON。
3. 打開瀏覽器前往 `http://localhost:8000`，活動列表會自動載入。如需改變遠端資料來源，可設置 `EVENTS_URL` 環境變數，例如：
   ```bash
   EVENTS_URL=https://example.com/custom.json python3 server.py
   ```

若您仍想直接取遠端 JSON，可以手動編輯 `index.html` 內的 `DATA_URLS`，但預設情況請保留第一個 `/events` 同源端點以避免 CORS。
