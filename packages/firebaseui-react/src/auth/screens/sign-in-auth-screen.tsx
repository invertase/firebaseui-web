import { getTranslation } from "@firebase-ui/translations";
import { Divider } from "~/components/divider";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { EmailPasswordForm } from "../forms/email-password-form";

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
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

  const titleText = getTranslation(
    "labels",
    "signIn",
    translations,
    defaultLocale
  );
  const subtitleText = getTranslation(
    "prompts",
    "signInToAccount",
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
        <EmailPasswordForm
          onForgotPasswordClick={onForgotPasswordClick}
          onRegisterClick={onRegisterClick}
        />
        {children ? (
          <>
            <Divider>
              {getTranslation(
                "messages",
                "dividerOr",
                translations,
                defaultLocale
              )}
            </Divider>
            <div className="space-y-4">{children}</div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
