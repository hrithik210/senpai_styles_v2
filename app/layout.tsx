import type { Metadata } from "next";
import { Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

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
      <head>
        {/* Meta Pixel Code */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1062450348539257&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {/* Meta Pixel Script */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1062450348539257');
              fbq('track', 'PageView');
            `
          }}
        />
        
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
