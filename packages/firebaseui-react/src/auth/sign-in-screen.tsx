import { SignInForm } from "./sign-in-form";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

export function SignInScreen({
  onForgotPasswordClick,
  onRegisterClick,
}: {
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
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
          <SignInForm
            onForgotPasswordClick={onForgotPasswordClick}
            onRegisterClick={onRegisterClick}
          />
        </div>
      </div>
    </div>
  );
}
