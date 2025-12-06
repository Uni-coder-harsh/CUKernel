// src/components/sections/LocationContactCTA.tsx
import Link from 'next/link';
import { MapPin, Mail, Navigation } from 'lucide-react';
import { EVENT_DETAILS } from '@/constants';

export default function LocationContactCTA() {
  return (
    <section className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h3 className="font-heading text-4xl text-white mb-8">
          Hackathon Venue & Support
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Location Card */}
          <div className="bg-brand-dark/50 p-8 rounded-xl border border-brand-purple/50 shadow-xl">
            <MapPin className="w-10 h-10 text-brand-neon mx-auto mb-4" />
            <h4 className="font-heading text-2xl text-white mb-2">
              Event Location
            </h4>
            <p className="font-sans text-lg text-white/80 mb-4">
              {EVENT_DETAILS.location}
            </p>
            <Link href="/location" className="inline-block">
              <button className="flex items-center justify-center space-x-2 px-6 py-2 bg-brand-neon hover:bg-brand-purple text-brand-dark font-semibold rounded-full transition-colors duration-300">
                <Navigation className='w-4 h-4' />
                <span>How To Reach</span>
              </button>
            </Link>
          </div>
          
          {/* Contact Card */}
          <div className="bg-brand-dark/50 p-8 rounded-xl border border-brand-purple/50 shadow-xl">
            <Mail className="w-10 h-10 text-brand-neon mx-auto mb-4" />
            <h4 className="font-heading text-2xl text-white mb-2">
              Need Assistance?
            </h4>
            <p className="font-sans text-lg text-white/80 mb-4">
              Reach out to the organizing committee for queries, sponsorships, or support.
            </p>
            <Link href="/contact" className="inline-block">
              <button className="flex items-center justify-center space-x-2 px-6 py-2 bg-brand-neon hover:bg-brand-purple text-brand-dark font-semibold rounded-full transition-colors duration-300">
                <Mail className='w-4 h-4' />
                <span>Contact Us</span>
              </button>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}