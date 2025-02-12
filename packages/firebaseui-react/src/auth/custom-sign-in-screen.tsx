import { useConfig, useTranslations } from "~/hooks";

export function CustomSignInScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fui-screen">
      <div className="fui-card">
        <div className="fui-card__container">{children}</div>
      </div>
    </div>
  );
}
