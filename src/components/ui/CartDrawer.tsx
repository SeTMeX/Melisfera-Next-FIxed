"use client";

import { X, Trash2, Plus, Minus, ShoppingCart, Banknote, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CardPaymentModal } from "./CardPaymentModal";
import { CashCheckoutModal } from "./CashCheckoutModal";

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
  const [cashModalOpen, setCashModalOpen] = useState(false);

  const parsePrice = (price: string) => parseFloat(price?.replace(/[^\d.]/g, "")) || 0;
  const total = items.reduce((sum: number, item: any) => sum + parsePrice(item.price) * item.quantity, 0);
  const totalQty = items.reduce((s: number, i: any) => s + i.quantity, 0);
  const finalTotal = total >= 500 ? total : total + 35;

  return (
    <>
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
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
                <AnimatePresence>
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-48 text-center"
                    >
                      <ShoppingCart size={40} className="text-amber-300 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{t("cart.noItems")}</p>
                    </motion.div>
                  ) : (
                    items.map((item: any) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 bg-white dark:bg-neutral-900 rounded-2xl p-3 shadow-sm border border-amber-100 dark:border-neutral-800"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-amber-50">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{item.name}</p>
                          <p className="text-amber-600 dark:text-amber-400 text-sm font-bold">{item.price}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="w-6 h-6 rounded-full bg-amber-100 dark:bg-neutral-700 flex items-center justify-center hover:bg-amber-200 transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="w-6 h-6 rounded-full bg-amber-100 dark:bg-neutral-700 flex items-center justify-center hover:bg-amber-200 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* FOOTER */}
              {items.length > 0 && (
                <div className="px-4 sm:px-6 py-4 border-t border-amber-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t("cart.subtotal")}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{total.toFixed(0)} MDL</span>
                  </div>
                  {total < 500 && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("cart.shipping")}</span>
                      <span className="font-medium text-gray-800 dark:text-white">35 MDL</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-800 dark:text-white">{t("cart.total")}</span>
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {finalTotal.toFixed(0)} MDL
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-2.5">
                    {t("cart.paymentMethod")}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCashModalOpen(true)}
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
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CardPaymentModal
        open={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        total={finalTotal}
      />
      <CashCheckoutModal
        open={cashModalOpen}
        onClose={() => setCashModalOpen(false)}
        items={items}
        total={finalTotal}
        onSuccess={() => { clearCart(); onClose(); }}
      />
    </>
  );
}