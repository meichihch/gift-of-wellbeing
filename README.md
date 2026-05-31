# Handoff: 幸福的禮物（A Gift of Wellbeing）

## Overview
「幸福的禮物」是一款行動優先（mobile-first）的情緒照顧 web app 原型。核心是一個「被照顧 → 自我照顧 → 把溫柔傳下去」的閉環體驗：使用者選擇此刻的情緒需求，收到一句溫柔的話，存成圖卡或把這份感覺透過連結傳給別人；對方點開連結，回到同一段歡迎體驗（口吻轉為「有人想到了你」），閉環完成。

整體調性：安靜、暖光、深色、大量留白。以 shadcn/ui 的結構為骨架，完全套用一套自訂的暖光深色主題（warm-dark）。全繁體中文。

## About the Design Files
本資料夾中的檔案是**以 HTML / React（透過瀏覽器端 Babel）撰寫的設計參考原型** —— 它們呈現的是「預期的外觀與行為」，不是要直接搬進產品的生產級程式碼。

任務是**在目標程式庫既有的環境中重建這些設計**（React、Next.js、Vue、SwiftUI、原生皆可），沿用該專案既有的元件庫、設計系統與慣例。若專案尚無前端環境，則為它選擇最合適的框架（建議 React + Tailwind + shadcn/ui，因為原型本來就是這個慣用語）並據此實作。

> 原型用 `<script type="text/babel">` 在瀏覽器即時轉譯，僅為快速迭代；正式實作請改用標準建置流程（Vite / Next.js）與真正的 shadcn/ui 元件。

## Fidelity
**High-fidelity（hifi）。** 顏色、字體、間距、圓角、動態與互動都已定案，請以像素級精度用程式庫既有的元件重建。下方「Design Tokens」與各畫面規格即為事實來源。

## 字體
- 內文與 UI：**Noto Sans TC**（400 / 500 / 600 / 700）
- 引言、回饋話語、標題等情感性文字：**Noto Serif TC**（500 / 600）
- 透過 Google Fonts 載入。數字（如陪伴人數）使用 Noto Sans TC 並加 `tabular-nums`，刻意呈現拉丁數字感。

## 流程（目前定案）
```
歡迎頁 (A)
  └─ 一般進入 → 此刻你需要什麼 (C) → 接收回饋 (D) → 分享/下載 (E) → 足跡 (F)
  └─ 帶禮物連結進入 (?g=key&w=index) → 直接到 接收回饋 (D)（口吻已是「有人想到了你」）
分享連結傳出 → 對方點開 → 回到歡迎頁 (A，禮物版) → 接收 → … 閉環
```
> 註：另有一個「今天，我想…」設定意圖頁（B），目前**整頁隱藏**（程式碼保留），日後產品結構更複雜時再帶回。重建時可暫不實作，但建議保留其位置於流程 A→B→C。

## Screens / Views

### A. 歡迎頁（WelcomeScreen）
- **Purpose**：給使用者一個安靜的入口。先讀到一句溫柔的話，再決定進入。
- **Layout**：垂直置中。背景有「星辰微光」（stardust）動態視覺置於中央偏上。底部一顆主要 CTA。
- **兩種狀態**：
  - 一般進入：eyebrow「今天也有人在這裡陪你」；顯示隨機 quote（serif，27px）＋出處；CTA「留點時間給自己」；CTA 下方一行小字「此刻有 1,287 人，也在這裡照顧自己」（數字為獨立 span，Noto Sans TC，15px，tabular-nums）。
  - 禮物進入（`fromGift`）：eyebrow「有人想到了你」；顯示對方留下的那句話（serif，27px）；小字「有人把這句話，留給了你。」；CTA「我想看看」；不顯示陪伴人數。
- **視覺**：BreathingVisual variant="stardust"，size 150–168。

### C. 此刻，你需要什麼？（NeedsScreen）
- **Purpose**：選擇此刻的情緒需求。
- **Layout**：標題（serif，32px）「此刻，你需要什麼？」。右上角浮動「星辰」（stars，有機散落，無光暈）。下方 2 欄 grid，6 張需求卡，gap 12px，卡高 104px。底部 CTA「我準備好了」。
- **互動**：點卡 → 高亮選取（不立即前進）。選取後 CTA 由 disabled 變為可用；按 CTA 才前進。
- **卡片**：圓角 18px，border 1px，未選 `bg-secondary/25 border-border/70`，選取 `bg-primary/12 border-primary/60` 且文字轉主色。文字 15px / 500，靠下對齊。**無**右上角光暈（已移除）。
- **六個需求 key 與 label**：understood「我需要被理解」、cheer「我需要被鼓勵」、calm「我需要平靜」、strength「我需要力量」、affirm「我需要被肯定」、tender「我需要溫柔」。

