"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onSuccess: () => void;
}

export function CashCheckoutModal({ open, onClose, items, total, onSuccess }: Props) {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!phone.trim()) { toast.error("Introdu numărul de telefon"); return; }
    if (!address.trim()) { toast.error("Introdu adresa de livrare"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address, items, total }),
      });

      if (!res.ok) throw new Error("Eroare");

      setDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setDone(false);
        setPhone("");
        setAddress("");
      }, 2500);
    } catch {
      toast.error("Eroare la trimiterea comenzii. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md px-4"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
              {done ? (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5"
                  >
                    <CheckCircle size={40} className="text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Comandă plasată!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    Am primit comanda ta. Te vom contacta la <strong>{phone}</strong> în scurt timp.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-amber-400 to-amber-500 px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-white font-bold text-lg">Comandă Cash 💵</h2>
                      <p className="text-amber-100 text-sm">Completează datele pentru livrare</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="px-6 pt-5 pb-6 space-y-4">
                    <div className="bg-amber-50 dark:bg-neutral-800 rounded-2xl p-4 space-y-1.5">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                        Sumar comandă
                      </p>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.name}
                            <span className="text-gray-400 ml-1">×{item.quantity}</span>
                          </span>
                          <span className="font-medium text-amber-700 dark:text-amber-400">{item.price}</span>
                        </div>
                      ))}
                      <div className="border-t border-amber-200 dark:border-neutral-700 pt-2 mt-2 flex justify-between font-bold">
                        <span className="text-gray-800 dark:text-white">Total</span>
                        <span className="text-amber-600 dark:text-amber-400">{total} MDL</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Număr de telefon
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-amber-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus-within:border-amber-400 transition-colors">
                        <Phone size={16} className="text-amber-400 shrink-0" />
                        <input
                          type="tel"
                          placeholder="+373 69 000 000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Adresă de livrare
                      </label>
                      <div className="flex items-start gap-3 px-4 py-3 rounded-2xl border-2 border-amber-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus-within:border-amber-400 transition-colors">
                        <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        <textarea
                          placeholder="Oraș, stradă, număr, apartament..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-300/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95"
                    >
                      {loading ? (
                        <><Loader2 size={18} className="animate-spin" /> Se trimite...</>
                      ) : (
                        "Confirmă comanda 🚚"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}