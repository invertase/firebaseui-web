import { getTranslation } from "@firebase-ui/core";
import { createContext, useContext } from "react";
import { useUI } from "~/hooks";

type Url =
  | string
  | URL
  | (() => string | URL | void)
  | Promise<string | URL | void>
  | (() => Promise<string | URL | void>);

export interface PolicyProps {
  termsOfServiceUrl: Url;
  privacyPolicyUrl: Url;
}

const PolicyContext = createContext<PolicyProps | undefined>(
  undefined
);

export function PolicyProvider({ children, policies }: { children: React.ReactNode, policies?: PolicyProps }) {
  return <PolicyContext.Provider value={policies}>{children}</PolicyContext.Provider>;
}

export function Policies() {
  const ui = useUI();
  const policies = useContext(PolicyContext);

  if (!policies) {
    return null;
  }

  const { termsOfServiceUrl, privacyPolicyUrl } = policies;

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
        if (part === "{tos}") {
          return (
            <a
              key={index}
              onClick={() => handleUrl(termsOfServiceUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:underline font-semibold"
            >
              {termsText}
            </a>
          );
        }
        if (part === "{privacy}") {
          return (
            <a
              key={index}
              onClick={() => handleUrl(privacyPolicyUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:underline font-semibold"
            >
              {privacyText}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
