import { getCurrentUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";
import SignInSignInWithPhoneNumberScreen from "./screen";

export default async function SignInWithPhoneNumberPage() {
  const { currentUser } = await getCurrentUser();

  if (currentUser) {
    return redirect("/");
  }

  return <SignInSignInWithPhoneNumberScreen />;
}
