import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function upsertJoggers() {
  const grey = {
    id: "joggers-grey",
    name: "جوقر واسع رمادي",
    subtitle: "Wide-leg Heavyweight 340 GSM - رمادي ميلانج",
    price: 3800,
    originalPrice: 4800,
    description: "جوقر ستريت وير واسع بقماش قطني ثقيل 340 GSM مع قصة باجي مريحة، خياطة متقونة، حزام مطاطي برباط تعديل وجيوب عملية. مناسب للإطلالات اليومية والستريت وير العصرية.",
    badge: "جديد 2026 🔥",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["رمادي (Grey)"]),
    images: JSON.stringify([
      "/images/joggers-flat-grey.webp",
      "/images/joggers-grey-model.webp",
      "/images/joggers-detail-waist.webp",
      "/images/joggers-fabric-grey.webp",
      "/images/joggers-detail-shoe.webp"
    ]),
    inStock: true
  };

  const black = {
    id: "joggers-black",
    name: "جوقر واسع أسود",
    subtitle: "Wide-leg Heavyweight 340 GSM - أسود فحمي",
    price: 3800,
    originalPrice: 4800,
    description: "جوقر ستريت وير واسع باللون الأسود الفحمي بقماش قطن 340 GSM فاخر. تصميم عريض أوفرسايز مريح للغاية مع تفاصيل خياطة بريميوم وجيوب جانبية متينة.",
    badge: "جديد 2026 ⚡",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["أسود (Black)"]),
    images: JSON.stringify([
      "/images/joggers-flat-black.webp",
      "/images/joggers-black-model.webp",
      "/images/joggers-detail-waist.webp",
      "/images/joggers-fabric-black.webp",
      "/images/joggers-detail-shoe.webp"
    ]),
    inStock: true
  };

  for (const item of [grey, black]) {
    await sql.query(
      `INSERT INTO products (id, name, subtitle, price, original_price, description, badge, sizes, colors, images, in_stock, is_deleted)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, false)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         subtitle = EXCLUDED.subtitle,
         price = EXCLUDED.price,
         original_price = EXCLUDED.original_price,
         description = EXCLUDED.description,
         badge = EXCLUDED.badge,
         sizes = EXCLUDED.sizes,
         colors = EXCLUDED.colors,
         images = EXCLUDED.images,
         in_stock = EXCLUDED.in_stock,
         is_deleted = false;`,
      [
        item.id,
        item.name,
        item.subtitle,
        item.price,
        item.originalPrice,
        item.description,
        item.badge,
        item.sizes,
        item.colors,
        item.images,
        item.inStock
      ]
    );
    console.log("Upserted:", item.id);
  }

  const all = await sql.query("SELECT id, name, price, images FROM products WHERE is_deleted IS NOT TRUE");
  console.log("All active products in DB:", JSON.stringify(all, null, 2));
}

upsertJoggers().catch(console.error);
