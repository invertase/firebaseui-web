import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "~/utils/cn";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("fui-card", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("fui-card__header", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("fui-card__title", className)} {...props}>
      {children}
    </h2>
  );
}

export function CardSubtitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("fui-card__subtitle", className)} {...props}>
      {children}
    </p>
  );
}
