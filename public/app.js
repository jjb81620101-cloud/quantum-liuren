const state = {
  bytes: new Uint8Array(),
  cursor: 0,
  loading: false,
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
  ritualState: document.querySelector("#ritualState"),
  ritualSteps: document.querySelector("#ritualSteps"),
  verdictBadge: document.querySelector("#verdictBadge"),
  mainVerdict: document.querySelector("#mainVerdict"),
  adviceText: document.querySelector("#adviceText"),
  smallStep: document.querySelector("#smallStep"),
  smallPalace: document.querySelector("#smallPalace"),
  smallMeaning: document.querySelector("#smallMeaning"),
  smallTrail: document.querySelector("#smallTrail"),
  bigFocus: document.querySelector("#bigFocus"),
  branchWheel: document.querySelector("#branchWheel"),
  bigMeaning: document.querySelector("#bigMeaning"),
  fourLessons: document.querySelector("#fourLessons"),
  threePasses: document.querySelector("#threePasses"),
  selectionPanel: document.querySelector("#selectionPanel"),
  drawLog: document.querySelector("#drawLog"),
  copyReading: document.querySelector("#copyReading"),
  clearHistory: document.querySelector("#clearHistory"),
  historyCount: document.querySelector("#historyCount"),
  historyList: document.querySelector("#historyList"),
  revealCards: [...document.querySelectorAll(".reveal-card")],
};

const loadingButtons = [...document.querySelectorAll("button:not(#copyReading):not(#clearHistory)")];
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
const generals = ["貴人", "螣蛇", "朱雀", "六合", "勾陳", "青龍", "天空", "白虎", "太常", "玄武", "太陰", "天后"];
const passNames = ["初傳", "中傳", "末傳"];
const lessonNames = ["一課", "二課", "三課", "四課"];
const ritualLabels = ["靜心", "取數", "起小六壬", "布大盤", "成卦"];

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
  if (payload && payload.data && payload.data.bytes && payload.data.bytes.length === byteCount * 2) {
    return { bytes: payload.data.bytes, source: "DocDailey hardware QRNG", quantum: true };
  }
  if (payload && payload.qrn && payload.qrn.length === byteCount * 2) {
    return { bytes: payload.qrn, source: "LfD hardware QRNG", quantum: true };
  }
  throw new Error("Unexpected random source response");
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function getRandomPayload(byteCount) {
  const sources = [
    `api/random?bytes=${byteCount}`,
    `https://quantum.docdailey.ai/random/bytes?count=${byteCount}`,
    `https://lfdr.de/qrng_api/qrng?length=${byteCount}`,
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
  setLoading(true);
  try {
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
  } finally {
    setLoading(false);
  }
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

function verdictLabel(score) {
  if (score >= 2) return "偏吉";
  if (score <= -2) return "偏凶";
  return "中平";
}

function formatReadingText(reading) {
  return [
    "量子六壬問事",
    `問題：${reading.question}`,
    `類型：${reading.topicLabel}`,
    `總斷：${reading.verdictText}`,
    `建議：${reading.adviceText}`,
    `小六壬：${reading.small.name}（${reading.smallDraws.join(" / ")}）`,
    `月將：${branches[reading.monthGeneralIndex]}，占時：${branches[reading.hourIndex]}，焦點：${branches[reading.focusIndex]}宮`,
    `四課：${reading.lessons.map((item) => `${item.label}${item.branch}${item.general}`).join(" / ")}`,
    `三傳：${reading.passes.map((item) => `${item.label}${item.branch}${item.general}`).join(" / ")}`,
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

function renderReading(reading, options = {}) {
  const firstPass = reading.passes[0];
  const lastPass = reading.passes[2];

  reading.verdictLabel = verdictLabel(reading.score);
  reading.verdictText = pickText(reading.score, reading.small, firstPass, lastPass);
  reading.adviceText = `${reading.small.advice} ${pickTopicReading(reading)}`;

  els.verdictBadge.textContent = reading.verdictLabel;
  els.mainVerdict.textContent = reading.verdictText;
  els.adviceText.textContent = reading.adviceText;

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

  els.drawLog.textContent = [
    `問題：${reading.question}`,
    `類型：${reading.topicLabel}`,
    `小六壬三數：${reading.smallDraws.join(", ")} -> ${reading.small.name}`,
    `月將：${branches[reading.monthGeneralIndex]}`,
    `占時：${branches[reading.hourIndex]}`,
    `人元：${branches[reading.subjectIndex]}`,
    `事元：${branches[reading.matterIndex]}`,
    `焦點：${branches[reading.focusIndex]}`,
    `分數：${reading.score}`,
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
  await fetchBytes(96);
  await sleep(220);

  renderRitual(2, "起小六壬");
  const question = els.questionInput.value.trim() || "未填問題";
  const topic = els.topicType.value;
  const topicLabel = els.topicType.options[els.topicType.selectedIndex].text;
  const smallDraws = [await randomInt(1, 6), await randomInt(1, 6), await randomInt(1, 6)];
  const smallIndex = (smallDraws.reduce((sum, value) => sum + value, 0) - 1) % 6;
  const small = smallLiuren[smallIndex];

  const reading = buildReading({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timeLabel: new Date().toLocaleString("zh-Hant", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    question,
    topic,
    topicLabel,
    smallDraws,
    smallIndex,
    small,
    monthGeneralIndex: await randomInt(0, 11),
    hourIndex: await randomInt(0, 11),
    subjectIndex: await randomInt(0, 11),
    matterIndex: await randomInt(0, 11),
  });

  state.latestReading = reading;
  renderReading(reading);
  revealCard(1);
  await sleep(260);

  renderRitual(3, "布大六壬盤");
  revealCard(2);
  await sleep(260);

  renderRitual(4, "成卦");
  revealCard(3);
  revealCard(4);
  revealCard(5);
  revealCard(0);
  showDetail("branch", reading.focusIndex);
  await sleep(180);

  renderRitual(5, "已成卦");
}

function showError(target, error) {
  target.textContent = error.message || "發生錯誤";
}

document.querySelector("#refreshBytes").addEventListener("click", () => {
  fetchBytes(64).catch((error) => showError(els.hexOutput, error));
});

document.querySelector("#castReading").addEventListener("click", () => {
  castReading().catch((error) => {
    renderRitual(-1, "起課失敗");
    showError(els.mainVerdict, error);
  });
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

els.clearHistory.addEventListener("click", () => {
  state.history = [];
  saveHistory();
  renderHistory();
});

loadHistory();
renderHistory();
renderRitual(-1, "待命");
fetchBytes(64).catch((error) => {
  els.sourceName.textContent = "取樣失敗";
  els.sourceMeta.textContent = error.message;
});
