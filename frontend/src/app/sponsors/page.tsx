// src/app/sponsors/page.tsx
import Navbar from '@/components/layout/Navbar';
import SponsorSection from '@/components/sections/SponsorSection'; // Import the section component
import { Handshake } from 'lucide-react';

export default function SponsorsPage() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <Handshake className='w-12 h-12 text-brand-neon mx-auto mb-4' />
            <h1 className="font-heading text-6xl text-white mb-2">
                Our Valued Partners
            </h1>
            <p className='font-sans text-xl text-white/80 mb-12'>
                The success of the Grand AI Hackathon is made possible by the generous support of our official partners and industry leaders.
            </p>
        </div>
        
        {/* Reuse the SponsorSection component here */}
        <SponsorSection /> 
        
        {/* Sponsorship Contact CTA */}
        <div className="mt-20 text-center">
            <h3 className='font-heading text-3xl text-white mb-4'>Want to support the next generation of AI developers?</h3>
            <p className='text-white/70 mb-6'>Download our Sponsorship Prospectus or contact our partnership lead directly.</p>
            <a href='/contact' className='inline-block'>
                <button className='px-8 py-3 bg-brand-neon hover:bg-brand-purple text-brand-dark font-bold rounded-full shadow-lg'>
                    Become a Partner
                </button>
            </a>
        </div>
      </div>
    </main>
  );
}