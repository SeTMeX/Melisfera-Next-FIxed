"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description?: string;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getWallet();
        setWallet(data);
        setError(null);
      } catch (err) {
        setError("Nu s-a putut încarca portofelul");
        console.error("Error fetching wallet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const addFunds = async (amount: number, description?: string) => {
    try {
      const updatedWallet = await apiClient.addFunds(amount, description);
      setWallet(updatedWallet);
      return updatedWallet;
    } catch (error) {
      console.error("Error adding funds:", error);
      throw error;
    }
  };

  const refetchWallet = () => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getWallet();
        setWallet(data);
        setError(null);
      } catch (err) {
        setError("Nu s-a putut încarca portofelul");
        console.error("Error fetching wallet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  };

  return { 
    wallet, 
    loading, 
    error, 
    addFunds, 
    refetchWallet,
    balance: wallet?.balance || 0,
    transactions: wallet?.transactions || []
  };
};
