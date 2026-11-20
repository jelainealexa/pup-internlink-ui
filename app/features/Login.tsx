"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../components/AppProvider";
import { Field, SaveForm, text } from "../components/ui";
import { preferencesOf } from "../lib/rules";
import { DEMO_PASSWORD } from "../lib/seed";
import Link from "next/link";
import { PasswordField } from "./AccountAccess";

export function Login() {
  const { account, db, login, loading, error, service, refresh } = useApp();
  const router = useRouter(),
    query = useSearchParams();
  const [recover, setRecover] = useState(false);
  useEffect(() => {
    if (!account || !db) return;
    const destination = query.get("next");
    router.replace(
      destination?.startsWith("/dashboard") && !destination.startsWith("//")
        ? destination
        : account.role === "Coordinator"
          ? preferencesOf(db, account.id).landingPage
          : "/dashboard",
    );
  }, [account, db, query, router]);
  return (
    <main className="page login-page">
      <h1>PUP InternLink</h1>
      <p>Academic internship management</p>
      <section className="prototype-box">
        <h2>Demonstration sign in</h2>
        <p>
          Synthetic accounts only. Authentication and role restrictions are
          simulated in this browser; no backend is connected.
        </p>
        {error && <p role="alert">{error}</p>}
        {loading ? (
          <p role="status">Checking demonstration session…</p>
        ) : (
          <SaveForm
            submit="Sign in"
            save={async (data) => {
              await login(
                text(data, "email"),
                String(data.get("password") ?? ""),
              );
            }}
          >
            <Field label="Email address" name="email" type="email" />
            <PasswordField />
          </SaveForm>
        )}
      </section>
      <nav className="record-links">
        <Link href="/">Login</Link>
        <Link href="/activate">Activate Account</Link>
        <Link href="/forgot-password">Forgot Password</Link>
      </nav>
      <section className="demo-accounts">
        <h2>Demonstration accounts</h2>
        <p>
          Seeded accounts use public demo password: <code>{DEMO_PASSWORD}</code>
          . New students activate an invitation with a chosen demonstration
          password. Faculty and supervisor accounts start with this public
          password. It is not a secret or a production password.
        </p>
        <ul>
          <li>OJT Coordinator: coordinator@example.test</li>
          <li>Company Supervisor (administrator): company@example.test</li>
          <li>Student: student@example.test</li>
          <li>
            Other students: student2@example.test through student5@example.test
          </li>
          <li>
            Faculty adviser: faculty@example.test (second adviser:
            faculty2@example.test)
          </li>
          <li>
            Intern Supervisor: supervisor@example.test (second company:
            supervisor2@example.test)
          </li>
          <li>Inactive account: student6@example.test</li>
        </ul>
        <p>
          Data persists in IndexedDB for this browser profile and origin.
          Independent profiles/devices do not share data. Sessions expire after
          eight hours.
        </p>
      </section>
      {
        <section>
          <button
            className="secondary-action"
            onClick={() => setRecover(!recover)}
          >
            Storage recovery
          </button>
          {recover && (
            <>
              <h2>Discard damaged demonstration storage</h2>
              <p>
                This is available only when stored data is unreadable. Valid
                data can be reset by a coordinator in Settings. This removes
                synthetic records and files from this browser.
              </p>
              <SaveForm
                submit="Reset damaged demo data"
                save={async (data) => {
                  await service.reset(text(data, "confirmation"));
                  await refresh();
                  setRecover(false);
                }}
              >
                <Field label="Type RESET DEMO" name="confirmation" />
              </SaveForm>
            </>
          )}
        </section>
      }
    </main>
  );
}
