"use client";
import Image from 'next/image';

export default function HeritagePage() {
  // Har history ka apna data yahan define karein
  const stories = [
    { 
      title: "Attock Bridge", 
      year: "1883", 
      image: "/images/heritage/attock_bridge.webp",
      desc: "A masterpiece of Victorian engineering, this bridge stands as a sentinel over the Indus River. Completed in 1883, it was a crucial link connecting the Punjab with the North-West Frontier, designed by Sir Guildford Molesworth.",
      content: "The original structure was a double-story bridge, later reinforced in 1929 to handle heavier locomotives. It remains one of the most photographed and strategically important railway landmarks in South Asia."
    },
    { 
      title: "The Khyber Mail", 
      year: "1947", 
      image: "/images/heritage/khyber_mail.webp",
      desc: "Pakistan's most iconic and longest-running passenger train service, the Khyber Mail is more than just a train; it is a moving history of the nation.",
      content: "Starting its journey from Karachi Cantt and ending at Peshawar Cantt, this service has witnessed the birth of the nation. It represents the resilience and continuity of the North-Western Railway legacy into the modern Pakistan Railways era."
    },
    { 
      title: "Golra Sharif Museum", 
      year: "1881", 
      image: "/images/heritage/golra_museum.webp",
      desc: "Established during the British Raj, the Golra Sharif Junction now houses the most comprehensive Railway Heritage Museum in the country.",
      content: "From vintage steam engines to the salon of the Last Viceroy, the museum preserves the golden age of steam. It serves as a time capsule for railway enthusiasts and historians alike."
    }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto animate-m3">
      <header className="text-center mb-24">
        <h1 className="text-4xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Railway <span className="text-rail-accent">Heritage</span>
        </h1>
        <p className="text-muted font-black uppercase tracking-[0.4em] text-[10px] mt-6 italic">
            Preserving the echoes of the North-Western Railway
        </p>
      </header>

      <div className="space-y-32">
        {stories.map((s, i) => (
          <article key={i} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-20 items-center`}>
            
            {/* Unique Image for each history */}
            <div className="flex-1 w-full aspect-[4/3] bg-surface-variant rounded-[3.5rem] overflow-hidden shadow-2xl relative group border border-outline/10">
                <Image 
                    src={s.image} 
                    alt={`${s.title} - Pakistan Railways History`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            </div>

            {/* Unique Data Portion */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="inline-block px-6 py-2 bg-rail-accent/10 border border-rail-accent/20 rounded-full">
                <span className="text-rail-accent font-black text-xl italic uppercase tracking-widest">Est. {s.year}</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight leading-none">
                {s.title}
              </h2>
              
              <div className="space-y-4">
                <p className="dark:text-[#a9abb1] text-lg font-bold leading-relaxed italic">
                    {s.desc}
                </p>
                <p className="text-muted text-sm leading-relaxed font-medium">
                    {s.content}
                </p>
              </div>

              <button className="px-10 py-5 bg-foreground text-background dark:bg-white dark:text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-rail-accent hover:text-white transition-all active:scale-95">
                Explore Archive
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}