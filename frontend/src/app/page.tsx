// src/app/page.tsx (REMOVED SECTIONS)
import HeroSection from '@/components/sections/HeroSection';
import Navbar from '@/components/layout/Navbar'; 
// import ThemesSection from '@/components/sections/ThemesSection'; // REMOVED
// import ScheduleSection from '@/components/sections/ScheduleSection'; // REMOVED
import PrizesSection from '@/components/sections/PrizesSection';
import LocationContactCTA from '@/components/sections/LocationContactCTA';
import SponsorSection from '@/components/sections/SponsorSection';

export default function HomePage() {
  return (
    <main>
      <Navbar /> 
      <HeroSection /> 
      
      <div className="bg-brand-dark pt-10">
         {/* ThemesSection removed */} 
         {/* ScheduleSection removed */} 
         <PrizesSection /> 
         <SponsorSection /> 
         <LocationContactCTA />
      </div>
    </main>
  );
}