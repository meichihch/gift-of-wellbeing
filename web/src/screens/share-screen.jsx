import { useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Chip } from "../components/ui/chip";
import { Eyebrow } from "../components/ui/eyebrow";
import { Icon } from "../components/icon";
import { ShareCard, downloadCard } from "../components/share-card";
import { Screen } from "./screen-shell";

const STYLE_OPTS = [
  { v: "warm", label: "暖光漸層" },
  { v: "minimal", label: "極簡留白" },
  { v: "halo", label: "光圈居中" },
];

export function ShareScreen({
  need,
  word,
  wordIndex,
  cardStyle,
  setCardStyle,
  onDone,
}) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState("");

  async function handleShare() {
    const url =
      window.location.origin +
      window.location.pathname +
      "?g=" +
      need.key +
      "&w=" +
      wordIndex;
    if (navigator.share) {
      try {
        await navigator.share({ title: "幸福的禮物", text: word, url });
        return;
      } catch (e) {
        /* fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      /* ignore */
    }
    setShowLink(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <Screen label="E 分享">
      <div className="pt-5 text-center">
        <Eyebrow>把感覺傳下去</Eyebrow>
        <h1 className="mt-3 font-serif text-[29px] leading-tight text-foreground">
          想把這份感覺，傳給誰？
        </h1>
      </div>

      <div className="mx-auto mt-6 w-[72%] max-w-[260px]">
        <ShareCard
          word={word}
          source=""
          style={cardStyle}
          canvasRef={canvasRef}
        />
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {STYLE_OPTS.map((s) => (
          <Chip
            key={s.v}
            active={cardStyle === s.v}
            onClick={() => setCardStyle(s.v)}
          >
            {s.label}
          </Chip>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={handleShare}>
          <Icon name={copied ? "check" : "share"} size={18} />
          {copied ? "已複製連結" : "分享連結"}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => downloadCard(canvasRef.current)}
        >
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
      <Button
        variant="link"
        className="mx-auto mt-4 text-muted-foreground"
        onClick={onDone}
      >
        點亮這個時刻
      </Button>
    </Screen>
  );
}
