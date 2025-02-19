'use client';

import { PasswordResetScreen } from "@firebase-ui/react";
import { useRouter } from "next/navigation";

export default function Screen() {
  const router = useRouter();

  return <PasswordResetScreen onBackToSignInClick={() => router.push("/sign-in")} />;
}
