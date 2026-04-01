import { useState, useEffect, useCallback } from "react"
import type { Product } from "../types"

const API_BASE = "http://localhost:3000/inventory";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);

  // Lab 1: Fetch Data
  const refresh = useCallback(async () => {
    const res = await fetch(API_BASE);
    const data = await res.json();
    setProducts(data);
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

  return { products, addProduct, updateQuantity, deleteProduct, refresh };
}