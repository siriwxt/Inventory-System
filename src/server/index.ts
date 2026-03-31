import { serve } from "bun";
import { PrismaClient } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const prisma = new PrismaClient();

// TypeBox schema for product creation
const ProductCreateSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  sku: Type.String({ minLength: 1 }),
  zone: Type.String({ minLength: 1 }),
  quantity: Type.Optional(Type.Number({ minimum: 0 })),
});

// Lab 1: ดึงข้อมูลสินค้าคงคลัง (Read / GET)
async function handleGetInventory(req: Request) {
  try {
    const url = new URL(req.url);
    const low_stock = url.searchParams.get("low_stock");

    let products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Filter for low stock if requested (quantity <= 10)
    if (low_stock === "true") {
      products = products.filter((product) => product.quantity <= 10);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: products,
        count: products.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch products",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Lab 2: รับเข้าสินค้าใหม่ (Create / POST)
async function handlePostInventory(req: Request) {
  try {
    const body = await req.json();

    // Validate using TypeBox
    if (!Value.Check(ProductCreateSchema, body)) {
      const errors = Value.Errors(ProductCreateSchema, body);
      const errorMessages = [];
      for (const error of errors) {
        errorMessages.push(`${error.path}: ${error.message}`);
      }
      return new Response(
        JSON.stringify({
          success: false,
          error: "Validation failed",
          details: errorMessages,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku,
        quantity: body.quantity ?? 0,
        zone: body.zone,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: product,
        message: "Product created successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "SKU must be unique",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to create product",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Lab 3: อัปเดตจำนวนสต็อก (Update / PATCH)
async function handlePatchInventory(req: Request, id: string) {
  try {
    const body = await req.json() as { change?: number };

    if (typeof body.change !== "number") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Change is required and must be a number",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Product not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const newQuantity = product.quantity + body.change;

    if (newQuantity < 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Quantity cannot be negative",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedProduct,
        message: `Stock adjusted by ${body.change} units`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to adjust stock",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Lab 4: ลบรายการสินค้าที่ยกเลิกการจำหน่าย (Delete / DELETE)
async function handleDeleteInventory(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Product not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (product.quantity > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Product deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to delete product",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Add CORS headers to response
function addCORSHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Main server handler
function handler(req: Request): Response | Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Routes
  if (pathname === "/inventory" && method === "GET") {
    return handleGetInventory(req).then(addCORSHeaders);
  }

  if (pathname === "/inventory" && method === "POST") {
    return handlePostInventory(req).then(addCORSHeaders);
  }

  const adjustMatch = pathname.match(/^\/inventory\/([^/]+)\/adjust$/);
  if (adjustMatch && method === "PATCH") {
    const id = adjustMatch[1];
    return handlePatchInventory(req, id).then(addCORSHeaders);
  }

  const deleteMatch = pathname.match(/^\/inventory\/([^/]+)$/);
  if (deleteMatch && method === "DELETE") {
    const id = deleteMatch[1];
    return handleDeleteInventory(id).then(addCORSHeaders);
  }

  // 404 Not Found
  return addCORSHeaders(
    new Response(
      JSON.stringify({ success: false, error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    )
  );
}

const port = 3000;
const hostname = "0.0.0.0";

serve(
  {
    port,
    hostname,
    fetch: handler,
  },
  (server) => {
    console.log(`🚀 Inventory API Server is running at http://localhost:${port}`);
  }
);
