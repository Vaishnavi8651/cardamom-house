import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { OrderProvider } from "@/components/order/OrderProvider";
import { ItemModal } from "@/components/order/ItemModal";
import { OrderBar } from "@/components/order/OrderBar";

/** Warm, slightly editorial serif for display type. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

/** Clean, highly legible sans for body and UI. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardamom House — Slow brunch & strong coffee in Lisbon",
  description:
    "Cardamom House is a brunch café in Lisbon. Slow brunch, single-origin coffee, and a saffron French toast worth crossing town for. See the full menu and opening hours.",
  openGraph: {
    title: "Cardamom House",
    description: "Slow brunch. Strong coffee. Lisbon, since 2021.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#b45309",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Set the theme class before first paint to avoid a flash of the wrong
            theme. Reads the saved choice, else falls back to system preference. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme:dark)').matches;var c=document.documentElement.classList;c.toggle('dark',d);c.toggle('light',!d);}catch(e){}})();`,
          }}
        />
        <OrderProvider>
          {children}
          <ItemModal />
          <OrderBar />
        </OrderProvider>
      </body>
    </html>
  );
}
