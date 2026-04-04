import { useState, useEffect, useCallback } from "react"
import type { Product } from "../types"

const API_BASE = "/inventory";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lab 1: Fetch Data
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_BASE);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from API");
      }

      setProducts(data);
    } catch (err: any) {
      console.error("Inventory fetch failed:", err);
      setProducts([]);
      setError(err?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Lab 2: Add Product
  const addProduct = async (name: string, sku: string, zone: string, quantity: number) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sku, zone, quantity })
    });
    if (res.ok) refresh();
    else alert("เพิ่มไม่สำเร็จ: SKU อาจซ้ำ");
  };

  // Lab 3: Adjust Stock
  const updateQuantity = async (id: string, delta: number) => {
    await fetch(`${API_BASE}/${id}/adjust`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ change: delta })
    });
    refresh();
  };

  // Lab 4: Delete Product
  const deleteProduct = async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error); // จะเตือนถ้าของยังไม่เป็น 0
    } else {
      refresh();
    }
  };

  return { products, loading, error, addProduct, updateQuantity, deleteProduct, refresh };
}