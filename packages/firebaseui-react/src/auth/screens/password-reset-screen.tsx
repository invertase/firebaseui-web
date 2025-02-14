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

  const titleText = getTranslation(
    "labels",
    "resetPassword",
    translations,
    language
  );
  const subtitleText = getTranslation(
    "prompts",
    "enterEmailToReset",
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
