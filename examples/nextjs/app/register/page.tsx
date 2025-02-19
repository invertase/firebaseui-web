import { getCurrentUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";
import RegisterScreen from "./screen";

export default async function RegisterPage() {
  const { currentUser } = await getCurrentUser();

  if (currentUser) {
    return redirect("/");
  }

  return <RegisterScreen />;
}
