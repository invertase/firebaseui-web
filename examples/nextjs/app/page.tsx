import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Firebase UI Demo</h1>

      <div>
        <h2 className="text-2xl font-bold mb-4">Auth Screens</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <li>
            <Link
              href="/sign-in-auth-screen"
              className="text-blue-500 hover:underline"
            >
              Sign In Auth Screen
            </Link>
          </li>
          <li>
            <Link
              href="/sign-in-auth-screen-w-handlers"
              className="text-blue-500 hover:underline"
            >
              Sign In Auth Screen with Handlers
            </Link>
          </li>
          <li>
            <Link
              href="/sign-in-auth-screen-w-oauth"
              className="text-blue-500 hover:underline"
            >
              Sign In Auth Screen with OAuth
            </Link>
          </li>
          <li>
            <Link
              href="/email-link-auth-screen"
              className="text-blue-500 hover:underline"
            >
              Email Link Auth Screen
            </Link>
          </li>
          <li>
            <Link
              href="/email-link-auth-screen-w-oauth"
              className="text-blue-500 hover:underline"
            >
              Email Link Auth Screen with OAuth
            </Link>
          </li>
          <li>
            <Link
              href="/phone-auth-screen"
              className="text-blue-500 hover:underline"
            >
              Phone Auth Screen
            </Link>
          </li>
          <li>
            <Link
              href="/phone-auth-screen-w-oauth"
              className="text-blue-500 hover:underline"
            >
              Phone Auth Screen with OAuth
            </Link>
          </li>
          <li>
            <Link
              href="/sign-up-auth-screen"
              className="text-blue-500 hover:underline"
            >
              Sign Up Auth Screen
            </Link>
          </li>
          <li>
            <Link
              href="/sign-up-auth-screen-w-oauth"
              className="text-blue-500 hover:underline"
            >
              Sign Up Auth Screen with OAuth
            </Link>
          </li>
          <li>
            <Link
              href="/oauth-screen"
              className="text-blue-500 hover:underline"
            >
              OAuth Screen
            </Link>
          </li>
          <li>
            <Link
              href="/password-reset-screen"
              className="text-blue-500 hover:underline"
            >
              Password Reset Screen
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
