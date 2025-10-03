import type { Metadata } from "next";
import { Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Senpai Styles",
  description: "not another ordinary clothing store",
  icons: "/logo.avif"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <CartProvider>
          <Navbar />
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #EA2831',
              },
              success: {
                style: {
                  background: '#1a1a1a',
                  color: '#22c55e',
                  border: '1px solid #22c55e',
                },
              },
              error: {
                style: {
                  background: '#1a1a1a',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                },
              },
            }}
          />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
