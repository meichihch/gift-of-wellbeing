import { Button } from "../components/ui/button";
import { Eyebrow } from "../components/ui/eyebrow";
import { Icon } from "../components/icon";
import { Screen } from "./screen-shell";

export function FootprintScreen({ count, onContinue }) {
  const dots = Math.min(count, 24);

  return (
    <Screen label="F 足跡" className="text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Eyebrow className="mb-8">你的足跡</Eyebrow>

        <div className="mb-9 grid grid-cols-6 gap-3.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full transition-all duration-700"
              style={{
                background:
                  i < dots
                    ? "radial-gradient(circle, #f7d9c0 0%, rgba(230,180,137,0.85) 60%, rgba(230,180,137,0) 100%)"
                    : "rgba(154,143,128,0.18)",
                boxShadow:
                  i < dots ? "0 0 10px 1px rgba(247,217,192,0.55)" : "none",
                animationDelay: `${i * 40}ms`,
              }}
            />
          ))}
        </div>

        <p className="font-serif text-[26px] leading-[1.5] text-foreground/95">
          你已點亮 <span className="text-primary">{count}</span> 個
          <br />
          被照顧的時刻
        </p>
        <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-muted-foreground">
          每一次照顧好自己，溫柔就多了一個出口。
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button size="lg" className="w-full" onClick={onContinue}>
          <Icon name="arrowRight" size={18} />
          繼續探索
        </Button>
      </div>
    </Screen>
  );
}
