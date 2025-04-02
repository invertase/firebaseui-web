import { getTranslation } from "@firebase-ui/core";
import { useUI } from "~/hooks";
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

  const titleText = getTranslation(ui, "labels", "resetPassword");
  const subtitleText = getTranslation(ui, "prompts", "enterEmailToReset");

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
