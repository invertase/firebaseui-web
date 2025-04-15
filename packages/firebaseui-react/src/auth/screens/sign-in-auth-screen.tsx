import type { PropsWithChildren } from "react";
import { getTranslation } from "@firebase-ui/core";
import { Divider } from "~/components/divider";
import { useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { EmailPasswordForm } from "../forms/email-password-form";

export type SignInAuthScreenProps = PropsWithChildren<{
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
}>;

export function SignInAuthScreen({
  onForgotPasswordClick,
  onRegisterClick,
  children,
}: SignInAuthScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

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
            <Divider>{getTranslation(ui, "messages", "dividerOr")}</Divider>
            <div className="space-y-4">{children}</div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
