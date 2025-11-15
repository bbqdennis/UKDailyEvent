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

const parseLinks = (linkString) => {
  if (!linkString) return [];
  return linkString
    .split(/\s*,\s*/)
    .map((entry) => getDisplayValue(entry))
    .filter(Boolean);
};

const renderLinks = (linkString) => {
  const entries = parseLinks(linkString);
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

const buildCopyText = (event) => {
  const title = event.event_name?.trim() || "未命名活動";
  const timeText = getDisplayValue(event.event_time);
  const locationText = getDisplayValue(event.event_location);
  const descriptionText = getDisplayValue(event.event_description);
  const priceText = getDisplayValue(event.event_price);
  const links = parseLinks(event.event_link);

  const sections = [
    ["Manchester每日活動推介", "https://uk-daily-event.vercel.app", ""],
    [title]
  ];

  const metaLines = [];
  if (timeText) metaLines.push(`時間：${timeText}`);
  if (locationText) metaLines.push(`地點：${locationText}`);
  if (metaLines.length) sections.push(["", ...metaLines]);

  if (descriptionText) sections.push(["", descriptionText]);

  const priceLinkLines = [];
  if (priceText) priceLinkLines.push(`價錢：${priceText}`);
  if (links.length) priceLinkLines.push(`連結：${links.join(", ")}`);
  if (priceLinkLines.length) sections.push(["", ...priceLinkLines]);

  return sections.flat().join("\n");
};

const copyToClipboard = async (text) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const handleCopy = async (event, button) => {
  const text = buildCopyText(event);
  const defaultLabel = button.dataset.defaultLabel || "複製活動內容";
  const setState = (stateClass, label) => {
    button.classList.remove("copied", "error");
    if (stateClass) button.classList.add(stateClass);
    button.setAttribute("aria-label", label);
  };

  try {
    await copyToClipboard(text);
    setState("copied", "已複製");
  } catch (error) {
    console.error("Copy failed", error);
    setState("error", "複製失敗");
  } finally {
    setTimeout(() => {
      setState("", defaultLabel);
    }, 2000);
  }
};

const createCard = (event) => {
  const card = document.createElement("article");
  card.className = "event-card";
  const descriptionText = getDisplayValue(event.event_description);
  const priceText = getDisplayValue(event.event_price);
  const linksHtml = renderLinks(event.event_link);
  const header = document.createElement("div");
  header.className = "card-header";

  const titleElement = document.createElement("h2");
  titleElement.className = "event-name";
  titleElement.textContent = event.event_name ?? "未命名活動";
  header.appendChild(titleElement);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "copy-button";
  const buttonLabel = `複製${event.event_name ?? "此活動"}內容`;
  copyButton.dataset.defaultLabel = buttonLabel;
  copyButton.setAttribute("aria-label", buttonLabel);
  copyButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v16h13a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 18H8V7h11v16z"/>
    </svg>
  `;
  copyButton.addEventListener("click", () => handleCopy(event, copyButton));
  header.appendChild(copyButton);
  card.appendChild(header);

  card.insertAdjacentHTML(
    "beforeend",
    `
        <div class="event-meta">
          ${createMetaRow("時間", event.event_time)}
          ${createLocationRow(event.event_location)}
        </div>
        ${descriptionText ? `<p class="event-description">${descriptionText}</p>` : ""}
        ${priceText ? `<span class="price-pill">${priceText}</span>` : ""}
        ${linksHtml ? `<div class="event-links" aria-label="活動相關連結">${linksHtml}</div>` : ""}
      `
  );
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
