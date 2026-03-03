"use client";

import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
}

export function Divider({ className, ...rest }: DividerProps) {
  return (
    <hr
      className={cn(
        "w-full border-t border-black/10 my-lg",
        className
      )}
      {...rest}
    />
  );
}
