"use client";

import { useUser } from "@/lib/firebase/hooks";
import { EmailLinkAuthScreen } from "@firebase-ui/react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Screen() {
  const router = useRouter();
  const user = useUser();

  // If the user signs in, redirect to the home page from the client.
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return <EmailLinkAuthScreen />;
}
