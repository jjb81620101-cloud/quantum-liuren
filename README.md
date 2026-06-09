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

This app also works as a static site on GitHub Pages. The browser tries the public QRNG APIs directly, then falls back to `crypto.getRandomValues` if those APIs are unavailable.

## Random Sources

The server tries these sources in order:

1. DocDailey hardware QRNG API
2. LfD hardware QRNG API
3. Local `crypto.randomBytes` fallback

The UI shows whether the current sample came from a quantum source or the local fallback.

## Notes

小六壬採六神循環，這裡使用量子三數代替傳統月日時或報數。

大六壬完整排盤牽涉月將、占時、四課、三傳、十二天將與更多古法規則；目前這個版本是「受大六壬結構啟發」的量子化實驗盤，還不是完整傳統排盤。

目前已加入可檢查的曆法底座，並接入正式天地盤、十干寄宮四課、十二天將與三傳判法。月將目前採固定節氣日期近似；三傳規則已細分賊克、比用、涉害近似、遙克、伏吟、返吟、八專、別責與昴星骨架，並在畫面顯示判法步驟。後續可繼續把涉害深淺、別責/八專派別細節與精確天文節氣做成可測規則。

占卜內容只適合自我整理與娛樂。重大醫療、法律、投資與人身安全決策請以專業意見為準。
