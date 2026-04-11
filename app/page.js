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
        
        // 1. Top Viewed Videos search
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&maxResults=20&type=video&order=viewCount`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.items) {
          const videoIds = searchData.items.map(v => v.id.videoId).join(',');
          
          // 2. Duration filter (No Shorts)
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
    <main className="bg-background text-foreground">
      {/* --- HERO SECTION REVERTED --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
              backgroundImage: `url('/images/train_background.webp')`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.4)' 
          }}
        ></div>
        
        {/* Dark Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-rail-accent animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Live Community Hub Online</span>
          </div>

          <h1 className="text-6xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] uppercase italic tracking-tighter drop-shadow-2xl overflow-visible">
            THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rail-accent to-rail-accent-light px-2">RAILSPK</span>
          </h1>
          
          <p className="text-base md:text-xl mt-12 text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium italic opacity-80">
            Documenting the heritage and cinematic evolution of Pakistan Railways through digital storytelling.
          </p>

          <div className="mt-12">
            <Link href="/reviews" className="px-10 py-5 bg-rail-accent text-white rounded-full font-black uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all">
                Explore Scorecards
            </Link>
          </div>
        </div>
      </section>

      {/* --- VLOGS SECTION --- */}
      <div className="py-32 max-w-screen-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic mb-20 tracking-tighter text-left">
            Most Viewed <span className="text-rail-accent">Vlogs</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-800 h-64 w-full rounded-[2.5rem] animate-pulse" />
                ))
              ) : (
                vlogs.map((v) => (
                  <div 
                    key={v.id.videoId} 
                    onClick={() => setSelectedVideoId(v.id.videoId)}
                    className="group bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img src={v.snippet.thumbnails.high.url} alt={v.snippet.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition duration-500">
                        <i className="fas fa-play text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-[11px] md:text-xs font-black uppercase line-clamp-2 leading-tight">
                        {v.snippet.title}
                      </h3>
                    </div>
                  </div>
                ))
              )}
          </div>

          {!loading && (
            <button 
              onClick={() => setShowRedirectPopup(true)}
              className="mt-20 px-12 py-5 border-2 border-rail-accent text-rail-accent rounded-full font-black uppercase tracking-widest text-xs hover:bg-rail-accent hover:text-white transition-all shadow-xl"
            >
              Watch More on YouTube
            </button>
          )}
      </div>

      {/* --- REDIRECT POPUP --- */}
      {showRedirectPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-rail-dark border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-black uppercase italic text-white mb-2">Leaving Site</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">Diverting to The Rails PK Official Channel</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleRedirect} className="bg-rail-accent text-white py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px]">Continue</button>
              <button onClick={() => setShowRedirectPopup(false)} className="text-gray-500 py-2 font-black uppercase text-[9px] tracking-widest hover:text-white transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <VideoModal videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} />
    </main>
  );
}