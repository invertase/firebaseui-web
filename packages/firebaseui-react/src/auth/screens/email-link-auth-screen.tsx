import { getTranslation } from "@firebase-ui/core";
import { Divider } from "~/components/divider";
import { useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { EmailLinkForm } from "../forms/email-link-form";

export interface EmailLinkAuthScreenProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function EmailLinkAuthScreen({ children }: EmailLinkAuthScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

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
            <Divider>{getTranslation(ui, "messages", "dividerOr")}</Divider>
            <div className="space-y-4">{children}</div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
