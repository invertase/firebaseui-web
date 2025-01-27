import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SignInForm } from "./auth/sign-in-form";
import { ConfigProvider } from "./context";
import { initializeUI } from "@firebase-ui/core";
import "./styles.css";

const config = initializeUI({
  translations: {
    en: {
      errors: {
        invalidEmail: "Invalid email address",
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider config={config}>
      <SignInForm />
    </ConfigProvider>
  </StrictMode>
);

// SignInScreen = full page
// SignIn  = Container form / card
// SignInForm = just the form
