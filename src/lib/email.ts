/**
 * Email system disabled - Basic store mode
 */

export interface OrderNotificationData {
  id: string;
  fullName: string;
  phone: string;
  wilayaName: string;
  commune: string;
  productTitle: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  deliveryType: string;
  deliveryPrice: number;
  totalPrice: number;
}

export interface AdminLoginNotificationData {
  loggedInAt: string;
  operatingSystem: string;
  browser: string;
  deviceType: "Desktop" | "Mobile" | "Tablet";
}

export async function sendOrderEmailNotification(_order: OrderNotificationData): Promise<boolean> {
  // Disabled - Basic mode
  return true;
}

export async function sendAdminLoginEmailNotification(_login: AdminLoginNotificationData): Promise<boolean> {
  // Disabled - Basic mode
  return true;
}