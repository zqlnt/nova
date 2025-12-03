import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Nova - E-Learning Platform",
  description: "AI-powered personalized education platform",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

