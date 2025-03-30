import { useContext, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { FirebaseUIContext } from "./context/ui-context";
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
    [config.app]
  );
  return auth;
}

/**
 * Get the default locale from the UI configuration.
 * If no UI configuration is provided, use the default locale from the context.
 */
export function useDefaultLocale(ui?: FirebaseUIConfiguration | undefined) {
  const config = ui ?? useUI();
  return config.defaultLocale;
}

/**
 * Get the translations from the UI configuration.
 * If no UI configuration is provided, use the translations from the context.
 */
export function useTranslations(ui?: FirebaseUIConfiguration | undefined) {
  const config = ui ?? useUI();
  return config.translations;
}
