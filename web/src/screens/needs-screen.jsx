import { useState } from "react";
import { BreathingVisual } from "../components/breathing-visual";
import { Button } from "../components/ui/button";
import { Icon } from "../components/icon";
import { GIFT_DATA } from "../data/gift";
import { cn } from "../lib/utils";
import { Screen } from "./screen-shell";

export function NeedsScreen({ intention, onPick }) {
  const [selected, setSelected] = useState(null);

  return (
    <Screen label="C 需求" className="relative">
      <div className="pointer-events-none absolute -right-6 -top-2 z-0 h-44 w-44 opacity-90">
        <BreathingVisual variant="stars" size={120} />
      </div>

      <div className="relative z-10 pt-6">
        <h1 className="font-serif text-[32px] leading-tight text-foreground">
          此刻，你需要什麼？
        </h1>
        {intention && intention.trim() && (
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
              type="button"
              onClick={() => setSelected(n)}
              className={cn(
                "group relative flex h-[104px] flex-col justify-end overflow-hidden rounded-[18px] border p-4 text-left transition-all duration-300 active:scale-[0.98]",
                active
                  ? "border-primary/60 bg-primary/12"
                  : "border-border/70 bg-secondary/25 hover:border-primary/40 hover:bg-secondary/45",
              )}
            >
              <span
                className={cn(
                  "text-[15px] font-medium leading-snug transition-colors",
                  active ? "text-primary" : "text-foreground/90",
                )}
              >
                {n.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-auto pt-6">
        <Button
          size="lg"
          className="w-full"
          disabled={!selected}
          onClick={() => selected && onPick(selected)}
        >
          我準備好了
          <Icon name="arrowRight" size={18} />
        </Button>
      </div>
    </Screen>
  );
}
