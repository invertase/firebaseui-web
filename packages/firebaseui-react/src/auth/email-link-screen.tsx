import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { EmailLinkForm } from "./email-link-form";

export function EmailLinkScreen() {
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
                "signInWithEmailLink",
                translations,
                language
              )}
            </h2>
            <p className="fui-card__subtitle">
              {getTranslation(
                "prompts",
                "enterEmailForLink",
                translations,
                language
              )}
            </p>
          </div>
          <EmailLinkForm />
        </div>
      </div>
    </div>
  );
}
