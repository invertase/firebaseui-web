"use client";

import { SignInAuthScreen } from "@firebase-ui/react";
import { useRouter } from "next/navigation";

export default function SignInAuthScreenWithHandlersPage() {
  const router = useRouter();

  return (
    <SignInAuthScreen
      onForgotPasswordClick={() => router.push("/password-reset-screen")}
      onRegisterClick={() => router.push("/sign-up-auth-screen")}
    />
  );
}
