"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (
    productId: string,
    selectedSize: string,
    selectedColor: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "dzshoop_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existingItem = updated[existingIndex];
        updated[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + (newItem.quantity > 0 ? newItem.quantity : 1),
        };
        return updated;
      }

      return [...prevItems, { ...newItem, quantity: newItem.quantity > 0 ? newItem.quantity : 1 }];
    });
  }, []);

  const removeItem = useCallback(
    (productId: string, selectedSize: string, selectedColor: string) => {
      setItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
            )
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      selectedSize: string,
      selectedColor: string,
      quantity: number
    ) => {
      if (quantity <= 0) {
        removeItem(productId, selectedSize, selectedColor);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (
            item.productId === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          ) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.quantity * item.unitPrice, 0),
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
