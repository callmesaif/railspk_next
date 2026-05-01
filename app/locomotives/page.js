import Image from 'next/image';

export default function LocomotivePage() {
  const engines = [
    { 
        type: "GEU-40", 
        builder: "GE USA", 
        hp: "4536 HP", 
        class: "Freight", 
        serviceDate: "2019",
        image: "/images/locos/geu40.webp"
    },
    { 
        type: "GMU-30", 
        builder: "GM USA", 
        hp: "3300 HP", 
        class: "Freight", 
        serviceDate: "2005",
        image: "/images/locos/gmu30.webp" 
    },
    { 
        type: "HGMU-30", 
        builder: "Henschel", 
        hp: "3300 HP", 
        class: "Passenger", 
        serviceDate: "1982",
        image: "/images/locos/hgmu30.webp" 
    },
    { 
        type: "AGE-30", 
        builder: "Adtranz GE", 
        hp: "3300 HP", 
        class: "Passenger", 
        serviceDate: "1996",
        image: "/images/locos/age30.webp" 
    },
    { 
        type: "ZCU-20", 
        builder: "CSR Ziyang", 
        hp: "2300 HP", 
        class: "Passenger", 
        serviceDate: "2014",
        image: "/images/locos/zcu20.webp" 
    },
    { 
        type: "ZCU-30", 
        builder: "CSR Ziyang", 
        hp: "3800 HP", 
        class: "Passenger", 
        serviceDate: "2014",
        image: "/images/locos/zcu30.webp" 
    },
  ];

  return (
    /* Landmark Fix: Page wrapped in <main> for better accessibility[cite: 1, 2] */
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto bg-background text-foreground selection:bg-rail-accent selection:text-white animate-m3">
      {/* Header Section */}
      <header className="text-center mb-24">
        <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Engine <span className="text-rail-accent">Archive</span>
        </h1>
        <p className="dark:text-[#a9abb1] font-black uppercase tracking-[0.4em] text-[10px] mt-6 italic">
            The Digital Powerhouse of Pakistan Railways
        </p>
      </header>

      {/* Engines Grid - Using semantic <section> */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {engines.map((e, i) => (
          /* Article tag for individual locomotive units */
          <article key={i} className="group bg-[#f2f0f4] dark:bg-[#1b1b1f] rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/5 hover:border-rail-accent/30 transition-all duration-700 shadow-sm hover:shadow-2xl">
            
            {/* Engine Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-black/10">
                {/* Performance Fix: Priority for the first two images to improve LCP */}
                <Image 
                    src={e.image} 
                    alt={`Locomotive Model ${e.type} built by ${e.builder} - Pakistan Railways`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={i < 2} 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded-full backdrop-blur-md" aria-label="Engine Technical Specifications">
                        View Technical Specs
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        {/* SEO Fix: Using h2 for individual engine names */}
                        <h2 className="text-3xl font-black italic uppercase leading-none mb-2">{e.type}</h2>
                        <p className="text-[11px] font-black text-rail-accent uppercase tracking-widest italic">{e.builder}</p>
                    </div>
                    {/* Accessibility Fix: Hiding decorative icon from screen readers */}
                    <span className="material-symbols-rounded text-rail-accent text-3xl opacity-20 group-hover:rotate-12 transition-transform duration-500" aria-hidden="true">
                        engineering
                    </span>
                </div>

                <div className="space-y-4 pt-8 border-t border-black/5 dark:border-white/5">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="dark:text-[#a9abb1]">Horsepower</span>
                        <span className="text-foreground">{e.hp}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="dark:text-[#a9abb1]">Operating Class</span>
                        <span className="text-foreground">{e.class}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="dark:text-[#a9abb1]">In Service Since</span>
                        <span className="text-rail-accent">{e.serviceDate}</span>
                   </div>
                </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}