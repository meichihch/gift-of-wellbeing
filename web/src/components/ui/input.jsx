import { cn } from "../../lib/utils";

const FIELD_BASE =
  "w-full rounded-[var(--radius)] border border-input bg-secondary/30 px-4 text-foreground " +
  "placeholder:text-muted-foreground/70 transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:border-primary/60 focus-visible:bg-secondary/50 " +
  "focus-visible:ring-2 focus-visible:ring-ring/25";

export function Input({ className, ...p }) {
  return <input className={cn(FIELD_BASE, "h-12 text-[15px]", className)} {...p} />;
}

export function Textarea({ className, ...p }) {
  return (
    <textarea
      className={cn(
        FIELD_BASE,
        "min-h-[88px] py-3 text-[15px] leading-relaxed resize-none",
        className,
      )}
      {...p}
    />
  );
}
