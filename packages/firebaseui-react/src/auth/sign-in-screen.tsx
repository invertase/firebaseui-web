import { Card } from "../components/card";
import { CardHeader } from "../components/card-header";
import { CardTitle } from "../components/card-title";
import { CardSubtitle } from "../components/card-subtitle";
import { CustomSignInScreen } from "./custom-sign-in-screen";
import { EmailPasswordForm } from "./email-password-form";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

interface SignInScreenProps {
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
}

export function SignInScreen({
  onForgotPasswordClick,
  onRegisterClick,
}: SignInScreenProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const titleText = getTranslation("labels", "signIn", translations, language);
  const subtitleText = getTranslation(
    "prompts",
    "signInToAccount",
    translations,
    language
  );

  return (
    <CustomSignInScreen>
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardSubtitle>{subtitleText}</CardSubtitle>
        </CardHeader>
        <EmailPasswordForm
          onForgotPasswordClick={onForgotPasswordClick}
          onRegisterClick={onRegisterClick}
        />
      </Card>
    </CustomSignInScreen>
  );
}
