// src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { NAV_LINKS, EVENT_DETAILS, REGISTRATION } from '@/constants';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react'; // Example icons from lucide-react

export default function Navbar() {
  const navRef = useRef(null);
  
  useEffect(() => {
    // GSAP Animation: Fade in the Navbar after the Hero title sequence finishes
    gsap.fromTo(navRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.8, delay: 2.0, ease: "power3.out" } // Delay > 2.0s ensures it comes after the Hero title (which was 1.5s)
    );
  }, []);

  return (
    <header 
      ref={navRef} 
      className="fixed top-0 left-0 w-full z-50 p-4 lg:p-6 bg-dark/20 backdrop-blur-sm opacity-0"
    >
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-heading text-xl font-bold text-brand-neon tracking-wider">
            {EVENT_DETAILS.name}
          </span>
          {/* Placeholder for small IEEE logo image  */}
          <span className="hidden sm:inline-block text-xs font-sans text-white/70">
            in partnership with IEEE
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="font-sans text-sm font-medium text-white/80 hover:text-brand-neon transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Registration Button */}
        <Link href={REGISTRATION.link} className="hidden sm:block">
          <button className="px-5 py-2 text-sm font-semibold rounded-full bg-brand-purple hover:bg-brand-neon transition-colors duration-300">
            Register
          </button>
        </Link>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden text-white/80">
          <Menu className="w-6 h-6 cursor-pointer hover:text-brand-neon" />
        </div>
      </nav>
    </header>
  );
}