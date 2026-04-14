"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: { ro: string; en: string };
    description: { ro: string; en: string };
    price: string;
    images: string[];
    imageColor: string;
    badge?: { ro: string; en: string };
    details: { ro: string[]; en: string[] };
  };
}

export const useCart = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await apiClient.getCart();
        
        // Transform backend data to match frontend CartItem interface
        const transformedItems = data.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          product: item.product
        }));
        
        // Update store with backend data
        clearCart();
        transformedItems.forEach((item: CartItem) => {
          addItem({
            id: item.product.id,
            name: item.product.name,
            image: item.product.images[0],
            imageColor: item.product.imageColor,
            price: item.product.price,
            quantity: item.quantity
          });
        });
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [addItem, clearCart]);

  const addToCart = async (product: {
    id: string;
    name: { ro: string; en: string };
    image: string;
    imageColor: string;
    price: string;
  }, quantity: number = 1) => {
    try {
      await apiClient.addToCart(product.id, quantity);
      addItem({
        id: product.id,
        name: product.name,
        image: product.image,
        imageColor: product.imageColor,
        price: product.price,
        quantity
      });
      
      const productName = product.name.ro || product.name.en;
      toast.success(`"${productName}" adaugat în co`);
    } catch (error) {
      toast.error("Eroare la adaugarea în co");
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await apiClient.removeFromCart(productId);
      removeItem(productId);
      toast.success("Produs eliminat din co");
    } catch (error) {
      toast.error("Eroare la eliminarea din co");
      console.error("Error removing from cart:", error);
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity === 0) {
        await removeFromCart(productId);
      } else {
        await apiClient.addToCart(productId, quantity);
        updateQuantity(productId, quantity);
      }
    } catch (error) {
      toast.error("Eroare la actualizarea cantit");
      console.error("Error updating cart quantity:", error);
    }
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
};
