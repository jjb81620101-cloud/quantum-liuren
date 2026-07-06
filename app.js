const state = {
  bytes: new Uint8Array(),
  cursor: 0,
  loading: false,
  casting: false,
  refreshing: false,
  latestReading: null,
  selectedDetail: null,
  history: [],
};

const els = {
  sourceDot: document.querySelector("#sourceDot"),
  sourceName: document.querySelector("#sourceName"),
  sourceMeta: document.querySelector("#sourceMeta"),
  hexOutput: document.querySelector("#hexOutput"),
  bitsOutput: document.querySelector("#bitsOutput"),
  questionInput: document.querySelector("#questionInput"),
  topicType: document.querySelector("#topicType"),
  castMode: document.querySelector("#castMode"),
  castDateTime: document.querySelector("#castDateTime"),
  ritualState: document.querySelector("#ritualState"),
  ritualSteps: document.querySelector("#ritualSteps"),
  verdictBadge: document.querySelector("#verdictBadge"),
  mainVerdict: document.querySelector("#mainVerdict"),
  adviceText: document.querySelector("#adviceText"),
  plainSummary: document.querySelector("#plainSummary"),
  smallStep: document.querySelector("#smallStep"),
  smallPalace: document.querySelector("#smallPalace"),
  smallMeaning: document.querySelector("#smallMeaning"),
  smallTrail: document.querySelector("#smallTrail"),
  bigFocus: document.querySelector("#bigFocus"),
  branchWheel: document.querySelector("#branchWheel"),
  bigMeaning: document.querySelector("#bigMeaning"),
  calendarBadge: document.querySelector("#calendarBadge"),
  calendarPanel: document.querySelector("#calendarPanel"),
  calendarNote: document.querySelector("#calendarNote"),
  formalPlateBadge: document.querySelector("#formalPlateBadge"),
  formalPlate: document.querySelector("#formalPlate"),
  formalPlateNote: document.querySelector("#formalPlateNote"),
  formalLessonsBadge: document.querySelector("#formalLessonsBadge"),
  formalLessons: document.querySelector("#formalLessons"),
  formalMethodBadge: document.querySelector("#formalMethodBadge"),
  formalTransmissions: document.querySelector("#formalTransmissions"),
  formalMethodNote: document.querySelector("#formalMethodNote"),
  auditBadge: document.querySelector("#auditBadge"),
  copyAuditJson: document.querySelector("#copyAuditJson"),
  compareAudit: document.querySelector("#compareAudit"),
  auditExample: document.querySelector("#auditExample"),
  expectedCaseInput: document.querySelector("#expectedCaseInput"),
  compareResult: document.querySelector("#compareResult"),
  auditOutput: document.querySelector("#auditOutput"),
  fourLessons: document.querySelector("#fourLessons"),
  threePasses: document.querySelector("#threePasses"),
  selectionPanel: document.querySelector("#selectionPanel"),
  drawLog: document.querySelector("#drawLog"),
  ichingBadge: document.querySelector("#ichingBadge"),
  primaryHexagram: document.querySelector("#primaryHexagram"),
  changedHexagram: document.querySelector("#changedHexagram"),
  primaryHexName: document.querySelector("#primaryHexName"),
  changedHexName: document.querySelector("#changedHexName"),
  ichingMeaning: document.querySelector("#ichingMeaning"),
  meihuaBadge: document.querySelector("#meihuaBadge"),
  meihuaPanel: document.querySelector("#meihuaPanel"),
  meihuaMeaning: document.querySelector("#meihuaMeaning"),
  copyReading: document.querySelector("#copyReading"),
  clearHistory: document.querySelector("#clearHistory"),
  historyCount: document.querySelector("#historyCount"),
  historyList: document.querySelector("#historyList"),
  revealCards: [...document.querySelectorAll(".reveal-card")],
};

const loadingButtons = [...document.querySelectorAll("button:not(#copyReading):not(#clearHistory):not(#copyAuditJson):not(#compareAudit)")];
const historyKey = "quantum-liuren-history-v1";

const smallLiuren = [
  { name: "大安", tone: "吉", score: 2, meaning: "主安定、守成、可按計畫推進。宜穩，不宜躁進。", advice: "把事情放回秩序裡，先做已經確定的部分。" },
  { name: "留連", tone: "緩", score: -1, meaning: "主拖延、牽絆、反覆。事有未清，宜查缺口。", advice: "不要急著定案，先問：誰還沒表態？哪個條件還沒落地？" },
  { name: "速喜", tone: "吉", score: 2, meaning: "主快訊、喜象、事情有回應。宜主動聯絡、趁勢推進。", advice: "把握短窗口，今天適合發訊息、約時間、提出下一步。" },
  { name: "赤口", tone: "凶", score: -2, meaning: "主口舌、衝突、誤會。宜少說重話，多留文字證據。", advice: "先降溫，再談判；不要在情緒最滿時做最後決定。" },
  { name: "小吉", tone: "小吉", score: 1, meaning: "主小成、貴人、漸進之喜。可做，但要把期待放小。", advice: "尋找小幫手或小入口，先拿一個可驗證成果。" },
  { name: "空亡", tone: "空", score: -2, meaning: "主落空、虛象、資訊不足。宜暫緩承諾，補齊證據。", advice: "現在最重要的是驗證真偽，不是加碼投入。" },
];

const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const generals = ["貴人", "螣蛇", "朱雀", "六合", "勾陳", "青龍", "天空", "白虎", "太常", "玄武", "太陰", "天后"];
const branchElement = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};
const stemElement = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};
const controls = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
const stemLodge = {
  甲: "寅", 乙: "辰", 丙: "巳", 丁: "未", 戊: "巳",
  己: "未", 庚: "申", 辛: "戌", 壬: "亥", 癸: "丑",
};
const nobleByStem = {
  甲: { day: "丑", night: "未" },
  戊: { day: "丑", night: "未" },
  庚: { day: "丑", night: "未" },
  乙: { day: "子", night: "申" },
  己: { day: "子", night: "申" },
  丙: { day: "亥", night: "酉" },
  丁: { day: "亥", night: "酉" },
  壬: { day: "巳", night: "卯" },
  癸: { day: "巳", night: "卯" },
  辛: { day: "午", night: "寅" },
};
const passNames = ["初傳", "中傳", "末傳"];
const lessonNames = ["一課", "二課", "三課", "四課"];
const ritualLabels = ["靜心", "取數", "起小六壬", "布大盤", "成卦"];
const trigramOrder = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
const trigrams = {
  乾: { symbol: "☰", lines: [1, 1, 1], image: "天", nature: "健、開創、主動" },
  兌: { symbol: "☱", lines: [1, 1, 0], image: "澤", nature: "悅、交流、承諾" },
  離: { symbol: "☲", lines: [1, 0, 1], image: "火", nature: "明、呈現、依附" },
  震: { symbol: "☳", lines: [1, 0, 0], image: "雷", nature: "動、啟發、驚醒" },
  巽: { symbol: "☴", lines: [0, 1, 1], image: "風", nature: "入、滲透、協商" },
  坎: { symbol: "☵", lines: [0, 1, 0], image: "水", nature: "險、流動、試探" },
  艮: { symbol: "☶", lines: [0, 0, 1], image: "山", nature: "止、界線、沉澱" },
  坤: { symbol: "☷", lines: [0, 0, 0], image: "地", nature: "順、承載、配合" },
};
const hexagramNames = {
  1: "乾為天", 2: "坤為地", 3: "水雷屯", 4: "山水蒙", 5: "水天需", 6: "天水訟", 7: "地水師", 8: "水地比",
  9: "風天小畜", 10: "天澤履", 11: "地天泰", 12: "天地否", 13: "天火同人", 14: "火天大有", 15: "地山謙", 16: "雷地豫",
  17: "澤雷隨", 18: "山風蠱", 19: "地澤臨", 20: "風地觀", 21: "火雷噬嗑", 22: "山火賁", 23: "山地剝", 24: "地雷復",
  25: "天雷無妄", 26: "山天大畜", 27: "山雷頤", 28: "澤風大過", 29: "坎為水", 30: "離為火", 31: "澤山咸", 32: "雷風恆",
  33: "天山遯", 34: "雷天大壯", 35: "火地晉", 36: "地火明夷", 37: "風火家人", 38: "火澤睽", 39: "水山蹇", 40: "雷水解",
  41: "山澤損", 42: "風雷益", 43: "澤天夬", 44: "天風姤", 45: "澤地萃", 46: "地風升", 47: "澤水困", 48: "水風井",
  49: "澤火革", 50: "火風鼎", 51: "震為雷", 52: "艮為山", 53: "風山漸", 54: "雷澤歸妹", 55: "雷火豐", 56: "火山旅",
  57: "巽為風", 58: "兌為澤", 59: "風水渙", 60: "水澤節", 61: "風澤中孚", 62: "雷山小過", 63: "水火既濟", 64: "火水未濟",
};
const hexagramTable = {
  乾: { 乾: 1, 兌: 43, 離: 14, 震: 34, 巽: 9, 坎: 5, 艮: 26, 坤: 11 },
  兌: { 乾: 10, 兌: 58, 離: 38, 震: 54, 巽: 61, 坎: 60, 艮: 41, 坤: 19 },
  離: { 乾: 13, 兌: 49, 離: 30, 震: 55, 巽: 37, 坎: 63, 艮: 22, 坤: 36 },
  震: { 乾: 25, 兌: 17, 離: 21, 震: 51, 巽: 42, 坎: 3, 艮: 27, 坤: 24 },
  巽: { 乾: 44, 兌: 28, 離: 50, 震: 32, 巽: 57, 坎: 48, 艮: 18, 坤: 46 },
  坎: { 乾: 6, 兌: 47, 離: 64, 震: 40, 巽: 59, 坎: 29, 艮: 4, 坤: 7 },
  艮: { 乾: 33, 兌: 31, 離: 56, 震: 62, 巽: 53, 坎: 39, 艮: 52, 坤: 15 },
  坤: { 乾: 12, 兌: 45, 離: 35, 震: 16, 巽: 20, 坎: 8, 艮: 23, 坤: 2 },
};

