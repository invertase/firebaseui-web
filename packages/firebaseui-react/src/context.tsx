import { FUIConfig } from "@firebase-ui/core";
import { createContext } from "react";
import { MapStore } from "nanostores";
import { useStore } from "@nanostores/react";

export const ConfigContext = createContext<FUIConfig>({} as FUIConfig);

export function ConfigProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: MapStore<FUIConfig>;
}) {
  const value = useStore(config);
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
