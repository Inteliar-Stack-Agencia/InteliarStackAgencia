import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Architect — Inteliar",
  description: "Contame sobre tu empresa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen">{children}</body>
    </html>
  );
}
