"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FareCalculator() {
  const [from, setFrom] = useState("Karachi");
  const [to, setTo] = useState("Lahore");
  const [selectedTrain, setSelectedTrain] = useState("Khyber Mail");
  const [trainClass, setTrainClass] = useState("Economy");
  const [passenger, setPassenger] = useState("Adult");

  // Official Route Data
  const routeData = {
    "Karachi-Lahore": { base: 3150, dist: 1210 },
    "Karachi-Rawalpindi": { base: 3700, dist: 1500 },
    "Karachi-Multan": { base: 2350, dist: 840 },
    "Lahore-Rawalpindi": { base: 1150, dist: 290 },
    "Lahore-Multan": { base: 1200, dist: 340 },
    "Multan-Rawalpindi": { base: 1900, dist: 560 },
  };

  const stations = ["Karachi", "Lahore", "Rawalpindi", "Multan", "Hyderabad", "Peshawar", "Quetta", "Sukkur", "Rohri"];

  const trains = {
    standard: ["Khyber Mail", "Millat Express", "Bahauddin Zakria", "Sukkur Express", "Allama Iqbal Express", "Hazara Express", "Pakistan Express", "Rehman Baba", "Shalimar Express", "Awam Express", "Bolan Mail", "Khushal Khan Khattak"],
    premium: ["Karachi Express", "Pak Business Express", "Karakoram Express", "Jaffar Express", "Tezgam"],
    luxury: ["Green Line"],
    special: ["Fareed Express"]
  };

  const allTrainsList = [...trains.standard, ...trains.premium, ...trains.luxury, ...trains.special];

  const getTrainMultiplier = (trainName) => {
    if (trains.luxury.includes(trainName)) return 1.45; //[cite: 1]
    if (trains.premium.includes(trainName)) return 1.20; //[cite: 1]
    if (trains.special.includes(trainName)) return 0.85; //[cite: 1]
    return 1.0; 
  };

  // STRICT ROUNDING: No decimals allowed
  const applyRounding = (fare) => {
    const rawFare = Math.round(fare); // Kill decimals first
    const remainder = rawFare % 100;

    // Official Instruction 5 logic[cite: 1]
    if (remainder <= 20) return Math.floor(rawFare / 100) * 100;
    if (remainder >= 30 && remainder <= 70) return Math.floor(rawFare / 100) * 100 + 50;
    if (remainder >= 80) return Math.ceil(rawFare / 100) * 100;
    
    // Catch-all for intermediate points (e.g. 25, 75)
    return Math.round(rawFare / 50) * 50; 
  };

  const calculateFare = () => {
    const route = routeData[`${from}-${to}`] || routeData[`${to}-${from}`];
    if (!route || from === to) return null;

    let base = route.base;
    base = base * getTrainMultiplier(selectedTrain); //[cite: 1]

    const classMap = {
      "Economy": 1,
      "AC Standard": 2.0,
      "AC Business": 2.85,
      "AC Sleeper": 3.7,
      "AC Parlor": 2.85
    }; //[cite: 1]
    
    let fare = base * classMap[trainClass]; //[cite: 1]

    if (trainClass === "Economy") {
      fare += route.dist <= 500 ? 50 : 100; //[cite: 1]
    }

    // 2026 War Hike Logic
    const hike = trainClass === "Economy" ? 1.10 : 1.15;
    fare = fare * hike;

    if (passenger === "Child") fare = fare * 0.5; //[cite: 1]

    return applyRounding(fare);
  };

  const estimatedFare = calculateFare();

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto animate-m3">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
          Fare <span className="text-rail-accent">Calculator</span>
        </h1>
        <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em] mt-6 italic">
          Official Round-Figure Estimation (2026 Crisis Adjusted)
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* Input Panel */}
        <section className="lg:col-span-3 bg-surface-variant p-10 md:p-14 rounded-[3.5rem] border border-outline shadow-sm flex flex-col justify-between space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest ml-6 text-muted">Departure</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-background p-5 rounded-[1.8rem] outline-none font-bold text-sm shadow-inner border border-transparent focus:border-rail-accent/20 cursor-pointer">
                {stations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest ml-6 text-muted">Destination</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-background p-5 rounded-[1.8rem] outline-none font-bold text-sm shadow-inner border border-transparent focus:border-rail-accent/20 cursor-pointer">
                {stations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest ml-6 text-muted">Train Service</label>
            <select value={selectedTrain} onChange={(e) => setSelectedTrain(e.target.value)} className="w-full bg-background p-5 rounded-[1.8rem] outline-none font-bold text-sm shadow-inner cursor-pointer border border-transparent focus:border-rail-accent/20">
              {allTrainsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="bg-background/50 p-8 rounded-[2.5rem] border border-outline/10">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-[2] space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest ml-2 text-muted">Class Category</label>
                    <div className="grid grid-cols-2 gap-2">
                        {["Economy", "AC Standard", "AC Business", "AC Sleeper", "AC Parlor"].map(c => (
                        <button key={c} onClick={() => setTrainClass(c)} className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${trainClass === c ? 'bg-rail-accent text-white shadow-lg' : 'bg-background text-muted hover:bg-outline/20'}`}>
                            {c}
                        </button>
                        ))}
                    </div>
                </div>
                <div className="w-px bg-outline/20 hidden md:block"></div>
                <div className="flex-1 space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest ml-2 text-muted">Passenger</label>
                    <div className="flex flex-col gap-2 h-full">
                        {["Adult", "Child"].map(p => (
                        <button key={p} onClick={() => setPassenger(p)} className={`flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${passenger === p ? 'bg-rail-accent text-white shadow-lg' : 'bg-background text-muted hover:bg-outline/20'}`}>
                            {p}
                        </button>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-2">
          <div className="bg-rail-accent text-white p-12 md:p-14 rounded-[4rem] h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-white/10">
            <div className="relative z-10">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] opacity-60 mb-8 italic">Final Estimate</h2>
              {estimatedFare ? (
                <article className="animate-fade-in">
                  <span className="text-lg font-bold opacity-50 italic block tracking-[0.2em] mb-2">PKR</span>
                  {/* Dynamic Font Size + Integer Only */}
                  <div className={`font-black italic tracking-tighter leading-[0.8] mb-12 hero-title transition-all duration-500 ${
                      estimatedFare >= 10000 ? 'text-[5rem] md:text-[7rem]' : 'text-[6rem] md:text-[8.5rem]'
                  }`}>
                    {estimatedFare}
                  </div>
                  <div className="space-y-3 border-t border-white/10 pt-8 text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
                    <div className="flex justify-between"><span>Train</span> <span>{selectedTrain}</span></div>
                    <div className="flex justify-between"><span>Selection</span> <span>{trainClass} • {passenger}</span></div>
                  </div>
                </article>
              ) : (
                <p className="mt-8 text-sm font-medium italic opacity-50">Select valid routes to calculate.</p>
              )}
            </div>

            <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-3xl">
  <p className="text-[9px] font-medium italic opacity-60 leading-relaxed">
    Note: These fares are based on 2026 tariff adjustments. Please visit official railway counters for final ticket issuance.
  </p>
</div>
          </div>
        </aside>
      </div>

      <footer className="mt-10 bg-surface-variant/50 p-8 rounded-[3rem] border border-outline/30 flex flex-col md:flex-row gap-8 justify-around">
          <div className="max-w-[250px] text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-rail-accent mb-2">Rounding Policy[cite: 1]</p>
              <p className="text-[9px] text-muted font-medium italic">Adjusted to nearest 50/100 blocks. No decimal values.</p>
          </div>
          <div className="max-w-[250px] text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-rail-accent mb-2">Berth Surcharge[cite: 1]</p>
              <p className="text-[9px] text-muted font-medium italic">Rs. 50 (up to 500KM) / Rs. 100 (above) for Economy.</p>
          </div>
          <div className="max-w-[250px] text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-rail-accent mb-2">2026 Crisis Hike</p>
              <p className="text-[9px] text-muted font-medium italic">Includes +10% Economy and +15% AC Class adjustments.</p>
          </div>
      </footer>
    </main>
  );
}