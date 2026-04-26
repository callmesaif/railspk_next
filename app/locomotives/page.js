export default function LocomotivePage() {
  const engines = [
    { type: "GEU-40", builder: "GE USA", hp: "4000 HP", class: "Freight/Passenger" },
    { type: "HGMU-30", builder: "Henschel", hp: "3000 HP", class: "Main Line" },
    { type: "ZCU-20", builder: "CSR Ziyang", hp: "2000 HP", class: "Shunting/Local" },
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter">Engine <span className="text-rail-accent">Archive</span></h1>
        <p className="text-[#74777f] font-bold uppercase tracking-widest text-[10px] mt-4 italic">The Powerhouses of Pakistan Railways</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {engines.map((e, i) => (
          <div key={i} className="m3-card p-10 bg-[#f2f0f4] dark:bg-[#1b1b1f] rounded-[2.5rem] border border-white/5 group hover:border-rail-accent/30 transition-all">
            <div className="text-rail-accent mb-8"><span className="material-symbols-rounded text-5xl italic">settings_input_component</span></div>
            <h3 className="text-2xl font-black italic uppercase mb-2">{e.type}</h3>
            <p className="text-[10px] font-black text-rail-accent uppercase tracking-widest mb-6 italic">{e.builder}</p>
            <div className="space-y-3 pt-6 border-t border-gray-300 dark:border-white/5">
               <div className="flex justify-between text-xs font-bold uppercase"><span className="text-[#74777f]">Horsepower</span><span>{e.hp}</span></div>
               <div className="flex justify-between text-xs font-bold uppercase"><span className="text-[#74777f]">Class</span><span>{e.class}</span></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}