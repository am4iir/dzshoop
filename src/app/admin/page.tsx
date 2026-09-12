"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Order, Expense } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  Phone, 
  MapPin, 
  Layers, 
  ArrowRight,
  Lock,
  LogOut,
  Trash2,
  RotateCcw,
  RefreshCw,
  Box,
  AlertTriangle,
  Tag,
  Percent,
  X,
  Flame,
  MessageCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Edit3,
  Upload,
  Image as ImageIcon,
  Check,
  Sun,
  Moon,
  Palette,
  Globe
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useTheme } from "@/components/ThemeContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { lang, setLang, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Admin Custom Theme state
  type AdminTheme = "default" | "dark" | "navy" | "forest" | "sunset";
  const [adminTheme, setAdminTheme] = useState<AdminTheme>("default");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("axb_admin_theme_custom") as AdminTheme | null;
      if (saved && ["default", "dark", "navy", "forest", "sunset"].includes(saved)) {
        setAdminTheme(saved);
        if (saved !== "default") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch (e) {}
  }, []);

  const changeAdminTheme = (newTh: AdminTheme) => {
    setAdminTheme(newTh);
    setThemeDropdownOpen(false);
    try {
      localStorage.setItem("axb_admin_theme_custom", newTh);
    } catch (e) {}
    if (newTh !== "default") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  // Dashboard state - Persist active tab across refreshes
  const [activeTab, setActiveTabState] = useState<"orders" | "products" | "new-product" | "finance">("orders");
  const setActiveTab = (tab: "orders" | "products" | "new-product" | "finance") => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("axb_admin_active_tab", tab);
      } catch (e) {}
    }
  };
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [productFilter, setProductFilter] = useState<"all" | "active" | "outofstock" | "deleted">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Financial tracking form state
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState<"inventory" | "ads" | "packaging" | "shipping" | "other">("inventory");
  const [expType, setExpType] = useState<"expense" | "income">("expense");
  const [expNotes, setExpNotes] = useState("");
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState<string>("all");

  // Promotion modal state
  const [editingPromoProduct, setEditingPromoProduct] = useState<Product | null>(null);
  const [promoPrice, setPromoPrice] = useState<string>("");
  const [promoOriginalPrice, setPromoOriginalPrice] = useState<string>("");
  const [promoBadge, setPromoBadge] = useState<string>("");
  const [savingPromo, setSavingPromo] = useState(false);

  // Custom Revenue Override state (allows resetting to 0 or setting custom revenue)
  const [customRevenue, setCustomRevenue] = useState<number | null>(null);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesInputVal, setSalesInputVal] = useState("");

  // New product form
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("-20%");
  const [sizesStr, setSizesStr] = useState("S, M, L, XL");
  const [colorsStr, setColorsStr] = useState("أسود, رمادي");
  const [imageUrl, setImageUrl] = useState("");
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [newProductImageMode, setNewProductImageMode] = useState<"file" | "url">("file");

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editSizesStr, setEditSizesStr] = useState("");
  const [editColorsStr, setEditColorsStr] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editImageMode, setEditImageMode] = useState<"file" | "url">("file");

  // Helper: get stored admin token from current session
  const getStoredToken = (): string => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("axb_admin_token") || "";
  };

  const getAdminHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getStoredToken()}`,
  });

  useEffect(() => {
    // Clear any persistent tokens from localStorage so admin always requires password on new visits/tabs
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("axb_admin_auth_2026");
        localStorage.removeItem("axb_admin_token");
        localStorage.removeItem("store_admin_auth");
      } catch (e) {}
    }

    // Restore active tab if previously selected
    const savedTab = localStorage.getItem("axb_admin_active_tab");
    if (savedTab && ["orders", "products", "new-product", "finance"].includes(savedTab)) {
      setActiveTabState(savedTab as any);
    }

    // Restore custom revenue override if previously set
    const savedCustomRev = localStorage.getItem("axb_admin_custom_revenue");
    if (savedCustomRev !== null && savedCustomRev !== "") {
      const parsed = Number(savedCustomRev);
      if (!isNaN(parsed)) {
        setCustomRevenue(parsed);
        setSalesInputVal(parsed.toString());
      }
    }

    // Check saved session in current tab (sessionStorage persists across F5 refresh, but locks on new tab or browser close)
    const saved = sessionStorage.getItem("axb_admin_auth_2026");
    const token = sessionStorage.getItem("axb_admin_token");

    if (saved === "verified" && token) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    if (cleanPass === "abxabx202625") {
      // Store ONLY in sessionStorage: persists across refresh in this tab, but locks when opening new tab/browser
      sessionStorage.setItem("axb_admin_auth_2026", "verified");
      sessionStorage.setItem("axb_admin_token", cleanPass);
      setIsAuthenticated(true);
      setAuthError(false);
      loadData();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("axb_admin_auth_2026");
    sessionStorage.removeItem("axb_admin_token");
    localStorage.removeItem("axb_admin_auth_2026");
    localStorage.removeItem("axb_admin_token");
    localStorage.removeItem("store_admin_auth");
    setIsAuthenticated(false);
    setPasscode("");
    router.push("/");
  };

  const loadData = () => {
    setLoading(true);
    const token = getStoredToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
    Promise.all([
      fetch("/api/orders", { headers }).then((r) => r.json()),
      fetch("/api/products?all=true", { headers }).then((r) => r.json()),
      fetch("/api/expenses", { headers }).then((r) => r.json())
    ]).then(([ordersData, productsData, expensesData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };


  const handleToggleDelete = async (productId: string, currentDeleted: boolean) => {
    const action = currentDeleted ? "restore" : "delete";
    const confirmMsg = currentDeleted
      ? "هل تريد استرجاع هذا المنتج ليعود للعرض في المتجر للزبائن؟"
      : "هل أنت متأكد من حذف هذا المنتج وإخفائه من المتجر؟ (يمكنك استرجاعه في أي وقت)";
    
    if (!confirm(confirmMsg)) return;

    setActionLoadingId(productId);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ id: productId, action })
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert("تعذر تحديث حالة المنتج");
      }
    } catch (e) {
      alert("حدث خطأ أثناء تعديل المنتج");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePermanentDelete = async (productId: string, productName: string) => {
    if (!confirm(`تحذير نهائي: هل تريد حذف "${productName}" نهائياً وبشكل كامل من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return;
    }

    setActionLoadingId(productId);
    try {
      const res = await fetch(`/api/products?id=${productId}&permanent=true`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert("تعذر حذف المنتج نهائياً");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الحذف النهائي");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStock = async (productId: string, currentInStock: boolean) => {
    const nextInStock = !currentInStock;
    setActionLoadingId(productId);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ id: productId, action: "toggle-stock", inStock: nextInStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, inStock: nextInStock } : p))
        );
      } else {
        alert("تعذر تحديث حالة توفر المنتج");
      }
    } catch (e) {
      alert("حدث خطأ أثناء تحديث حالة المخزون");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openPromoModal = (prod: Product) => {
    setEditingPromoProduct(prod);
    setPromoPrice(prod.price.toString());
    setPromoOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : prod.price.toString());
    setPromoBadge(prod.badge || "-20%");
  };

  const applyDiscountPercent = (percent: number) => {
    if (!editingPromoProduct) return;
    const base = Number(promoOriginalPrice) || Number(promoPrice) || editingPromoProduct.price;
    const discounted = Math.round((base * (100 - percent)) / 100);
    setPromoOriginalPrice(base.toString());
    setPromoPrice(discounted.toString());
    setPromoBadge(`-${percent}%`);
  };

  const removePromotion = () => {
    if (!editingPromoProduct) return;
    const regular = Number(promoOriginalPrice) || editingPromoProduct.price;
    setPromoPrice(regular.toString());
    setPromoOriginalPrice("");
    setPromoBadge("");
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromoProduct) return;
    const numPrice = Number(promoPrice);
    if (!numPrice || numPrice <= 0) {
      alert("يرجى إدخال سعر بيع صحيح");
      return;
    }

    setSavingPromo(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          id: editingPromoProduct.id,
          action: "promotion",
          price: numPrice,
          originalPrice: promoOriginalPrice ? Number(promoOriginalPrice) : null,
          badge: promoBadge.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingPromoProduct.id
              ? {
                  ...p,
                  price: numPrice,
                  originalPrice: promoOriginalPrice ? Number(promoOriginalPrice) : undefined,
                  badge: promoBadge.trim()
                }
              : p
          )
        );
        setEditingPromoProduct(null);
      } else {
        alert(data.error || "تعذر حفظ التخفيض");
      }
    } catch (e) {
      alert("حدث خطأ أثناء حفظ التخفيض");
    } finally {
      setSavingPromo(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!confirm("هل تريد استرجاع وتفعيل المنتجات الأصلية الافتراضية للمتجر؟")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: "restore-defaults" })
      });
      const data = await res.json();
      if (data.success) {
        alert("تم استرجاع وتفعيل المنتجات الافتراضية بنجاح!");
        loadData();
      } else {
        alert("تعذر استرجاع المنتجات الافتراضية");
      }
    } catch (e) {
      alert("حدث خطأ في النظام");
    } finally {
      setLoading(false);
    }
  };

  // Helper: compress uploaded image using HTML canvas to keep payload small & fast
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUploadForNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file);
      setImageUrl(base64);
    } catch (err) {
      alert("تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى");
    }
  };

  const handleFileUploadForEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file);
      setEditImageUrl(base64);
    } catch (err) {
      alert("تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى");
    }
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name || "");
    setEditSubtitle(prod.subtitle || "");
    setEditPrice(prod.price ? prod.price.toString() : "");
    setEditOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : "");
    setEditBadge(prod.badge || "");
    setEditSizesStr(Array.isArray(prod.sizes) ? prod.sizes.join(", ") : "");
    setEditColorsStr(Array.isArray(prod.colors) ? prod.colors.join(", ") : "");
    setEditDescription(prod.description || "");
    const currentImg = prod.images?.[0] || "";
    setEditImageUrl(currentImg);
    setEditImageMode(currentImg.startsWith("data:") ? "file" : "url");
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const numPrice = Number(editPrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert("يرجى إدخال سعر بيع صحيح للمنتج");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          id: editingProduct.id,
          action: "update",
          name: editName.trim(),
          subtitle: editSubtitle.trim(),
          price: numPrice,
          originalPrice: editOriginalPrice ? Number(editOriginalPrice) : null,
          badge: editBadge.trim(),
          sizes: editSizesStr.split(",").map((s) => s.trim()).filter(Boolean),
          colors: editColorsStr.split(",").map((c) => c.trim()).filter(Boolean),
          description: editDescription.trim(),
          images: editImageUrl ? [editImageUrl] : editingProduct.images
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("تم حفظ تعديلات المنتج بنجاح! ✅");
        setEditingProduct(null);
        loadData();
      } else {
        alert(data.error || "تعذر تعديل المنتج");
      }
    } catch (err) {
      alert("حدث خطأ أثناء تعديل بيانات المنتج");
    } finally {
      setSavingEdit(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ orderId, status: newStatus })
      });
      loadData();
    } catch (e) {
      alert("تعذر تحديث الحالة");
    }
  };

  const deleteOrderImmediately = async (orderId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الطلبية نهائياً من الداتابيز؟")) return;
    try {
      await fetch(`/api/orders?orderId=${orderId}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      loadData();
    } catch (e) {
      alert("تعذر حذف الطلبية");
    }
  };

  const handleSaveCustomRevenue = (val: number | null) => {
    setCustomRevenue(val);
    if (val === null) {
      localStorage.removeItem("axb_admin_custom_revenue");
      setSalesInputVal("");
    } else {
      localStorage.setItem("axb_admin_custom_revenue", val.toString());
      setSalesInputVal(val.toString());
    }
    setIsSalesModalOpen(false);
  };

  const handleDeleteAllOrders = async () => {
    if (!confirm("تحذير أخير: هل أنت متأكد من مسح وحذف جميع الطلبيات التجريبية نهائياً من قاعدة البيانات؟ لا يمكن التراجع.")) return;
    try {
      setLoading(true);
      const res = await fetch("/api/orders?orderId=all", {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        handleSaveCustomRevenue(null);
        alert("تم مسح جميع الطلبيات بنجاح وتصفير السجل!");
        loadData();
      } else {
        alert("تعذر حذف الطلبيات");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
      setIsSalesModalOpen(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert("يرجى إدخال اسم وسعر المنتج");
      return;
    }

    setSubmittingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          name,
          subtitle,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : Number(price),
          description,
          badge,
          sizes: sizesStr.split(",").map((s) => s.trim()).filter(Boolean),
          colors: colorsStr.split(",").map((c) => c.trim()).filter(Boolean),
          images: imageUrl ? [imageUrl] : [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
          ]
        })
      });
      const data = await res.json();
      setSubmittingProduct(false);

      if (data.success) {
        alert("تمت إضافة المنتج بنجاح ويظهر الآن للزبائن في المتجر!");
        setName("");
        setSubtitle("");
        setPrice("");
        setOriginalPrice("");
        setDescription("");
        setImageUrl("");
        loadData();
        setActiveTab("products");
      }
    } catch (err) {
      setSubmittingProduct(false);
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) {
      alert("يرجى إدخال عنوان المعاملة والمبلغ");
      return;
    }

    setSubmittingExpense(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          title: expTitle.trim(),
          amount: Number(expAmount),
          category: expCategory,
          type: expType,
          notes: expNotes.trim(),
        }),
      });
      const data = await res.json();
      setSubmittingExpense(false);
      if (data.success) {
        setExpTitle("");
        setExpAmount("");
        setExpNotes("");
        loadData();
      } else {
        alert(data.error || "تعذر تسجيل المعاملة");
      }
    } catch (err) {
      setSubmittingExpense(false);
      alert("حدث خطأ أثناء الاتصال بالسيرفر");
    }
  };

  const handleDeleteExpense = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف هذه المعاملة: "${title}"؟`)) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert("تعذر حذف المعاملة");
      }
    } catch (err) {
      alert("حدث خطأ في النظام");
    }
  };

  // Avoid flashing lock screen while checking saved auth session
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-3">
        <div className="animate-spin w-9 h-9 border-3 border-amber-400 border-t-transparent rounded-full" />
        <span className="text-xs text-zinc-400 font-bold font-mono tracking-wider">axb.wear • جاري التحقق...</span>
      </div>
    );
  }

  // Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4" dir={dir}>
        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative">
          {/* Top language switcher */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                  lang === "ar" ? "bg-amber-400 text-zinc-950 font-black shadow-xs" : "text-zinc-400 hover:text-white"
                }`}
                title="العربية (الأساسية)"
              >
                🇩🇿 ع
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                  lang === "en" ? "bg-amber-400 text-zinc-950 font-black shadow-xs" : "text-zinc-400 hover:text-white"
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                  lang === "fr" ? "bg-amber-400 text-zinc-950 font-black shadow-xs" : "text-zinc-400 hover:text-white"
                }`}
                title="Français"
              >
                🇫🇷 FR
              </button>
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white mb-1">
            {lang === "ar" ? "لوحة تحكم المتجر المحمية" : lang === "fr" ? "Tableau de bord protégé" : "Protected Store Dashboard"}
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            {lang === "ar"
              ? "أدخل رمز المرور السري (Passcode) للوصول إلى الطلبيات وإدارة المنتجات"
              : lang === "fr"
              ? "Entrez le mot de passe secret pour accéder aux commandes et produits"
              : "Enter secret passcode to access orders and product management"}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                placeholder={lang === "ar" ? "رمز المرور (Passcode)" : lang === "fr" ? "Mot de passe" : "Passcode"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError(false);
                }}
                className={`w-full bg-zinc-950 border ${
                  authError ? "border-red-500" : "border-zinc-800 focus:border-white"
                } rounded-xl py-3 px-4 text-center text-sm font-mono tracking-widest text-white outline-none transition`}
              />
              {authError && (
                <span className="text-[11px] text-red-400 block mt-1.5 font-medium">
                  {lang === "ar" ? "رمز المرور غير صحيح!" : lang === "fr" ? "Mot de passe incorrect !" : "Incorrect passcode!"}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold py-3 px-4 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              {lang === "ar" ? "تسجيل الدخول للأدمن" : lang === "fr" ? "Connexion Admin" : "Admin Login"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800/80">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
              {lang === "ar" ? "← العودة لمتجر الزبائن" : lang === "fr" ? "← Retour à la boutique" : "← Back to Store"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const calculatedTotalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalRevenue = customRevenue !== null ? customRevenue : calculatedTotalRevenue;
  const activeProductsCount = products.filter((p) => !p.isDeleted && p.inStock !== false).length;
  const outOfStockCount = products.filter((p) => !p.isDeleted && p.inStock === false).length;
  const deletedProductsCount = products.filter((p) => p.isDeleted).length;

  // Financial calculations
  const storeDeliveredRevenue = orders
    .filter((o) => o.status === "shipped")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const storeConfirmedRevenue = orders
    .filter((o) => o.status === "confirmed")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const storePendingRevenue = orders
    .filter((o) => o.status === "pending")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const manualIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalRevenues = (customRevenue !== null ? customRevenue : (storeDeliveredRevenue + storeConfirmedRevenue)) + manualIncome;

  const totalExpenses = expenses
    .filter((e) => e.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalRevenues - totalExpenses;

  const filteredExpenses = expenses.filter((e) => {
    if (expenseFilter === "all") return true;
    if (expenseFilter === "expense") return e.type === "expense";
    if (expenseFilter === "income") return e.type === "income";
    return e.category === expenseFilter;
  });

  const displayedProducts = products.filter((p) => {
    if (productFilter === "active") return !p.isDeleted && p.inStock !== false;
    if (productFilter === "outofstock") return !p.isDeleted && p.inStock === false;
    if (productFilter === "deleted") return Boolean(p.isDeleted);
    return true;
  });

  const getAdminThemeClass = () => {
    switch (adminTheme) {
      case "dark":
        return "bg-zinc-950 text-zinc-100";
      case "navy":
        return "bg-[#091124] text-slate-100";
      case "forest":
        return "bg-[#061c14] text-emerald-100";
      case "sunset":
        return "bg-[#18110a] text-amber-100";
      default:
        return "bg-zinc-50 text-zinc-900";
    }
  };

  const getAdminHeaderClass = () => {
    switch (adminTheme) {
      case "dark":
        return "bg-zinc-900/95 border-zinc-800 text-white";
      case "navy":
        return "bg-[#0f1d3d]/95 border-blue-900/60 text-white";
      case "forest":
        return "bg-[#0c2e22]/95 border-emerald-900/60 text-white";
      case "sunset":
        return "bg-[#281a10]/95 border-amber-900/60 text-white";
      default:
        return "bg-white border-zinc-200 text-zinc-900";
    }
  };

  return (
    <div className={`min-h-screen ${getAdminThemeClass()} pb-20 transition-colors duration-200`} dir={dir}>
      {/* Top Header */}
      <header className={`${getAdminHeaderClass()} border-b sticky top-0 z-40 shadow-xs transition-colors duration-200`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-black flex items-center justify-center text-xs shadow-sm">
              AD
            </span>
            <div>
              <h1 className="font-extrabold text-xs sm:text-base leading-tight">
                {t("admin", "title")}
              </h1>
              <p className="text-[10px] text-zinc-400 hidden sm:block">{t("admin", "subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Multi-Theme Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs"
                title="Themes / تغيير المظهر"
              >
                <Palette className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline text-[11px]">
                  {adminTheme === "default" && "☀️ Light"}
                  {adminTheme === "dark" && "🌙 Dark"}
                  {adminTheme === "navy" && "🌊 Navy"}
                  {adminTheme === "forest" && "🌲 Forest"}
                  {adminTheme === "sunset" && "🌅 Amber"}
                </span>
              </button>

              {themeDropdownOpen && (
                <div className={`absolute top-full mt-2 ${dir === "rtl" ? "left-0" : "right-0"} w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1 text-zinc-800 dark:text-zinc-200`}>
                  <button
                    type="button"
                    onClick={() => changeAdminTheme("default")}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      adminTheme === "default" ? "bg-zinc-900 text-white" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>☀️</span>
                    <span>فاتح (Light)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => changeAdminTheme("dark")}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      adminTheme === "dark" ? "bg-amber-400 text-zinc-950 font-black" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>🌙</span>
                    <span>داكن (Dark)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => changeAdminTheme("navy")}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      adminTheme === "navy" ? "bg-blue-600 text-white" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>🌊</span>
                    <span>كحلي (Navy Blue)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => changeAdminTheme("forest")}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      adminTheme === "forest" ? "bg-emerald-600 text-white" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>🌲</span>
                    <span>زمردي (Forest)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => changeAdminTheme("sunset")}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      adminTheme === "sunset" ? "bg-amber-600 text-white" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>🌅</span>
                    <span>عنبر (Amber)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher next to theme: 1 AR | 2 EN | 3 FR */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full p-0.5 text-[10px] sm:text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={`px-2 py-1 rounded-full transition cursor-pointer ${
                  lang === "ar"
                    ? "bg-amber-400 text-zinc-950 font-black shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
                title="العربية (الأساسية)"
              >
                🇩🇿 ع
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-full transition cursor-pointer ${
                  lang === "en"
                    ? "bg-amber-400 text-zinc-950 font-black shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`px-2 py-1 rounded-full transition cursor-pointer ${
                  lang === "fr"
                    ? "bg-amber-400 text-zinc-950 font-black shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
                title="Français"
              >
                🇫🇷 FR
              </button>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition"
            >
              <span>{t("admin", "visitStore")}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("admin", "logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Notice for 48h auto purge */}
        <div className="mb-6 bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>نظام التنظيف التلقائي مفعّل:</strong> الطلبيات المشحونة أو الملغاة تُحذف تلقائياً وبشكل نهائي من قاعدة البيانات بعد مرور 48 ساعة.
            </span>
          </div>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1">الطلبات الجديدة (Pending)</span>
            <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1">الطلبات المؤكدة</span>
            <span className="text-2xl font-black text-emerald-600">{confirmedCount}</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1">المنتجات المعروضة</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-900">{activeProductsCount}</span>
              {deletedProductsCount > 0 && (
                <span className="text-[11px] text-red-500 font-bold">({deletedProductsCount} محذوف)</span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm relative group hover:border-amber-400/80 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-zinc-400">إجمالي المبيعات المحتمل</span>
              <button
                type="button"
                onClick={() => {
                  setSalesInputVal(customRevenue !== null ? customRevenue.toString() : "0");
                  setIsSalesModalOpen(true);
                }}
                className="text-[10px] font-extrabold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-0.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="تصفير الأرباح أو كتابة المبلغ الذي تريده"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>تصفير / تعديل</span>
              </button>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg sm:text-2xl font-black text-zinc-900">
                {formatPrice(totalRevenue)}
              </span>
              {customRevenue !== null && (
                <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full shrink-0">
                  معدل: {formatPrice(customRevenue)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "orders"
                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t("admin", "orders")} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "products"
                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t("admin", "products")} ({activeProductsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("new-product")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "new-product"
                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{t("admin", "addProduct")}</span>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "finance"
                ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
            }`}
          >
            <Wallet className="w-4 h-4 text-amber-500" />
            <span>{lang === "fr" ? "Finances (Caisse) 💰" : lang === "en" ? "Finance (Cash) 💰" : "الحسابات والأرباح (Caisse) 💰"}</span>
          </button>
        </div>

        {/* TAB 1: ORDERS LIST */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400 text-xs">
                لا توجد طلبيات حالياً في قاعدة البيانات.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-800">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {new Date(order.createdAt).toLocaleString("ar-DZ")}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {order.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> بانتظار التأكيد
                        </span>
                      )}
                      {order.status === "confirmed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> مؤكدة للشحن
                        </span>
                      )}
                      {order.status === "shipped" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                          <Truck className="w-3 h-3" /> تم الإرسال (تُحذف بعد 48h)
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> ملغاة
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-zinc-400 text-[11px] block">معلومات الزبون:</span>
                      <p className="font-bold text-zinc-900 text-sm">{order.fullName}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <a
                          href={`tel:${order.phone}`}
                          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                          title="اتصال هاتفي مباشر"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span dir="ltr">{order.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/213${order.phone.replace(/\D/g, "").replace(/^0/, "")}?text=${encodeURIComponent(
                            `السلام عليكم ${order.fullName}، معك متجر axb.wear بخصوص طلبيتك رقم ${order.id} (${order.productTitle}) بمبلغ ${order.totalPrice} دج. هل أنت متفرغ لتأكيد الشحن؟`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg text-[11px] font-bold shadow-xs transition"
                          title="مراسلة واتساب لتأكيد الشحن بنقرة واحدة"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-400 text-[11px] block">العنوان والتوصيل:</span>
                      <p className="font-semibold text-zinc-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {order.wilayaName} - {order.commune || "وسط المدينة"}
                      </p>
                      <p className="text-zinc-500 text-[11px]">
                        {order.deliveryType === "home" ? "توصيل للمنزل (+ " + order.deliveryPrice + " دج)" : "استلام من مكتب التوصيل (+ " + order.deliveryPrice + " دج)"}
                      </p>
                    </div>

                    <div className="space-y-1 md:text-left">
                      <span className="text-zinc-400 text-[11px] block">المنتج والمبلغ:</span>
                      <p className="font-bold text-zinc-900">
                        {order.productTitle} ({order.quantity} قطعة)
                      </p>
                      <p className="text-zinc-500 text-[11px]">
                        المقاس: <span className="font-semibold text-zinc-800">{order.selectedSize}</span>
                        {order.selectedColor ? " | اللون: " + order.selectedColor : ""}
                      </p>
                      <p className="text-sm font-black text-emerald-600 mt-1">
                        المجموع: {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Actions to change status + Delete */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-[11px] text-zinc-400">تغيير الحالة:</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        تأكيد الطلب
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                      >
                        تم الشحن
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition"
                      >
                        إلغاء
                      </button>
                    </div>

                    {/* Immediate Delete Button */}
                    <button
                      onClick={() => deleteOrderImmediately(order.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                      title="حذف نهائي الآن من الداتابيز"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف فوري</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS LIST */}
        {activeTab === "products" && (
          <div className="space-y-5">
            {/* Filter & Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setProductFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    productFilter === "all"
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  All Products ({products.length})
                </button>
                <button
                  onClick={() => setProductFilter("active")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    productFilter === "active"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  In Stock ({activeProductsCount})
                </button>
                <button
                  onClick={() => setProductFilter("outofstock")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    productFilter === "outofstock"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Sold Out ({outOfStockCount})
                </button>
                <button
                  onClick={() => setProductFilter("deleted")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    productFilter === "deleted"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Deleted ({deletedProductsCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                  title="استرجاع وتفعيل المنتجات الأصلية الافتراضية"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                  <span>استرجاع الافتراضية</span>
                </button>
                <button
                  onClick={() => setActiveTab("new-product")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>
            </div>

            {/* Empty state */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400 text-xs shadow-sm">
                No products found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.map((prod) => {
                  const isDeleted = Boolean(prod.isDeleted);
                  const isOutOfStock = prod.inStock === false;
                  const isBusy = actionLoadingId === prod.id;
                  const hasPromo = Boolean(prod.badge || (prod.originalPrice && prod.originalPrice > prod.price));

                  return (
                    <div
                      key={prod.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col p-4 shadow-sm relative ${
                        isDeleted 
                          ? "border-red-200 bg-red-50/10 ring-1 ring-red-100" 
                          : isOutOfStock
                          ? "border-amber-200 bg-amber-50/20"
                          : "border-zinc-200"
                      }`}
                    >
                      {/* Status header badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isDeleted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-lg border border-red-200 font-mono uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                              Deleted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 font-mono uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Active
                            </span>
                          )}

                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-300 font-mono uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                              SOLD OUT
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-lg border border-zinc-200 font-mono uppercase">
                              IN STOCK
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-zinc-400">
                          {prod.id}
                        </span>
                      </div>

                      {/* Product Image */}
                      <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden mb-3 relative group">
                        <img
                          src={prod.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"}
                          alt={prod.name}
                          className={`w-full h-full object-cover transition duration-200 ${
                            isDeleted ? "grayscale opacity-70" : isOutOfStock ? "opacity-80" : ""
                          }`}
                        />
                        {prod.badge && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
                            {prod.badge}
                          </span>
                        )}
                        {isOutOfStock ? (
                          <span className="absolute bottom-2 left-2 bg-zinc-950/90 text-amber-400 font-black text-[10px] px-2.5 py-1 rounded-lg border border-amber-400/40 backdrop-blur-xs shadow-md tracking-wider uppercase flex items-center gap-1">
                            ⚠️ SOLD OUT
                          </span>
                        ) : !isDeleted && (
                          <span className="absolute bottom-2 left-2 bg-zinc-950/90 text-emerald-400 font-black text-[10px] px-2.5 py-1 rounded-lg border border-emerald-400/40 backdrop-blur-xs shadow-md tracking-wider uppercase flex items-center gap-1">
                            ✅ IN STOCK
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-zinc-900 line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-zinc-400 mb-2 line-clamp-1">{prod.subtitle || "Streetwear"}</p>

                      {/* Price row */}
                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-zinc-900">{formatPrice(prod.price)}</span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-[11px] text-zinc-400 line-through">
                              {formatPrice(prod.originalPrice)}
                            </span>
                          )}
                        </div>
                        {!isDeleted ? (
                          <Link
                            href={`/products/${prod.id}`}
                            target="_blank"
                            className="text-xs text-zinc-600 hover:text-black font-semibold underline"
                          >
                            Preview ↗
                          </Link>
                        ) : (
                          <span className="text-[11px] text-red-500 font-bold">Hidden</span>
                        )}
                      </div>

                      {/* Action buttons: Edit, Stock, Promo, Delete, Restore */}
                      <div className="mt-auto pt-3 border-t border-zinc-100 space-y-2">
                        {/* Edit Product Button */}
                        <button
                          onClick={() => openEditModal(prod)}
                          disabled={isBusy}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 transition active:scale-95 cursor-pointer shadow-xs disabled:opacity-50"
                          title="تعديل اسم وسعر ووصف وصورة ومقاسات المنتج"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span>تعديل تفاصيل المنتج (Edit)</span>
                        </button>

                        {/* Row 1: Stock Status Toggle & Promotion Edit */}
                        <div className="flex items-center gap-2">
                          {/* Stock Toggle */}
                          <button
                            onClick={() => handleToggleStock(prod.id, prod.inStock !== false)}
                            disabled={isBusy}
                            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50 ${
                              isOutOfStock
                                ? "bg-amber-100 hover:bg-emerald-50 text-amber-900 hover:text-emerald-800 border border-amber-300 hover:border-emerald-300 shadow-xs"
                                : "bg-zinc-100 hover:bg-amber-50 text-zinc-700 hover:text-amber-800 border border-zinc-200 hover:border-amber-300"
                            }`}
                            title={isOutOfStock ? "Click to set IN STOCK" : "Click to set SOLD OUT"}
                          >
                            {isOutOfStock ? (
                              <>
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                <span>⚠️ Sold Out</span>
                              </>
                            ) : (
                              <>
                                <Box className="w-3.5 h-3.5 text-emerald-600" />
                                <span>📦 In Stock</span>
                              </>
                            )}
                          </button>

                          {/* Promo Button */}
                          <button
                            onClick={() => openPromoModal(prod)}
                            disabled={isBusy}
                            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50 ${
                              hasPromo
                                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-xs"
                                : "bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200"
                            }`}
                            title="Edit Sale / Discount"
                          >
                            <Tag className="w-3.5 h-3.5 text-red-500" />
                            <span>{prod.badge ? `Sale (${prod.badge})` : "🏷️ Sale / Promo"}</span>
                          </button>
                        </div>

                        {/* Row 2: Delete / Restore & Permanent Delete */}
                        <div className="flex items-center gap-2">
                          {!isDeleted ? (
                            <button
                              onClick={() => handleToggleDelete(prod.id, false)}
                              disabled={isBusy}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 transition active:scale-95 cursor-pointer disabled:opacity-50"
                              title="Delete from store"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleDelete(prod.id, true)}
                              disabled={isBusy}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 hover:border-emerald-600 transition active:scale-95 cursor-pointer disabled:opacity-50"
                              title="Restore to store"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                          )}

                          <button
                            onClick={() => handlePermanentDelete(prod.id, prod.name)}
                            disabled={isBusy}
                            className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-zinc-200 hover:border-red-200 transition cursor-pointer disabled:opacity-50"
                            title="Permanent Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-500" />
                            <span className="text-[10px]">Permanent</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADD NEW PRODUCT FORM */}
        {activeTab === "new-product" && (
          <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900 mb-1">إضافة منتج جديد للمتجر</h2>
            <p className="text-xs text-zinc-400 mb-6">
              بمجرد حفظ هذا النموذج، سيظهر المنتج تلقائياً في الصفحة الرئيسية لجميع الزبائن.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Oversized Vintage Hoodie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">وصف فرعي / Subtitle</label>
                <input
                  type="text"
                  placeholder="مثال: قطن 100% ثقيل 400 GSM"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">السعر للبيع (دج) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">السعر الأصلي قبل التخفيض (اختياري)</label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">المقاسات (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={sizesStr}
                    onChange={(e) => setSizesStr(e.target.value)}
                    placeholder="S, M, L, XL, XXL"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">شعار الخصم (Badge)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="-20% أو جديد 🔥"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>
              </div>

              {/* Product Image Section: File Upload from PC/Phone or URL */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block text-zinc-800 font-bold text-xs">
                    صورة المنتج الرئيسية *
                  </label>
                  <div className="flex items-center bg-zinc-200/80 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setNewProductImageMode("file")}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        newProductImageMode === "file" 
                          ? "bg-white text-zinc-900 shadow-xs" 
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      📁 رفع من جهازك (PC / الهاتف)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProductImageMode("url")}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        newProductImageMode === "url" 
                          ? "bg-white text-zinc-900 shadow-xs" 
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      🔗 إدخال رابط (URL)
                    </button>
                  </div>
                </div>

                {newProductImageMode === "file" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-white hover:bg-zinc-50/70 rounded-xl p-5 cursor-pointer transition group">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-amber-50 text-zinc-500 group-hover:text-amber-600 flex items-center justify-center mb-2 transition">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-zinc-800">
                        اضغط هنا لاختيار صورة من جهازك
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">
                        يدعم جميع أنواع الصور (JPG, PNG, WEBP) - يتم ضغطها وتحسين سرعتها تلقائياً
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUploadForNew}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... (أو اترك فارغاً لاستخدام صورة افتراضية)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition dir-ltr text-right"
                    />
                  </div>
                )}

                {/* Preview Selected Image */}
                {imageUrl && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
                    <img
                      src={imageUrl}
                      alt="معاينة الصورة"
                      className="w-14 h-14 object-cover rounded-lg border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>تم تحديد صورة المنتج بنجاح</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate block mt-0.5 dir-ltr text-left">
                        {imageUrl.startsWith("data:") ? "صورة مخصصة مرفوعة من جهازك" : imageUrl}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0"
                    >
                      إلغاء الصورة
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">وصف وتفاصيل المنتج</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب تفاصيل القماش وطريقة الغسيل..."
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={submittingProduct}
                className="w-full bg-zinc-950 hover:bg-black text-white font-black py-3.5 px-6 rounded-xl text-xs sm:text-sm tracking-wide transition shadow-sm disabled:opacity-50 mt-4 cursor-pointer"
              >
                {submittingProduct ? "جاري الإضافة..." : "حفظ المنتج وعرضه في المتجر"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: FINANCIAL TRACKING & CASHFLOW (CAISSE & PROFITS) */}
        {activeTab === "finance" && (
          <div className="space-y-8">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Net Profit Card */}
              <div className={`p-5 rounded-2xl border shadow-sm ${
                netProfit >= 0 
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-600" 
                  : "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-600"
              }`}>
                <div className="flex items-center justify-between opacity-90 text-xs font-bold mb-2">
                  <span>صافي الأرباح (Bénéfice Net)</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-black mb-1">
                  {formatPrice(netProfit)}
                </div>
                <div className="text-[11px] opacity-85 font-semibold">
                  {netProfit >= 0 ? "المشروع في حالة ربح ممتاز 🔥" : "المصاريف أعلى من المبيعات حالياً"}
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-bold mb-2">
                  <span>إجمالي المداخيل (Revenus)</span>
                  <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mb-1">
                  {formatPrice(totalRevenues)}
                </div>
                <div className="text-[11px] text-zinc-500">
                  مبيعات مؤكدة: {formatPrice(storeDeliveredRevenue + storeConfirmedRevenue)}
                </div>
              </div>

              {/* Total Expenses Card */}
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-bold mb-2">
                  <span>إجمالي المصاريف (Dépenses)</span>
                  <ArrowUpRight className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-red-600 mb-1">
                  {formatPrice(totalExpenses)}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {expenses.filter((e) => e.type === "expense").length} عملية صرف مسجلة
                </div>
              </div>

              {/* Pending Orders Revenue Card */}
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-bold mb-2">
                  <span>قيد التحصيل (طلبيات جديدة)</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 mb-1">
                  {formatPrice(storePendingRevenue)}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {pendingCount} طلبيات تنتظر التأكيد
                </div>
              </div>
            </div>

            {/* Expenses Breakdown by Category */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-zinc-500" />
                <span>توزيع المصاريف حسب الصنف:</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-zinc-500 text-[11px] block">📦 شراء السلعة:</span>
                  <span className="font-bold text-zinc-900 mt-1 block">
                    {formatPrice(expenses.filter((e) => e.category === "inventory" && e.type === "expense").reduce((acc, c) => acc + c.amount, 0))}
                  </span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-zinc-500 text-[11px] block">📣 الإعلانات (Ads):</span>
                  <span className="font-bold text-zinc-900 mt-1 block">
                    {formatPrice(expenses.filter((e) => e.category === "ads" && e.type === "expense").reduce((acc, c) => acc + c.amount, 0))}
                  </span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-zinc-500 text-[11px] block">🏷️ التغليف والأكياس:</span>
                  <span className="font-bold text-zinc-900 mt-1 block">
                    {formatPrice(expenses.filter((e) => e.category === "packaging" && e.type === "expense").reduce((acc, c) => acc + c.amount, 0))}
                  </span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <span className="text-zinc-500 text-[11px] block">🚚 الشحن والنقل:</span>
                  <span className="font-bold text-zinc-900 mt-1 block">
                    {formatPrice(expenses.filter((e) => e.category === "shipping" && e.type === "expense").reduce((acc, c) => acc + c.amount, 0))}
                  </span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 col-span-2 sm:col-span-1">
                  <span className="text-zinc-500 text-[11px] block">💼 مصاريف أخرى:</span>
                  <span className="font-bold text-zinc-900 mt-1 block">
                    {formatPrice(expenses.filter((e) => e.category === "other" && e.type === "expense").reduce((acc, c) => acc + c.amount, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Add New Expense/Income Form */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/90 shadow-sm space-y-4">
              <h3 className="font-black text-base text-zinc-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>تسجيل حركة مالية جديدة (مصروف أو مدخول)</span>
              </h3>

              <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
                {/* Type toggle: Expense vs Income */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setExpType("expense")}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      expType === "expense"
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <span>🔴 تسجيل مصروف (خرجت دراهم)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpType("income")}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      expType === "income"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <span>🟢 تسجيل مدخول إضافي (دخلت دراهم)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-700 font-bold mb-1.5">
                      {expType === "expense" ? "بيان المصروف (عنوان العملية) *" : "مصدر المدخول *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={expType === "expense" ? "مثال: شراء 50 متر قماش هودي أسود، أو إعلان فيسبوك" : "مثال: مبيعات يدوية مباشرة، أو استثمار إضافي"}
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1.5">المبلغ بالدينار (دج) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="5000"
                      value={expAmount}
                      onChange={(e) => setExpAmount(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1.5">التصنيف</label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value as any)}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-3 py-3 text-xs text-zinc-900 outline-none transition cursor-pointer"
                    >
                      <option value="inventory">📦 شراء السلعة والتوريد</option>
                      <option value="ads">📣 الإعلانات والممول (Meta / TikTok)</option>
                      <option value="packaging">🏷️ التغليف والعلب والأكياس</option>
                      <option value="shipping">🚚 الشحن والتوصيل والنقل</option>
                      <option value="other">💼 مصاريف أخرى عامة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1.5">ملاحظات (اختياري)</label>
                    <input
                      type="text"
                      placeholder="تفاصيل إضافية للرجوع إليها..."
                      value={expNotes}
                      onChange={(e) => setExpNotes(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingExpense}
                  className="bg-zinc-950 hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submittingExpense ? "جاري الحفظ..." : "حفظ المعاملة في الداتابيز 💾"}
                </button>
              </form>
            </div>

            {/* Transactions History Log */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <h3 className="font-black text-sm text-zinc-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-zinc-600" />
                  <span>سجل الحركات المالية والمصاريف ({filteredExpenses.length})</span>
                </h3>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  {[
                    { id: "all", label: "الكل" },
                    { id: "expense", label: "المصاريف 🔴" },
                    { id: "income", label: "المداخيل 🟢" },
                    { id: "inventory", label: "السلعة" },
                    { id: "ads", label: "الإعلانات" },
                    { id: "packaging", label: "التغليف" },
                    { id: "shipping", label: "الشحن" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setExpenseFilter(filter.id)}
                      className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                        expenseFilter === filter.id
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  لا توجد حركات مالية مسجلة في هذا التصنيف.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredExpenses.map((txn) => {
                    const isExp = txn.type === "expense";
                    return (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 hover:bg-zinc-50/80 transition text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                            isExp ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {isExp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900">{txn.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                              <span>{new Date(txn.createdAt).toLocaleDateString("ar-DZ")}</span>
                              <span>•</span>
                              <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-medium">
                                {txn.category === "inventory" ? "📦 سلعة" :
                                 txn.category === "ads" ? "📣 إعلانات" :
                                 txn.category === "packaging" ? "🏷️ تغليف" :
                                 txn.category === "shipping" ? "🚚 شحن" : "💼 أخرى"}
                              </span>
                              {txn.notes && <span>• {txn.notes}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`font-black text-sm ${isExp ? "text-red-600" : "text-emerald-600"}`}>
                            {isExp ? "-" : "+"}{formatPrice(txn.amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(txn.id, txn.title)}
                            className="text-zinc-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                            title="حذف هذه المعاملة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {editingPromoProduct && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-zinc-200 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-zinc-900">إدارة التخفيض والعروض (Solde)</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{editingPromoProduct.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingPromoProduct(null)}
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSavePromotion} className="p-5 space-y-4 text-xs">
                {/* Quick percentage pills */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">
                    تطبيق نسبة تخفيض سريعة:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[10, 20, 30, 40, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyDiscountPercent(pct)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-red-50 hover:text-red-700 border border-zinc-200 hover:border-red-300 transition cursor-pointer"
                      >
                        -{pct}%
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPromoBadge("🔥 Solde")}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                    >
                      🔥 Solde
                    </button>
                    <button
                      type="button"
                      onClick={removePromotion}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-50 hover:bg-zinc-200 text-zinc-600 border border-zinc-200 transition cursor-pointer ml-auto"
                      title="إلغاء التخفيض والعودة للسعر العادي"
                    >
                      ❌ إلغاء التخفيض
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">
                      سعر البيع المخفض (دج) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(e.target.value)}
                      placeholder="مثال: 2500"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-red-500 focus:bg-white rounded-xl px-3 py-2.5 text-xs text-zinc-900 font-bold outline-none transition"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block">السعر الذي سيدفعه الزبون</span>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">
                      السعر القديم المشطوب (دج)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={promoOriginalPrice}
                      onChange={(e) => setPromoOriginalPrice(e.target.value)}
                      placeholder="مثال: 3200"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-3 py-2.5 text-xs text-zinc-900 outline-none transition"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block">يظهر مشطوباً فوق السعر</span>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    شارة التخفيض (Badge)
                  </label>
                  <input
                    type="text"
                    value={promoBadge}
                    onChange={(e) => setPromoBadge(e.target.value)}
                    placeholder="مثال: -20% أو 🔥 Solde أو عرض خاص"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-3 py-2.5 text-xs text-zinc-900 outline-none transition"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">تظهر كشارة حمراء مميزة على صورة المنتج</span>
                </div>

                {/* Live Preview Card */}
                <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={editingPromoProduct.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg border border-zinc-200"
                    />
                    <div>
                      <span className="text-[11px] text-zinc-500 block">المعاينة كما يراها الزبون:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-black text-red-600 text-sm">
                          {formatPrice(Number(promoPrice) || 0)}
                        </span>
                        {promoOriginalPrice && Number(promoOriginalPrice) > (Number(promoPrice) || 0) && (
                          <span className="text-zinc-400 line-through text-[11px]">
                            {formatPrice(Number(promoOriginalPrice))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {promoBadge && (
                    <span className="bg-red-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                      {promoBadge}
                    </span>
                  )}
                </div>

                {/* Modal actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={savingPromo}
                    className="flex-1 bg-zinc-950 hover:bg-black text-white font-extrabold py-3 px-4 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {savingPromo ? "جاري الحفظ..." : "حفظ التخفيض والعرض"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPromoProduct(null)}
                    className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-bold transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Full Edit Product Details (تعديل تفاصيل المنتج) */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto" dir="rtl">
            <div className="bg-white rounded-3xl border border-zinc-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-zinc-900">تعديل تفاصيل المنتج</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{editingProduct.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <form onSubmit={handleSaveEditProduct} className="p-5 space-y-4 overflow-y-auto text-xs">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">اسم المنتج *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="مثال: T-shirt Oversized Streetwear"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">وصف فرعي / Subtitle</label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    placeholder="مثال: قطن 100% ثقيل 400 GSM"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1.5">السعر الحالي للبيع (دج) *</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="2800"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1.5">السعر الأصلي قبل التخفيض (دج)</label>
                    <input
                      type="number"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      placeholder="3500 (اختياري)"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1.5">المقاسات (مفصولة بفاصلة)</label>
                    <input
                      type="text"
                      value={editSizesStr}
                      onChange={(e) => setEditSizesStr(e.target.value)}
                      placeholder="S, M, L, XL"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1.5">الألوان (مفصولة بفاصلة)</label>
                    <input
                      type="text"
                      value={editColorsStr}
                      onChange={(e) => setEditColorsStr(e.target.value)}
                      placeholder="أسود, رمادي, أبيض"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">شارة العرض أو الخصم (Badge)</label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    placeholder="مثال: -20% أو 🔥 Solde أو جديد"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                {/* Edit Product Image */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-zinc-800 font-bold text-xs">
                      صورة المنتج
                    </label>
                    <div className="flex items-center bg-zinc-200/80 p-0.5 rounded-lg text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setEditImageMode("file")}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                          editImageMode === "file" 
                            ? "bg-white text-zinc-900 shadow-xs" 
                            : "text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        📁 رفع من جهازك (PC / الهاتف)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditImageMode("url")}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                          editImageMode === "url" 
                            ? "bg-white text-zinc-900 shadow-xs" 
                            : "text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        🔗 رابط (URL)
                      </button>
                    </div>
                  </div>

                  {editImageMode === "file" ? (
                    <div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-white hover:bg-zinc-50/70 rounded-xl p-4 cursor-pointer transition group">
                        <Upload className="w-5 h-5 text-zinc-400 group-hover:text-amber-600 mb-1.5 transition" />
                        <span className="text-xs font-bold text-zinc-700">تغيير الصورة واختيار ملف من جهازك</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">يدعم JPG, PNG, WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUploadForEdit}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="w-full bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition dir-ltr text-right"
                      />
                    </div>
                  )}

                  {/* Current / New Image Preview */}
                  {editImageUrl && (
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-zinc-200">
                      <img
                        src={editImageUrl}
                        alt="معاينة"
                        className="w-12 h-12 object-cover rounded-lg border border-zinc-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-zinc-700 block">الصورة الحالية للمنتج</span>
                        <span className="text-[10px] text-zinc-400 truncate block mt-0.5 dir-ltr text-left">
                          {editImageUrl.startsWith("data:") ? "صورة مرفوعة من جهازك" : editImageUrl}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">وصف وتفاصيل المنتج</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="اكتب تفاصيل القماش ومقاسات العارض والعناية..."
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                {/* Modal actions */}
                <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="flex-1 bg-zinc-950 hover:bg-black text-white font-extrabold py-3 px-4 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {savingEdit ? "جاري الحفظ..." : "حفظ التعديلات في المتجر"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-bold transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB & MODAL: Sales & Revenue Management (Reset to 0 / Custom Value / Purge Orders) */}
        {isSalesModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-900">تصفير وتعديل إجمالي المبيعات والأرباح</h3>
                    <p className="text-[10px] text-zinc-400">تحكم كامل في الرقم الظاهر في الإحصائيات</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSalesModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current status display */}
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">المبلغ المعروض حالياً:</span>
                  <span className="text-base font-black text-zinc-900">{formatPrice(totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">المبلغ الفعلي المحسوب من الطلبيات:</span>
                  <span className="font-bold text-zinc-600">{formatPrice(calculatedTotalRevenue)}</span>
                </div>
              </div>

              {/* Option 1: Quick Reset to 0 DZD */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-zinc-800 block">1. تصفير فوري بنقرة واحدة:</span>
                <button
                  type="button"
                  onClick={() => handleSaveCustomRevenue(0)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تصفير إجمالي المبيعات إلى 0 د.ج. فوراً</span>
                </button>
              </div>

              {/* Option 2: Set custom amount */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const num = Number(salesInputVal);
                  if (isNaN(num) || num < 0) {
                    alert("يرجى إدخال مبلغ صحيح (0 أو أكبر)");
                    return;
                  }
                  handleSaveCustomRevenue(num);
                }}
                className="space-y-2 pt-3 border-t border-zinc-100"
              >
                <label className="text-xs font-bold text-zinc-800 block">2. أو حدد المبلغ الذي تريده كما تحب:</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={salesInputVal}
                      onChange={(e) => setSalesInputVal(e.target.value)}
                      placeholder="مثلاً: 0 أو 50000"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-amber-400 focus:bg-white rounded-xl py-2.5 px-3 text-xs font-bold text-zinc-900 outline-none transition"
                    />
                    <span className="absolute left-3 top-2.5 text-xs text-zinc-400 font-bold pointer-events-none">د.ج.</span>
                  </div>
                  <button
                    type="submit"
                    className="bg-zinc-950 hover:bg-black text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shrink-0"
                  >
                    حفظ المبلغ
                  </button>
                </div>
              </form>

              {/* Option 3: Restore automatic calculation */}
              {customRevenue !== null && (
                <div className="pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => handleSaveCustomRevenue(null)}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                    <span>استرجاع الحساب التلقائي من الطلبيات ({formatPrice(calculatedTotalRevenue)})</span>
                  </button>
                </div>
              )}

              {/* Option 4: Wipe all orders from database */}
              {orders.length > 0 && (
                <div className="pt-3 border-t border-red-100 bg-red-50/60 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-red-700 text-xs font-bold">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تصفير وحذف جميع الطلبيات التجريبية ({orders.length} طلبية):</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    إذا أردت البدء على بياض ومسح كل الطلبيات التجريبية من قاعدة البيانات وتصفير عداد المبيعات والطلبات كلياً.
                  </p>
                  <button
                    type="button"
                    onClick={handleDeleteAllOrders}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>حذف جميع الطلبيات المسجلة نهائياً (تصفير كامل)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}