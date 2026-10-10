import { neon } from "@neondatabase/serverless";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  description: string;
  badge?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock?: boolean;
  isDeleted?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  productTitle: string;
  productId: string;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
  fullName: string;
  phone: string;
  wilayaName: string;
  commune: string;
  deliveryType: "home" | "desk";
  deliveryPrice: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: "inventory" | "ads" | "packaging" | "shipping" | "other";
  type: "expense" | "income";
  notes?: string;
  createdAt: string;
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(dbUrl);

export async function initDbTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      price NUMERIC NOT NULL,
      original_price NUMERIC,
      description TEXT,
      badge TEXT,
      sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
      colors JSONB NOT NULL DEFAULT '[]'::jsonb,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      in_stock BOOLEAN DEFAULT TRUE,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Safely ensure is_deleted and in_stock columns exist for existing tables
  try {
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;`;
  } catch (err) {
    // columns already exist
  }

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      product_title TEXT NOT NULL,
      product_id TEXT,
      selected_size TEXT,
      selected_color TEXT,
      quantity INT DEFAULT 1,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      wilaya_name TEXT NOT NULL,
      commune TEXT,
      delivery_type TEXT DEFAULT 'home',
      delivery_price NUMERIC DEFAULT 0,
      total_price NUMERIC NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      category TEXT DEFAULT 'other',
      type TEXT DEFAULT 'expense',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

}