import { getCurrentUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";
import SignInScreen from "./screen";

export default async function SignInPage() {
  const { currentUser } = await getCurrentUser();

  if (currentUser) {
    return redirect("/");
  }

  return <SignInScreen />;
}
