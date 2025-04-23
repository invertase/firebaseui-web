"use client";

import { GoogleSignInButton, SignInAuthScreen } from "@firebase-ui/react";
import { useNavigate } from "react-router";

export default function SignInAuthScreenWithOAuthPage() {
 let navigate = useNavigate();

  return (
    <SignInAuthScreen
      onForgotPasswordClick={() => navigate("/password-reset-screen")}
      onRegisterClick={() => navigate("/sign-up-auth-screen")}
    >
      <GoogleSignInButton />
    </SignInAuthScreen>
  );
}
