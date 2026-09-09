import { NextResponse } from "next/server";
import { getStoreData, saveStoreData, Order } from "@/lib/db";

export async function GET() {
  const store = getStoreData();
  return NextResponse.json(store.orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const store = getStoreData();

    const newOrder: Order = {
      id: "DZ-" + Math.floor(100000 + Math.random() * 900000),
      productTitle: body.productTitle || "منتج",
      productId: body.productId || "",
      selectedSize: body.selectedSize || "M",
      selectedColor: body.selectedColor || "",
      quantity: Number(body.quantity) || 1,
      fullName: body.fullName || "",
      phone: body.phone || "",
      wilayaName: body.wilayaName || "",
      commune: body.commune || "",
      deliveryType: body.deliveryType || "home",
      deliveryPrice: Number(body.deliveryPrice) || 0,
      totalPrice: Number(body.totalPrice) || 0,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    store.orders.unshift(newOrder);
    saveStoreData(store);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();
    const store = getStoreData();
    const order = store.orders.find((o) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    order.status = status;
    saveStoreData(store);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
