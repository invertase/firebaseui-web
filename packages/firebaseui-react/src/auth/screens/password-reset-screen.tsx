import { Card } from "../../components/card";
import { CardHeader } from "../../components/card-header";
import { CardTitle } from "../../components/card-title";
import { CardSubtitle } from "../../components/card-subtitle";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { ForgotPasswordForm } from "../forms/forgot-password-form";

export interface PasswordResetScreenProps {}

export function PasswordResetScreen(_: PasswordResetScreenProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  // TODO: Translations for password reset
  const titleText = getTranslation("labels", "signIn", translations, language);
  const subtitleText = getTranslation(
    "prompts",
    "signInToAccount",
    translations,
    language
  );

  // TODO: Should forgot password have a back button to sign in screen prop?

  return (
    <div className="fui-screen">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardSubtitle>{subtitleText}</CardSubtitle>
        </CardHeader>
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
