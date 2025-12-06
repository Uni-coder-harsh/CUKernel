// src/app/about/page.tsx
import Navbar from '@/components/layout/Navbar';
// 🛑 FIX: Ensure 'Code' is imported here along with the others
import { University, Trophy, Globe, Code, Users } from 'lucide-react'; 

// Mock Data for CUK Details
const CUK_DETAILS = {
  history: "Established in 2009 by an Act of Parliament, the Central University of Karnataka (CUK) is dedicated to fulfilling the educational needs of the region while maintaining national standards of excellence.",
  vision: "To be a globally competitive university, committed to social responsibility and sustainable development, with a focus on innovation and research, particularly in emerging areas like Artificial Intelligence.",
  departments: [
    // 🛑 FIX: 'Code' is now correctly defined in the imports
    { name: "Computer Science & Engineering", icon: Code }, 
    { name: "School of Management", icon: Users },
    { name: "Science & Technology", icon: Globe },
    { name: "Arts & Humanities", icon: Trophy }
  ]
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />
      <div className="pt-24 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className='flex items-center space-x-4 mb-6 justify-center text-center'>
            <University className='w-12 h-12 text-brand-neon' />
            <h1 className="font-heading text-6xl text-white">
                About Our Host
            </h1>
        </div>
        
        <p className="font-sans text-xl text-white/80 mb-12 text-center">
            The Grand AI Hackathon is proudly hosted by the Central University of Karnataka.
        </p>

        {/* CUK History and Vision */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='p-6 bg-brand-dark/50 border border-brand-purple/50 rounded-xl'>
                <h3 className='font-heading text-3xl text-brand-neon mb-4'>Our Identity</h3>
                <p className='font-sans text-lg text-white/70'>
                    {CUK_DETAILS.history} CUK serves as a beacon of advanced learning and is committed to fostering a strong technical community, making it the ideal venue for a national-level AI event.
                </p>
            </div>
             <div className='p-6 bg-brand-dark/50 border border-brand-purple/50 rounded-xl'>
                <h3 className='font-heading text-3xl text-brand-neon mb-4'>Vision for AI</h3>
                <p className='font-sans text-lg text-white/70'>
                    The university's vision aligns perfectly with the Hackathon's goal: promoting interdisciplinary research and developing talent to tackle complex societal challenges through technology.
                </p>
            </div>
        </div>

        {/* Academic Departments */}
        <div className='mt-20 text-center'>
             <h3 className='font-heading text-4xl text-white mb-8'>Key Academic Strengths</h3>
             <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
                {CUK_DETAILS.departments.map((dept, index) => (
                    <div key={index} className='p-4 border border-brand-neon/50 rounded-lg bg-brand-purple/10 flex flex-col items-center justify-center h-full'>
                        {/* The icon is rendered using the component stored in the data object */}
                        <dept.icon className='w-8 h-8 text-brand-neon mb-2'/> 
                        <p className='font-sans text-sm text-white font-semibold'>{dept.name}</p>
                    </div>
                ))}
             </div>
        </div>
        
      </div>
    </main>
  );
}