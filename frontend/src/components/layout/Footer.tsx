// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Mail, MapPin, ChevronRight } from 'lucide-react';
import { EVENT_DETAILS } from '@/constants/index';

export default function Footer() {
    
  const currentYear = new Date().getFullYear();

  const FOOTER_LINKS = [
    { title: "Event", links: [
      { label: "Themes", href: "/#themes" },
      { label: "Schedule", href: "/#schedule" },
      { label: "Prizes", href: "/#prizes" },
      { label: "Sponsors", href: "/sponsors" },
    ]},
    { title: "Resources", links: [
      { label: "How to Reach", href: "/location" },
      { label: "Contact Us", href: "/contact" },
      { label: "Hackathon Guide", href: "#guide" },
      { label: "Code of Conduct", href: "#coc" },
    ]},
  ];

  return (
    <footer className="bg-black border-t border-brand-purple/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Logo and Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-20">
          
          {/* Brand/Contact Info */}
          <div className="md:col-span-2">
            <Link href="/" className="font-heading text-3xl font-bold text-brand-neon tracking-wider">
              {EVENT_DETAILS.name}
            </Link>
            <p className="font-sans text-white/70 mt-4 max-w-sm">
              Building a Smarter Tomorrow. A pre-event for the AI Impact Summit (Delhi, Feb 2026).
            </p>
            <div className="space-y-2 mt-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-purple" />
                <span>Central Library, CUK</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-purple" />
                <span>support@ai-hackathon.org</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          {FOOTER_LINKS.map((section, index) => (
            <div key={index} className="md:col-span-1">
              <h4 className="font-heading text-xl font-semibold text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="flex items-center text-white/70 hover:text-brand-neon transition-colors"
                    >
                        <ChevronRight className='w-3 h-3 mr-1' />
                        {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Subscription/Social Placeholder */}
           <div className="md:col-span-1">
              <h4 className="font-heading text-xl font-semibold text-white mb-4">
                Stay Updated
              </h4>
              <p className="text-white/70 text-sm mb-4">
                Follow us for real-time announcements and updates.
              </p>
              {/* Placeholder for social media icons/links here */}
           </div>
        </div>

        {/* Bottom Section: Copyright and Credits */}
        <div className="mt-12 pt-8 border-t border-brand-purple/20 text-center">
          <p className="font-sans text-sm text-white/50">
            &copy; {currentYear} Grand AI Hackathon | Powered by CUKernel & IEEE.
          </p>
        </div>
        
      </div>
    </footer>
  );
}