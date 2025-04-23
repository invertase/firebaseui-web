import { useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./clientApp";

export function useUser(initalUser?: User | null) {
  const [user, setUser] = useState<User | null>(initalUser ?? null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return user;
}