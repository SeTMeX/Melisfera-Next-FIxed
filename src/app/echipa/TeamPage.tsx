"use client";


import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Users, Award, Heart, Handshake } from "lucide-react";

export default function TeamPage() {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: "Ana Popescu",
      role: "Founder & CEO",
      description: "Passionate beekeeper with over 15 years of experience",
      image: "/team/ana.jpg"
    },
    {
      name: "Mihai Ionescu",
      role: "Head of Production",
      description: "Expert in honey processing and quality control",
      image: "/team/mihai.jpg"
    },
    {
      name: "Elena Radu",
      role: "Marketing Director",
      description: "Dedicated to promoting natural bee products",
      image: "/team/elena.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-900 dark:text-amber-400 mb-6">
              Echipa Melisfera
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              O echipă dedicată pasionată de miere și produse apicole naturale
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { icon: Users, title: "Experiență", description: "Peste 15 ani în apicultură" },
            { icon: Award, title: "Calitate", description: "Produse certificate și testate" },
            { icon: Heart, title: "Pasione", description: "Dragoste pentru albine și natură" },
            { icon: Handshake, title: "Încredere", description: "Relații pe termen lung cu clienții" }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-amber-50 dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800"
            >
              <value.icon className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-amber-100 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-50 dark:from-neutral-800 dark:to-neutral-900">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/400x400/FFF8E7/333?text=${encodeURIComponent(member.name)}`;
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2">
                  {member.name}
                </h3>
                <p className="text-amber-600 dark:text-amber-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl p-8 sm:p-12 border border-amber-200 dark:border-amber-800">
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-300 mb-4">
              Alătură-te echipei noastre
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Suntem mereu în căutare de oameni pasionați de miere și produse naturale sănătoase.
            </p>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-200/50 dark:shadow-none transition-all">
              Contactează-ne
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}