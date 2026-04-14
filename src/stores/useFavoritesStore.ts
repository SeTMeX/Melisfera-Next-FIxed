import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

interface FavoritesStore {
  favorites: Product[];
  setFavorites: (favorites: Product[]) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}

const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      setFavorites: (favorites) => set({ favorites }),
      addFavorite: (product) => set({ favorites: [...get().favorites, product] }),
      removeFavorite: (id) => set({ favorites: get().favorites.filter((p) => p.id !== id) }),
      toggleFavorite: (product) => {
        const exists = get().favorites.some((p) => p.id === product.id);
        set({
          favorites: exists
            ? get().favorites.filter((p) => p.id !== product.id)
            : [...get().favorites, product],
        });
      },
      isFavorite: (id) => get().favorites.some((p) => p.id === id),
    }),
    { name: "favorites-store" }
  )
);

export default useFavoritesStore;