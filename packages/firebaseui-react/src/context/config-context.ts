import { FUIConfig } from "@firebase-ui/core";
import { createContext } from "react";

export const ConfigContext = createContext<FUIConfig>({} as FUIConfig);
