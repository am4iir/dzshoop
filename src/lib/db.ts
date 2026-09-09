import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "store.json");

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  description: string;
  badge?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
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

interface StoreData {
  products: Product[];
  orders: Order[];
}

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "T-shirt polo (noir/bleu nuit) premium quality",
    subtitle: "Black polo shirt slim fit 2 عروض",
    price: 2600,
    originalPrice: 3200,
    description: "بولو عالي الجودة قطن 100% بتطريز أنيق وقصة مريحة تناسب مختلف الإطلالات.",
    badge: "-20%",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "أزرق ليلي"],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p2",
    name: "Slim fit t-shirt",
    subtitle: "Black Slim fit t-shirt ✨",
    price: 2000,
    originalPrice: 2500,
    description: "تيشيرت سليم فيت يبرز تفاصيل الجسم، نسيج ناعم ومطاطي مريح للغاية لجميع المناسبات اليومية.",
    badge: "-20%",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود مات", "أبيض"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p3",
    name: "Bootcut jean",
    subtitle: "Jeans denim brut premium",
    price: 5500,
    originalPrice: 6000,
    description: "جينز بوتكات كلاسيكي بقماش دينيم أصلي مريح وثابت بعد الغسيل مع تفاصيل خياطة متقنة.",
    badge: "-8%",
    sizes: ["38", "40", "42", "44"],
    colors: ["أزرق داكن", "أسود"],
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop"
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p4",
    name: "Ensemble baggy jogger gris/noir",
    subtitle: "Wide leg heavyweight streetwear",
    price: 3300,
    originalPrice: 3800,
    description: "أنبل باجي جوغر مريح بقصة عريضة تريند، مثالي للإطلالات الشبابية والرياضية.",
    badge: "-13%",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["رمادي ميلانج", "أسود"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop"
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  }
];

export function getStoreData(): StoreData {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const initial: StoreData = { products: initialProducts, orders: [] };
      fs.writeFileSync(dataFilePath, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(raw) as StoreData;
  } catch (e) {
    return { products: initialProducts, orders: [] };
  }
}

export function saveStoreData(data: StoreData) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}
