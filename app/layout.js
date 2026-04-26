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
  keywords: ["Pakistan Railways, Train Reviews, Railway Vlogs, Railspk, Train Fares, Railway Community, Train Vlogs, Train Travel, Pakistan Railways, Shalimar Express Reviews, Green line Reviews, Karakoram Express Reviews, Pak Business Express Reviews"],
  other: {
    "google-adsense-account": "ca-pub-8566339481152239",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 1. Anti-Flash Theme Script (Head mein hi rahega) */}
        <script 
          id="theme-strategy" 
          key="theme-strategy"
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

        {/* 2. Fonts aur Icons */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>

      <body className="bg-white text-gray-900 dark:bg-rail-dark dark:text-gray-200 transition-colors duration-500 antialiased overflow-x-hidden">
        
        {/* 3. AdSense Script (Body mein move kar diya taake Head hydration mismatch na ho) */}
        <script> 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8566339481152239"
          crossOrigin="anonymous"
        </script>

        {/* 4. Google Analytics */}
        <Script
          async
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