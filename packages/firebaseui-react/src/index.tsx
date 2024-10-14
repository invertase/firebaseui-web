import React, { PropsWithChildren } from "react";
import type { Auth } from "firebase/auth";
import { createComponent } from "@lit/react";

import {
  FirebaseUIButton,
  FirebaseUIInput,
  FirebaseUIProvider,
  FirebaseUILoginForm,
} from "firebaseui-lit/src";

export const Button = createComponent({
  tagName: "fui-button",
  elementClass: FirebaseUIButton,
  react: React,
});

export const Input = createComponent({
  tagName: "fui-input",
  elementClass: FirebaseUIInput,
  react: React,
});

export const LoginForm = createComponent({
  tagName: "fui-login-form",
  elementClass: FirebaseUILoginForm,
  react: React,
});

type ProviderProps = PropsWithChildren<{
  auth: Auth;
}>;

const ProviderBase = createComponent({
  tagName: "fui-provider",
  elementClass: FirebaseUIProvider,
  react: React,
});

export function Provider({ auth, ...props}: ProviderProps) {
  return <ProviderBase {...props} authInstance={auth} />
}
