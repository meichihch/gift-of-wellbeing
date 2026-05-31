import { cn } from "../../lib/utils";

export function Card({ className, ...p }) {
  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)+4px)] border border-border/70 bg-card text-card-foreground",
        "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
        className,
      )}
      {...p}
    />
  );
}
export function CardHeader({ className, ...p }) {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...p} />;
}
export function CardTitle({ className, ...p }) {
  return (
    <div
      className={cn("text-base font-semibold leading-tight", className)}
      {...p}
    />
  );
}
export function CardDescription({ className, ...p }) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      {...p}
    />
  );
}
export function CardContent({ className, ...p }) {
  return <div className={cn("p-5 pt-0", className)} {...p} />;
}
export function CardFooter({ className, ...p }) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...p} />;
}
