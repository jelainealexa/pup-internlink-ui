"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../components/AppProvider";
import { Field, SaveForm, text, ActionButton } from "../components/ui";

export function PasswordField({
  label = "Password",
  name = "password",
  newCredential = false,
}: {
  label?: string;
  name?: string;
  newCredential?: boolean;
}) {
  const id = useId(),
    [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label} *</label>
      <div className="password-input">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={newCredential ? 8 : undefined}
          maxLength={128}
          autoComplete={newCredential ? "new-password" : "current-password"}
        />
        <button
          className="password-toggle"
          type="button"
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setVisible(!visible)}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            {visible ? (
              <>
                <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A11 11 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3 3.7M6.5 6.5A18 18 0 0 0 2 12s4 7 10 7a11 11 0 0 0 5.5-1.5" />
              </>
            ) : (
              <>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          <span className="visually-hidden">
            {visible ? "Hide" : "Show"} {label.toLowerCase()}
          </span>
        </button>
      </div>
    </div>
  );
}
export function AccountAccess({
  mode,
}: {
  mode: "activate" | "forgot" | "reset";
}) {
  const { service, account, logout } = useApp(),
    query = useSearchParams();
  const [link, setLink] = useState(""),
    [complete, setComplete] = useState(false);
  const title =
    mode === "activate"
      ? "Activate Account"
      : mode === "forgot"
        ? "Forgot Password"
        : "Reset Password";
  return (
    <main className="page login-page">
      <h1>{title}</h1>
      <p className="scope-note">
        Browser-local demonstration only. No email is sent. Links apply only to
        this browser origin/profile. Invitations expire after 24 hours; reset
        links after 15 minutes and one use.
      </p>
      {complete ? (
        <>
          <p role="status">
            {mode === "activate"
              ? "Existing pre-registered account activated."
              : "Demonstration password reset."}{" "}
            Sign in using your new credentials.
          </p>
          {account && (
            <ActionButton action={logout}>
              Log out of the current demonstration account
            </ActionButton>
          )}
          <Link href="/">Return to Login</Link>
        </>
      ) : (
        <SaveForm
          submit={
            mode === "activate"
              ? "Activate Account"
              : mode === "forgot"
                ? "Send Password Reset Link (local demo)"
                : "Reset Password"
          }
          save={async (data) => {
            const email = text(data, "email");
            if (mode === "forgot") {
              const token = await service.access(
                { type: "password.request", email },
                crypto.randomUUID(),
              );
              setLink(
                `/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
              );
              return;
            }
            const password = String(data.get("password") ?? ""),
              confirmPassword = String(data.get("confirmPassword") ?? ""),
              token = text(data, "token");
            await service.access(
              mode === "activate"
                ? {
                    type: "account.activate",
                    token,
                    email,
                    studentNumber: text(data, "studentNumber"),
                    password,
                    confirmPassword,
                  }
                : {
                    type: "password.reset",
                    token,
                    email,
                    password,
                    confirmPassword,
                  },
              crypto.randomUUID(),
            );
            setComplete(true);
          }}
        >
          {mode !== "forgot" && (
            <Field
              label={
                mode === "activate"
                  ? "Demonstration invitation code"
                  : "Demonstration reset code"
              }
              name="token"
              value={query.get("token") ?? ""}
            />
          )}
          {mode === "activate" && (
            <Field label="Student number" name="studentNumber" />
          )}
          <Field
            label="Registered email address"
            name="email"
            type="email"
            value={query.get("email") ?? ""}
          />
          {mode !== "forgot" && (
            <>
              <PasswordField
                label={mode === "activate" ? "Password" : "New password"}
                newCredential
              />
              <PasswordField
                label="Confirm password"
                name="confirmPassword"
                newCredential
              />
              <p>Use 8–128 characters including a letter and a number.</p>
            </>
          )}
        </SaveForm>
      )}
      {link && (
        <p role="status">
          No email was sent.{" "}
          <Link href={link}>Open local password reset link</Link>
        </p>
      )}
      <nav className="record-links">
        <Link href="/">Login</Link>
        <Link href="/activate">Activate Account</Link>
        <Link href="/forgot-password">Forgot Password</Link>
      </nav>
    </main>
  );
}
