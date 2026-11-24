import "@fontsource-variable/public-sans";
import "@fontsource-variable/bricolage-grotesque";
import "./styles/tokens.css";
import "./styles/shell.css";
import "./styles/components.css";
import "./styles/pages.css";
import { Suspense } from "react";
import { AppProvider } from "./components/AppProvider";

export const metadata = {
  title: "INtrack",
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
              <p role="status">Loading INtrack…</p>
            </main>
          }
        >
          <AppProvider>{children}</AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
