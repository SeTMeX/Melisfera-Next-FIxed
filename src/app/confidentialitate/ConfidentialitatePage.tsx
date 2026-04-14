"use client";


import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ConfidentialitatePage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.slice(0, 2) === "en";

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-neutral-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-400 mb-3">
            {isEn ? "Privacy Policy" : "Politica de Confidențialitate"}
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            {isEn ? "Last updated: January 2025" : "Ultima actualizare: Ianuarie 2025"}
          </p>

          <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "1. Data We Collect" : "1. Date pe care le colectăm"}
              </h2>
              <p>
                {isEn
                  ? "We collect personal data such as name, email address, phone number and delivery address only when you create an account or place an order."
                  : "Colectăm date personale precum numele, adresa de email, numărul de telefon și adresa de livrare doar când îți creezi un cont sau plasezi o comandă."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "2. How We Use Your Data" : "2. Cum folosim datele tale"}
              </h2>
              <p>
                {isEn
                  ? "Your data is used exclusively to process orders, manage your account and communicate with you about orders. We do not sell or share your data with third parties."
                  : "Datele tale sunt folosite exclusiv pentru procesarea comenzilor, gestionarea contului tău și comunicarea cu tine despre comenzi. Nu vindem sau împărtășim datele tale cu terțe părți."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "3. Cookies" : "3. Cookie-uri"}
              </h2>
              <p>
                {isEn
                  ? "We use cookies to improve your experience on our site. You can disable cookies from your browser settings, but this may affect the site's functionality."
                  : "Folosim cookie-uri pentru a îmbunătăți experiența ta pe site-ul nostru. Poți dezactiva cookie-urile din setările browserului, dar acest lucru poate afecta funcționalitatea site-ului."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "4. Data Security" : "4. Securitatea datelor"}
              </h2>
              <p>
                {isEn
                  ? "We implement appropriate technical measures to protect your personal data against unauthorized access, alteration or deletion."
                  : "Implementăm măsuri tehnice adecvate pentru protejarea datelor tale personale împotriva accesului neautorizat, alterării sau ștergerii."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "5. Your Rights" : "5. Drepturile tale"}
              </h2>
              <p>
                {isEn
                  ? "You have the right to access, correct or delete your personal data at any time. To exercise these rights, contact us at salut@melisfera.md."
                  : "Ai dreptul să accesezi, corectezi sau ștergi datele tale personale în orice moment. Pentru a exercita aceste drepturi, contactează-ne la salut@melisfera.md."}
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}