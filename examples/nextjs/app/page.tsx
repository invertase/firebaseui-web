import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Firebase UI Demo</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <li>
            <Link href="/examples/1" className="text-blue-500 hover:underline">
              Example 1
            </Link>
          </li>
          <li>
            <Link href="/examples/2" className="text-blue-500 hover:underline">
              Example 2
            </Link>
          </li>
          <li>
            <Link href="/examples/3" className="text-blue-500 hover:underline">
              Example 3
            </Link>
          </li>
          <li>
            <Link href="/examples/4" className="text-blue-500 hover:underline">
              Example 4
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Components</h2>
        <nav className="space-y-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <li>
              <Link
                href="/sign-in-screen"
                className="text-blue-500 hover:underline"
              >
                Sign In Screen
              </Link>
            </li>
            <li>
              <Link
                href="/custom-sign-in-screen"
                className="text-blue-500 hover:underline"
              >
                Custom Sign In Screen
              </Link>
            </li>
            <li>
              <Link
                href="/email-password-form"
                className="text-blue-500 hover:underline"
              >
                Email Password Form
              </Link>
            </li>
            <li>
              <Link
                href="/register-form"
                className="text-blue-500 hover:underline"
              >
                Register Form
              </Link>
            </li>
            <li>
              <Link
                href="/phone-form"
                className="text-blue-500 hover:underline"
              >
                Phone Form
              </Link>
            </li>
            <li>
              <Link
                href="/email-link-form"
                className="text-blue-500 hover:underline"
              >
                Email Link Form
              </Link>
            </li>
            <li>
              <Link
                href="/forgot-password-form"
                className="text-blue-500 hover:underline"
              >
                Forgot Password Form
              </Link>
            </li>
            <li>
              <Link
                href="/google-sign-in-button"
                className="text-blue-500 hover:underline"
              >
                Google Sign In Button
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
