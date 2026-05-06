"use client";
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto animate-m3">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8">
            Behind <span className="text-rail-accent">The Rails</span>
        </h1>
        <p className="text-muted text-sm md:text-xl font-bold uppercase tracking-[0.4em] italic">
            Preserving Pakistan's Railway Heritage Through Digital Storytelling
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        {/* --- IMAGE SECTION --- */}
        <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl bg-surface-variant border border-outline/10 group">
            {/* 
               IMPORTANT: 
               1. Apni photo 'public/images/' folder mein rakhein.
               2. Niche 'src' mein uska sahi naam likhein (e.g., /images/saif.jpg).
            */}
            <Image 
                src="/images/saif.webp" 
                alt="Saif Ur Rehman - Founder of RaiLoversPK"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Saif Ur Rehman Intro */}
        <div className="space-y-8">
            <div className="inline-block px-6 py-2 bg-rail-accent/10 border border-rail-accent/20 rounded-full">
                <span className="text-rail-accent font-black text-sm uppercase tracking-widest italic">The Founder</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight">Saif Ur Rehman</h2>
            <p className="text-muted text-lg leading-relaxed font-medium">
                Saif Ur Rehman is a management professional and digital content creator with a profound passion for Pakistan's iron roads. As the founder of <strong>RaiLoversPK</strong>, he has dedicated himself to documenting the vast history, evolving technology, and cultural significance of Pakistan Railways.
            </p>
            <p className="text-muted text-lg leading-relaxed font-medium italic">
                His vision combines modern cinematic storytelling with historical preservation, creating a digital legacy that serves both enthusiasts and the next generation of travelers.
            </p>
        </div>
      </div>

      {/* Vision Section */}
      <section className="bg-surface-variant p-10 md:p-20 rounded-[4rem] border border-outline text-center">
          <h3 className="text-4xl md:text-6xl font-black uppercase italic mb-10 tracking-tight">Our <span className="text-rail-accent">Vision</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <div className="space-y-4">
                  <span className="material-symbols-rounded text-rail-accent text-4xl">history_edu</span>
                  <h4 className="text-xl font-black uppercase italic">Preservation</h4>
                  <p className="text-sm text-muted font-medium italic leading-relaxed">Documenting every locomotive, track history, and bridge before they become forgotten echoes of the past.</p>
              </div>
              <div className="space-y-4">
                  <span className="material-symbols-rounded text-rail-accent text-4xl">distance</span>
                  <h4 className="text-xl font-black uppercase italic">Education</h4>
                  <p className="text-sm text-muted font-medium italic leading-relaxed">Providing accurate fare estimations and travel tools based on official data to empower the common traveler.</p>
              </div>
              <div className="space-y-4">
                  <span className="material-symbols-rounded text-rail-accent text-4xl">movie_filter</span>
                  <h4 className="text-xl font-black uppercase italic">Cinematography</h4>
                  <p className="text-sm text-muted font-medium italic leading-relaxed">Showcasing the majestic beauty of the Indus Valley and the rugged tracks through high-quality visual content.</p>
              </div>
          </div>
      </section>
    </main>
  );
}