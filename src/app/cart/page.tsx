"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeItem, clearCart } = useCartStore();
  const { t } = useTranslation();

  const parsePrice = (price: string) => parseFloat(price?.replace(/[^\d.]/g, "")) || 0;
  const total = items.reduce((sum: number, item: any) => sum + parsePrice(item.price) * item.quantity, 0);
  const finalTotal = total >= 500 ? total : total + 35;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("cart.emptyTitle")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("cart.emptySubtitle")}
          </p>
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("cart.viewProducts")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la produse
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("cart.title")}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Produse ({items.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {t("cart.clearCart")}
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-amber-600 dark:text-amber-400 font-medium">
                          {item.price}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {(parsePrice(item.price) * item.quantity).toFixed(0)} MDL
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("cart.summary")}
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("cart.subtotal")}</span>
                  <span>{total.toFixed(0)} MDL</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("cart.delivery")}</span>
                  <span className={total >= 500 ? "text-green-600" : ""}>
                    {total >= 500 ? t("cart.freeDelivery") : "35 MDL"}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>{t("cart.total")}</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {finalTotal.toFixed(0)} MDL
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors">
                {t("cart.checkout")}
              </button>

              {total < 500 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                  {t("cart.freeShippingMessage")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}