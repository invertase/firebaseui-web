import { Card } from "../../components/card";
import { CardHeader } from "../../components/card-header";
import { CardTitle } from "../../components/card-title";
import { CardSubtitle } from "../../components/card-subtitle";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

export interface OAuthAuthScreenProps {
  children: React.ReactNode | React.ReactNode[];
}

export function OAuthScreen({
  children,
}: OAuthAuthScreenProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  // TODO: Translations for oauth providers
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
        {children}
      </Card>
    </div>
  );
}
