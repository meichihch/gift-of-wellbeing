/* 幸福的禮物 — 主程式：流程、狀態、過場、手機外殼、Tweaks */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "breathing": "stardust",
  "receive": "stack",
  "card": "warm",
  "accent": "#e6b489",
  "demoIncoming": false
}/*EDITMODE-END*/;

const STEP_ORDER = ["welcome", "home", "needs", "receive", "share", "footprint"];

function hexToHslTriplet(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
  }
  return { hsl: `${Math.round(hue)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`, rgb: [r, g, b].map((x) => Math.round(x * 255)) };
}

/* 手機狀態列 */
function StatusBar() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between px-7 text-foreground/70">
      <span className="text-[14px] font-medium tracking-wide">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1" opacity="0.4"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4.5a10 10 0 0 1 14 0M3.5 7a6.5 6.5 0 0 1 9 0M8 9.5h.01" strokeLinecap="round"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity="0.5"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // 入站禮物（?g=key）或 demo
  const incomingKey = (() => {
    const k = new URLSearchParams(location.search).get("g");
    return GIFT_DATA.needs.some((n) => n.key === k) ? k : null;
  })();
  const fromGift = !!incomingKey || t.demoIncoming;
  const giftNeed = GIFT_DATA.needs.find((n) => n.key === (incomingKey || "calm")) || GIFT_DATA.needs[2];
  // 入站連結帶的指定句 index（?w=），沒有就隨機抽一句
  const giftWordObj = (() => {
    const wp = new URLSearchParams(location.search).get("w");
    if (incomingKey && wp !== null) return { word: giftWordAt(incomingKey, wp), index: Number(wp) || 0 };
    return giftRandomWord(giftNeed);
  })();

  const [quote] = useState(() => GIFT_DATA.quotes[Math.floor(Math.random() * GIFT_DATA.quotes.length)]);
  const [step, setStep] = useState("welcome");
  const [hist, setHist] = useState([]);
  const [intention, setIntention] = useState("");
  const [need, setNeed] = useState(giftNeed);
  const [word, setWord] = useState(giftWordObj.word);
  const [wordIndex, setWordIndex] = useState(giftWordObj.index);
  const [count, setCount] = useState(() => Number(localStorage.getItem("gift_count") || 0));

  // accent → CSS 變數
  useEffect(() => {
    const { hsl, rgb } = hexToHslTriplet(t.accent || "#e6b489");
    const root = document.documentElement.style;
    root.setProperty("--primary", hsl);
    root.setProperty("--ring", hsl);
    root.setProperty("--primary-glow", `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.55)`);
  }, [t.accent]);

  function navTo(next) { setHist((h) => [...h, step]); setStep(next); }
  function back() {
    setHist((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setStep(prev);
      return h.slice(0, -1);
    });
  }

  // 預覽：調整版面/圖卡風格時跳到對應畫面立即看到效果
  function previewStep(target) {
    if (!need) setNeed(giftNeed);
    if (step !== target) { setHist((h) => [...h, step]); setStep(target); }
  }

  function bump() {
    setCount((c) => { const n = c + 1; localStorage.setItem("gift_count", String(n)); return n; });
  }
  function goReceive(n) {
    const w = giftRandomWord(n);
    setNeed(n); setWord(w.word); setWordIndex(w.index);
    bump(); navTo("receive");
  }

  async function saveCardNow() {
    await ensureCardFonts();
    const c = document.createElement("canvas");
    drawGiftCard(c, { word, source: "", style: t.card });
    await downloadCard(c);
  }

  function resetAll() { setHist([]); setIntention(""); }

  // 進入禮物：先被照顧 → 直接看見那句話
  function enterFromWelcome() {
    if (fromGift) { setNeed(giftNeed); setWord(giftWordObj.word); setWordIndex(giftWordObj.index); bump(); navTo("receive"); }
    else navTo("needs");
  }

  const canBack = step !== "welcome" && hist.length > 0;

  let screen = null;
  if (step === "welcome")
    screen = <WelcomeScreen t={t} quote={quote} fromGift={fromGift} giftWord={giftWordObj.word} onEnter={enterFromWelcome} />;
  else if (step === "home")
    screen = <HomeScreen intention={intention} setIntention={setIntention} onNext={() => navTo("needs")} />;
  else if (step === "needs")
    screen = <NeedsScreen intention={intention} onPick={goReceive} />;
  else if (step === "receive")
    screen = <ReceiveScreen t={t} need={need} word={word} onSaveCard={saveCardNow} onReceived={() => navTo("share")} />;
  else if (step === "share")
    screen = <ShareScreen t={t} need={need} word={word} wordIndex={wordIndex} cardStyle={t.card} setCardStyle={(v) => setTweak("card", v)} onDownload={(cv) => downloadCard(cv)} onDone={() => navTo("footprint")} />;
  else if (step === "footprint")
    screen = <FootprintScreen count={count} onAgain={() => { resetAll(); setStep("needs"); }} onHome={() => { resetAll(); setStep("welcome"); }} />;

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#080705] p-0 sm:p-6">
      <div className="gift-phone relative flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-background sm:h-[864px] sm:max-h-[94vh] sm:rounded-[46px] sm:border sm:border-[#2a2620]/80 sm:shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* 環境暖光 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72"
          style={{ background: "radial-gradient(120% 80% at 50% -10%, rgba(230,180,137,0.10), rgba(230,180,137,0) 70%)" }} />

        {/* 返回 */}
        <div className="absolute left-3 top-3 z-20 h-8">
          {canBack && (
            <button onClick={back}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-secondary/50 hover:text-foreground">
              <Icon name="back" size={20} />
            </button>
          )}
        </div>

        <div key={step} className="relative z-10 flex min-h-0 flex-1 flex-col pt-6">
          {screen}
        </div>

        {/* home indicator */}
        <div className="flex h-5 shrink-0 items-center justify-center">
          <div className="h-1 w-32 rounded-full bg-foreground/20" />
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="呼吸視覺" />
        <TweakSelect label="樣式" value={t.breathing}
          options={[{ value: "stardust", label: "星辰微光（定案）" }, { value: "glow", label: "柔光圈" }, { value: "rings", label: "雙環光暈" }, { value: "ripple", label: "漣漪" }]}
          onChange={(v) => setTweak("breathing", v)} />

        <TweakSection label="接收頁排版（即時預覽）" />
        <TweakRadio label="版面" value={t.receive}
          options={[{ value: "stack", label: "光上文下" }, { value: "overlay", label: "文字疊光圈" }, { value: "center", label: "全幅置中" }]}
          onChange={(v) => { setTweak("receive", v); previewStep("receive"); }} />

        <TweakSection label="分享圖卡風格（即時預覽）" />
        <TweakRadio label="風格" value={t.card}
          options={[{ value: "warm", label: "暖光漸層" }, { value: "minimal", label: "極簡留白" }, { value: "halo", label: "光圈居中" }]}
          onChange={(v) => { setTweak("card", v); previewStep("share"); }} />

        <TweakSection label="主色（暖光）" />
        <TweakColor label="主色" value={t.accent}
          options={["#e6b489", "#e0a39d", "#e3c489", "#df9f86"]}
          onChange={(v) => setTweak("accent", v)} />

        <TweakSection label="情境" />
        <TweakToggle label="模擬：有人分享給你" value={t.demoIncoming}
          onChange={(v) => { setTweak("demoIncoming", v); setStep("welcome"); setHist([]); }} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
