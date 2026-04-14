"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Login } from "@/api/request";
import useUserStore from "@/stores/useUserStore";

interface LogInFormProps {
  show: boolean;
  onClose: () => void;
  onShowRegister?: () => void;
}

const LogInForm = ({ show, onClose, onShowRegister }: LogInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const validateData = () => {
    if (!email.trim()) { toast.error("Introdu email-ul"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Email invalid"); return false; }
    if (!password) { toast.error("Introdu parola"); return false; }
    if (password.length < 6) { toast.error("Parola trebuie să aibă minim 6 caractere"); return false; }
    return true;
  };

  const onSubmit = () => {
    if (!validateData()) return;
    setLoading(true);
    Login({ email, password })
      .then((response) => {
        console.log('Login response:', response);
        
        // Store in localStorage for persistence
        const userData = response.data || response.user || response;
        localStorage.setItem("user", JSON.stringify({
          id: userData.id ?? "",
          firstName: userData.firstName ?? email.split("@")[0],
          lastName: userData.lastName ?? "",
          email: userData.email ?? email,
          phoneNumber: userData.phoneNumber,
          role: userData.role ?? "client",
          createdAt: userData.createdAt,
        }));
        
        useUserStore.getState().setUser({
          id: userData.id ?? "",
          firstName: userData.firstName ?? email.split("@")[0],
          lastName: userData.lastName ?? "",
          email: userData.email ?? email,
          phoneNumber: userData.phoneNumber,
          role: userData.role ?? "client",
          createdAt: userData.createdAt,
        });
        toast.success("Bine ai revenit!");
        onClose();
      })
      .catch((error) => {
        console.error('Login error:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Eroare la autentificare';
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  const fieldClass = (id: string) =>
    `relative flex items-center rounded-xl border-2 transition-all duration-300 bg-white dark:bg-neutral-800/80 ${
      focused === id
        ? "border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-100 dark:shadow-amber-900/30"
        : "border-amber-100 dark:border-neutral-700 hover:border-amber-200 dark:hover:border-neutral-600"
    }`;

  const iconClass = (id: string) =>
    `absolute left-3.5 transition-colors duration-300 ${
      focused === id ? "text-amber-500" : "text-amber-400 dark:text-neutral-500"
    }`;

  const inputClass =
    "w-full bg-transparent pl-9 pr-4 py-3 text-sm text-amber-900 dark:text-white placeholder-amber-400 dark:placeholder-neutral-600 focus:outline-none";

  const labelClass =
    "block text-xs font-semibold tracking-wide text-amber-800 dark:text-amber-500/70 uppercase mb-2";

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none max-w-md" showCloseButton={false}>
        <DialogTitle className="hidden" />

        <div className="w-full rounded-3xl bg-amber-50 dark:bg-neutral-900 overflow-hidden shadow-2xl border border-amber-100 dark:border-neutral-800">

          {/* HEADER */}
          <div className="relative px-8 pt-8 pb-7 bg-white dark:bg-neutral-900 border-b border-amber-100 dark:border-neutral-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-amber-100/70 to-transparent dark:from-amber-900/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-xl shadow-md shadow-amber-200 dark:shadow-amber-900/50">
                🍯
              </div>
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-400 leading-none">Melisfera</p>
                <p className="text-xs text-amber-500 dark:text-amber-600">Miere naturală</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-amber-900 dark:text-white relative z-10">
              Bine ai revenit!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 relative z-10">
              Autentifică-te în contul tău
            </p>
          </div>

          {/* FORM */}
          <div className="px-8 py-6 space-y-4">

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>
              <div className={fieldClass("email")}>
                <Mail size={15} className={iconClass("email")} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  type="email"
                  placeholder="ion@exemplu.md"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Parola */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Parolă</label>
                <button
                  type="button"
                  className="text-xs text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 hover:underline transition-colors"
                >
                  Ai uitat parola?
                </button>
              </div>
              <div className={fieldClass("password")}>
                <Lock size={15} className={iconClass("password")} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Parola ta"
                  autoComplete="current-password"
                  className={inputClass + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-amber-400 dark:text-neutral-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={onSubmit}
              disabled={loading}
              type="button"
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Se autentifică...</>
              ) : (
                "Autentifică-te"
              )}
            </button>

            {/* Link register */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-500 pt-1">
              Nu ai cont?{" "}
              <button
                type="button"
                onClick={onShowRegister}
                className="text-amber-500 hover:text-amber-600 font-semibold hover:underline transition-colors"
              >
                Înregistrează-te
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogInForm;