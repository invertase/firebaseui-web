import type { FirebaseApp } from "firebase/app";
import { FirebaseUIProvider } from "./components/provider";
import { getAuth } from "firebase/auth";

import { LoginForm } from "./auth/login-form";
import type { FirebaseUIOptions } from "./context";

import './components/button';
import './components/input';

export { Button } from "./components/button";
export { FirebaseUIInput } from "./components/input";
export { LoginForm } from "./auth/login-form";

// Initialize the FirebaseUI provider with the Auth instance.
export function initializeUI(
  app: FirebaseApp,
  options?: Partial<FirebaseUIOptions>
) {
  if (typeof window === "undefined") {
    console.error("initializeUI should be called in the browser");
    return;
  }

  const provider = window.document.querySelector("fui-provider");

  if (!provider) {
    console.error("No FirebaseUI provider found");
    return;
  }

  provider.context = {
    auth: getAuth(app),
    locale: options?.locale ?? "en",
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "fui-provider": FirebaseUIProvider;
    "fui-login-form": LoginForm;
  }
}
