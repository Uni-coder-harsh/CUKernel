// src/app/layout.tsx (CRITICAL UPDATE)

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google"; 
import "./globals.css";
import GlobalProviders from './providers'; // From our previous step
import Footer from '@/components/layout/Footer'; // Import Footer

// 🛑 Font definitions must be here (assuming they were fixed previously)
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