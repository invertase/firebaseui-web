"use client";

import { EmailLinkAuthScreen, GoogleSignInButton } from "@firebase-ui/react";

export default function EmailLinkAuthScreenWithOAuthPage() {
  return (
    <EmailLinkAuthScreen>
      <GoogleSignInButton />
    </EmailLinkAuthScreen>
  );
}
