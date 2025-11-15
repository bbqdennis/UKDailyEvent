const DATA_URLS = [
  "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json",
  "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json"
];
const eventsGrid = document.getElementById("eventsGrid");
const statusBox = document.getElementById("status");

const createMetaRow = (label, value) => {
  if (!value) return "";
  return `<div><strong>${label}：</strong>${value}</div>`;
};

const renderLinks = (linkString) => {
  if (!linkString) return "";
  const entries = linkString.split(/\s*,\s*/).filter(Boolean);
  return entries
    .map((entry) => {
      const urlMatch = entry.match(/https?:\/\/[^\s)]+/);
      const href = urlMatch ? urlMatch[0] : entry;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${entry}</a>`;
    })
    .join("");
};

const createLocationRow = (location) => {
  if (!location) return "";
  const encodedLocation = encodeURIComponent(location);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  return `<div><strong>地點：</strong><a class="location-link" href="${mapUrl}" target="_blank" rel="noopener noreferrer">${location}</a></div>`;
};

const createCard = (event) => {
  const card = document.createElement("article");
  card.className = "event-card";
  card.innerHTML = `
        <h2 class="event-name">${event.event_name ?? "未命名活動"}</h2>
        <div class="event-meta">
          ${createMetaRow("時間", event.event_time)}
          ${createLocationRow(event.event_location)}
        </div>
        <p class="event-description">${event.event_description ?? "暫無描述"}</p>
        ${event.event_price ? `<span class="price-pill">${event.event_price}</span>` : ""}
        ${
          event.event_link
            ? `<div class="event-links" aria-label="活動相關連結">${renderLinks(event.event_link)}</div>`
            : ""
        }
      `;
  return card;
};

async function fetchWithFallback() {
  let lastError;
  for (const url of DATA_URLS) {
    try {
      const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("未知錯誤");
}

async function loadEvents() {
  try {
    const events = await fetchWithFallback();

    if (!Array.isArray(events) || events.length === 0) {
      statusBox.textContent = "目前沒有活動資料。";
      return;
    }

    eventsGrid.innerHTML = "";
    events.forEach((event) => eventsGrid.appendChild(createCard(event)));
  } catch (error) {
    console.error("Failed to load events", error);
    eventsGrid.innerHTML = `<div class="status error">無法載入活動：${error.message}</div>`;
  } finally {
    statusBox?.remove();
  }
}

document.addEventListener("DOMContentLoaded", loadEvents);
