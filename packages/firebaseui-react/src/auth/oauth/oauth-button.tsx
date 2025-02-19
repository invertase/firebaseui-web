"use client";

import { FirebaseUIError, fuiSignInWithOAuth } from "@firebase-ui/core";
import type { AuthProvider } from "firebase/auth";
import type { PropsWithChildren } from "react";
import { Button } from "~/components/button";
import { useAuth, useConfig, useTranslations } from "~/hooks";

export type OAuthButtonProps = PropsWithChildren<{
  provider: AuthProvider;
}>;

export function OAuthButton({ provider, children }: OAuthButtonProps) {
  const auth = useAuth();
  const translations = useTranslations();
  const { language, enableAutoUpgradeAnonymous } = useConfig();

  const handleOAuthSignIn = async () => {
    try {
      await fuiSignInWithOAuth(auth, provider, {
        translations,
        language,
        enableAutoUpgradeAnonymous,
      });
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        // TODO: What happens here?
      }
    }
  };

  return (
    <Button
      type="button"
      onClick={handleOAuthSignIn}
      className="fui-provider__button"
    >
      {children}
    </Button>
  );
}
