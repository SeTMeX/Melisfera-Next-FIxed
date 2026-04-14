"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Users, Package, LogOut, ShieldCheck, RefreshCw } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  balance: number;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  variants?: string;
  inStock: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "products">("users");
  const [users, setUsers] = useState<UserData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "admin") {
          router.replace("/");
          return;
        }
        setCurrentUser(data.user);
        setLoading(false);
      })
      .catch(() => router.replace("/"));
  }, []);

  useEffect(() => {
    if (currentUser) fetchData();
  }, [activeTab, currentUser]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === "users") {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } finally {
      setDataLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest utilizator?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Eroare la ștergere");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest produs?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Eroare la ștergere");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-amber-400" size={22} />
          <span className="text-xl font-bold text-amber-400">Melisfera Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block">{currentUser?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50 transition-all text-sm"
          >
            <LogOut size={14} />
            Deconectare
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users size={22} className="text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Utilizatori</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Package size={22} className="text-amber-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Produse</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === "users"
                ? "bg-amber-500 text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Users size={16} />
            Utilizatori
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === "products"
                ? "bg-amber-500 text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Package size={16} />
            Produse
          </button>
          <button
            onClick={fetchData}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
          >
            <RefreshCw size={14} className={dataLoading ? "animate-spin" : ""} />
            Reîncarcă
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden overflow-x-auto">
          {dataLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === "users" ? (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="text-left px-6 py-3">Nume</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">Rol</th>
                  <th className="text-left px-6 py-3">Sold</th>
                  <th className="text-left px-6 py-3">Înregistrat</th>
                  <th className="text-right px-6 py-3">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.role === "admin"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{u.balance} MDL</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(u.createdAt).toLocaleDateString("ro-RO")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all"
                          title="Șterge utilizator"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      Niciun utilizator găsit
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="text-left px-6 py-3">Produs</th>
                  <th className="text-left px-6 py-3">Preț / Variante</th>
                  <th className="text-left px-6 py-3">Stoc</th>
                  <th className="text-left px-6 py-3">Adăugat</th>
                  <th className="text-right px-6 py-3">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const productName = (() => {
                    try { return JSON.parse(p.name)?.ro || p.name; }
                    catch { return p.name; }
                  })();
                  const variants = (() => {
                    try {
                      const v = JSON.parse((p as any).variants || "null");
                      return Array.isArray(v) ? v : null;
                    } catch { return null; }
                  })();
                  return (
                    <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{productName}</td>
                      <td className="px-6 py-4">
                        {variants ? (
                          <div className="flex flex-wrap gap-1.5">
                            {variants.map((v: { label: string; price: number }, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20"
                              >
                                {v.label} — {v.price} MDL
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-amber-400 font-medium">{p.price} MDL</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          p.inStock
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {p.inStock ? "În stoc" : "Epuizat"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(p.createdAt).toLocaleDateString("ro-RO")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all"
                          title="Șterge produs"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                      Niciun produs găsit
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}