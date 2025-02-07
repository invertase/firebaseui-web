export function Divider({ text }: { text?: string }) {
  if (!text) {
    return (
      <div className="fui-divider">
        <div className="fui-divider__line" />
      </div>
    );
  }

  return (
    <div className="fui-divider">
      <div className="fui-divider__line" />
      <div className="fui-divider__text">{text}</div>
      <div className="fui-divider__line" />
    </div>
  );
}
