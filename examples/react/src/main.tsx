import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

import { initializeUI } from "@firebase-ui/core";
import {
  Card,
  CardHeader,
  CustomSignInScreen,
  Divider,
  EmailPasswordForm,
  ForgotPasswordForm,
  GoogleForm,
  SignInScreen,
} from "@firebase-ui/react";
import "./styles.css";

const firebaseConfig = {
  apiKey: "AIzaSyAotbJXqnZxg9aAsULFn8MLwp_twtMUl2k",
  authDomain: "ff-test-74aeb.firebaseapp.com",
  databaseURL:
    "https://ff-test-74aeb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ff-test-74aeb",
  storageBucket: "ff-test-74aeb.appspot.com",
  messagingSenderId: "950537677105",
  appId: "1:950537677105:web:da72ccc1718279f3cde810",
  measurementId: "G-B5Y2YD83TJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize FirebaseUI
const ui = initializeUI({
  app,
  enableAutoAnonymousLogin: true,
  enableAutoUpgradeAnonymous: true,
  translations: {
    en: {
      labels: {
        signIn: "Sign In",
      },
      prompts: {
        signInToAccount: "Sign in to your account",
      },
      errors: {
        invalidEmail: "Please enter a valid email address",
      },
    },
  },
});

// Connect FirebaseUI to Firebase Emulator
connectAuthEmulator(getAuth(ui.get().app), "http://localhost:9099");

// Render the app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/custom-sign-in-screen"
          element={
            <CustomSignInScreen> {/* <Screen>? */}
              <Card>
                <CardHeader title="Sign in to your account" />
                <EmailPasswordForm />
                <Divider />
                <GoogleForm />
              </Card>
            </CustomSignInScreen>
          }
        />
        <Route path="/sign-in-screen" element={<SignInScreen />} />
        <Route path="/forgot-password-form" element={<ForgotPasswordForm />} />
        <Route path="/email-password-form" element={<EmailPasswordForm />} />
        <Route path="/google-form" element={<GoogleForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

function App() {
  return <div>Hello</div>;
}
