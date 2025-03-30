"use client";

import { useUser } from "@/lib/firebase/hooks";
import { GoogleSignInButton, SignInAuthScreen } from "@firebase-ui/react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Screen() {
  const router = useRouter();
  const user = useUser();

  // If the user signs in, redirect to the home page from the client.
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <SignInAuthScreen
      onForgotPasswordClick={() => router.push("/forgot-password")}
      onRegisterClick={() => router.push("/register")}
    >
      <GoogleSignInButton />
      <div>
        <Link href="/sign-in/phone">Sign in with phone number</Link>
      </div>
      <div>
        <Link href="/sign-in/email">Sign in with email link</Link>
      </div>
    </SignInAuthScreen>
  );
}
