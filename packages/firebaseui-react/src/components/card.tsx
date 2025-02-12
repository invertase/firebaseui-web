interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`fui-card ${className || ""}`}>
      <div className="fui-card__container">{children}</div>
    </div>
  );
}
