# 🏭 Warehouse Inventory API Documentation

## 📋 Overview
This REST API provides complete CRUD operations for managing inventory items with validation, filtering, and safety checks.

## 🚀 Getting Started

### Installation
```bash
bun install
```

### Database Setup
```bash
bunx prisma db push
```

### Start Development Server
```bash
bun run dev
```

The API will be available at `http://localhost:3000`
The frontend will be available at `http://localhost:5173`

---

## 📚 API Endpoints

### 1️⃣ **Lab 1: GET /inventory** - Read Products
Retrieve all products from inventory, sorted alphabetically (A-Z).

#### Request
```bash
# Get all products
curl http://localhost:3000/inventory

# Get only low stock products (quantity <= 10)
curl "http://localhost:3000/inventory?low_stock=true"
```

#### Response (Success)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Laptop",
      "sku": "LAP-001",
      "quantity": 15,
      "zone": "A1",
      "createdAt": "2025-04-01T10:00:00Z",
      "updatedAt": "2025-04-01T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Mouse",
      "sku": "MOUSE-001",
      "quantity": 5,
      "zone": "B2",
      "createdAt": "2025-04-01T10:00:00Z",
      "updatedAt": "2025-04-01T10:00:00Z"
    }
  ],
  "count": 2
}
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `low_stock` | string | Set to `"true"` to filter products with quantity ≤ 10 |

---

### 2️⃣ **Lab 2: POST /inventory** - Create Product
Add a new product to the inventory with validation.

#### Request
```bash
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Keyboard",
    "sku": "KEY-001",
    "quantity": 20,
    "zone": "C3"
  }'
```

#### Request Body (Required Fields)
| Field | Type | Validation |
|-------|------|-----------|
| `name` | string | Required, cannot be empty |
| `sku` | string | Required, cannot be empty, must be unique |
| `zone` | string | Required, cannot be empty |
| `quantity` | integer | Optional (default: 0), must be >= 0 |

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Keyboard",
    "sku": "KEY-001",
    "quantity": 20,
    "zone": "C3",
    "createdAt": "2025-04-01T11:00:00Z",
    "updatedAt": "2025-04-01T11:00:00Z"
  },
  "message": "Product created successfully"
}
```

#### Error Response (Duplicate SKU)
```json
{
  "success": false,
  "error": "SKU must be unique"
}
```

#### Example Test Cases
```bash
# Valid creation
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor", "sku":"MON-001", "zone":"A2", "quantity":10}'

# With default quantity (0)
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Headset", "sku":"HEAD-001", "zone":"B1"}'

# Invalid - empty name
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"", "sku":"INV-001", "zone":"A1"}'
```

---

### 3️⃣ **Lab 3: PATCH /inventory/:id/adjust** - Adjust Stock
Adjust product quantity by adding or removing items.

#### Request
```bash
# Reduce stock by 5 (e.g., items sold)
curl -X PATCH http://localhost:3000/inventory/550e8400-e29b-41d4-a716-446655440000/adjust \
  -H "Content-Type: application/json" \
  -d '{"change": -5}'

# Increase stock by 10 (e.g., new shipment)
curl -X PATCH http://localhost:3000/inventory/550e8400-e29b-41d4-a716-446655440000/adjust \
  -H "Content-Type: application/json" \
  -d '{"change": 10}'
```

#### Request Body
| Field | Type | Description |
|-------|------|-------------|
| `change` | integer | Amount to adjust (can be positive or negative) |

#### Response (Success)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Laptop",
    "sku": "LAP-001",
    "quantity": 10,
    "zone": "A1",
    "createdAt": "2025-04-01T10:00:00Z",
    "updatedAt": "2025-04-01T12:00:00Z"
  },
  "message": "Stock adjusted by -5 units"
}
```

#### Error Response (Product Not Found - 404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

#### Error Response (Negative Stock - 400)
```json
{
  "success": false,
  "error": "Quantity cannot be negative"
}
```

---

### 4️⃣ **Lab 4: DELETE /inventory/:id** - Delete Product
Delete a product only if quantity is 0.

