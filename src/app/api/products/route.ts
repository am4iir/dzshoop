import { NextResponse } from "next/server";
import { sql, initDbTables, restoreDefaultProducts } from "@/lib/db";
import { isAdminAuthorized, isCsrfProtectedRequest, isSameOrigin, unauthorizedResponse } from "@/lib/auth";
import { logger } from "@/lib/logger";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function validateImages(images: unknown): images is string[] {
  if (!Array.isArray(images) || images.length > 4) return false;
  return images.every((image) => {
    if (typeof image !== "string" || image.length > MAX_IMAGE_BYTES * 1.4) return false;
    if (image.startsWith("data:")) {
      const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if (!match || Math.ceil((match[2].length * 3) / 4) > MAX_IMAGE_BYTES) return false;
      const bytes = Buffer.from(match[2], "base64");
      if (match[1] === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      if (match[1] === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
    }
    try {
      return new URL(image).protocol === "https:";
    } catch {
      return false;
    }
  });
}

export async function GET(req: Request) {
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true";

    // Admin-only: fetching all products (including deleted) requires auth
    if (includeAll && !isAdminAuthorized(req)) {
      return unauthorizedResponse();
    }

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
    logger.error("products_fetch_failed");
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isSameOrigin(req) || !isAdminAuthorized(req) || !isCsrfProtectedRequest(req)) return unauthorizedResponse();
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
    if (body.images !== undefined && !validateImages(body.images)) {
      return NextResponse.json({ success: false, error: "Invalid image format or size" }, { status: 400 });
    }
    if (body.images !== undefined && !validateImages(body.images)) {
      return NextResponse.json({ success: false, error: "Invalid image format or size" }, { status: 400 });
    }
    const images = JSON.stringify(Array.isArray(body.images) && body.images.length > 0 
      ? body.images 
      : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"]);

    await sql`
      INSERT INTO products (id, name, subtitle, price, original_price, description, badge, sizes, colors, images, is_deleted)
      VALUES (${id}, ${name}, ${subtitle}, ${price}, ${originalPrice}, ${description}, ${badge}, ${sizes}::jsonb, ${colors}::jsonb, ${images}::jsonb, FALSE)
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    logger.error("product_creation_failed");
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isSameOrigin(req) || !isAdminAuthorized(req) || !isCsrfProtectedRequest(req)) return unauthorizedResponse();
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
    } else if (action === "update" || action === "edit") {
      const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "منتج بدون اسم";
      const subtitle = typeof body.subtitle === "string" ? body.subtitle.trim() : "";
      const price = Number(body.price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json({ success: false, error: "يرجى تحديد سعر صحيح للمنتج" }, { status: 400 });
      }
      const originalPrice = body.originalPrice !== null && body.originalPrice !== undefined && body.originalPrice !== ""
        ? Number(body.originalPrice)
        : null;
      const description = typeof body.description === "string" ? body.description : "";
      const badge = typeof body.badge === "string" ? body.badge.trim() : "";
      const sizes = JSON.stringify(Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ["S", "M", "L", "XL"]);
      const colors = JSON.stringify(Array.isArray(body.colors) && body.colors.length > 0 ? body.colors : ["أسود"]);

      if (body.images !== undefined && !validateImages(body.images)) {
        return NextResponse.json({ success: false, error: "Invalid image format or size" }, { status: 400 });
      }
      if (body.images !== undefined && !validateImages(body.images)) {
        return NextResponse.json({ success: false, error: "Invalid image format or size" }, { status: 400 });
      }
      if (Array.isArray(body.images) && body.images.length > 0) {
        const images = JSON.stringify(body.images);
        await sql`
          UPDATE products 
          SET name = ${name}, subtitle = ${subtitle}, price = ${price}, original_price = ${originalPrice}, 
              description = ${description}, badge = ${badge}, sizes = ${sizes}::jsonb, colors = ${colors}::jsonb, 
              images = ${images}::jsonb 
          WHERE id = ${id}
        `;
      } else {
        await sql`
          UPDATE products 
          SET name = ${name}, subtitle = ${subtitle}, price = ${price}, original_price = ${originalPrice}, 
              description = ${description}, badge = ${badge}, sizes = ${sizes}::jsonb, colors = ${colors}::jsonb 
          WHERE id = ${id}
        `;
      }

      return NextResponse.json({ success: true, message: "تم تعديل بيانات المنتج بنجاح" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    logger.error("product_update_failed");
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isSameOrigin(req) || !isAdminAuthorized(req) || !isCsrfProtectedRequest(req)) return unauthorizedResponse();
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
    logger.error("product_deletion_failed");
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}