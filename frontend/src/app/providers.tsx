// src/app/providers.tsx
'use client';

import { useEffect, useRef } from 'react';
// 🛑 FINAL FIX: Reverting to the correct subdirectory path for the React wrapper.
import { ReactLenis } from 'lenis/react'; 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger globally (Ensuring GSAP is ready)
gsap.registerPlugin(ScrollTrigger);

// Helper function to sync GSAP ScrollTrigger with the Lenis instance
const useGSAPScrollSync = (lenis: any) => {
  useEffect(() => {
    if (!lenis) return;

    // Set up ScrollTrigger to update when Lenis updates
    // This is the CRITICAL synchronization step for cinematic effects
    lenis.on('scroll', ScrollTrigger.update);
    
    // Set the scroller proxy to the HTML element that Lenis controls (document.body)
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length 
          ? lenis.scrollTo(value, { immediate: true }) 
          : lenis.scroll; // Returns current scroll position
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // Ensures GSAP can correctly pin elements across browsers
      pinType: document.body.style.transform ? "transform" : "fixed"
    });

    // Cleanup: Kill all ScrollTriggers and remove the proxy when the component unmounts
    return () => {
      ScrollTrigger.killAll();
      // 🛑 FIX: Using undefined to correctly remove the scroller proxy
      ScrollTrigger.scrollerProxy(document.body, undefined); 
    };
  }, [lenis]);
};


export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  
  // Use a ref to store the Lenis instance
  // The 'any' type is used here because the internal Lenis object is complex
  const lenisRef = useRef<any>(null); 

  // Run the sync hook whenever the Lenis instance is available
  useGSAPScrollSync(lenisRef.current?.lenis);

  return (
    // Wrap the entire application in the Lenis provider
    <ReactLenis 
      root
      ref={lenisRef}
      options={{ 
        lerp: 0.08,        // Controls smoothing intensity
        duration: 1.2,     // Controls overall scroll duration
        wheelMultiplier: 1.5, // Scroll sensitivity
      }}
    >
      {children}
    </ReactLenis>
  );
}