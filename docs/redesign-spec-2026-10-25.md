# 嚮家官網「去 AI 感」重設計規格

給實作 agent 的完整工作單。請先讀完再動手，**不要自由發揮成另一種風格**。
本文件由外部審查產生，所有「現況」描述都已對照 2026-10-25 的線上版本與 repo HEAD `dbcb2b1`。

- 網站原始碼：`homia-policies`（本 repo 根目錄）
- 正式網址：<https://homia-official-site.valkytie.workers.dev/>
- 設計參考圖：`docs/design-refs/`（`current-desktop-1440.jpg` 現況縮圖；`demo-*` 是只用 CSS 套用的方向示意，不是精確目標值）
- `docs/` 不會進 `dist`，但 GitHub Pages 會把它當一般內容發布；若不想公開參考圖，請擁有者決定是否把 `docs` 加進 `_config.yml` 的 `exclude`。
- 主檔案：`index.html`、`assets/site.css`
- 建置／測試：`npm ci`、`npm test`、`npm run build`
- **不要部署**。`npm run deploy` 由網站擁有者執行。

## 0. 一句話

把「八個長得一樣的區塊」改成「一本小冊子」：**宋體標題、一套編號、一個深色滿版、一封信、真的產品畫面（有才放）**。

先做這六件（Phase 1，半天）：
1. 移除三個黑底貼紙 icon。
2. 刪掉所有數字 eyebrow 與 `① ② ③`，只留 Android `01–06`。
3. 標題換自架宋體（只套首頁）。
4. 陶土色收斂到 4 處、卡片圓角 24px → 6px、箭頭只留外連。
5. 刪掉多餘 `<br>`，標題用 `max-width` 換行。
6. 移除所有 hover 位移。

再做這五件（Phase 2，結構）：
7. Hero 右緣出血、插畫拱形、facts 列。
8. 初衷改成置中窄欄的信（日期＋署名，六段原文不動）。
9. Watch 移出「陪伴日常」，改深綠滿版。
10. FAQ 分兩組、第一題展開；下載標題左對齊。
11. 頁尾加 colophon（最後更新／字體／插畫）。

**永遠不要**：改六段故事、捏造評價或截圖、加第三方字型／追蹤、直接部署。

---

**參考圖怎麼看**

- `target-desktop.jpg`、`target-mobile.jpg`：依本文件 Phase 1+2 做的原型截圖（1440 / 390），可當「完成後大概長怎樣」的對照。
- 原型只在瀏覽器即時注入 CSS/HTML，沒有進 repo、沒有部署。字型用 Google Fonts CDN **僅供預覽**；正式實作必須自架（6.1）。
- 原型未包含 Phase 3：真截圖、手寫簽名、紙紋、icon 瘦身。
- 原型已包含 FAQ 分組、colophon、箭頭減量、hero 三行標題、`.home` 字型範圍。
- 原型使用的 hero 描述是第 8 節的建議版（少兩個「一起」）；若擁有者否決，請保留原文。

---

## 1. 任務目標

讓首頁看起來像「一個人為自己的產品寫的網站」，而不是「AI 生成的家庭 App landing page」。

不是重寫文案、不是換整套品牌。**內容誠信與第一人稱設計初衷是資產，不准改寫。** 要改的是版面的「系統」：太均質、太可預測、太多裝飾性標籤與編號、太少產品證據。

### 成功長什麼樣

1. 一眼看過去，不會連續三個區塊都是「小標籤 → 兩行對句標題 → 灰字 → 雙欄」。
2. 全站只有**一套**編號系統。
3. 標題有字體個性（宋體），不是系統黑體從頭到尾。
4. 有一段落有「重量」（深色滿版），不是從頭到尾淺色卡片。
5. 沒有任何與手繪插畫打架的貼紙 icon。
6. 所有裝飾（箭頭、圓角、小標籤、編號）都有理由，不是每處都放。

---

## 2. 硬性限制（違反即退件）

1. **四份政策 Markdown 必須逐 byte 不變**：`privacy-policy.md`、`terms-of-service.md`、`support-and-data-deletion.md`、`report-a-bug.md`。不要格式化、不要改錯字、不要動。
2. **不要動**：`site.config.json`、`wrangler.jsonc`、`tools/build-site.mjs` 的既有行為、`package-lock.json`。
3. **保留 legacy 轉址 script**（`<script id="legacy-home-redirect">`）與頁尾 `href="https://homia-official-site.valkytie.workers.dev/">嚮家官網</a>`；`test/site-build.test.mjs` 會檢查。
4. **不得新增第三方請求**：Google Fonts CDN、analytics、追蹤像素、iframe、表單、圖示庫、CSS/JS 框架一律不行。字體要自架或不用。
5. **不得捏造**：評價、星等、使用者數、媒體報導、獎項、創辦人姓名／照片／城市、App 畫面。沒有真資料就不放。
6. **第一人稱故事六段逐字保留**（`index.html` 第 68–73 行）。可以重排容器、加日期與署名，**不可以改句子**。其他文案的刪修見第 8 節，且必須標記「待擁有者核准」。
7. **不得加假 UI**：不要用 CSS 畫手機畫面、不要用現成 mockup 模板假裝 App 截圖。沒有真截圖就跳過該項。
8. **維持無 JS 可讀**、`<details>` 原生行為、skip link、44px 觸控高度、`prefers-reduced-motion`、單一 `<h1>`、標題層級不得跳階。
9. **不要加 dark mode、不要加 cookie banner、不要加滾動進度條**。
10. 一次只做一個 Phase（見第 11 節），每個 Phase 都要能獨立上線與回滾。

---

## 3. 現況診斷（為什麼像 AI）

