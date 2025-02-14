"use client";

import { SignUpAuthScreen, GoogleSignInButton } from "@firebase-ui/react";

export default function SignUpAuthScreenWithOAuthPage() {
  return (
    <SignUpAuthScreen>
      <GoogleSignInButton />
    </SignUpAuthScreen>
  );
}
