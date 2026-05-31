/* 簡單線性圖示（只用基本幾何線條） */
const { useState, useRef } = React;
function Icon({ name, size = 20, className, stroke = 1.6 }) {
  const paths = {
    arrowRight: <><path d="M4 12h15" /><path d="M13 6l6 6-6 6" /></>,
    back: <path d="M15 18l-6-6 6-6" />,
    share: <><path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M5 13v6h14v-6" /></>,
    download: <><path d="M12 3v12" /><path d="M8 11l4 4 4-4" /><path d="M5 19h14" /></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>,
    check: <path d="M5 12l4 4 9-10" />,
    sparkle: <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />,
    refresh: <><path d="M4 11a8 8 0 0 1 14-5l2 2" /><path d="M20 5v4h-4" /><path d="M20 13a8 8 0 0 1-14 5l-2-2" /><path d="M4 19v-4h4" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/* 螢幕容器：統一內距與淡入 */
function Screen({ children, className, label }) {
  return (
    <div data-screen-label={label}
      className={cn("flex h-full flex-col px-6 pb-8 pt-4 gift-fade-in overflow-y-auto", className)}>
      {children}
    </div>
  );
}

/* ───────────────── A. 歡迎頁 ───────────────── */
function WelcomeScreen({ t, quote, fromGift, giftWord, onEnter }) {
  return (
    <Screen label="A 歡迎" className="items-center justify-center text-center">
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%]">
          <BreathingVisual variant={t.breathing} size={t.breathing === "stardust" ? 150 : 168} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <Eyebrow className="mb-8">{fromGift ? "有人想到了你" : "今天也有人在這裡陪你"}</Eyebrow>

          <p className="font-serif text-[27px] leading-[1.55] text-foreground/95 px-2" style={{ textWrap: "balance" }}>
            {fromGift ? giftWord : quote.text}
          </p>

          {!fromGift && quote.source && (
            <p className="mt-5 text-[13px] tracking-wide text-muted-foreground">— {quote.source}</p>
          )}
          {fromGift && (
            <p className="mt-5 text-[13px] tracking-wide text-muted-foreground">有人把這句話，留給了你。</p>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full">
        <Button size="lg" className="w-full" onClick={onEnter}>
          {fromGift ? "我想看看" : "留點時間給自己"}
          <Icon name="arrowRight" size={18} />
        </Button>
        {!fromGift && (
          <p className="mt-4 text-[12px] text-muted-foreground/80">
            此刻有{" "}
            <span className="font-sans text-[15px] tracking-wide text-muted-foreground tabular-nums">
              {Number(GIFT_DATA.companions).toLocaleString()}
            </span>{" "}
            人，也在這裡照顧自己
          </p>
        )}
      </div>
    </Screen>
  );
}

/* ───────────────── B. 首頁 — 設定意圖 ───────────────── */
function HomeScreen({ intention, setIntention, onNext }) {
  return (
    <Screen label="B 首頁" className="relative">
      {/* 右上角浮動星辰 */}
      <div className="pointer-events-none absolute -right-6 -top-2 z-0 h-44 w-44 opacity-90">
        <BreathingVisual variant="stars" size={120} />
      </div>

      <div className="relative z-10 pt-6">
        <h1 className="font-serif text-[34px] leading-tight text-foreground">今天，我想…</h1>
      </div>

      <div className="relative z-10 mt-6">
        <Textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="寫下今天想為自己做的一件事"
          rows={2}
        />
      </div>

      <div className="relative z-10 mt-7 flex-1">
        <Eyebrow className="mb-4">靈感庫</Eyebrow>
        <div className="flex flex-wrap gap-2.5">
          {GIFT_DATA.ideas.map((idea) => (
            <Chip key={idea} active={intention === idea} onClick={() => setIntention(idea)}>
              {idea}
            </Chip>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-4">
        <Button size="lg" className="w-full" disabled={!intention.trim()} onClick={onNext}>
          我準備好了
          <Icon name="arrowRight" size={18} />
        </Button>
      </div>
    </Screen>
  );
}

/* ───────────────── C. 此刻你需要什麼 ───────────────── */
function NeedsScreen({ intention, onPick }) {
  const [selected, setSelected] = useState(null);
  return (
    <Screen label="C 需求" className="relative">
      {/* 右上角浮動星辰（與「今天，我想…」同一套） */}
      <div className="pointer-events-none absolute -right-6 -top-2 z-0 h-44 w-44 opacity-90">
        <BreathingVisual variant="stars" size={120} />
      </div>

      <div className="relative z-10 pt-6">
        <h1 className="font-serif text-[32px] leading-tight text-foreground">此刻，你需要什麼？</h1>
        {intention.trim() && (
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            你想著「{intention.trim()}」。先照顧一下現在的自己。
          </p>
        )}
      </div>

      <div className="relative z-10 mt-7 grid grid-cols-2 gap-3 content-start">
        {GIFT_DATA.needs.map((n) => {
          const active = selected && selected.key === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setSelected(n)}
              className={cn(
                "group relative flex h-[104px] flex-col justify-end overflow-hidden rounded-[18px] border p-4 text-left transition-all duration-300 active:scale-[0.98]",
                active
                  ? "border-primary/60 bg-primary/12"
                  : "border-border/70 bg-secondary/25 hover:border-primary/40 hover:bg-secondary/45"
              )}
            >
              <span className={cn("text-[15px] font-medium leading-snug transition-colors", active ? "text-primary" : "text-foreground/90")}>
                {n.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-auto pt-6">
        <Button size="lg" className="w-full" disabled={!selected} onClick={() => selected && onPick(selected)}>
          我準備好了
          <Icon name="arrowRight" size={18} />
        </Button>
      </div>
    </Screen>
  );
}

Object.assign(window, { Icon, Screen, WelcomeScreen, HomeScreen, NeedsScreen });
