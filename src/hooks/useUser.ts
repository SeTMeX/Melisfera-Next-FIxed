"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

let globalUser: User | null = null;
let listeners: Array<(user: User | null) => void> = [];

function notifyListeners(user: User | null) {
  globalUser = user;
  listeners.forEach((fn) => fn(user));
}

export function useUser(): UseUserReturn {
  const [user, setUserState] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState(!globalUser);

  useEffect(() => {
    const listener = (u: User | null) => setUserState(u);
    listeners.push(listener);
    return () => { listeners = listeners.filter((l) => l !== listener); };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      notifyListeners(data.user || null);
    } catch {
      notifyListeners(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!globalUser) fetchUser();
  }, [fetchUser]);

  const setUser = (u: User | null) => notifyListeners(u);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    notifyListeners(null);
  };

  return { user, loading, setUser, logout, refetch: fetchUser };
}