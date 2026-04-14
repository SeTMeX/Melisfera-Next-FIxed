import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  imageColor: string;
  price: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decreaseQty: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          if (item.quantity <= 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    { name: "melisfera-cart" }
  )
);

// Selector stabil - nu recreaza functia la fiecare render
export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);
