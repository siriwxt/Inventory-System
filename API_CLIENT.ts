// Frontend API Integration Examples
// Copy these functions to your React components to interact with the API

// Base API URL
const API_BASE = "http://localhost:3000";

// ================================
// Lab 1: Get All Products
// ================================
export async function getAllProducts(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/inventory`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

// ================================
// Lab 1: Get Low Stock Products
// ================================
export async function getLowStockProducts(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/inventory?low_stock=true`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return { success: false, error: "Failed to fetch low stock products" };
  }
}

// ================================
// Lab 2: Create New Product
// ================================
export async function createProduct(product: {
  name: string;
  sku: string;
  zone: string;
  quantity?: number;
}): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        sku: product.sku,
        zone: product.zone,
        quantity: product.quantity ?? 0,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// ================================
// Lab 3: Adjust Stock
// ================================
export async function adjustStockr(
  productId: string,
  change: number
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE}/inventory/${productId}/adjust`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adjusting stock:", error);
    return { success: false, error: "Failed to adjust stock" };
  }
}

// ================================
// Lab 4: Delete Product
// ================================
export async function deleteProduct(productId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/inventory/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// ================================
// Example React Component Usage
// ================================
/*
import { useState, useEffect } from 'react';
import { 
  getAllProducts, 
  createProduct, 
  adjustStock, 
  deleteProduct 
} from './api';

function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const result = await createProduct({
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      zone: formData.get('zone') as string,
      quantity: parseInt(formData.get('quantity') as string) || 0,
    });

    if (result.success) {
      loadProducts(); // Refresh list
    } else {
      alert(result.error);
    }
  };

  const handleSellProduct = async (id: string) => {
    const result = await adjustStock(id, -1);
    if (result.success) {
      loadProducts();
    } else {
      alert(result.error);
    }
  };

  const handleReceiveStock = async (id: string) => {
    const result = await adjustStock(id, 10);
    if (result.success) {
      loadProducts();
    } else {
      alert(result.error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await deleteProduct(id);
    if (result.success) {
      loadProducts();
    } else {
      alert(result.error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Inventory Manager</h1>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct}>
        <input name="name" placeholder="Product Name" required />
        <input name="sku" placeholder="SKU" required />
        <input name="zone" placeholder="Zone" required />
        <input 
          name="quantity" 
          type="number" 
          placeholder="Quantity" 
          defaultValue="0" 
        />
        <button type="submit">Add Product</button>
      </form>

      {/* Products List */}
      <div>
        {products.map((product: any) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{product.name}</h3>
            <p>SKU: {product.sku}</p>
            <p>Zone: {product.zone}</p>
            <p>Quantity: {product.quantity}</p>
            <button onClick={() => handleSellProduct(product.id)}>Sell (-1)</button>
            <button onClick={() => handleReceiveStock(product.id)}>Receive (+10)</button>
            <button 
              onClick={() => handleDeleteProduct(product.id)}
              disabled={product.quantity > 0}
              title={product.quantity > 0 ? "Must have 0 stock to delete" : "Delete product"}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryManager;
*/

// ================================
// TypeScript Types (Optional)
// ================================
export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  zone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
