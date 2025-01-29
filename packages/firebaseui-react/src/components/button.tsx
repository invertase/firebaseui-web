import { type ButtonHTMLAttributes } from "react";

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
      className={`fui-form__button ${
        variant === "secondary" ? "fui-form__button--secondary" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
