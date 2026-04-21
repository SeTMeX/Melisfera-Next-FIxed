"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Numele este prea scurt"),
  email: z.string().email("Adresă de email invalidă"),
  subject: z.string().min(3, "Subiectul este prea scurt"),
  message: z.string().min(10, "Mesajul trebuie să conțină cel puțin 10 caractere"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error("Nu s-a putut trimite mesajul. Încearcă din nou.");
        return;
      }
      toast.success("Mesajul a fost trimis cu succes! 🍯");
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error(err);
      toast.error("Eroare de rețea. Încearcă din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-amber-900 dark:text-amber-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("contact.title")}
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t("contact.subtitle")}
          </motion.p>
        </div>

        {sent && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-center font-medium text-sm">
            ✓ {t("contact.successMsg")}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
          {/* Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-amber-50 dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800 p-6 sm:p-8 rounded-3xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-amber-900 dark:text-amber-400">
                {t("contact.infoTitle")}
              </h3>
              <ul className="space-y-5 sm:space-y-6">
                {[
                  { icon: MapPin, title: t("contact.address"), text: "Orașul Chișinău,\nRepublica Moldova" },
                  { icon: Phone, title: t("contact.phone"), text: "+373 61058292" },
                  { icon: Mail, title: t("contact.email"), text: "setmex6@gmail.com" },
                ].map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4 group">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-600 transition-all">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-0.5 text-sm sm:text-base">{title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800 p-6 sm:p-8 md:p-10 rounded-3xl shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {(["name", "email"] as const).map((field) => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field === "name" ? t("contact.name") : t("contact.emailLabel")}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        {...register(field)}
                        placeholder={field === "name" ? "Ion Popescu" : "ion@exemplu.com"}
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                          errors[field]
                            ? "border-red-400"
                            : "border-gray-200 dark:border-neutral-700 focus:border-amber-400"
                        } focus:outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 transition-all text-sm`}
                      />
                      {errors[field] && <p className="text-xs text-red-500">{errors[field]?.message}</p>}
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("contact.subject")}</label>
                  <input
                    {...register("subject")}
                    placeholder={t("contact.subjectPlaceholder")}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                      errors.subject ? "border-red-400" : "border-gray-200 dark:border-neutral-700 focus:border-amber-400"
                    } focus:outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 transition-all text-sm`}
                  />
                  {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("contact.message")}</label>
                  <textarea
                    rows={5}
                    {...register("message")}
                    placeholder={t("contact.messagePlaceholder")}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                      errors.message ? "border-red-400" : "border-gray-200 dark:border-neutral-700 focus:border-amber-400"
                    } focus:outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 transition-all resize-y text-sm`}
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {t("contact.sending")}</>
                  ) : (
                    <><Send className="w-5 h-5" /> {t("contact.sendBtn")}</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}