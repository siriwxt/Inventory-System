# 🧪 ทดสอบการเชื่อมต่อ Database

## ✅ Checklist ตรวจสอบ

### 1️⃣ API Server ทำงาน (http://localhost:3000)
```bash
Invoke-WebRequest -Uri "http://localhost:3000/inventory" -UseBasicParsing
```
**ผลลัพธ์ที่ควรได้:**
```
StatusCode: 200
Content: {"success":true,"data":[...],"count":...}
```

---

### 2️⃣ Frontend Server ทำงาน (http://localhost:5173) 
```bash
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
```
**ผลลัพธ์ที่ควรได้:**
```
StatusCode: 200
```

---

### 3️⃣ ทดสอบเพิ่มสินค้า via API
```bash
$body = @{ name="TestLab"; sku="TEST-LAB-001"; zone="Z1"; quantity=10 } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/inventory" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```
**ผลลัพธ์ที่ควรได้:**
```json
{
  "success": true,
  "data": {
    "id": "3afc1026-156b-4ba5-8340-e94cd18eef6d",
    "name": "TestLab",
    "sku": "TEST-LAB-001",
    "zone": "Z1",
    "quantity": 10,
    "createdAt": "2026-03-31T21:14:24.917Z",
    "updatedAt": "2026-03-31T21:14:24.917Z"
  },
  "message": "Product created successfully"
}
```

---

### 4️⃣ ตรวจสอบ Supabase Database

**วิธี:**
1. เปิด https://app.supabase.com
2. เข้า project ของคุณ
3. ไปที่ Editor → Tables
4. เลือก **products** table
5. จะเห็นแถวที่เพิ่มจากทั้ง API และ Frontend

---

### 5️⃣ ทดสอบเพิ่มสินค้า via Frontend

**วิธี:**
1. เปิด http://localhost:5173/products
2. กรอกข้อมูล:
   ```
   ชื่อสินค้า: My Test Product
   รหัส (SKU): MYTEST-001
   โซน: A1
   จำนวน: 20
   ```
3. คลิก "เพิ่ม"
4. ✅ สินค้าปรากฏใน Table

**ตรวจสอบ:**
- [ ] สินค้าปรากฏใน Frontend Table
- [ ] เปิด Supabase → products table มีแถวใหม่
- [ ] ข้อมูลตรงกัน (name, sku, zone, quantity)

---

### 6️⃣ ทดสอบปรับจำนวนสินค้า

**วิธี:**
1. หาสินค้า "My Test Product" ในตาราง
2. คลิก **➕** 3 ครั้ง (จำนวน 20 → 23)
3. ตรวจสอบ Supabase → quantity เปลี่ยนเป็น 23

---

### 7️⃣ ทดสอบลบสินค้า

**วิธี:**
1. สร้างสินค้าใหม่ชื่อ "Delete Test"
2. ปรับจำนวนเป็น 0 (คลิก ➖ ซ้ำๆ)
3. คลิก 🗑️
4. ✅ สินค้าหายจาก Table
5. ตรวจสอบ Supabase → แถวหายแล้ว

---

### 8️⃣ ทดสอบ Validation

**ลองเพิ่มสินค้าข้อมูลไม่ครบ:**
1. กรอก "Product Name" แต่ไม่กรอก SKU & Zone
2. คลิก "เพิ่ม"
3. ✅ จะเห็น Alert: "กรุณากรอกชื่อสินค้า รหัส และโซนให้ครบถ้วน"

**ลองใช้ SKU ซ้ำ:**
1. สร้าง "Product A" SKU: "SAME-001"
2. สร้าง "Product B" SKU: "SAME-001"
3. ✅ จะเห็น Alert: "SKU must be unique"

**ลองลบสินค้าที่ยังมีสต็อก:**
1. สร้างสินค้า quantity = 5
2. คลิก 🗑️
3. ✅ ปุ่มจะ disabled (ปิดอยู่)

---

## ✅ Test Report Template

```
Date: ___________
Tester: _________ 

API Server: ☐ Working ☐ Error
Frontend Server: ☐ Working ☐ Error
Add Product: ☐ Pass ☐ Fail
See in Supabase: ☐ Pass ☐ Fail
Update Quantity: ☐ Pass ☐ Fail
Delete Product: ☐ Pass ☐ Fail
Validation: ☐ Pass ☐ Fail

Overall: ☐ All Pass ☐ Some Fail

Notes:
_________________________________
_________________________________
```

---

## 🐛 Troubleshooting

### API ไม่ตอบสนอง (connection refused)
```bash
# ตรวจสอบ process
Get-Process | Where-Object {$_.ProcessName -like "*bun*"}

# Restart
bun run dev
```

### Frontend Error: Cannot fetch from API
- [ ] ตรวจสอบ API port 3000 ทำงาน
- [ ] ตรวจสอบ CORS headers ถูก
- [ ] ดู Browser Console (F12) หา error

### Supabase connection error
- [ ] ตรวจสอบ .env DATABASE_URL ถูก
- [ ] ตรวจสอบ DIRECT_URL ถูก
- [ ] ตรวจสอบ Supabase instance online

### SKU duplicate error ทั้งที่ ไม่ซ้ำ
- [ ] ลองใช้ SKU ที่บิลไม่ซ้ำแน่นอน เช่น เพิ่ม timestamp
- [ ] ไปลบข้อมูลเก่าใน Supabase

---

## ✨ Success Indicator

✅ ทั้งหมด Pass เมื่อ:
1. Frontend & API ตอบสนอง
2. เพิ่มสินค้าจาก Frontend → ปรากฏใน Supabase
3. ปรับจำนวน → Supabase อัปเดต
4. ลบสินค้า (qty=0) → หายจาก Supabase
5. Validation ทำงาน (ไม่บันทึกข้อมูลไม่ครบ)

---

**เมื่อข้อ 1-5 ทั้งหมด Pass = ✅ System Ready for Use**
