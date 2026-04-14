"use client";

import { X, Trash2, Plus, Minus, ShoppingCart, Banknote, CreditCard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CardPaymentModal } from "./CardPaymentModal";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const parsePrice = (price: string) => parseFloat(price?.replace(/[^\d.]/g, "")) || 0;
  const total = items.reduce((sum: number, item: any) => sum + parsePrice(item.price) * item.quantity, 0);
  const totalQty = items.reduce((s: number, i: any) => s + i.quantity, 0);
  const finalTotal = total >= 500 ? total : total + 35;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-md z-50 flex flex-col bg-amber-50 dark:bg-neutral-950 overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative px-4 sm:px-6 pt-5 pb-4 overflow-hidden bg-gradient-to-br from-amber-400 via-amber-400 to-amber-500 shrink-0">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-20 bg-white/5 blur-xl" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <ShoppingCart size={17} className="text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{t("cart.title")}</h2>
                  </div>
                  <p className="text-amber-100 text-sm ml-10">
                    {totalQty === 0 ? t("cart.noItems") : t("cart.itemCount", { count: totalQty })}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {items.length > 0 && (
                <div className="relative z-10 mt-4">
                  <div className="flex justify-between text-xs text-amber-100 mb-1.5">
                    <span>{t("cart.orderProgress")}</span>
                    <span>{Math.min(total, 500).toFixed(0)} / {t("cart.freeShipping")}</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((total / 500) * 100, 100)}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-4 pb-16"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-100 dark:bg-neutral-800 flex items-center justify-center text-4xl sm:text-5xl">
                      🍯
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-amber-900 dark:text-amber-400 mb-1">
                        {t("cart.emptyTitle")}
                      </p>
                      <p className="text-sm text-gray-400">{t("cart.emptySubtitle")}</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-white font-semibold text-sm transition-colors"
                    >
                      {t("cart.viewProducts")} <ArrowRight size={15} />
                    </button>
                  </motion.div>
                ) : (
                  items.map((item: any, index: number) => (
                    <motion.div
                      key={item.id || index}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center gap-3 sm:gap-4 bg-white dark:bg-neutral-900 rounded-2xl p-3 sm:p-4 border border-amber-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-amber-100 dark:bg-neutral-800 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm leading-tight truncate mb-0.5">
                          {item.name}
                        </p>
                        <p className="text-amber-500 dark:text-amber-400 font-bold text-sm">{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-neutral-700 hover:bg-amber-200 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors"
                          >
                            <Minus size={12} className="text-amber-700 dark:text-white" />
                          </button>
                          <span className="text-sm font-bold text-amber-900 dark:text-white w-6 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-neutral-700 hover:bg-amber-200 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors"
                          >
                            <Plus size={12} className="text-amber-700 dark:text-white" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
                          {(parsePrice(item.price) * item.quantity).toFixed(0)} MDL
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-400 hover:text-red-500 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <>
                <CardPaymentModal
                  open={cardModalOpen}
                  onClose={() => setCardModalOpen(false)}
                  total={finalTotal}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 sm:px-6 py-4 sm:py-5 bg-white dark:bg-neutral-900 border-t border-amber-100 dark:border-neutral-800 shadow-[0_-6px_30px_rgba(0,0,0,0.06)] shrink-0"
                >
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-sm text-gray-400 dark:text-gray-500">
                      <span>{t("cart.subtotal", { count: totalQty })}</span>
                      <span>{total.toFixed(0)} MDL</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 dark:text-gray-500">
                      <span>{t("cart.delivery")}</span>
                      <span className={total >= 500 ? "text-green-500 font-semibold" : ""}>
                        {total >= 500 ? t("cart.freeDelivery") : "35 MDL"}
                      </span>
                    </div>
                    <div className="h-px bg-amber-100 dark:bg-neutral-800 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-900 dark:text-white">{t("cart.total")}</span>
                      <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {finalTotal.toFixed(0)} MDL
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-2.5">
                    {t("cart.paymentMethod")}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        toast.success("Comanda a fost trimisă curierului 🚚", {
                          description: "Vei fi contactat în scurt timp.",
                        });
                        clearCart();
                        onClose();
                      }}
                      className="flex flex-col items-center gap-1.5 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm text-white bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-300/40 hover:shadow-amber-400/60 active:scale-95 transition-all"
                    >
                      <Banknote size={20} />
                      {t("cart.cashPayment")}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCardModalOpen(true)}
                      className="flex flex-col items-center gap-1.5 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm bg-gray-100 text-gray-800 border border-gray-200 shadow-md dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                    >
                      <CreditCard size={20} />
                      {t("cart.cardPayment")}
                    </motion.button>
                  </div>

                  <button
                    onClick={clearCart}
                    className="w-full py-2 rounded-xl text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={12} /> {t("cart.clearCart")}
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}