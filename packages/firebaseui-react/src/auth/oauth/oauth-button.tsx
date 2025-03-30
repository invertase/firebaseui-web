"use client";

import { FirebaseUIError, signInWithOAuth } from "@firebase-ui/core";
import { getTranslation } from "@firebase-ui/translations";
import type { AuthProvider } from "firebase/auth";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Button } from "~/components/button";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";

export type OAuthButtonProps = PropsWithChildren<{
  provider: AuthProvider;
}>;

export function OAuthButton({ provider, children }: OAuthButtonProps) {
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async () => {
    setError(null);
    try {
      await signInWithOAuth(ui, provider);
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        setError(error.message);
        return;
      }
      console.error(error);
      setError(
        getTranslation("errors", "unknownError", translations, defaultLocale)
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
