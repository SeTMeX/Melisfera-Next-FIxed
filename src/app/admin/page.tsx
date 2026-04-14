"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ProductManager } from "@/components/admin/ProductManager";
import { Users, ShoppingCart, Package as PackageIcon, Wallet, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import LogInForm from "@/components/core/auth/LogIn";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders'>('products');

  useEffect(() => {
    const checkAuth = () => {
      // Check localStorage first for persistent login
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        console.log('No stored user, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        console.log('Stored user:', user);
        
        if (user.role !== 'admin') {
          console.log('User is not admin, clearing and redirecting');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    const fetchStats = async () => {
      try {
        // Fetch basic stats
        const products = await apiClient.getProducts();
        let orders = [];
        try {
          orders = await apiClient.getOrders();
        } catch (orderError) {
          console.warn("Could not fetch orders (user not authenticated):", orderError);
        }
        
        setStats({
          users: 1, // Will be implemented with user stats endpoint
          orders: orders.length,
          products: products.length,
          revenue: orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Încarcare...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Bun venit, {user?.firstName || 'Admin'}!
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Utilizatori</p>
                <p className="text-2xl font-semibold">{stats.users}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Comenzi</p>
                <p className="text-2xl font-semibold">{stats.orders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <PackageIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Produse</p>
                <p className="text-2xl font-semibold">{stats.products}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Venituri</p>
                <p className="text-2xl font-semibold">{stats.revenue} MDL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'products'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Produse
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Utilizatori
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Comenzi
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Management Utilizatori</h2>
              <p className="text-gray-600">Funcionalitate în dezvoltare...</p>
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Management Comenzi</h2>
              <p className="text-gray-600">Funcionalitate în dezvoltare...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
