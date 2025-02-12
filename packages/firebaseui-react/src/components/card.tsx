interface CardProps {
  children: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="fui-card">
      <div className="fui-card__container">{children}</div>
    </div>
  );
}
