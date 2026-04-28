import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL('https://therails.pk'),
  alternates: {
    canonical: '/',
  },
  title: "RAILSPK | Digital Legacy Project",
  description: "Official portal for Pakistan Railways fans. Explore Reviews, Fares, and Cinematic Travel Vlogs.",
  keywords: [
    "Pakistan Railways", "Train Reviews", "Railway Vlogs", "Railspk", 
    "Train Fares", "Railway Community", "Shalimar Express Reviews", 
    "Green line Reviews", "Karakoram Express Reviews", "Pak Business Express Reviews"
  ],

  // --- OPEN GRAPH (Facebook, WhatsApp, LinkedIn) ---
  openGraph: {
    title: 'RAILSPK | Digital Legacy Project',
    description: 'Documenting the heritage of Pakistan Railways through cinematic storytelling.',
    url: 'https://therails.pk',
    siteName: 'RAILSPK',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'RAILSPK Cinematic Vlogs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'RAILSPK | Digital Legacy Project',
    description: 'Explore the digital legacy of Pakistan Railways.',
    images: ['/og-image.webp'],
  },

  other: {
    "google-adsense-account": "ca-pub-8566339481152239",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* --- ANTI-FLASH THEME SCRIPT --- */}
        <script 
          id="theme-strategy" 
          dangerouslySetInnerHTML={{ __html: `
            (function() {
              try {
                const saved = localStorage.getItem('theme');
                const supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && supportDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })()
          `}} 
        />

        {/* Fonts & Icons */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>

      {/* Added suppressHydrationWarning to body to prevent dark mode class mismatch errors */}
      <body className="bg-white text-gray-900 dark:bg-rail-dark dark:text-gray-200 transition-colors duration-500 antialiased overflow-x-hidden" suppressHydrationWarning>
        
        {/* Google AdSense - Converted to Next.js Script with afterInteractive */}
        <Script 
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8566339481152239"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-55M746HE42"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-55M746HE42');
          `}
        </Script>

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}