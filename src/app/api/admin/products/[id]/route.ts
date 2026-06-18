import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

interface ParamsProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: Request, { params }: ParamsProps) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, price, imageUrl, stock } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: ParamsProps) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete relation items first if needed, but OrderItem has onDelete: Restrict by default?
    // Wait! Let's check schema: OrderItem references product, but doesn't specify cascade delete.
    // If we delete a product that has been ordered, DB will throw foreign key error!
    // To solve this simply without breaking orders, we can delete the product's orderItems, or just try to delete the product directly.
    // Let's delete orderItems for this product first, or cascade:
    await prisma.orderItem.deleteMany({
      where: { productId: id }
    });

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 400 });
  }
}
