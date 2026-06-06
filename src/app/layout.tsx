import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import JsonLd from "@/components/common/json-ld";
import SmoothScroll from "@/components/common/smooth-scroll";
import CustomCursor from "@/components/common/custom-cursor";
import ConsentBanner from "@/components/common/consent-banner";
import { CityProvider } from "@/contexts/city-context";
import { SOCIAL_PROFILE_URLS } from "@/constants";
import { getCities } from "@/lib/cities";
import { SITE_URL } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Kept under ~60 chars so SERPs render it without truncation.
    default: "Klaps - Seanse specjalne i klasyka w kinach studyjnych",
    template: "%s - Klaps",
  },
  description:
    "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych w Polsce. Repertuar, filmy i kina w jednym miejscu.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Klaps",
    title: "Klaps - Seanse specjalne i klasyka w kinach studyjnych",
    description:
      "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych. Sprawdź, co grają.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klaps - Seanse specjalne i klasyka w kinach studyjnych",
    description:
      "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych.",
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
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: 'denied'
                });
                gtag('js', new Date());
                gtag('config', '${process.env.GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Klaps",
            url: SITE_URL,
            logo: `${SITE_URL}/web-app-manifest-512x512.png`,
            description:
              "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych w Polsce.",
            sameAs: [
              ...SOCIAL_PROFILE_URLS,
              "https://github.com/klaps-hq/klaps.space",
            ],
          }}
        />
        <SmoothScroll />
        <CustomCursor />
        {process.env.GA_MEASUREMENT_ID && <ConsentBanner />}
        <CityProvider cities={cities}>{children}</CityProvider>
      </body>
    </html>
  );
}
