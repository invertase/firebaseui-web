import { getCurrentUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";
import EmailLinkAuthScreen from "./screen";

export default async function SignInWithEmailLinkPage() {
  const { currentUser } = await getCurrentUser();

  if (currentUser) {
    return redirect("/");
  }

  return <EmailLinkAuthScreen />;
}
