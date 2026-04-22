"use client";

import { useState } from "react";
import { ProductCard } from "@/components/home/ProductCard";
import { BeeDecoration } from "@/components/home/BeeDecoration";
import { ProductModal } from "@/components/ui/ProductModal";
import { products, type Product } from "@/data/products";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ProducePage() {
  const { t, i18n } = useTranslation();
  const lang: "ro" | "en" | "ru" =
    i18n.language === "en" ? "en" : i18n.language === "ru" ? "ru" : "ro";
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const naturalNote =
    lang === "ro" ? "Toate produsele sunt 100% naturale, neprocesate termic și fără aditivi"
    : lang === "ru" ? "Все продукты 100% натуральные, без термической обработки и без добавок"
    : "All products are 100% natural, unheated and without additives";

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black">

      <div className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 dark:from-amber-500 dark:via-amber-600 dark:to-amber-700 pt-32 pb-28 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-2xl" />

        <BeeDecoration className="top-8 left-[5%]" duration={22} image="/photos/mg.png" />
        <BeeDecoration className="top-8 right-[8%]" duration={19} reverse image="/photos/pb.png" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block py-1.5 px-5 rounded-full bg-white/25 text-white font-medium text-sm mb-6 border border-white/40 backdrop-blur-sm">
              🍯 Melisfera
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 text-white drop-shadow-md">
              {t("productsPage.title")}
            </h1>
            <p className="text-lg text-amber-50 max-w-xl mx-auto leading-relaxed">
              {t("productsPage.subtitle")}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 70" className="w-full fill-amber-50 dark:fill-black" preserveAspectRatio="none">
            <path d="M0,35 C320,70 640,0 960,40 C1120,60 1300,20 1440,35 L1440,70 L0,70 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <ProductCard
                id={product.id}
                name={product.name[lang]}
                image={product.images[0]}
                imageColor={product.imageColor}
                price={product.price}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border-t border-amber-100 dark:border-neutral-800 py-10 text-center">
        <p className="text-amber-700 dark:text-amber-400 text-base font-medium">
          🐝 {naturalNote}
        </p>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default ProducePage;