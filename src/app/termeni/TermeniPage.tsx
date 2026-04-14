"use client";


import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function TermeniPage() {
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
            {isEn ? "Terms & Conditions" : "Termeni și Condiții"}
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            {isEn ? "Last updated: January 2025" : "Ultima actualizare: Ianuarie 2025"}
          </p>

          <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "1. General" : "1. General"}
              </h2>
              <p>
                {isEn
                  ? "By using the Melisfera website, you agree to these terms. Melisfera reserves the right to modify these terms at any time without prior notice."
                  : "Prin utilizarea site-ului Melisfera, ești de acord cu acești termeni. Melisfera își rezervă dreptul de a modifica acești termeni în orice moment, fără notificare prealabilă."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "2. Products" : "2. Produse"}
              </h2>
              <p>
                {isEn
                  ? "All honey products offered by Melisfera are 100% natural, unheated and without additives. Images are for illustrative purposes only."
                  : "Toate produsele din miere oferite de Melisfera sunt 100% naturale, neprocesate termic și fără aditivi. Imaginile au caracter informativ."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "3. Orders & Delivery" : "3. Comenzi și Livrare"}
              </h2>
              <p>
                {isEn
                  ? "Orders are processed within 1–2 business days. Delivery is free for orders over 500 MDL. For orders under 500 MDL, a delivery fee of 35 MDL applies."
                  : "Comenzile sunt procesate în termen de 1–2 zile lucrătoare. Livrarea este gratuită pentru comenzi peste 500 MDL. Pentru comenzi sub 500 MDL, se aplică o taxă de livrare de 35 MDL."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "4. Returns" : "4. Returnări"}
              </h2>
              <p>
                {isEn
                  ? "If you receive a damaged or incorrect product, please contact us within 48 hours of delivery at salut@melisfera.md and we will find the best solution."
                  : "Dacă ai primit un produs deteriorat sau greșit, te rugăm să ne contactezi în termen de 48 de ore de la livrare la salut@melisfera.md și vom găsi cea mai bună soluție."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-3">
                {isEn ? "5. Contact" : "5. Contact"}
              </h2>
              <p>
                {isEn
                  ? "For any questions, you can reach us at salut@melisfera.md or by phone at +373 610 58292."
                  : "Pentru orice întrebări, ne poți contacta la salut@melisfera.md sau telefonic la +373 610 58292."}
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}