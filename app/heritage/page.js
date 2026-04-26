export default function HeritagePage() {
  const stories = [
    { title: "Attock Bridge", year: "1883", desc: "A masterpiece of Victorian engineering over the Indus River." },
    { title: "The Khyber Mail", year: "1947", desc: "Pakistan's most iconic and longest-running passenger train service." }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto">
      <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter text-center mb-24">Railway <span className="text-rail-accent">Heritage</span></h1>
      <div className="space-y-20">
        {stories.map((s, i) => (
          <div key={i} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
            <div className="flex-1 w-full aspect-video bg-gray-200 dark:bg-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-rail-accent/20 group-hover:bg-transparent transition-all"></div>
              {/* Replace with real heritage image URLs */}
              <div className="w-full h-full bg-[url('/images/heritage_placeholder.webp')] bg-cover bg-center"></div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-6 px-4">
              <span className="text-rail-accent font-black text-2xl italic"># {s.year}</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight">{s.title}</h2>
              <p className="text-[#74777f] font-medium leading-relaxed italic">{s.desc}</p>
              <button className="px-10 py-4 bg-rail-accent text-white rounded-full font-black uppercase text-[10px] shadow-lg active:scale-95 transition-all">Read Story</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}