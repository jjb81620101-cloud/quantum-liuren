# 量子六壬問事

一個用硬體量子隨機數做「小六壬」與「大六壬風格盤」的本地網站實驗。

你可以輸入想問的事，選擇問事類型，按下「量子起課」。網站會抓取 QRNG bytes，生成：

- 小六壬六位：大安、留連、速喜、赤口、小吉、空亡
- 大六壬風格的十二支盤
- 大六壬第一階段曆法底座：年、月、日、時干支，月將，占時，旬空
- 正式大六壬天地盤、十干寄宮四課、十二天將與三傳判法骨架
- 排盤校驗 JSON 與範例時間，方便對照古籍課例或其他排盤工具
- 四課與三傳
- 易經六爻本卦、動爻與變卦
- 梅花易數上卦、下卦、動爻與變卦
- 總斷與行動建議
- 問事類型專屬解讀
- 最近五筆問事紀錄
- 一鍵複製卦文
- 原始 hex bytes 與 bit stream

## Run Locally

```powershell
npm start
```

Then open:

```text
http://localhost:8787
```

Choose a different port:

```powershell
$env:PORT=3000; npm start
```

## Run Online

This app also works as a static site on GitHub Pages. The static site calls the ANU hardware QRNG API directly from the browser (it sends CORS headers that allow this). If that call fails or is rate-limited, the UI falls back to `crypto.getRandomValues` and honestly labels the sample as the local fallback instead of a quantum source.

## Case Comparison

The audit panel can compare a cast against an expected Liu Ren case. Paste JSON such as:

```json
{
  "monthGeneral": "未",
  "hourBranch": "巳",
  "method": "賊克",
  "transmissions": ["申", "亥", "寅"]
}
```

Supported comparison keys are `monthGeneral`, `hourBranch`, `dayGanzhi`, `xunKong`, `method`, `transmissions`, and `lessons`.

## Random Sources

1. **ANU hardware QRNG API** — primary source. Browser-direct online (its CORS headers are open, so GitHub Pages can call it directly); also used first by the local server.
2. **LfD hardware QRNG API** — secondary source, local server mode only. Its CORS headers block browser calls, so it only works when the Node server fetches it on your behalf.
3. **Local crypto fallback** (`crypto.randomBytes` on the server, `crypto.getRandomValues` in the browser) — used if both hardware sources fail.

The previous primary source has moved behind a Cloudflare Access login wall and is no longer reachable, so it has been removed from the source chain.

The UI shows whether the current sample came from a quantum source or the local fallback. Note that the free ANU endpoint is rate-limited to 1 request per minute per IP, so casting again within a minute falls back to the local crypto source (and is labeled as such).

## Notes

小六壬採六神循環，這裡使用量子三數代替傳統月日時或報數。

大六壬完整排盤牽涉月將、占時、四課、三傳、十二天將與更多古法規則；目前這個版本是「受大六壬結構啟發」的量子化實驗盤，還不是完整傳統排盤。

目前已加入可檢查的曆法底座，並接入正式天地盤、十干寄宮四課、十二天將與三傳判法。月將目前採固定節氣日期近似；三傳規則已細分賊克、比用、涉害近似、遙克、伏吟、返吟、八專、別責與昴星骨架，並在畫面顯示判法步驟。後續可繼續把涉害深淺、別責/八專派別細節與精確天文節氣做成可測規則。

占卜內容只適合自我整理與娛樂。重大醫療、法律、投資與人身安全決策請以專業意見為準。
