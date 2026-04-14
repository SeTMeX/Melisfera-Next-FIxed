"use client";


import { BeeDecoration } from "@/components/home/BeeDecoration";
import { motion } from "framer-motion";
import { Droplets, Leaf, ShieldCheck, Award, Heart, Sun, Flower2, Mountain } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
});

export function AboutUsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#fdf8f0] dark:bg-neutral-950 relative overflow-hidden">
      <BeeDecoration className="top-32 right-[15%]" duration={20} image="/photos/mg.png" />
      <BeeDecoration className="bottom-40 left-[10%]" duration={15} reverse image="/photos/pb.png" />

      {/* HERO */}
      <section className="relative pt-16 sm:pt-24 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[200px] sm:h-[300px] bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-xs sm:text-sm font-semibold border border-amber-200 dark:border-amber-800">
              🐝 {t("about.badge")}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-amber-950 dark:text-amber-200 leading-tight mb-4 sm:mb-6"
          >
            {t("about.heroTitle")}{" "}
            <span className="text-amber-500 italic">{t("about.heroHighlight")}</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-base sm:text-lg md:text-xl text-amber-800/70 dark:text-amber-300/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t("about.heroSubtitle")}
          </motion.p>
        </div>
      </section>

      {/* MAIN STORY */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-amber-900/20">
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=900&auto=format&fit=crop"
                alt="Prisaca Melisfera"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 to-transparent" />
            </div>

            {/* floating card — ajustat pentru mobil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-white dark:bg-neutral-900 rounded-2xl p-3 sm:p-5 shadow-xl border border-amber-100 dark:border-neutral-800 max-w-[160px] sm:max-w-[200px]"
            >
              <div className="text-2xl sm:text-3xl mb-1">🍯</div>
              <p className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">{t("about.floatingCard.title")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">{t("about.floatingCard.subtitle")}</p>
            </motion.div>

            {/* badge ani */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 bg-amber-500 rounded-2xl p-3 sm:p-4 shadow-xl"
            >
              <Award size={18} className="text-white mb-1" />
              <p className="font-bold text-white text-xs">15+ {t("about.floatingBadge")}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-4 sm:space-y-5 mt-6 lg:mt-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2">{t("about.storyLabel")}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-950 dark:text-amber-200 leading-tight">
                {t("about.storyTitle")}
              </h2>
              <div className="flex gap-1.5 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-1 rounded-full bg-amber-400 ${i === 0 ? "w-10" : "w-3"}`} />
                ))}
              </div>
            </div>
            <p className="text-base sm:text-lg text-amber-900 dark:text-amber-300 font-medium leading-relaxed border-l-4 border-amber-400 pl-4 sm:pl-5 italic">
              {t("about.storyQuote")}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
              {t("about.storyBody1")}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
              {t("about.storyBody2")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* VALUES CARDS */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2">{t("about.valuesLabel")}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-950 dark:text-amber-200">{t("about.valuesTitle")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Droplets, key: "natural", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600", emoji: "💧" },
              { icon: Leaf, key: "sustainable", color: "bg-green-50 dark:bg-green-900/20 text-green-600", emoji: "🌿" },
              { icon: ShieldCheck, key: "quality", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600", emoji: "✅" },
            ].map(({ icon: Icon, key, color, emoji }, i) => (
              <motion.div
                key={key}
                {...fadeUp(0.1 * i)}
                className="group relative bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-amber-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">{emoji}</div>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${color} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-amber-950 dark:text-amber-200 mb-2 sm:mb-3">
                  {t(`about.values.${key}.title`)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {t(`about.values.${key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NATURE FEATURES */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-amber-900 dark:bg-amber-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-300 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{t("about.natureTitle")}</h2>
            <p className="text-amber-300/80 mt-3 max-w-xl mx-auto text-sm sm:text-base">{t("about.natureSubtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Flower2, key: "wildflowers" },
              { icon: Mountain, key: "hills" },
              { icon: Sun, key: "pure" },
              { icon: Heart, key: "passion" },
            ].map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                {...fadeUp(0.1 * i)}
                className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                <Icon size={28} className="text-amber-300 mb-2 sm:mb-3" />
                <h4 className="font-bold text-white text-xs sm:text-sm">{t(`about.nature.${key}.title`)}</h4>
                <p className="text-amber-300/70 text-xs mt-1 hidden sm:block">{t(`about.nature.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-3xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-neutral-900 p-6 sm:p-10 md:p-12 text-center border border-amber-200 dark:border-amber-800 shadow-lg"
          >
            <div className="text-5xl sm:text-7xl text-amber-300 dark:text-amber-700 font-serif leading-none mb-3 sm:mb-4">&rdquo;</div>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-950 dark:text-amber-200 leading-relaxed mb-4 sm:mb-6">
              {t("about.quote")}
            </blockquote>
            <cite className="text-amber-700 dark:text-amber-400 font-semibold not-italic text-sm sm:text-base">— {t("about.quoteAuthor")}</cite>
            <div className="absolute bottom-4 right-6 text-4xl sm:text-5xl opacity-20">🐝</div>
          </motion.div>
        </div>
      </section>

      {/* STATS + IMAGE */}
      <section className="py-8 sm:py-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          <motion.div {...fadeUp(0)} className="space-y-6 sm:space-y-8">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2">{t("about.numbersLabel")}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-950 dark:text-amber-200">{t("about.numbersTitle")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: "15+", key: "years", emoji: "🕐" },
                { value: "500+", key: "clients", emoji: "🤝" },
                { value: "100%", key: "natural", emoji: "🌱" },
                { value: "8+", key: "products", emoji: "🍯" },
              ].map(({ value, key, emoji }, i) => (
                <motion.div
                  key={key}
                  {...fadeUp(0.1 * i)}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-amber-100 dark:border-neutral-800 shadow-sm"
                >
                  <div className="text-xl sm:text-2xl mb-1">{emoji}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">{value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t(`about.stats.${key}`)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl shadow-amber-900/20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=800&auto=format&fit=crop"
              alt="Fagure cu miere"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 to-transparent" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;