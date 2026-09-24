// src/lib/i18n.ts — Central translations: Arabic (ar), English (en), French (fr)

export type Lang = "ar" | "en" | "fr";

export const translations = {
  // ===== ANNOUNCEMENT BAR =====
  announcement: {
    ar: [
      "الدفع عند الاستلام",
      "توصيل لـ 69 ولاية",
      "معاينة قبل الدفع",
    ],
    en: [
      "Cash on delivery",
      "Delivery to 69 wilayas",
      "Inspect before payment",
    ],
    fr: [
      "Paiement à la livraison",
      "Livraison vers 69 wilayas",
      "Inspection avant paiement",
    ],
  },

  // ===== NAVBAR =====
  nav: {
    searchPlaceholder: {
      ar: "ابحث عن منتج في bx.wear.dz...",
      en: "Search products on bx.wear.dz...",
      fr: "Rechercher un produit sur bx.wear.dz...",
    },
    themeLight: { ar: "White", en: "White", fr: "Blanc" },
    themeDark: { ar: "Black", en: "Black", fr: "Noir" },
  },

  // ===== CART DRAWER =====
  cart: {
    title: { ar: "سلة المشتريات", en: "Shopping Cart", fr: "Panier d'achats" },
    empty: { ar: "سلتك فارغة حالياً", en: "Your cart is empty", fr: "Votre panier est vide" },
    emptyDesc: {
      ar: "اختر منتجاتك المفضلة وأضفها للسلة لمواصلة الطلب",
      en: "Add your favorite products to continue ordering",
      fr: "Ajoutez vos produits préférés pour continuer votre commande",
    },
    browse: { ar: "تصفح المنتجات", en: "Browse Products", fr: "Parcourir les produits" },
    subtotal: { ar: "المجموع الجزئي:", en: "Subtotal:", fr: "Sous-total :" },
    deliveryNote: {
      ar: "يتم احتساب مصاريف التوصيل في الصفحة التالية حسب الولاية",
      en: "Delivery fees are calculated on the next page based on wilaya",
      fr: "Les frais de livraison sont calculés sur la page suivante",
    },
    checkout: { ar: "متابعة الشراء والتأكيد", en: "Proceed to Checkout", fr: "Passer la commande" },
  },

  // ===== HOME PAGE =====
  home: {
    heroDesc: {
      ar: "أفضل الخامات القطنية 100% بتصاميم عصرية ومريحة من تصميم barae. نوفر التوصيل السريع لـ 69 ولاية مع الدفع عند الاستلام وإمكانية المعاينة قبل الدفع.",
      en: "Premium 100% cotton fabrics with modern streetwear designs by barae. Fast delivery to 69 wilayas with cash on delivery and parcel inspection.",
      fr: "Tissus premium 100% coton avec des designs streetwear modernes par barae. Livraison rapide vers 69 wilayas avec paiement à la livraison.",
    },
    delivery69: { ar: "توصيل لـ 69 ولاية", en: "Delivery to 69 wilayas", fr: "Livraison vers 69 wilayas" },
    inspectBeforePay: { ar: "معاينة الطرد قبل الدفع", en: "Inspect parcel before payment", fr: "Inspection du colis avant paiement" },
    collectionTitle: { ar: "تشكيلة bx.wear الحصرية", en: "bx.wear exclusive collection", fr: "Collection exclusive bx.wear" },
    products: { ar: "منتج", en: "products", fr: "produits" },
    noResults: { ar: "لا توجد منتجات مطابقة لبحثك حالياً.", en: "No products match your search.", fr: "Aucun produit ne correspond à votre recherche." },
    orderNow: { ar: "أطلب الآن", en: "Order Now", fr: "Commander" },
    catAll: { ar: "جميع المنتجات", en: "All Products", fr: "Tous les produits" },
    trustDelivery: { ar: "توصيل لـ 69 ولاية", en: "Delivery to 69 wilayas", fr: "Livraison vers 69 wilayas" },
    trustDeliverySub: { ar: "سريع وبأسعار مناسبة", en: "Fast & affordable", fr: "Rapide et abordable" },
    trustInspect: { ar: "معاينة قبل الدفع", en: "Inspect before payment", fr: "Inspection avant paiement" },
    trustInspectSub: { ar: "افحص طلبك ثم ادفع", en: "Check your order before paying", fr: "Vérifiez avant de payer" },
    trustReturn: { ar: "إمكانية الاستبدال", en: "Easy returns", fr: "Retours faciles" },
    trustReturnSub: { ar: "تبديل المقاس بكل سهولة", en: "Exchange your size easily", fr: "Échangez votre taille facilement" },
    trustCOD: { ar: "الدفع عند الاستلام", en: "Cash on delivery", fr: "Paiement à la livraison" },
    trustCODSub: { ar: "يد بيد مع الموصّل", en: "Pay when you receive", fr: "Payez à la réception" },
    footerBrandDesc: {
      ar: "العلامة الرسمية لـ bx.wear.dz في الجزائر. قطن طبيعي عالي الجودة وتصاميم ستريت وير عصرية لكل الشباب.",
      en: "The official brand of bx.wear.dz in Algeria. Premium natural cotton and modern streetwear designs for the youth.",
      fr: "La marque officielle de bx.wear.dz en Algérie. Coton naturel premium et designs streetwear modernes pour la jeunesse.",
    },
    footerQuickLinks: { ar: "روابط سريعة", en: "Quick Links", fr: "Liens rapides" },
    footerHome: { ar: "الرئيسية والكوليكشن", en: "Home & Collection", fr: "Accueil & Collection" },
    footerCart: { ar: "سلة المشتريات والتأكيد", en: "Cart & Checkout", fr: "Panier & Confirmation" },
    footerSupport: { ar: "خدمة الزبائن", en: "Customer Support", fr: "Service client" },
    footerSupportDesc: {
      ar: "متواجدون للإجابة على استفساراتكم وتأكيد طلبياتكم طيلة أيام الأسبوع.",
      en: "We are available to answer your questions and confirm orders all week long.",
      fr: "Nous sommes disponibles pour répondre à vos questions toute la semaine.",
    },
    footerCopyright: {
      ar: "© 2026 bx.wear.dz • barae. جميع الحقوق محفوظة.",
      en: "© 2026 bx.wear.dz • barae. All rights reserved.",
      fr: "© 2026 bx.wear.dz • barae. Tous droits réservés.",
    },
  },

  // ===== PRODUCT PAGE =====
  product: {
    chooseSize: { ar: "اختر المقاس", en: "Choose Size", fr: "Choisir la taille" },
    sizeGuide: { ar: "دليل المقاسات", en: "Size Guide", fr: "Guide des tailles" },
    chooseColor: { ar: "اختر اللون", en: "Choose Color", fr: "Choisir la couleur" },
    quantity: { ar: "الكمية", en: "Quantity", fr: "Quantité" },
    addToCart: { ar: "أضف للسلة", en: "Add to Cart", fr: "Ajouter au panier" },
    orderNow: { ar: "اطلب الآن", en: "Order Now", fr: "Commander maintenant" },
    soldOut: { ar: "نفدت الكمية", en: "Sold Out", fr: "Rupture de stock" },
    deliveryBadge: { ar: "توصيل سريع لـ 69 ولاية", en: "Fast delivery to 69 wilayas", fr: "Livraison rapide vers 69 wilayas" },
    codBadge: { ar: "الدفع عند الاستلام", en: "Cash on delivery", fr: "Paiement à la livraison" },
    guaranteeBadge: { ar: "جودة مضمونة 100%", en: "100% quality guaranteed", fr: "Qualité garantie 100%" },
    inspectBadge: { ar: "معاينة الطرد قبل الدفع", en: "Inspect parcel before payment", fr: "Inspection avant paiement" },
    description: { ar: "التفاصيل والوصف", en: "Description & Details", fr: "Description et détails" },
    confirmSuccess: { ar: "تم تأكيد طلبك بنجاح!", en: "Your order was confirmed!", fr: "Votre commande a été confirmée !" },
    orderNumber: { ar: "رقم الطلبية:", en: "Order number:", fr: "Numéro de commande :" },
    contactSoon: { ar: "سنتصل بك هاتفياً لتأكيد الشحن فوراً.", en: "We will call you to confirm shipping shortly.", fr: "Nous vous appellerons pour confirmer l'expédition." },
    copyId: { ar: "نسخ", en: "Copy", fr: "Copier" },
    copied: { ar: "تم النسخ!", en: "Copied!", fr: "Copié !" },
    backToStore: { ar: "العودة للمتجر", en: "Back to Store", fr: "Retour à la boutique" },
    fillForm: { ar: "أكمل بيانات طلبك", en: "Complete your order details", fr: "Complétez les détails de votre commande" },
    fullName: { ar: "الاسم الكامل *", en: "Full Name *", fr: "Nom complet *" },
    phone: { ar: "رقم الهاتف *", en: "Phone Number *", fr: "Numéro de téléphone *" },
    wilaya: { ar: "الولاية *", en: "Wilaya *", fr: "Wilaya *" },
    commune: { ar: "البلدية / المنطقة *", en: "Commune / Area *", fr: "Commune / Zone *" },
    deliveryHome: { ar: "📦 توصيل للمنزل", en: "📦 Home Delivery", fr: "📦 Livraison à domicile" },
    deliveryDesk: { ar: "🏢 استلام من المكتب", en: "🏢 Pickup from Office", fr: "🏢 Retrait au bureau" },
    confirmOrder: { ar: "تأكيد الطلب", en: "Confirm Order", fr: "Confirmer la commande" },
    processing: { ar: "جاري المعالجة...", en: "Processing...", fr: "Traitement en cours..." },
    orderSummary: { ar: "ملخص طلبك", en: "Order Summary", fr: "Résumé de votre commande" },
    deliveryCost: { ar: "التوصيل:", en: "Delivery:", fr: "Livraison :" },
    total: { ar: "الإجمالي:", en: "Total:", fr: "Total :" },
  },

  // ===== CHECKOUT PAGE =====
  checkout: {
    title: { ar: "إتمام الطلب", en: "Checkout", fr: "Passer la commande" },
    cartEmpty: { ar: "سلتك فارغة!", en: "Your cart is empty!", fr: "Votre panier est vide !" },
    cartEmptyDesc: { ar: "يرجى إضافة منتجات إلى السلة قبل الدخول لصفحة التأكيد", en: "Please add products to your cart before proceeding", fr: "Veuillez ajouter des produits à votre panier avant de continuer" },
    backToStore: { ar: "العودة للمتجر", en: "Back to Store", fr: "Retour à la boutique" },
    confirmSuccess: { ar: "تم تأكيد طلبك بنجاح!", en: "Your order was confirmed!", fr: "Votre commande a été confirmée !" },
    orderNumber: { ar: "رقم الطلبية:", en: "Order number:", fr: "Numéro de commande :" },
    contactSoon: { ar: "سنتصل بك هاتفياً لتأكيد الشحن فوراً.", en: "We will call you shortly to confirm shipping.", fr: "Nous vous appellerons prochainement pour confirmer la livraison." },
    copyId: { ar: "نسخ", en: "Copy", fr: "Copier" },
    copied: { ar: "تم النسخ!", en: "Copied!", fr: "Copié !" },
    fullName: { ar: "الاسم الكامل *", en: "Full Name *", fr: "Nom complet *" },
    phone: { ar: "رقم الهاتف *", en: "Phone Number *", fr: "Numéro de téléphone *" },
    wilaya: { ar: "الولاية *", en: "Wilaya *", fr: "Wilaya *" },
    commune: { ar: "البلدية / المنطقة *", en: "Commune *", fr: "Commune *" },
    deliveryHome: { ar: "📦 توصيل للمنزل", en: "📦 Home Delivery", fr: "📦 Livraison à domicile" },
    deliveryDesk: { ar: "🏢 استلام من المكتب", en: "🏢 Pickup from Office", fr: "🏢 Retrait au bureau" },
    promoCode: { ar: "كود الخصم (اختياري)", en: "Discount Code (optional)", fr: "Code promo (facultatif)" },
    applyPromo: { ar: "تطبيق", en: "Apply", fr: "Appliquer" },
    orderSummary: { ar: "ملخص الطلب", en: "Order Summary", fr: "Récapitulatif" },
    subtotal: { ar: "المجموع الجزئي:", en: "Subtotal:", fr: "Sous-total :" },
    discount: { ar: "الخصم:", en: "Discount:", fr: "Réduction :" },
    deliveryCost: { ar: "التوصيل:", en: "Delivery:", fr: "Livraison :" },
    total: { ar: "الإجمالي الكلي:", en: "Total:", fr: "Total :" },
    confirmOrder: { ar: "تأكيد وإرسال الطلب", en: "Confirm & Send Order", fr: "Confirmer et envoyer la commande" },
    processing: { ar: "جاري الإرسال...", en: "Sending...", fr: "Envoi en cours..." },
    yourOrder: { ar: "طلبيتك", en: "Your Order", fr: "Votre commande" },
  },

  // ===== ADMIN =====
  admin: {
    title: { ar: "لوحة تحكم المتجر (Admin)", en: "Store Dashboard (Admin)", fr: "Tableau de bord (Admin)" },
    subtitle: { ar: "إدارة الطلبات والمنتجات الفورية", en: "Real-time orders & products management", fr: "Gestion en temps réel des commandes et produits" },
    visitStore: { ar: "زيارة المتجر كزبون", en: "Visit Store", fr: "Voir la boutique" },
    logout: { ar: "تسجيل الخروج", en: "Logout", fr: "Déconnexion" },
    autoPurgeNotice: {
      ar: "نظام التنظيف التلقائي مفعّل: الطلبيات المشحونة أو الملغاة تُحذف تلقائياً وبشكل نهائي من قاعدة البيانات بعد مرور 48 ساعة.",
      en: "Auto-purge active: Shipped or cancelled orders are automatically deleted after 48 hours.",
      fr: "Nettoyage automatique actif : Les commandes expédiées ou annulées sont supprimées après 48h.",
    },
    pendingOrders: { ar: "الطلبات الجديدة (Pending)", en: "New Orders (Pending)", fr: "Nouvelles commandes (En attente)" },
    confirmedOrders: { ar: "الطلبات المؤكدة", en: "Confirmed Orders", fr: "Commandes confirmées" },
    activeProducts: { ar: "المنتجات المعروضة", en: "Active Products", fr: "Produits actifs" },
    deletedCount: { ar: "محذوف", en: "deleted", fr: "supprimés" },
    totalRevenue: { ar: "إجمالي المبيعات المحتمل", en: "Potential Total Revenue", fr: "Chiffre d'affaires potentiel" },
    resetEdit: { ar: "تصفير / تعديل", en: "Reset / Edit", fr: "Réinitialiser / Modifier" },
    orders: { ar: "قائمة الطلبيات", en: "Orders List", fr: "Liste des commandes" },
    products: { ar: "المنتجات", en: "Products", fr: "Produits" },
    addProduct: { ar: "إضافة منتج جديد", en: "Add New Product", fr: "Ajouter un produit" },
    finance: { ar: "الحسابات والأرباح (Caisse) 💰", en: "Finance & Cash (Caisse) 💰", fr: "Finances & Caisse 💰" },
    newProductTitle: { ar: "إضافة منتج جديد للمتجر", en: "Add New Product to Store", fr: "Ajouter un nouveau produit" },
    newProductSub: {
      ar: "بمجرد حفظ هذا النموذج، سيظهر المنتج تلقائياً في الصفحة الرئيسية لجميع الزبائن",
      en: "Once saved, the product will automatically appear on the home page for all customers",
      fr: "Une fois enregistré, le produit apparaîtra automatiquement sur la page d'accueil",
    },
    productNameLabel: { ar: "* اسم المنتج", en: "* Product Name", fr: "* Nom du produit" },
    productSubtitleLabel: { ar: "Subtitle / وصف فرعي", en: "Subtitle / Short Description", fr: "Sous-titre / Description courte" },
    productPriceLabel: { ar: "* السعر للبيع (دج)", en: "* Selling Price (DZD)", fr: "* Prix de vente (DZD)" },
    productOriginalPriceLabel: { ar: "السعر الأصلي قبل التخفيض (اختياري)", en: "Original Price (optional)", fr: "Prix d'origine (optionnel)" },
    productSizesLabel: { ar: "المقاسات (مفصولة بفاصلة)", en: "Sizes (comma separated)", fr: "Tailles (séparées par virgules)" },
    productBadgeLabel: { ar: "شعار الخصم (Badge)", en: "Badge (e.g. -20% / NEW)", fr: "Badge (ex: -20% / NEW)" },
    productImageLabel: { ar: "* صورة المنتج الرئيسية", en: "* Main Product Image", fr: "* Image principale" },
    uploadFileTab: { ar: "📁 رفع من جهازك (الهاتف / PC)", en: "📁 Upload from Device", fr: "📁 Importer depuis votre appareil" },
    enterUrlTab: { ar: "🔗 إدخال رابط (URL)", en: "🔗 Enter URL", fr: "🔗 Entrer une URL" },
    clickUploadPrompt: { ar: "اضغط هنا لاختيار صورة من جهازك", en: "Click here to select an image", fr: "Cliquez ici pour choisir une image" },
    imageCompressNote: {
      ar: "يتم ضغطها وتحسين سرعتها تلقائياً (JPG, PNG, WEBP)",
      en: "Automatically compressed and optimized (JPG, PNG, WEBP)",
      fr: "Compressée et optimisée automatiquement (JPG, PNG, WEBP)",
    },
    saveProductBtn: { ar: "حفظ ونشر المنتج 🚀", en: "Save & Publish Product 🚀", fr: "Enregistrer & Publier 🚀" },
    saveProductBtnLoading: { ar: "جاري الحفظ...", en: "Saving...", fr: "Enregistrement..." },
  },
} as const;

export type TranslationSection = keyof typeof translations;

export function getAnnouncementMessages(lang: Lang): string[] {
  return [...translations.announcement[lang]];
}

// Simple t() helper — call getT(lang) once per component then use returned t()
export function getT(lang: Lang) {
  return function t(section: TranslationSection, key: string): string {
    const sec = translations[section] as Record<string, Record<Lang, string | string[]>>;
    if (!sec || !sec[key]) return key;
    const val = sec[key][lang] ?? sec[key]["ar"];
    return Array.isArray(val) ? val[0] : String(val ?? key);
  };
}
