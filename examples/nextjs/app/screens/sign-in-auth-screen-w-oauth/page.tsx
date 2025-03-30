"use client";

import { GoogleSignInButton, SignInAuthScreen } from "@firebase-ui/react";
import { useRouter } from "next/navigation";

export default function SignInAuthScreenWithOAuthPage() {
  const router = useRouter();

  return (
    <SignInAuthScreen
      onForgotPasswordClick={() => router.push("/password-reset-screen")}
      onRegisterClick={() => router.push("/sign-up-auth-screen")}
    >
      <GoogleSignInButton />
    </SignInAuthScreen>
  );
}
