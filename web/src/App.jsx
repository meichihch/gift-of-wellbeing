/* 幸福的禮物 — 主程式：流程、狀態、過場、手機外殼 */
import { useEffect, useMemo, useState } from "react";
import { Icon } from "./components/icon";
import {
  GIFT_DATA,
  giftRandomWord,
  giftWordAt,
} from "./data/gift";
import { hexToHslTriplet } from "./lib/utils";
import { FootprintScreen } from "./screens/footprint-screen";
import { NeedsScreen } from "./screens/needs-screen";
import { ReceiveScreen } from "./screens/receive-screen";
import { ShareScreen } from "./screens/share-screen";
import { WelcomeScreen } from "./screens/welcome-screen";
// B 首頁目前隱藏，保留 import 與流程位置（A→B→C），日後產品結構更複雜時再帶回。
// import { HomeScreen } from "./screens/home-screen";

/* 定案值（README 第 160 行）：呼吸=stardust、版面=stack、圖卡=warm、主色=#e6b489 */
const DEFAULTS = {
  breathing: "stardust",
  receiveLayout: "stack",
  cardStyle: "warm",
  accent: "#e6b489",
};

function readGiftParams() {
  if (typeof window === "undefined")
    return { incomingKey: null, wordParam: null };
  const params = new URLSearchParams(window.location.search);
  const k = params.get("g");
  const validKey = GIFT_DATA.needs.some((n) => n.key === k) ? k : null;
  return { incomingKey: validKey, wordParam: params.get("w") };
}

export default function App() {
  const { incomingKey, wordParam } = useMemo(readGiftParams, []);
  const fromGift = !!incomingKey;

  const giftNeed = useMemo(
    () =>
      GIFT_DATA.needs.find((n) => n.key === (incomingKey || "calm")) ||
      GIFT_DATA.needs[2],
    [incomingKey],
  );

  // 入站連結帶的指定句 index（?w=），沒有就隨機抽一句
  const giftWordObj = useMemo(() => {
    if (incomingKey && wordParam !== null) {
      return {
        word: giftWordAt(incomingKey, wordParam),
        index: Number(wordParam) || 0,
      };
    }
    return giftRandomWord(giftNeed);
  }, [incomingKey, wordParam, giftNeed]);

  const [quote] = useState(
    () => GIFT_DATA.quotes[Math.floor(Math.random() * GIFT_DATA.quotes.length)],
  );
  const [step, setStep] = useState("welcome");
  const [hist, setHist] = useState([]);
  const [need, setNeed] = useState(giftNeed);
  const [word, setWord] = useState(giftWordObj.word);
  const [wordIndex, setWordIndex] = useState(giftWordObj.index);
  const [cardStyle, setCardStyle] = useState(DEFAULTS.cardStyle);
  const [count, setCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(window.localStorage.getItem("gift_count") || 0);
  });

  // accent → CSS 變數
  useEffect(() => {
    const { hsl, rgb } = hexToHslTriplet(DEFAULTS.accent);
    const root = document.documentElement.style;
    root.setProperty("--primary", hsl);
    root.setProperty("--ring", hsl);
    root.setProperty(
      "--primary-glow",
      `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.55)`,
    );
  }, []);

  function navTo(next) {
    setHist((h) => [...h, step]);
    setStep(next);
  }
  function back() {
    setHist((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setStep(prev);
      return h.slice(0, -1);
    });
  }

  function bump() {
    setCount((c) => {
      const n = c + 1;
      try {
        window.localStorage.setItem("gift_count", String(n));
      } catch (e) {
        /* ignore */
      }
      return n;
    });
  }

  function goReceive(n) {
    const w = giftRandomWord(n);
    setNeed(n);
    setWord(w.word);
    setWordIndex(w.index);
    bump();
    navTo("receive");
  }

  function resetAll() {
    setHist([]);
  }

  // 被分享者已在歡迎頁讀到那句被留下的話，「繼續探索」帶他進入自己的流程（C）。
  // 一般訪客（非禮物）也同樣進入 C。
  function enterFromWelcome() {
    if (fromGift) bump();
    navTo("needs");
  }

  const canBack = step !== "welcome" && hist.length > 0;

  let screen = null;
  if (step === "welcome") {
    screen = (
      <WelcomeScreen
        breathing={DEFAULTS.breathing}
        quote={quote}
        fromGift={fromGift}
        giftWord={giftWordObj.word}
        onEnter={enterFromWelcome}
      />
    );
  } else if (step === "needs") {
    screen = <NeedsScreen intention="" onPick={goReceive} />;
  } else if (step === "receive") {
    screen = (
      <ReceiveScreen
        breathing={DEFAULTS.breathing}
        layout={DEFAULTS.receiveLayout}
        need={need}
        word={word}
        onReceived={() => navTo("share")}
      />
    );
  } else if (step === "share") {
    screen = (
      <ShareScreen
        need={need}
        word={word}
        wordIndex={wordIndex}
        cardStyle={cardStyle}
        setCardStyle={setCardStyle}
        onDone={() => navTo("footprint")}
      />
    );
  } else if (step === "footprint") {
    screen = (
      <FootprintScreen
        count={count}
        onContinue={() => {
          resetAll();
          setStep("needs");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#080705] p-0 sm:p-6">
      <div className="gift-phone relative flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-background sm:h-[864px] sm:max-h-[94vh] sm:rounded-[46px] sm:border sm:border-[#2a2620]/80 sm:shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* 環境暖光 */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(230,180,137,0.10), rgba(230,180,137,0) 70%)",
          }}
        />

        {/* 返回 */}
        <div className="absolute left-3 top-3 z-20 h-8">
          {canBack && (
            <button
              type="button"
              onClick={back}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-secondary/50 hover:text-foreground"
              aria-label="返回"
            >
              <Icon name="back" size={20} />
            </button>
          )}
        </div>

        <div
          key={step}
          className="relative z-10 flex min-h-0 flex-1 flex-col pt-6"
        >
          {screen}
        </div>

        {/* home indicator */}
        <div className="flex h-5 shrink-0 items-center justify-center">
          <div className="h-1 w-32 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
