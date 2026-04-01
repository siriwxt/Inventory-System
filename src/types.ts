export interface Product {
  id: string    // เปลี่ยนเป็น string เพราะ Backend ใช้ UUID
  name: string
  sku: string   // เพิ่มตามโจทย์
  quantity: number
  zone: string  // เพิ่มตามโจทย์
  // price: number // ถ้าใน DB ไม่มีฟิลด์นี้ ให้ระวังตอนแสดงผล
}