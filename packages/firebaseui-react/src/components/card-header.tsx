import { CardTitle } from "./card-title";
import { CardSubtitle } from "./card-subtitle";
import { cn } from "~/utils/cn";

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function CardHeader({ title, subtitle, className }: CardHeaderProps) {
  return (
    <div className={cn("fui-card__header", className)}>
      <CardTitle text={title} />
      <CardSubtitle text={subtitle} />
    </div>
  );
}
