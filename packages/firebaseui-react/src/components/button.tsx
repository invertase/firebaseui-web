import { ButtonHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

const buttonVariants = {
  primary: "fui-button",
  secondary: "fui-button fui-button--secondary",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
