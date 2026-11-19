"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useApp } from "./AppProvider";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="content-header feature-header">
      <div>
        <div className="page-eyebrow">INTERNSHIP COORDINATION</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      <div className="action-bar">{children}</div>
    </header>
  );
}
export function Field({
  label,
  name,
  value,
  type = "text",
  options,
  required = true,
  readOnly = false,
  min,
  max,
  step,
  hint,
  children,
}: {
  label: string;
  name: string;
  value?: string | number;
  type?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  readOnly?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  hint?: string;
  children?: ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && !readOnly ? " *" : ""}
      </label>
      {children ??
        (options ? (
          <select
            id={id}
            name={name}
            defaultValue={value ?? ""}
            required={required}
            aria-describedby={hint ? hintId : undefined}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={id}
            name={name}
            defaultValue={value}
            required={required}
            maxLength={4000}
            aria-describedby={hint ? hintId : undefined}
          />
        ) : (
          <input
            id={id}
            name={name}
            defaultValue={value}
            type={type}
            required={required}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step}
            maxLength={type === "text" ? 500 : undefined}
            aria-describedby={hint ? hintId : undefined}
          />
        ))}
      {hint && <small id={hintId}>{hint}</small>}
    </div>
  );
}
export function SaveForm({
  children,
  save,
  cancel,
  submit = "Save",
  success,
}: {
  children: ReactNode;
  save: (data: FormData) => Promise<void>;
  cancel?: string;
  submit?: string;
  success?: string;
}) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState("");
  const locked = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setError("");
    setDone("");
    const data = new FormData(event.currentTarget);
    try {
      await save(data);
      setDone(success ?? "Changes saved.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save. Your inputs are preserved.",
      );
    } finally {
      locked.current = false;
      setPending(false);
    }
  }
  useEffect(() => {
    if (error) feedback.current?.focus();
  }, [error]);
  return (
    <form onSubmit={onSubmit} className="functional-form" aria-busy={pending}>
      {children}
      {error && (
        <div
          className="prototype-message error-message"
          role="alert"
          tabIndex={-1}
          ref={feedback}
        >
          {error}
        </div>
      )}
      {done && (
        <div className="prototype-message success-message" role="status">
          {done}
        </div>
      )}
      <div className="form-actions">
        {cancel && (
          <Link href={cancel} className="secondary-action">
            Cancel
          </Link>
        )}
        <button type="submit" disabled={pending} className="primary-action">
          {pending ? "Saving…" : submit}
        </button>
      </div>
    </form>
  );
}
export const text = (data: FormData, key: string) =>
  String(data.get(key) ?? "").trim();
export const number = (data: FormData, key: string) => Number(text(data, key));
export const options = (values: string[]) =>
  [...new Set(values)].map((value) => ({ value, label: value }));
export function Status({ children }: { children: ReactNode }) {
  return <span className="record-status-pill">{children}</span>;
}
export function Empty({
  children = "No records match these filters.",
}: {
  children?: ReactNode;
}) {
  return (
    <div className="empty-directory">
      <p>{children}</p>
    </div>
  );
}
export function Table({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return rows.length ? (
    <div className="table-shell">
      <table>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th scope="col" key={i}>
                {h || "Actions"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty />
  );
}
export function Details({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="record-list">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
export function RecordState({
  title = "Record not found",
  message = "This record does not exist or is outside your demonstration account's access.",
  back = "/dashboard",
}: {
  title?: string;
  message?: string;
  back?: string;
}) {
  return (
    <>
      <PageHeader title={title} description={message} />
      <Link className="simple-action" href={back}>
        Back to workspace
      </Link>
    </>
  );
}
export function useFilters() {
  const params = useSearchParams();
  return {
    params,
    value: (key: string) => params.get(key) ?? "",
    set: (key: string, value: string) => {
      const next = new URLSearchParams(window.location.search);
      if (value) next.set(key, value);
      else next.delete(key);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${next.size ? `?${next}` : ""}`,
      );
    },
    reset: () =>
      window.history.replaceState(null, "", window.location.pathname),
  };
}
export function Filters({ children }: { children: ReactNode }) {
  const filters = useFilters();
  return (
    <section className="filter-panel" aria-label="Record filters">
      {children}
      <button
        className="secondary-action"
        type="button"
        onClick={filters.reset}
      >
        Reset filters
      </button>
    </section>
  );
}
export function Search({
  label = "Search",
  placeholder = "Name or identifier",
}: {
  label?: string;
  placeholder?: string;
}) {
  const filters = useFilters(),
    id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="search"
        value={filters.value("q")}
        placeholder={placeholder}
        onChange={(e) => filters.set("q", e.target.value)}
      />
    </div>
  );
}
export function Filter({
  name,
  label,
  choices,
}: {
  name: string;
  label: string;
  choices: { value: string; label: string }[];
}) {
  const filters = useFilters(),
    id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={filters.value(name)}
        onChange={(e) => filters.set(name, e.target.value)}
      >
        <option value="">All</option>
        {choices.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export function ActionButton({
  action,
  children,
  confirm,
  disabled = false,
}: {
  action: () => Promise<void>;
  children: ReactNode;
  confirm?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const locked = useRef(false);
  async function run() {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setError("");
    try {
      await action();
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      locked.current = false;
      setPending(false);
    }
  }
  return (
    <>
      <button
        className="secondary-action"
        disabled={pending || disabled}
        onClick={() => (confirm ? setOpen(true) : void run())}
      >
        {pending ? "Saving…" : children}
      </button>
      {error && (
        <p role="alert" className="inline-error">
          {error}
        </p>
      )}
      {open && (
        <Dialog title="Confirm action" close={() => setOpen(false)}>
          <p>{confirm}</p>
          <button
            className="primary-action"
            disabled={pending}
            onClick={() => void run()}
          >
            Confirm
          </button>
        </Dialog>
      )}
    </>
  );
}
export function Dialog({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      className="functional-dialog"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="dialog-header">
        <h2 id={id}>{title}</h2>
        <button
          type="button"
          onClick={close}
          aria-label="Close dialog"
          className="secondary-action"
        >
          Close
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Back({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="back-link" href={href}>
      ← {children}
    </Link>
  );
}
export function SavedNotice() {
  const { notice, setNotice } = useApp();
  return notice ? (
    <div role="status" className="saved-notice">
      {notice}
      <button aria-label="Dismiss saved message" onClick={() => setNotice("")}>
        Dismiss
      </button>
    </div>
  ) : null;
}
