"use client";

import { ui } from "@/lib/firebase/clientApp";
import { ConfigProvider } from "@firebase-ui/react";

export function FirebaseUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      ui={ui}
      policies={{
        termsOfServiceUrl: "https://www.google.com",
        privacyPolicyUrl: "https://www.google.com",
      }}
    >
      {children}
    </ConfigProvider>
  );
}
