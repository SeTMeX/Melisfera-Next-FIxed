"use client";


import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const images = [
  { id: 1, url: "https://images.unsplash.com/photo-1471943311424-646960669fbc?q=80&w=800", span: "md:col-span-2 md:row-span-2" },
  { id: 2, url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800", span: "md:col-span-1 md:row-span-1" },
  { id: 3, url: "https://images.unsplash.com/photo-1587049352847-81a56d773c1c?q=80&w=800", span: "md:col-span-1 md:row-span-1" },
  { id: 4, url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800", span: "md:col-span-1 md:row-span-2" },
  { id: 5, url: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=800", span: "md:col-span-2 md:row-span-1" },
  { id: 6, url: "https://images.unsplash.com/photo-1618914240786-3b5c3f0b1c08?q=80&w=800", span: "md:col-span-1 md:row-span-1" },
];

export function GaleriePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-amber-900 dark:text-amber-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("gallery.title")}
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t("gallery.subtitle")}
          </motion.p>
        </div>

        {/* Mobile: simple 2-col grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {images.map((img) => (
            <motion.div
              key={img.id}
              className="relative overflow-hidden rounded-2xl group cursor-pointer bg-amber-50 dark:bg-neutral-900 aspect-square"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: img.id * 0.06 }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src={img.url}
                alt="Galerie apicolă"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Desktop: bento grid */}
        <motion.div
          className="hidden md:grid md:grid-cols-4 auto-rows-[220px] lg:auto-rows-[250px] gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {images.map((img) => (
            <motion.div
              key={img.id}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer bg-amber-50 dark:bg-neutral-900 ${img.span}`}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300" />
              <img
                src={img.url}
                alt="Galerie apicolă"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default GaleriePage;