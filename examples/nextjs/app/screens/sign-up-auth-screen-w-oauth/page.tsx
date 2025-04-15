"use client";

import { GoogleSignInButton, SignUpAuthScreen } from "@firebase-ui/react";

export default function SignUpAuthScreenWithOAuthPage() {
  return (
    <SignUpAuthScreen>
      <GoogleSignInButton />
    </SignUpAuthScreen>
  );
}
