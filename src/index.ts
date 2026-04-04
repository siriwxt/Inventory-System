import http from "http"
import { PrismaClient } from "@prisma/client"
import { URL } from "url"

const db = new PrismaClient()
const PORT = Number(process.env.PORT || 3000)

const sendJson = (res: http.ServerResponse, code: number, payload: any) => {
  const body = JSON.stringify(payload)
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  })
  res.end(body)
}

const parseBody = async (req: http.IncomingMessage) => {
  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) return {}
  const raw = Buffer.concat(chunks).toString("utf-8")
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) {
    sendJson(res, 400, { error: "Invalid request" })
    return
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const pathname = url.pathname
  const method = req.method.toUpperCase()

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    })
    res.end()
    return
  }

  try {
    if (method === "GET" && pathname === "/inventory") {
      const isLowStock = url.searchParams.get("low_stock") === "true"
      const products = await db.product.findMany({
        where: isLowStock ? { quantity: { lte: 10 } } : {},
        orderBy: { name: "asc" }
      })
      sendJson(res, 200, products)
      return
    }

    if (method === "POST" && pathname === "/inventory") {
      const body = await parseBody(req)
      if (!body || !body.name || !body.sku || !body.zone) {
        sendJson(res, 400, { error: "ข้อมูลสินค้าไม่ครบหรือไม่ถูกต้อง" })
        return
      }

      try {
        const product = await db.product.create({
          data: {
            name: String(body.name),
            sku: String(body.sku),
            zone: String(body.zone),
            quantity: Number(body.quantity ?? 0)
          }
        })
        sendJson(res, 201, product)
      } catch (error) {
        sendJson(res, 400, { error: "SKU ซ้ำ หรือข้อมูลไม่ถูกต้อง" })
      }
      return
    }

    const pathParts = pathname.split("/").filter(Boolean)
    if (pathParts[0] === "inventory" && pathParts.length >= 2) {
      const id = pathParts[1]

      if (method === "PATCH" && pathParts[2] === "adjust") {
        const body = await parseBody(req)
        if (!body || typeof body.change !== "number") {
          sendJson(res, 400, { error: "ข้อมูลการปรับปรุงไม่ถูกต้อง" })
          return
        }

        const product = await db.product.findUnique({ where: { id } })
        if (!product) {
          sendJson(res, 404, { error: "ไม่พบสินค้า" })
          return
        }

        const newQuantity = product.quantity + body.change
        if (newQuantity < 0) {
          sendJson(res, 400, { error: "สินค้าในสต็อกไม่เพียงพอ (ห้ามติดลบ)" })
          return
        }

        const updated = await db.product.update({
          where: { id },
          data: { quantity: newQuantity }
        })
        sendJson(res, 200, updated)
        return
      }

      if (method === "DELETE" && pathParts.length === 2) {
        const product = await db.product.findUnique({ where: { id } })
        if (!product) {
          sendJson(res, 404, { error: "ไม่พบสินค้า" })
          return
        }

        if (product.quantity > 0) {
          sendJson(res, 400, { error: "ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้" })
          return
        }

        await db.product.delete({ where: { id } })
        sendJson(res, 200, { success: true })
        return
      }
    }

    sendJson(res, 404, { error: "ไม่พบเส้นทางนี้" })
  } catch (error) {
    console.error(error)
    sendJson(res, 500, { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" })
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Backend running at port ${PORT}`)
})
