import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
} from "../../components/card";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

export interface OAuthAuthScreenProps {
  children: React.ReactNode | React.ReactNode[];
}

export function OAuthScreen({ children }: OAuthAuthScreenProps) {
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
        <TermsAndPrivacy />
      </Card>
    </div>
  );
}
