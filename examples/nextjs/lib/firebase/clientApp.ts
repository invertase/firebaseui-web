"use client";

import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./config";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { autoAnonymousLogin, initializeUI } from "@firebase-ui/core";
import { customLanguage, english } from "@firebase-ui/translations";

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(firebaseApp);

export const ui = initializeUI({
  app: firebaseApp,
  tosUrl: "https://www.google.com",
  privacyPolicyUrl: "https://www.google.com",
  behaviors: [autoAnonymousLogin()],
  translations: [
    customLanguage(english.locale, {
      labels: {
        signIn: "Sign In",
      },
      prompts: {
        signInToAccount: "Sign in to your account",
      },
      errors: {
        invalidEmail: "Please enter a valid email address",
      },
    }),
  ],
});

connectAuthEmulator(auth, "http://localhost:9099");
