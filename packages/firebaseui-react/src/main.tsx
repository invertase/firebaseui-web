import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeUI } from "@firebase-ui/core";
import { CustomSignInScreen } from "./auth/custom-sign-in-screen";
import { useAuth } from "~/hooks";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { EmailPasswordForm } from "./auth/email-password-form";
import { ForgotPasswordForm } from "./auth/forgot-password-form";
import { RegisterForm } from "./auth/register-form";
import { PhoneForm } from "./auth/phone-form";
import { GoogleForm } from "./auth/google-form";
import { EmailLinkForm } from "./auth/email-link-form";
import { Button } from "./components/button";
import { Divider } from "./components/divider";

import "./styles.css";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { ConfigProvider } from "./context/config-provider";

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

const app = initializeApp(firebaseConfig);
const config = initializeUI({
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

connectAuthEmulator(getAuth(config.get().app), "http://localhost:9099");

function useRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  return { path, navigate };
}

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const auth = useAuth();
  const { path, navigate } = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      if (
        user &&
        !user.isAnonymous &&
        (path === "/signin" ||
          path === "/forgot-password" ||
          path === "/register" ||
          path === "/phone" ||
          path === "/google" ||
          path === "/email-link")
      ) {
        navigate("/");
      } else if (!user && path === "/") {
        navigate("/signin");
      }
    });
  }, [auth, path, navigate]);

  if (path === "/signin") {
    return (
      <CustomSignInScreen>
        <EmailPasswordForm
          onForgotPasswordClick={() => navigate("/forgot-password")}
          onRegisterClick={() => navigate("/register")}
        />
        <Divider text="or" />
        <GoogleForm />
      </CustomSignInScreen>
    );
  }

  if (path === "/forgot-password") {
    return (
      <CustomSignInScreen>
        <ForgotPasswordForm />
      </CustomSignInScreen>
    );
  }

  if (path === "/register") {
    return (
      <CustomSignInScreen>
        <RegisterForm onBackToSignInClick={() => navigate("/signin")} />
      </CustomSignInScreen>
    );
  }

  if (path === "/phone") {
    return (
      <CustomSignInScreen>
        <PhoneForm />
      </CustomSignInScreen>
    );
  }

  if (path === "/email-link") {
    return (
      <CustomSignInScreen>
        <EmailLinkForm />
      </CustomSignInScreen>
    );
  }

  if (isSignedIn) {
    const user = auth.currentUser;
    if (user?.isAnonymous) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="text-lg font-medium">
            You are signed in anonymously
          </div>
          <CustomSignInScreen>
            <EmailPasswordForm
              onForgotPasswordClick={() => navigate("/forgot-password")}
              onRegisterClick={() => navigate("/register")}
            />
            <GoogleForm />
          </CustomSignInScreen>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-lg font-medium">Signed in successfully</div>
        <Button
          variant="secondary"
          onClick={() => {
            signOut(auth);
            navigate("/signin");
          }}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider config={config}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
