import { getTranslation } from "@firebase-ui/translations";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

export interface OAuthAuthScreenProps {
  children: React.ReactNode | React.ReactNode[];
}

export function OAuthScreen({ children }: OAuthAuthScreenProps) {
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

  // TODO: Translations for oauth providers
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
        {children}
        <TermsAndPrivacy />
      </Card>
    </div>
  );
}
