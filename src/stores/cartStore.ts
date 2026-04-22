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

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

async function syncAdd(productId: string, quantity: number) {
  const token = getToken();
  if (!token) return;
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity }),
    });
  } catch (e) {
    console.error("Cart sync failed", e);
  }
}

async function syncRemove(productId: string) {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`/api/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    console.error("Cart remove sync failed", e);
  }
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  loadFromServer: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        const newQty = existing ? existing.quantity + 1 : 1;
        syncAdd(item.id, newQty);
        set((state) => {
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        syncRemove(id);
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        syncAdd(id, quantity);
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      increaseQty: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        const newQty = item.quantity + 1;
        syncAdd(id, newQty);
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)),
        }));
      },

      decreaseQty: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        if (item.quantity <= 1) {
          syncRemove(id);
          set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        } else {
          const newQty = item.quantity - 1;
          syncAdd(id, newQty);
          set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)),
          }));
        }
      },

      clearCart: () => {
        const items = get().items;
        items.forEach((i) => syncRemove(i.id));
        set({ items: [] });
      },

      setItems: (items) => set({ items }),

      loadFromServer: async () => {
        const token = getToken();
        if (!token) return;
        try {
          const res = await fetch("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;
          const data = await res.json();
          const items: CartItem[] = data.map((row: any) => {
            const name = typeof row.product.name === "string"
              ? JSON.parse(row.product.name)
              : row.product.name;
            const images = typeof row.product.images === "string"
              ? JSON.parse(row.product.images)
              : row.product.images;
            return {
              id: row.product.id,
              name: name?.ro ?? name,
              image: Array.isArray(images) ? images[0] : "",
              imageColor: row.product.imageColor,
              price: typeof row.product.price === "string" ? row.product.price : `${row.product.price} MDL`,
              quantity: row.quantity,
            };
          });
          set({ items });
        } catch (e) {
          console.error("Load cart failed", e);
        }
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total: number, item: CartItem) => {
          const price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
          return total + price * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      },
    }),
    { name: "melisfera-cart" }
  )
);

export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);