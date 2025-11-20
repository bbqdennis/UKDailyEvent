const REGION_CONFIG = {
  manchester: {
    id: "manchester",
    label: "Manchester",
    heading: "Manchester 每日活動",
    subtitle: "即時載入最新活動資訊，規劃你的曼城精彩假期",
    shareTitle: "Manchester每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/manchester.json"
    ]
  },
  london: {
    id: "london",
    label: "London",
    heading: "London 每日活動",
    subtitle: "掌握倫敦每日靈感，安排你的城市探索行程",
    shareTitle: "London每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/london.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/london.json"
    ]
  }
};

const DEFAULT_REGION = "manchester";
const SHARE_BASE_URL = "https://uk-daily-event.vercel.app";
let currentRegion = DEFAULT_REGION;

const eventsGrid = document.getElementById("eventsGrid");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const regionSelect = document.getElementById("regionSelect");

const getRegionConfig = (regionId = DEFAULT_REGION) => REGION_CONFIG[regionId] ?? REGION_CONFIG[DEFAULT_REGION];

const getRegionFromPath = () => {
  if (typeof window === "undefined") return DEFAULT_REGION;
  const path = window.location?.pathname ?? "";
  const segments = path.split("/").filter(Boolean);
  const candidate = segments[segments.length - 1];
  return REGION_CONFIG[candidate]?.id ?? DEFAULT_REGION;
};

const buildShareLink = (regionId = DEFAULT_REGION) => {
  const origin = typeof window !== "undefined" ? window.location?.origin : "";
  const base = origin && origin !== "file://" ? origin : SHARE_BASE_URL;
  const normalizedBase = base.replace(/\/+$/, "");
  return `${normalizedBase}/${regionId || DEFAULT_REGION}`;
};

const buildDataUrls = (regionId = DEFAULT_REGION) => {
  const config = getRegionConfig(regionId);
  const today = new Date().toISOString().split("T")[0];
  return config.sources.map((url) => `${url}${url.includes("?") ? "&" : "?"}v=${today}`);
};

const updatePageIntro = (config) => {
  if (pageTitle) pageTitle.textContent = config.heading;
  if (pageSubtitle) pageSubtitle.textContent = config.subtitle;
  document.title = `${config.label} Daily Events`;
};

const ensureStatusBox = () => {
  let status = document.getElementById("status");
  if (!status) {
    status = document.createElement("div");
    status.id = "status";
    status.className = "status";
    eventsGrid?.appendChild(status);
  } else {
    status.className = "status";
  }
  return status;
};

const showStatus = (message, variant) => {
  const status = ensureStatusBox();
  status.textContent = message;
  if (variant) {
    status.classList.add(variant);
  }
  return status;
};

const clearStatus = () => {
  const status = document.getElementById("status");
  status?.remove();
};

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

const ensureHttpProtocol = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const createLocationRow = (location) => {
  const displayLocation = getDisplayValue(location);
  if (!displayLocation) return "";
  const encodedLocation = encodeURIComponent(displayLocation);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  return `<div><strong>地點：</strong><a class="location-link" href="${mapUrl}" target="_blank" rel="noopener noreferrer">${displayLocation}</a></div>`;
};

