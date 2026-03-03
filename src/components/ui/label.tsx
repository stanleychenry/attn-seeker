"use client";

import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export function Label({ children, className, ...rest }: LabelProps) {
  return (
    <label
      className={cn(
        "font-obviously font-medium text-[16px] lowercase tracking-wide",
        className
      )}
      {...rest}
    >
      {children}
    </label>
  );
}
