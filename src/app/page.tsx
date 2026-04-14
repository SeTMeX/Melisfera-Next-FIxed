"use client";

import Link from "next/link";
import { ArrowRight, Droplets, Leaf, ShieldCheck } from "lucide-react";
import { BeeDecoration } from "@/components/home/BeeDecoration";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center">
        <img
          src="/photos/image.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-amber-200/45 dark:bg-black/40 z-[1]" />

        <BeeDecoration className="top-1/4 right-[10%]" duration={25} image="/photos/mg.png" />
        <BeeDecoration className="bottom-1/3 left-[5%]" duration={18} reverse image="/photos/pb.png" />

        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/70 text-amber-800 font-medium text-xs sm:text-sm mb-4 sm:mb-6 border border-amber-200">
              {t("homePage.badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6 text-amber-950 dark:text-amber-950 drop-shadow-sm">
              {t("homePage.title")}{" "}
              <span className="text-amber-600">Melisfera</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-amber-950 dark:text-amber-950 mb-7 sm:mb-10 leading-relaxed max-w-xl drop-shadow-sm">
              {t("homePage.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/produse"
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {t("homePage.buyBtn")} <ArrowRight size={18} />
              </Link>
              <Link
                href="/despre-noi"
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-semibold text-amber-900 bg-white/80 border-2 border-amber-300 hover:border-amber-500 transition-all duration-300 text-center text-sm sm:text-base"
              >
                {t("homePage.storyBtn")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DE CE MELISFERA */}
      <section className="py-14 sm:py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-amber-900 dark:text-amber-400">
              {t("homePage.whyTitle")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{t("homePage.whySubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Droplets, color: "amber", titleKey: "homePage.natural", descKey: "homePage.naturalDesc" },
              { icon: Leaf, color: "green", titleKey: "homePage.sustainable", descKey: "homePage.sustainableDesc" },
              { icon: ShieldCheck, color: "amber", titleKey: "homePage.quality", descKey: "homePage.qualityDesc" },
            ].map(({ icon: Icon, color, titleKey, descKey }) => (
              <motion.div
                key={titleKey}
                whileHover={{ y: -5 }}
                className="bg-amber-50 dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-amber-100 dark:border-neutral-800 text-center"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto ${
                  color === "green"
                    ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                    : "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                } rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-amber-900 dark:text-amber-300">{t(titleKey)}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-24 bg-amber-500 dark:bg-amber-800 text-center px-4">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">{t("homePage.ctaTitle")}</h2>
        <p className="text-amber-100 text-base sm:text-lg mb-7 sm:mb-10">{t("homePage.ctaSubtitle")}</p>
        <Link
          href="/produse"
          className="inline-flex items-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-semibold text-amber-600 dark:text-amber-800 bg-white hover:bg-amber-50 shadow-lg transition-all text-sm sm:text-base"
        >
          {t("homePage.ctaBtn")} <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
