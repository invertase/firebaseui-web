import { CardTitle } from "./card-title";
import { CardSubtitle } from "./card-subtitle";

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function CardHeader({ title, subtitle, className }: CardHeaderProps) {
  return (
    <div className={`fui-card__header ${className || ""}`}>
      <CardTitle text={title} />
      <CardSubtitle text={subtitle} />
    </div>
  );
}