| 問題 | 證據 | 為什麼是 AI 感 |
|---|---|---|
| 四套編號語言 | `01／` eyebrow ×4、`① ② ③` 按鈕、Android `01–06`、隱私區 `01–03`、Watch `01–03` | 生成器用編號製造高級感；同時四套就變成無意義裝飾，還讓 Android 步驟 `02` 與按鈕 `①` 看起來對不上 |
| 每節同句型 | 8 個 `.eyebrow`、30 個 `<br>`、幾乎每節都是「標籤 → 兩行對句 → 灰字 → 雙欄」 | 節奏完全可預測，看三節就知道下面長相 |
| 沒有產品 | 全頁 4 張圖：插畫、QR、3 個 icon；**0 張 App 畫面** | 抽象文案頁，沒有證據感 |
| 畫風衝突 | `feeding.webp`／`journal.webp`／`sleep.webp` 是**無 alpha 的黑底貼紙**，72px 顯示 | 與手繪插畫完全不同語彙，最刺眼的一處 |
| 均質 | 9 節、6 節左文右列表、gap 幾乎都 100px、卡片全部 `radius: 24px`、5 種幾乎一樣的近白 | 沒有判斷與層級，像模板 |
| 裝飾過量 | 14 個箭頭且 hover 全部同一種位移；陶土色出現在每個 eyebrow、每個編號、箭頭、FAQ、hover | 裝飾沒有理由，只為填滿 |
| 假手作 | `.gratitude-note` 轉 1deg，但用系統黑體、無陰影 | 只轉角度不像手作，像機器人貼便條 |
| 文案重複 | 「慢慢」9 次、「一起」21 次、「一點」8 次；「少一點 X，多一點 Y」對句 | LLM 的高頻修辭模板 |

**不要用「全部加陰影、加漸層、加圓角、加動畫」來解決。** 那是另一種 AI 感。

---

## 4. 設計方向：家書（editorial, not landing page）

一句話：**把 landing page 的「區塊堆疊」改成一本小冊子：一頁一頁讀，重點用版面說話。**

五條原則：

1. **一套編號**：只有 Android 六步保留 `01–06`，因為那裡真的有順序。其他全部改成文字標籤或直接刪掉。
2. **字體分工**：標題與信件用宋體（Noto Serif TC 500），UI 與正文維持黑體。**不要**全站換字體。
3. **節奏錯開**：至少一個深色滿版（Watch）、一個窄欄書信（初衷）、一個規則列表（日常）、一個雙卡（下載）。不要每節都雙欄。
4. **裝飾減量**：箭頭只留外連與少數「往下」；陶土色全站只用 4 處以內；卡片圓角從 24px 降到 6px。
5. **產品要露臉**：有真截圖就放；沒有就不放，不要假造。真截圖優先序：時間軸 → Watch「需要支援」→ 配對 QR。

### 版面草圖

```
Hero（桌機）
┌────────────── wrap 1200 ──────────────┬──── 出血到視窗右緣 ────┐
│ 給一起照顧家的你們                    │                       │
│ 照顧寶寶的每一天，                    │      手繪插畫          │
│ 也有人照顧 你的辛苦。  ← 宋體         │      （拱形裁切）      │
│ 說明文字（自然換行，不用 <br>）        │                       │
│ [App Store ↗]   Android ↓             │  圖說（宋體小字）      │
│ 免費下載 · 免登入 · 選用付費           │                       │
└───────────────────────────────────────┴───────────────────────┘

初衷（置中窄欄，像一封信）
             ┌──────── max-width 36rem ────────┐
             │ 關於我為什麼設計嚮家   2026 年 10 月 │
             │ H2（宋體）                         │
             │ 導言（較大字）                     │
             │ 五段原文（逐字）                   │
             │ — 嚮家的設計者                     │
             └───────────────────────────────────┘

Watch（深綠滿版）
╔══════════════════ forest ══════════════════╗
║ 手腕上的小幫手        │ [真錶面截圖]       ║
║ H3（宋體，奶油白）    │ ── 先把彼此連結起來 ║
║ 兩段說明              │ ── 需要時點一下     ║
║                       │ ── 讓對方知道       ║
║                       │ 注意事項小字        ║
╚════════════════════════════════════════════╝
```

---

## 5. 設計 token（改 `:root`）

```css
:root {
  color-scheme: light;
  --paper: #fbf8f0;
  --white: #fffdf8;          /* 只留給 QR 白底 */
  --ink: #303e35;
  --muted: #5c6659;          /* 由 #647063 調深，對 paper 5.65:1 */
  --green: #3e5848;
  --forest: #2f4034;         /* 新增：Watch 深色帶 */
  --cream: #f4efe3;          /* 新增：深色上的字 */
  --sage: #ebeee5;
  --line: #d9ddcf;
  --clay: #984b34;
  --peach: #f3e9dc;
  --radius-card: 6px;        /* 取代 --radius: 24px */
  --radius-arch: 180px 180px 20px 20px;
  --space-section: clamp(72px, 9vw, 132px);
  --serif: "Homia Serif", "Songti TC", "Noto Serif TC", "Source Han Serif TC", serif;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
  font-size: 16px;
  line-height: 1.8;
}
```

刪除 `--radius: 24px`，全檔改用 `var(--radius-card)` 或 `var(--radius-arch)`。

### 色彩使用規則

- 陶土 `--clay` 只留 4 處：hero 的「你的辛苦。」、Android 的步驟數字、`.note-label`、focus outline。
- Watch 的「我需要你。」在深綠上改用 `#e6c3ad`（6.71:1），不算在陶土 4 處內。
- `.eyebrow` 改 `--green`（7.34:1），不要再全部陶土。
- FAQ 的 `+ / −` 改 `--ink`。
- 深綠區對比：`--cream` 9.61:1、`#d3dacb` 7.70:1、`#aeb9a7` 5.41:1，都可過。

---

## 6. 逐項修改

### 6.1 自架宋體（Phase 1，最重要的單一改動）

**做法**

