// src/app/themes/page.tsx
'use client'; 

import Navbar from '@/components/layout/Navbar';
import ThemesSection from '@/components/sections/ThemesSection';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Lightbulb, Code } from 'lucide-react';

export default function ThemesPage() {
    const headerRef = useRef(null);

    useEffect(() => {
        // Simple GSAP timeline for a cinematic page header reveal
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(headerRef.current, 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 1.0, delay: 0.5 }
        );
        
        // Staggered reveal for the cards (This would be best placed inside ThemesSection.tsx)
        gsap.fromTo('.theme-card', 
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)', delay: 1.0 }
        );

    }, []);

    return (
        <main className="min-h-screen bg-brand-dark relative overflow-hidden">
            <Navbar />
            
            {/* Ambient Background Effect (Static Neon Grid/Gradient) */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%)'
            }} />

            <div className="relative pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                
                {/* Cinematic Header (Animated by GSAP) */}
                <div ref={headerRef} className="text-center mb-16 pt-10 opacity-0">
                    <div className='flex items-center justify-center space-x-4'>
                        <Lightbulb className='w-10 h-10 text-brand-neon' />
                        <h1 className="font-heading text-7xl md:text-8xl font-bold text-white mb-4">
                            Innovation Tracks
                        </h1>
                        <Code className='w-10 h-10 text-brand-neon' />
                    </div>
                    <p className="font-sans text-xl text-white/80 max-w-4xl mx-auto">
                        Six critical domains of Artificial Intelligence designed to challenge the brightest minds to build scalable solutions for real-world impact.
                    </p>
                </div>
                
                {/* Themes Grid */}
                <ThemesSection renderAsPage={true} />
                
            </div>
        </main>
    );
}