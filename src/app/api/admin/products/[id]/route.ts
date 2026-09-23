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

    if (!existingProduct || existingProduct.archived) {
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

    if (!existingProduct || existingProduct.archived) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Products that appear in orders are archived rather than deleted so order history stays intact
    const orderCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderCount > 0) {
      await prisma.product.update({
        where: { id },
        data: { archived: true }
      });
    } else {
      await prisma.product.delete({
        where: { id }
      });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 400 });
  }
}
