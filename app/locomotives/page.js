"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function LocomotivePage() {
  const [selectedEngine, setSelectedEngine] = useState(null);

  const engines = [
    { 
        type: "GEU-40", 
        builder: "General Electric (USA)", 
        hp: "4500 HP", 
        class: "Freight / Heavy Haul", 
        serviceDate: "2017-2019",
        images: ["/images/locos/geu40_1.webp", "/images/locos/geu40_2.webp"],
        specs: {
            engine: "GE Evolution Series GEVO-12",
            weight: "137 Tons",
            maxSpeed: "110 KM/H",
            tractiveEffort: "534 kN",
            axleLoad: "22.8 Tons"
        }
    },
    { 
        type: "GEU-20", 
        builder: "General Electric (USA) / Zeco", 
        hp: "2200 HP", 
        class: "Passenger/Express/Freight", 
        serviceDate: "2019",
        images: ["/images/locos/geu20_1.jpg"],
        specs: {
            engine: "GE 7FDL-8",
            weight: "105 Tons",
            maxSpeed: "110 KM/H",
            tractiveEffort: "280 kN",
            axleLoad: "17.5 Tons"
        }
    },
    { 
        type: "ZCU-20", 
        builder: "CSR Ziyang (China)", 
        hp: "2200 HP", 
        class: "Passenger/Express/Freight", 
        serviceDate: "2014",
        images: ["/images/locos/zcu20_1.webp"],
        specs: {
            engine: "Caterpillar C175-16",
            weight: "105 Tons",
            maxSpeed: "120 KM/H",
            tractiveEffort: "220 kN",
            axleLoad: "17.5 Tons"
        }
    },
    { 
        type: "AGE-30", 
        builder: "Adtranz-GE (Germany)", 
        hp: "3300 HP", 
        class: "Passenger/Express", 
        serviceDate: "1996",
        images: ["/images/locos/age30_1.webp"],
        specs: {
            engine: "GE - 7FDL16",
            weight: "132 Tons",
            maxSpeed: "125 KM/H",
            tractiveEffort: "450 kN (Peak)",
            axleLoad: "21 Tons"
        }
    },
    { 
        type: "GMU-30", 
        builder: "General Motors (USA)", 
        hp: "3300 HP", 
        class: "Mixed Traffic Mainline", 
        serviceDate: "2005",
        images: ["/images/locos/gmu30_1.webp"],
        specs: {
            engine: "EMD 16-645E3C",
            weight: "126 Tons",
            maxSpeed: "120 KM/H",
            tractiveEffort: "302 kN",
            axleLoad: "21 Tons"
        }
    },
    { 
        type: "HGMU-30", 
        builder: "Henschel (Germany) / EMD", 
        hp: "3300 HP", 
        class: "Mainline Passenger", 
        serviceDate: "1982-1985",
        images: ["/images/locos/hgmu30_1.webp", "/images/locos/hgmu30_2.webp"],
        specs: {
            engine: "EMD 16-645E3",
            weight: "120 Tons",
            maxSpeed: "125 KM/H",
            tractiveEffort: "280 kN",
            axleLoad: "20 Tons"
        }
    },
    { 
        type: "ZCU-30", 
        builder: "CSR Ziyang (China)", 
        hp: "3300 HP", 
        class: "Passenger/Express", 
        serviceDate: "2014-2026",
        images: ["/images/locos/zcu30_1.webp"],
        specs: {
            engine: "Caterpillar 3516B",
            weight: "135 Tons",
            maxSpeed: "140 KM/H",
            tractiveEffort: "257 kN",
            axleLoad: "22.5 Tons"
        }
    }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto bg-background text-foreground selection:bg-rail-accent selection:text-white animate-m3">
      <header className="text-center mb-24">
        <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Engine <span className="text-rail-accent">Archive</span>
        </h1>
        <p className="text-muted font-black uppercase tracking-[0.4em] text-[10px] mt-6 italic">
            The Digital Powerhouse of Pakistan Railways
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {engines.map((e, i) => (
          <article key={i} className="group bg-surface-variant p-2 rounded-[3rem] border border-outline hover:border-rail-accent/30 transition-all duration-700 shadow-sm hover:shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-black/10">
                <Image 
                    src={e.images[0]} 
                    alt={`Locomotive ${e.type}`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={i < 2} 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <button 
                        onClick={() => setSelectedEngine(e)}
                        className="text-[10px] font-black uppercase tracking-widest text-white border border-white/40 bg-white/10 hover:bg-rail-accent px-6 py-3 rounded-full backdrop-blur-md transition-all active:scale-95"
                    >
                        View Full Specs
                    </button>
                </div>
            </div>

            <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase leading-none mb-2">{e.type}</h2>
                        <p className="text-[11px] font-black text-rail-accent uppercase tracking-widest italic">{e.builder}</p>
                    </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-outline/20">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-muted">Horsepower</span>
                        <span className="text-foreground">{e.hp}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-muted">Operating Class</span>
                        <span className="text-foreground">{e.class}</span>
                   </div>
                </div>
            </div>
          </article>
        ))}
      </section>

      {/* --- FIXED MULTI-IMAGE MODAL --- */}
      {selectedEngine && (
        <div 
            className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-m3"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-surface-variant w-full max-w-5xl rounded-[3.5rem] border border-outline overflow-y-auto max-h-[90vh] shadow-2xl no-scrollbar relative">
                
                {/* --- BALANCED GALLERY HEADER --- */}
                <div className="flex flex-col md:flex-row gap-2 p-2">
                    {selectedEngine.images.slice(0, 2).map((img, idx) => (
                        <div key={idx} className="relative aspect-[16/10] md:flex-1 overflow-hidden rounded-[2.5rem] border border-white/5">
                            <Image 
                                src={img} 
                                alt={`${selectedEngine.type} view ${idx + 1}`} 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                    ))}
                    
                    {/* Close Button Inside Header Area */}
                    <button 
                        onClick={() => setSelectedEngine(null)}
                        className="absolute top-8 right-8 w-12 h-12 bg-black/40 hover:bg-rail-accent text-white rounded-full flex items-center justify-center backdrop-blur-md z-10 transition-all border border-white/10"
                        aria-label="Close"
                    >
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <div className="p-10 md:p-14">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
                                {selectedEngine.type} <span className="text-rail-accent">Data</span>
                            </h3>
                            <p className="text-muted text-[11px] font-black uppercase tracking-[0.3em] italic">
                                Manufactured by {selectedEngine.builder} • {selectedEngine.serviceDate}
                            </p>
                        </div>
                        <div className="bg-rail-accent text-white px-8 py-3 rounded-2xl shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)]">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Power Output</p>
                            <p className="text-2xl font-black italic">{selectedEngine.hp}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(selectedEngine.specs).map(([key, value]) => (
                            <div key={key} className="bg-background/40 p-6 rounded-[2rem] border border-outline/10 shadow-sm hover:border-rail-accent/20 transition-all">
                                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
                                <p className="text-xl font-black italic uppercase text-rail-accent">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </main>
  );
}