import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type DividerProps = HTMLAttributes<HTMLDivElement>;

export function Divider({ className, children, ...props }: DividerProps) {
  if (!children) {
    return (
      <div className={cn("fui-divider", className)} {...props}>
        <div className="fui-divider__line" />
      </div>
    );
  }

  return (
    <div className={cn("fui-divider", className)} {...props}>
      <div className="fui-divider__line" />
      <div className="fui-divider__text">{children}</div>
      <div className="fui-divider__line" />
    </div>
  );
}
