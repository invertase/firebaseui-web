"use client";

import {
  FirebaseUIError,
  fuiSignInWithOAuth,
  getTranslation,
} from "@firebase-ui/core";
import type { AuthProvider } from "firebase/auth";
import type { PropsWithChildren } from "react";
import { Button } from "~/components/button";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import { useState } from "react";

export type OAuthButtonProps = PropsWithChildren<{
  provider: AuthProvider;
}>;

export function OAuthButton({ provider, children }: OAuthButtonProps) {
  const auth = useAuth();
  const translations = useTranslations();
  const {
    language,
    enableAutoUpgradeAnonymous,
    enableHandleExistingCredential,
  } = useConfig();
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async () => {
    setError(null);
    try {
      await fuiSignInWithOAuth(auth, provider, {
        translations,
        language,
        enableAutoUpgradeAnonymous,
        enableHandleExistingCredential,
      });
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        setError(error.message);
        return;
      }
      console.error(error);
      setError(
        getTranslation("errors", "unknownError", translations, language)
      );
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={handleOAuthSignIn}
        className="fui-provider__button"
      >
        {children}
      </Button>
      {error && <div className="fui-form__error">{error}</div>}
    </div>
  );
}
