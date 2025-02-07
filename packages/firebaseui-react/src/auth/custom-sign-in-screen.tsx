import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

export function CustomSignInScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useConfig();
  const translations = useTranslations();

  return (
    <div className="fui-screen">
      <div className="fui-card">
        <div className="fui-card__container">
          <div className="fui-card__header">
            <h2 className="fui-card__title">
              {getTranslation("labels", "signIn", translations, language)}
            </h2>
            <p className="fui-card__subtitle">
              {getTranslation(
                "prompts",
                "signInToAccount",
                translations,
                language
              )}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
