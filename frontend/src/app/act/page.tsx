// src/app/contact/page.tsx
'use client'; 

import Navbar from '@/components/layout/Navbar';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  // NOTE: This form is a visual placeholder. 
  // For a functional form, you would integrate a service like Firebase/Supabase functions 
  // or a serverless service like Formspree.

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-6xl text-white mb-4 text-center">
          Get in Touch
        </h1>
        <p className="font-sans text-xl text-white/80 mb-12 text-center">
          We're here to help! Send us a message or find our support channels below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Contact Form Placeholder */}
            <div className="bg-brand-dark/50 p-8 rounded-xl border border-brand-neon/50">
                <h2 className="font-heading text-3xl text-white mb-6">Send Us a Query</h2>
                <form className="space-y-4">
                    <input type="text" placeholder="Your Name" className="w-full p-3 rounded bg-black/50 border border-brand-purple/50 text-white/90 focus:ring-brand-neon focus:border-brand-neon transition-colors" required />
                    <input type="email" placeholder="Your Email" className="w-full p-3 rounded bg-black/50 border border-brand-purple/50 text-white/90 focus:ring-brand-neon focus:border-brand-neon transition-colors" required />
                    <textarea rows={4} placeholder="Your Message" className="w-full p-3 rounded bg-black/50 border border-brand-purple/50 text-white/90 focus:ring-brand-neon focus:border-brand-neon transition-colors" required />
                    <button type="submit" className="w-full py-3 bg-brand-neon hover:bg-brand-purple text-brand-dark font-bold rounded transition-colors duration-300">
                        Submit Message
                    </button>
                </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-6 pt-4">
                <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 mt-1 text-brand-neon" />
                    <div>
                        <h4 className="font-heading text-xl text-white">Email Support</h4>
                        <p className="font-sans text-white/70">support@ai-hackathon.org</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 mt-1 text-brand-neon" />
                    <div>
                        <h4 className="font-heading text-xl text-white">Event Coordinator</h4>
                        <p className="font-sans text-white/70">+91 999 888 7777 (Mon-Fri, 9am-5pm IST)</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 mt-1 text-brand-neon" />
                    <div>
                        <h4 className="font-heading text-xl text-white">Venue Address</h4>
                        <p className="font-sans text-white/70">Central University of Karnataka, Kadaganchi</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}