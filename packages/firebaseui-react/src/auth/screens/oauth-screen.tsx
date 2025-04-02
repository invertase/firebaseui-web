import { getTranslation } from "@firebase-ui/core";
import { useUI } from "~/hooks";
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

  // TODO: Translations for oauth providers
  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

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
