import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script"; // Script component import kiya hai

export const metadata = {
  title: "RAILSPK | Digital Legacy Project",
  description: "Official portal for Pakistan Railways fans. Explore Reviews, Fares, and Cinematic Travel Vlogs.",
  keywords: ["Pakistan Railways, Train Reviews, Railway Vlogs, Railspk, Train Fares, Railway Community, Train Vlogs, Train Travel, Pakistan Railways, Shalimar Express Reviews, Green line Reviews, Karakoram Express Reviews, Pak Business Express Reviews"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className="bg-white text-gray-900 dark:bg-rail-dark dark:text-gray-200 transition-colors duration-500 antialiased overflow-x-hidden">
        
        {/* Google Analytics Integration */}
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