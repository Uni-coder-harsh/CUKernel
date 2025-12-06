// src/app/location/page.tsx (Updated)
import { EVENT_DETAILS } from '@/constants';
import Navbar from '@/components/layout/Navbar'; 
// 🛑 FIX: Import the new Client Component wrapper
import MapClientWrapper from '@/components/maps/MapClientWrapper'; 

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-6xl text-white mb-4">
          How to Reach CUK
        </h1>
        <p className="font-sans text-xl text-white/80 mb-8">
          The event will be held at the Central Library, CUK. Use the tool below to find the best route from your location.
        </p>
        
        {/* The map component is rendered via the client wrapper */}
        <MapClientWrapper /> 
        
        {/* Travel Information */}
        <div className="mt-10 p-6 bg-brand-dark/50 border border-brand-purple/50 rounded-lg">
          <h3 className="font-heading text-2xl text-white mb-3">Travel Tips</h3>
          <p className="font-sans text-white/70">
            **Nearest Major Railway Station:** Kalaburagi Junction (KLBG). <br/>
            **Nearest Airport:** Kalaburagi Airport (GBI). Local taxis, ride-sharing, and university bus services are available from these points.
          </p>
        </div>
        
      </div>
    </main>
  );
}