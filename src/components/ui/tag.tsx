"use client";

import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-black/5 text-black",
  red: "bg-red text-bone",
} as const;

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "red";
}

export function Tag({
  children,
  className,
  variant = "default",
  ...rest
}: TagProps) {
  return (
    <span
      className={cn(
        "rounded-pill px-3 py-1 font-obviously text-[13px] lowercase",
        variantStyles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
