import { getTranslation } from "@firebase-ui/translations";
import { Divider } from "~/components/divider";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";
import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "../../components/card";
import { PhoneForm } from "../forms/phone-form";

export interface PhoneAuthScreenProps {
  children?: React.ReactNode | React.ReactNode[];
  resendDelay?: number;
}

export function PhoneAuthScreen({
  children,
  resendDelay,
}: PhoneAuthScreenProps) {
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

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
        <PhoneForm resendDelay={resendDelay} />
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