### D. 接收回饋（ReceiveScreen）
- **Purpose**：呈現抽到的那句話，讓使用者「收下」。
- **Layout**：垂直置中，三種版面（layout tweak，預設 stack）：
  - `stack`：呼吸視覺在上、話語在下。
  - `overlay`：話語疊在呼吸光圈中央。
  - `center`：呼吸視覺淡置中央，話語覆蓋其上（30px）。
- 話語為 serif，`text-wrap: balance`。下方一行小字顯示需求 label（tracking 寬、uppercase、12px）。
- **CTA**：僅「我收到了」前進到分享頁。（「存成圖卡」已移除，因下一步重複。）

### E. 分享/下載（ShareScreen）
- **Purpose**：把這句話做成圖卡，下載或分享連結傳出。
- **Layout**：標題（serif，29px）「想把這份感覺，傳給誰？」。中央顯示**即時 canvas 圖卡預覽**（寬 72%，max 260px，比例 1080:1350）。下方三個風格 chip。再下方兩顆按鈕：「分享連結」（主）、「存成圖卡」（次）。底部 link 按鈕「先這樣就好」前往足跡頁。
- **圖卡風格（card tweak，預設 warm）**：warm「暖光漸層」、minimal「極簡留白」、halo「光圈居中」。
- **分享連結**：`location.origin + pathname + "?g=" + need.key + "&w=" + wordIndex`。優先用 `navigator.share`，否則複製到剪貼簿並顯示連結，按鈕轉「已複製連結」2.2s。

### F. 足跡（FootprintScreen）
- **Purpose**：累積「被照顧的時刻」，鼓勵再來一次。
- **Layout**：eyebrow「你的足跡」。6 欄 × 4 列 = 24 個圓點，已點亮的呈暖光（radial gradient + glow），未點亮為 `rgba(154,143,128,0.18)`，逐顆 40ms 漸入。下方 serif 文案「你已點亮 N 個被照顧的時刻」（N 為主色）＋一行說明。
- **CTA**：「再給自己一次」（回到 C 需求頁）、「回到開始」（回到 A 歡迎頁）。
- 計數存於 `localStorage['gift_count']`。

## Interactions & Behavior
- **回饋話語隨機抽選**：每個需求類別有 **10 句**話。在 C 選類別按「我準備好了」時，從該類隨機抽一句。抽到的句子（word 與其 index）必須一路帶到 D 接收、E 圖卡、以及分享連結 —— **全程同一句，不可中途重抽**。
- **禮物連結閉環**：連結帶 `?g=<key>&w=<index>`。對方開啟時 `fromGift=true`，歡迎頁顯示 `giftWordAt(key, index)` 的**精準那一句**（非隨機），口吻轉為禮物版。
- **導覽**：維護一個 history stack；非歡迎頁且 stack 非空時，左上顯示返回鈕。
- **過場**：每個畫面進入時 `giftFade` 動畫（translateY 12px→0，0.55s，cubic-bezier(.22,.61,.36,1)）。**注意**：避免用 opacity 0→1 的 fill-mode:both 進場（在某些凍結時間軸的環境會卡在透明）。
- **呼吸視覺**（BreathingVisual）變體：
  - `glow` 柔光圈、`rings` 雙環光暈、`ripple` 漣漪、`stardust` 星辰微光（中央光暈＋8 顆對稱環繞星點）、`stars`（純星點、有機散落、無光暈，12 顆，用於 C 頁右上角）。
  - 核心呼吸動畫 `gift-breath` 5.4s ease-in-out infinite（scale .86↔1.04、opacity .5↔1）。

## State Management
建議的狀態（原型在單一 App 元件管理）：
- `step`：目前畫面（welcome / needs / receive / share / footprint，B home 保留未用）。
- `hist`：history stack（返回用）。
- `need`：選中的需求物件。
- `word` / `wordIndex`：抽中的話語與其索引（貫穿 D→E→連結）。
- `count`：足跡計數（鏡射到 localStorage）。
- `fromGift` / `giftWordObj`：由 URL `?g=`、`?w=` 推導；亦可用 demo toggle 模擬。
- **主色**：accent hex 透過 `hexToHslTriplet` 換算後寫入 CSS 變數 `--primary` / `--ring` / `--primary-glow`。

正式實作可改用路由（每個 step 一個 route）＋ context/store；word 的傳遞改為 route state 或 store，避免重整遺失。

## Design Tokens

