import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "PATCH,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(204).end()

  // Lab 3: PATCH /inventory/:id/adjust
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const id = req.query.id as string

  try {
    const { change } = req.body ?? {}

    if (typeof change !== "number") {
      return res.status(400).json({ error: "ข้อมูลการปรับปรุงไม่ถูกต้อง" })
    }

    const product = await db.product.findUnique({ where: { id } })
    if (!product) {
      return res.status(404).json({ error: "ไม่พบสินค้า" })
    }

    const newQuantity = product.quantity + change
    if (newQuantity < 0) {
      return res.status(400).json({ error: "สินค้าในสต็อกไม่เพียงพอ (ห้ามติดลบ)" })
    }

    const updated = await db.product.update({
      where: { id },
      data: { quantity: newQuantity },
    })
    return res.status(200).json(updated)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" })
  }
}
