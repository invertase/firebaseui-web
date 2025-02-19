"use client";

import { PhoneAuthScreen, GoogleSignInButton } from "@firebase-ui/react";

export default function PhoneAuthScreenWithOAuthPage() {
  return (
    <PhoneAuthScreen>
      <GoogleSignInButton />
    </PhoneAuthScreen>
  );
}
