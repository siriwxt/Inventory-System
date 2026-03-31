# ✅ การแก้ไข: เชื่อมต่อ Frontend กับ Database

## 📝 ปัญหาเดิม
Frontend ไม่ได้เชื่อมต่อกับ API ข้อมูลเพิ่งเก็บไว้ใน memory เท่านั้น

---

## ✨ การแก้ไขที่ทำ

### 1. อัปเดต Database Schema Match (`src/types.ts`)
**เดิม:**
```typescript
id: number, name, price, quantity
```

**ใหม่:**
```typescript
id: string (UUID)
name, sku (รหัสสินค้า), zone (โซน), quantity
createdAt, updatedAt
```

### 2. เชื่อมต่อ API Backend (`src/hooks/useInventory.ts`)
- ✅ ดึงข้อมูลสินค้าจาก API เมื่อเปิดหน้า
- ✅ เพิ่มสินค้า → บันทึกลง Supabase ผ่าน POST /inventory
- ✅ ปรับจำนวนสินค้า → อัปเดตผ่าน PATCH /inventory/:id/adjust
- ✅ ลบสินค้า → ลบจาก Database ผ่าน DELETE /inventory/:id

### 3. ปรับ UI Form (`src/pages/Products.tsx`)
**เลือกง่ายขึ้น:**
- ❌ ราคา (price)
- ✅ รหัส (SKU)
- ✅ โซน (Zone)
- ✅ จำนวน (Quantity)

---

## 🎯 วิธีใช้ระบบตอนนี้

### ขั้นตอนที่ 1: เปิดเว็บ
1. ไปที่ `http://localhost:5173`
2. เข้า Tab **"Products"**

### ขั้นตอนที่ 2: เพิ่มสินค้า
📝 กรอกข้อมูลในฟอร์ม:
- **ชื่อสินค้า**: เช่น "Laptop"
- **รหัส (SKU)**: เช่น "LAP-001"  ⚠️ *ต้องไม่ซ้ำกับสินค้าอื่น*
- **โซน**: เช่น "A1"
- **จำนวน**: เช่น 15

เลือก **"เพิ่ม"** → ข้อมูลจะไป Supabase ทันที

### ขั้นตอนที่ 3: ดูข้อมูลใน Supabase
1. ไปที่ Supabase Console: https://app.supabase.com
2. เลือก Database ของคุณ
3. ตารางจะมี Table ชื่อ **"products"**
4. ดูข้อมูลที่เพิ่งสร้างใน Web ✅

### ขั้นตอนที่ 4: จัดการสินค้า
- **➕ เพิ่มจำนวน**: บวก 1 หน่วย
- **➖ ลดจำนวน**: ลบ 1 หน่วย (ถ้าจำนวน > 0)
- **🗑️ ลบสินค้า**: ลบจากระบบ (😎 เฉพาะจำนวน = 0 เท่านั้น)

---

## 🧪 ตัวอย่างการใช้

### ตัวอย่างที่ 1: สร้างสินค้า 3 ฉบับ
1. เพิ่ม "Laptop" SKU: "LAP-001" Zone: "A1" Qty: 15
2. เพิ่ม "Mouse" SKU: "MOUSE-001" Zone: "B2" Qty: 5
3. เพิ่ม "Keyboard" SKU: "KEY-001" Zone: "C1" Qty: 0

✅ ดูใน Supabase → จะเห็น 3 rows นี้

---

### ตัวอย่างที่ 2: ขายสินค้า
1. คลิก **➖** ที่ Laptop (Qty: 15 → 14)
2. คลิก **➖** อีก 5 ครั้ง (Qty: 14 → 9)
3. ดู Supabase → Qty จะเปลี่ยนเป็น 9 ✅

---

### ตัวอย่างที่ 3: ลบสินค้าที่หมด
1. Keyboard มี Qty = 0
2. คลิก **🗑️** ที่ Keyboard
3. สินค้าหายจาก List และ Supabase ✅

---

### ตัวอย่างที่ 4: ลองลบสินค้าที่ยังมีสต็อก (ต้องหา)
1. Mouse มี Qty = 5
2. คลิก **🗑️** ที่ Mouse → 🚫 ปุ่มปิดอยู่ (disabled)
3. ต้องควั่นให้เหลือ 0 ก่อย ➖➖➖➖➖
4. จึงค่อย 🗑️ ได้

---

## ✅ ตรวจสอบการเชื่อมต่อ

### API Backend ทำงาน ✅
```bash
Invoke-WebRequest -Uri "http://localhost:3000/inventory" -Method GET -UseBasicParsing
```
ผลลัพธ์: `{"success":true,"data":[...]}`

### Frontend โหลดข้อมูล ✅
1. เปิด http://localhost:5173/products
2. จะเห็นความมี่บอก "กำลังโหลดข้อมูล..."
3. หลังจากนั้นจะแสดงรายการสินค้าจาก Supabase

### Supabase บันทึกข้อมูล ✅
https://app.supabase.com → Products table จะอัปเดต

---

## 🔧 วิธี Debug ถ้ามีปัญหา

### ปัญหา: เพิ่มสินค้าแล้วไม่เห็นใน Supabase
1. **ตรวจสอบ Console Log:**
   - Ctrl+Shift+K (f12) → Console Tab
   - ดูว่ามี error หรือไม่

2. **ตรวจสอบ Network:**
   - F12 → Network Tab
   - ลองเพิ่มสินค้า
   - ดูว่า POST /inventory status = 201 หรือไม่

3. **ตรวจสอบ API:**
   ```bash
   Invoke-WebRequest -Uri "http://localhost:3000/inventory" -UseBasicParsing
   ```
   ถ้า error → ตรวจสอบ .env DATABASE_URL ถูกหรือไม่

### ปัญหา: API ไม่ออกมาเลย (port 3000 error)
```bash
# ตรวจสอบว่า bun run dev เพิ่งทำให้
bun run dev
```

---

## 📚 File ที่อัปเดต

1. **src/types.ts** → Product interface ต้องมี SKU, Zone
2. **src/hooks/useInventory.ts** → เชื่อมต่อ API ทั้ง 4 methods
3. **src/pages/Products.tsx** → Form ใหม่ (SKU, Zone แทน Price)

---

## 🎉 สิ่งที่ทำได้ตอนนี้

✅ เพิ่มสินค้า → บันทึก Supabase
✅ ดูรายการสินค้า → ดึงจาก Database
✅ ปรับจำนวน → อัปเดต Supabase
✅ ลบสินค้า (qty=0) → ลบจาก Database

---

**สรุป:** Frontend และ Backend เชื่อมต่อกันแล้ว ✅
ข้อมูลจะบันทึกลง Supabase เสมอ
