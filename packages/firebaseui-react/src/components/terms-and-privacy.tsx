import { getTranslation } from "@firebase-ui/translations";
import { Fragment } from "react";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";

export function TermsAndPrivacy() {
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

  if (!ui.tosUrl && !ui.privacyPolicyUrl) {
    return null;
  }

  const termsText = getTranslation(
    "labels",
    "termsOfService",
    translations,
    defaultLocale
  );
  const privacyText = getTranslation(
    "labels",
    "privacyPolicy",
    translations,
    defaultLocale
  );
  const termsAndPrivacyText = getTranslation(
    "messages",
    "termsAndPrivacy",
    translations,
    defaultLocale
  );

  const parts = termsAndPrivacyText.split(/(\{tos\}|\{privacy\})/);

  return (
    <div className="text-text-muted text-xs text-start">
      {parts.map((part: string, index: number) => {
        if (part === "{tos}" && ui.tosUrl) {
          return (
            <a
              key={index}
              href={ui.tosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:underline text-xs"
            >
              {termsText}
            </a>
          );
        }
        if (part === "{privacy}" && ui.privacyPolicyUrl) {
          return (
            <a
              key={index}
              href={ui.privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:underline text-xs"
            >
              {privacyText}
            </a>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </div>
  );
}
