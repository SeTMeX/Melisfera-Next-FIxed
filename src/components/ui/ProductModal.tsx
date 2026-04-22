"use client";

import { X, ShoppingBag, Star, Check, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/stores/cartStore";
import useFavoritesStore from "@/stores/useFavoritesStore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { Product } from "@/data/products";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

type Variant = {
  label: string;
  price: string;
  images?: string[];
};

const VARIANTS: Record<string, Variant[]> = {
  salcam: [
    {
      label: "0.5 kg",
      price: "80 MDL",
      images: ["/photos/salcam05kg01.png", "/photos/salcam05kg02.jpeg"],
    },
    {
      label: "1 kg",
      price: "150 MDL",
      images: ["/photos/salcam1kg01.jpeg", "/photos/salcam1kg02.jpeg"],
    },
    {
      label: "5 kg",
      price: "600 MDL",
      images: ["/photos/salcam5kg01.png", "/photos/salcam5kg02.png", "/photos/salcam5kg03.png"],
    },
  ],
  tei: [
    {
      label: "0.5 kg",
      price: "70 MDL",
      images: ["/photos/tei05kg01.png", "/photos/tei05kg02.png", "/photos/tei05kg03.png"],
    },
    {
      label: "1 kg",
      price: "130 MDL",
      images: ["/photos/tei1kg02.png", "/photos/tei1kg03.jpeg", "/photos/tei1kg02.jpeg"],
    },
    {
      label: "5 kg",
      price: "500 MDL",
      images: ["/photos/tei5kg01.jpeg", "/photos/tei5kg02.jpeg", "/photos/tei5kg03.jpeg"],
    },
  ],
  camp: [
    {
      label: "0.5 kg",
      price: "70 MDL",
      images: ["/photos/flori05kg02.jpeg", "/photos/flori05kg03.jpeg"],
    },
    {
      label: "1 kg",
      price: "130 MDL",
    },
    {
      label: "5 kg",
      price: "500 MDL",
    },
  ],
  cadou: [
    {
      label: "Mic",
      price: "300 MDL",
      images: ["/photos/cadoumic01.jpeg", "/photos/cadoumic02.jpeg", "/photos/cadoumic03.jpeg"],
    },
    {
      label: "Mare",
      price: "550 MDL",
      images: ["/photos/cadoumare01.png", "/photos/cadoumare02.png", "/photos/cadoumare03.png"],
    },
  ],
  polen: [
    {
      label: "100g",
      price: "50 MDL",
      images: ["/photos/polen01.png", "/photos/polen02.png", "/photos/polen03.png"],
    },
    {
      label: "200g",
      price: "100 MDL",
      images: ["/photos/polen01.png", "/photos/polen02.png", "/photos/polen03.png"],
    },
  ],
  propolis: [
    { label: "Lichid", price: "50 MDL" },
    { label: "Solid",  price: "130 MDL" },
  ],
};

function getVariants(product: Product): Variant[] | null {
  const name = (product.name.ro ?? "").toLowerCase();
  if (name.includes("salcâm") || name.includes("salcam")) return VARIANTS.salcam;
  if (name.includes("tei"))                                return VARIANTS.tei;
  if (name.includes("câmp") || name.includes("camp"))      return VARIANTS.camp;
  if (name.includes("cadou") || name.includes("gift") || name.includes("pachet")) return VARIANTS.cadou;
  if (name.includes("polen"))                              return VARIANTS.polen;
  if (name.includes("propolis"))                           return VARIANTS.propolis;
  return null;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { i18n } = useTranslation();
  const lang: "ro" | "en" | "ru" =
    i18n.language === "en" ? "en" : i18n.language === "ru" ? "ru" : "ro";
  const addItem = useCartStore((s: any) => s.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const liked = product ? isFavorite(product.id) : false;
  const variants = product ? getVariants(product) : null;
  const displayPrice = selectedVariant?.price ?? product?.price ?? "";

  const displayImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product?.images ?? [];

  const prevProductIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevProductIdRef.current !== product?.id) {
      const v = product ? getVariants(product) : null;
      setSelectedVariant(v && v.length > 0 ? v[0] : null);
      setActiveImg(0);
      prevProductIdRef.current = product?.id;
    }
  }, [product?.id]);

  const T = {
    selectSize:
      lang === "ro" ? "Selectează o mărime înainte de a adăuga în coș"
      : lang === "ru" ? "Выберите размер перед добавлением в корзину"
      : "Please select a size first",
    inStock:
      lang === "ro" ? "În stoc"
      : lang === "ru" ? "В наличии"
      : "In stock",
    chooseSize:
      lang === "ro" ? "Alege mărimea"
      : lang === "ru" ? "Выберите размер"
      : "Choose size",
    description:
      lang === "ro" ? "Descriere"
      : lang === "ru" ? "Описание"
      : "Description",
    details:
      lang === "ro" ? "Detalii"
      : lang === "ru" ? "Детали"
      : "Details",
    addToCart:
      lang === "ro" ? "Adaugă în coș"
      : lang === "ru" ? "Добавить в корзину"
      : "Add to cart",
  };

  const msgAddedCart = (n: string) =>
    lang === "ro" ? `"${n}" adăugat în coș 🍯`
    : lang === "ru" ? `"${n}" добавлено в корзину 🍯`
    : `"${n}" added to cart 🍯`;

  const msgRemovedFav = (n: string) =>
    lang === "ro" ? `"${n}" eliminat din favorite`
    : lang === "ru" ? `"${n}" удалено из избранного`
    : `"${n}" removed from favorites`;

  const msgAddedFav = (n: string) =>
    lang === "ro" ? `"${n}" adăugat la favorite ❤️`
    : lang === "ru" ? `"${n}" добавлено в избранное ❤️`
    : `"${n}" added to favorites ❤️`;

  const handleSelectVariant = (v: Variant) => {
    setSelectedVariant(v);
    setActiveImg(0);
  };

  const handlePrev = () =>
    setActiveImg((p) => (p === 0 ? displayImages.length - 1 : p - 1));
  const handleNext = () =>
    setActiveImg((p) => (p === displayImages.length - 1 ? 0 : p + 1));

  const handleAdd = () => {
    if (!product) return;
    if (variants && !selectedVariant) {
      toast.error(T.selectSize);
      return;
    }
    addItem({
      id: product.id,
      name: product.name[lang],
      image: displayImages[0] ?? product.images[0],
      imageColor: product.imageColor,
      price: displayPrice,
    });
    toast.success(msgAddedCart(product.name[lang]));
    onClose();
  };

  const handleFavorite = () => {
    if (!product) return;
    toggleFavorite(product);
    toast.success(
      liked ? msgRemovedFav(product.name[lang]) : msgAddedFav(product.name[lang])
    );
  };

  return (
    <AnimatePresence onExitComplete={() => setActiveImg(0)}>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 210 }}
            className="fixed inset-0 sm:inset-4 md:inset-8 lg:inset-12 z-50 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[100dvh] sm:max-h-[92dvh] bg-white dark:bg-neutral-900"
          >
            {/* STÂNGA — Imagine */}
            <div className="relative md:w-[48%] bg-neutral-100 dark:bg-neutral-800 flex flex-col h-[46svh] md:h-auto">
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${selectedVariant?.label ?? "default"}-${activeImg}`}
                    src={displayImages[activeImg]}
                    alt={product.name[lang]}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.28 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {product.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-white text-xs font-bold shadow-lg z-10">
                    {product.badge[lang]}
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 md:hidden w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white z-10 transition-colors"
                >
                  <X size={17} />
                </button>

                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
                    >
                      <ChevronLeft size={18} className="text-neutral-800 dark:text-white" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
                    >
                      <ChevronRight size={18} className="text-neutral-800 dark:text-white" />
                    </button>
                  </>
                )}

                {displayImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {displayImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`rounded-full transition-all duration-300 ${
                          activeImg === i ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {displayImages.length > 1 && (
                <div className="flex gap-2 p-2.5 bg-white/80 dark:bg-black/30 backdrop-blur-sm overflow-x-auto shrink-0">
                  {displayImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                        activeImg === i
                          ? "border-amber-400 scale-105 shadow-md"
                          : "border-transparent opacity-50 hover:opacity-90"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DREAPTA — Info */}
            <div className="md:w-[52%] flex flex-col overflow-y-auto overscroll-contain flex-1">

              {/* Header */}
              <div className="flex items-start justify-between p-4 sm:p-6 pb-3">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">(48)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-200 leading-tight">
                    {product.name[lang]}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    onClick={handleFavorite}
                    whileTap={{ scale: 0.88 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      liked
                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500"
                        : "bg-gray-100 dark:bg-neutral-800 border-transparent text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    }`}
                  >
                    <Heart size={17} className={liked ? "fill-red-500" : ""} />
                  </motion.button>

                  <button
                    onClick={onClose}
                    className="hidden md:flex w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Conținut */}
              <div className="px-4 sm:px-6 space-y-4 flex-1">

                {/* Preț */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-500 dark:text-amber-400">
                    {displayPrice}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold border border-green-200 dark:border-green-800">
                    {T.inStock}
                  </span>
                </div>

                {/* Selector mărimi */}
                {variants && (
                  <div>
                    <h3 className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-2.5">
                      {T.chooseSize}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v) => (
                        <motion.button
                          key={v.label}
                          onClick={() => handleSelectVariant(v)}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                            selectedVariant?.label === v.label
                              ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 shadow-md shadow-amber-100 dark:shadow-amber-900/20"
                              : "border-amber-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:border-amber-300 dark:hover:border-amber-700"
                          }`}
                        >
                          <span>{v.label}</span>
                          <span className="ml-2 text-amber-500 dark:text-amber-400">{v.price}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px bg-amber-100 dark:bg-neutral-700/60" />

                <div>
                  <h3 className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-2">
                    {T.description}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description[lang]}
                  </p>
                </div>

                <div className="h-px bg-amber-100 dark:bg-neutral-700/60" />

                <div>
                  <h3 className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-3">
                    {T.details}
                  </h3>
                  <ul className="space-y-2.5">
                    {product.details[lang].map((detail, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 pt-3 border-t border-amber-100 dark:border-neutral-700/60 mt-3 shrink-0 flex gap-3">
                <motion.button
                  onClick={handleFavorite}
                  whileTap={{ scale: 0.97 }}
                  className={`py-3.5 sm:py-4 px-4 rounded-2xl font-bold transition-all border flex items-center justify-center gap-2 text-sm sm:text-base ${
                    liked
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500"
                      : "bg-gray-100 dark:bg-neutral-800 border-transparent text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                  }`}
                >
                  <Heart size={18} className={liked ? "fill-red-500" : ""} />
                </motion.button>

                <motion.button
                  onClick={handleAdd}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3.5 sm:py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-300/30 dark:shadow-amber-900/30 flex items-center justify-center gap-2.5 text-sm sm:text-base"
                >
                  <ShoppingBag size={19} />
                  {T.addToCart}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}