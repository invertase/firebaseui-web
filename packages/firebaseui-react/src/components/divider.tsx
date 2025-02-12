import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export function Divider({ text, className = "", ...props }: DividerProps) {
  if (!text) {
    return (
      <div className={cn("fui-divider", className)} {...props}>
        <div className="fui-divider__line" />
      </div>
    );
  }

  return (
    <div className={cn("fui-divider", className)} {...props}>
      <div className="fui-divider__line" />
      <div className="fui-divider__text">{text}</div>
      <div className="fui-divider__line" />
    </div>
  );
}
