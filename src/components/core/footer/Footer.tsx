"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.27 8.27 0 0 0 4.84 1.55V6.85a4.85 4.85 0 0 1-1.07-.16z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
  </svg>
);

export function Footer() {
  const { t } = useTranslation();

  const links = [
    { href: "/produse", label: t("footer.products") },
    { href: "/despre-noi", label: t("footer.about") },
    { href: "/termeni", label: t("footer.terms") },
    { href: "/confidentialitate", label: t("footer.privacy") },
  ];

  const socials = [
    { Icon: InstagramIcon, href: "https:/www./instagram.com/melisfera_md" },
    { Icon: TikTokIcon, href: "https://www.tiktok.com/@melisfera" },
  ];

  return (
    <footer className="bg-amber-50 dark:bg-black border-t border-amber-100 dark:border-neutral-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          <div className="space-y-4">
            <span className="text-2xl font-bold text-amber-900 dark:text-amber-400">Melisfera</span>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              {t("footer.desc")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-400">{t("footer.info")}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-400">{t("footer.contact")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Raionul Călărași, Republica Moldova</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>+373 610 58292</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span>salut@melisfera.md</span>
              </li>
            </ul>
            <div className="pt-4 flex gap-4">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-amber-100 dark:border-neutral-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Melisfera. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}