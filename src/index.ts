import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const app = new Elysia();

app.use(cors()); 

app.group('/inventory', (app) =>
  app
    .get('/', async ({ query }) => {
      const isLowStock = query.low_stock === 'true';
      return await db.product.findMany({
        where: isLowStock ? { quantity: { lte: 10 } } : {},
        orderBy: { name: 'asc' }
      });
    }, {
      query: t.Object({ low_stock: t.Optional(t.String()) })
    })

    .post('/', async ({ body, set }) => {
      try {
        return await db.product.create({ data: body });
      } catch (e) {
        set.status = 400;
        return { error: "SKU ซ้ำ หรือข้อมูลไม่ถูกต้อง" };
      }
    }, {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        sku: t.String({ minLength: 1 }),
        zone: t.String({ minLength: 1 }),
        quantity: t.Optional(t.Numeric({ default: 0 }))
      })
    })

  .patch('/:id/adjust', async ({ params: { id }, body, set }) => {
    const product = await db.product.findUnique({ where: { id } });
    
    if (!product) { 
      set.status = 404; 
      return { error: "ไม่พบสินค้า" }; 
    }

    const newQuantity = product.quantity + body.change;

    if (newQuantity < 0) {
      set.status = 400;
      return { error: "สินค้าในสต็อกไม่เพียงพอ (ห้ามติดลบ)" };
    }

    return await db.product.update({
      where: { id },
      data: { quantity: newQuantity }
    });
  }, {
    body: t.Object({ change: t.Number() })
  })

    .delete('/:id', async ({ params: { id }, set }) => {
      const product = await db.product.findUnique({ where: { id } });
      if (!product) { set.status = 404; return { error: "ไม่พบสินค้า" }; }

      if (product.quantity > 0) {
        set.status = 400;
        return { error: "ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้" };
      }

      await db.product.delete({ where: { id } });
      return { success: true };
    })
);

app.listen(3000, () => console.log('🚀 Backend running at port 3000'));