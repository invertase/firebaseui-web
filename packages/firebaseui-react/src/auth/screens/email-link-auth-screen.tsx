import { Card } from "../../components/card";
import { CardHeader } from "../../components/card-header";
import { CardTitle } from "../../components/card-title";
import { CardSubtitle } from "../../components/card-subtitle";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { Divider } from "~/components/divider";
import { EmailLinkForm } from "../forms/email-link-form";

export interface EmailLinkAuthScreenProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function EmailLinkAuthScreen({ children }: EmailLinkAuthScreenProps) {
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
        <EmailLinkForm />
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
