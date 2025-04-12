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
const logoUrl = `https://brmarketdata.com${getPublicPath('/icon.png')}`;

export const metadata: Metadata = {
  title: "BR Market Data | Preços e indicadores históricos de ações brasileiras",
  description: "Preços e indicadores históricos de ações brasileiras",
  icons: {
    icon: getPublicPath('/icon.png'),
    apple: getPublicPath('/icon.png'),
  },
  metadataBase: new URL('https://brmarketdata.com'),
  openGraph: {
    title: "Brazil Market Data API | 🇧🇷",
    description: "Preços e indicadores históricos de ações brasileiras",
    images: [
      {
        url: logoUrl,
        width: 600,
        height: 600,
        alt: "BR Market Data Logo",
      }
    ],
    type: 'website',
    siteName: 'BR Market Data',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Brazil Market Data API | 🇧🇷",
    description: "Preços e indicadores históricos de ações brasileiras",
    images: [logoUrl],
    creator: '@brmarketdata',
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
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="BR Market Data Logo" />
        <meta name="twitter:image" content={logoUrl} />
      </head>
      <body
        // className={`${quicksandFont.variable} font-sans antialiased`}
        className='font-sans antialiased'
        suppressHydrationWarning={true}
      >
        <ThemeProvider defaultTheme="light" storageKey="brmarketdata-theme">
          {children}
        </ThemeProvider>
        {/* 100% privacy-first analytics */}
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      </body>
    </html>
  );
}
