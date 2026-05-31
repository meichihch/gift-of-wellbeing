import { cn } from "../lib/utils";

export function Screen({ children, className, label }) {
  return (
    <div
      data-screen-label={label}
      className={cn(
        "flex h-full flex-col px-6 pb-8 pt-4 gift-fade-in overflow-y-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
