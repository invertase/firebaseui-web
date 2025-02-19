'use client';

import Link from "next/link";
import { useUser } from "../firebase/hooks";
import { signOut, type User } from "firebase/auth";
import { auth } from "../firebase/clientApp";
import { useRouter } from "next/navigation";

export function Header(props: { currentUser: User | null }) {
  const router = useRouter();
  const user = useUser(props.currentUser);

  async function onSignOut() {
    await signOut(auth);
    router.push("/sign-in");
  }

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto h-12 flex items-center">
        <div className="font-bold">
          <Link href="/">FirebaseUI</Link>
        </div>
        <div className="flex-grow flex items-center justify-end">
          <ul className="text-sm flex items-center gap-6 *:hover:opacity-75">
            {user ? <li><button onClick={onSignOut}>Sign Out</button></li> : <li><Link href="/sign-in">Sign In</Link></li>}
          </ul>
        </div>
      </div>
    </header>
  );
}