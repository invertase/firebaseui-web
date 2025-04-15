"use client";

import { GoogleSignInButton, PhoneAuthScreen } from "@firebase-ui/react";

export default function PhoneAuthScreenWithOAuthPage() {
  return (
    <PhoneAuthScreen>
      <GoogleSignInButton />
    </PhoneAuthScreen>
  );
}
