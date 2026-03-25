import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client.js"
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate())



const seed = async () => { 
    const electronics = await prisma.category.create({ data: { name: "Electronics" } }); 
    const books = await prisma.category.create({ data: { name: "Books" } }); 

    const productA = await prisma.product.create({ data: { 
        name: "Headphones", 
        price: 599, 
        stock: 25, 
        categoryId: electronics.id } 
    }); 
    const productB = await prisma.product.create({ data: { 
        name: "Novel", 
        price: 149, 
        stock: 100, 
        categoryId: books.id 
        } 
    });

    const alice = await prisma.customer.create({ data: { name: "Alice", email: "alice@example.com" } }); 
    const bob = await prisma.customer.create({ data: { name: "Bob", email: "bob@example.com" } }); 

    const order1 = await prisma.order.create({ data: { customerId: alice.id } }); 
    await prisma.orderItem.create({ data: { 
        orderId: order1.id,
        productId: productA.id, 
        quantity: 1 } 
    }); 
    await prisma.orderItem.create({ data: { 
        orderId: order1.id, 
        productId: productB.id, 
        quantity: 2 } 
    }); 

    const order2 = await prisma.order.create({ data: { customerId: bob.id } }); 
    await prisma.orderItem.create({ data: { 
        orderId: order2.id, 
        productId: productB.id, 
        quantity: 1 } }); 

    console.log("Seeding finished"); 
    } 

    seed().then(() => prisma.$disconnect())

    .catch((e) => { console.error(e); process.exit(1); }) 
    .finally(async () => { await prisma.$disconnect(); }); 

