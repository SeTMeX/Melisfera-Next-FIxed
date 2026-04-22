"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import useFavoritesStore from "@/stores/useFavoritesStore";
import useUserStore from "@/stores/useUserStore";

export function SyncProvider() {
  const user = useUserStore((s) => s.user);
  const loadCart = useCartStore((s) => s.loadFromServer);
  const loadFavorites = useFavoritesStore((s) => s.loadFromServer);

  useEffect(() => {
    if (!user) return;
    loadCart();
    loadFavorites();
  }, [user?.id, loadCart, loadFavorites]);

  return null;
}