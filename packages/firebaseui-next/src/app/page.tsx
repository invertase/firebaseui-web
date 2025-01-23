"use client";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { FuiButton, FuiLoginForm } from "firebaseui-react";
import { initializeFirebaseUI, LoginType } from "firebaseui-stencil";
import { useState, useRef, useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDkyfavblrRNMP0TbJMwTIPSlsCtBHlFNg",
  authDomain: "ff-test-74aeb.firebaseapp.com",
  databaseURL:
    "https://ff-test-74aeb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ff-test-74aeb",
  storageBucket: "ff-test-74aeb.appspot.com",
  messagingSenderId: "950537677105",
  appId: "1:950537677105:web:dafb21b3f1e973c2cde810",
  measurementId: "G-B2FBR1163R",
};

const app = initializeApp(firebaseConfig);
const config = initializeFirebaseUI({
  app,
  enableAutoAnonymousLogin: false,
});

export default function Home() {
  const [currentLoginType, setCurrentLoginType] = useState<LoginType>("email");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(config.state.app);

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth(config?.state.app);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!user && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
          <label
            htmlFor="loginType"
            className="text-sm font-medium text-gray-700"
          >
            Login Type:
          </label>
          <div className="relative">
            <select
              id="loginType"
              className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              value={currentLoginType}
              onChange={(e) => setCurrentLoginType(e.target.value as LoginType)}
            >
              <option value="email">Email & Password</option>
              <option value="phone">Phone Number</option>
              <option value="emailLink">Magic Link</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center p-4">
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-medium text-gray-900">
              Signed in as: {user.email || user.phoneNumber || "Anonymous User"}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          config && (
            <FuiLoginForm config={config} loginType={currentLoginType} />
          )
        )}
      </div>
    </div>
  );
}