const branchMeaning = {
  子: "暗流、消息、起念",
  丑: "積累、遲滯、內部條件",
  寅: "啟動、突破、新局",
  卯: "關係、協調、文書",
  辰: "變動、卡點、舊帳",
  巳: "顯露、熱度、快速反應",
  午: "明朗、壓力、名聲",
  未: "收束、資源、照顧",
  申: "規則、工具、執行",
  酉: "結果、談判、取捨",
  戌: "防守、邊界、風險",
  亥: "隱情、休養、遠方",
};

const generalMeaning = {
  貴人: "有助力、可求穩妥之人",
  螣蛇: "疑慮與想像偏多",
  朱雀: "訊息、表達、口舌",
  六合: "合作、撮合、關係",
  勾陳: "舊事、責任、牽連",
  青龍: "財氣、喜事、成長",
  天空: "落空、延遲、未成形",
  白虎: "壓力、損耗、硬碰硬",
  太常: "資源、規格、穩定供應",
  玄武: "隱情、保密、不可見風險",
  太陰: "細節、內在、暗中助力",
  天后: "包容、修復、後援",
};

const topicProfiles = {
  general: {
    label: "綜合",
    advice: "用它當作一面鏡子：看盤面提醒你哪裡該動、哪裡該停。",
    focus: "先抓住最有證據的一步，不急著把整件事一次定死。",
  },
  work: {
    label: "事業 / 合作",
    advice: "合作與事業題，優先看責任、時程、誰能拍板。",
    focus: "先確認權責、交付物與決策人；盤面不順時，合約與文字紀錄比口頭承諾可靠。",
  },
  money: {
    label: "財務 / 投資",
    advice: "財務題請保守處理，卦象只提醒風險，不應替代數字與合約。",
    focus: "先看風險上限、退出條件與現金流；偏凶時不要加碼，只做驗證。",
  },
  relationship: {
    label: "感情 / 人際",
    advice: "感情與人際題，先看溝通是否清楚，再看行動是否一致。",
    focus: "先分清楚真實行動與情緒投射；赤口、留連、空亡出現時，要慢一點說重話。",
  },
  travel: {
    label: "出行 / 搬動",
    advice: "出行搬動題，先檢查文件、時間、交通與備案。",
    focus: "先查路線、文件、預算與替代方案；盤面有阻時，保留緩衝時間。",
  },
  health: {
    label: "身心狀態",
    advice: "身心題只作自我覺察；若有症狀或風險，請直接找專業人士。",
    focus: "把卦象當成提醒身體和情緒的訊號；任何症狀、用藥或急性風險都交給專業判斷。",
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setLoading(isLoading) {
  state.loading = isLoading;
  loadingButtons.forEach((button) => {
    button.disabled = isLoading;
  });
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToBits(bytes) {
  return [...bytes].map((byte) => byte.toString(2).padStart(8, "0")).join(" ");
}

function formatHex(hex) {
  return hex.match(/.{1,32}/g).join("\n");
}

function randomHexFromBrowser(byteCount) {
  const bytes = new Uint8Array(byteCount);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseRandomPayload(payload, byteCount) {
  if (payload && payload.bytes && payload.bytes.length === byteCount * 2) {
    return { bytes: payload.bytes, source: payload.source || "Local API", quantum: Boolean(payload.quantum) };
  }
  if (payload && payload.success === true && Array.isArray(payload.data) && payload.data.length === byteCount) {
    const hex = payload.data.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return { bytes: hex, source: "ANU hardware QRNG", quantum: true };
  }
  throw new Error("Unexpected random source response");
}

async function fetchJson(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function getRandomPayload(byteCount) {
  const sources = [
    `api/random?bytes=${byteCount}`,
    `https://qrng.anu.edu.au/API/jsonI.php?length=${byteCount}&type=uint8`,
  ];

  for (const source of sources) {
    try {
      return parseRandomPayload(await fetchJson(source), byteCount);
    } catch {
      // Try the next source. GitHub Pages has no local API, and public QRNG APIs can be temporarily unavailable.
    }
  }

  return {
    bytes: randomHexFromBrowser(byteCount),
    source: "Browser crypto fallback",
    quantum: false,
  };
}

function resetRevealCards() {
  els.revealCards.forEach((card) => {
    card.classList.remove("revealed");
  });
}

function revealCard(index) {
  if (els.revealCards[index]) {
    els.revealCards[index].classList.add("revealed");
  }
}

function renderRitual(stepIndex = -1, label = "待命") {
  els.ritualState.textContent = label;
  els.ritualSteps.innerHTML = ritualLabels
    .map((item, index) => {
      let className = "ritual-step";
      if (index < stepIndex) className += " done";
      if (index === stepIndex) className += " active";
      return `<div class="${className}"><span>${index + 1}</span><strong>${item}</strong></div>`;
    })
    .join("");
}

async function fetchBytes(count = 96) {
  const payload = await getRandomPayload(count);
  const bytes = hexToBytes(payload.bytes);

  state.bytes = bytes;
  state.cursor = 0;

  els.hexOutput.textContent = formatHex(payload.bytes);
  els.bitsOutput.textContent = bytesToBits(bytes);
  els.sourceName.textContent = payload.source;
  els.sourceMeta.textContent = payload.quantum
    ? `量子來源，${bytes.length} bytes`
    : "API 無法使用，已切到本機加密隨機數";
  els.sourceDot.classList.toggle("quantum", Boolean(payload.quantum));

  return bytes;
}

async function ensureBytes(needed) {
  if (state.cursor + needed <= state.bytes.length) return;
  await fetchBytes(Math.max(96, needed * 4));
}

async function nextUint32() {
  await ensureBytes(4);
  const view = new DataView(state.bytes.buffer, state.bytes.byteOffset + state.cursor, 4);
  state.cursor += 4;
  return view.getUint32(0, false);
}

async function randomInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  if (!Number.isSafeInteger(low) || !Number.isSafeInteger(high) || high < low) {
    throw new Error("Invalid range");
  }

  const range = high - low + 1;
  const maxUint = 4294967296;
  const limit = Math.floor(maxUint / range) * range;

  while (true) {
    const value = await nextUint32();
    if (value < limit) return low + (value % range);
  }
}

function rotate(list, start) {
  return list.map((_, index) => list[(start + index) % list.length]);
}

function ganzhi(stemIndex, branchIndex) {
  return `${stems[((stemIndex % 10) + 10) % 10]}${branches[((branchIndex % 12) + 12) % 12]}`;
}

function dateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCastDate() {
  if (els.castMode.value === "custom" && els.castDateTime.value) {
    return new Date(els.castDateTime.value);
  }
  return new Date();
}

function getYearGanzhi(date) {
  let year = date.getFullYear();
  const lichunApprox = new Date(year, 1, 4, 0, 0, 0);
  if (date < lichunApprox) year -= 1;
  return {
    year,
    stemIndex: (year - 4) % 10,
    branchIndex: (year - 4) % 12,
  };
}

function getSolarMonthInfo(date, yearStemIndex) {
  const boundaries = [
    [1, 4, "寅"],
    [2, 6, "卯"],
    [3, 5, "辰"],
    [4, 6, "巳"],
    [5, 6, "午"],
    [6, 7, "未"],
    [7, 8, "申"],
    [8, 8, "酉"],
    [9, 8, "戌"],
    [10, 7, "亥"],
    [11, 7, "子"],
    [0, 6, "丑"],
  ];
  let solarMonth = 11;
  for (let index = 0; index < boundaries.length; index += 1) {
    const [month, day] = boundaries[index];
    const boundaryYear = month === 0 ? date.getFullYear() + 1 : date.getFullYear();
    if (date >= new Date(boundaryYear, month, day, 0, 0, 0)) solarMonth = index;
  }
  if (date < new Date(date.getFullYear(), 1, 4, 0, 0, 0)) solarMonth = 11;

  const branch = boundaries[solarMonth][2];
  const yinStemStartByYearStem = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIndex = (yinStemStartByYearStem[((yearStemIndex % 10) + 10) % 10] + solarMonth) % 10;
  return {
    solarMonth,
    stemIndex,
    branchIndex: branches.indexOf(branch),
  };
}

function getDayGanzhi(date) {
  const base = new Date(1984, 1, 2);
  const days = Math.floor((dateOnly(date) - dateOnly(base)) / 86400000);
  const index = ((days % 60) + 60) % 60;
  return {
    index,
    stemIndex: index % 10,
    branchIndex: index % 12,
  };
}

function getHourInfo(date, dayStemIndex) {
  const hour = date.getHours();
  const branchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const ziStemStartByDayStem = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const stemIndex = (ziStemStartByDayStem[((dayStemIndex % 10) + 10) % 10] + branchIndex) % 10;
  return { branchIndex, stemIndex };
}

function getXunKong(dayIndex) {
  const xunStart = Math.floor(dayIndex / 10) * 10;
  return [branches[(xunStart + 10) % 12], branches[(xunStart + 11) % 12]];
}

function getMonthGeneral(date) {
  const rules = [
    [0, 20, "子", "大寒"],
    [1, 19, "亥", "雨水"],
    [2, 21, "戌", "春分"],
    [3, 20, "酉", "穀雨"],
    [4, 21, "申", "小滿"],
    [5, 21, "未", "夏至"],
    [6, 23, "午", "大暑"],
    [7, 23, "巳", "處暑"],
    [8, 23, "辰", "秋分"],
    [9, 23, "卯", "霜降"],
    [10, 22, "寅", "小雪"],
    [11, 22, "丑", "冬至"],
  ];
  let active = rules[11];
  for (const rule of rules) {
    if (date >= new Date(date.getFullYear(), rule[0], rule[1], 0, 0, 0)) active = rule;
  }
  return {
    branch: active[2],
    branchIndex: branches.indexOf(active[2]),
    term: active[3],
  };
}

function buildCalendarBase(date) {
  const year = getYearGanzhi(date);
  const month = getSolarMonthInfo(date, year.stemIndex);
  const day = getDayGanzhi(date);
  const hour = getHourInfo(date, day.stemIndex);
  const monthGeneral = getMonthGeneral(date);
  const xunKong = getXunKong(day.index);

  return {
    iso: date.toISOString(),
    localText: date.toLocaleString("zh-Hant", { dateStyle: "medium", timeStyle: "short" }),
    yearGanzhi: ganzhi(year.stemIndex, year.branchIndex),
    monthGanzhi: ganzhi(month.stemIndex, month.branchIndex),
    dayGanzhi: ganzhi(day.stemIndex, day.branchIndex),
    hourGanzhi: ganzhi(hour.stemIndex, hour.branchIndex),
    dayStem: stems[day.stemIndex],
    dayBranch: branches[day.branchIndex],
    hourBranch: branches[hour.branchIndex],
    hourBranchIndex: hour.branchIndex,
    monthGeneral: monthGeneral.branch,
    monthGeneralIndex: monthGeneral.branchIndex,
    monthGeneralTerm: monthGeneral.term,
    xunKong,
    dayIndex: day.index,
    note: "月將採固定節氣日期近似；正式版可替換為精確天文節氣。",
  };
}

function elementControls(a, b) {
  return controls[a] === b;
}

function branchDistance(from, to) {
  return (branches.indexOf(to) - branches.indexOf(from) + 12) % 12;
}

function buildHeavenPlate(monthGeneralIndex, hourBranchIndex) {
  return branches.map((earth, earthIndex) => ({
    earth,
    heaven: branches[(monthGeneralIndex + earthIndex - hourBranchIndex + 12) % 12],
  }));
}

function heavenOver(heavenPlate, branch) {
  return heavenPlate[branches.indexOf(branch)].heaven;
}

function buildSkyGenerals(calendarBase, heavenPlate) {
  const dayPart = new Date(calendarBase.iso).getHours() >= 6 && new Date(calendarBase.iso).getHours() < 18 ? "day" : "night";
  const nobleBranch = nobleByStem[calendarBase.dayStem][dayPart];
  const nobleEarthIndex = heavenPlate.findIndex((item) => item.heaven === nobleBranch);
  const forward = ["亥", "子", "丑", "寅", "卯", "辰"].includes(branches[nobleEarthIndex]);
  const orderedGenerals = forward ? generals : [generals[0], ...generals.slice(1).reverse()];
  const skyGenerals = {};
  orderedGenerals.forEach((general, offset) => {
    skyGenerals[branches[(nobleEarthIndex + offset) % 12]] = general;
  });
  return { skyGenerals, nobleBranch, forward, dayPart };
}

function buildFormalLessons(calendarBase, heavenPlate, skyGenerals) {
  const dayStemLodge = stemLodge[calendarBase.dayStem];
  const firstUpper = heavenOver(heavenPlate, dayStemLodge);
  const secondUpper = heavenOver(heavenPlate, firstUpper);
  const thirdUpper = heavenOver(heavenPlate, calendarBase.dayBranch);
  const fourthUpper = heavenOver(heavenPlate, thirdUpper);
  const raw = [
    { label: "干陽", lower: dayStemLodge, upper: firstUpper, source: `${calendarBase.dayStem}寄${dayStemLodge}` },
    { label: "干陰", lower: firstUpper, upper: secondUpper, source: "干陽上神再上" },
    { label: "支陽", lower: calendarBase.dayBranch, upper: thirdUpper, source: `日支${calendarBase.dayBranch}` },
    { label: "支陰", lower: thirdUpper, upper: fourthUpper, source: "支陽上神再上" },
  ];
  return raw.map((lesson) => {
    const lowerElement = branchElement[lesson.lower];
    const upperElement = branchElement[lesson.upper];
    const relation = elementControls(lowerElement, upperElement)
      ? "下賊上"
      : elementControls(upperElement, lowerElement)
        ? "上克下"
        : "無克";
    return {
      ...lesson,
      lowerElement,
      upperElement,
      relation,
      general: skyGenerals[lesson.upper],
    };
  });
}

function uniqueBranches(items) {
  return [...new Set(items)];
}

function lessonRelationKind(lesson) {
  if (elementControls(lesson.lowerElement, lesson.upperElement)) return "thief";
  if (elementControls(lesson.upperElement, lesson.lowerElement)) return "overcome";
  return "none";
}

function lessonRelationText(kind) {
  if (kind === "thief") return "下賊上";
  if (kind === "overcome") return "上克下";
  return "無克";
}

function chooseByBiYongOrSheHai(candidates, calendarBase) {
  if (candidates.length === 1) {
    return { lesson: candidates[0], method: "賊克", reason: "只有一課發動，直接取發用。" };
  }
  const dayStemElement = stemElement[calendarBase.dayStem];
  const sameElement = candidates.filter((item) => branchElement[item.upper] === dayStemElement);
  if (sameElement.length === 1) {
    return { lesson: sameElement[0], method: "比用", reason: "多課發動，取與日干同五行者為用。" };
  }
  const ranked = [...(sameElement.length ? sameElement : candidates)].sort((a, b) => {
    const aDepth = branchDistance(a.lower, a.upper);
    const bDepth = branchDistance(b.lower, b.upper);
    return bDepth - aDepth;
  });
  return { lesson: ranked[0], method: "涉害", reason: "多課同類，取涉害較深者作發用近似。" };
}

function isFanYin(heavenPlate) {
  return heavenPlate.every((item) => branchDistance(item.earth, item.heaven) === 6);
}

function isFuYin(calendarBase, heavenPlate) {
  return heavenOver(heavenPlate, calendarBase.dayBranch) === calendarBase.dayBranch;
}

function isBaZhuan(calendarBase) {
  return ["甲", "庚", "丁", "己"].includes(calendarBase.dayStem);
}

function isBieZe(formalLessons) {
  return uniqueBranches(formalLessons.map((item) => item.upper)).length <= 3;
}

function buildSequentialTransmissions(first, heavenPlate, skyGenerals, source) {
  const second = heavenOver(heavenPlate, first);
  const third = heavenOver(heavenPlate, second);
  return [
    { label: "初傳", branch: first, general: skyGenerals[first] || "", source },
    { label: "中傳", branch: second, general: skyGenerals[second] || "", source: "初傳上神" },
    { label: "末傳", branch: third, general: skyGenerals[third] || "", source: "中傳上神" },
  ];
}

function buildFormalTransmissionsRefined(calendarBase, heavenPlate, formalLessons, skyGenerals) {
  const steps = [];
  const enriched = formalLessons.map((lesson) => ({ ...lesson, relationKind: lessonRelationKind(lesson) }));
  const thief = enriched.filter((item) => item.relationKind === "thief");
  const overcome = enriched.filter((item) => item.relationKind === "overcome");
  steps.push(`四課克賊：${enriched.map((item) => `${item.label}${lessonRelationText(item.relationKind)}`).join("，")}`);

  let method = "";
  let note = "";
  let first = "";
  let source = "";

  if (thief.length || overcome.length) {
    const candidates = thief.length ? thief : overcome;
    const chosen = chooseByBiYongOrSheHai(candidates, calendarBase);
    method = chosen.method;
    note = chosen.reason;
    first = chosen.lesson.upper;
    source = chosen.lesson.label;
    steps.push(`克賊候選：${candidates.map((item) => `${item.label}${item.lower}->${item.upper}`).join("，")}`);
  } else if (isFanYin(heavenPlate)) {
    method = "返吟";
    note = "天地盤上下相沖，按返吟骨架取支上發用。";
    first = heavenOver(heavenPlate, calendarBase.dayBranch);
    source = "返吟支上";
  } else if (isFuYin(calendarBase, heavenPlate)) {
    method = "伏吟";
    note = "日支上見本支，按伏吟骨架取支上發用。";
    first = calendarBase.dayBranch;
    source = "伏吟支上";
  } else if (isBaZhuan(calendarBase)) {
    method = "八專";
    note = "四課無克且日干落八專取法範圍，按八專骨架取干陽上神。";
    first = formalLessons[0].upper;
    source = "八專干陽";
  } else if (isBieZe(formalLessons)) {
    method = "別責";
    note = "四課不備或上神重複，按別責骨架另取責神。";
    first = formalLessons[1].upper;
    source = "別責干陰";
  } else {
    method = "昴星";
    note = "四課無克無特殊課體，按昴星骨架取酉位相關上神。";
    first = heavenOver(heavenPlate, "酉");
    source = "昴星酉上";
  }

  const transmissions = buildSequentialTransmissions(first, heavenPlate, skyGenerals, source);
  steps.push(`取法：${method}；初傳取${first}。`);

  return {
    method,
    note,
    steps,
    transmissions,
    activeRelations: uniqueBranches([...thief, ...overcome].map((item) => item.upper)),
  };
}

function buildFormalLiuRen(calendarBase) {
  const heavenPlate = buildHeavenPlate(calendarBase.monthGeneralIndex, calendarBase.hourBranchIndex);
  const skyGeneralData = buildSkyGenerals(calendarBase, heavenPlate);
  const lessons = buildFormalLessons(calendarBase, heavenPlate, skyGeneralData.skyGenerals);
  const transmissions = buildFormalTransmissionsRefined(calendarBase, heavenPlate, lessons, skyGeneralData.skyGenerals);
  return { heavenPlate, skyGeneralData, lessons, transmissions };
}

function pickText(score, small, firstPass, lastPass) {
  if (score >= 4) return `卦象偏吉，${small.name}得勢，${firstPass.branch}起、${lastPass.branch}收，事情有推進空間。`;
  if (score >= 1) return `卦象可行但需修整，${small.name}給出方向，先處理「${firstPass.keyword}」再求結果。`;
  if (score === 0) return "卦象中平，未見大凶也未見大成。此事要靠條件成熟，不宜只憑期待。";
  if (score >= -2) return `卦象有阻，${small.name}提示節奏不順，${firstPass.general}臨初傳，先降風險。`;
  return `卦象偏凶或偏空，${small.name}主警訊，宜暫緩承諾，先查證再行動。`;
}

function pickTopicReading(reading) {
  const profile = topicProfiles[reading.topic] || topicProfiles.general;
  const passTone = reading.passes.some((item) => ["天空", "白虎", "玄武", "螣蛇"].includes(item.general))
    ? "盤中有隱憂或阻力，先把風險寫出來。"
    : "盤中仍有可用資源，可找一個小切口推進。";
  return `${profile.advice} ${profile.focus} ${passTone}`;
}

function midnightNote(reading) {
  if (!reading.calendarBase?.iso) return "";
  const castDate = new Date(reading.calendarBase.iso);
  if (castDate.getHours() === 0) {
    return "這一課已經過了凌晨 00:00，盤面以新日曆日的子時來看；若你心裡問的是昨晚延續的事，解讀時要把「昨天留下的尾巴」和「今天開始的變化」分開。";
  }
  return "";
}

function scorePlainMeaning(score) {
  if (score >= 4) return "整體氣勢偏順，事情不是完全沒有阻力，但有可以推動的路。";
  if (score >= 1) return "這件事可以試，但要先修條件、補資訊，不適合一口氣壓到底。";
  if (score === 0) return "卦象偏中平，成不成主要看現實條件是否成熟。";
  if (score >= -2) return "盤面有卡點，現在先處理風險，比急著追結果更重要。";
  return "卦象提醒偏保守，先不要重押承諾，等資訊更清楚再動。";
}

function buildPlainSummary(reading) {
  const profile = topicProfiles[reading.topic] || topicProfiles.general;
  const firstPass = reading.passes[0];
  const lastPass = reading.passes[2];
  const formal = reading.formalLiuRen?.transmissions;
  const moving = reading.iching.moving.length ? `動爻在第 ${reading.iching.moving.join("、")} 爻` : "沒有動爻";
  const method = formal?.method ? `大六壬取法為「${formal.method}」` : "大六壬取法尚未明確";
  const midnight = midnightNote(reading);
  const lines = [
    `白話來說：${scorePlainMeaning(reading.score)}`,
    `小六壬落「${reading.small.name}」，它給的提醒是：${reading.small.meaning}`,
    `${method}，三傳從「${firstPass.branch}」起，到「${lastPass.branch}」收，表示事情先看「${firstPass.keyword}」，最後會落到「${lastPass.keyword}」。`,
    `易經是「${reading.iching.primary.name}」變「${reading.iching.changed.name}」，${moving}；梅花是「${reading.meihua.primary.name}」變「${reading.meihua.changed.name}」，重點在變化方向而不是一句定生死。`,
    `所以這題先抓一個重點：${profile.focus} ${profile.advice}`,
  ];
  if (midnight) lines.push(midnight);
  return lines.join("\n");
}

function detailHtml(title, lines) {
  return `<div class="selection-detail"><strong>${escapeHtml(title)}</strong>${lines
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("")}</div>`;
}

function setSelectionPanel(html) {
  els.selectionPanel.innerHTML = html;
}

function buildBranchCell(earth, heaven, general, index, active, hour) {
  const activeClass = active ? " active" : "";
  const hourClass = hour ? " hour" : "";
  return `<button class="branch-cell${activeClass}${hourClass}" data-kind="branch" data-index="${index}" type="button">
    <span>${earth}</span>
    <strong>${heaven}</strong>
    <small>${general}</small>
  </button>`;
}

function renderBranchWheel(reading) {
  const heavenPlate = rotate(branches, reading.monthGeneralIndex);
  els.branchWheel.innerHTML = branches
    .map((earth, index) =>
      buildBranchCell(
        earth,
        heavenPlate[index],
        generals[(index + reading.hourIndex) % 12],
        index,
        index === reading.focusIndex,
        index === reading.hourIndex,
      ),
    )
    .join("");
}

function renderList(target, items, className, kind) {
  target.innerHTML = items
    .map(
      (item, index) => `<button class="${className}" data-kind="${kind}" data-index="${index}" type="button">
        <span>${item.label}</span>
        <strong>${item.branch}</strong>
        <em>${item.general}</em>
        <small>${item.keyword}</small>
      </button>`,
    )
    .join("");
}

function showDetail(kind, index) {
  if (!state.latestReading) return;

  const reading = state.latestReading;
  state.selectedDetail = { kind, index };

  if (kind === "branch") {
    const earth = branches[index];
    const heaven = rotate(branches, reading.monthGeneralIndex)[index];
    const general = generals[(index + reading.hourIndex) % 12];
    const isFocus = index === reading.focusIndex;
    setSelectionPanel(
      detailHtml(`${earth}宮`, [
        `天盤落 ${heaven}，天將為 ${general}。`,
        `地支意象：${branchMeaning[earth]}。`,
        `天將意象：${generalMeaning[general]}。`,
        isFocus ? "這是本次問事的焦點宮位，解讀權重最高。" : "這個位置可當作旁證，協助理解事情周邊氣候。",
      ]),
    );
    return;
  }

  if (kind === "lesson") {
    const item = reading.lessons[index];
    setSelectionPanel(
      detailHtml(item.label, [
        `${item.branch}配${item.general}。`,
        item.keyword,
        "四課可以理解成事情的背景條件、互動方式與明面結構。",
      ]),
    );
    return;
  }

  if (kind === "pass") {
    const item = reading.passes[index];
    setSelectionPanel(
      detailHtml(item.label, [
        `${item.branch}配${item.general}。`,
        item.keyword,
        index === 0 ? "初傳看事情怎麼起。" : index === 1 ? "中傳看過程怎麼走。" : "末傳看最後怎麼收。",
      ]),
    );
  }
}

function attachDetailEvents() {
  document.querySelectorAll("[data-kind]").forEach((node) => {
    node.addEventListener("click", () => {
      showDetail(node.dataset.kind, Number(node.dataset.index));
    });
  });
}

function buildReading(readingInput) {
  const { small, smallDraws, monthGeneralIndex, hourIndex, subjectIndex, matterIndex } = readingInput;
  const focusIndex = (subjectIndex + matterIndex + readingInput.smallIndex) % 12;
  const heavenPlate = rotate(branches, monthGeneralIndex);

  const lessons = lessonNames.map((label, index) => {
    const branch = heavenPlate[(subjectIndex + index * 2) % 12];
    const general = generals[(hourIndex + index * 3) % 12];
    return { label, branch, general, keyword: `${branchMeaning[branch]}；${generalMeaning[general]}` };
  });

  const passes = passNames.map((label, index) => {
    const branch = heavenPlate[(focusIndex + index * 4 + smallDraws[index]) % 12];
    const general = generals[(focusIndex + hourIndex + index * 2) % 12];
    return { label, branch, general, keyword: `${branchMeaning[branch]}；${generalMeaning[general]}` };
  });

  const passScore = passes.reduce((sum, item) => {
    if (["貴人", "六合", "青龍", "太常", "太陰", "天后"].includes(item.general)) return sum + 1;
    if (["螣蛇", "勾陳", "天空", "白虎", "玄武"].includes(item.general)) return sum - 1;
    return sum;
  }, 0);

  return {
    ...readingInput,
    focusIndex,
    heavenPlate,
    lessons,
    passes,
    score: small.score + passScore,
  };
}

function trigramFromLines(lines) {
  return trigramOrder.find((name) => trigrams[name].lines.every((line, index) => line === lines[index]));
}

function hexagramFromLines(lines) {
  const lower = trigramFromLines(lines.slice(0, 3));
  const upper = trigramFromLines(lines.slice(3, 6));
  const number = hexagramTable[lower][upper];
  return { number, name: hexagramNames[number], upper, lower, lines };
}

async function buildIChing() {
  const values = [];
  const lines = [];
  const moving = [];

  for (let index = 0; index < 6; index += 1) {
    const value = 6 + (await randomInt(0, 1)) + (await randomInt(0, 1)) + (await randomInt(0, 1));
    values.push(value);
    lines.push(value === 7 || value === 9 ? 1 : 0);
    if (value === 6 || value === 9) moving.push(index + 1);
  }

  const changedLines = lines.map((line, index) => (moving.includes(index + 1) ? 1 - line : line));
  return {
    values,
    lines,
    moving,
    primary: hexagramFromLines(lines),
    changed: hexagramFromLines(changedLines),
  };
}

async function buildMeihua() {
  const upperDraw = await randomInt(1, 8);
  const lowerDraw = await randomInt(1, 8);
  const movingDraw = await randomInt(1, 6);
  const draws = [upperDraw, lowerDraw, movingDraw];
  const upper = trigramOrder[upperDraw - 1];
  const lower = trigramOrder[lowerDraw - 1];
  const movingLine = movingDraw;
  const primaryLines = [...trigrams[lower].lines, ...trigrams[upper].lines];
  const changedLines = primaryLines.map((line, index) => (index + 1 === movingLine ? 1 - line : line));

  return {
    draws,
    upper,
    lower,
    movingLine,
    primary: hexagramFromLines(primaryLines),
    changed: hexagramFromLines(changedLines),
  };
}

function verdictLabel(score) {
  if (score >= 2) return "偏吉";
  if (score <= -2) return "偏凶";
  return "中平";
}

function formatReadingText(reading) {
  const hasIChing = Boolean(reading.iching && reading.iching.primary && reading.iching.changed);
  const hasMeihua = Boolean(reading.meihua && reading.meihua.primary && reading.meihua.changed);
  const ichingText = hasIChing
    ? `${reading.iching.primary.name} -> ${reading.iching.changed.name}（動爻：${reading.iching.moving && reading.iching.moving.length ? reading.iching.moving.join(", ") : "無"}）`
    : "—";
  const meihuaText = hasMeihua
    ? `${reading.meihua.upper}上${reading.meihua.lower}下，動${reading.meihua.movingLine}爻，${reading.meihua.primary.name} -> ${reading.meihua.changed.name}`
    : "—";
  const plainSummaryText = reading.plainSummary || (hasIChing && hasMeihua && reading.passes ? buildPlainSummary(reading) : "—");
  return [
    "量子六壬問事",
    `問題：${reading.question}`,
    `類型：${reading.topicLabel}`,
    `總斷：${reading.verdictText}`,
    `建議：${reading.adviceText}`,
    `白話總結：${plainSummaryText}`,
    `起課時間：${reading.calendarBase ? reading.calendarBase.localText : "未記錄"}`,
    `四柱：${reading.calendarBase ? `${reading.calendarBase.yearGanzhi} ${reading.calendarBase.monthGanzhi} ${reading.calendarBase.dayGanzhi} ${reading.calendarBase.hourGanzhi}` : "未記錄"}`,
    `月將 / 占時 / 旬空：${reading.calendarBase ? `${reading.calendarBase.monthGeneral} / ${reading.calendarBase.hourBranch} / ${reading.calendarBase.xunKong.join(", ")}` : "未記錄"}`,
    `小六壬：${reading.small.name}（${reading.smallDraws.join(" / ")}）`,
    `月將：${branches[reading.monthGeneralIndex]}，占時：${branches[reading.hourIndex]}，焦點：${branches[reading.focusIndex]}宮`,
    `四課：${reading.lessons.map((item) => `${item.label}${item.branch}${item.general}`).join(" / ")}`,
    `三傳：${reading.passes.map((item) => `${item.label}${item.branch}${item.general}`).join(" / ")}`,
    `易經：${ichingText}`,
    `梅花：${meihuaText}`,
    `分數：${reading.score}`,
  ].join("\n");
}

function saveHistory() {
  localStorage.setItem(historyKey, JSON.stringify(state.history));
}

function loadHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(historyKey) || "[]");
    state.history = Array.isArray(stored) ? stored.slice(0, 5) : [];
  } catch {
    state.history = [];
  }
}

function renderHistory() {
  els.historyCount.textContent = `${state.history.length} 筆`;
  if (state.history.length === 0) {
    els.historyList.innerHTML = '<p class="empty-note">起課後會自動保留最近五筆，方便回看與比較。</p>';
    return;
  }

  els.historyList.innerHTML = state.history
    .map(
      (reading, index) => `<button class="history-item" data-history-index="${index}" type="button">
        <span>${escapeHtml(reading.timeLabel)}</span>
        <strong>${escapeHtml(reading.question)}</strong>
        <small>${escapeHtml(reading.small.name)} · ${branches[reading.focusIndex]}宮 · ${escapeHtml(reading.verdictLabel)}</small>
      </button>`,
    )
    .join("");

  document.querySelectorAll("[data-history-index]").forEach((node) => {
    node.addEventListener("click", () => {
      const reading = state.history[Number(node.dataset.historyIndex)];
      if (!reading) return;
      state.latestReading = reading;
      renderReading(reading, { addToHistory: false });
      els.revealCards.forEach((card) => card.classList.add("revealed"));
      showDetail("branch", reading.focusIndex);
    });
  });
}

function addHistory(reading) {
  state.history = [reading, ...state.history.filter((item) => item.id !== reading.id)].slice(0, 5);
  saveHistory();
  renderHistory();
}

function renderHexagram(target, lines, moving = []) {
  target.innerHTML = lines
    .map((line, index) => {
      const className = line ? "hex-line yang" : "hex-line yin";
      const movingClass = moving.includes(index + 1) ? " moving" : "";
      return `<div class="${className}${movingClass}"><span></span><span></span></div>`;
    })
    .reverse()
    .join("");
}

function renderIChing(reading) {
  const { iching } = reading;
  if (!iching || !iching.primary || !iching.changed || !Array.isArray(iching.lines) || !Array.isArray(iching.moving)) {
    els.ichingBadge.textContent = "舊紀錄";
    els.primaryHexName.textContent = "（舊紀錄，無此資料）";
    els.changedHexName.textContent = "（舊紀錄，無此資料）";
    renderHexagram(els.primaryHexagram, []);
    renderHexagram(els.changedHexagram, []);
    els.ichingMeaning.textContent = "這筆紀錄建立於易經六爻功能之前，沒有可顯示的卦象資料。";
    return;
  }
  els.ichingBadge.textContent = iching.moving.length ? `動爻 ${iching.moving.join(" / ")}` : "靜卦";
  els.primaryHexName.textContent = `${iching.primary.number}. ${iching.primary.name}`;
  els.changedHexName.textContent = `${iching.changed.number}. ${iching.changed.name}`;
  renderHexagram(els.primaryHexagram, iching.lines, iching.moving);
  renderHexagram(els.changedHexagram, iching.changed.lines);
  els.ichingMeaning.textContent = iching.moving.length
    ? `六爻取數 ${iching.values.join(" / ")}，由 ${iching.primary.name} 變 ${iching.changed.name}。動爻代表事情正在轉折，先看動處。`
    : `六爻取數 ${iching.values.join(" / ")}，本卦 ${iching.primary.name} 無動爻。靜卦重在守住本象，不急著求變。`;
}

function renderMeihua(reading) {
  const { meihua } = reading;
  if (!meihua || !meihua.primary || !meihua.changed || !meihua.upper || !meihua.lower || !trigrams[meihua.upper] || !trigrams[meihua.lower]) {
    els.meihuaBadge.textContent = "舊紀錄";
    els.meihuaPanel.innerHTML = '<p class="empty-note">（舊紀錄，無此資料）</p>';
    els.meihuaMeaning.textContent = "這筆紀錄建立於梅花易數功能之前，沒有可顯示的卦象資料。";
    return;
  }
  els.meihuaBadge.textContent = `動 ${meihua.movingLine} 爻`;
  els.meihuaPanel.innerHTML = `<div class="meihua-row">
      <span>上卦</span><strong>${meihua.upper} ${trigrams[meihua.upper].symbol}</strong><small>${trigrams[meihua.upper].image}：${trigrams[meihua.upper].nature}</small>
    </div>
    <div class="meihua-row">
      <span>下卦</span><strong>${meihua.lower} ${trigrams[meihua.lower].symbol}</strong><small>${trigrams[meihua.lower].image}：${trigrams[meihua.lower].nature}</small>
    </div>
    <div class="meihua-row">
      <span>動爻</span><strong>${meihua.movingLine} 爻</strong><small>三數：${meihua.draws.join(" / ")}</small>
    </div>`;
  els.meihuaMeaning.textContent = `梅花成 ${meihua.primary.name}，變 ${meihua.changed.name}。上卦看外象，下卦看內因，動爻看當下最該處理的位置。`;
}

function renderCalendarBase(reading) {
  const base = reading.calendarBase;
  els.calendarBadge.textContent = `${base.dayGanzhi}日 ${base.hourBranch}時`;
  els.calendarPanel.innerHTML = `<div class="calendar-row">
      <span>起課時間</span><strong>${escapeHtml(base.localText)}</strong><small>${escapeHtml(base.note)}</small>
    </div>
    <div class="calendar-row">
      <span>四柱</span><strong>${base.yearGanzhi} · ${base.monthGanzhi} · ${base.dayGanzhi} · ${base.hourGanzhi}</strong><small>年、月、日、時干支</small>
    </div>
    <div class="calendar-row">
      <span>日辰</span><strong>${base.dayStem}日 ${base.dayBranch}辰</strong><small>後續四課會以日干、日支為核心</small>
    </div>
    <div class="calendar-row">
      <span>占時</span><strong>${base.hourBranch}</strong><small>目前作為天地盤布盤的占時地支</small>
    </div>
    <div class="calendar-row">
      <span>月將</span><strong>${base.monthGeneral}</strong><small>${base.monthGeneralTerm}後近似月將</small>
    </div>
    <div class="calendar-row">
      <span>旬空</span><strong>${base.xunKong.join(" / ")}</strong><small>依日干支所在旬推得</small>
    </div>`;
  els.calendarNote.textContent = "這是完整版大六壬的第一層地基：先定時間、干支、月將、占時、旬空。下一階段可用它正式推出天地盤與四課。";
}

function renderFormalLiuRen(reading) {
  const formal = reading.formalLiuRen;
  if (!formal) {
    els.formalPlateBadge.textContent = "舊紀錄";
    els.formalPlate.innerHTML = "";
    els.formalPlateNote.textContent = "這筆紀錄建立於正式大六壬引擎之前，請重新起課生成正式天地盤、四課與三傳。";
    els.formalLessonsBadge.textContent = "無資料";
    els.formalLessons.innerHTML = "";
    els.formalMethodBadge.textContent = "無資料";
    els.formalTransmissions.innerHTML = "";
    els.formalMethodNote.textContent = "重新起課即可補齊正式三傳。";
    return;
  }
  els.formalPlateBadge.textContent = `月將${reading.calendarBase.monthGeneral}加${reading.calendarBase.hourBranch}時`;
  els.formalPlate.innerHTML = formal.heavenPlate
    .map((item) => `<div class="formal-cell">
      <span>${item.earth}</span>
      <strong>${item.heaven}</strong>
      <small>${formal.skyGeneralData.skyGenerals[item.earth] || ""}</small>
    </div>`)
    .join("");
  els.formalPlateNote.textContent = `貴人取 ${formal.skyGeneralData.nobleBranch}，${formal.skyGeneralData.dayPart === "day" ? "晝貴" : "夜貴"}，${formal.skyGeneralData.forward ? "順布" : "逆布"}十二天將。`;

  els.formalLessonsBadge.textContent = `${reading.calendarBase.dayStem}日寄${stemLodge[reading.calendarBase.dayStem]}`;
  els.formalLessons.innerHTML = formal.lessons
    .map((item) => `<div class="formal-item">
      <span>${item.label}</span>
      <strong>${item.lower} → ${item.upper}</strong>
      <em>${item.relation}</em>
      <small>${item.general || "無天將"} · ${item.source}</small>
    </div>`)
    .join("");

  els.formalMethodBadge.textContent = formal.transmissions.method;
  els.formalTransmissions.innerHTML = formal.transmissions.transmissions
    .map((item) => `<div class="formal-item">
      <span>${item.label}</span>
      <strong>${item.branch}</strong>
      <em>${item.general || "天將旁取"}</em>
      <small>${item.source ? `發用：${item.source}` : "由上神遞傳"}</small>
    </div>`)
    .join("");
  els.formalMethodNote.textContent = `${formal.transmissions.note} 判法步驟：${(formal.transmissions.steps || []).join(" / ")}`;
}

function buildAuditJson(reading) {
  return {
    question: reading.question,
    topic: reading.topicLabel,
    calendar: reading.calendarBase,
    formalLiuRen: {
      heavenPlate: reading.formalLiuRen?.heavenPlate || [],
      skyGeneralData: reading.formalLiuRen?.skyGeneralData || null,
      lessons: reading.formalLiuRen?.lessons || [],
      transmissions: reading.formalLiuRen?.transmissions || null,
    },
    quantumStyle: {
      smallLiuren: {
        draws: reading.smallDraws,
        result: reading.small.name,
      },
      focusBranch: branches[reading.focusIndex],
      lessons: reading.lessons,
      passes: reading.passes,
    },
    iching: reading.iching,
    meihua: reading.meihua,
  };
}

function normalizeExpectedArray(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  return String(value).split(/[,\s/]+/).filter(Boolean);
}

function compareValue(label, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  return { label, actual, expected, pass };
}

function buildComparableReading(reading) {
  return {
    monthGeneral: reading.calendarBase.monthGeneral,
    hourBranch: reading.calendarBase.hourBranch,
    dayGanzhi: reading.calendarBase.dayGanzhi,
    xunKong: reading.calendarBase.xunKong,
    method: reading.formalLiuRen?.transmissions?.method || "",
    transmissions: reading.formalLiuRen?.transmissions?.transmissions.map((item) => item.branch) || [],
    lessons: reading.formalLiuRen?.lessons.map((item) => `${item.lower}->${item.upper}`) || [],
  };
}

function compareExpectedCase(reading, expected) {
  const actual = buildComparableReading(reading);
  const checks = [];
  if (expected.monthGeneral) checks.push(compareValue("月將", actual.monthGeneral, expected.monthGeneral));
  if (expected.hourBranch) checks.push(compareValue("占時", actual.hourBranch, expected.hourBranch));
  if (expected.dayGanzhi) checks.push(compareValue("日干支", actual.dayGanzhi, expected.dayGanzhi));
  if (expected.xunKong) checks.push(compareValue("旬空", actual.xunKong, normalizeExpectedArray(expected.xunKong)));
  if (expected.method) checks.push(compareValue("取法", actual.method, expected.method));
  if (expected.transmissions) checks.push(compareValue("三傳", actual.transmissions, normalizeExpectedArray(expected.transmissions)));
  if (expected.lessons) checks.push(compareValue("四課", actual.lessons, normalizeExpectedArray(expected.lessons)));
  return { actual, checks };
}

function renderCompareResult(result) {
  if (!result.checks.length) {
    els.compareResult.innerHTML = '<p class="empty-note">期望 JSON 沒有可比對欄位。可填 monthGeneral、hourBranch、dayGanzhi、xunKong、method、transmissions、lessons。</p>';
    return;
  }
  els.compareResult.innerHTML = result.checks
    .map((item) => `<div class="compare-row ${item.pass ? "pass" : "fail"}">
      <span>${item.pass ? "PASS" : "FAIL"}</span>
      <strong>${item.label}</strong>
      <small>實際：${escapeHtml(Array.isArray(item.actual) ? item.actual.join(" / ") : item.actual)} ｜ 期望：${escapeHtml(Array.isArray(item.expected) ? item.expected.join(" / ") : item.expected)}</small>
    </div>`)
    .join("");
}

function renderAudit(reading) {
  const audit = buildAuditJson(reading);
  els.auditBadge.textContent = reading.formalLiuRen?.transmissions?.method || "已起課";
  els.auditOutput.textContent = JSON.stringify(audit, null, 2);
  els.copyAuditJson.disabled = false;
  els.compareAudit.disabled = false;
}

function renderReading(reading, options = {}) {
  const firstPass = reading.passes[0];
  const lastPass = reading.passes[2];

  reading.verdictLabel = verdictLabel(reading.score);
  reading.verdictText = pickText(reading.score, reading.small, firstPass, lastPass);
  reading.adviceText = `${reading.small.advice} ${pickTopicReading(reading)}`;
  reading.plainSummary = reading.iching && reading.meihua
    ? buildPlainSummary(reading)
    : reading.plainSummary || "（舊紀錄，無此資料）";

  els.verdictBadge.textContent = reading.verdictLabel;
  els.mainVerdict.textContent = reading.verdictText;
  els.adviceText.textContent = reading.adviceText;
  els.plainSummary.textContent = reading.plainSummary;

  els.smallStep.textContent = `量子三數 ${reading.smallDraws.join(" / ")}`;
  els.smallPalace.textContent = reading.small.name;
  els.smallMeaning.textContent = reading.small.meaning;
  els.smallTrail.innerHTML = smallLiuren
    .map((item, index) => `<span class="${index === reading.smallIndex ? "active" : ""}">${item.name}</span>`)
    .join("");

  els.bigFocus.textContent = `${branches[reading.focusIndex]}宮`;
  els.bigMeaning.textContent = `月將取 ${branches[reading.monthGeneralIndex]}，占時取 ${branches[reading.hourIndex]}，問事落 ${branches[reading.focusIndex]}：${branchMeaning[branches[reading.focusIndex]]}。`;

  renderBranchWheel(reading);
  renderList(els.fourLessons, reading.lessons, "lesson-item", "lesson");
  renderList(els.threePasses, reading.passes, "pass-item", "pass");
  attachDetailEvents();
  renderCalendarBase(reading);
  renderFormalLiuRen(reading);
  renderAudit(reading);
  renderIChing(reading);
  renderMeihua(reading);

  els.drawLog.textContent = [
    `問題：${reading.question}`,
    `類型：${reading.topicLabel}`,
    `起課時間：${reading.calendarBase.localText}`,
    `四柱：${reading.calendarBase.yearGanzhi} ${reading.calendarBase.monthGanzhi} ${reading.calendarBase.dayGanzhi} ${reading.calendarBase.hourGanzhi}`,
    `月將：${reading.calendarBase.monthGeneral}（${reading.calendarBase.monthGeneralTerm}後近似）`,
    `旬空：${reading.calendarBase.xunKong.join(", ")}`,
    `小六壬三數：${reading.smallDraws.join(", ")} -> ${reading.small.name}`,
    `易經六爻：${
      reading.iching && reading.iching.primary && reading.iching.changed
        ? `${reading.iching.values.join(", ")} -> ${reading.iching.primary.name} / ${reading.iching.changed.name}`
        : "（舊紀錄，無此資料）"
    }`,
    `梅花三數：${
      reading.meihua && reading.meihua.primary && reading.meihua.changed
        ? `${reading.meihua.draws.join(", ")} -> ${reading.meihua.primary.name} / ${reading.meihua.changed.name}`
        : "（舊紀錄，無此資料）"
    }`,
    `布盤月將：${branches[reading.monthGeneralIndex]}`,
    `占時：${branches[reading.hourIndex]}`,
    `人元：${branches[reading.subjectIndex]}`,
    `事元：${branches[reading.matterIndex]}`,
    `焦點：${branches[reading.focusIndex]}`,
    `分數：${reading.score}`,
    "",
    `白話總結：${reading.plainSummary}`,
  ].join("\n");

  els.copyReading.disabled = false;
  if (options.addToHistory !== false) addHistory(reading);
}

async function castReading() {
  resetRevealCards();
  renderRitual(0, "靜心中");
  setSelectionPanel("盤正在形成，等一下就會有可點擊的細節。");
  await sleep(220);

  renderRitual(1, "取量子數");
  await fetchBytes(192);
  await sleep(220);

  renderRitual(2, "起小六壬");
  const question = els.questionInput.value.trim() || "未填問題";
  const topic = els.topicType.value;
  const topicLabel = els.topicType.options[els.topicType.selectedIndex].text;
  const calendarBase = buildCalendarBase(getCastDate());
  const smallDraws = [await randomInt(1, 6), await randomInt(1, 6), await randomInt(1, 6)];
  const smallIndex = (smallDraws.reduce((sum, value) => sum + value, 0) - 1) % 6;
  const small = smallLiuren[smallIndex];

  const reading = buildReading({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timeLabel: new Date().toLocaleString("zh-Hant", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    question,
    topic,
    topicLabel,
    calendarBase,
    smallDraws,
    smallIndex,
    small,
    monthGeneralIndex: calendarBase.monthGeneralIndex,
    hourIndex: calendarBase.hourBranchIndex,
    subjectIndex: await randomInt(0, 11),
    matterIndex: await randomInt(0, 11),
  });
  reading.formalLiuRen = buildFormalLiuRen(calendarBase);
  reading.iching = await buildIChing();
  reading.meihua = await buildMeihua();

  state.latestReading = reading;
  renderReading(reading);
  revealCard(0);
  revealCard(1);
  revealCard(2);
  revealCard(3);
  await sleep(260);

  renderRitual(3, "布大六壬盤");
  revealCard(4);
  revealCard(5);
  revealCard(6);
  await sleep(260);

  renderRitual(4, "成卦");
  revealCard(7);
  revealCard(8);
  revealCard(9);
  revealCard(10);
  revealCard(11);
  showDetail("branch", reading.focusIndex);
  await sleep(180);

  renderRitual(5, "已成卦");
}

function showError(target, error) {
  target.textContent = error.message || "發生錯誤";
}

document.querySelector("#refreshBytes").addEventListener("click", async () => {
  if (state.refreshing) return;
  state.refreshing = true;
  setLoading(true);
  try {
    await fetchBytes(64);
  } catch (error) {
    showError(els.hexOutput, error);
  } finally {
    state.refreshing = false;
    setLoading(false);
  }
});

document.querySelector("#castReading").addEventListener("click", async () => {
  if (state.casting) return;
  state.casting = true;
  setLoading(true);
  try {
    await castReading();
  } catch (error) {
    renderRitual(-1, "起課失敗");
    showError(els.mainVerdict, error);
  } finally {
    state.casting = false;
    setLoading(false);
  }
});

els.copyReading.addEventListener("click", async () => {
  if (!state.latestReading) return;
  const text = formatReadingText(state.latestReading);
  try {
    await navigator.clipboard.writeText(text);
    els.copyReading.textContent = "已複製";
  } catch {
    els.drawLog.textContent = text;
    els.copyReading.textContent = "已放入取數欄";
  }
  setTimeout(() => {
    els.copyReading.textContent = "複製卦文";
  }, 1300);
});

els.copyAuditJson.addEventListener("click", async () => {
  if (!state.latestReading) return;
  const text = JSON.stringify(buildAuditJson(state.latestReading), null, 2);
  try {
    await navigator.clipboard.writeText(text);
    els.copyAuditJson.textContent = "已複製 JSON";
  } catch {
    els.auditOutput.textContent = text;
    els.copyAuditJson.textContent = "已放入校驗欄";
  }
  setTimeout(() => {
    els.copyAuditJson.textContent = "複製 JSON";
  }, 1300);
});

els.compareAudit.addEventListener("click", () => {
  if (!state.latestReading) return;
  const rawExpected = els.expectedCaseInput.value.trim();
  if (!rawExpected) {
    els.compareResult.innerHTML = '<p class="empty-note">請先貼上期望課例 JSON，再按「比對課例」。</p>';
    return;
  }

  try {
    const expected = JSON.parse(rawExpected);
    renderCompareResult(compareExpectedCase(state.latestReading, expected));
  } catch (error) {
    els.compareResult.innerHTML = `<p class="empty-note">JSON 解析失敗：${escapeHtml(error.message)}</p>`;
  }
});

els.auditExample.addEventListener("change", () => {
  if (!els.auditExample.value) return;
  els.castMode.value = "custom";
  els.castDateTime.disabled = false;
  els.castDateTime.value = els.auditExample.value;
});

els.clearHistory.addEventListener("click", () => {
  state.history = [];
  saveHistory();
  renderHistory();
});

function setDefaultCastDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  els.castDateTime.value = now.toISOString().slice(0, 16);
}

els.castMode.addEventListener("change", () => {
  els.castDateTime.disabled = els.castMode.value !== "custom";
});

setDefaultCastDateTime();
els.castDateTime.disabled = true;
loadHistory();
renderHistory();
renderRitual(-1, "待命");
fetchBytes(64).catch((error) => {
  els.sourceName.textContent = "取樣失敗";
  els.sourceMeta.textContent = error.message;
});
