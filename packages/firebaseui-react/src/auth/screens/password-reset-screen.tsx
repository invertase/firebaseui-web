import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
} from "../../components/card";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { ForgotPasswordForm } from "../forms/forgot-password-form";

export interface PasswordResetScreenProps {
  onBackToSignInClick?: () => void;
}

export function PasswordResetScreen({
  onBackToSignInClick,
}: PasswordResetScreenProps) {
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
        <ForgotPasswordForm onBackToSignInClick={onBackToSignInClick} />
      </Card>
    </div>
  );
}