const buildCopyText = (event, regionConfig) => {
  const title = event.event_name?.trim() || "未命名活動";
  const timeText = getDisplayValue(event.event_time);
  const locationText = getDisplayValue(event.event_location);
  const descriptionText = getDisplayValue(event.event_description);
  const priceText = getDisplayValue(event.event_price);
  const links = parseLinks(event.event_link);
  const shareLink = buildShareLink(regionConfig?.id);

  const sections = [
    [regionConfig?.shareTitle ?? "UK Daily Event 推介", shareLink, ""],
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

const handleCopy = async (event, regionConfig, button, tooltip, wrapper) => {
  const text = buildCopyText(event, regionConfig);
  const defaultLabel = button.dataset.defaultLabel || "複製活動內容";
  const defaultTooltip = tooltip.dataset.defaultText || "點擊複製";
  const setState = (stateClass, label) => {
    button.classList.remove("copied", "error");
    if (stateClass) button.classList.add(stateClass);
    button.setAttribute("aria-label", label);
  };

  const showTooltip = (message, variant) => {
    tooltip.textContent = message;
    tooltip.classList.remove("success", "error");
    if (variant) tooltip.classList.add(variant);
    wrapper.classList.add("tooltip-visible");
    if (wrapper._tooltipTimeout) {
      clearTimeout(wrapper._tooltipTimeout);
    }
    wrapper._tooltipTimeout = setTimeout(() => {
      tooltip.textContent = defaultTooltip;
      tooltip.classList.remove("success", "error");
      wrapper.classList.remove("tooltip-visible");
      wrapper._tooltipTimeout = undefined;
    }, 2000);
  };

  try {
    await copyToClipboard(text);
    setState("copied", "已複製");
    showTooltip("已複製到剪貼簿", "success");
  } catch (error) {
    console.error("Copy failed", error);
    setState("error", "複製失敗");
    showTooltip("複製失敗", "error");
  } finally {
    setTimeout(() => {
      setState("", defaultLabel);
    }, 2000);
  }
};

const createLinksSection = (linkString) => {
  const entries = parseLinks(linkString);
  if (!entries.length) return null;
  const container = document.createElement("div");
  container.className = "event-links";
  container.setAttribute("aria-label", "活動相關連結");

  entries.forEach((entry) => {
    const linkEl = document.createElement("a");
    linkEl.textContent = entry;
    const hasProtocol = /^https?:\/\//i.test(entry);
    if (hasProtocol) {
      linkEl.href = entry;
      linkEl.target = "_blank";
      linkEl.rel = "noopener noreferrer";
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(entry)}`;
      linkEl.href = searchUrl;
      linkEl.target = "_blank";
      linkEl.rel = "noopener noreferrer";
      linkEl.title = "點擊打開Google搜尋";
      linkEl.setAttribute("aria-label", `點擊打開Google搜尋：${entry}`);
    }
    container.appendChild(linkEl);
  });

  return container;
};

const createCard = (event, regionConfig) => {
  const card = document.createElement("article");
  card.className = "event-card";
  const descriptionText = getDisplayValue(event.event_description);
  const priceText = getDisplayValue(event.event_price);
  const ticketLink = getDisplayValue(event.event_ticket_link);
  const linksSection = createLinksSection(event.event_link);
  const header = document.createElement("div");
  header.className = "card-header";

  const titleElement = document.createElement("h2");
  titleElement.className = "event-name";
  titleElement.textContent = event.event_name ?? "未命名活動";
  header.appendChild(titleElement);

  const copyWrapper = document.createElement("div");
  copyWrapper.className = "copy-wrapper";

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
  const tooltip = document.createElement("span");
  tooltip.className = "copy-tooltip";
  const tooltipText = "點擊複製";
  tooltip.dataset.defaultText = tooltipText;
  tooltip.textContent = tooltipText;

  copyButton.addEventListener("click", () => handleCopy(event, regionConfig, copyButton, tooltip, copyWrapper));

  copyWrapper.appendChild(copyButton);
  copyWrapper.appendChild(tooltip);
  header.appendChild(copyWrapper);
  card.appendChild(header);

  card.insertAdjacentHTML(
    "beforeend",
    `
        <div class="event-meta">
          ${createMetaRow("時間", event.event_time)}
          ${createLocationRow(event.event_location)}
        </div>
        ${descriptionText ? `<p class="event-description">${descriptionText}</p>` : ""}
        ${
          priceText
            ? ticketLink
              ? `<a class="price-pill ticket-link" href="${ensureHttpProtocol(
                  ticketLink
                )}" target="_blank" rel="noopener noreferrer" data-tooltip="點擊購票" aria-label="點擊購票">${priceText}</a>`
              : `<span class="price-pill">${priceText}</span>`
            : ""
        }
      `
  );
  if (linksSection) {
    card.appendChild(linksSection);
  }
  return card;
};

async function fetchWithFallback(regionId) {
  const urls = buildDataUrls(regionId);
  let lastError;
  for (const url of urls) {
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

async function loadEvents(regionId = currentRegion) {
  const config = getRegionConfig(regionId);
  currentRegion = config.id;
  if (regionSelect && regionSelect.value !== config.id) {
    regionSelect.value = config.id;
  }
  updatePageIntro(config);
  eventsGrid.innerHTML = "";
  showStatus("載入中...");
  try {
    const events = await fetchWithFallback(config.id);

    if (!Array.isArray(events) || events.length === 0) {
      showStatus("目前沒有活動資料。");
      return;
    }

    clearStatus();
    events.forEach((event) => eventsGrid.appendChild(createCard(event, config)));
  } catch (error) {
    console.error("Failed to load events", error);
    eventsGrid.innerHTML = "";
    showStatus(`無法載入活動：${error.message}`, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const initialRegion = getRegionFromPath();
  if (regionSelect && regionSelect.value !== initialRegion) {
    regionSelect.value = initialRegion;
  }
  loadEvents(initialRegion);
  regionSelect?.addEventListener("change", (event) => {
    const selectedRegion = event.target.value;
    loadEvents(selectedRegion);
  });
});