1. 取得官方 Noto Serif TC Medium（SIL OFL 1.1）。記錄來源 URL 與版本。
2. 只子集化「會在宋體出現的字」：`index.html` 的 `h1`、`h2`、`h3`（含 `.letter-meta`、`.letter-signature`、`.faq-group`、`.hero-art figcaption`）內的所有文字，加上 ASCII、數字與中文標點 `「」『』（）・—／·。，、：；？！`。
3. 產出 `assets/fonts/noto-serif-tc-500.woff2`（目標 ≤ 180KB）與 `assets/fonts/OFL.txt`（完整授權文字）。
4. `assets/site.css` 開頭加：

```css
@font-face {
  font-family: "Homia Serif";
  src: url("fonts/noto-serif-tc-500.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

> `site.css` 在 `assets/`，所以 `url("fonts/...")` 會指向 `assets/fonts/`。
> 不要用 Google Fonts CDN（會多一個第三方請求，和網站「無追蹤」的立場不一致）。

5. `index.html` 的 `<body>` 改成 `<body class="home">`，並在 `<head>` 加（放在 stylesheet link 之後）：

```html
<link rel="preload" href="assets/fonts/noto-serif-tc-500.woff2" as="font" type="font/woff2" crossorigin>
```

6. 套用（**只套首頁**，不要動四份政策頁的標題）：

```css
body.home h1, body.home h2, body.home h3,
body.home .gratitude-note h3,
body.home .closing-note h2,
.home .letter-meta,
.home .letter-signature,
.home .faq-group,
.home .hero-art figcaption {
  font-family: var(--serif);
  font-weight: 500;
  letter-spacing: .01em;
}
```

> 為什麼要 `.home`：`assets/site.css` 是首頁與四份政策頁共用的。政策頁的 `h1/h2` 很多、字集也大；若全站套宋體，不只會改變法律頁外觀，還會讓子集字型缺字、逐字 fallback 成黑體，看起來更糟。政策頁維持原本的系統黑體，**不要下載字型**（瀏覽器只會抓實際用到的字型）。

**若環境無法做子集化**：不要放整包 10MB 字型。改用系統堆疊 `font-family: var(--serif)`，並在交付說明註明「Android 可能退回無襯線，版面已用 fallback 測試」。**不要**因此改用 Google CDN。

**維護**：日後只要改到 h1–h3／信件抬頭／FAQ 小標的文案，就要重跑子集化，否則新字會 fallback；把子集化指令寫進 `README.md` 的維護段落。

**驗收**：字型檔 ≤ 180KB；`document.fonts.check('500 40px "Homia Serif"')` 為 true；LCP 不比現在（1.15s）慢超過 0.3s。

---

### 6.2 只留一套編號（Phase 1）

**刪除所有數字 eyebrow**，改成純文字：

| 現在 | 改成 |
|---|---|
| `01 ／ 嚮家的起點` | `嚮家的起點` |
| `02 ／ 把日常接住` | `把日常接住` |
| `APPLE WATCH ／ 手腕上的小幫手` | `手腕上的小幫手` |
| `03 ／ 安心，從選擇開始` | `安心，從選擇開始` |
| `04 ／ 從今天，一起開始` | `從今天，一起開始` |
| `ANDROID ／ 中文加入教學` | `Android 加入測試` |
| `還想多了解一點？`（FAQ） | 整行刪除（FAQ 只留 h2，製造節奏變化） |

**刪除隱私區的 `01/02/03`**（`.small-number`），三個標題直接接規則線。

**刪除 Watch 三步的 `01/02/03`**（`.watch-steps` 的 `<span>`）。

**刪除按鈕上的 `① ② ③`**：

- `① 開啟測試群組 ↗` → `開啟測試群組 ↗`
- `② 開啟 Play 測試加入頁 ↗` → `開啟 Play 測試加入頁 ↗`
- `③ 前往 Google Play 安裝 ↗` → `前往 Google Play 安裝 ↗`

**保留** Android 六步的 `.step-number` `01–06`，並改成無圓底：

```css
.step-number {
  width: auto; height: auto; display: block;
  background: none; border-radius: 0;
  color: var(--clay); font-size: .8rem;
  font-variant-numeric: tabular-nums;
  padding-top: 6px;
}
```

---

### 6.3 移除黑底貼紙 icon（Phase 1，最快見效）

刪掉三處 `<img src="assets/feeding.webp">`、`journal.webp`、`sleep.webp`，`.care-item` 改成單欄：

```css
.care-item {
  display: block;
  padding-block: 26px;
  border-top: 1px solid var(--line);
}
.care-item h3 { font-size: 1.13rem; margin-bottom: 8px; }
.care-item p { color: var(--muted); font-size: .94rem; line-height: 1.95; }
```

刪除 `.care-item img` 與 `grid-template-columns` 相關規則。
**不要**自己畫三個 SVG icon 補位；這一輪是「減裝飾」，不是換一套 icon。若之後要補，必須是與插畫同筆觸的線稿，由擁有者決定。

原檔 `assets/feeding.webp`、`journal.webp`、`sleep.webp` 可保留在 repo（`dist` 會一起複製，各 2–4KB，可接受）；若要刪，連同 README／測試提到的地方一起確認。

---

### 6.4 Hero 改成不對稱、出血右緣（Phase 2）

**HTML**（第 43–58 行）改成：

```html
<section class="hero wrap" id="top" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="eyebrow">給一起照顧家的你們</p>
    <h1 id="hero-title">照顧寶寶的每一天，<br>也有人照顧<br><em>你的辛苦。</em></h1>
    <!-- 描述文字暫用第 8 節建議版；若擁有者否決，保留原文，只刪掉 <br> -->
    <p class="hero-description">那些餵奶、換尿布、哄睡的日常，不用再靠一個人記住。讓嚮家陪你們記錄、分擔，把多一點心力，留給寶寶，也留給彼此。</p>
    <div class="hero-actions">
      <a class="button button-primary" href="https://apps.apple.com/tw/app/id6809411558" target="_blank" rel="noopener noreferrer">前往 App Store 下載 <span aria-hidden="true">↗</span></a>
      <a class="text-link" href="#android">Android 測試加入教學 <span aria-hidden="true">↓</span></a>
    </div>
    <ul class="hero-facts">
      <li>免費下載</li>
      <li>免登入即可開始記錄</li>
      <li>提供選用付費功能</li>
    </ul>
  </div>
  <figure class="hero-art">
    <img src="assets/family.webp" width="941" height="1672" alt="手繪插圖：爸爸與媽媽一起替寶寶換尿布，身旁放著玩偶與日常用品。" fetchpriority="high">
    <figcaption>一點一滴的小事，都是一起成為家的練習。</figcaption>
  </figure>
