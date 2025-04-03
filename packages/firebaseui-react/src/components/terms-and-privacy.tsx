import { getTranslation } from "@firebase-ui/core";
import { Fragment } from "react";
import { useUI } from "~/hooks";

type Url =
  | string
  | URL
  | undefined
  | (() => string | URL | void)
  | Promise<string | URL | void>
  | (() => Promise<string | URL | void>);

export interface TermsAndPrivacyProps {
  tosUrl: Url;
  privacyPolicyUrl: Url;
}

export function TermsAndPrivacy(props: TermsAndPrivacyProps) {
  const ui = useUI();
  const { tosUrl: tosUrlProp, privacyPolicyUrl: privacyPolicyUrlProp } = props;

  if (!tosUrlProp && !privacyPolicyUrlProp) {
    return null;
  }

  async function handleUrl(urlOrFunction: Url) {
    let url: string | URL | void;

    if (typeof urlOrFunction === "function") {
      const urlOrPromise = urlOrFunction();
      if (typeof urlOrPromise === "string" || urlOrPromise instanceof URL) {
        url = urlOrPromise;
      } else {
        url = await urlOrPromise;
      }
    } else if (urlOrFunction instanceof Promise) {
      url = await urlOrFunction;
    } else {
      url = urlOrFunction;
    }

    if (url) {
      window.open(url.toString(), "_blank");
    }
  }

  const termsText = getTranslation(ui, "labels", "termsOfService");
  const privacyText = getTranslation(ui, "labels", "privacyPolicy");
  const termsAndPrivacyText = getTranslation(ui, "messages", "termsAndPrivacy");

  const parts = termsAndPrivacyText.split(/(\{tos\}|\{privacy\})/);

  return (
    <div className="text-text-muted text-xs text-start">
      {parts.map((part: string, index: number) => {
        if (part === "{tos}" && props.tosUrl) {
          return (
            <a
              key={index}
              onClick={() => handleUrl(props.tosUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:underline text-xs"
            >
              {termsText}
            </a>
          );
        }
        if (part === "{privacy}" && props.privacyPolicyUrl) {
          return (
            <a
              key={index}
              onClick={() => handleUrl(props.privacyPolicyUrl)}
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
