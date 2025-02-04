import { RegisterForm } from "./register-form";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

export function RegisterScreen({
  onBackToSignInClick,
}: {
  onBackToSignInClick: () => void;
}) {
  const { language } = useConfig();
  const translations = useTranslations();

  return (
    <div className="fui-screen">
      <div className="fui-card">
        <div className="fui-card__container">
          <div className="fui-card__header">
            <h2 className="fui-card__title">
              {getTranslation(
                "labels",
                "createAccount",
                translations,
                language
              )}
            </h2>
            <p className="fui-card__subtitle">
              {getTranslation(
                "prompts",
                "enterDetailsToCreate",
                translations,
                language
              )}
            </p>
          </div>
          <RegisterForm onBackToSignInClick={onBackToSignInClick} />
        </div>
      </div>
    </div>
  );
}
