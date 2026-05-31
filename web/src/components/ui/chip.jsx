import { cn } from "../../lib/utils";

export function Chip({ active, className, type = "button", ...p }) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-full border px-3.5 py-2 text-[13px] transition-all duration-200 active:scale-[0.97]",
        active
          ? "border-primary/50 bg-primary/15 text-primary"
          : "border-border/70 bg-secondary/30 text-foreground/75 hover:border-border hover:bg-secondary/50",
        className,
      )}
      {...p}
    />
  );
}
