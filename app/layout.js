import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import VisitTracker from "@/components/VisitTracker";

export const metadata = {
  alternates: {
    canonical: 'https://therails.pk',
  },
  title: "THE RAILSPK | Digital Legacy Project",
  description: "Official portal for Pakistan Railways fans. Explore Reviews, Fares, and Cinematic Travel Vlogs.",
  
  // --- GOOGLE SEARCH CONSOLE VERIFICATION ---
  verification: {
    google: "mqsYMsH-F5tYvqUvh9ZpzUa-CMe82D_BcqPTSLkvpdI",
  },

  keywords: [
    "Pakistan Railways", "Train Reviews", "Railway Vlogs", "Railspk", 
    "Train Fares", "Railway Community", "Shalimar Express Reviews", 
    "Green line Reviews", "Karakoram Express Reviews", "Pak Business Express Reviews", "Pakistan Railways Fares", "Railway Travel Vlogs", "Trainspotting Pakistan", "Railway Heritage", "Train Enthusiasts Pakistan", "Railway Journey Vlogs", "Pakistan Train Reviews", "Railway Travel Tips", "Train Travel Pakistan", "Railway Fan Community", "Pakistan Railways Updates", "Train Travel Experiences", "Railway Documentary Pakistan", "Railoverspk", "Railway Nostalgia Pakistan", "Train Travel Guides Pakistan", "Railway Preservation Pakistan", "Trainspotting Karachi", "Trainspotting Lahore", "Trainspotting Islamabad", "Trainspotting Peshawar", "Trainspotting Quetta"
  ],

  openGraph: {
    title: 'THE RAILSPK | Digital Legacy Project',
    description: 'Documenting the heritage of Pakistan Railways through cinematic storytelling.',
    url: 'https://therails.pk',
    siteName: 'THE RAILSPK',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'THE RAILSPK Cinematic Vlogs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'THE RAILSPK | Digital Legacy Project',
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
        {/* Google Tag Manager (Head Script) */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MKSKMB64');
          `}
        </Script>

        {/* ANTI-FLASH THEME SCRIPT */}
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

        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>

      <body className="bg-white text-gray-900 dark:bg-rail-dark dark:text-gray-200 transition-colors duration-500 antialiased overflow-x-hidden" suppressHydrationWarning>
        
        {/* Google Tag Manager (Noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-MKSKMB64"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <VisitTracker />

        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8566339481152239"
          crossOrigin="anonymous">         
        </script>

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