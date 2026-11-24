"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock,
  Inbox,
  Loader2,
  PlayCircle,
  RotateCcw,
  SearchX,
  X,
  XCircle,
} from "lucide-react";
import {
  FormEvent,
  MouseEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useApp } from "./AppProvider";
import { AppError } from "../lib/domain";

/* ---------- Module labels (used for page eyebrows and the top bar) ---------- */
export const MODULE_LABELS: Record<string, string> = {
  students: "Students",
  partners: "Industry partners",
  faculty: "Faculty",
  requirements: "Requirements",
  internships: "Opportunities",
  applications: "Applications",
  placements: "Placements",
  progress: "Progress monitoring",
  attendance: "Attendance",
  evaluations: "Evaluations",
  reports: "Reports & analytics",
  settings: "Settings",
};
export function moduleLabelFor(pathname: string) {
  const segment = pathname.split("/")[2];
  return segment ? MODULE_LABELS[segment] : "Overview";
}
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => /^[a-z]/i.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "•";

/** Supplied by Workspace so page headers can show their module as an eyebrow. */
export const ModuleLabelContext = createContext<string>("");

export function PageHeader({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  const moduleLabel = useContext(ModuleLabelContext);
  const label = eyebrow ?? moduleLabel;
  const showEyebrow =
    !!label &&
    label.toLowerCase() !== title.toLowerCase() &&
    label !== "Overview";
  return (
    <header className="content-header feature-header">
      <div className="page-heading">
        {showEyebrow && <div className="page-eyebrow">{label}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="action-bar">{children}</div>}
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
  onChange,
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
  onChange?: (value: string) => void;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && !readOnly ? <span className="req"> *</span> : null}
      </label>
      {children ??
        (options ? (
          <select
            id={id}
            name={name}
            defaultValue={value ?? ""}
            required={required}
            onChange={(e) => onChange?.(e.target.value)}
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
            onChange={(e) => onChange?.(e.target.value)}
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
            onChange={(e) => onChange?.(e.target.value)}
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
  revision,
}: {
  children: ReactNode;
  save: (data: FormData, expectedRevision?: number) => Promise<void>;
  cancel?: string;
  submit?: string;
  success?: string;
  revision?: number;
}) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState("");
  const locked = useRef(false);
  const formRevision = useRef(revision);
  const [reloadOffered, setReloadOffered] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setError("");
    setDone("");
    setReloadOffered(false);
    const data = new FormData(event.currentTarget);
    try {
      await save(data, formRevision.current);
      if (formRevision.current !== undefined) formRevision.current++;
      setDone(success ?? "Changes saved.");
    } catch (e) {
      setReloadOffered(e instanceof AppError && e.code === "CONFLICT");
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
          <AlertTriangle size={18} aria-hidden="true" />
          <div>{error}</div>
        </div>
      )}
      {done && (
        <div className="prototype-message success-message" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          <div>{done}</div>
        </div>
      )}
      <div className="form-actions">
        {reloadOffered && (
          <div className="prototype-message">
            <p>
              Reload to review the latest saved records. Reloading discards
              unsaved inputs; copy anything you need first.
            </p>
            <button
              type="button"
              className="secondary-action"
              onClick={() => window.location.reload()}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Reload latest form
            </button>
          </div>
        )}
        {cancel && (
          <Link href={cancel} className="secondary-action">
            Cancel
          </Link>
        )}
        <button type="submit" disabled={pending} className="primary-action">
          {pending && <Loader2 size={16} className="spin" aria-hidden="true" />}
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
type Tone = "success" | "warning" | "danger" | "info" | "neutral";
const TONES: [RegExp, Tone][] = [
  [
    /^(rejected|terminated|expired|deactivated|inactive|revoked|failed)/i,
    "danger",
  ],
  [
    /^(pending|expiring|awaiting|delayed|missing|incomplete|draft|needs)/i,
    "warning",
  ],
  [/^(ongoing|applying|in progress|submitted|open)/i, "info"],
  [
    /^(accepted|approved|active|completed|eligible|complete|reporting|available|verified|yes)/i,
    "success",
  ],
];
export function toneOf(label: string): Tone {
  const value = label.trim();
  if (/^pending activation/i.test(value)) return "warning";
  if (/^not yet|^no\b|^none/i.test(value)) return "neutral";
  return TONES.find(([pattern]) => pattern.test(value))?.[1] ?? "neutral";
}
const TONE_ICON: Record<Tone, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: Clock,
  danger: XCircle,
  info: PlayCircle,
  neutral: CircleDashed,
};
export function Status({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const label = typeof children === "string" ? children : "";
  const resolved = tone ?? (label ? toneOf(label) : "neutral");
  const Icon = /^completed/i.test(label)
    ? BadgeCheck
    : /^(terminated|deactivated|inactive)/i.test(label)
      ? Ban
      : /^expiring/i.test(label)
        ? AlertTriangle
        : TONE_ICON[resolved];
  return (
    <span className={`record-status-pill tone-${resolved}`}>
      <Icon size={13} strokeWidth={2.25} aria-hidden="true" />
      {children}
    </span>
  );
}
export function Empty({
  children = "No records match these filters.",
  title,
  icon,
}: {
  children?: ReactNode;
  title?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="empty-directory">
      <span className="empty-icon" aria-hidden="true">
        {icon ?? <SearchX size={22} />}
      </span>
      {title && <p className="empty-title">{title}</p>}
      <p>{children}</p>
    </div>
  );
}
export function EmptyInbox({ children }: { children: ReactNode }) {
  return <Empty icon={<Inbox size={22} />}>{children}</Empty>;
}

/* ---------- Table cell building blocks ---------- */
export function Avatar({
  name,
  company = false,
}: {
  name: string;
  company?: boolean;
}) {
  return (
    <span
      className={`avatar${company ? " is-company" : ""}`}
      data-initials={initials(name)}
      aria-hidden="true"
    />
  );
}
export function Identity({
  name,
  meta,
  href,
  company,
}: {
  name: string;
  meta?: ReactNode;
  href?: string;
  company?: boolean;
}) {
  return (
    <div className="cell-identity">
      <Avatar name={name} company={company} />
      <div className="cell-stack">
        {href ? (
          <Link className="cell-primary" href={href}>
            {name}
          </Link>
        ) : (
          <strong>{name}</strong>
        )}
        {meta && <span>{meta}</span>}
      </div>
    </div>
  );
}
export function Stack({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className="cell-stack">
      <span className="cell-primary">{primary}</span>
      {secondary != null && secondary !== "" && <span>{secondary}</span>}
    </div>
  );
}
export function Mono({ children }: { children: ReactNode }) {
  return <span className="cell-mono">{children}</span>;
}
export function HoursMeter({
  approved,
  required,
  label,
}: {
  approved: number;
  required: number;
  label?: string;
}) {
  const percent = required
    ? Math.min(100, Math.round((approved / required) * 100))
    : 0;
  return (
    <div className="cell-hours">
      <span>
        {approved}{" "}
        <small>
          / {required} h · {percent}%
        </small>
      </span>
      <progress
        value={percent}
        max={100}
        aria-label={label ?? `${approved} of ${required} hours approved`}
      />
    </div>
  );
}
export function RowLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const [first, ...rest] = children.split(" ");
  return (
    <Link className="row-action" href={href}>
      {first}
      {rest.length > 0 && (
        <span className="visually-hidden"> {rest.join(" ")}</span>
      )}
      <ChevronRight size={16} aria-hidden="true" />
    </Link>
  );
}

export function Table({
  headers,
  rows,
  caption,
  hrefs,
  numeric = [],
  tones,
  empty,
}: {
  headers: string[];
  rows: ReactNode[][];
  caption?: string;
  /** Optional row destinations; makes the entire row a click target. */
  hrefs?: (string | undefined)[];
  /** Column indexes holding numbers (right aligned). */
  numeric?: number[];
  /** Optional per-row emphasis ("warning" | "danger" | "info") shown as a leading rule. */
  tones?: (string | undefined)[];
  empty?: ReactNode;
}) {
  const router = useRouter();
  const open = (event: MouseEvent<HTMLTableRowElement>, href?: string) => {
    if (!href || event.defaultPrevented) return;
    if (window.getSelection()?.toString()) return;
    if (
      (event.target as HTMLElement).closest("a, button, input, select, label")
    )
      return;
    if (event.metaKey || event.ctrlKey) window.open(href, "_blank");
    else router.push(href);
  };
  return rows.length ? (
    <div className="table-shell">
      <table>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                scope="col"
                key={i}
                className={
                  numeric.includes(i)
                    ? "num"
                    : !h || h === "Actions"
                      ? "cell-actions"
                      : undefined
                }
              >
                {h || "Actions"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              data-href={hrefs?.[i]}
              data-tone={tones?.[i]}
              onClick={(event) => open(event, hrefs?.[i])}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  data-label={headers[j] === "Actions" ? "" : headers[j]}
                  className={
                    numeric.includes(j)
                      ? "num"
                      : !headers[j] || headers[j] === "Actions"
                        ? "cell-actions"
                        : undefined
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty>{empty}</Empty>
  );
}
export function Details({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="record-list">
      {items.map(([label, value]) => (
        <div
          key={label}
          className={
            typeof value === "string" && value.length > 90 ? "wide" : undefined
          }
        >
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
      <Link className="secondary-action" href={back}>
        <ChevronLeft size={16} aria-hidden="true" />
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
      window.dispatchEvent(new Event("internlink-filter-change"));
    },
    reset: () => {
      window.history.replaceState(null, "", window.location.pathname);
      window.dispatchEvent(new Event("internlink-filter-change"));
    },
  };
}
export function Filters({ children }: { children: ReactNode }) {
  const filters = useFilters();
  const active = [...filters.params.entries()].filter(
    ([key, value]) => value && !["view", "year"].includes(key),
  ).length;
  return (
    <section className="filter-panel" aria-label="Record filters">
      <div className="filter-grid">{children}</div>
      <div className="filter-footer">
        <span className="filter-state" data-active={active > 0}>
          {active > 0
            ? `${active} filter${active === 1 ? "" : "s"} applied`
            : "Showing all records"}
        </span>
        <button
          className="secondary-action btn-sm"
          type="button"
          onClick={filters.reset}
        >
          Reset filters
        </button>
      </div>
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
  const input = useRef<HTMLInputElement>(null);
  const query = filters.value("q");
  useEffect(() => {
    const current = () =>
      new URLSearchParams(window.location.search).get("q") ?? "";
    const synchronize = () => {
      if (input.current && input.current.value !== current())
        input.current.value = current();
    };
    // A delayed URL render must not restore an older value over newer keystrokes.
    if (query === current()) synchronize();
    window.addEventListener("popstate", synchronize);
    window.addEventListener("internlink-filter-change", synchronize);
    return () => {
      window.removeEventListener("popstate", synchronize);
      window.removeEventListener("internlink-filter-change", synchronize);
    };
  }, [query]);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="search"
        ref={input}
        defaultValue={query}
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
  danger = false,
}: {
  action: () => Promise<void>;
  children: ReactNode;
  confirm?: string;
  disabled?: boolean;
  danger?: boolean;
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
        onClick={() => {
          if (confirm) {
            setError("");
            setOpen(true);
          } else void run();
        }}
      >
        {pending ? "Saving…" : children}
      </button>
      {error && !open && (
        <p role="alert" className="inline-error">
          {error}
        </p>
      )}
      {open && (
        <Dialog title="Confirm action" close={() => setOpen(false)}>
          <p>{confirm}</p>
          {error && (
            <p role="alert" className="inline-error">
              {error}
            </p>
          )}
          <div className="dialog-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className={danger ? "danger-action" : "primary-action"}
              disabled={pending}
              onClick={() => void run()}
            >
              Confirm
            </button>
          </div>
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
          className="icon-button"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="dialog-body">{children}</div>
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
      <ChevronLeft size={16} aria-hidden="true" />
      {children}
    </Link>
  );
}
export function SavedNotice() {
  const { notice, setNotice } = useApp();
  return notice ? (
    <div role="status" className="saved-notice">
      <CheckCircle2 size={18} aria-hidden="true" />
      <span>{notice}</span>
      <button aria-label="Dismiss saved message" onClick={() => setNotice("")}>
        Dismiss
      </button>
    </div>
  ) : null;
}

export function MetricLink({
  href,
  count,
  label,
  tone,
}: {
  href: string;
  count: number | string;
  label: string;
  tone?: "urgent" | "quiet";
}) {
  const zero = Number(count) === 0;
  return (
    <Link
      href={href}
      className={`metric-card${tone ? ` metric-${tone}` : ""}${zero ? " is-zero" : ""}`}
    >
      <strong>{count}</strong>
      <span className="metric-label">{label}</span>
      <ArrowUpRight className="metric-go" size={16} aria-hidden="true" />
    </Link>
  );
}
