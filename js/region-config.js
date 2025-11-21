const REGION_ORDER = [
  "london",
  "manchester",
  "birmingham",
  "leeds",
  "liverpool",
  "edinburgh",
  "glasgow",
  "bristol",
  "nottingham",
  "sheffield",
  "marlborough"
];

const REGION_CONFIG = {
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
  },
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
  birmingham: {
    id: "birmingham",
    label: "Birmingham",
    heading: "Birmingham 每日活動",
    subtitle: "探索伯明翰每日靈感，感受城市活力",
    shareTitle: "Birmingham每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/birmingham.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/birmingham.json"
    ]
  },
  leeds: {
    id: "leeds",
    label: "Leeds",
    heading: "Leeds 每日活動",
    subtitle: "掌握Leeds最新活動，安排你的造訪行程",
    shareTitle: "Leeds每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/leeds.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/leeds.json"
    ]
  },
  liverpool: {
    id: "liverpool",
    label: "Liverpool",
    heading: "Liverpool 每日活動",
    subtitle: "跟上Liverpool每日音樂與文化節奏",
    shareTitle: "Liverpool每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/liverpool.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/liverpool.json"
    ]
  },
  edinburgh: {
    id: "edinburgh",
    label: "Edinburgh",
    heading: "Edinburgh 每日活動",
    subtitle: "Edinburgh 每日靈感，漫遊古城與藝文活動",
    shareTitle: "Edinburgh每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/edinburgh.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/edinburgh.json"
    ]
  },
  glasgow: {
    id: "glasgow",
    label: "Glasgow",
    heading: "Glasgow 每日活動",
    subtitle: "Glasgow 當日活動，體驗創意與音樂場景",
    shareTitle: "Glasgow每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/glasgow.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/glasgow.json"
    ]
  },
  bristol: {
    id: "bristol",
    label: "Bristol",
    heading: "Bristol 每日活動",
    subtitle: "Bristol 每日活動，感受港城藝術氣息",
    shareTitle: "Bristol每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/bristol.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/bristol.json"
    ]
  },
  nottingham: {
    id: "nottingham",
    label: "Nottingham",
    heading: "Nottingham 每日活動",
    subtitle: "挖掘Nottingham的每日精彩活動",
    shareTitle: "Nottingham每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/nottingham.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/nottingham.json"
    ]
  },
  sheffield: {
    id: "sheffield",
    label: "Sheffield",
    heading: "Sheffield 每日活動",
    subtitle: "Sheffield 每日活動，探索鋼城與綠地風貌",
    shareTitle: "Sheffield每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/sheffield.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/sheffield.json"
    ]
  },
  marlborough: {
    id: "marlborough",
    label: "Marlborough",
    heading: "Marlborough 每日活動",
    subtitle: "暢遊Marlborough，探索每日靈感行程",
    shareTitle: "Marlborough每日活動推介",
    sources: [
      "https://n8n-media-storage.s3.eu-west-2.amazonaws.com/marlborough.json",
      "https://r.jina.ai/https://n8n-media-storage.s3.eu-west-2.amazonaws.com/marlborough.json"
    ]
  }
};

window.REGION_ORDER = REGION_ORDER;
window.REGION_CONFIG = REGION_CONFIG;
