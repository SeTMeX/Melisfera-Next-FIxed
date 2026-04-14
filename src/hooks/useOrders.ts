"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingAddress: any;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: { ro: string; en: string };
      description: { ro: string; en: string };
      price: string;
      images: string[];
      imageColor: string;
      badge?: { ro: string; en: string };
      details: { ro: string[]; en: string[] };
    };
  }>;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Nu s-au putut încarca comenzile");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createOrder = async (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  }) => {
    try {
      const newOrder = await apiClient.createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const refetchOrders = () => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Nu s-au putut încarca comenzile");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  };

  return { orders, loading, error, createOrder, refetchOrders };
};
