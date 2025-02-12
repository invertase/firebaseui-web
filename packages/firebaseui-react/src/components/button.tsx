import { ButtonHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "fui-form__button",
        variant === "secondary" && "fui-form__button--secondary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
