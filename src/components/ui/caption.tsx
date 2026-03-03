"use client";

import { cn } from "@/lib/utils";

export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

export function Caption({ children, className, ...rest }: CaptionProps) {
  return (
    <span
      className={cn(
        "font-obviously font-normal text-caption text-black/55",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
