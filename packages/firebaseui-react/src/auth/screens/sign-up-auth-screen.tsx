import { Card } from "../../components/card";
import { CardHeader } from "../../components/card-header";
import { CardTitle } from "../../components/card-title";
import { CardSubtitle } from "../../components/card-subtitle";
import { RegisterForm } from "../forms/register-form";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { Divider } from "~/components/divider";

export interface SignUpAuthScreenProps {
  onBackToSignInClick?: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

export function SignUpAuthScreen({
  onBackToSignInClick,
  children,
}: SignUpAuthScreenProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const titleText = getTranslation("labels", "register", translations, language);
  const subtitleText = getTranslation(
    "prompts",
    "enterDetailsToCreate",
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
        <RegisterForm onBackToSignInClick={onBackToSignInClick} />
        {children ? (
          <>
            <Divider />
            <div className="space-y-4">{children}</div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
