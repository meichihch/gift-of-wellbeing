import { cn } from "../../lib/utils";

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
  ghost:
    "bg-transparent text-foreground/70 hover:bg-secondary/50 hover:text-foreground",
  link: "bg-transparent text-primary underline-offset-4 hover:underline px-0",
};

const BTN_SIZES = {
  default: "h-11 px-5 py-2",
  sm: "h-9 px-3.5 text-[13px]",
  lg: "h-14 px-7 text-base",
  icon: "h-10 w-10 p-0",
  pill: "h-12 px-6 rounded-full",
};

export function Button({
  variant = "default",
  size = "default",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(BTN_BASE, BTN_VARIANTS[variant], BTN_SIZES[size], className)}
      {...props}
    />
  );
}
