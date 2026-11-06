import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "XCEL - Industrial Laundry Equipment",
  description: "XCEL has been manufacturing high-performance industrial and commercial laundry equipment since 1994.",
  icons: {
    icon: [
      { url: "/xcel.svg", type: "image/svg+xml" },
    ],
    shortcut: "/xcel.svg",
    apple: [
      { url: "/xcel.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/xcel.svg" type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href="/xcel.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/xcel.svg" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
