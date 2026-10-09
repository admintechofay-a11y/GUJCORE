import type { Metadata } from "next";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gujcorr.org"),
  title: {
    default: "GUJCORR 2027 | AMPP Gujarat Global Conference & Expo on Corrosion",
    template: "%s | GUJCORR 2027",
  },
  description: "India's Premier Corrosion Conference & Expo. 18th – 20th February 2027, Vadodara, Gujarat, India. Stronger Together: Uniting the Global Fight Against Corrosion.",
  keywords: [
    "GUJCORR 2027",
    "AMPP Gujarat Chapter",
    "IIM Baroda Chapter",
    "The Maharaja Sayajirao University of Baroda",
    "Corrosion Conference India",
    "Vadodara Corrosion Expo",
    "Materials Protection and Performance",
    "Asset Integrity Management",
    "Cathodic Protection",
    "Industrial Protective Coatings",
    "Microbiologically Influenced Corrosion",
    "Corrosion Under Insulation"
  ],
  authors: [{ name: "AMPP Gujarat Chapter & IIM Baroda Chapter" }],
  alternates: {
    canonical: "https://www.gujcorr.org",
  },
  openGraph: {
    title: "GUJCORR 2027 | India's Premier Corrosion Conference & Expo",
    description: "18–20 February 2027, Vadodara, Gujarat. Organized by AMPP Gujarat Chapter, Knowledge Partner MSU Baroda, Co-organizer IIM Baroda Chapter.",
    url: "https://www.gujcorr.org",
    siteName: "GUJCORR 2027",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hero-banner.jpg",
        width: 1200,
        height: 630,
        alt: "GUJCORR 2027 Global Conference & Expo on Corrosion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUJCORR 2027 | AMPP Gujarat Global Conference & Expo on Corrosion",
    description: "18–20 February 2027, Vadodara, Gujarat. Stronger Together: Uniting the Global Fight Against Corrosion.",
    images: ["/images/hero-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdEvent = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "AMPP Gujarat Global Conference & Expo on Corrosion (GUJCORR 2027)",
  description: "India's Premier International Conference and Exhibition dedicated to corrosion science, corrosion engineering, materials performance, asset integrity, and emerging technologies.",
  startDate: "2027-02-18T09:00:00+05:30",
  endDate: "2027-02-20T18:00:00+05:30",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Vadodara, Gujarat",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      postalCode: "390001",
      addressCountry: "IN"
    }
  },
  image: ["https://www.gujcorr.org/images/hero-banner.jpg"],
  organizer: [
    {
      "@type": "Organization",
      name: "AMPP Gujarat Chapter",
      url: "https://www.ampp.org"
    },
    {
      "@type": "Organization",
      name: "The Indian Institute of Metals (IIM), Baroda Chapter",
      url: "https://www.iimbaroda.com"
    },
    {
      "@type": "Organization",
      name: "The Maharaja Sayajirao University of Baroda"
    }
  ],
  offers: [
    {
      "@type": "Offer",
      name: "IIM / AMPP Member Delegate Registration",
      price: "4720",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: "https://www.gujcorr.org/registration"
    },
    {
      "@type": "Offer",
      name: "Non-IIM / Non-AMPP Member Delegate Registration",
      price: "7670",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: "https://www.gujcorr.org/registration"
    },
    {
      "@type": "Offer",
      name: "Student Delegate Registration",
      price: "1770",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: "https://www.gujcorr.org/registration"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased pb-16 md:pb-0" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
