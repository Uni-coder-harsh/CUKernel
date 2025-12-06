// src/components/sections/PrizesSection.tsx
import { PRIZES, REGISTRATION } from '@/constants';
import { Trophy, Users, Lightbulb, Code } from 'lucide-react';
import clsx from 'clsx';

// Interface for the prize structure
interface Prize {
  title: string;
  amount: string;
  perk: string;
}

// Data for Judging Criteria (pulled directly from your proposal)
const JUDGING_CRITERIA = [
  {
    name: "Innovation & Originality",
    weight: "30%",
    icon: Lightbulb,
    description: "Novelty of the idea and its application within the chosen theme.",
  },
  {
    name: "Technical Completeness",
    weight: "30%",
    icon: Code,
    description: "Quality of code, working prototype functionality, and technical complexity overcome.",
  },
  {
    name: "Societal Impact & Viability",
    weight: "25%",
    icon: Users,
    description: "Potential for real-world impact and commercial or social scalability.",
  },
  {
    name: "Presentation & Demonstration",
    weight: "15%",
    icon: Trophy,
    description: "Clarity and effectiveness of the final pitch and prototype demo.",
  },
];

// Component for a single prize card
const PrizeCard = ({ prize, index }: { prize: Prize, index: number }) => {
  const isChampion = index === 0;

  return (
    <div 
      className={clsx(
        "flex flex-col p-6 border-2 rounded-xl text-center transition-all duration-300 relative",
        isChampion 
          ? 'bg-brand-purple/20 border-brand-neon shadow-2xl shadow-brand-neon/40 transform scale-105' 
          : 'bg-brand-dark/50 border-brand-purple/50'
      )}
    >
      {isChampion && (
        <Trophy 
          className="w-16 h-16 absolute -top-8 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-brand-neon text-brand-dark shadow-xl shadow-brand-neon/60"
        />
      )}
      
      <h3 
        className={clsx(
          "font-heading text-3xl font-bold mt-8 mb-2",
          isChampion ? 'text-brand-neon' : 'text-white'
        )}
      >
        {prize.title}
      </h3>
      
      <div 
        className={clsx(
          "font-heading text-5xl font-extrabold mb-4",
          isChampion ? 'text-white' : 'text-brand-purple'
        )}
      >
        {prize.amount}
      </div>

      <p className="font-sans text-sm text-white/70 flex-grow">
        {prize.perk || 'Formal certificate of achievement.'}
      </p>
    </div>
  );
};


// Main Prizes Section Component
export default function PrizesSection() {
  return (
    <section id="prizes" className="py-20 md:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="text-sm font-sans uppercase tracking-widest text-brand-neon/70">
            Recognition & Rewards
          </span>
          <h2 className="font-heading text-6xl md:text-7xl font-bold text-white mb-4">
            Awards Structure
          </h2>
          <p className="font-sans text-xl text-white/80 max-w-3xl mx-auto">
            A combined prize pool and mentorship opportunities valued at over ₹1,00,000.
          </p>
        </div>

        {/* 1. Prize Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10 mb-20 items-end">
          {(PRIZES as Prize[]).map((prize, index) => (
            <PrizeCard key={index} prize={prize} index={index} />
          ))}
        </div>
        
        {/* Horizontal Divider */}
        <hr className="border-t-1 border-brand-purple/50 my-16" />

        {/* 2. Judging Criteria Section */}
        <div className="text-center mb-10">
          <h3 className="font-heading text-4xl font-bold text-white mb-8">
            How Projects are Evaluated
          </h3>
        </div>

        {/* Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {JUDGING_CRITERIA.map((criterion, index) => (
            <div 
              key={index} 
              className="p-5 border border-brand-purple/50 bg-brand-dark/50 rounded-lg"
            >
              <div className="flex items-center space-x-3 mb-2">
                <criterion.icon className="w-6 h-6 text-brand-neon" />
                <span className="font-heading text-xl text-white font-semibold">
                  {criterion.name}
                </span>
              </div>
              <p className="font-sans text-3xl font-extrabold text-brand-neon mb-2">
                {criterion.weight}
              </p>
              <p className="font-sans text-sm text-white/70">
                {criterion.description}
              </p>
            </div>
          ))}
        </div>

        {/* 3. Registration CTA */}
        <div className="mt-20 text-center bg-brand-purple/10 border border-brand-purple/50 p-8 rounded-xl">
            <h4 className="font-heading text-3xl text-white mb-3">Ready to Build the Future?</h4>
            <p className="font-sans text-lg text-white/80 mb-6">
                Registration fees cover meals, venue access, and mentorship. IEEE Members receive a discount.
            </p>
            <div className='flex justify-center space-x-6 items-center'>
                <p className='font-sans text-lg text-white/80'>
                    Fees: **IEEE Members** ₹{REGISTRATION.ieee} / **Non-Members** ₹{REGISTRATION.non_ieee}
                </p>
                <a href={REGISTRATION.link}>
                    <button className="px-8 py-3 text-lg font-semibold rounded-full bg-brand-neon hover:bg-brand-purple text-brand-dark transition-colors duration-300 shadow-lg">
                        Secure Your Spot
                    </button>
                </a>
            </div>
        </div>

      </div>
    </section>
  );
}