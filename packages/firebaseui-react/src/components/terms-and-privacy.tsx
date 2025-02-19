import { getTranslation } from "@firebase-ui/core";
import { useConfig } from "../hooks";
import { Fragment } from "react";

export function TermsAndPrivacy() {
  const config = useConfig();

  if (!config.tosUrl && !config.privacyPolicyUrl) {
    return null;
  }

  const termsText = getTranslation(
    "labels",
    "termsOfService",
    config.translations,
    config.language
  );
  const privacyText = getTranslation(
    "labels",
    "privacyPolicy",
    config.translations,
    config.language
  );
  const termsAndPrivacyText = getTranslation(
    "messages",
    "termsAndPrivacy",
    config.translations,
    config.language
  );

  const parts = termsAndPrivacyText.split(/(\{tos\}|\{privacy\})/);

  return (
    <div className="text-text-muted text-xs text-start">
      {parts.map((part: string, index: number) => {
        if (part === "{tos}" && config.tosUrl) {
          return (
            <a
              key={index}
              href={config.tosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:underline text-xs"
            >
              {termsText}
            </a>
          );
        }
        if (part === "{privacy}" && config.privacyPolicyUrl) {
          return (
            <a
              key={index}
              href={config.privacyPolicyUrl}
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
