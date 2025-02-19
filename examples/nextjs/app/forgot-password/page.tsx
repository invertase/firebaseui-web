import { getCurrentUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";
import ForgotPasswordScreen from "./screen";

export default async function ForgotPasswordPage() {
  const { currentUser } = await getCurrentUser();

  if (currentUser) {
    return redirect("/");
  }

  return <ForgotPasswordScreen />;
}
