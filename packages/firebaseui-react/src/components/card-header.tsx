import { HTMLAttributes } from "react";
import { CardTitle } from "./card-title";
import { CardSubtitle } from "./card-subtitle";
import { cn } from "~/utils/cn";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export function CardHeader({
  title,
  subtitle,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("fui-card__header", className)} {...props}>
      <CardTitle text={title} />
      <CardSubtitle text={subtitle} />
    </div>
  );
}
