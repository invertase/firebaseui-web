"use client";

import {
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
  CustomSignInScreen,
  Divider,
  EmailPasswordForm,
  GoogleSignInButton,
} from "@firebase-ui/react";

const signInText = "Sign in";
const signInToAccountText = "Sign in to your account";

export default function CustomSignInScreenPage() {
  return (
    <CustomSignInScreen>
      <Card>
        <CardHeader>
          <CardTitle>{signInText}</CardTitle>
          <CardSubtitle>{signInToAccountText}</CardSubtitle>
        </CardHeader>
        <EmailPasswordForm />
        <Divider />
        <GoogleSignInButton />
      </Card>
    </CustomSignInScreen>
  );
}
