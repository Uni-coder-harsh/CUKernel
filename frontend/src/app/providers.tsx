// src/app/providers.tsx
'use client';

// 🛑 FIX: Added useRef to the import list
import { useEffect, useRef } from 'react'; 
import { ReactLenis } from '@studio-freight/react-lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

// Helper function to sync GSAP ScrollTrigger with Lenis
const useGSAPScrollSync = (lenis: any) => {
  useEffect(() => {
    if (!lenis) return;

    // Set up ScrollTrigger to update when Lenis updates
    lenis.on('scroll', ScrollTrigger.update);
    
    // Set the scroller proxy to the HTML element that Lenis controls (window/body)
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // Fixed position support for scroll-triggered elements
      pinType: document.body.style.transform ? "transform" : "fixed"
    });

    // Cleanup when component unmounts
    return () => {
      ScrollTrigger.killAll();
      // 🛑 FIX: Changed null to undefined for correct GSAP type matching
      ScrollTrigger.scrollerProxy(document.body, undefined); 
    };
  }, [lenis]);
};


export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  
  // Use a ref to store the Lenis instance
  // We use 'any' type here because the ReactLenis ref object is complex and third-party
  const lenisRef = useRef<any>(null); 

  // Run the sync hook whenever the Lenis instance is available
  useGSAPScrollSync(lenisRef.current?.lenis);

  return (
    // Wrap the entire application in the Lenis provider
    // If the module error persists, you must re-run npm install --legacy-peer-deps
    <ReactLenis 
      root
      ref={lenisRef}
      options={{ 
        lerp: 0.08,
        duration: 1.2,
        wheelMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}