"use client";

import { OAuthScreen, GoogleSignInButton } from "@firebase-ui/react";

export default function OAuthScreenPage() {
  return (
    <OAuthScreen>
      <GoogleSignInButton />
    </OAuthScreen>
  );
}
