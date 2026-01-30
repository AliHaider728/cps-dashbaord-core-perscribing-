import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? "span" : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none",
        variant === "default" && "bg-black text-white hover:bg-black/90",
        variant === "outline" && "border border-input bg-background hover:bg-muted",
        size === "default" && "h-9 px-4",
        size === "sm" && "h-8 px-3",
        className
      )}
      {...props}
    />
  );
}
