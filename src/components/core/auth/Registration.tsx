"use client";

import type { RegisterDto } from "@/api/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Register } from "@/api/request";
import { toast } from "sonner";
import { User, Phone, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

const PHONE_REGEX = /^(\+?373|0)(\s?\(?\d{2}\)?\s?\d{3}\s?\d{3}|\d{8})$/;

interface RegisterFormProps {
  show: boolean;
  onClose: () => void;
  onShowLogin?: () => void;
}

const RegisterForm = ({ show, onClose, onShowLogin }: RegisterFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const validateData = () => {
    if (!firstName.trim()) { toast.error("Introdu numele"); return false; }
    if (!lastName.trim()) { toast.error("Introdu familia"); return false; }
    if (!phoneNumber.trim()) { toast.error("Introdu numărul de telefon"); return false; }
    if (!PHONE_REGEX.test(phoneNumber)) { toast.error("Număr de telefon invalid"); return false; }
    if (!email.trim()) { toast.error("Introdu email-ul"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Email invalid"); return false; }
    if (!password) { toast.error("Introdu parola"); return false; }
    if (password.length < 6) { toast.error("Parola trebuie să aibă minim 6 caractere"); return false; }
    return true;
  };

  const onSubmit = () => {
    if (!validateData()) return;
    setLoading(true);
    const payload: RegisterDto = { firstName, lastName, phoneNumber, email, password };
    Register(payload)
      .then((response) => {
        console.log('Register response:', response);
        
        // Store in localStorage for persistence
        const userData = response.data || response.user || response;
        localStorage.setItem("user", JSON.stringify({
          id: userData.id ?? "",
          firstName: userData.firstName ?? "",
          lastName: userData.lastName ?? "",
          email: userData.email ?? email,
          phoneNumber: userData.phoneNumber,
          role: userData.role ?? "client",
          createdAt: userData.createdAt,
        }));
        
        toast.success("V-ați înregistrat cu succes");
        onClose();
      })
      .catch((error) => {
        console.error('Register error:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Eroare la înregistrare';
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
              Creează un cont
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 relative z-10">
              Alătură-te comunității Melisfera
            </p>
          </div>

          {/* FORM */}
          <div className="px-8 py-6 space-y-4">

            {/* Prenume + Nume */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Prenume</label>
                <div className={fieldClass("firstName")}>
                  <User size={15} className={iconClass("firstName")} />
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFocused("firstName")}
                    onBlur={() => setFocused(null)}
                    type="text"
                    placeholder="Ion"
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Nume</label>
                <div className={fieldClass("lastName")}>
                  <User size={15} className={iconClass("lastName")} />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setFocused("lastName")}
                    onBlur={() => setFocused(null)}
                    type="text"
                    placeholder="Popescu"
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label className={labelClass}>Telefon</label>
              <div className={fieldClass("phone")}>
                <Phone size={15} className={iconClass("phone")} />
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  type="tel"
                  placeholder="+373 69 000 000"
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </div>

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
              <label className={labelClass}>Parolă</label>
              <div className={fieldClass("password")}>
                <Lock size={15} className={iconClass("password")} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Minim 6 caractere"
                  autoComplete="new-password"
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

              {password.length > 0 && (
                <div className="mt-2 flex gap-1 items-center">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        password.length >= (i + 1) * 3
                          ? password.length >= 10 ? "bg-green-400"
                            : password.length >= 6 ? "bg-amber-400"
                            : "bg-red-400"
                          : "bg-amber-100 dark:bg-neutral-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                    {password.length < 6 ? "Slabă" : password.length < 10 ? "Bună" : "Puternică"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={onSubmit}
              disabled={loading}
              type="button"
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Se creează contul...</>
              ) : (
                "Creează cont gratuit"
              )}
            </button>

            {/* Link login */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-500 pt-1">
              Ai deja cont?{" "}
              <button
                type="button"
                onClick={onShowLogin}
                className="text-amber-500 hover:text-amber-600 font-semibold hover:underline transition-colors"
              >
                Autentifică-te
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterForm;