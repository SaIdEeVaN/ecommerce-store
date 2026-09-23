import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    for (const item of items) {
      if (typeof item?.id !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json({ error: "Invalid order item" }, { status: 400 });
      }
    }

    // Process order creation and stock adjustment in a single Prisma transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify and update stock for all items, pricing from the database (never trust client prices)
      const orderItems: { productId: string; quantity: number; price: number }[] = [];
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product || product.archived) {
          throw new Error(`Product not found: ${item.name}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
      }

      // Same pricing rules as the checkout page: free shipping over $150, 8% tax
      const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const shippingCost = subtotal > 150 ? 0 : 15;
      const totalAmount = subtotal + shippingCost + subtotal * 0.08;

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          status: "PENDING",
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: true
        }
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order processing failed:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 400 });
  }
}