### Colors（HSL，shadcn 風格 CSS 變數）
```
--background: 48 16% 7%
--foreground: 40 30% 91%
--card: 48 13% 9%
--card-foreground: 40 30% 91%
--primary: 30 64% 72%        /* 暖光主色，約 #e6b489 */
--primary-foreground: 32 38% 13%
--secondary: 40 8% 17%
--muted: 40 8% 15%
--muted-foreground: 36 12% 56%
--accent: 40 10% 20%
--border: 40 9% 18%
--input: 40 9% 18%
--ring: 30 64% 72%
--primary-glow: rgba(230,180,137,0.55)
頁面外底色（手機外殼之外）：#080705
```
暖光點/星辰顏色：`#f7d9c0`（亮）、`#ecc49f`、`rgba(230,180,137,*)`。
主色備選（accent tweak）：`#e6b489`（預設）、`#e0a39d`、`#e3c489`、`#df9f86`。

### Radius
`--radius: 0.85rem`；卡片 `radius+4px`；需求卡 18px；圖卡 18px；按鈕 lg/pill 為 full（pill）。

### Typography scale（實際使用值）
- 大標題 serif 32–34px；歡迎/接收話語 serif 27–30px；分享標題 serif 29px。
- eyebrow 11px、字距 0.28em、uppercase、muted。
- 內文/小字 12–15px。
- 按鈕 15px（lg 16px）。

### Shadow
- 手機外殼：`0 50px 120px -40px rgba(0,0,0,0.9)`
- 主按鈕：`0 1px 0 rgba(255,255,255,.15) inset, 0 8px 30px -12px var(--primary-glow)`
- 圖卡預覽：`0 30px 60px -30px rgba(0,0,0,0.8)`

### 手機外殼
最大寬 440px；桌機高 864px（max 94vh）、圓角 46px、border `#2a2620/80`。頂部有環境暖光 radial。**無**狀態列（時間/收訊/電量）——交由使用者真實裝置呈現。底部有 home indicator 細條。

## 圖卡生成（canvas）— 重要實作細節
- 尺寸 **1080 × 1350**（4:5）。
- **中文自動換行**：逐字測寬（`ctx.measureText`），超寬則換行；行首避免標點（`，。、！？：；」』）】`）。實作見 `wrapCJK`。
- 三種風格背景：warm（上方暖光 radial）、minimal（話語上方一條短線、置中）、halo（中央暖光 radial＋一圈描邊）。
- 下方品牌標記：小暖光點＋「幸福的禮物」＋副標「先被照顧，再把溫柔傳下去」。
- 下載前先 `await document.fonts.load(...)` 確保中文字體就緒，否則 canvas 會用 fallback 字體。

## Assets
- 無點陣圖／圖示檔。所有圖示為內嵌 SVG（line icon，見 `Icon` 元件：arrowRight / back / share / download / copy / check / sparkle / refresh）。
- 星辰、光暈、圖卡皆以 CSS / Canvas 程式繪製，無外部素材。
- 字體：Google Fonts（Noto Sans TC、Noto Serif TC）。

## Files（本資料夾內）
- `index.html` — 進入點：主題 CSS 變數、Tailwind 設定、字體、script 載入順序。
- `app/data.js` — 文案事實來源：6 類需求 × 10 句回饋詞、靈感庫、quote 池、helper（giftRandomWord / giftWordAt / giftNeedByKey）。
- `app/ui.jsx` — shadcn 風格基礎元件（Button / Card / Input / Textarea / Badge / Chip / Tabs / Separator / Eyebrow）。
- `app/breathing.jsx` — 呼吸/星辰視覺與各變體。
- `app/cardgen.jsx` — canvas 圖卡生成、中文換行、下載。
- `app/screensA.jsx` — Icon、Screen 容器、A 歡迎、B 首頁（隱藏）、C 需求。
- `app/screensB.jsx` — D 接收、E 分享、F 足跡。
- `app/app.jsx` — 流程、狀態、過場、手機外殼、Tweaks 面板接線。
- `app/tweaks-panel.jsx` — 原型用的即時調整面板（生產環境通常不需要，僅供理解可調項）。
- `_original_spec.md` — 使用者最初提供的產品規格（單一事實來源）。

## 給實作者的提醒
- 原型用瀏覽器端 Babel + 全域 `window` 共享元件，僅為快速迭代。正式請改成模組 import、標準建置、真正的 shadcn/ui。
- 重建時請以本 README 的 tokens 與規格為準；HTML 僅供對照外觀與互動。
- 「今天,我想…」(B) 目前隱藏,流程為 A→C→D→E→F,但建議在資訊架構中保留 B 的位置。
- word 的「同一句貫穿全程」是體驗關鍵,務必保留。
- Tweaks 面板（呼吸樣式 / 接收版面 / 圖卡風格 / 主色 / 模擬入站）是設計探索工具,正式產品可移除,但其中的「定案值」即為預設:呼吸=stardust、版面=stack、圖卡=warm、主色=#e6b489。