#### Request
```bash
curl -X DELETE http://localhost:3000/inventory/550e8400-e29b-41d4-a716-446655440000
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Error Response (Still Has Stock - 400)
```json
{
  "success": false,
  "error": "ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้"
}
```

#### Error Response (Product Not Found - 404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

#### Example Deletion Flow
```bash
# 1. Create a product with 0 quantity
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Old Item", "sku":"OLD-001", "zone":"Z1", "quantity":0}'

# Get the ID from response: 550e8400-e29b-41d4-a716-446655440003

# 2. Try to delete it (will succeed)
curl -X DELETE http://localhost:3000/inventory/550e8400-e29b-41d4-a716-446655440003

# 3. Create another product with stock
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"New Item", "sku":"NEW-001", "zone":"Z2", "quantity":5}'

# Get the ID: 550e8400-e29b-41d4-a716-446655440004

# 4. Try to delete it (will fail because quantity > 0)
curl -X DELETE http://localhost:3000/inventory/550e8400-e29b-41d4-a716-446655440004

# 5. Adjust stock to 0 first
curl -X PATCH http://localhost:3000/inventory/550e8400-e29b-41d4-a716-446655440004/adjust \
  -H "Content-Type: application/json" \
  -d '{"change": -5}'

# 6. Now delete succeeds
curl -X DELETE http://localhost:3000/inventory/550e8400-e29b-41d4-a716-446655440004
```

---

## 🧪 Complete Testing Workflow

### Step 1: Create Products
```bash
# Product 1
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Apple iPad", "sku":"IPAD-001", "zone":"A1", "quantity":20}'

# Product 2
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Banana Stand", "sku":"STAND-001", "zone":"B2", "quantity":8}'

# Product 3
curl -X POST http://localhost:3000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Cherry Pen", "sku":"PEN-001", "zone":"C1", "quantity":0}'
```

### Step 2: Get All Products (Sorted A-Z)
```bash
curl http://localhost:3000/inventory
```
Expected: Products sorted as Apple iPad, Banana Stand, Cherry Pen

### Step 3: Get Low Stock Products
```bash
curl "http://localhost:3000/inventory?low_stock=true"
```
Expected: Only Banana Stand (qty=8) and Cherry Pen (qty=0)

### Step 4: Adjust Stock
```bash
# Reduce Apple iPad stock
curl -X PATCH http://localhost:3000/inventory/[IPAD_ID]/adjust \
  -H "Content-Type: application/json" \
  -d '{"change": -5}'
```

### Step 5: Delete Product with 0 Stock
```bash
# Delete Cherry Pen (already has 0 stock)
curl -X DELETE http://localhost:3000/inventory/[CHERRY_PEN_ID]
```

---

## 📂 Database Schema

### Products Table
```sql
CREATE TABLE "products" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "sku" VARCHAR(255) NOT NULL UNIQUE,
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "zone" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 🛠️ Technology Stack

- **Framework**: [Elysia](https://elysiajs.com/) (Bun-native web framework)
- **Database**: PostgreSQL (Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: [TypeBox](https://github.com/sinclairzx81/typebox)
- **Frontend**: React + TypeScript + Vite

---

## 📝 Testing with Postman / Thunder Client

### Import Collection
You can import these API requests into Postman or Thunder Client:

1. **GET /inventory** - Type: GET
2. **GET /inventory?low_stock=true** - Type: GET
3. **POST /inventory** - Type: POST, Body: JSON
4. **PATCH /inventory/:id/adjust** - Type: PATCH, Body: JSON
5. **DELETE /inventory/:id** - Type: DELETE

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to fetch products" | Check database connection and `.env` file |
| "Product not found" | Verify the product ID exists |
| "SKU must be unique" | Use a different SKU value |
| "Quantity cannot be negative" | Ensure adjustment doesn't result in negative quantity |
| Port 3000 already in use | Change port in src/server/index.ts |

---

## 📊 Lab Requirements Checklist

- ✅ **Lab 1**: GET /inventory with A-Z sorting and low_stock filter
- ✅ **Lab 2**: POST /inventory with TypeBox validation (name, sku, zone required; quantity optional with default 0)
- ✅ **Lab 3**: PATCH /inventory/:id/adjust with change value (positive/negative)
- ✅ **Lab 4**: DELETE /inventory/:id with quantity checking (only delete if quantity === 0)

All labs include proper error handling and status codes! 🎉