</section>
```

**CSS**

```css
.hero {
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
  gap: clamp(32px, 5vw, 80px);
  align-items: center;   /* 不要用 end：改版後左欄變短，會留下大片空白 */
  padding-block: 56px;
}
.hero-copy { padding-block: 0; }
.hero h1 {
  font-size: clamp(2rem, 3.6vw, 3rem);  /* 上限 3rem，讓「照顧寶寶的每一天，」一行放得下 */
  line-height: 1.5;
}
.hero-description {
  margin-top: 24px;
  max-width: 30em;
  color: var(--muted);
  line-height: 1.95;
  font-size: .97rem;
}
.hero-actions { margin-block: 28px 0; }
.hero-facts {
  display: flex; flex-wrap: wrap;
  gap: 4px 0;
  margin: 24px 0 0; padding: 0; list-style: none;
  color: var(--muted); font-size: .76rem;
}
.hero-facts li + li::before {
  content: "·";
  padding-inline: 10px;
  color: #a7b09f;
}
@media (min-width: 1101px) {
  .hero-art {
    margin-right: calc((min(1200px, 100vw - 96px) - 100vw) / 2);
  }
  .hero-art > img {
    height: clamp(500px, 64vh, 660px);
    border-radius: var(--radius-arch);
  }
  .hero-art figcaption { text-align: left; padding-left: 4px; }
}
```

- 保留 3 行標題（`<br>` 分別在「每一天，」與「也有人照顧」之後）。實測 768px 兩欄時，若改成 2 行，第二行 10 個字會被擠成最後一個字單獨一行；3 行在 768／1024 都安全。
- 刪除 `.tiny-line` 的 span 與 CSS。
- 刪除 `.quiet-note` 在 hero 的使用（其他地方的 `.quiet-note` 保留）。
- 刪除 `.hero .eyebrow` 的 flex 規則。
- `@media (max-width: 767px)` 內 hero 改成單欄；`<img>` 高度 `clamp(360px, 104vw, 510px)` 保留。
- `@media print` 加 `.hero-art { margin-right: 0; }`。
- `@media (min-width: 1400px) .hero h1 { font-size: 3.1rem; }` 整條刪除。

**驗收**：1440 寬時插畫貼齊視窗右緣、不產生水平捲軸（`scrollWidth === clientWidth`）；1100 以下恢復一般雙欄／單欄。

---

### 6.5 初衷改成「一封信」（Phase 2）

把第 60–77 行整段換成（六段**逐字**從原檔複製，不要改字）：

```html
<section class="story section-space" id="story" aria-labelledby="story-title">
  <div class="wrap">
    <article class="letter">
      <header class="letter-head">
        <p class="letter-meta">
          <span>關於我為什麼設計嚮家</span>
          <time datetime="2026-10">2026 年 10 月</time>
        </p>
        <h2 id="story-title">讓想幫忙的心，<br>慢慢變成懂得分擔的默契。</h2>
      </header>
      <!-- 第一段（原檔第 68 行）全文逐字放這裡，不要用省略號 -->
      <p class="letter-lead">設計嚮家時，我最初想到的是這樣的家庭日常：媽媽陪著寶寶度過一天，慢慢熟悉每個照顧細節；爸爸白天上班，下班後也想一起分擔，卻還來不及跟上這些日常。</p>
      <!-- 第 2～6 段：原檔第 69–73 行逐字搬過來，順序不變 -->
      <footer class="letter-signature">
        <span aria-hidden="true">—</span>
        <span>嚮家的設計者</span>
        <time datetime="2026-10">2026 年 10 月</time>
      </footer>
    </article>
  </div>
