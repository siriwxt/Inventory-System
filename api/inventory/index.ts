import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(204).end()

  try {
    // Lab 1: GET /inventory
    if (req.method === "GET") {
      const isLowStock = req.query.low_stock === "true"
      const products = await db.product.findMany({
        where: isLowStock ? { quantity: { lte: 10 } } : {},
        orderBy: { name: "asc" },
      })
      return res.status(200).json(products)
    }

    // Lab 2: POST /inventory
    if (req.method === "POST") {
      const { name, sku, zone, quantity } = req.body ?? {}

      if (!name || !sku || !zone) {
        return res.status(400).json({ error: "ข้อมูลสินค้าไม่ครบหรือไม่ถูกต้อง" })
      }

      try {
        const product = await db.product.create({
          data: {
            name: String(name),
            sku: String(sku),
            zone: String(zone),
            quantity: Number(quantity ?? 0),
          },
        })
        return res.status(201).json(product)
      } catch {
        return res.status(400).json({ error: "SKU ซ้ำ หรือข้อมูลไม่ถูกต้อง" })
      }
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" })
  }
}
