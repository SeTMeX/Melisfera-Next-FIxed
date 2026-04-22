"use client";

import { useState } from "react";
import { CartButton } from "@/components/ui/CartButton";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { SyncProvider } from "@/components/providers/SyncProvider";

export function GlobalProviders() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <SyncProvider />
      <CartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--toast-bg, #fffbeb)",
            border: "1px solid #fde68a",
            color: "#78350f",
            borderRadius: "16px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 8px 32px rgba(180,120,0,0.12)",
          },
          classNames: {
            error: "!bg-red-50 !border-red-200 !text-red-800",
            success: "!bg-amber-50 !border-amber-300 !text-amber-900",
            info: "!bg-blue-50 !border-blue-200 !text-blue-800",
          },
        }}
        richColors={false}
        closeButton
      />
    </>
  );
}