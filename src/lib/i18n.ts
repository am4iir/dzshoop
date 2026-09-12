// src/lib/i18n.ts — Central translations: Arabic (ar), English (en), French (fr)

export type Lang = "ar" | "en" | "fr";

export const translations = {
  // ===== ANNOUNCEMENT BAR =====
  announcement: {
    ar: [
      "🚚 توصيل سريع لـ 69 ولاية",
      "💰 الدفع عند الاستلام",
      "📦 معاينة الطرد قبل الدفع",
      "✅ ضمان الجودة والإرجاع",
    ],
    en: [
      "🚚 Fast delivery to 69 wilayas",
      "💰 Cash on delivery",
      "📦 Inspect parcel before payment",
      "✅ Quality guarantee & returns",
    ],
    fr: [
      "🚚 Livraison rapide vers 69 wilayas",
      "💰 Paiement à la livraison",
      "📦 Inspection du colis avant paiement",
      "✅ Garantie qualité et retour",
    ],
  },

  // ===== NAVBAR =====
  nav: {
    searchPlaceholder: {
      ar: "ابحث عن منتج في axb.wear...",
      en: "Search products on axb.wear...",
      fr: "Rechercher un produit sur axb.wear...",
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
      ar: "أفضل الخامات القطنية 100% بتصاميم عصرية ومريحة من تصميم barae × amir. نوفر التوصيل السريع لـ 69 ولاية مع الدفع عند الاستلام وإمكانية المعاينة قبل الدفع.",
      en: "Premium 100% cotton fabrics with modern streetwear designs by barae × amir. Fast delivery to 69 wilayas with cash on delivery and parcel inspection.",
      fr: "Tissus premium 100% coton avec des designs streetwear modernes par barae × amir. Livraison rapide vers 69 wilayas avec paiement à la livraison.",
    },
    delivery69: { ar: "توصيل لـ 69 ولاية", en: "Delivery to 69 wilayas", fr: "Livraison vers 69 wilayas" },
    inspectBeforePay: { ar: "معاينة الطرد قبل الدفع", en: "Inspect parcel before payment", fr: "Inspection du colis avant paiement" },
    collectionTitle: { ar: "تشكيلة axb الحصرية", en: "axb exclusive collection", fr: "Collection exclusive axb" },
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
      ar: "العلامة الرسمية لـ barae × amir في الجزائر. قطن طبيعي عالي الجودة وتصاميم ستريت وير عصرية لكل الشباب.",
      en: "The official brand of barae × amir in Algeria. Premium natural cotton and modern streetwear designs for the youth.",
      fr: "La marque officielle de barae × amir en Algérie. Coton naturel premium et designs streetwear modernes pour la jeunesse.",
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
      ar: "© 2026 axb.wear • barae × amir. جميع الحقوق محفوظة.",
      en: "© 2026 axb.wear • barae × amir. All rights reserved.",
      fr: "© 2026 axb.wear • barae × amir. Tous droits réservés.",
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
