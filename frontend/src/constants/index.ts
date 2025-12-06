export const NAV_LINKS = [
  { label: 'About CUK', href: '/about' }, 
  // 🛑 FIX: Themes and Schedule now link to dedicated pages
  { label: 'Themes & Tracks', href: '/themes' }, 
  { label: 'Timeline', href: '/schedule' }, 
  { label: 'Prizes', href: '/#prizes' }, 
  { label: 'Sponsors', href: '/sponsors' }, 
  { label: 'Location', href: '/location' },
  { label: 'Contact', href: '/contact' },
];
export const EVENT_DETAILS = {
  name: "Grand AI Hackathon",
  tagline: "Building a Smarter Tomorrow",
  date: "Jan 29-30, 2026",
  location: "Central Library, CUK",
  description: "A 24-hour national-level event serving as a crucial pre-event for the AI Impact Summit (Delhi 2026). Partnered with IEEE.",
};

export const THEMES = [
  {
    id: 1,
    title: "Human Capital",
    problems: ["AI career mapping tool", "Personalized learning pathways"],
    icon: "Users", 
  },
  {
    id: 2,
    title: "Inclusion for Social Impact",
    problems: ["AI for disability accessibility", "Multilingual translation for underserved"],
    icon: "HeartHandshake",
  },
  {
    id: 3,
    title: "Safe and Trusted AI",
    problems: ["Bias detection in Datasets", "Model transparency dashboards"],
    icon: "ShieldCheck",
  },
  {
    id: 4,
    title: "Resilience",
    problems: ["AI for disaster prediction", "Cyber-resilience monitoring tools"],
    icon: "Activity",
  },
  {
    id: 5,
    title: "Innovation and Efficiency",
    problems: ["Process automation copilot", "Energy optimization analytics"],
    icon: "Zap",
  },
  {
    id: 6,
    title: "Science",
    problems: ["AI-assisted scientific discovery", "Protein/material prediction model"],
    icon: "FlaskConical",
  },
];

export const SCHEDULE = [
  // --- Round 1: Online Submission ---
  { time: "Dec 7, 2025", date: "Round 1 Starts", event: "Online Idea Submission Opens", type: "milestone" },
  { time: "Jan 1, 2026", date: "Round 1 Ends", event: "Final Idea Submission Deadline", type: "milestone" },
  { time: "Jan 7, 2026", date: "Results", event: "Shortlist Announcement (Top 30 Teams)", type: "judging" },
  { time: "Jan 29, 2026", date: "Round 2 ", event: "Offline at Central University of Karnataka", type: "jmilestone" },
];

export const PRIZES = [
  { title: "Overall Champion", amount: "₹75,000", perk: "Mentorship/Internship Opportunity" },
  { title: "Runner-Up", amount: "₹25,000", perk: "Formal Certificate of Achievement" },
  { title: "Top Performers (Domain)", amount: "Hampers", perk: "Formal Certificate of Excellence and Premium Gift Hampers" },
];

export const REGISTRATION = {
  ieee: "₹600",
  non_ieee: "₹1,000",
  link: "#register",
};