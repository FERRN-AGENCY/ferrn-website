/* =========================================
   DATA SECTION (Usually in homeData.js)
   ========================================= */

export const processTags = [
  "Web Development",
  "AI & Automation",
  "Branding",
  "Product Design",
  "Social Media Management"
];

// THE FIX: Converted 'category' to arrays. 
// Web Development now has ALL the data, and it shares items with other tabs!
export const processGridData = [
  { id: 1, title: 'E-Commerce', imgKey: 'grid1', category: ['Web Development', 'Product Design'] },
  { id: 2, title: 'AI Interface', imgKey: 'grid2', category: ['Web Development', 'AI & Automation'] },
  { id: 3, title: 'Visual Identity', imgKey: 'grid3', category: ['Web Development', 'Branding'] },

  { id: 4, title: 'Mobile App', imgKey: 'grid4', category: ['Web Development', 'Product Design'] },
  { id: 5, title: 'Platform UX', imgKey: 'grid5', category: ['Web Development', 'Branding'] },
  { id: 6, title: 'Neural Engine', imgKey: 'grid6', category: ['Web Development', 'AI & Automation'] },

  { id: 7, title: 'Content Strategy', imgKey: 'grid7', category: ['Web Development', 'Social Media Management'] },
  { id: 8, title: 'Campaign Design', imgKey: 'grid8', category: ['Web Development', 'Social Media Management'] },
];

// Drop this into data/homeData.js
export const testimonialsData = [
  {
    id: 1,
    name: "Alex",
    role: "Startup Founder",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    audioUrl: "https://www.archive.org/download/testmp3testfile/mpthreetest.mp3",
    quote: "Working with Ferrn completely shifted our trajectory. They didn't just design a website, they built a machine that actually converts our audience."
  },
  {
    id: 2,
    name: "Sarah",
    role: "Creative Director",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    audioUrl: "https://www.archive.org/download/MLKDream/MLKDream_64kb.mp3",
    quote: "The attention to detail is insane. We handed them a broken brand, and they handed us back a masterpiece. I cannot recommend them enough."
  },
  {
    id: 3,
    name: "David",
    role: "E-com Owner",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    audioUrl: "https://www.archive.org/download/podcast_adventurers_and_explorers/20060322_podcast.mp3",
    quote: "Fast, ruthless, and incredibly talented. They cut out all the agency fluff and just delivered pure, high-end results on time."
  }
];