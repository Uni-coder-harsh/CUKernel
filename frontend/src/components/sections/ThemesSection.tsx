// src/components/sections/ThemesSection.tsx
'use client';

import React, { useLayoutEffect, useRef } from 'react'; 
import { THEMES } from '@/constants/index'; // Centralized data import
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion'; // Used for hover effects

gsap.registerPlugin(ScrollTrigger);

// --- 1. Interfaces ---

interface Theme {
  id: number;
  title: string;
  problems: string[];
  icon: keyof typeof LucideIcons; 
}

interface IconProps {
  name: keyof typeof LucideIcons; 
  className: string;
}

interface ThemesSectionProps {
    // New prop to enable/disable the ScrollTrigger animation based on where it's used
    disableScrollAnimation?: boolean; 
}


// --- 2. Icon Utility Component (Type-Safe) ---
const Icon = ({ name, className }: IconProps) => {
  const Component = LucideIcons[name];
  const LucideIcon = Component as React.ElementType<LucideProps>;

  if (!LucideIcon) return null;
  
  return <LucideIcon className={className} />;
};


// --- 3. Theme Card Component ---
const ThemeCard = ({ theme, index }: { theme: Theme, index: number }) => {
  const isEven = index % 2 === 0;
  const baseColor = isEven ? 'border-brand-purple' : 'border-brand-neon';
  const accentColor = isEven ? 'text-brand-purple' : 'text-brand-neon';
  const glowColor = isEven ? 'bg-brand-purple' : 'bg-brand-neon';

  return (
    // Framer Motion provides the hover interactions and scale effects
    <motion.div 
      className={`
        theme-card relative p-6 rounded-xl border ${baseColor} 
        bg-brand-dark/50 overflow-hidden
        group cursor-pointer
      `}
      whileHover={{ y: -5, scale: 1.02 }} // Lift and slightly scale on hover
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Background Neon Hover Effect (Inner Glow) */}
      <div className={`
        absolute inset-0 z-0 opacity-0 group-hover:opacity-20 
        transition-opacity duration-500 
        ${glowColor} 
        blur-lg
      `} />

      {/* Content */}
      <div className="relative z-10">
        <Icon 
          name={theme.icon} 
          className={`w-10 h-10 mb-4 
            ${accentColor}
            group-hover:scale-110 transition-transform duration-300
          `} 
        />
        <h3 className="font-heading text-2xl font-semibold mb-3 text-white">
          {theme.title}
        </h3>
        <p className="font-sans text-sm text-white/70 mb-4">
          Problem Statements:
        </p>
        <ul className="space-y-2 text-sm text-white/90">
          {theme.problems.map((problem, i) => (
            <li key={i} className="font-sans text-white/80 list-disc ml-4">
              {problem}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};


// --- 4. Main Themes Section Component (With GSAP Reveal) ---
export default function ThemesSection({ disableScrollAnimation }: ThemesSectionProps) {
  const sectionRef = useRef(null);

  // useLayoutEffect runs after the DOM is ready but before the browser paints
  useLayoutEffect(() => {
    // Check if the component should animate on scroll or if the dedicated page is managing the animation
    if (disableScrollAnimation) {
        // If on the dedicated page, the page wrapper handles the main animation, so we skip ScrollTrigger
        return; 
    }

    // --- GSAP ScrollTrigger Animation (Only run if placed on a long-scrolling page like the homepage) ---
    const cards = gsap.utils.toArray('.theme-card', sectionRef.current);

    cards.forEach((card: any, i) => {
        gsap.fromTo(card, 
            { opacity: 0, y: 50, scale: 0.95 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%", // Trigger when the top of the card hits 85% down the viewport
                    end: "bottom 100%",
                    toggleActions: "play none none reverse",
                }
            }
        );
    });

    // Cleanup: Kill ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [disableScrollAnimation]);


  return (
    <section id="themes" ref={sectionRef} className="py-10 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {THEMES.map((theme, index) => (
            <ThemeCard key={theme.id} theme={theme as Theme} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}