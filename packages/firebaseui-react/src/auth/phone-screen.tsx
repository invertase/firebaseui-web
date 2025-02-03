import { PhoneForm } from "./phone-form";
import { useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

export function PhoneScreen() {
  const translations = useTranslations();

  return (
    <div className="fui-screen">
      <div className="fui-card">
        <div className="fui-card__container">
          <div className="fui-card__header">
            <h2 className="fui-card__title">
              {getTranslation("labels", "signInWithPhone", translations)}
            </h2>
            <p className="fui-card__subtitle">
              {getTranslation("prompts", "enterPhoneNumber", translations)}
            </p>
          </div>
          <PhoneForm />
        </div>
      </div>
    </div>
  );
}
