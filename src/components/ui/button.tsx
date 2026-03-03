"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-red text-bone hover:bg-dark-red",
  secondary: "bg-black text-bone hover:bg-black/90",
  ghost:
    "bg-transparent border border-red text-red hover:bg-red hover:text-bone",
} as const;

const sizeStyles = {
  small: "px-4 py-2 text-sm",
  default: "px-6 py-3",
  large: "px-8 py-4 text-lg",
} as const;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small" | "large";
  children: React.ReactNode;
  className?: string;
  href?: string;
  disabled?: boolean;
}

const base =
  "font-obviously font-medium lowercase rounded-button transition-colors inline-flex items-center justify-center";

export interface ButtonInnerProps extends ButtonProps {
  as: "button" | typeof Link | "a";
}

const ButtonInner = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonInnerProps
>(function ButtonInner(
  {
    variant = "primary",
    size = "default",
    children,
    className,
    href,
    disabled,
    as: Comp,
    onClick,
    ...rest
  },
  ref
) {
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  const classes = cn(
    base,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    className
  );

  if (Comp === "button") {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  const linkOnClick = onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined;

  if (Comp === Link) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href as string}
        className={classes}
        onClick={linkOnClick}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      className={classes}
      onClick={linkOnClick}
      aria-disabled={disabled}
    >
      {children}
    </a>
  );
});

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ href, ...props }, ref) {
    const isInternal = href?.startsWith("/");
    if (href != null && href !== "") {
      return (
        <ButtonInner
          {...props}
          href={href}
          as={isInternal ? Link : "a"}
          ref={ref as React.Ref<HTMLAnchorElement>}
        />
      );
    }
    return (
      <ButtonInner
        {...props}
        as="button"
        ref={ref as React.Ref<HTMLButtonElement>}
      />
    );
  }
);
