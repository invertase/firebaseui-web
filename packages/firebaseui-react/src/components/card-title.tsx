import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({
  children,
  className,
  ...props
}: CardTitleProps) {
  return (
    <h2 className={cn("fui-card__title", className)} {...props}>
      {children}
    </h2>
  );
}
