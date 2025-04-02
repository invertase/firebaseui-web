import { getTranslation } from "@firebase-ui/core";
import { Fragment } from "react";
import { useUI } from "~/hooks";

export function TermsAndPrivacy() {
  const ui = useUI();

  if (!ui.tosUrl && !ui.privacyPolicyUrl) {
    return null;
  }

  const termsText = getTranslation(ui, "labels", "termsOfService");
  const privacyText = getTranslation(ui, "labels", "privacyPolicy");
  const termsAndPrivacyText = getTranslation(ui, "messages", "termsAndPrivacy");

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
