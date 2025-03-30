import { getTranslation } from "@firebase-ui/translations";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { ForgotPasswordForm } from "../forms/forgot-password-form";

export interface PasswordResetScreenProps {
  onBackToSignInClick?: () => void;
}

export function PasswordResetScreen({
  onBackToSignInClick,
}: PasswordResetScreenProps) {
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

  const titleText = getTranslation(
    "labels",
    "resetPassword",
    translations,
    defaultLocale
  );
  const subtitleText = getTranslation(
    "prompts",
    "enterEmailToReset",
    translations,
    defaultLocale
  );

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
