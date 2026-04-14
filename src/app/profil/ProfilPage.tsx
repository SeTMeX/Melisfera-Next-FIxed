"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2, LogOut, Wallet, History, User,
  Heart, ChevronRight, X, Loader2, BadgeCheck,
  Pencil, ShoppingBag, Package, CreditCard
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import useUserStore from "@/stores/useUserStore";
import useFavoritesStore from "@/stores/useFavoritesStore";
import { useCartStore } from "@/stores/cartStore";
import { UpdateProfile, DeleteAccount } from "@/api/request";
import type { Product } from "@/data/products";

type Tab = "profile" | "orders" | "wishlist" | "wallet";

const ProfilPage = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const { setUser } = useUserStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editData, setEditData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="text-5xl mb-4">🍯</div>
          <p className="text-amber-900 dark:text-amber-400 font-semibold mb-2">
            {t("UserProfile.notAuthenticated")}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-white font-semibold text-sm transition-colors"
          >
            {t("UserProfile.backHome")}
          </button>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const lang = i18n.language?.slice(0, 2) === "en" ? "en" : "ro";

  const handleSaveEdit = () => {
    setEditLoading(true);
    UpdateProfile(editData)
      .then(() => {
        setUser({ ...user, ...editData });
        toast.success(t("UserProfile.saveChanges"));
        setShowEdit(false);
      })
      .catch(() => toast.error("Nu s-a putut actualiza profilul."))
      .finally(() => setEditLoading(false));
  };

  const handleDeleteAccount = () => {
    setDeleteLoading(true);
    DeleteAccount()
      .then(() => {
        toast.success(t("UserProfile.deleteTitle"));
        logout();
      })
      .catch(() => toast.error("Nu s-a putut șterge contul."))
      .finally(() => setDeleteLoading(false));
  };

  const sidebarNav = [
    { id: "profile" as Tab, icon: User, label: t("UserProfile.profile") },
    { id: "orders" as Tab, icon: History, label: t("UserProfile.order") },
    { id: "wishlist" as Tab, icon: Heart, label: t("UserProfile.wishlist"), badge: favorites.length > 0 ? favorites.length : null },
    { id: "wallet" as Tab, icon: Wallet, label: t("UserProfile.wallet") },
  ];

  const infoFields = [
    { label: t("UserProfile.fullName"), value: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—" },
    { label: t("UserProfile.email"), value: user.email ?? "—" },
    { label: t("UserProfile.phone"), value: user.phoneNumber || "—" },
    {
      label: t("UserProfile.memberSince"),
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("ro-RO", { day: "2-digit", month: "long", year: "numeric" })
        : "—",
    },
    { label: t("UserProfile.member"), value: user.role ?? "client" },
    { label: t("UserProfile.id"), value: user.id ?? "—" },
  ];

  const editFields = [
    { label: t("UserProfile.firstName"), key: "firstName", placeholder: "Ion" },
    { label: t("UserProfile.lastName"), key: "lastName", placeholder: "Popescu" },
    { label: t("UserProfile.phone"), key: "phoneNumber", placeholder: "069 000 000" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/20 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-6">

        {/* SIDEBAR */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:w-64 shrink-0"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm overflow-hidden">

            <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-orange-400 p-6 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 -left-6 w-36 h-36 bg-black/5 rounded-full" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-xl mb-3">
                  {initials || <User size={22} />}
                </div>
                <p className="text-white font-bold text-base leading-tight truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-white/70 text-xs mt-0.5 truncate">{user.email}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full font-semibold">
                  <BadgeCheck size={10} /> {user.role ?? "client"}
                </span>
              </div>
            </div>

            <div className="p-3 space-y-1">
              {sidebarNav.map(({ id, icon: Icon, label, badge }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    activeTab === id
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-semibold"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {badge ? (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  ) : (
                    <ChevronRight size={14} className={`ml-auto transition-opacity ${activeTab === id ? "opacity-50" : "opacity-20"}`} />
                  )}
                </button>
              ))}

              <div className="h-px bg-amber-100 dark:bg-neutral-800 my-2" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors"
              >
                <LogOut size={16} /> {t("UserProfile.logOut")}
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm transition-colors"
              >
                <Trash2 size={16} /> {t("UserProfile.delete")}
              </button>
            </div>
          </div>
        </motion.aside>

        {/* MAIN */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* TAB: PROFIL */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-md shadow-amber-200/60 dark:shadow-none">
                      {initials || <User size={26} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
                    </div>
                    <div className="flex gap-8 border-t sm:border-t-0 sm:border-l border-amber-100 dark:border-neutral-800 pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto shrink-0">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-amber-500 dark:text-amber-400">0</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">{t("UserProfile.orders")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-amber-500 dark:text-amber-400">{favorites.length}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">{t("UserProfile.wishlist")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-amber-500">
                      {t("UserProfile.personalInfo")}
                    </h3>
                    <button
                      onClick={() => {
                        setEditData({
                          firstName: user.firstName ?? "",
                          lastName: user.lastName ?? "",
                          phoneNumber: user.phoneNumber ?? "",
                        });
                        setShowEdit(true);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200 dark:border-neutral-700 px-4 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                    {infoFields.map(({ label, value }) => (
                      <div key={label} className="py-4 border-b border-gray-100 dark:border-neutral-800">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{label}</p>
                        <p className="text-sm text-gray-900 dark:text-white font-medium break-all">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: COMENZI */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-amber-500 mb-8">
                    {t("UserProfile.order")}
                  </h3>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                      <Package size={28} className="text-amber-400" />
                    </div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("UserProfile.noOrders")}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs">{t("UserProfile.noOrdersDesc")}</p>
                    <button
                      onClick={() => router.push("/produse")}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-semibold shadow-md shadow-amber-200/50 dark:shadow-none transition-all"
                    >
                      {t("UserProfile.discoverProducts")}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === "wishlist" && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-amber-500 mb-8">
                    {t("UserProfile.wishlist")}
                  </h3>

                  {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <Heart size={28} className="text-red-400" />
                      </div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("UserProfile.emptyWishlist")}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs">{t("UserProfile.emptyWishlistDesc")}</p>
                      <button
                        onClick={() => router.push("/produse")}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-semibold shadow-md shadow-amber-200/50 dark:shadow-none transition-all"
                      >
                        {t("UserProfile.exploreProducts")}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favorites.map((product: Product) => {
                        const productName = product.name[lang];
                        const productImage = product.images?.[0] ?? `https://placehold.co/80x80/FFF8E7/${product.imageColor}?text=${encodeURIComponent(productName)}`;
                        return (
                          <div
                            key={product.id}
                            className="flex items-center gap-4 p-4 rounded-2xl border border-amber-100 dark:border-neutral-800 hover:bg-amber-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                          >
                            <img
                              src={productImage}
                              alt={productName}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-amber-100 dark:border-neutral-700"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{productName}</p>
                              <p className="text-amber-600 dark:text-amber-400 font-bold text-sm mt-0.5">{product.price}</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  useCartStore.getState().addItem({
                                    id: product.id,
                                    name: productName,
                                    image: productImage,
                                    imageColor: product.imageColor,
                                    price: product.price,
                                  });
                                  toast.success(`"${productName}" adăugat în coș 🍯`);
                                }}
                                className="p-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white transition-colors"
                              >
                                <ShoppingBag size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  toggleFavorite(product);
                                  toast.success(`"${productName}" eliminat din favorite`);
                                }}
                                className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-colors"
                              >
                                <Heart size={14} className="fill-red-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: WALLET */}
            {activeTab === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-amber-500 mb-8">
                    {t("UserProfile.wallet")}
                  </h3>

                  <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-orange-400 rounded-2xl p-6 mb-6 overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-8 -left-4 w-40 h-40 bg-black/5 rounded-full" />
                    <div className="relative z-10">
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                        {t("UserProfile.availableBalance")}
                      </p>
                      <p className="text-white font-bold text-4xl">0 <span className="text-2xl">MDL</span></p>
                      <div className="flex items-center gap-2 mt-4">
                        <CreditCard size={14} className="text-white/60" />
                        <p className="text-white/60 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                      <ShoppingBag size={24} className="text-amber-400" />
                    </div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("UserProfile.noTransactions")}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">{t("UserProfile.noTransactionsDesc")}</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEdit(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-amber-100 dark:border-neutral-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-amber-100 dark:border-neutral-800">
                <h3 className="font-bold text-gray-900 dark:text-white">{t("UserProfile.editProfile")}</h3>
                <button
                  onClick={() => setShowEdit(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {editFields.map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 mb-2">
                      {label}
                    </label>
                    <input
                      value={editData[key as keyof typeof editData]}
                      onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 dark:border-neutral-700 bg-amber-50/50 dark:bg-neutral-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 transition-colors placeholder-gray-300 dark:placeholder-neutral-600"
                    />
                  </div>
                ))}

                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="w-full mt-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 transition-all shadow-md shadow-amber-200/50 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {editLoading
                    ? <><Loader2 size={16} className="animate-spin" /> {t("UserProfile.saving")}</>
                    : t("UserProfile.saveChanges")
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-red-100 dark:border-neutral-800 overflow-hidden"
            >
              <div className="p-7 text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={22} className="text-red-500" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{t("UserProfile.deleteTitle")}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  {t("UserProfile.deleteWarning")}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {t("UserProfile.cancel")}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {deleteLoading
                      ? <><Loader2 size={15} className="animate-spin" /> {t("UserProfile.deleting")}</>
                      : t("UserProfile.confirmDelete")
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilPage;