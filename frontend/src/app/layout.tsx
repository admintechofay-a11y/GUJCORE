import type { Metadata } from "next";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "GUJCORR 2027 | AMPP Gujarat Global Conference & Expo on Corrosion",
  description: "India's Premier Corrosion Conference & Expo. 18th – 20th February 2027, Vadodara, Gujarat, India. Jointly organized by AMPP Gujarat Chapter & IIM Baroda Chapter.",
  keywords: [
    "GUJCORR 2027",
    "Corrosion Conference India",
    "AMPP Gujarat Chapter",
    "IIM Baroda Chapter",
    "Vadodara Corrosion Expo",
    "Materials Protection",
    "Asset Integrity",
    "Cathodic Protection",
    "Protective Coatings"
  ],
  authors: [{ name: "AMPP Gujarat & IIM Baroda" }],
  openGraph: {
    title: "GUJCORR 2027 | India's Premier Corrosion Conference & Expo",
    description: "18th – 20th February 2027, Vadodara, Gujarat. Stronger Together: Uniting the Global Fight Against Corrosion.",
    type: "website",
    locale: "en_IN"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased pb-16 md:pb-0" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
