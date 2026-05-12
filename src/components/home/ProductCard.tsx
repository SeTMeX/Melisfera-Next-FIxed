"use client";

import { ShoppingBag, Star, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import useFavoritesStore from "@/stores/useFavoritesStore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { Product } from "@/data/products";

type Variant = {
  label: string;
  price: string;
  images?: string[];
};

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
    
    // Get variants similar to ProductModal logic
    const getVariants = (product: Product): Variant[] | null => {
      const name = (product.name.ro ?? "").toLowerCase();
      const VARIANTS: Record<string, Variant[]> = {
        salcam: [
          { label: "0.5 kg", price: "80 MDL" },
          { label: "1 kg", price: "150 MDL" },
          { label: "5 kg", price: "600 MDL" },
        ],
        tei: [
          { label: "0.5 kg", price: "70 MDL" },
          { label: "1 kg", price: "130 MDL" },
          { label: "5 kg", price: "500 MDL" },
        ],
        camp: [
          { label: "0.5 kg", price: "70 MDL" },
          { label: "1 kg", price: "130 MDL" },
          { label: "5 kg", price: "500 MDL" },
        ],
        cadou: [
          { label: "Mic", price: "300 MDL" },
          { label: "Mare", price: "550 MDL" },
        ],
        polen: [
          { label: "100g", price: "50 MDL" },
          { label: "200g", price: "100 MDL" },
        ],
        propolis: [
          { label: "Lichid", price: "50 MDL" },
          { label: "Solid", price: "130 MDL" },
        ],
        tuica: [
          { label: "Țuică de miere", price: "180 MDL", images: ["/photos/tuica1.png", "/photos/22tuica.png", "/photos/tuica3.png"] },
        ],
      };
      
      if (name.includes("salcâm") || name.includes("salcam")) return VARIANTS.salcam;
      if (name.includes("tei")) return VARIANTS.tei;
      if (name.includes("câmp") || name.includes("camp")) return VARIANTS.camp;
      if (name.includes("cadou") || name.includes("gift") || name.includes("pachet")) return VARIANTS.cadou;
      if (name.includes("polen")) return VARIANTS.polen;
      if (name.includes("propolis")) return VARIANTS.propolis;
      if (name.includes("tuică") || name.includes("tuica")) return VARIANTS.tuica;
      return null;
    };
    
    let finalPrice = displayPrice;
    let finalName = name;
    let finalImage = imageSrc;
    
    if (product) {
      const variants = getVariants(product);
      if (variants && variants.length > 1) {
        // Select the second variant (index 1) like in ProductModal
        const selectedVariant = variants[1];
        finalPrice = selectedVariant.price;
        finalName = `${name} - ${selectedVariant.label}`;
        
        // Use variant images if available
        if (selectedVariant.images && selectedVariant.images.length > 0) {
          finalImage = selectedVariant.images[0];
        }
      }
    }
    
    addItem({ id, name: finalName, image: finalImage, imageColor, price: finalPrice });
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
      className="group relative bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-amber-100 dark:border-neutral-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full cursor-pointer"
    >
      {product && (
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-sm border shadow-sm transition-all duration-300 ${
            liked
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white/90 dark:bg-neutral-800/90 border-amber-200 dark:border-neutral-700 text-gray-400 hover:text-red-400"
          }`}
        >
          <Heart size={10} className={liked ? "fill-red-500" : ""} />
        </button>
      )}

      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-neutral-800 dark:to-neutral-700 aspect-[4/3] sm:aspect-square">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 dark:group-hover:bg-black/20 transition-all duration-500" />
      </div>

      <div className="p-2.5 sm:p-5 flex flex-col flex-grow">
        <div className="flex gap-0.5 mb-1 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={8} className="fill-amber-400 text-amber-400 sm:w-3 sm:h-3" />
          ))}
        </div>

        <h3 className="text-xs sm:text-lg font-bold text-amber-900 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight mb-2 sm:mb-4 line-clamp-2">
          {name}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-1 sm:gap-3">
          <span className="text-sm sm:text-xl font-bold text-amber-700 dark:text-amber-400 shrink-0">
            {displayPrice}
          </span>
          <button
            onClick={handleBuy}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-amber-200 dark:hover:shadow-amber-900 transition-all duration-300 active:scale-95"
          >
            <ShoppingBag size={11} className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">{t("productsPage.addBtn")}</span>
          </button>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}