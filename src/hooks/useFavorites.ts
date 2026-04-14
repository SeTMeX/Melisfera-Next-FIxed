"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import useFavoritesStore from "@/stores/useFavoritesStore";
import { toast } from "sonner";
import type { Product } from "@/data/products";

export const useFavorites = () => {
  const { favorites, setFavorites, addFavorite, removeFavorite } = useFavoritesStore();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await apiClient.getFavorites();
        
        // Transform backend data to match frontend Product interface
        const transformedFavorites: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          images: item.images,
          imageColor: item.imageColor,
          badge: item.badge,
          details: item.details
        }));
        
        setFavorites(transformedFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [setFavorites]);

  const toggleFavorite = async (product: Product) => {
    try {
      const isFavorite = favorites.some(fav => fav.id === product.id);
      
      if (isFavorite) {
        await apiClient.removeFromFavorites(product.id);
        removeFavorite(product.id);
        toast.success(`"${product.name.ro}" eliminat din favorite`);
      } else {
        await apiClient.addToFavorites(product.id);
        addFavorite(product);
        toast.success(`"${product.name.ro}" adaugat la favorite`);
      }
    } catch (error) {
      toast.error("Eroare la actualizarea favoritelor");
      console.error("Error toggling favorite:", error);
    }
  };

  return { favorites, toggleFavorite };
};
