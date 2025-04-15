import { FirebaseUIConfiguration, type FirebaseUI } from "@firebase-ui/core";
import { useStore } from "@nanostores/react";
import { type PolicyProps, PolicyProvider } from "~/components/policies";
import { createContext } from "react";

export const FirebaseUIContext = createContext<FirebaseUIConfiguration>(
  {} as FirebaseUIConfiguration
);

export function FirebaseUIProvider({
  children,
  ui,
  policies,
}: {
  children: React.ReactNode;
  ui: FirebaseUI;
  policies?: PolicyProps;
}) {
  const value = useStore(ui);
  return (
    <FirebaseUIContext.Provider value={value}>
      <PolicyProvider policies={policies}>
        {children}
      </PolicyProvider>
    </FirebaseUIContext.Provider>
  );
}
