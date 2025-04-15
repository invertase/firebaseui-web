import { getTranslation } from "@firebase-ui/core";
import { useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { PropsWithChildren } from "react";
import { Policies } from "~/components/policies";

export type OAuthScreenProps = PropsWithChildren;

export function OAuthScreen({ children }: OAuthScreenProps) {
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
        <Policies />
      </Card>
    </div>
  );
}
