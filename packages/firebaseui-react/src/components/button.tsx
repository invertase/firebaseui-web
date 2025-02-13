import { ButtonHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button type="button" className={cn("fui-button", className)} {...props}>
      {children}
    </button>
  );
}
