// src/components/sections/HeroSection.tsx
'use client';

import { ParticleBrainCanvas } from '@/components/three/ParticleBrain';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Sparkles, Code } from 'lucide-react';
import { EVENT_DETAILS, REGISTRATION } from '@/constants/index'; // Use centralized details

export default function HeroSection() {
  const [introAnimationComplete, setIntroAnimationComplete] = useState(false);
  const heroTextRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonRef = useRef(null);
  const overlayRef = useRef(null); 
  const containerRef = useRef(null);

  const handleParticleAnimationComplete = () => {
    setIntroAnimationComplete(true);
  };

  useEffect(() => {
    if (introAnimationComplete) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      const textElement = heroTextRef.current;
      const taglineElement = taglineRef.current;
      const buttonElement = buttonRef.current;
      
      // 1. Animate overlay fade out (must happen first)
      tl.to(overlayRef.current, { 
        opacity: 0, 
        duration: 1.5, 
        onComplete: () => {
          if (overlayRef.current) (overlayRef.current as HTMLElement).style.display = 'none';
        }
      }, 0.2); // Start fading overlay immediately after completion signal

      // 2. Animate main title with a slide/fade/scale effect
      tl.fromTo(textElement, 
        { opacity: 0, y: 50, scale: 0.95 }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1.5, 
          ease: "power4.out"
        }, 0.8); 

      // 3. Animate subtitle
      tl.fromTo(taglineElement, 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
        }, 1.2);

      // 4. Animate button
      tl.fromTo(buttonElement, 
        { opacity: 0, scale: 0.8 }, 
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.0, 
          ease: "back.out(1.7)" 
        }, 1.8);
    }
  }, [introAnimationComplete]);


  return (
    <section ref={containerRef} id="home" className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden bg-brand-dark">
      
      {/* Full-screen overlay for cinematic effect */}
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-brand-dark z-50 flex flex-col items-center justify-center"
      >
        <Sparkles className="animate-pulse w-20 h-20 text-brand-neon" />
        <p className="mt-4 text-xl text-white/80 font-sans">Initializing AI Core...</p>
      </div>

      {/* Particle Brain Background */}
      <ParticleBrainCanvas onAnimationComplete={handleParticleAnimationComplete} />

      {/* Hero Content (Starts hidden, animated in by GSAP) */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4">
        
        {/* Title */}
        <h1 ref={heroTextRef} className="font-heading text-7xl md:text-8xl lg:text-9xl font-bold mb-4 opacity-0 text-white leading-none">
          {EVENT_DETAILS.name}
        </h1>
        
        {/* Tagline */}
        <p ref={taglineRef} className="font-sans text-xl md:text-2xl text-white/80 max-w-3xl mb-8 opacity-0">
          {EVENT_DETAILS.tagline}
        </p>
        
        {/* Button */}
        <a href={REGISTRATION.link} ref={buttonRef} className="opacity-0">
          <button className="flex items-center space-x-3 px-10 py-4 text-lg font-semibold rounded-full bg-brand-neon hover:bg-brand-purple text-brand-dark transition-colors duration-300 shadow-xl shadow-brand-neon/40">
            <Code className='w-5 h-5'/>
            <span>Register Now</span>
          </button>
        </a>
      </div>
    </section>
  );
}