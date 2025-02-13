import { Card, CardTitle, CardSubtitle, CardHeader } from "../../components/card";
import { EmailPasswordForm } from "../forms/email-password-form";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { Divider } from "~/components/divider";

export interface SignInAuthScreenProps {
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

export function SignInAuthScreen({
  onForgotPasswordClick,
  onRegisterClick,
  children,
}: SignInAuthScreenProps) {
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
    <div className="fui-screen">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardSubtitle>{subtitleText}</CardSubtitle>
        </CardHeader>
        <EmailPasswordForm
          onForgotPasswordClick={onForgotPasswordClick}
          onRegisterClick={onRegisterClick}
        />
        {children ? (
          <>
            <Divider>or</Divider>
            <div className="space-y-4">{children}</div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
