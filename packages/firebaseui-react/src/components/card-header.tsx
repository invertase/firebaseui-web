import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({
  children,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("fui-card__header", className)} {...props}>
      {/* FIXME: children type does not match for some reason */}
      {/* @ts-ignore */}
      {children}
    </div>
  );
}
