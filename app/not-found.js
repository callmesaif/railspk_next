import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-rail-dark text-foreground px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* 1. Icon Section (M3 Style) */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-rail-accent/10 text-rail-accent rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 animate-pulse">
          <span className="material-symbols-rounded text-5xl md:text-7xl">train_broken</span>
        </div>

        {/* 2. Main Heading (Cinematic Typography) */}
        <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-6 text-gray-900 dark:text-white">
          404 <br />
          <span className="text-rail-accent">TRACK LOST</span>
        </h1>

        {/* 3. Description */}
        <p className="text-base md:text-2xl text-[#74777f] dark:text-[#c4c6cf] italic font-medium mb-16 max-w-lg mx-auto leading-relaxed">
          The requested station or page has been derailed. It might have been moved or the track is under maintenance.
        </p>

        {/* 4. Action Button (M3 Pill Style) */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-4 px-12 py-5 bg-rail-accent text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl hover:shadow-rail-accent/30 active:scale-95 transition-all group"
        >
          <span className="material-symbols-rounded group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Return to Terminal
        </Link>
      </div>

      {/* Decorative Background Element (Optional) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rail-accent/20 to-transparent"></div>
    </main>
  );
}