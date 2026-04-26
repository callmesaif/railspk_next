"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function FareCalculator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trainClass, setTrainClass] = useState("Economy");
  const [passenger, setPassenger] = useState("Adult");

  // Sample Data: Isay aap mazeed barha sakte hain
  const baseFares = {
    "Karachi-Lahore": 1800,
    "Karachi-Rawalpindi": 2200,
    "Karachi-Multan": 1400,
    "Lahore-Rawalpindi": 800,
    "Lahore-Multan": 700,
    "Multan-Rawalpindi": 1100,
  };

  const classMultipliers = {
    "Economy": 1,
    "AC Standard": 2.5,
    "AC Business": 3.8,
    "AC Sleeper": 5.2,
  };

  const stations = ["Karachi", "Lahore", "Rawalpindi", "Multan", "Hyderabad", "Peshawar", "Quetta"];

  const calculateFare = () => {
    const route = `${from}-${to}`;
    const reverseRoute = `${to}-${from}`;
    const price = baseFares[route] || baseFares[reverseRoute];

    if (!price || from === to) return null;

    let finalFare = price * classMultipliers[trainClass];
    if (passenger === "Child") finalFare = finalFare * 0.5; // 50% discount for children

    return Math.round(finalFare);
  };

  const estimatedFare = calculateFare();

  return (
    <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter">
          Fare <span className="text-rail-accent">Calculator</span>
        </h1>
        <p className="text-[#74777f] font-bold uppercase tracking-widest text-[10px] mt-4 italic">
          Estimate your journey costs across Pakistan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Input Card */}
        <div className="lg:col-span-2 bg-[#f2f0f4] dark:bg-[#1b1b1f] p-8 md:p-12 rounded-[3.5rem] shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-[#74777f]">From Station</label>
              <select 
                value={from} 
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-white dark:bg-[#2e2f33] p-5 rounded-3xl outline-none font-bold text-sm appearance-none border border-transparent focus:border-rail-accent/30"
              >
                <option value="">Select Origin</option>
                {stations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-[#74777f]">To Destination</label>
              <select 
                value={to} 
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-white dark:bg-[#2e2f33] p-5 rounded-3xl outline-none font-bold text-sm appearance-none border border-transparent focus:border-rail-accent/30"
              >
                <option value="">Select Destination</option>
                {stations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-[#74777f]">Class Type</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(classMultipliers).map(c => (
                  <button 
                    key={c} 
                    onClick={() => setTrainClass(c)}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${trainClass === c ? 'bg-rail-accent text-white shadow-lg' : 'bg-white dark:bg-[#2e2f33] text-[#74777f]'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-[#74777f]">Passenger Type</label>
              <div className="flex gap-2">
                {["Adult", "Child"].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPassenger(p)}
                    className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${passenger === p ? 'bg-rail-accent text-white shadow-lg' : 'bg-white dark:bg-[#2e2f33] text-[#74777f]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="lg:col-span-1">
          <div className="bg-rail-accent text-white p-10 rounded-[3.5rem] h-full flex flex-col justify-between shadow-2xl shadow-rail-accent/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <span className="material-symbols-rounded text-5xl mb-6">payments</span>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Estimated Fare</h3>
              {estimatedFare ? (
                <div className="mt-4 animate-fade-in">
                  <span className="text-sm font-bold opacity-70 italic">PKR</span>
                  <div className="text-6xl font-black italic tracking-tighter leading-none">{estimatedFare}</div>
                  <p className="text-[9px] mt-6 font-bold uppercase tracking-widest leading-relaxed opacity-80">
                    *Approximate fare for {passenger} in {trainClass} from {from} to {to}.
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-sm font-bold italic opacity-70 leading-relaxed">
                  Please select origin and destination to see fare.
                </p>
              )}
            </div>

            <Link 
              href="https://pakrail.gov.pk" 
              target="_blank"
              className="relative z-10 w-full bg-white text-rail-accent py-5 rounded-full font-black uppercase tracking-widest text-[11px] text-center shadow-xl active:scale-95 transition-all mt-10"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#f2f0f4] dark:bg-[#1b1b1f] p-10 rounded-[2.5rem]">
          <h4 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3">
            <span className="material-symbols-rounded text-rail-accent">info</span>
            Class Differences
          </h4>
          <ul className="space-y-4">
            <li className="flex justify-between text-xs font-bold uppercase border-b border-gray-300 dark:border-white/5 pb-2">
              <span className="text-[#74777f]">AC Sleeper</span>
              <span className="text-rail-accent italic">Cabin + Bedding</span>
            </li>
            <li className="flex justify-between text-xs font-bold uppercase border-b border-gray-300 dark:border-white/5 pb-2">
              <span className="text-[#74777f]">AC Business</span>
              <span className="text-rail-accent italic">Semi-Private + AC</span>
            </li>
            <li className="flex justify-between text-xs font-bold uppercase pb-2">
              <span className="text-[#74777f]">Economy</span>
              <span className="text-rail-accent italic">Standard Seating</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-center p-4">
            <p className="text-[10px] text-[#74777f] font-bold uppercase tracking-[0.2em] italic leading-relaxed">
              Note: The fares shown are estimates based on standard route pricing. Actual fares may vary depending on the specific train (Express vs. Passenger) and seasonal adjustments by Pakistan Railways.
            </p>
        </div>
      </div>
    </main>
  );
}