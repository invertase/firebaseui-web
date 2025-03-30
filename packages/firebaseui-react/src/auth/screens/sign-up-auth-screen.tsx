import { getTranslation } from "@firebase-ui/translations";
import { Divider } from "~/components/divider";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { RegisterForm } from "../forms/register-form";

export interface SignUpAuthScreenProps {
  onBackToSignInClick?: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

export function SignUpAuthScreen({
  onBackToSignInClick,
  children,
}: SignUpAuthScreenProps) {
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

  const titleText = getTranslation(
    "labels",
    "register",
    translations,
    defaultLocale
  );
  const subtitleText = getTranslation(
    "prompts",
    "enterDetailsToCreate",
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
        <RegisterForm onBackToSignInClick={onBackToSignInClick} />
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
