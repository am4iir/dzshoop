import { NextResponse } from "next/server";
import { sql, initDbTables, Product } from "@/lib/db";

export async function GET() {
  try {
    await initDbTables();
    const rows = await sql`
      SELECT 
        id, 
        name, 
        subtitle, 
        price::float as price, 
        original_price::float as "originalPrice", 
        description, 
        badge, 
        sizes, 
        colors, 
        images, 
        in_stock as "inStock", 
        created_at as "createdAt"
      FROM products
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDbTables();
    const body = await req.json();
    
    const id = "prod-" + Date.now();
    const name = body.name || "منتج جديد";
    const subtitle = body.subtitle || "";
    const price = Number(body.price) || 2000;
    const originalPrice = Number(body.originalPrice) || price;
    const description = body.description || "";
    const badge = body.badge || "";
    const sizes = JSON.stringify(Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ["S", "M", "L", "XL"]);
    const colors = JSON.stringify(Array.isArray(body.colors) && body.colors.length > 0 ? body.colors : ["أسود"]);
    const images = JSON.stringify(Array.isArray(body.images) && body.images.length > 0 
      ? body.images 
      : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"]);

    await sql`
      INSERT INTO products (id, name, subtitle, price, original_price, description, badge, sizes, colors, images)
      VALUES (${id}, ${name}, ${subtitle}, ${price}, ${originalPrice}, ${description}, ${badge}, ${sizes}::jsonb, ${colors}::jsonb, ${images}::jsonb)
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}