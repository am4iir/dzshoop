import { NextResponse } from "next/server";
import { sql, initDbTables, restoreDefaultProducts } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true";

    let rows;
    if (includeAll) {
      rows = await sql`
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
          COALESCE(in_stock, true) as "inStock", 
          COALESCE(is_deleted, false) as "isDeleted",
          created_at as "createdAt"
        FROM products
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
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
          COALESCE(in_stock, true) as "inStock", 
          COALESCE(is_deleted, false) as "isDeleted",
          created_at as "createdAt"
        FROM products
        WHERE is_deleted IS NOT TRUE
        ORDER BY created_at DESC
      `;
    }
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

    // Check if request is to restore default products
    if (body.action === "restore-defaults") {
      await restoreDefaultProducts();
      return NextResponse.json({ success: true, message: "Default products restored" });
    }
    
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
      INSERT INTO products (id, name, subtitle, price, original_price, description, badge, sizes, colors, images, is_deleted)
      VALUES (${id}, ${name}, ${subtitle}, ${price}, ${originalPrice}, ${description}, ${badge}, ${sizes}::jsonb, ${colors}::jsonb, ${images}::jsonb, FALSE)
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await initDbTables();
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product id" }, { status: 400 });
    }

    if (action === "delete") {
      await sql`UPDATE products SET is_deleted = TRUE WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: "Product deleted (hidden from store)" });
    } else if (action === "restore") {
      await sql`UPDATE products SET is_deleted = FALSE WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: "Product restored to store" });
    } else if (action === "toggle-stock") {
      const inStock = Boolean(body.inStock);
      await sql`UPDATE products SET in_stock = ${inStock} WHERE id = ${id}`;
      return NextResponse.json({ 
        success: true, 
        inStock, 
        message: inStock ? "تم تفعيل توفر المنتج في المخزن" : "تم تعيين المنتج: نفدت الكمية" 
      });
    } else if (action === "promotion") {
      const price = Number(body.price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json({ success: false, error: "سعر غير صالح" }, { status: 400 });
      }
      const originalPrice = body.originalPrice !== null && body.originalPrice !== undefined && body.originalPrice !== ""
        ? Number(body.originalPrice)
        : null;
      const badge = typeof body.badge === "string" ? body.badge.trim() : "";

      await sql`
        UPDATE products 
        SET price = ${price}, original_price = ${originalPrice}, badge = ${badge} 
        WHERE id = ${id}
      `;
      return NextResponse.json({ success: true, message: "تم تحديث التخفيض بنجاح" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const permanent = searchParams.get("permanent") === "true";

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product id" }, { status: 400 });
    }

    if (permanent) {
      await sql`DELETE FROM products WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: "Product permanently deleted" });
    } else {
      await sql`UPDATE products SET is_deleted = TRUE WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: "Product soft deleted" });
    }
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}