import Link from "next/link";
export default function NotFound() {
  return (
    <main className="page">
      <h1>Page not found</h1>
      <p>This address does not match an available INtrack page.</p>
      <Link href="/dashboard">Return to the workspace</Link>
    </main>
  );
}
