import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type CardSubtitleProps = HTMLAttributes<HTMLParagraphElement>;

export function CardSubtitle({
  children,
  className,
  ...props
}: CardSubtitleProps) {
  return (
    <p className={cn("fui-card__subtitle", className)} {...props}>
      {children}
    </p>
  );
}
