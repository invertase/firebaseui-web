import { FUIConfig } from "@firebase-ui/core";
import { type MapStore } from "nanostores";
import { useStore } from "@nanostores/react";
import { ConfigContext } from "./config-context";

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
