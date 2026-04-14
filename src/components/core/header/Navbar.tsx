"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, UserPlus, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LogInForm from "@/components/core/auth/LogIn";
import RegisterForm from "@/components/core/auth/Registration";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/hooks/useUser";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language?.slice(0, 2);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const navLinks = [
    { href: "/", label: t("navBar.home") },
    { href: "/produse", label: t("navBar.products") },
    { href: "/despre-noi", label: t("navBar.about") },
    { href: "/galerie", label: t("navBar.gallery") },
    { href: "/contact", label: t("navBar.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY > 60) setMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches[0].clientY - startY > 60) setMobileMenuOpen(false);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [mobileMenuOpen]);

  const openLogin = () => { setShowRegister(false); setShowLogin(true); };
  const openRegister = () => { setShowLogin(false); setShowRegister(true); };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/photos/logo.png"
                alt="Melisfera Logo"
                className="w-10 h-10 rounded-full object-cover border border-amber-200"
              />
              <span className="text-2xl font-bold text-amber-900 dark:text-amber-400">Melisfera</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                    isActive(link.href) ? "text-amber-500" : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Language switcher */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <button
                  onClick={() => i18n.changeLanguage("ro")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                    currentLang === "ro"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  }`}
                >
                  RO
                </button>
                <button
                  onClick={() => i18n.changeLanguage("en")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                    currentLang === "en"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Auth / User */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                {user ? (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => router.push("/profil")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <User size={13} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="max-w-[100px] truncate">
                      {user.firstName || t("navBar.profile")}
                    </span>
                  </motion.button>
                ) : (
                  <>
                    <button
                      onClick={openLogin}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-amber-400 hover:text-amber-600 transition-all duration-300"
                    >
                      <LogIn size={15} />
                      {t("navBar.login")}
                    </button>
                    <button
                      onClick={openRegister}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-amber-400 to-amber-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <UserPlus size={15} />
                      {t("navBar.register")}
                    </button>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-3">
              {user && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => router.push("/profil")}
                  className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center border border-amber-200 dark:border-amber-700"
                >
                  <User size={17} className="text-amber-600 dark:text-amber-400" />
                </motion.button>
              )}
              <ThemeToggle />
              <button
                className="p-2 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Meniu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[64px] bg-black/20 z-[-1] md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl"
              >
                <nav className="flex flex-col px-4 pt-2 pb-6 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="flex items-center gap-2 px-1 pt-3">
                    <button
                      onClick={() => i18n.changeLanguage("ro")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        currentLang === "ro"
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300"
                      }`}
                    >
                      🇷🇴 Română
                    </button>
                    <button
                      onClick={() => i18n.changeLanguage("en")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        currentLang === "en"
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300"
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>

                  <div className="px-1 pt-2">
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm transition-colors"
                    >
                      <span>{theme === "dark" ? "Temă întunecată" : "Temă luminoasă"}</span>
                      <ThemeToggle />
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    {user ? (
                      <button
                        onClick={() => { setMobileMenuOpen(false); router.push("/profil"); }}
                        className="flex justify-center items-center gap-2 w-full px-6 py-3 rounded-xl font-medium text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                      >
                        <User size={17} />
                        {user.firstName || t("navBar.profile")}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => { setMobileMenuOpen(false); openLogin(); }}
                          className="flex justify-center items-center gap-2 w-full px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-amber-400 hover:text-amber-600 transition-all"
                        >
                          <LogIn size={17} />
                          {t("navBar.login")}
                        </button>
                        <button
                          onClick={() => { setMobileMenuOpen(false); openRegister(); }}
                          className="flex justify-center items-center gap-2 w-full px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-amber-400 to-amber-600 shadow-md transition-all"
                        >
                          <UserPlus size={17} />
                          {t("navBar.register")}
                        </button>
                      </>
                    )}
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <LogInForm
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onShowRegister={openRegister}
      />
      <RegisterForm
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onShowLogin={openLogin}
      />
    </>
  );
}