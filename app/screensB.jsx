/* ───────────────── D. 接收 ───────────────── */
const { useState, useRef } = React;
function ReceiveScreen({ t, need, word, onSaveCard, onReceived }) {
  const layout = t.receive;

  const Words = ({ size = "text-[27px]", className }) => (
    <p className={cn("font-serif leading-[1.6] text-foreground/95", size, className)} style={{ textWrap: "balance" }}>
      {word}
    </p>
  );

  return (
    <Screen label="D 接收" className="text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        {layout === "stack" && (
          <div className="flex flex-col items-center">
            <BreathingVisual variant={t.breathing} size={150} />
            <div className="mt-2 max-w-[300px] px-2"><Words /></div>
          </div>
        )}

        {layout === "overlay" && (
          <div className="relative flex items-center justify-center">
            <BreathingVisual variant={t.breathing} size={230} />
            <div className="absolute inset-0 flex items-center justify-center px-10">
              <Words size="text-[24px]" />
            </div>
          </div>
        )}

        {layout === "center" && (
          <div className="relative flex flex-col items-center justify-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <BreathingVisual variant={t.breathing} size={120} className="opacity-80" />
            </div>
            <div className="relative max-w-[320px] px-2"><Words size="text-[30px]" /></div>
          </div>
        )}

        <p className="mt-7 text-[12px] tracking-[0.2em] text-muted-foreground/80 uppercase">{need.label}</p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button size="lg" className="w-full" onClick={onReceived}>
          我收到了
          <Icon name="arrowRight" size={18} />
        </Button>
      </div>
    </Screen>
  );
}

/* ───────────────── E. 分享 ───────────────── */
function ShareScreen({ t, need, word, wordIndex, cardStyle, setCardStyle, onDownload, onDone }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState("");

  const styleOpts = [
    { v: "warm", label: "暖光漸層" },
    { v: "minimal", label: "極簡留白" },
    { v: "halo", label: "光圈居中" },
  ];

  async function handleShare() {
    const url = location.origin + location.pathname + "?g=" + need.key + "&w=" + wordIndex;
    if (navigator.share) {
      try { await navigator.share({ title: "幸福的禮物", text: word, url }); return; } catch (e) {}
    }
    try { await navigator.clipboard.writeText(url); } catch (e) {}
    setShowLink(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <Screen label="E 分享">
      <div className="pt-5 text-center">
        <Eyebrow>把感覺傳下去</Eyebrow>
        <h1 className="mt-3 font-serif text-[29px] leading-tight text-foreground">想把這份感覺，傳給誰？</h1>
      </div>

      <div className="mx-auto mt-6 w-[72%] max-w-[260px]">
        <ShareCard word={word} source="" style={cardStyle} canvasRef={canvasRef} />
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {styleOpts.map((s) => (
          <Chip key={s.v} active={cardStyle === s.v} onClick={() => setCardStyle(s.v)}>{s.label}</Chip>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={handleShare}>
          <Icon name={copied ? "check" : "share"} size={18} />
          {copied ? "已複製連結" : "分享連結"}
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => onDownload(canvasRef.current)}>
          <Icon name="download" size={17} />
          存成圖卡
        </Button>
      </div>

      {showLink && (
        <div className="mt-3 break-all rounded-[var(--radius)] border border-border/60 bg-secondary/30 px-3 py-2 text-[11px] text-muted-foreground">
          {showLink}
        </div>
      )}

      <div className="flex-1" />
      <Button variant="link" className="mx-auto mt-4 text-muted-foreground" onClick={onDone}>
        先這樣就好
      </Button>
    </Screen>
  );
}

/* ───────────────── F. 足跡 ───────────────── */
function FootprintScreen({ count, onAgain, onHome }) {
  const dots = Math.min(count, 24);
  return (
    <Screen label="F 足跡" className="text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Eyebrow className="mb-8">你的足跡</Eyebrow>

        <div className="mb-9 grid grid-cols-6 gap-3.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="h-3 w-3 rounded-full transition-all duration-700"
              style={{
                background: i < dots
                  ? "radial-gradient(circle, #f7d9c0 0%, rgba(230,180,137,0.85) 60%, rgba(230,180,137,0) 100%)"
                  : "rgba(154,143,128,0.18)",
                boxShadow: i < dots ? "0 0 10px 1px rgba(247,217,192,0.55)" : "none",
                animationDelay: `${i * 40}ms`,
              }} />
          ))}
        </div>

        <p className="font-serif text-[26px] leading-[1.5] text-foreground/95">
          你已點亮 <span className="text-primary">{count}</span> 個<br />被照顧的時刻
        </p>
        <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-muted-foreground">
          每一次照顧好自己，溫柔就多了一個出口。
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button size="lg" className="w-full" onClick={onAgain}>
          <Icon name="refresh" size={17} />
          再給自己一次
        </Button>
        <Button variant="ghost" className="w-full" onClick={onHome}>回到開始</Button>
      </div>
    </Screen>
  );
}

Object.assign(window, { ReceiveScreen, ShareScreen, FootprintScreen });
