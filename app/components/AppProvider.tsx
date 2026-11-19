"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Account,
  AppError,
  Command,
  Database,
  InternLinkService,
  defaultPreferences,
} from "../lib/domain";
import { preferencesOf } from "../lib/rules";
import { createService } from "../lib/service";

interface AppContextValue {
  account: Account | null;
  db: Database | null;
  loading: boolean;
  error: string;
  service: InternLinkService;
  refresh: () => Promise<void>;
  mutate: (
    command: Command,
    key?: string,
    expectedRevision?: number,
  ) => Promise<string>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  notice: string;
  setNotice: (text: string) => void;
}
const AppContext = createContext<AppContextValue | null>(null);
export function AppProvider({
  children,
  suppliedService,
}: {
  children: ReactNode;
  suppliedService?: InternLinkService;
}) {
  const [service] = useState(() => suppliedService ?? createService());
  const [account, setAccount] = useState<Account | null>(null);
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const version = ++generation.current;
    try {
      const who = await service.currentAccount();
      const data = who ? await service.read() : null;
      if (version === generation.current) {
        setAccount(who);
        setDb(data);
        setError("");
      }
    } catch (e) {
      if (version === generation.current) {
        setError(
          e instanceof Error ? e.message : "Could not load application data.",
        );
        setDb(null);
        setAccount(null);
      }
    } finally {
      if (version === generation.current) setLoading(false);
    }
  }, [service]);
  useEffect(() => {
    void Promise.resolve().then(refresh);
    const unsubscribe = service.subscribe(() => {
      void refresh();
    });
    const interval = setInterval(() => {
      void refresh();
    }, 30000);
    const focus = () => {
      void refresh();
    };
    window.addEventListener("focus", focus);
    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener("focus", focus);
    };
  }, [refresh, service]);
  const mutate = useCallback(
    async (
      command: Command,
      key = crypto.randomUUID(),
      expectedRevision = db?.revision,
    ) => {
      try {
        const id = await service.execute(command, key, expectedRevision);
        await refresh();
        return id;
      } catch (e) {
        if (
          e instanceof AppError &&
          (e.code === "CONFLICT" || e.code === "UNAUTHENTICATED")
        )
          await refresh();
        throw e;
      }
    },
    [service, db, refresh],
  );
  const login = useCallback(
    async (email: string, password: string) => {
      await service.signIn(email, password);
      await refresh();
    },
    [service, refresh],
  );
  const logout = useCallback(async () => {
    await service.signOut();
    await refresh();
  }, [service, refresh]);
  const value = useMemo(
    () => ({
      account,
      db,
      loading,
      error,
      service,
      refresh,
      mutate,
      login,
      logout,
      notice,
      setNotice,
    }),
    [
      account,
      db,
      loading,
      error,
      service,
      refresh,
      mutate,
      login,
      logout,
      notice,
    ],
  );
  const prefs =
    db && account ? preferencesOf(db, account.id) : defaultPreferences;
  return (
    <AppContext.Provider value={value}>
      <div
        className={`application ${prefs.largerText ? "larger-text" : ""} ${prefs.reduceMotion ? "reduced-motion" : ""} ${prefs.density === "Compact" ? "compact-tables" : ""}`}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppProvider is required.");
  return context;
}
