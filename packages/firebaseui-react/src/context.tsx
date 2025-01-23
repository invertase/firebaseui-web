import { FUIConfig } from '@firebase-ui/core';
import { createContext, useContext } from 'react';

export const ConfigContext = createContext<FUIConfig>({} as FUIConfig);

export function ConfigProvider({ children, config }: { children: React.ReactNode, config: FUIConfig }) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}
