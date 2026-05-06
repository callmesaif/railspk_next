"use client";
import { useState } from 'react';
import Link from 'next/link'; // <--- Ye wali line missing thi re baba!
import Image from 'next/image';

export default function JourneyPlanner() {
  const [selectedCity, setSelectedCity] = useState("Karachi");

  const cityData = {
    "Karachi": {
      tagline: "The City of Lights & Gateway to the Sea",
      places: [
        { name: "Mazar-e-Quaid", desc: "The final resting place of Quaid-e-Azam. A stunning white marble masterpiece of modernist architecture.", icon: "account_balance" },
        { name: "Clifton Beach", desc: "One of the world's highest naturally silver-sand beaches, perfect for a camel ride at sunset.", icon: "beach_access" },
        { name: "Mohatta Palace", desc: "A grand 20th-century palace built by a Hindu businessman, now a beautiful art museum.", icon: "castle" },
        { name: "PAF Museum", desc: "A massive outdoor park showcasing the legendary aircraft and history of the Pakistan Air Force.", icon: "flight" },
        { name: "Chaukhandi Tombs", desc: "Ancient 15th-century cemetery known for its intricate stone carvings and unique architecture.", icon: "history_edu" }
      ]
    },
    "Hyderabad": {
      tagline: "The Historical Heart of Sindh",
      places: [
        { name: "Kotri Barrage", desc: "A massive dam on the Indus River, offering scenic views and fresh Palla fish delicacies.", icon: "water_lux" },
        { name: "Sindh Museum", desc: "Dive deep into the rich Indus Valley Civilization and Sindhi cultural history.", icon: "museum" },
        { name: "Resham Bazar", desc: "One of the oldest bazaars, famous for traditional Hyderabad bangles and handicrafts.", icon: "shopping_bag" },
        { name: "Pacco Qillo", desc: "The 'Strong Fort' built by Mian Ghulam Shah Kalhoro, a symbol of Hyderabadi heritage.", icon: "fort" },
        { name: "Tombs of Talpur Mirs", desc: "Majestic blue-tiled mausoleums belonging to the Talpur rulers of Sindh.", icon: "architecture" }
      ]
    },
    "Lahore": {
      tagline: "The Mughal Soul of Pakistan",
      places: [
        { name: "Badshahi Mosque", desc: "One of the largest mosques in the world, a peak example of Mughal red sandstone architecture.", icon: "mosque" },
        { name: "Lahore Fort (Shahi Qila)", desc: "A UNESCO World Heritage site with the legendary Sheesh Mahal (Palace of Mirrors).", icon: "gite" },
        { name: "Minar-e-Pakistan", desc: "The monument where the resolution for a separate homeland was passed in 1940.", icon: "apartment" },
        { name: "Shalimar Gardens", desc: "Stunning Persian-style gardens built by Emperor Shah Jahan in the 17th century.", icon: "park" },
        { name: "Wazir Khan Mosque", desc: "Famous for its incredibly detailed tile work and frescoes from the Mughal era.", icon: "temple_hindu" }
      ]
    }
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto animate-m3">
      <header className="text-center mb-16">
        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
          Journey <span className="text-rail-accent">Planner</span>
        </h1>
        <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em] mt-6 italic">
          Plan your destination before you board the train
        </p>
      </header>

      {/* City Selector Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {Object.keys(cityData).map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[12px] transition-all shadow-xl ${
              selectedCity === city ? 'bg-rail-accent text-white scale-105' : 'bg-surface-variant text-muted hover:bg-outline/20'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Selected City Info */}
      <div className="bg-surface-variant p-10 md:p-20 rounded-[4rem] border border-outline shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
            <span className="material-symbols-rounded text-[20rem]">map</span>
        </div>

        <div className="relative z-10">
          <div className="mb-12">
            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tight leading-none mb-4">
                Explore <span className="text-rail-accent">{selectedCity}</span>
            </h2>
            <p className="text-muted text-lg font-bold italic">{cityData[selectedCity].tagline}</p>
          </div>

          {/* Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cityData[selectedCity].places.map((place, i) => (
              <div key={i} className="bg-background/40 p-8 rounded-[3rem] border border-outline/10 hover:border-rail-accent/30 transition-all group">
                <span className="material-symbols-rounded text-rail-accent text-4xl mb-6 group-hover:scale-110 transition-transform">
                    {place.icon}
                </span>
                <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tight">{place.name}</h3>
                <p className="text-muted text-sm leading-relaxed font-medium italic">
                    {place.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking CTA update */}
<div className="mt-16 text-center">
  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-muted">Plan your next trip to {selectedCity}</p>
  <Link href="/fares" className="inline-block px-16 py-6 bg-rail-accent text-white rounded-full font-black uppercase tracking-widest text-[12px] shadow-2xl hover:bg-white hover:text-black transition-all active:scale-95">
    Check Fare Estimate
  </Link>
</div>
    </main>
  );
}