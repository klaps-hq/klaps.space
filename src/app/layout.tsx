import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/common/scroll-to-top";
import JsonLd from "@/components/common/json-ld";
import { CityProvider } from "@/contexts/city-context";
import { SOCIAL_PROFILE_URLS } from "@/constants";
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
    default:
      "Klaps - Seanse specjalne i klasyka filmowa w kinach studyjnych w Polsce",
    template: "%s - Klaps",
  },
  description:
    "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych w Polsce. Repertuar, filmy i kina w jednym miejscu.",
  keywords: [
    "kina studyjne",
    "seanse specjalne",
    "klasyka filmowa",
    "retrospektywy filmowe",
    "kino niezależne",
    "repertuar kin studyjnych",
    "filmy klasyczne w kinie",
    "pokazy specjalne",
    "kino artystyczne",
    "wznowienia filmowe",
  ],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Klaps",
    title:
      "Klaps - Seanse specjalne i klasyka filmowa w kinach studyjnych w Polsce",
    description:
      "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych. Sprawdź co grają.",
    images: [
      {
        url: "/klaps-og.png",
        width: 1200,
        height: 630,
        alt: "Klaps - Seanse specjalne i klasyka filmowa w kinach studyjnych",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Klaps - Seanse specjalne i klasyka filmowa w kinach studyjnych w Polsce",
    description:
      "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych.",
    images: ["/klaps-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": 160,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Klaps",
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.svg`,
            description:
              "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych w Polsce.",
            sameAs: [
              ...SOCIAL_PROFILE_URLS,
              "https://github.com/klaps-hq/klaps.space",
            ],
          }}
        />
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
