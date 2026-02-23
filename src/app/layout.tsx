import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/common/scroll-to-top";
import { CityProvider } from "@/contexts/city-context";
import { getCities } from "@/lib/cities";
import { SITE_URL } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Klaps - Repertuar seansów specjalnych i klasyki filmowej",
    template: "%s - Klaps",
  },
  description:
    "Ogólnopolski przewodnik po seansach specjalnych, klasyce i retrospektywach w kinach studyjnych. Sprawdź co grają.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Klaps",
    images: [
      {
        url: "/klaps-og.png",
        width: 1200,
        height: 630,
        alt: "Klaps - Repertuar seansów specjalnych i klasyki filmowej",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/klaps-og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cities = await getCities();

  return (
    <html lang="pl">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Klaps" />
        <link rel="manifest" href="/site.webmanifest" />
        {process.env.GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CityProvider cities={cities}>
          <Header cities={cities} />

          {children}

          <Footer />
          <ScrollToTop />
        </CityProvider>
      </body>
    </html>
  );
}
