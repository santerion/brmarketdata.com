import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { getPublicPath } from "@/lib/path-utils"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const quicksandFont = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

// Get the absolute URL for the image
const logoUrl = `https://santerion.com${getPublicPath('/logo_violet_light.avif')}`;

export const metadata: Metadata = {
  title: "Santerion | Software Development",
  description: "Software on budget & on time",
  icons: {
    icon: getPublicPath('/icon_violet.avif'),
    apple: getPublicPath('/icon_violet.avif'),
  },
  metadataBase: new URL('https://santerion.com'),
  openGraph: {
    title: "Santerion | Software Development",
    description: "Software on budget & on time",
    images: [
      {
        url: logoUrl,
        width: 1200,
        height: 630,
        alt: "Santerion Logo",
      }
    ],
    type: 'website',
    siteName: 'Santerion',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Santerion | Software Development",
    description: "Software on budget & on time",
    images: [logoUrl],
    creator: '@santerion',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Explicit Open Graph meta tags */}
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Santerion Logo" />
        <meta name="twitter:image" content={logoUrl} />
      </head>
      <body
        // className={`${quicksandFont.variable} font-sans antialiased`}
        className='font-sans antialiased'
        suppressHydrationWarning={true}
      >
        <ThemeProvider defaultTheme="light" storageKey="santerion-theme">
          {children}
        </ThemeProvider>
        {/* 100% privacy-first analytics */}
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      </body>
    </html>
  );
}
