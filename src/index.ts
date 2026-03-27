  //****************************************//
 //                IMPORTS                 //
//****************************************//

import express from "express"
import { PrismaClient } from "./generated/prisma/client.js"
import "dotenv/config"
import { withAccelerate } from "@prisma/extension-accelerate"
import { z } from "zod"

  //****************************************//
 //               VARIABLES                //
//****************************************//


const app = express()
app.use(express.json())
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate())
const port = 3000

  //****************************************//
 //                SCHEMAS                 //
//****************************************//

const productSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50),
  price: z
    .number()
    .positive(),
  stock: z
    .number()
    .int()
    .min(0),
  categoryId: z
    .number()
    .int()
    .positive(),
})

const patchProductSchema = productSchema.partial()

  //****************************************//
 //                HELPERS                 //
//****************************************//

const sendError = (res: express.Response, stat: number, error: unknown): void => {
  const msg = error instanceof Error ? error.message : String(error)
  res.status(stat).json({ error: msg })
}

  //****************************************//
 //                 ROUTES                 //
//****************************************//

// POST /products
app.post("/products", async (req, res) => {
  const result = productSchema.safeParse(req.body)
  if (!result.success) return sendError(res, 400, result.error.message)
  try {
    const product = await prisma.product.create({ data: result.data })
    res.json(product)
  } catch (error) {
    sendError(res, 500, error)
  }
})

// GET /products?category=Electronics
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: req.query.category as string
        }
      }
    })
    if (!products.length) return sendError(res, 404, new Error("No products found"))
    res.json(products)
  } catch (error) {
    sendError(res, 500, error)
  }
})

// PATCH /products/:productId
app.patch("/products/:productId", async (req, res) => {
  const result = patchProductSchema.safeParse(req.body)
  if (!result.success) return sendError(res, 400, result.error.message)
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.productId)},
    })
    if (!product) return sendError(res, 404, new Error("Product not found"))
    
    const updated = await prisma.product.update({
      where: { id: Number(req.params.productId) },
      data: result.data as object,
    })
    res.json(updated)
  } catch (error) {
    sendError(res, 500, error)
  }
})

// DELETE /orders/:orderId
app.delete("/orders/:orderId", async (req, res) => {
  try {
    await prisma.orderItem.deleteMany({
      where: { orderId: Number(req.params.orderId) }
    })
    const deleted = await prisma.order.delete({
      where: { id: Number(req.params.orderId) }
    })
    res.json(deleted)
  } catch (error) {
    sendError(res, 500, error)
  }
})


app.listen(3000, () => {
  console.log(`Server listen on port ${port}`)
})