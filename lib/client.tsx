"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type Account = {
  id: string;
  name: string;
  email: string;
  role: "brand" | "creator";
  company?: string;
  wallet: number;
  price?: number;
  initials: string;
};

type Ctx = {
  account: Account | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AccountCtx = createContext<Ctx>({ account: null, loading: true, refresh: async () => {} });

export async function api<T=unknown>(path: string, body?: unknown, method = "POST"): Promise<T> {
  const res = await fetch(path, {
    method: body !== undefined ? method : "GET",
    credentials: "include",
    headers: body !== undefined ? { "content-type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    try {
      const data = await fetch("/api/auth/me").then((r) => r.json());
      setAccount(data.user || null);
    } catch {
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };
  const path = usePathname();
  useEffect(() => { refresh(); }, [path]);
  return <AccountCtx.Provider value={{ account, loading, refresh }}>{children}</AccountCtx.Provider>;
}

export function useAccount() {
  return useContext(AccountCtx);
}
