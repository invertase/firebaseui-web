import { PropsWithChildren } from "react";
import { Divider } from "~/components/divider";
import { useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { RegisterForm } from "../forms/register-form";
import { getTranslation } from "@firebase-ui/core";

export type SignUpAuthScreenProps = PropsWithChildren<{
  onBackToSignInClick?: () => void;
}>;

export function SignUpAuthScreen({
  onBackToSignInClick,
  children,
}: SignUpAuthScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "register");
  const subtitleText = getTranslation(ui, "prompts", "enterDetailsToCreate");

  return (
    <div className="fui-screen">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardSubtitle>{subtitleText}</CardSubtitle>
        </CardHeader>
        <RegisterForm onBackToSignInClick={onBackToSignInClick} />
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
