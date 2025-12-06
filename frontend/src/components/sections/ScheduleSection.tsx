// src/components/sections/ScheduleSection.tsx (CORRECTED)
'use client';

import { useEffect, useRef } from 'react';
import { SCHEDULE } from '@/constants';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Code, Award, Coffee, Zap } from 'lucide-react';
import clsx from 'clsx';

// Register GSAP ScrollTrigger plugin (required once in a client component)
gsap.registerPlugin(ScrollTrigger);

// Interface for the schedule item structure (MUST be defined)
interface ScheduleItem {
  time: string;
  date: string;
  event: string;
  type: 'pre' | 'main' | 'milestone' | 'break' | 'judging' | 'fun';
}

// Utility function to select the appropriate icon based on the event type
const getIcon = (type: ScheduleItem['type']) => { // Use the constrained type here
  switch (type) {
    case 'milestone':
      return <Zap className="w-6 h-6 text-brand-neon" />;
    case 'judging':
      return <Award className="w-6 h-6 text-brand-purple" />;
    case 'main':
      return <Clock className="w-6 h-6 text-white" />;
    case 'break':
      return <Coffee className="w-6 h-6 text-white" />;
    case 'fun':
      return <Code className="w-6 h-6 text-white" />;
    case 'pre': 
      return <Coffee className="w-6 h-6 text-white" />; 
    default:
      return <Clock className="w-6 h-6 text-white" />;
  }
};


export default function ScheduleSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scheduleItems = gsap.utils.toArray<HTMLElement>('.schedule-item');
    const line = containerRef.current.querySelector('.timeline-line');

    // 1. Line Growth Animation (ScrollTrigger)
    if (line) {
        gsap.fromTo(line, 
          { scaleY: 0 }, 
          { 
            scaleY: 1, 
            duration: scheduleItems.length * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 30%', 
              end: 'bottom 70%',
              scrub: true,
            }
          }
        );
    }

    // 2. Staggered Item Fade/Reveal (ScrollTrigger)
    scheduleItems.forEach((item, index) => {
      const marker = item.querySelector('.timeline-marker');
      const content = item.querySelector('.timeline-content');
      
      if (marker) {
        gsap.fromTo(marker, 
          { opacity: 0, scale: 0.8 }, 
          { 
            opacity: 1, scale: 1, 
            duration: 0.5, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%', 
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
      
      if (content) {
        gsap.fromTo(content, 
          { opacity: 0, x: index % 2 === 0 ? -50 : 50 }, 
          { 
            opacity: 1, x: 0, 
            duration: 0.7, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 75%', 
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    });
    
    // Cleanup function for ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, []);

  return (
    <section id="schedule" className="py-20 md:py-32 bg-brand-dark overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-sm font-sans uppercase tracking-widest text-brand-neon/70">
          24 Hours of Innovation
        </span>
        <h2 className="font-heading text-6xl md:text-7xl font-bold text-white mb-4">
          Event Timeline
        </h2>
        <p className="font-sans text-xl text-white/80">
          The non-stop 24-hour itinerary, from the opening ceremony to the final prize distribution.
        </p>
      </div>

      <div ref={containerRef} className="relative max-w-4xl mx-auto pt-8">
        
        {/* Cinematic Vertical Line (Pinned & Animated) */}
        <div className="timeline-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-brand-purple origin-top"></div>

        {/* Timeline Items Container */}
        <div className="space-y-16">
          {/* 🛑 FIX: Assert SCHEDULE is an array of ScheduleItem when mapping */}
          {(SCHEDULE as ScheduleItem[]).map((item, index) => (
            <div 
              key={index} 
              className={clsx(
                'schedule-item relative grid items-start',
                index % 2 === 0 ? 'grid-cols-2 text-right pr-12' : 'grid-cols-2 text-left pl-12',
              )}
            >
              
              {/* Event Content Block */}
              <div 
                className={clsx(
                  "timeline-content py-2",
                  index % 2 === 0 ? 'col-start-1 col-end-2' : 'col-start-2 col-end-3',
                )}
              >
                <p className="font-sans text-sm uppercase text-white/70">{item.date} | {item.time}</p>
                <h3 className={clsx(
                  "font-heading text-2xl font-semibold",
                  item.type === 'milestone' ? 'text-brand-neon' : 'text-white'
                )}>
                  {item.event}
                </h3>
              </div>

              {/* Marker (Circle) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-12 h-12 flex items-center justify-center">
                <div 
                  className={clsx(
                    "timeline-marker w-10 h-10 rounded-full flex items-center justify-center border-2",
                    item.type === 'milestone' ? 'border-brand-neon bg-brand-neon/10' : 'border-brand-purple bg-brand-purple/10',
                    'shadow-lg',
                    item.type === 'milestone' && 'shadow-brand-neon/50' 
                  )}
                >
                  {getIcon(item.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}