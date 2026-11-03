import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeProvider from "@/components/ThemeProvider";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, INSTITUTION } from "@/config/site";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `${SITE_NAME} is the Entrepreneurship Cell of ${INSTITUTION} (ACET), Bengaluru — a student-led ecosystem that turns belief into ventures through mentorship, incubation and hands-on programmes.`,
  keywords: [
    "entrepreneurship",
    "startup",
    "E-Cell",
    "ACET",
    "Bengaluru",
    "BLIEVE",
    "incubation",
    "mentorship",
    "innovation",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: `${SITE_NAME} — E-Cell, ACET Bengaluru` }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "The student-run Entrepreneurship Cell of ACET, Bengaluru — where an unfinished idea becomes a venture.",
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "The student-run Entrepreneurship Cell of ACET, Bengaluru — where an unfinished idea becomes a venture.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: `${SITE_NAME} — Entrepreneurship Cell`,
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/blieve-logo.png`,
  description:
    "Student-run Entrepreneurship Cell of Aditya College of Engineering and Technology (ACET), Bengaluru.",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: INSTITUTION,
    url: "https://www.acetedu.net",
  },
  location: {
    "@type": "Place",
    name: "Bengaluru, Karnataka, India",
  },
  sameAs: ["https://www.instagram.com/blieve_ecell"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "general enquiries",
    email: "president@blieve.in",
    telephone: "+91-90198-08476",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-surface text-text-grey dark:bg-[#0F0F1A] dark:text-gray-200">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <ScrollProgress />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
