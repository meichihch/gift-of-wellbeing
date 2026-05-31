/* shadcn-style primitives, re-skinned to the 幸福的禮物 warm-dark theme.
   Built in the shadcn idiom: CSS-variable tokens + Tailwind utility classes +
   variant maps. Exported to window for cross-file use. */
const { useState, useRef, useEffect, useCallback, createContext, useContext } = React;

// cn — class joiner
function cn(...a) { return a.filter(Boolean).join(" "); }

/* Button — shadcn variants */
const BTN_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] " +
  "text-[15px] font-medium tracking-[0.01em] transition-all duration-300 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-0 " +
  "disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]";
const BTN_VARIANTS = {
  default:
    "bg-primary text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_8px_30px_-12px_var(--primary-glow)] hover:brightness-[1.06]",
  secondary:
    "bg-secondary text-foreground/90 hover:bg-secondary/70 border border-border/60",
  outline:
    "border border-border bg-transparent text-foreground/85 hover:bg-secondary/50 hover:border-border/80",
  ghost: "bg-transparent text-foreground/70 hover:bg-secondary/50 hover:text-foreground",
  link: "bg-transparent text-primary underline-offset-4 hover:underline px-0",
};
const BTN_SIZES = {
  default: "h-11 px-5 py-2",
  sm: "h-9 px-3.5 text-[13px]",
  lg: "h-14 px-7 text-base rounded-full",
  icon: "h-10 w-10 p-0",
  pill: "h-12 px-6 rounded-full",
};
function Button({ variant = "default", size = "default", className, asChild, ...props }) {
  return (
    <button
      className={cn(BTN_BASE, BTN_VARIANTS[variant], BTN_SIZES[size], className)}
      {...props}
    />
  );
}

/* Card */
function Card({ className, ...p }) {
  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)+4px)] border border-border/70 bg-card text-card-foreground",
        "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
        className
      )}
      {...p}
    />
  );
}
function CardHeader({ className, ...p }) { return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...p} />; }
function CardTitle({ className, ...p }) { return <div className={cn("text-base font-semibold leading-tight", className)} {...p} />; }
function CardDescription({ className, ...p }) { return <div className={cn("text-sm text-muted-foreground", className)} {...p} />; }
function CardContent({ className, ...p }) { return <div className={cn("p-5 pt-0", className)} {...p} />; }
function CardFooter({ className, ...p }) { return <div className={cn("flex items-center p-5 pt-0", className)} {...p} />; }

/* Input / Textarea */
const FIELD_BASE =
  "w-full rounded-[var(--radius)] border border-input bg-secondary/30 px-4 text-foreground " +
  "placeholder:text-muted-foreground/70 transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:border-primary/60 focus-visible:bg-secondary/50 " +
  "focus-visible:ring-2 focus-visible:ring-ring/25";
function Input({ className, ...p }) {
  return <input className={cn(FIELD_BASE, "h-12 text-[15px]", className)} {...p} />;
}
function Textarea({ className, ...p }) {
  return <textarea className={cn(FIELD_BASE, "min-h-[88px] py-3 text-[15px] leading-relaxed resize-none", className)} {...p} />;
}

/* Badge / Chip */
function Badge({ className, variant = "default", ...p }) {
  const v = {
    default: "bg-primary/15 text-primary border-primary/25",
    muted: "bg-secondary/60 text-muted-foreground border-border/60",
  }[variant];
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide", v, className)}
      {...p}
    />
  );
}

/* Chip — selectable suggestion pill */
function Chip({ active, className, ...p }) {
  return (
    <button
      className={cn(
        "rounded-full border px-3.5 py-2 text-[13px] transition-all duration-200 active:scale-[0.97]",
        active
          ? "border-primary/50 bg-primary/15 text-primary"
          : "border-border/70 bg-secondary/30 text-foreground/75 hover:border-border hover:bg-secondary/50",
        className
      )}
      {...p}
    />
  );
}

/* Tabs (controlled, lightweight) */
function Tabs({ value, onValueChange, items, className }) {
  return (
    <div className={cn("inline-flex rounded-full bg-secondary/40 p-1 border border-border/50", className)}>
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onValueChange(it.value)}
          className={cn(
            "relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-200",
            value === it.value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground/80"
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

/* Separator */
function Separator({ className }) {
  return <div className={cn("h-px w-full bg-gradient-to-r from-transparent via-border to-transparent", className)} />;
}

/* Small label-y eyebrow */
function Eyebrow({ className, ...p }) {
  return <div className={cn("text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground", className)} {...p} />;
}

Object.assign(window, {
  cn, Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Textarea, Badge, Chip, Tabs, Separator, Eyebrow,
});
