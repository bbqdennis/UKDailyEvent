const DATA_URLS = [
  "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json",
  "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json"
];
const eventsGrid = document.getElementById("eventsGrid");
const statusBox = document.getElementById("status");

const getDisplayValue = (value) => {
  if (value == null) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toUpperCase() === "N/A") return "";
    return trimmed;
  }
  return value;
};

const createMetaRow = (label, value) => {
  const content = getDisplayValue(value);
  if (!content) return "";
  return `<div><strong>${label}：</strong>${content}</div>`;
};

const renderLinks = (linkString) => {
  if (!linkString) return "";
  const entries = linkString
    .split(/\s*,\s*/)
    .map((entry) => getDisplayValue(entry))
    .filter(Boolean);
  if (!entries.length) return "";
  return entries
    .map((entry) => {
      const urlMatch = entry.match(/https?:\/\/[^\s)]+/);
      const href = urlMatch ? urlMatch[0] : entry;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${entry}</a>`;
    })
    .join("");
};

const createLocationRow = (location) => {
  const displayLocation = getDisplayValue(location);
  if (!displayLocation) return "";
  const encodedLocation = encodeURIComponent(displayLocation);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  return `<div><strong>地點：</strong><a class="location-link" href="${mapUrl}" target="_blank" rel="noopener noreferrer">${displayLocation}</a></div>`;
};

const createCard = (event) => {
  const card = document.createElement("article");
  card.className = "event-card";
  const descriptionText = getDisplayValue(event.event_description);
  const priceText = getDisplayValue(event.event_price);
  const linksHtml =
    event.event_link && renderLinks(event.event_link);
  card.innerHTML = `
        <h2 class="event-name">${event.event_name ?? "未命名活動"}</h2>
        <div class="event-meta">
          ${createMetaRow("時間", event.event_time)}
          ${createLocationRow(event.event_location)}
        </div>
        ${descriptionText ? `<p class="event-description">${descriptionText}</p>` : ""}
        ${priceText ? `<span class="price-pill">${priceText}</span>` : ""}
        ${linksHtml ? `<div class="event-links" aria-label="活動相關連結">${linksHtml}</div>` : ""}
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
