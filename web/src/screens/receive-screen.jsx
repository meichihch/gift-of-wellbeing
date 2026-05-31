import { BreathingVisual } from "../components/breathing-visual";
import { Button } from "../components/ui/button";
import { Icon } from "../components/icon";
import { cn } from "../lib/utils";
import { Screen } from "./screen-shell";

export function ReceiveScreen({
  breathing,
  layout = "stack",
  need,
  word,
  onReceived,
}) {
  const Words = ({ size = "text-[27px]", className }) => (
    <p
      className={cn(
        "font-serif leading-[1.6] text-foreground/95",
        size,
        className,
      )}
      style={{ textWrap: "balance" }}
    >
      {word}
    </p>
  );

  return (
    <Screen label="D 接收" className="text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        {layout === "stack" && (
          <div className="flex flex-col items-center">
            <BreathingVisual variant={breathing} size={150} />
            <div className="mt-2 max-w-[300px] px-2">
              <Words />
            </div>
          </div>
        )}

        {layout === "overlay" && (
          <div className="relative flex items-center justify-center">
            <BreathingVisual variant={breathing} size={230} />
            <div className="absolute inset-0 flex items-center justify-center px-10">
              <Words size="text-[24px]" />
            </div>
          </div>
        )}

        {layout === "center" && (
          <div className="relative flex flex-col items-center justify-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <BreathingVisual
                variant={breathing}
                size={120}
                className="opacity-80"
              />
            </div>
            <div className="relative max-w-[320px] px-2">
              <Words size="text-[30px]" />
            </div>
          </div>
        )}

        <p className="mt-7 text-[12px] tracking-[0.2em] text-muted-foreground/80 uppercase">
          {need.label}
        </p>
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
