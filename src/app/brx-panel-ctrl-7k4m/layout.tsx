import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة الإدارة",
  description: "لوحة إدارة متجر bx.wear.dz.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
