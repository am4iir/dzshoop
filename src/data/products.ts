export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  description: string;
  badge?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  features: string[];
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "oversized-heavy-hoodie",
    name: "Oversized Minimalist Hoodie",
    subtitle: "Heavyweight 450 GSM - قطن 100% بريميوم",
    price: 4800,
    originalPrice: 6200,
    description: "هودي أوفرسايز فائق الجودة بقماش قطني ثقيل (450 GSM)، قصة عصرية مريحة مع تفاصيل دقيقة في الخياطة. مثالي للإطلالات اليومية والستريت وير الراقية.",
    badge: "الأكثر طلباً 🔥",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أسود فحمي", hex: "#18181b" },
      { name: "رمادي حجري", hex: "#71717a" },
      { name: "بيج كلاسيك", hex: "#d6c7b2" }
    ],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop"
    ],
    features: [
      "قطن طبيعي 100% مضاد للتوبير (Anti-Pilling)",
      "وزن شتوي ثقيل 450 GSM",
      "خياطة مزدوجة متينة تدوم لسنوات",
      "توصيل سريع مع إمكانية المعاينة قبل الدفع"
    ],
    inStock: true
  },
  {
    id: "baggy-cargo-pants",
    name: "Urban Baggy Cargo Pants",
    subtitle: "سروال كارغو عصري بجيوب تكتيكية",
    price: 4200,
    originalPrice: 5500,
    description: "سروال كارغو واسع ومريح مصنوع من قماش عالي التحمل ومقاوم للتجعد. قصة باجي مودرن تناسب مختلف الأحذية والستايلات الرياضية والكاجوال.",
    badge: "Drop جديد ⚡",
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "زيتي تكتيكي", hex: "#3f4a3c" },
      { name: "أسود مات", hex: "#1c1917" }
    ],
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop"
    ],
    features: [
      "قماش قطني مطاطي مريح للغاية",
      "6 جيوب عملية مع إغلاق محكم",
      "حزام مطاطي جانبي لراحة إضافية"
    ],
    inStock: true
  }
];

export const WILAYAS = [
  { code: "16", name: "16 - الجزائر العاصمة", homeDelivery: 400, deskDelivery: 250 },
  { code: "09", name: "09 - البليدة", homeDelivery: 500, deskDelivery: 300 },
  { code: "31", name: "31 - وهران", homeDelivery: 600, deskDelivery: 350 },
  { code: "25", name: "25 - قسنطينة", homeDelivery: 600, deskDelivery: 350 },
  { code: "19", name: "19 - سطيف", homeDelivery: 600, deskDelivery: 350 },
  { code: "15", name: "15 - تيزي وزو", homeDelivery: 600, deskDelivery: 350 },
  { code: "06", name: "06 - بجاية", homeDelivery: 600, deskDelivery: 350 },
  { code: "35", name: "35 - بومرداس", homeDelivery: 500, deskDelivery: 300 },
  { code: "42", name: "42 - تيبازة", homeDelivery: 500, deskDelivery: 300 },
  { code: "13", name: "13 - تلمسان", homeDelivery: 700, deskDelivery: 400 },
  { code: "23", name: "23 - عنابة", homeDelivery: 700, deskDelivery: 400 },
  { code: "05", name: "05 - باتنة", homeDelivery: 650, deskDelivery: 350 }
];
