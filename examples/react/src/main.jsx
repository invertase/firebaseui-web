import { BrowserRouter, RouterProvider, Routes, Route } from "react-router";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { Header } from "../lib/components/header";
import { FirebaseUIProvider } from "../lib/firebase/ui";

/** Sign In */
import SignInAuthScreenPage from "./screens/sign-in-auth-screen";
import SignInAuthScreenWithHandlersPage from "./screens/sign-in-auth-screen-w-handlers";
import SignInAuthScreenWithOAuthPage from "./screens/sign-in-auth-screen-w-oauth";

/** Email */
import EmailLinkAuthScreenPage from "./screens/email-link-auth-screen";
import EmailLinkAuthScreenWithOAuthPage from "./screens/email-link-auth-screen-w-oauth";

/** Phone Auth */
import PhoneAuthScreenPage from "./screens/phone-auth-screen";
import PhoneAuthScreenWithOAuthPage from "./screens/phone-auth-screen-w-oauth";

/** Sign up */
import SignUpAuthScreenPage from "./screens/sign-in-auth-screen-w-oauth";
import SignUpAuthScreenWithOAuthPage from "./screens/sign-in-auth-screen";

/** oAuth */
import OAuthScreenPage from "./screens/oauth-screen";

/** Password Reset */
import PasswordResetScreenPage from "./screens/password-reset-screen";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Header />
    <FirebaseUIProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/screens/sign-in-auth-screen"
          element={<SignInAuthScreenPage />}
        />
        <Route
          path="/screens/sign-in-auth-screen-w-handlers"
          element={<SignInAuthScreenWithHandlersPage />}
        />
        <Route
          path="/screens/sign-in-auth-screen-w-oauth"
          element={<SignInAuthScreenWithOAuthPage />}
        />
        <Route
          path="/screens/email-link-auth-screen"
          element={<EmailLinkAuthScreenPage />}
        />
        <Route
          path="/screens/email-link-auth-screen-w-oauth"
          element={<EmailLinkAuthScreenWithOAuthPage />}
        />
        <Route
          path="/screens/phone-auth-screen"
          element={<PhoneAuthScreenPage />}
        />
        <Route
          path="/screens/phone-auth-screen-w-oauth"
          element={<PhoneAuthScreenWithOAuthPage />}
        />
        <Route
          path="/screens/sign-up-auth-screen"
          element={<SignUpAuthScreenPage />}
        />
        <Route
          path="/screens/sign-up-auth-screen-w-oauth"
          element={<SignUpAuthScreenWithOAuthPage />}
        />
        <Route path="/screens/oauth-screen" element={<OAuthScreenPage />} />
        <Route
          path="/screens/password-reset-screen"
          element={<PasswordResetScreenPage />}
        />
      </Routes>
    </FirebaseUIProvider>
  </BrowserRouter>
);
