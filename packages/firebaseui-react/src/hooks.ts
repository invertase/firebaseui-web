import { useContext, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { ConfigContext } from "./context/config-context";

export function useConfig() {
  return useContext(ConfigContext);
}

export function useAuth() {
  const config = useConfig();
  const auth = useMemo(() => getAuth(config.app), [config.app]);
  return auth;
}

export function useTranslations() {
  const config = useConfig();
  return config.translations;
}
