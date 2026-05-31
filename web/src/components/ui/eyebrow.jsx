import { cn } from "../../lib/utils";

export function Eyebrow({ className, ...p }) {
  return (
    <div
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground",
        className,
      )}
      {...p}
    />
  );
}
