import { Card, CardHeader, CardTitle, CardSubtitle } from "../../components/card";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { Divider } from "~/components/divider";
import { PhoneForm } from "../forms/phone-form";

export interface PhoneAuthScreenProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function PhoneAuthScreen({ children }: PhoneAuthScreenProps) {
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
        <PhoneForm />
        {children ? (
          <>
            {/* TODO: Add translation */}
            <Divider>or</Divider>
            <div className="space-y-4">{children}</div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
