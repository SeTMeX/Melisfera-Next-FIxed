import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";
import { products as STATIC_PRODUCTS } from "@/data/products";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

async function syncAdd(productId: string) {
  const token = getToken();
  if (!token) return;
  try {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
  } catch (e) {
    console.error("Fav add sync failed", e);
  }
}

async function syncRemove(productId: string) {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`/api/favorites/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    console.error("Fav remove sync failed", e);
  }
}

interface FavoritesStore {
  favorites: Product[];
  setFavorites: (favorites: Product[]) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  loadFromServer: () => Promise<void>;
}

const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      setFavorites: (favorites) => set({ favorites }),

      addFavorite: (product) => {
        syncAdd(product.id);
        set({ favorites: [...get().favorites, product] });
      },

      removeFavorite: (id) => {
        syncRemove(id);
        set({ favorites: get().favorites.filter((p) => p.id !== id) });
      },

      toggleFavorite: (product) => {
        const exists = get().favorites.some((p) => p.id === product.id);
        if (exists) {
          syncRemove(product.id);
          set({ favorites: get().favorites.filter((p) => p.id !== product.id) });
        } else {
          syncAdd(product.id);
          set({ favorites: [...get().favorites, product] });
        }
      },

      isFavorite: (id) => get().favorites.some((p) => p.id === id),

      loadFromServer: async () => {
        const token = getToken();
        if (!token) return;
        try {
          const res = await fetch("/api/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;
          const data = await res.json();
          const favorites: Product[] = data.map((row: any) => {
            const local = STATIC_PRODUCTS.find((p) => p.id === row.id);
            if (local) return local;
            const name = typeof row.name === "string" ? JSON.parse(row.name) : row.name;
            const description = typeof row.description === "string" ? JSON.parse(row.description) : row.description;
            const images = typeof row.images === "string" ? JSON.parse(row.images) : row.images;
            const badge = row.badge
              ? (typeof row.badge === "string" ? JSON.parse(row.badge) : row.badge)
              : undefined;
            const details = typeof row.details === "string" ? JSON.parse(row.details) : row.details;
            return {
              id: row.id,
              name,
              description,
              price: typeof row.price === "string" ? row.price : `${row.price} MDL`,
              images,
              imageColor: row.imageColor,
              badge,
              details,
            };
          });
          set({ favorites });
        } catch (e) {
          console.error("Load favorites failed", e);
        }
      },
    }),
    { name: "favorites-store" }
  )
);

export default useFavoritesStore;