"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CheckCircle, Loader2, CreditCard, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/stores/cartStore";

interface CardPaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
}

type PayState = "idle" | "processing" | "success";

function detectCardType(num: string): "visa" | "mastercard" | "amex" | "unknown" {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}

const CardLogo = ({ type }: { type: ReturnType<typeof detectCardType> }) => {
  if (type === "visa")
    return <span className="text-white font-bold italic text-sm tracking-wider">VISA</span>;
  if (type === "mastercard")
    return (
      <div className="flex">
        <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
        <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-90 -ml-2.5" />
      </div>
    );
  if (type === "amex")
    return <span className="text-white font-bold text-xs tracking-widest">AMEX</span>;
  return <span className="text-white/30 font-mono text-xs">CARD</span>;
};

export function CardPaymentModal({ open, onClose, total }: CardPaymentModalProps) {
  const { t } = useTranslation();
  const clearCart = useCartStore((s: any) => s.clearCart);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [payState, setPayState] = useState<PayState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardType = detectCardType(number);
  const years = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() + i);
  const months = [
    t("payment.months.jan"), t("payment.months.feb"), t("payment.months.mar"),
    t("payment.months.apr"), t("payment.months.may"), t("payment.months.jun"),
    t("payment.months.jul"), t("payment.months.aug"), t("payment.months.sep"),
    t("payment.months.oct"), t("payment.months.nov"), t("payment.months.dec"),
  ];

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(" ") || "";
  };

  const displayNumber = formatCardNumber(number) || "•••• •••• •••• ••••";

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = t("payment.errors.name");
    if (number.replace(/\s/g, "").length < 16) e.number = t("payment.errors.number");
    const now = new Date();
    const expDate = new Date(year, month - 1);
    if (expDate < new Date(now.getFullYear(), now.getMonth())) e.expiry = t("payment.errors.expiry");
    if (cvv.length < 3) e.cvv = t("payment.errors.cvv");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ✅ SINGURA SCHIMBARE — handlePay cu Stripe real
  const handlePay = async () => {
    if (!validate()) return;
    setPayState("processing");

    try {
      // Pasul 1: Trimite datele cardului direct la Stripe (nu trec prin serverul tău)
      const formData = new URLSearchParams();
      formData.append("card[number]", number.replace(/\s/g, ""));
      formData.append("card[exp_month]", month.toString());
      formData.append("card[exp_year]", year.toString());
      formData.append("card[cvc]", cvv);
      formData.append("card[name]", name);

      const stripeRes = await fetch("https://api.stripe.com/v1/tokens", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const stripeData = await stripeRes.json();

      if (stripeData.error) {
        setErrors({ number: stripeData.error.message });
        setPayState("idle");
        return;
      }

      // stripeData.id = "tok_xxxx" — token sigur, fără date reale de card

      // Pasul 2: Trimite tokenul la backend-ul tău pentru a procesa plata
      const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
        },
        body: JSON.stringify({
          token: stripeData.id,
          amount: total,
        }),
      });

      if (!payRes.ok) {
        const err = await payRes.json().catch(() => ({}));
        setErrors({ number: err.message || t("payment.errors.number") });
        setPayState("idle");
        return;
      }

      // Succes
      setPayState("success");
      await new Promise((r) => setTimeout(r, 1800));
      clearCart();
      onClose();
      setPayState("idle");
      setName("");
      setNumber("");
      setCvv("");
      setMonth(1);
      setYear(new Date().getFullYear());
      setErrors({});

    } catch {
      setErrors({ number: "Eroare de conexiune. Încearcă din nou." });
      setPayState("idle");
    }
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
      errors[field]
        ? "border-red-400 dark:border-red-600 focus:ring-red-300"
        : "border-gray-200 dark:border-neutral-700 focus:ring-amber-400 focus:border-amber-400"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={payState === "idle" ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4"
          >
            <div className="relative bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md overflow-hidden max-h-[95dvh] sm:max-h-[90dvh] flex flex-col border border-gray-100 dark:border-neutral-800">

              {/* SUCCESS STATE */}
              <AnimatePresence>
                {payState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-10 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center gap-5 px-8 rounded-3xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                    >
                      <CheckCircle size={44} className="text-green-500" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {t("payment.successTitle")}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("payment.successMsg")}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-amber-500">{total} MDL</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HEADER */}
              <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 shrink-0">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-amber-400/10 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-48 h-12 bg-white/5 blur-xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <CreditCard size={17} className="text-amber-400" />
                      <h3 className="text-white font-bold text-base sm:text-lg">
                        {t("payment.cardTitle")}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {t("payment.cardTotal")}:{" "}
                      <span className="text-amber-400 font-bold">{total} MDL</span>
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={payState !== "idle"}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-40"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto overscroll-contain px-5 py-5 space-y-5 flex-1">

                {/* 3D CARD PREVIEW */}
                <div className="flex justify-center" style={{ perspective: "1000px" }}>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      height: "168px",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
                    }}
                  >
                    {/* FAȚĂ */}
                    <div
                      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                      className="absolute inset-0 rounded-2xl p-5 shadow-2xl flex flex-col justify-between overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 rounded-2xl" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent rounded-2xl" />
                      <div className="relative flex justify-between items-center">
                        <div className="w-9 h-6 rounded bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                          <div className="w-5 h-3 rounded-sm border border-amber-600/40 bg-amber-400/60" />
                        </div>
                        <CardLogo type={cardType} />
                      </div>
                      <div className="relative">
                        <p className="text-white font-mono text-sm tracking-[0.2em] mb-3 opacity-90 drop-shadow">
                          {displayNumber}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">
                              {t("payment.cardHolder")}
                            </p>
                            <p className="text-white text-xs font-semibold tracking-wider truncate max-w-[150px] drop-shadow">
                              {name || t("payment.fullName")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">
                              {t("payment.expires")}
                            </p>
                            <p className="text-white text-xs font-semibold drop-shadow">
                              {month.toString().padStart(2, "0")}/{(year % 100).toString().padStart(2, "0")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SPATE */}
                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                      className="absolute inset-0 rounded-2xl shadow-2xl flex flex-col justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 rounded-2xl" />
                      <div className="relative">
                        <div className="w-full h-9 bg-black/50 mb-4" />
                        <div className="px-5">
                          <div className="bg-white/90 rounded h-8 flex items-center px-3 mb-3">
                            <div className="flex-1 h-0.5 bg-gray-300" />
                          </div>
                          <div className="text-right">
                            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1">CVV / CVC</p>
                            <div className="inline-block bg-white/10 rounded-lg px-4 py-1.5 text-white font-mono text-sm tracking-widest">
                              {cvv || "•••"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORM */}
                <div className="space-y-3">
                  {/* Nume */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                      {t("payment.cardNameLabel")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("payment.cardName")}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value.toUpperCase());
                        if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                      }}
                      className={inputCls("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Număr card */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                      {t("payment.cardNumberLabel")}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      value={formatCardNumber(number)}
                      maxLength={19}
                      onChange={(e) => {
                        setNumber(e.target.value.replace(/\s/g, ""));
                        if (errors.number) setErrors((p) => ({ ...p, number: "" }));
                      }}
                      className={`${inputCls("number")} font-mono tracking-widest`}
                    />
                    {errors.number && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.number}
                      </p>
                    )}
                  </div>

                  {/* Lună / An / CVV */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                        {t("payment.month")}
                      </label>
                      <select
                        value={month}
                        onChange={(e) => {
                          setMonth(Number(e.target.value));
                          if (errors.expiry) setErrors((p) => ({ ...p, expiry: "" }));
                        }}
                        className={inputCls("expiry") + " cursor-pointer"}
                      >
                        {months.map((m, i) => (
                          <option key={i} value={i + 1}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                        {t("payment.year")}
                      </label>
                      <select
                        value={year}
                        onChange={(e) => {
                          setYear(Number(e.target.value));
                          if (errors.expiry) setErrors((p) => ({ ...p, expiry: "" }));
                        }}
                        className={inputCls("expiry") + " cursor-pointer"}
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="•••"
                        value={cvv}
                        maxLength={4}
                        onChange={(e) => {
                          setCvv(e.target.value.replace(/\D/g, ""));
                          if (errors.cvv) setErrors((p) => ({ ...p, cvv: "" }));
                        }}
                        onFocus={() => setIsFlipped(true)}
                        onBlur={() => setIsFlipped(false)}
                        className={`${inputCls("cvv")} text-center tracking-widest`}
                      />
                    </div>
                  </div>

                  {errors.expiry && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.expiry}
                    </p>
                  )}
                  {errors.cvv && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.cvv}
                    </p>
                  )}
                </div>

                {/* Sumar plată */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{t("payment.orderTotal")}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{total} MDL</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>{t("payment.currency")}</span>
                    <span>MDL (Leu Moldovenesc)</span>
                  </div>
                </div>

                {/* Buton plată */}
                <motion.button
                  onClick={handlePay}
                  disabled={payState !== "idle"}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/30 dark:shadow-black/50 text-sm sm:text-base"
                >
                  {payState === "processing" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t("payment.processing")}
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      {t("payment.payNow")} — {total} MDL
                    </>
                  )}
                </motion.button>

                {/* Note securitate */}
                <div className="flex flex-col items-center gap-2 pb-2">
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <Lock size={11} />
                    {t("payment.secureNote")}
                  </p>
                  <div className="flex items-center gap-3 opacity-40">
                    <span className="text-[10px] font-bold italic text-gray-500 dark:text-gray-400">VISA</span>
                    <div className="flex">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 -ml-1.5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">AMEX</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}