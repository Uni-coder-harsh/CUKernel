// src/app/contact/page.tsx
'use client'; 

import Navbar from '@/components/layout/Navbar';
import { Mail, Phone, MapPin, Search, Calendar, Users, LucideIcon } from 'lucide-react';
import React from 'react';

// Interface for Contact Channel (for type safety)
interface ContactChannel {
    category: string;
    icon: LucideIcon;
    contact: {
        person: string;
        email: string;
        phone: string;
        time: string;
    };
}

// Mock Contact Data by Category
const CONTACT_CHANNELS: ContactChannel[] = [
    {
        category: "General Inquiries & Media",
        icon: Search,
        contact: {
            person: "Rajesh Kumar (Support Head)",
            email: "info@ai-hackathon.org",
            phone: "+91 999 888 7777",
            time: "Mon-Fri, 9am - 5pm IST",
        }
    },
    {
        category: "Event & Schedule Queries",
        icon: Calendar,
        contact: {
            person: "Priya Sharma (Event Coordinator)",
            email: "events@ai-hackathon.org",
            phone: "+91 987 654 3210",
            time: "24/7 during Hackathon (Jan 29-30)",
        }
    },
    {
        category: "Sponsorship & Partnership",
        icon: Users,
        contact: {
            person: "Dr. Anand Singh (Partnership Lead)",
            email: "sponsors@ai-hackathon.org",
            phone: "+91 901 234 5678",
            time: "Mon-Fri, 10am - 4pm IST",
        }
    },
    {
        category: "Technical & Location Support",
        icon: MapPin,
        contact: {
            person: "Vivek Goud (Tech Support)",
            email: "tech@ai-hackathon.org",
            phone: "+91 888 777 6666",
            time: "24/7 (via Email)",
        }
    },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-6xl text-white mb-4 text-center">
          Get in Touch
        </h1>
        <p className="font-sans text-xl text-white/80 mb-12 text-center">
          Direct your query to the correct department for the quickest response.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Contact Form Placeholder (Main Column) */}
            <div className="lg:col-span-2 bg-brand-dark/50 p-8 rounded-xl border border-brand-neon/50 shadow-xl">
                <h2 className="font-heading text-3xl text-white mb-6">Send Us a Direct Message</h2>
                <form className="space-y-4">
                    <input type="text" placeholder="Your Name" className="w-full p-3 rounded bg-black/50 border border-brand-purple/50 text-white/90 focus:ring-brand-neon focus:border-brand-neon transition-colors" required />
                    <input type="email" placeholder="Your Email" className="w-full p-3 rounded bg-black/50 border border-brand-purple/50 text-white/90 focus:ring-brand-neon focus:border-brand-neon transition-colors" required />
                    
                    {/* Select Field for Query Type */}
                    <select 
                        className="w-full p-3 rounded bg-black/50 border border-brand-purple/50 text-white/90 focus:ring-brand-neon focus:border-brand-neon transition-colors" 
                        required
                        defaultValue="" 
                    >
                        <option value="" disabled>Select Query Type...</option>
                        {CONTACT_CHANNELS.map(c => (
                            <option key={c.category} value={c.category}>{c.category}</option>
                        ))}
                    </select>

                    <textarea rows={4} placeholder="Your Message" className="w-full p-3 rounded bg-black/50 border border-brand-purple/50 text-white/90 focus:ring-brand-neon focus:border-brand-neon transition-colors" required />
                    <button type="submit" className="w-full py-3 bg-brand-neon hover:bg-brand-purple text-brand-dark font-bold rounded transition-colors duration-300">
                        Submit Query
                    </button>
                </form>
            </div>

            {/* Categorized Contact Details (Sidebar) */}
            <div className="lg:col-span-1 space-y-6">
                <h2 className="font-heading text-2xl text-white mb-4 border-b border-brand-purple/50 pb-2">
                    Direct Contacts
                </h2>
                {CONTACT_CHANNELS.map((channel, index) => (
                    <div key={index} className="bg-brand-dark/50 p-5 rounded-lg border border-brand-purple/50">
                        <div className="flex items-center space-x-3 mb-2">
                            <channel.icon className="w-5 h-5 text-brand-neon" />
                            <h4 className="font-heading text-lg text-white font-semibold">
                                {channel.category}
                            </h4>
                        </div>
                        <p className="font-sans text-sm text-white/70">
                            **{channel.contact.person}:** {channel.contact.email}
                        </p>
                        <p className="font-sans text-xs text-white/50 mt-1">
                            {channel.contact.phone} | {channel.contact.time}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}