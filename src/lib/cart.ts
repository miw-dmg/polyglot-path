import { useEffect, useState, useCallback } from "react";

export type CartItem = {
  courseId: string;
  slug: string;
  title: string;
  priceCents: number;
  imageUrl: string | null;
  language: string;
  format: string;
  sessionId?: string | null;
  sessionStartsAt?: string | null;
};

const KEY = "linguist_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:change"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const handler = () => setItems(read());
    window.addEventListener("cart:change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cart:change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const add = useCallback((item: CartItem) => {
    const current = read();
    if (current.find((c) => c.courseId === item.courseId)) return false;
    write([...current, item]);
    return true;
  }, []);

  const remove = useCallback((courseId: string) => {
    write(read().filter((c) => c.courseId !== courseId));
  }, []);

  const setSession = useCallback((courseId: string, sessionId: string | null, sessionStartsAt: string | null) => {
    write(read().map((c) => (c.courseId === courseId ? { ...c, sessionId, sessionStartsAt } : c)));
  }, []);

  const clear = useCallback(() => write([]), []);

  const totalCents = items.reduce((sum, i) => sum + i.priceCents, 0);

  return { items, add, remove, clear, setSession, totalCents, count: items.length };
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}
