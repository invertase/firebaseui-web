import { ForgotPasswordForm } from "./forgot-password-form";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

export function ForgotPasswordScreen() {
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
                "resetPassword",
                translations,
                language
              )}
            </h2>
            <p className="fui-card__subtitle">
              {getTranslation(
                "prompts",
                "enterEmailToReset",
                translations,
                language
              )}
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
