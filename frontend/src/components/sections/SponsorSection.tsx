// src/components/sections/SponsorSection.tsx
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

// --- Data Structures ---
interface Sponsor {
  name: string;
  logoUrl: string;
  level: string;
}

interface SponsorData {
    title: Sponsor[];
    platinum: Sponsor[];
    community: Sponsor[];
}

// Mock Data (You should create these placeholder logos in /public/assets/logos/)
const SPONSORS_DATA: SponsorData = {
  title: [
    { name: "IEEE Official Partner", logoUrl: "/assets/logos/ieee.svg", level: "Official Partner" },
  ],
  platinum: [
    { name: "AI Tech Corp", logoUrl: "/assets/logos/aitech.svg", level: "Platinum" },
    { name: "DataFlow Systems", logoUrl: "/assets/logos/dataflow.svg", level: "Platinum" },
  ],
  community: [
    { name: "Local Dev Group", logoUrl: "/assets/logos/localdev.svg", level: "Community" },
    { name: "Startup Hub", logoUrl: "/assets/logos/startuphub.svg", level: "Community" },
    { name: "Campus Cloud", logoUrl: "/assets/logos/campuscloud.svg", level: "Community" },
  ],
};


// --- Sub-Component for Rendering a Tier ---
interface SponsorTierProps {
    title: string;
    sponsors: Sponsor[];
    className?: string;
    logoHeight?: number;
}

const SponsorTier: React.FC<SponsorTierProps> = ({ title, sponsors, className, logoHeight = 40 }) => {
    if (sponsors.length === 0) return null;

    return (
        <div className={clsx("py-6 border-b border-white/10 last:border-b-0", className)}>
            <h3 className="font-heading text-xl font-semibold mb-6 text-brand-neon/80 text-center">
                {title}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                {sponsors.map((sponsor, index) => (
                    <div 
                        key={index} 
                        className="group relative flex items-center justify-center p-2 transition-transform hover:scale-105"
                        title={sponsor.name}
                    >
                        {/* 🛑 NOTE: Image components are styled to invert (look white/neon) on the dark background */}
                        <Image
                            src={sponsor.logoUrl}
                            alt={`${sponsor.name} Logo`}
                            width={200}
                            height={logoHeight}
                            className="h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ filter: 'grayscale(100%) invert(100%)' }} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Sponsor Section Component ---
export default function SponsorSection() {
  
  return (
    <section id="sponsors" className="py-20 md:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block (If used on the homepage) */}
        <div className="text-center mb-16">
          <span className="text-sm font-sans uppercase tracking-widest text-brand-neon/70">
            Partnership for Innovation
          </span>
          <h2 className="font-heading text-6xl md:text-7xl font-bold text-white mb-4">
            Our Supporters
          </h2>
          <p className="font-sans text-xl text-white/80 max-w-3xl mx-auto">
            We are proud to partner with industry leaders and academic bodies to make this event possible.
          </p>
        </div>

        {/* Sponsor Tiers */}
        <div className="space-y-12">
            <SponsorTier 
                title="Official Academic Partner" 
                sponsors={SPONSORS_DATA.title} 
                className="pt-0 border-brand-neon/50 border-b-2"
                logoHeight={60}
            />
            <SponsorTier 
                title="Platinum Industry Sponsors" 
                sponsors={SPONSORS_DATA.platinum} 
                logoHeight={50}
            />
            <SponsorTier 
                title="Community & Supporting Partners" 
                sponsors={SPONSORS_DATA.community} 
                logoHeight={40}
            />
        </div>

        {/* CTA to Become a Sponsor (Used if this section is on the homepage) */}
        <div className="mt-20 text-center">
            <Link href="/contact" passHref>
                <button className="px-8 py-3 text-lg font-semibold rounded-full bg-brand-purple hover:bg-brand-neon text-white transition-colors duration-300 shadow-lg">
                    Become a Sponsor
                </button>
            </Link>
        </div>

      </div>
    </section>
  );
}