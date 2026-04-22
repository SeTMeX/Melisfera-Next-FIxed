"use client";

import { ShoppingBag, Star, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import useFavoritesStore from "@/stores/useFavoritesStore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { Product } from "@/data/products";

interface ProductProps {
  id: string;
  name: string;
  image?: string;
  imageColor: string;
  price?: string;
  onClick?: () => void;
  product?: Product;
}

function getDisplayPrice(name: string, fallback: string): string {
  const n = name.toLowerCase();
  if (n.includes("salcâm") || n.includes("salcam") || n.includes("акаци")) return "150 MDL";
  if (n.includes("tei") || n.includes("липов"))                            return "130 MDL";
  if (n.includes("câmp") || n.includes("camp") || n.includes("лугов"))     return "130 MDL";
  if (n.includes("polen") || n.includes("пыльц"))                          return "100 MDL";
  if (n.includes("tuică") || n.includes("tuica") || n.includes("брэнди"))  return "120 MDL";
  if (n.includes("propolis") || n.includes("прополис"))                    return "50 MDL";
  if (n.includes("fagure") || n.includes("сот"))                           return "100 MDL";
  if (n.includes("cadou") || n.includes("gift") || n.includes("pachet") || n.includes("подар")) return "300 MDL";
  return fallback;
}

export function ProductCard({ id, name, image, imageColor, price = "120 MDL", onClick, product }: ProductProps) {
  const { t, i18n } = useTranslation();
  const lang: "ro" | "en" | "ru" =
    i18n.language === "en" ? "en" : i18n.language === "ru" ? "ru" : "ro";
  const addItem = useCartStore((s: any) => s.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const liked = isFavorite(id);

  const fallbackImage = `https://placehold.co/600x600/FFF8E7/${imageColor}?text=${encodeURIComponent(name)}`;
  const imageSrc = image ?? fallbackImage;
  const displayPrice = getDisplayPrice(name, price);

  const msgAddedCart =
    lang === "ro" ? `"${name}" adăugat în coș 🍯`
    : lang === "ru" ? `"${name}" добавлено в корзину 🍯`
    : `"${name}" added to cart 🍯`;

  const msgRemovedFav =
    lang === "ro" ? `"${name}" eliminat din favorite`
    : lang === "ru" ? `"${name}" удалено из избранного`
    : `"${name}" removed from favorites`;

  const msgAddedFav =
    lang === "ro" ? `"${name}" adăugat la favorite ❤️`
    : lang === "ru" ? `"${name}" добавлено в избранное ❤️`
    : `"${name}" added to favorites ❤️`;

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, image: imageSrc, imageColor, price: displayPrice });
    toast.success(msgAddedCart);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    toggleFavorite(product);
    toast.success(liked ? msgRemovedFav : msgAddedFav);
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm border border-amber-100 dark:border-neutral-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full cursor-pointer"
    >
      {product && (
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-sm border shadow-sm transition-all duration-300 ${
            liked
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white/90 dark:bg-neutral-800/90 border-amber-200 dark:border-neutral-700 text-gray-400 hover:text-red-400"
          }`}
        >
          <Heart size={12} className={liked ? "fill-red-500" : ""} />
        </button>
      )}

      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-neutral-800 dark:to-neutral-700 aspect-square">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 dark:group-hover:bg-black/20 transition-all duration-500" />
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex gap-0.5 mb-1.5 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-amber-400 text-amber-400 sm:w-3 sm:h-3" />
          ))}
        </div>

        <h3 className="text-sm sm:text-lg font-bold text-amber-900 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight mb-3 sm:mb-4">
          {name}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-1.5 sm:gap-3">
          <span className="text-base sm:text-xl font-bold text-amber-700 dark:text-amber-400 shrink-0">
            {displayPrice}
          </span>
          <button
            onClick={handleBuy}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-amber-200 dark:hover:shadow-amber-900 transition-all duration-300 active:scale-95"
          >
            <ShoppingBag size={13} className="sm:w-4 sm:h-4" />
            <span>{t("productsPage.addBtn")}</span>
          </button>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}