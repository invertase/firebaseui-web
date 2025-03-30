import { type FirebaseUI } from "@firebase-ui/core";
import { useStore } from "@nanostores/react";
import { FirebaseUIContext } from "./ui-context";

export function FirebaseUIProvider({
  children,
  ui,
}: {
  children: React.ReactNode;
  ui: FirebaseUI;
}) {
  const value = useStore(ui);
  return (
    <FirebaseUIContext.Provider value={value}>
      {children}
    </FirebaseUIContext.Provider>
  );
}
