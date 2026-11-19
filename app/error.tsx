"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="page">
      <h1>Application unavailable</h1>
      <p role="alert">
        The page could not load. Saved browser-local data has not been
        intentionally reset.
      </p>
      <button onClick={reset}>Retry page</button>
      <p>
        For damaged demonstration data, use the explicit recovery option on the
        sign-in page.
      </p>
      <Link href="/">Return to sign in</Link>
    </main>
  );
}
