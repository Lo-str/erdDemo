import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client.js"
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate())



const seed = async () => { 
    // Categories
    const electronics = await prisma.category.create({ data: { name: "Electronics" } }); 
    const books = await prisma.category.create({ data: { name: "Books" } });
    const clothing = await prisma.category.create({ data: { name: "Clothing" } })
    const sports = await prisma.category.create({ data: { name: "Sports" } })
    const homeGarden = await prisma.category.create({ data: { name: "Home & Garden" } })

    // Products
    const p1 = await prisma.product.create({ data: { name: "Sony Headphones", price: 599, stock: 25, categoryId: electronics.id } })
    const p2 = await prisma.product.create({ data: { name: "Kindle Paperwhite", price: 149, stock: 60, categoryId: electronics.id } })
    const p3 = await prisma.product.create({ data: { name: "The Pragmatic Programmer", price: 45, stock: 100, categoryId: books.id } })
    const p4 = await prisma.product.create({ data: { name: "Clean Code", price: 39, stock: 80, categoryId: books.id } })
    const p5 = await prisma.product.create({ data: { name: "Levi's 501 Jeans", price: 89, stock: 40, categoryId: clothing.id } })
    const p6 = await prisma.product.create({ data: { name: "Nike Running Shoes", price: 129, stock: 35, categoryId: sports.id } })
    const p7 = await prisma.product.create({ data: { name: "Yoga Mat", price: 35, stock: 50, categoryId: sports.id } })
    const p8 = await prisma.product.create({ data: { name: "LED Desk Lamp", price: 49, stock: 70, categoryId: homeGarden.id } })
    const p9 = await prisma.product.create({ data: { name: "Mechanical Keyboard", price: 249, stock: 20, categoryId: electronics.id } })
    const p10 = await prisma.product.create({ data: { name: "Wool Sweater", price: 69, stock: 30, categoryId: clothing.id } })

    // Customers
    const alice = await prisma.customer.create({ data: { name: "Alice Bergström", email: "alice.bergstrom@email.com" } })
    const bob = await prisma.customer.create({ data: { name: "Bob Traoré", email: "bob.traore@email.com" } })
    const camille = await prisma.customer.create({ data: { name: "Camille Dupont", email: "camille.dupont@email.com" } })
    const rohan = await prisma.customer.create({ data: { name: "Rohan Sharma", email: "rohan.sharma@email.com" } })
    const yuki = await prisma.customer.create({ data: { name: "Yuki Tanaka", email: "yuki.tanaka@email.com" } })

    // Orders
    const order1 = await prisma.order.create({ data: { customerId: alice.id } })
    const order2 = await prisma.order.create({ data: { customerId: bob.id } })
    const order3 = await prisma.order.create({ data: { customerId: camille.id } })
    const order4 = await prisma.order.create({ data: { customerId: rohan.id } })
    const order5 = await prisma.order.create({ data: { customerId: yuki.id } })
    
    // Order Items
    await prisma.orderItem.create({ data: { orderId: order1.id, productId: p1.id, quantity: 1 } })
    await prisma.orderItem.create({ data: { orderId: order1.id, productId: p3.id, quantity: 2 } })
    await prisma.orderItem.create({ data: { orderId: order2.id, productId: p6.id, quantity: 1 } })
    await prisma.orderItem.create({ data: { orderId: order2.id, productId: p7.id, quantity: 1 } })
    await prisma.orderItem.create({ data: { orderId: order3.id, productId: p5.id, quantity: 2 } })
    await prisma.orderItem.create({ data: { orderId: order3.id, productId: p10.id, quantity: 1 } })
    await prisma.orderItem.create({ data: { orderId: order4.id, productId: p9.id, quantity: 1 } })
    await prisma.orderItem.create({ data: { orderId: order4.id, productId: p4.id, quantity: 3 } })
    await prisma.orderItem.create({ data: { orderId: order5.id, productId: p2.id, quantity: 1 } })
    await prisma.orderItem.create({ data: { orderId: order5.id, productId: p8.id, quantity: 2 } })

    console.log("Seeding finished"); 
    } 

    seed().then(() => prisma.$disconnect())

    .catch((e) => { console.error(e); process.exit(1); }) 
    .finally(async () => { await prisma.$disconnect(); }); 

