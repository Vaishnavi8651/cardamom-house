"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/types/menu";

/** The item shown in the detail modal, plus a resolved header image. */
export interface SelectedItem {
  item: MenuItem;
  image?: string;
  category?: string;
}

interface OrderLine {
  item: MenuItem;
  qty: number;
}

interface OrderContextValue {
  selected: SelectedItem | null;
  openItem: (selection: SelectedItem) => void;
  closeItem: () => void;
  lines: OrderLine[];
  count: number;
  total: number;
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within <OrderProvider>");
  return ctx;
}

const STORAGE_KEY = "cardamom-picks";

/**
 * Holds the two pieces of menu interaction state: which item's detail modal is
 * open, and the local "picks" list. The picks list is client-only and persisted
 * to localStorage — there is no backend; it just helps a customer remember (and
 * show staff) what they want.
 */
export function OrderProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [lines, setLines] = useState<OrderLine[]>([]);

  // Hydrate from storage after mount (keeps SSR and first client render equal).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as OrderLine[]);
    } catch {
      // ignore corrupt/unavailable storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }, [lines]);

  const openItem = useCallback((selection: SelectedItem) => {
    setSelected(selection);
  }, []);
  const closeItem = useCallback(() => setSelected(null), []);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.item.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<OrderContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const total = lines.reduce((sum, line) => sum + line.qty * line.item.price, 0);
    return { selected, openItem, closeItem, lines, count, total, add, remove, clear };
  }, [selected, lines, openItem, closeItem, add, remove, clear]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
