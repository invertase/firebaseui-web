import { createContext } from "@lit/context";
import { type Auth } from "firebase/auth";

export type FirebaseUIContext = {
  auth: Auth;
} & FirebaseUIOptions;

export type FirebaseUIOptions = {
  locale: "en";
};

export const FirebaseUIContext = createContext<FirebaseUIContext>("auth");
