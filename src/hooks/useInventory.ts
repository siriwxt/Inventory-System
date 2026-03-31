import { useState, useEffect } from "react"
import type { Product } from "../types"

const API_BASE = "http://localhost:3000"

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all products from API
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/inventory`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data || [])
      } else {
        setError(data.error || "Failed to fetch products")
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch products")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Add product to API
  const addProduct = async (name: string, sku: string, zone: string, quantity: number = 0) => {
    try {
      const response = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sku, zone, quantity })
      })
      const data = await response.json()
      if (data.success) {
        setProducts(prev => [...prev, data.data])
        return data.data
      } else {
        setError(data.error || "Failed to add product")
        alert(data.error || "Failed to add product")
      }
    } catch (err: any) {
      setError(err.message || "Failed to add product")
      alert(err.message || "Failed to add product")
      console.error("Error adding product:", err)
    }
  }

  // Update product quantity via API
  const updateQuantity = async (id: string, delta: number) => {
    try {
      const response = await fetch(`${API_BASE}/inventory/${id}/adjust`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change: delta })
      })
      const data = await response.json()
      if (data.success) {
        setProducts(prev =>
          prev.map(p =>
            p.id === id ? data.data : p
          )
        )
        return data.data
      } else {
        setError(data.error || "Failed to update product")
        alert(data.error || "Failed to update product")
      }
    } catch (err: any) {
      setError(err.message || "Failed to update product")
      alert(err.message || "Failed to update product")
      console.error("Error updating product:", err)
    }
  }

  // Delete product from API
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/inventory/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
        return true
      } else {
        setError(data.error || "Failed to delete product")
        alert(data.error || "Failed to delete product")
        return false
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete product")
      alert(err.message || "Failed to delete product")
      console.error("Error deleting product:", err)
      return false
    }
  }

  return { 
    products, 
    addProduct, 
    updateQuantity, 
    deleteProduct, 
    loading, 
    error,
    refetch: fetchProducts 
  }
}