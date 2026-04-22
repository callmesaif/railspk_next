"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoModal from '@/components/VideoModal';

export default function HomePage() {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);

  const CHANNEL_URL = "https://www.youtube.com/@TheRailsPK";

  useEffect(() => {
    const fetchTopVlogs = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YT_KEY;
        const channelId = process.env.NEXT_PUBLIC_YT_CHANNEL;
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&maxResults=20&type=video&order=viewCount`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.items) {
          const videoIds = searchData.items.map(v => v.id.videoId).join(',');
          const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,contentDetails`;
          const detailsRes = await fetch(detailsUrl);
          const detailsData = await detailsRes.json();

          const getSeconds = (iso) => {
            const matches = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            return (parseInt(matches[1]||0)*3600) + (parseInt(matches[2]||0)*60) + parseInt(matches[3]||0);
          };

          const longVideos = detailsData.items
            .filter(v => getSeconds(v.contentDetails.duration) > 60)
            .slice(0, 6)
            .map(v => ({ id: { videoId: v.id }, snippet: v.snippet }));

          setVlogs(longVideos);
        }
      } catch (err) {
        console.error("Vlog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopVlogs();
  }, []);

  const handleRedirect = () => {
    window.open(CHANNEL_URL, '_blank');
    setShowRedirectPopup(false);
  };

  return (
    <main className="bg-[#fdfbff] dark:bg-[#1b1b1f]">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center m-4 rounded-[3rem] overflow-hidden">
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
              backgroundImage: `url('/images/train_background.webp')`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.5)' 
          }}
        ></div>
        
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Pakistan Railways Digital Hub</span>
          </div>

          <h1 className="text-6xl md:text-[8rem] font-black leading-none uppercase italic tracking-tighter mb-8">
            THE <span className="text-[#ffb4ab]">RAILSPK</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto italic font-medium">
            Documenting heritage through modern cinematic storytelling.
          </p>

          <div className="mt-12">
            <Link href="/reviews" className="px-10 py-4 bg-[#ba1a1a] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-[#ba1a1a]/30 transition-all active:scale-95">
                Explore Scorecards
            </Link>
          </div>
        </div>
      </section>

      {/* --- VLOGS SECTION --- */}
      <div className="py-24 max-w-screen-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-16 flex items-center gap-4 text-left">
            <span className="material-symbols-rounded text-4xl md:text-6xl text-[#ba1a1a] dark:text-[#ffb4ab]">movie</span>
            Featured <span className="text-[#ba1a1a] dark:text-[#ffb4ab]">Vlogs</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#e3e2e6] dark:bg-[#2e2f33] h-72 w-full rounded-[2.5rem] animate-pulse" />
                ))
              ) : (
                vlogs.map((v) => (
                  <div 
                    key={v.id.videoId} 
                    onClick={() => setSelectedVideoId(v.id.videoId)}
                    className="group bg-[#f2f0f4] dark:bg-[#2e2f33] rounded-[2.5rem] overflow-hidden border border-transparent hover:border-[#ba1a1a] dark:hover:border-[#ffb4ab] transition-all duration-500 cursor-pointer"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={v.snippet.thumbnails.high.url} alt={v.snippet.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="material-symbols-rounded text-5xl text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all">play_circle</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xs font-bold uppercase leading-tight line-clamp-2">
                        {v.snippet.title}
                      </h3>
                    </div>
                  </div>
                ))
              )}
          </div>

          {/* WATCH MORE BUTTON */}
          {!loading && (
            <button 
              onClick={() => setShowRedirectPopup(true)}
              className="mt-20 inline-flex items-center gap-3 px-12 py-4 border-2 border-[#ba1a1a] dark:border-[#ffb4ab] text-[#ba1a1a] dark:text-[#ffb4ab] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#ba1a1a] hover:text-white dark:hover:bg-[#ffb4ab] dark:hover:text-[#1b1b1f] transition-all shadow-xl active:scale-95"
            >
              <span className="material-symbols-rounded text-lg">open_in_new</span>
              Watch More on YouTube
            </button>
          )}
      </div>

      {/* --- REDIRECT POPUP (Material 3 Dialog Style) --- */}
      {showRedirectPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#fdfbff] dark:bg-[#1b1b1f] border border-[#74777f]/20 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl">
            <span className="material-symbols-rounded text-5xl text-[#ba1a1a] dark:text-[#ffb4ab] mb-4">exit_to_app</span>
            <h3 className="text-xl font-bold uppercase italic text-foreground mb-2">Leaving Site</h3>
            <p className="text-[#44474e] dark:text-[#c4c6cf] text-[10px] font-bold uppercase tracking-widest mb-8">Diverting to The Rails PK Official Channel</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleRedirect} className="bg-[#ba1a1a] text-white py-4 rounded-full font-bold uppercase italic tracking-widest text-[10px] active:scale-95 transition-all">Continue</button>
              <button onClick={() => setShowRedirectPopup(false)} className="text-[#74777f] py-2 font-bold uppercase text-[9px] tracking-widest hover:text-foreground transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <VideoModal videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} />
    </main>
  );
}