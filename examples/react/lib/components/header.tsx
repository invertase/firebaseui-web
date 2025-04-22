'use client';

import { NavLink } from "react-router";
import { useUser } from "../firebase/hooks";
import { signOut, type User } from "firebase/auth";
import { auth } from "../firebase/clientApp";

export function Header() {
  const user = useUser();

  async function onSignOut() {
    await signOut(auth);
    router.push("/sign-in");
  }

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto h-12 flex items-center">
        <div className="font-bold">
          <NavLink to="/">FirebaseUI</NavLink>
        </div>
        <div className="flex-grow flex items-center justify-end">
          <ul className="text-sm flex items-center gap-6 *:hover:opacity-75">
            {user ? <li><button onClick={onSignOut}>Sign Out</button></li> : <li><NavLink to="/sign-in">Sign In</NavLink></li>}
          </ul>
        </div>
      </div>
    </header>
  );
}