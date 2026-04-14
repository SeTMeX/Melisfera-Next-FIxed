"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/data/products";

export const useProducts = (params?: { inStockOnly?: boolean; lang?: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProducts(params);
        
        // Transform backend data to match frontend Product interface
        const transformedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          images: item.images,
          imageColor: item.imageColor,
          badge: item.badge,
          details: item.details
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        setError("Nu s-au putut încarca produsele");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params]);

  const refetch = () => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProducts(params);
        
        const transformedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          images: item.images,
          imageColor: item.imageColor,
          badge: item.badge,
          details: item.details
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        setError("Nu s-au putut încarca produsele");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  };

  return { products, loading, error, refetch };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProduct(id);
        
        const transformedProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          images: data.images,
          imageColor: data.imageColor,
          badge: data.badge,
          details: data.details
        };
        
        setProduct(transformedProduct);
        setError(null);
      } catch (err) {
        setError("Nu s-a putut încarca produsul");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};
