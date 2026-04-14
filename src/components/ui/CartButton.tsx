"use client";

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore, selectTotalItems } from "@/stores/cartStore";

interface CartButtonProps {
  onClick?: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const totalItems = useCartStore(selectTotalItems);

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-xl shadow-amber-300/40 dark:shadow-amber-900/50 flex items-center justify-center transition-colors duration-300"
      aria-label="Coș de cumpărături"
    >
      <ShoppingCart size={22} />
      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-amber-600 text-xs font-bold flex items-center justify-center border-2 border-amber-400 shadow-sm"
        >
          {totalItems > 9 ? "9+" : totalItems}
        </motion.span>
      )}
    </motion.button>
  );
}
