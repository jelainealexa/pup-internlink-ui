import "./globals.css";
import "./refinements.css";
import { Suspense } from "react";
import { AppProvider } from "./components/AppProvider";

export const metadata = {
  title: "PUP InternLink",
  description: "Academic internship management — browser-local demonstration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense
          fallback={
            <main className="page">
              <p role="status">Loading PUP InternLink…</p>
            </main>
          }
        >
          <AppProvider>{children}</AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
