import { NextResponse } from "next/server";
import { sql, initDbTables, Order } from "@/lib/db";

// Helper function to auto-clean orders completed/shipped for more than 48 hours
async function autoCleanupCompletedOrders() {
  try {
    // Delete orders that are marked as 'shipped' or 'cancelled' and older than 48 hours
    await sql`
      DELETE FROM orders 
      WHERE (status = 'shipped' OR status = 'cancelled') 
      AND created_at < NOW() - INTERVAL '48 hours'
    `;
  } catch (err) {
    console.error("Auto cleanup error:", err);
  }
}

export async function GET() {
  try {
    await initDbTables();
    // Run automatic 48h purge of completed orders on each fetch
    await autoCleanupCompletedOrders();

    const rows = await sql`
      SELECT 
        id, 
        product_title as "productTitle", 
        product_id as "productId", 
        selected_size as "selectedSize", 
        selected_color as "selectedColor", 
        quantity, 
        full_name as "fullName", 
        phone, 
        wilaya_name as "wilayaName", 
        commune, 
        delivery_type as "deliveryType", 
        delivery_price::float as "deliveryPrice", 
        total_price::float as "totalPrice", 
        status, 
        created_at as "createdAt"
      FROM orders
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDbTables();
    const body = await req.json();

    const id = "DZ-" + Math.floor(100000 + Math.random() * 900000);
    const productTitle = body.productTitle || "منتج";
    const productId = body.productId || "";
    const selectedSize = body.selectedSize || "M";
    const selectedColor = body.selectedColor || "";
    const quantity = Number(body.quantity) || 1;
    const fullName = body.fullName || "";
    const phone = body.phone || "";
    const wilayaName = body.wilayaName || "";
    const commune = body.commune || "";
    const deliveryType = body.deliveryType || "home";
    const deliveryPrice = Number(body.deliveryPrice) || 0;
    const totalPrice = Number(body.totalPrice) || 0;

    await sql`
      INSERT INTO orders (id, product_title, product_id, selected_size, selected_color, quantity, full_name, phone, wilaya_name, commune, delivery_type, delivery_price, total_price, status)
      VALUES (${id}, ${productTitle}, ${productId}, ${selectedSize}, ${selectedColor}, ${quantity}, ${fullName}, ${phone}, ${wilayaName}, ${commune}, ${deliveryType}, ${deliveryPrice}, ${totalPrice}, 'pending')
    `;

    return NextResponse.json({ success: true, order: { id, fullName, totalPrice } });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await initDbTables();
    const { orderId, status } = await req.json();
    await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${orderId}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

// Direct immediate delete if needed by admin
export async function DELETE(req: Request) {
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing orderId" }, { status: 400 });
    }

    await sql`
      DELETE FROM orders 
      WHERE id = ${orderId}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}