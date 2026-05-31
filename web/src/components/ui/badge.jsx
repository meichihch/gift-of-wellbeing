import { cn } from "../../lib/utils";

const VARIANTS = {
  default: "bg-primary/15 text-primary border-primary/25",
  muted: "bg-secondary/60 text-muted-foreground border-border/60",
};

export function Badge({ className, variant = "default", ...p }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        VARIANTS[variant],
        className,
      )}
      {...p}
    />
  );
}
