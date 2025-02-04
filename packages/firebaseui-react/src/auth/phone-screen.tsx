import { PhoneForm } from "./phone-form";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

export function PhoneScreen() {
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
                "signInWithPhone",
                translations,
                language
              )}
            </h2>
            <p className="fui-card__subtitle">
              {getTranslation(
                "prompts",
                "enterPhoneNumber",
                translations,
                language
              )}
            </p>
          </div>
          <PhoneForm />
        </div>
      </div>
    </div>
  );
}
