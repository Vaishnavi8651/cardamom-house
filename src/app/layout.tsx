import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { OrderProvider } from "@/components/order/OrderProvider";
import { ItemModal } from "@/components/order/ItemModal";
import { OrderBar } from "@/components/order/OrderBar";
import { menu } from "@/data/menu";

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

// Metadata is derived from the same JSON data source — no duplicated strings.
const { name, tagline, brand_color } = menu.restaurant;

export const metadata: Metadata = {
  title: `${name} — ${tagline}`,
  description: `${name}. ${tagline} See the full menu, today's special and opening hours.`,
  openGraph: {
    title: name,
    description: tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: brand_color,
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
