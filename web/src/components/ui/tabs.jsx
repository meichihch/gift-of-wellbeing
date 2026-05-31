import { cn } from "../../lib/utils";

export function Tabs({ value, onValueChange, items, className }) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full bg-secondary/40 p-1 border border-border/50",
        className,
      )}
    >
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          onClick={() => onValueChange(it.value)}
          className={cn(
            "relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-200",
            value === it.value
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground/80",
          )}
        >
          {value === it.value && (
            <span className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_20px_-10px_var(--primary-glow)]" />
          )}
          <span className="relative z-10">{it.label}</span>
        </button>
      ))}
    </div>
  );
}
