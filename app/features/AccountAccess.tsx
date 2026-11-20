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
        className="secondary-action"
        type="button"
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        {visible ? "Hide" : "Show"} {label.toLowerCase()}
      </button>
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
