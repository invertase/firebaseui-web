import { FirebaseUIConfiguration } from "@firebase-ui/core";
import { createContext } from "react";

export const FirebaseUIContext = createContext<FirebaseUIConfiguration>(
  {} as FirebaseUIConfiguration
);
