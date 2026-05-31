import { BreathingVisual } from "../components/breathing-visual";
import { Button } from "../components/ui/button";
import { Eyebrow } from "../components/ui/eyebrow";
import { Icon } from "../components/icon";
import {
  drawGiftCard,
  downloadCard,
  ensureCardFonts,
} from "../components/share-card";
import { GIFT_DATA } from "../data/gift";
import { Screen } from "./screen-shell";

export function WelcomeScreen({ breathing, quote, fromGift, giftWord, onEnter }) {
  async function handleSaveGiftCard() {
    await ensureCardFonts();
    const canvas = document.createElement("canvas");
    drawGiftCard(canvas, { word: giftWord, source: "", style: "warm" });
    await downloadCard(canvas);
  }

  return (
    <Screen label="A 歡迎" className="items-center justify-center text-center">
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <div className="pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
          <BreathingVisual
            variant={breathing}
            size={breathing === "stardust" ? 150 : 168}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <Eyebrow className="mb-8">
            {fromGift ? "有人想到了你" : "今天也有人在這裡陪你"}
          </Eyebrow>

          <p
            className="font-serif text-[27px] leading-[1.55] text-foreground/95 px-2"
            style={{ textWrap: "balance" }}
          >
            {fromGift ? giftWord : quote.text}
          </p>

          {!fromGift && quote.source && (
            <p className="mt-5 text-[13px] tracking-wide text-muted-foreground">
              — {quote.source}
            </p>
          )}
          {fromGift && (
            <p className="mt-5 text-[13px] tracking-wide text-muted-foreground">
              有人把這句話，留給了你。
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full">
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={onEnter}>
            {fromGift ? "繼續探索" : "留點時間給自己"}
            <Icon name="arrowRight" size={18} />
          </Button>
          {fromGift && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSaveGiftCard}
            >
              <Icon name="download" size={17} />
              存成圖卡
            </Button>
          )}
        </div>
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
