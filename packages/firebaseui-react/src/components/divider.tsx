interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className }: DividerProps) {
  if (!text) {
    return (
      <div className={`fui-divider ${className || ""}`}>
        <div className="fui-divider__line" />
      </div>
    );
  }

  return (
    <div className={`fui-divider ${className || ""}`}>
      <div className="fui-divider__line" />
      <div className="fui-divider__text">{text}</div>
      <div className="fui-divider__line" />
    </div>
  );
}
