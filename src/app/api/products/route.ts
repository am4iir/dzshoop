import { NextResponse } from "next/server";
import { getStoreData, saveStoreData, Product } from "@/lib/db";

export async function GET() {
  const store = getStoreData();
  return NextResponse.json(store.products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const store = getStoreData();
    
    const newProduct: Product = {
      id: "prod-" + Date.now(),
      name: body.name || "منتج جديد",
      subtitle: body.subtitle || "",
      price: Number(body.price) || 2000,
      originalPrice: Number(body.originalPrice) || Number(body.price) || 2500,
      description: body.description || "",
      badge: body.badge || "",
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ["S", "M", "L", "XL"],
      colors: Array.isArray(body.colors) && body.colors.length > 0 ? body.colors : ["أسود"],
      images: Array.isArray(body.images) && body.images.length > 0 
        ? body.images 
        : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"],
      inStock: true,
      createdAt: new Date().toISOString()
    };

    store.products.unshift(newProduct);
    saveStoreData(store);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
