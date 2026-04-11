export default function AboutPage() {
  return (
    <section className="min-h-screen pt-32 pb-20 bg-white dark:bg-rail-dark">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic mb-12 text-gray-900 dark:text-white">
          THE MISSION
        </h2>
        <p className="text-xl md:text-4xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-5xl mx-auto font-light mb-24 italic">
          "Documenting the heritage and modern evolution of Pakistan Railways through cinematic storytelling and data-driven insights."
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-gray-50 dark:bg-gray-800/40 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <span className="text-4xl md:text-6xl font-black text-rail-accent block italic mb-2">35K+</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subscribers</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/40 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <span className="text-4xl md:text-6xl font-black text-rail-accent block italic mb-2">5M+</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Reach</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/40 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <span className="text-4xl md:text-6xl font-black text-rail-accent block italic mb-2">150+</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vlogs</span>
          </div>
        </div>
      </div>
    </section>
  );
}