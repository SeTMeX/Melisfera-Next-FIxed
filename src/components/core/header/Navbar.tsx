"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, UserPlus, User, ShieldCheck, Globe } from "lucide-react";
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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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

              {/* Admin link — doar pentru admin */}
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-500/20 transition-all"
                >
                  <ShieldCheck size={15} />
                  Admin
                </Link>
              )}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 transition-all"
                >
                  <Globe size={14} />
                  {currentLang === "ro" ? "RO" : currentLang === "en" ? "EN" : "RU"}
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => { i18n.changeLanguage("ro"); setLangDropdownOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        currentLang === "ro" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      RO - Română
                    </button>
                    <button
                      onClick={() => { i18n.changeLanguage("en"); setLangDropdownOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        currentLang === "en" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      EN - English
                    </button>
                    <button
                      onClick={() => { i18n.changeLanguage("ru"); setLangDropdownOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        currentLang === "ru" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      RU - Русский
                    </button>
                  </div>
                )}
              </div>

              <ThemeToggle />

              {user ? (
                <button
                  onClick={() => router.push("/profil")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-sm"
                >
                  <User size={16} />
                  {user.firstName || t("navBar.profile")}
                </button>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-amber-400 hover:text-amber-600 transition-all"
                  >
                    <LogIn size={15} />
                    {t("navBar.login")}
                  </button>
                  <button
                    onClick={openRegister}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-amber-400 to-amber-600 shadow-md hover:shadow-amber-200 dark:hover:shadow-amber-900/40 transition-all"
                  >
                    <UserPlus size={15} />
                    {t("navBar.register")}
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
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
                className="fixed inset-0 bg-black/40 z-30 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-40 shadow-2xl md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-amber-600">Melisfera</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 px-4 py-4 flex-1 overflow-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Admin link mobil */}
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                    >
                      <ShieldCheck size={16} />
                      Admin Panel
                    </Link>
                  )}

                  <div className="flex flex-col gap-2 mt-2 px-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => i18n.changeLanguage("ro")}
                        className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                          currentLang === "ro" 
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700" 
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600"
                        }`}
                      >
                        RO - Română
                      </button>
                      <button
                        onClick={() => i18n.changeLanguage("en")}
                        className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                          currentLang === "en" 
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700" 
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600"
                        }`}
                      >
                        EN - English
                      </button>
                      <button
                        onClick={() => i18n.changeLanguage("ru")}
                        className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                          currentLang === "ru" 
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700" 
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600"
                        }`}
                      >
                        RU - Русский
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                    </div>
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