import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "Crm Website",
  description: "Crm Website",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <AuthProvider>{children}</AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
