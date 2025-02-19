"use client";

import { ui } from "@/lib/firebase";
import { ConfigProvider } from "@firebase-ui/react";

export function InitUI({ children }: { children: React.ReactNode }) {
  return <ConfigProvider config={ui}>{children}</ConfigProvider>;
}
