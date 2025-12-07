// src/app/layout.tsx 

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google"; 
import "./globals.css";
import GlobalProviders from './providers';
import Footer from '@/components/layout/Footer';
import Script from "next/script"; // 🛑 CRITICAL IMPORT FOR MAPBOX FIX

// Font definitions
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: '--font-space',
  weight: ['300', '400', '500', '600', '700'] 
});


export const metadata: Metadata = {
  title: "Grand AI Hackathon | CUK & IEEE",
  description: "Building a Smarter Tomorrow - A 24-hour National Level Hackathon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark"> 
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-black text-white antialiased`}>
        
        {/* 🛑 MAPBOX FIX: Load JS and Geocoder globally using Next.js Script component */}
        <Script 
          src="https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js"
          strategy="beforeInteractive" // Loads script before hydration
          id="mapbox-js-main"
        />
        <Script
          src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.1.0/mapbox-gl-geocoder.min.js"
          strategy="afterInteractive" 
          id="mapbox-js-geocoder"
        />
        
        <GlobalProviders>
          {/* Structure to push the footer to the bottom */}
          <div className="flex flex-col min-h-screen">
             <main className="flex-grow">
               {children} 
             </main>
             <Footer /> 
          </div>
        </GlobalProviders>
      </body>
    </html>
  );
}