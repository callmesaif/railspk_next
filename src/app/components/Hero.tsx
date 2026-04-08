export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590641663083-29000a6e8775?q=80&w=2070')] bg-cover bg-center opacity-40"></div>
      <div className="relative text-center z-10 px-4">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 italic">RAILS<span className="text-yellow-400">PK</span></h1>
        <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">Experiencing Pakistan's Premier Rail Journeys with High-Class Luxury & Style.</p>
      </div>
    </section>
  );
}