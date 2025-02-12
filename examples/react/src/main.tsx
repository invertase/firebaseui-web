import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
  GoogleSignInButton,
  SignInScreen,
  RegisterForm,
  PhoneForm,
  EmailLinkForm,
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
            <CustomSignInScreen>
              {" "}
              {/* <Screen>? */}
              <Card>
                <CardHeader title="Sign in to your account" />
                <EmailPasswordForm />
                <Divider />
                <GoogleSignInButton />
              </Card>
            </CustomSignInScreen>
          }
        />
        <Route path="/sign-in-screen" element={<SignInScreen />} />
        <Route path="/forgot-password-form" element={<ForgotPasswordForm />} />
        <Route path="/email-password-form" element={<EmailPasswordForm />} />
        <Route path="/google-sign-in-button" element={<GoogleSignInButton />} />
        <Route path="/register-form" element={<RegisterForm />} />
        <Route path="/phone-form" element={<PhoneForm />} />
        <Route path="/email-link-form" element={<EmailLinkForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

export function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Firebase UI Demo</h1>
      <nav className="space-y-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <li>
            <Link
              to="/sign-in-screen"
              className="text-blue-500 hover:underline"
            >
              Sign In Screen
            </Link>
          </li>
          <li>
            <Link
              to="/custom-sign-in-screen"
              className="text-blue-500 hover:underline"
            >
              Custom Sign In Screen
            </Link>
          </li>
          <li>
            <Link
              to="/email-password-form"
              className="text-blue-500 hover:underline"
            >
              Email Password Form
            </Link>
          </li>
          <li>
            <Link to="/register-form" className="text-blue-500 hover:underline">
              Register Form
            </Link>
          </li>
          <li>
            <Link to="/phone-form" className="text-blue-500 hover:underline">
              Phone Form
            </Link>
          </li>
          <li>
            <Link
              to="/email-link-form"
              className="text-blue-500 hover:underline"
            >
              Email Link Form
            </Link>
          </li>
          <li>
            <Link
              to="/forgot-password-form"
              className="text-blue-500 hover:underline"
            >
              Forgot Password Form
            </Link>
          </li>
          <li>
            <Link
              to="/google-sign-in-button"
              className="text-blue-500 hover:underline"
            >
              Google Sign In Button
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
