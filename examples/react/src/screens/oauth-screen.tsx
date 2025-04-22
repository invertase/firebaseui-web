"use client";

import { GoogleSignInButton, OAuthScreen } from "@firebase-ui/react";

export default function OAuthScreenPage() {
  return (
    <OAuthScreen>
      <GoogleSignInButton />
    </OAuthScreen>
  );
}
