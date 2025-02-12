import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeUI } from "@firebase-ui/core";
import { useAuth } from "~/hooks";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { EmailPasswordForm } from "./auth/email-password-form";
import { ForgotPasswordForm } from "./auth/forgot-password-form";
import { RegisterForm } from "./auth/register-form";
import { PhoneForm } from "./auth/phone-form";
import { GoogleSignInButton } from "./auth/google-sign-in-button";
import { EmailLinkForm } from "./auth/email-link-form";
import { Button } from "./components/button";
import { Divider } from "./components/divider";
import { CardHeader } from "./components/card-header";
import { Card } from "./components/card";
import { CustomSignInScreen } from "./auth/custom-sign-in-screen";
import { CardTitle } from "./components/card-title";
import { CardSubtitle } from "./components/card-subtitle";

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

interface AnonymousUserWrapperProps {
  children: React.ReactNode;
  user: ReturnType<typeof useAuth>["currentUser"];
}

function AnonymousUserWrapper({ children, user }: AnonymousUserWrapperProps) {
  if (!user?.isAnonymous) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-lg font-medium">You are signed in anonymously</div>
      {children}
    </div>
  );
}

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const auth = useAuth();
  const { path, navigate } = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      if (user && !user.isAnonymous) {
        navigate("/");
      } else if (!user && path === "/") {
        navigate("/signin");
      }
    });
  }, [auth, path, navigate]);

  console.log("User is anonymous", auth.currentUser?.isAnonymous);
  if (isSignedIn && !auth.currentUser?.isAnonymous) {
    if (path !== "/") {
      navigate("/");
      return null;
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

  const getFormContent = () => {
    switch (path) {
      case "/signin":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sign in to your account</CardTitle>
              <CardSubtitle>
                Welcome back! Please enter your details.
              </CardSubtitle>
            </CardHeader>
            <EmailPasswordForm
              onForgotPasswordClick={() => navigate("/forgot-password")}
              onRegisterClick={() => navigate("/register")}
            />
            <Divider text="or" />
            <GoogleSignInButton />
          </Card>
        );

      case "/forgot-password":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reset your password</CardTitle>
              <CardSubtitle>
                Enter your email to receive reset instructions
              </CardSubtitle>
            </CardHeader>
            <ForgotPasswordForm />
          </Card>
        );

      case "/register":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardSubtitle>Sign up to get started</CardSubtitle>
            </CardHeader>
            <RegisterForm onBackToSignInClick={() => navigate("/signin")} />
          </Card>
        );

      case "/phone":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Phone verification</CardTitle>
              <CardSubtitle>Enter your phone number to continue</CardSubtitle>
            </CardHeader>
            <PhoneForm />
          </Card>
        );

      case "/email-link":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Email link sign in</CardTitle>
              <CardSubtitle>
                Enter your email to receive a sign in link
              </CardSubtitle>
            </CardHeader>
            <EmailLinkForm />
          </Card>
        );

      default:
        return (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <div className="text-2xl font-bold">404 - Page Not Found</div>
            <Button variant="secondary" onClick={() => navigate("/signin")}>
              Back to Sign In
            </Button>
          </div>
        );
    }
  };

  return (
    <AnonymousUserWrapper user={auth.currentUser}>
      <CustomSignInScreen>{getFormContent()}</CustomSignInScreen>
    </AnonymousUserWrapper>
  );
}

createRoot(document.getElementById("root")!).render(
  // @ts-ignore
  <StrictMode>
    <ConfigProvider config={config}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