</section>
```

- 原本的 `.story-grid`、`.section-heading`、`.handwritten-note`、`.story-copy`、`.story-signature` 全部移除或改名。
- 日期只放「2026 年 10 月」（git 可證），**不要加城市、姓名、照片**。
- `關於我為什麼設計嚮家。` 原本是 `.handwritten-note`，現在升為信件抬頭；不要兩處都出現。

```css
.story { background: var(--sage); }
.letter {
  max-width: 36rem;   /* 中文一行約 34–36 字 */
  margin-inline: auto;
}
.letter-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #ced5c2;
  color: var(--green);
  font-size: .78rem;
  letter-spacing: .06em;
}
.letter h2 {
  margin-top: 40px;
  font-size: clamp(1.7rem, 2.8vw, 2.4rem);
  line-height: 1.6;
}
.letter p { margin-top: 20px; font-size: 1rem; line-height: 2.05; }
.letter .letter-lead { margin-top: 28px; font-size: 1.08rem; line-height: 2; color: var(--green); }
.letter-signature {
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  color: var(--green);
  font-size: .88rem;
}
```

**驗收**：手機上信件左右留白舒服（≥20px）、每行 28–34 字、抬頭日期不被擠掉；六段文字與 git 版本逐字相同（可用 `git diff` 檢查文字節點）。

---

### 6.6 日常區（Phase 1 去 icon，Phase 2 微調）

- 依 6.3 移除 icon，`.everyday-layout` 改 `grid-template-columns: 1.35fr .9fr; gap: clamp(40px, 6vw, 88px);`。
- 便條 `.gratitude-note` 變「真的紙」：

```css
.gratitude-note {
  background: var(--peach);
  padding: 38px 42px 42px;
  border-radius: 2px;
  margin-top: 10px;
  transform: rotate(-.8deg);
  box-shadow: 0 14px 26px -22px rgba(80, 58, 40, .38);  /* 太重會像髒污 */
}
.gratitude-note h3 { font-family: var(--serif); font-size: 1.9rem; line-height: 1.6; color: #634d3d; }
.note-label { color: var(--green); letter-spacing: .08em; }
@media (max-width: 767px) {
  .gratitude-note { transform: none; margin-inline: 0; }
}
```

- 若要更像手作，唯一可接受的做法是加一張**真的手寫簽名圖**（見 6.14），不要加紙膠帶、假污漬、假陰影堆疊。

---

### 6.7 Watch 改成深綠滿版（Phase 2，整頁最重要的節奏）

把原本嵌在 `#everyday` 裡的 `<section class="watch-feature">`（第 109–124 行）**移出**，變成獨立區塊，放在 `#everyday` 之後、`#your-data` 之前。

`#everyday` 結尾改成：

```html
      </div><!-- /.everyday-layout -->
    </section><!-- /#everyday -->
```

新區塊：

```html
    <section class="watch-band section-space" id="apple-watch" aria-labelledby="watch-title">
      <div class="wrap watch-layout">
        <div class="watch-copy">
          <p class="eyebrow">手腕上的小幫手</p>
          <h3 id="watch-title">雙手正忙著，<br>也能輕輕說聲：<br><em>「我需要你。」</em></h3>
          <p>抱著寶寶、換尿布，或正忙著哄睡時，有時只是需要另一雙手，卻騰不出空找手機。</p>
          <p>在 Apple Watch 的嚮家點一下<strong>「需要支援」</strong>，就能送出支援請求，通知已配對的另一位照顧者。讓「我想請你幫忙」有個簡單的出口，也讓家人更容易知道，什麼時候該一起接手。</p>
        </div>
        <div class="watch-side">
          <!-- 有真截圖才放；沒有就整段刪掉 -->
          <figure class="watch-shot">
            <img src="assets/apple-watch-support.webp" width="416" height="496" alt="Apple Watch 上的嚮家「需要支援」畫面。" loading="lazy" decoding="async">
            <figcaption>Apple Watch 上的嚮家畫面。</figcaption>
          </figure>
          <ol class="watch-steps">
            <li><div><h4>先把彼此連結起來</h4><p>在 iPhone 完成家庭配對，並在 Apple Watch 安裝、開啟嚮家。</p></div></li>
            <li><div><h4>需要時，在手腕點一下</h4><p>點選「需要支援」，從手錶送出呼叫。</p></div></li>
            <li><div><h4>讓另一位照顧者知道</h4><p>對方可在手機收到支援通知，開啟嚮家查看請求。</p></div></li>
          </ol>
          <p class="watch-conditions">需搭配 iPhone 與 Apple Watch 上的嚮家，先在 iPhone 完成家庭配對並開啟嚮家，讓手錶取得設定；使用時須有可用網路，接收方須允許通知。通知呈現與送達時間會受網路及系統通知設定影響。</p>
        </div>
      </div>
    </section>
```

**CSS**

```css
.watch-band { background: var(--forest); color: var(--cream); }
.watch-layout {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: clamp(40px, 6vw, 96px);
  align-items: start;
}
.watch-band .eyebrow { color: #c9b49a; }
.watch-band h3 {
  color: var(--cream);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  line-height: 1.5;
  margin-bottom: 22px;
}
.watch-band h3 em { font-style: normal; color: #e6c3ad; }
.watch-band p { color: #d3dacb; font-size: .94rem; line-height: 1.95; }
.watch-band .watch-conditions { color: #aeb9a7; font-size: .76rem; line-height: 1.95; margin-top: 22px; }
.watch-steps { list-style: none; margin: 0; padding: 0; }
.watch-steps li { display: block; padding-block: 18px; border-bottom: 1px solid #46584b; }
.watch-steps li:first-child { padding-top: 0; }
.watch-steps h4 { margin: 0 0 6px; font-size: 1rem; font-weight: 600; color: var(--cream); }
.watch-steps p { margin: 0; }
.watch-shot { margin: 0 0 28px; }
.watch-shot img { width: min(220px, 62%); height: auto; border-radius: 18px; }
.watch-shot figcaption { margin-top: 10px; color: #aeb9a7; font-size: .74rem; }
.watch-band a:focus-visible { outline-color: var(--cream); }
@media (max-width: 767px) {
  .watch-layout { grid-template-columns: 1fr; gap: 30px; }
  .watch-band h3 { font-size: 1.75rem; }
  .watch-shot img { width: min(200px, 58%); }
}
```

- 刪除所有 `.watch-feature` 規則、`.watch-steps li > span`、`.watch-steps` 的 28px 欄位。
- **務必刪除 `.watch-copy > p:not(.eyebrow)` 與 `.watch-copy > p + p`**：這條舊規則的 specificity 高於 `.watch-band p`，會把深綠上的正文壓回 `--muted`，實測幾乎看不見。改完請用瀏覽器檢查段落顏色是 `#d3dacb`。
- 內文三段逐字保留。
- 截圖一定要是真機／模擬器實際畫面，裁掉狀態列個人資訊；不要加手錶外框。

---

### 6.8 資料區（Phase 2）

- 背景改 `--paper`，加頂部 1px 線，減少第 5 種近白：

```css
.privacy-band { background: var(--paper); border-top: 1px solid #e7e6dc; }
.privacy-grid { grid-template-columns: 1.1fr 1fr; gap: clamp(40px, 6vw, 96px); }
.privacy-details > div { display: block; padding-bottom: 22px; }
.privacy-details > div + div { padding-top: 22px; border-top: 1px solid var(--line); }
.privacy-details h3 { font-size: 1.1rem; margin-bottom: 8px; }
.privacy-details p { color: var(--muted); font-size: .92rem; }
```

- 刪除 `.small-number` 與 HTML 的 `<span class="small-number">`。
- 文案不動；「記錄／紀錄」的用字一致性見第 8 節（需擁有者決定）。

---

### 6.9 下載區（Phase 1）

- 標題改左對齊，打破「只有這節置中」的模板感：

```css
.download-heading { text-align: left; margin-bottom: 40px; }
```

- 卡片圓角與深綠統一：

```css
.apple-download, .android-download {
  border-radius: var(--radius-card);
  padding: clamp(28px, 3vw, 44px);
}
.apple-download { background: var(--forest); }
.qr-block > a { border-radius: 4px; }
```

- 「一步一步加入測試 ↓」的箭頭刪掉（正下方的區塊，箭頭多餘）。
- 手機版會隱藏 `在 App Store<br>找到嚮家` 的 `<br>`（`.apple-download br { display:none }`），請改成 `在 App Store <br>找到嚮家`，保留空格，否則會變成「Store找到」黏在一起。
- 其餘內容、QR、版本說明全部不動。

---

### 6.10 Android 教學（Phase 1）

- 背景改 `--paper`，保留上下 1px 線（移除 `#fffdf8` 近白）：

```css
.android-guide {
  background: var(--paper);
  border-top: 1px solid #e7e6dc;
  border-bottom: 1px solid #e7e6dc;
}
.guide-layout { grid-template-columns: .8fr 1.5fr; gap: clamp(40px, 6vw, 96px); }
```

- `.step-number` 依 6.2 改成無圓底數字。
- 按鈕移除 `①②③`。
- 其餘六步文案、英文對照、FAQ 連結不動。

---

### 6.11 FAQ（Phase 2）

- 刪掉 eyebrow「還想多了解一點？」。
- 七題分成兩組（只改順序與加小標，題目與答案逐字不動）：

**下載與安裝**
1. 測試加入頁是英文，該按哪一個？
2. 已加入群組，卻顯示「App 無法使用」怎麼辦？
3. 沒有收到群組邀請信，可以直接加入嗎？
4. iPhone 搜尋不到嚮家，或連結顯示無法下載？

**使用與資料**
5. Apple Watch 的支援通知可以怎麼幫忙？
6. 加入測試，會看到其他家庭的資料嗎？
7. 嚮家需要登入或付費，才能開始使用嗎？

```html
<h3 class="faq-group">下載與安裝</h3>
<details>…</details>
<h3 class="faq-group">使用與資料</h3>
<details>…</details>
```

```css
.faq-group {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 1.05rem;
  color: var(--green);
  padding: 30px 0 4px;
  margin: 0;
}
.faq-list > .faq-group:first-child { padding-top: 0; }
summary::after { color: var(--ink); font-weight: 500; }
```

- 第一題加 `open`，讓讀者一進來就看到答案，少一點「全部收起來」的模板感。
- `<details>` 的 `+ / −` 保留（可及性最好），只改顏色。

---

### 6.12 收尾與頁尾（Phase 2）

- `.closing-note` 維持置中；這是全頁唯一的置中段落，保留它的儀式感。
- 頁尾加一列 colophon（放在**網站頁尾**現有 fineprint 之後，保留現有兩行）。注意信件裡有一個 `<footer class="letter-signature">`，不要把 colophon 插進那裡；用頁尾的 `.site-footer` 定位。

```html
<p class="wrap footer-fineprint">網站最後更新：2026 年 10 月 · 字體：Noto Serif TC（SIL OFL 1.1）· 插畫：嚮家</p>
```

（若最後沒有自架字型，這行只寫「網站最後更新：2026 年 10 月」。）

- 保留「嚮家官網」連結（測試會檢查），不要因為它是自連而刪掉。
- 不要加社群 icon。

---

### 6.13 箭頭、hover、圓角（Phase 1）

**箭頭只留這些**：

| 位置 | 保留 | 理由 |
|---|---|---|
| Hero App Store | ↗ | 外連 |
| Hero Android | ↓ | 頁內往下 |
| 下載區 App Store | ↗ | 外連 |
| Android 三個外連按鈕 | ↗ | 外連 |
| QR 儲存 | ↓ | 下載 |
| 收尾「把嚮家帶回日常」 | ↑ | 回到下載 |

**刪除**：

- Header「開始使用 ↗」的箭頭（頁內錨點）。
- 下載區「一步一步加入測試 ↓」的箭頭。
- Android 第六步「回報問題或分享使用感受 ↗」的箭頭（站內頁）。
- 頁尾「問題回報與使用回饋 ↗」的箭頭（站內頁）。

```css
.text-link span, .button span { transition: none; }
/* 刪除 .text-link:hover span, .button:hover span 的 translate */
.text-link:hover { text-decoration-thickness: 2px; }
.site-header nav .nav-download { gap: 0; padding: 8px 18px; }
```

**圓角**：

- 卡片 → `var(--radius-card)`（6px）。
- 圖片 → 拱形 `var(--radius-arch)` 或小圖 4px。
- 按鈕 → 8px。
- 便條 → 2px + 陰影。
- 不要出現 24px 的「AI 卡片圓角」。

---

### 6.14 可選（Phase 3，沒有真資產就跳過）

1. **真截圖三張**（依序重要性）
   - `assets/app-timeline.webp`：時間軸畫面，780×1688，真實資料、無個人資訊。
   - `assets/apple-watch-support.webp`：手錶「需要支援」，416×496。
   - `assets/app-pairing.webp`：配對 QR 畫面，780×1688。
   - 放置建議：在 `#everyday` 與 Watch 帶之間加一個兩個截圖的「產品帶」，或把時間軸放進資料區右欄。**沒有真圖就不做**。
   - 全部加 `loading="lazy" decoding="async"`、`width/height`、中文 alt。
2. **手寫簽名圖**：`assets/signature.png`，480×160 透明背景，`height: 48px; width: auto; mix-blend-mode: multiply;`。放在 `.letter-signature`。需擁有者本人手寫掃描。
3. **紙紋**（可選，先跳過也行）：`body::after` 疊 3–4% 的 SVG noise，`position: fixed; inset: 0; pointer-events: none; mix-blend-mode: multiply;`。上線前必須在 iPhone Safari 測滾動效能；若掉幀就刪掉。
4. **一個進場動效**（只一個）：

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-art > img { animation: hero-in 900ms cubic-bezier(.2,.7,.2,1) both; }
}
@keyframes hero-in {
  from { opacity: 0; transform: translateY(10px) scale(1.01); }
  to   { opacity: 1; transform: none; }
}
```

5. **Header icon 瘦身**：產生 `assets/homia-icon-160.png`（`sips -Z 160`），header 與 closing 改用它；`homia-icon.png` 留給 OG。

---

### 6.15 媒體查詢與舊規則清理（很容易漏，逐條檢查）

`assets/site.css` 的 `@media (max-width: 1100px)`、`(max-width: 767px)`、`(max-width: 359px)` 裡有大量舊 class，改完結構後會變成死碼或錯誤覆蓋。請逐條處理：

**刪除整個規則**
- `.handwritten-note`（含 767 内的 209 行）
- `.story-copy`、`.story-copy p + p`、`.story-copy p:first-child`（含 210–211）
- `.story-signature`（含 212）
- `.small-number`
- `.watch-feature`（含 219）
- `.watch-steps li > span`
- `.tiny-line`、`.hero .eyebrow`
- `.care-item img`
- `@media (min-width: 1400px) .hero h1`

**改寫**
- 767 的 `.story-grid, .privacy-grid, .everyday-layout, .guide-layout { grid-template-columns: 1fr; gap: 35px; }`：拿掉 `.story-grid`，加上 `.watch-layout { grid-template-columns: 1fr; gap: 30px; }`。
- 767 的 `.step-number { width: 30px; height: 30px; font-size: .7rem; margin-top: 2px; }` → `width: auto; height: auto; font-size: .7rem; margin-top: 2px;`；359 的 `width: 26px; height: 26px;` 整條刪除。
- 767 的 `.watch-copy h3` → `.watch-band h3`；`.watch-feature` 相關全部換成 `.watch-layout` / `.watch-band`。
- 767 的 `.download-heading { text-align: left; }` 可留（桌機已改成 left）。
- 767 的 `.gratitude-note { transform: rotate(.6deg) }` → `transform: none`。
- 767 的 `.privacy-details > div:last-child { padding-bottom: 0; }` 保留。
- 1100 的 `.story-grid, .privacy-grid, .guide-layout { gap: 56px; }`：拿掉 `.story-grid`，其餘保留。
- 1100 的 `.apple-download { grid-template-columns: 1fr; padding: 32px; }` 保留。

**新增**
- `@media print { .watch-band { background: none; color: #000; } .watch-band p, .watch-band h3, .watch-band h4 { color: #000; } .hero-art { margin-right: 0; } }`

**檢查**：改完 `grep -n "story-grid\|story-copy\|handwritten\|watch-feature\|small-number\|tiny-line\|--radius:" assets/site.css` 應該只剩零或刻意保留的項目。

---

## 7. 行距與大小（Phase 1）

```css
.section-space { padding-block: var(--space-section); }
.section-heading h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.55;
}
.section-heading > p:not(.eyebrow) {
  margin-top: 22px;
  max-width: 32em;
  color: var(--muted);
}
.eyebrow {
  color: var(--green);
  font-size: .76rem;
  font-weight: 600;
  letter-spacing: .08em;
  margin-bottom: 18px;
}
```

**刪除多餘 `<br>`**（保留：hero 的 h1、Watch 的 h3、Android 的「不用趕」、收尾 h2、故事 h2）：

- Hero 描述裡的兩個 `<br class="desktop-break">`。
- `#everyday` 標題與描述。
- 資料區標題與描述。
- 下載區描述。
- FAQ 標題。
- 其他為了排版硬斷的 `<br>`。

用 `max-width` 控制換行；`text-wrap: balance` 保留。

---

## 8. 文案建議（**全部需擁有者逐句核准，不得自行套用**）

> 第一人稱六段**不准改**。以下只動非故事區，且是「建議」。

1. Hero 描述：`讓嚮家陪你們一起記錄、一起分擔，` → `讓嚮家陪你們記錄、分擔，`（三個「一起」變一個）。
2. **（預設不改，僅供擁有者選項）** 故事最後一段有三個「慢慢」：`從完成一件小事開始，慢慢熟悉、慢慢理解，也慢慢找到適合自己家庭的分工。` 若擁有者明確同意，可改為 `從完成一件小事開始，熟悉彼此的做法，也找到適合自己家庭的分工。`
   - 預設**逐字保留**；第 2 節的「六段不准改」優先於本建議。
   - 「慢慢」保留在：故事標題、便條「可以慢慢變成兩個人的默契」、收尾「願默契慢慢留下來」。三處是簽名，不要再多。
3. FAQ 標題：`把小疑問，慢慢說清楚。` → `有疑問，先看這裡。` 或 `關於下載與使用，先看這裡。`
4. 用字一致性：名詞建議「紀錄」、動詞「記錄」。目前「珍惜的記錄」可改「珍惜的紀錄」；但若 App 內一律用「記錄」，維持現狀，**由擁有者決定**。
5. 不要動：`照顧寶寶的每一天，也有人照顧你的辛苦。`、`一起照顧，也一起被照顧。`、`家，是有人願意和你一起的地方。`、便條的三段排比。這些是刻意的節奏，不是 AI 味。

**不要**為了「去 AI 感」加入：
- 假的「使用者怎麼說」。
- 「超過 10,000 個家庭」這類沒有證據的數字。
- 創辦人的姓名、照片、城市、學歷、動機故事。
- 「AI 智慧」「一鍵」「顛覆」這類字。

---

## 9. 響應式與可及性驗收

| 項目 | 通過條件 |
|---|---|
| 斷點 | 320 / 359 / 390 / 768 / 1024 / 1100 / 1440 都不出現水平捲軸（`scrollWidth === clientWidth`） |
| Hero 出血 | ≥1101 才出血；1100 以下取消負 margin |
| 標題 | 只有一個 `h1`；`h2 → h3 → h4` 不跳階；Watch 的 `h3` 在 `h2` 之後 |
| 對比 | eyebrow `#3e5848` on `#fbf8f0` 7.34:1；正文 `#5c6659` 5.65:1；深綠上 `#d3dacb` 7.70:1、`#aeb9a7` 5.41:1 |
| 焦點 | 深綠區 focus 用 `--cream`；所有 focus 可見、偏移 6px |
| 觸控 | 所有連結／按鈕 ≥44px 高 |
| 減少動態 | `prefers-reduced-motion` 下無任何動畫、平滑捲動關閉 |
| 無 JS | 內容全可讀；FAQ 用原生 `<details>`；轉址 script 不影響內文 |
| 圖片 | 每張都有 `width/height`；裝飾圖 `alt=""`；截圖 alt 描述畫面 |
| 鍵盤 | Tab 順序：skip link → logo → nav → hero CTA → 各區連結 → FAQ → footer |

改完請在 1440、768、390 各截一張全頁圖，存 `/tmp`（不要 commit），並在回報中列出檢查結果。

---

## 10. 測試與建置

### 既有 gate（必須全過）

```sh
npm ci
npm test          # 7 tests
npm run build
```

- `publishes only explicit website assets` 會遞迴列出 `assets/`，新增字型／截圖**不需要**改白名單；但 `assets/` 內**不得有隱藏檔或 symlink**（`assets/.DS_Store` 會讓測試失敗）。
- `legacy homepage redirects...` 會檢查轉址 script 與頁尾官網連結，保留。
- `homepage body` 測試比對 `dist/index.html` 與來源 body，只要 body 改動一致即可。
- 四份 `.md` 測試會比對 byte，不要碰。
- 建置只複製 `index.html`、`assets/`、四份政策、`404.html`；`docs/` 不會進 `dist`。

### 建議新增的測試（本輪一起加）

```js
test('homepage uses no third-party assets and one numbering system', async () => {
  const html = await readFile(path.join(project, 'index.html'), 'utf8');
  const css = await readFile(path.join(project, 'assets/site.css'), 'utf8');
  for (const source of [html, css]) {
    assert.ok(!/fonts\.(googleapis|gstatic)\.com|@import\s+url\(["']?https?:/.test(source),
      'Fonts and styles must be self-hosted');
  }
  assert.ok(!/[①②③]/.test(html), 'Circled numbering is retired');
});

test('every local asset referenced by the homepage exists', async () => {
  const html = await readFile(path.join(project, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
  for (const ref of new Set(refs)) await access(path.join(project, ref));
});
```

（`access` 需從 `node:fs/promises` import。）

### 建置後自查

```sh
npm run build
npx serve dist        # 或 python3 -m http.server -d dist
```

- 首頁、四份政策、404、QR、字型檔都 200。
- `dist/index.html` 的 canonical／og:url 用正式網址。
- 不要在這一步 deploy。

---

## 11. 分階段與 commit

**Phase 1（半天，低風險，先上）**
token、字型、宋體套用、eyebrow 去編號、去 `①②③`、移除黑 icon、箭頭減量、陶土色收斂、圓角改 6px、step 數字改樣式、刪多餘 `<br>`、hover 位移移除。
→ commit：`改善官網字體層級與裝飾密度`

**Phase 2（1–2 天，結構）**
Hero 不對稱出血＋hero facts、故事改信件、Watch 移出並改深綠滿版、間距節奏、資料區背景、FAQ 分組與第一題展開、下載標題左對齊、colophon。
→ commit：`重整官網區塊節奏與 Watch 深色帶`

**Phase 3（可選）**
真截圖、手寫簽名、紙紋、單一動效、icon 瘦身。
→ commit：`加入產品截圖與手寫細節`

每個 Phase 都要：`npm test` 全過、三種寬度截圖、`scrollWidth` 檢查、無 console error。**Phase 2 沒過就不要進 Phase 3。**

分支：在 `test` 上做，PR 到 `main`；不要直接推 `main`。部署與否由擁有者決定。

---

## 12. 需要擁有者決定的事（遇到就停下來問）

1. 字型：同意自架 Noto Serif TC 子集（+OFL，約 100–180KB）嗎？
2. 信件日期：可以公開「2026 年 10 月」嗎？（由 git 可證，但仍需同意）
3. 署名：用「嚮家的設計者」，還是本人姓名／手寫簽名圖？
4. 截圖：有沒有可公開的時間軸、Watch、配對畫面？沒有的話 Phase 3 直接跳過。
5. 第 8 節的文案刪修，逐句同意或否決。
6. FAQ 重新分組（會改順序）可以嗎？
7. 「記錄／紀錄」要統一成哪一個？
8. 是否接受把 Watch 區移出「陪伴日常」、成為獨立錨點 `#apple-watch`（FAQ 與外部連結仍有效）。

---

## 13. 不要做的事（再強調）

- 不要把整站換成另一套色系（紫／藍／漸層／玻璃擬態）。
- 不要引入 Tailwind、Bootstrap、AOS、Swiper、icon font。
- 不要用 CSS 畫假手機、假手錶、假 UI。
- 不要加「AI 生成」的抽象 3D 插圖或 blob。
- 不要讓每一節都淡入。
- 不要改寫第一人稱六段。
- 不要在 `main` 直接改、不要部署。
- 不要為了好看看把 `alt` 拿掉或把 `<br>` 換成空白 div。

---

## 14. 交付時請回報

1. 改了哪些檔案（含新增資產與大小）。
2. 每個 Phase 的 `npm test` 結果。
3. 1440 / 768 / 390 截圖路徑與 `scrollWidth` 檢查結果。
4. 字型是否成功載入、LCP 前後差異。
5. 哪些「擁有者決定」項目已確認、哪些被跳過。
6. 已知限制（例如 Android 無宋體 fallback、截圖尚未提供）。
