"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Package } from "lucide-react";

interface ProductFormData {
  name: { ro: string; en: string };
  description: { ro: string; en: string };
  price: number;
  images: string[];
  imageColor: string;
  badge?: { ro: string; en: string };
  details: { ro: string[]; en: string[] };
  inStock: boolean;
}

export const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: { ro: "", en: "" },
    description: { ro: "", en: "" },
    price: 0,
    images: [],
    imageColor: "",
    details: { ro: [], en: [] },
    inStock: true
  });

  const fetchProducts = async () => {
    try {
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Eroare la încarcarea produselor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submissionData = {
        ...formData,
        images: formData.images
      };

      if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, submissionData);
        toast.success("Produs actualizat cu succes");
      } else {
        await apiClient.createProduct(submissionData);
        toast.success("Produs creat cu succes");
      }
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: { ro: "", en: "" },
        description: { ro: "", en: "" },
        price: 0,
        images: [],
        imageColor: "",
        details: { ro: [], en: [] },
        inStock: true
      });
      fetchProducts();
    } catch (error) {
      toast.error("Eroare la salvarea produsului");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.replace(' MDL', '')),
      images: product.images,
      imageColor: product.imageColor,
      badge: product.badge,
      details: product.details,
      inStock: true
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete product with ID:', id);
    if (confirm("Esti sigur ca vrei sa stergi acest produs?")) {
      try {
        await apiClient.deleteProduct(id);
        toast.success("Produs sters cu succes");
        fetchProducts();
      } catch (error) {
        console.error('Delete product error:', error);
        toast.error("Eroare la stergerea produsului");
      }
    }
  };

  if (loading) {
    return <div>Încarcare...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package size={24} />
          Management Produse
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Adaug Produs
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editare Produs" : "Adaugare Produs"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nume (RO)</label>
                  <input
                    type="text"
                    value={formData.name.ro}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: { ...prev.name, ro: e.target.value }
                    }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nume (EN)</label>
                  <input
                    type="text"
                    value={formData.name.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value }
                    }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Descriere (RO)</label>
                  <textarea
                    value={formData.description.ro}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, ro: e.target.value }
                    }))}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descriere (EN)</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value }
                    }))}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pret (MDL)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      price: parseFloat(e.target.value)
                    }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Culoare Imagine</label>
                  <input
                    type="text"
                    value={formData.imageColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      imageColor: e.target.value
                    }))}
                    className="w-full p-2 border rounded"
                    placeholder="#B45309"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Imagini (URL-uri separate prin virgula)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    images: e.target.value.split(',').map(url => url.trim()).filter(url => url)
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="/photos/product1.jpg, /photos/product2.jpg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  {editingProduct ? "Actualizeaza" : "Salveaza"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                >
                  Anuleaza
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{product.name.ro || 'No name'}</h3>
              <p className="text-gray-600">{product.price}</p>
              <p className="text-sm text-gray-500">{product.description.ro ? product.description.ro.substring(0, 100) : 'No description'}...</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
