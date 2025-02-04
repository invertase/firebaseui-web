import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { GoogleForm } from "./google-form";

export function GoogleScreen() {
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
                "signInWithGoogle",
                translations,
                language
              )}
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
          <GoogleForm />
        </div>
      </div>
    </div>
  );
}
