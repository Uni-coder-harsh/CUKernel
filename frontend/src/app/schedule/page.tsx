// src/app/schedule/page.tsx
import Navbar from '@/components/layout/Navbar';
import ScheduleSection from '@/components/sections/ScheduleSection';

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cinematic Header */}
        <div className="text-center mb-16 pt-10">
          <p className="text-sm font-sans uppercase tracking-widest text-brand-neon/70">
            24 Hours of Pure Innovation
          </p>
          <h1 className="font-heading text-7xl md:text-8xl font-bold text-white mb-4">
            The Full Timeline
          </h1>
          <p className="font-sans text-xl text-white/80 max-w-3xl mx-auto">
            From online submission to the final prize distribution, here is the two-round itinerary for the Grand AI Hackathon.
          </p>
        </div>
        
        {/* Schedule Logic (Moved from the old component) */}
        <ScheduleSection /> 
        
      </div>
    </main>
  );
}