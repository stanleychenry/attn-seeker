"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Caption } from "./caption";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, placeholder, type = "text", className, error, id, ...rest },
    ref
  ) {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="flex flex-col gap-xs">
        {label != null && (
          <Label htmlFor={inputId} className="block">
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full bg-white border border-black/10 rounded-button font-tiempos-text text-base text-black placeholder:text-black/55",
            "focus:outline-none focus:border-red focus:ring-1 focus:ring-red",
            error != null && "border-red focus:border-red focus:ring-red",
            className
          )}
          aria-invalid={error != null}
          aria-describedby={error != null ? `${inputId}-error` : undefined}
          {...rest}
        />
        {error != null && (
          <Caption id={`${inputId}-error`} className="text-red">
            {error}
          </Caption>
        )}
      </div>
    );
  }
);
