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

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_yaAHuZhE2cs6@ep-small-leaf-awynx2zm-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

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

  // Seed default products if table is empty
  const existing = await sql`SELECT COUNT(*) as count FROM products`;
  if (Number(existing[0]?.count || 0) === 0) {
    await sql`
      INSERT INTO products (id, name, subtitle, price, original_price, description, badge, sizes, colors, images)
      VALUES 
      (
        'p1',
        'T-shirt polo (noir/bleu nuit) premium quality',
        'Black polo shirt slim fit 2 عروض',
        2600,
        3200,
        'بولو عالي الجودة قطن 100% بتطريز أنيق وقصة مريحة تناسب مختلف الإطلالات.',
        '-20%',
        '["S", "M", "L", "XL"]'::jsonb,
        '["أسود", "أزرق ليلي"]'::jsonb,
        '["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"]'::jsonb
      ),
      (
        'p2',
        'Slim fit t-shirt',
        'Black Slim fit t-shirt ✨',
        2000,
        2500,
        'تيشيرت سليم فيت يبرز تفاصيل الجسم، نسيج ناعم ومطاطي مريح للغاية لجميع المناسبات اليومية.',
        '-20%',
        '["S", "M", "L", "XL"]'::jsonb,
        '["أسود مات", "أبيض"]'::jsonb,
        '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"]'::jsonb
      ),
      (
        'p3',
        'Bootcut jean',
        'Jeans denim brut premium',
        5500,
        6000,
        'جينز بوتكات كلاسيكي بقماش دينيم أصلي مريح وثابت بعد الغسيل مع تفاصيل خياطة متقنة.',
        '-8%',
        '["38", "40", "42", "44"]'::jsonb,
        '["أزرق داكن", "أسود"]'::jsonb,
        '["https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop"]'::jsonb
      ),
      (
        'p4',
        'Ensemble baggy jogger gris/noir',
        'Wide leg heavyweight streetwear',
        3300,
        3800,
        'أنبل باجي جوغر مريح بقصة عريضة تريند، مثالي للإطلالات الشبابية والرياضية.',
        '-13%',
        '["M", "L", "XL", "XXL"]'::jsonb,
        '["رمادي ميلانج", "أسود"]'::jsonb,
        '["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop"]'::jsonb
      );
    `;
  }
}

export async function restoreDefaultProducts() {
  await initDbTables();
  const defaultItems = [
    {
      id: 'p1',
      name: 'T-shirt polo (noir/bleu nuit) premium quality',
      subtitle: 'Black polo shirt slim fit 2 عروض',
      price: 2600,
      originalPrice: 3200,
      description: 'بولو عالي الجودة قطن 100% بتطريز أنيق وقصة مريحة تناسب مختلف الإطلالات.',
      badge: '-20%',
      sizes: '["S", "M", "L", "XL"]',
      colors: '["أسود", "أزرق ليلي"]',
      images: '["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"]'
    },
    {
      id: 'p2',
      name: 'Slim fit t-shirt',
      subtitle: 'Black Slim fit t-shirt ✨',
      price: 2000,
      originalPrice: 2500,
      description: 'تيشيرت سليم فيت يبرز تفاصيل الجسم، نسيج ناعم ومطاطي مريح للغاية لجميع المناسبات اليومية.',
      badge: '-20%',
      sizes: '["S", "M", "L", "XL"]',
      colors: '["أسود مات", "أبيض"]',
      images: '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"]'
    },
    {
      id: 'p3',
      name: 'Bootcut jean',
      subtitle: 'Jeans denim brut premium',
      price: 5500,
      originalPrice: 6000,
      description: 'جينز بوتكات كلاسيكي بقماش دينيم أصلي مريح وثابت بعد الغسيل مع تفاصيل خياطة متقنة.',
      badge: '-8%',
      sizes: '["38", "40", "42", "44"]',
      colors: '["أزرق داكن", "أسود"]',
      images: '["https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop"]'
    },
    {
      id: 'p4',
      name: 'Ensemble baggy jogger gris/noir',
      subtitle: 'Wide leg heavyweight streetwear',
      price: 3300,
      originalPrice: 3800,
      description: 'أنبل باجي جوغر مريح بقصة عريضة تريند، مثالي للإطلالات الشبابية والرياضية.',
      badge: '-13%',
      sizes: '["M", "L", "XL", "XXL"]',
      colors: '["رمادي ميلانج", "أسود"]',
      images: '["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop"]'
    }
  ];

  for (const item of defaultItems) {
    await sql`
      INSERT INTO products (id, name, subtitle, price, original_price, description, badge, sizes, colors, images, is_deleted)
      VALUES (${item.id}, ${item.name}, ${item.subtitle}, ${item.price}, ${item.originalPrice}, ${item.description}, ${item.badge}, ${item.sizes}::jsonb, ${item.colors}::jsonb, ${item.images}::jsonb, FALSE)
      ON CONFLICT (id) DO UPDATE SET is_deleted = FALSE;
    `;
  }
}