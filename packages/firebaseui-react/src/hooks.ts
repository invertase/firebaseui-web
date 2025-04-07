import { useContext, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { FirebaseUIContext } from "./context";
import { FirebaseUIConfiguration } from "@firebase-ui/core";

/**
 * Get the UI configuration from the context.
 */
export function useUI() {
  return useContext(FirebaseUIContext);
}

/**
 * Get the auth instance from the UI configuration.
 * If no UI configuration is provided, use the auth instance from the context.
 */
export function useAuth(ui?: FirebaseUIConfiguration | undefined) {
  const config = ui ?? useUI();
  const auth = useMemo(
    () => ui?.getAuth() ?? getAuth(config.app),
    [config.app],
  );
  return auth;
}
