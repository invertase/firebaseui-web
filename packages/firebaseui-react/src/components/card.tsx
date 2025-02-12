import { cn } from "~/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("fui-card", className)}>
      <div className="fui-card__container">{children}</div>
    </div>
  );
}
