"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoModal from '@/components/VideoModal';

export default function HomePage() {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);
  
  // Search States
  const [searchData, setSearchData] = useState({ from: "", to: "" });

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

  return (
    <main className="bg-background text-foreground animate-m3">
      {/* --- CINEMATIC HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        <div 
          className="absolute inset-0 z-0 m-4 rounded-[3.5rem] overflow-hidden shadow-2xl" 
          style={{ 
              backgroundImage: `url('/images/train_background.webp')`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center text-white">
          <h1 className="text-6xl md:text-[10rem] font-black leading-none uppercase italic tracking-tighter mb-8 hero-title drop-shadow-2xl">
            EXPLORE <br /><span className="text-rail-accent-light">PAKISTAN</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto italic font-medium mb-16 px-4">
            The Digital Legacy of Pakistan Railways. Documenting heritage through modern cinematic storytelling.
          </p>

          {/* Functional Search Widget */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-5 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-5xl mx-auto mx-4 transition-all hover:bg-white/15">
            <div className="flex-1 flex items-center gap-4 px-8 py-5 bg-white dark:bg-black/40 rounded-full w-full shadow-inner group">
              <span className="material-symbols-rounded text-rail-accent group-focus-within:scale-110 transition-transform">train</span>
              <input 
                type="text" 
                placeholder="From: Karachi..." 
                className="bg-transparent border-none outline-none text-sm font-bold w-full text-foreground dark:text-white placeholder-gray-400"
                value={searchData.from}
                onChange={(e) => setSearchData({...searchData, from: e.target.value})}
              />
            </div>
            <div className="flex-1 flex items-center gap-4 px-8 py-5 bg-white dark:bg-black/40 rounded-full w-full shadow-inner group">
              <span className="material-symbols-rounded text-rail-accent group-focus-within:scale-110 transition-transform">near_me</span>
              <input 
                type="text" 
                placeholder="To: Lahore..." 
                className="bg-transparent border-none outline-none text-sm font-bold w-full text-foreground dark:text-white placeholder-gray-400"
                value={searchData.to}
                onChange={(e) => setSearchData({...searchData, to: e.target.value})}
              />
            </div>
            <Link href="/reviews" className="w-full md:w-auto px-12 py-5 bg-rail-accent text-white rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:shadow-rail-accent/30 active:scale-95 transition-all">
              Search Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* --- M3 FEATURES SECTION --- */}
      <section className="py-40 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: 'verified', title: 'Verified Reviews', desc: 'Real-time metrics on punctuality, cleanliness, and staff behavior.', color: 'text-purple-500' },
          { icon: 'videocam', title: 'Cinematic Vlogs', desc: 'Premium 4K visuals documenting the heritage of tracks and locomotives.', color: 'text-blue-500' },
          { icon: 'groups', title: 'Railway Cloud', desc: 'Join the largest digital community of rail enthusiasts in Pakistan.', color: 'text-green-500' }
        ].map((feat, i) => (
          <div key={i} className="m3-card p-12 hover:border-rail-accent/30 group">
            <div className={`w-16 h-16 bg-white dark:bg-[#0a0f1a] rounded-[1.5rem] flex items-center justify-center ${feat.color} shadow-sm mb-10 group-hover:bg-rail-accent group-hover:text-white transition-all duration-500`}>
              <span className="material-symbols-rounded text-4xl">{feat.icon}</span>
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-5 tracking-tight">{feat.title}</h3>
            <p className="text-sm text-[#74777f] font-medium leading-relaxed italic">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* --- VLOGS ARCHIVE SECTION --- */}
      <div className="py-32 max-w-screen-2xl mx-auto px-6 bg-[#f2f0f4] dark:bg-[#0a0f1a]/40 rounded-[5rem] mb-20 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 px-6 gap-8">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-left leading-tight">
              Featured <br /><span className="text-rail-accent">Broadcasts</span>
            </h2>
            <button 
              onClick={() => setShowRedirectPopup(true)}
              className="flex items-center gap-3 px-10 py-4 border-2 border-rail-accent text-rail-accent rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-rail-accent hover:text-white transition-all shadow-lg active:scale-95"
            >
              <span className="material-symbols-rounded">open_in_new</span>
              View Full Archive
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white dark:bg-[#1f2937] h-80 w-full rounded-[3.5rem] animate-pulse" />
                ))
              ) : (
                vlogs.map((v) => (
                  <div 
                    key={v.id.videoId} 
                    onClick={() => setSelectedVideoId(v.id.videoId)}
                    className="group bg-white dark:bg-[#1f2937] rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-rail-accent/10"
                  >
                    <div className="aspect-video relative overflow-hidden m-4 rounded-[2.8rem]">
                      <img src={v.snippet.thumbnails.high.url} alt={v.snippet.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="material-symbols-rounded text-7xl text-white scale-75 group-hover:scale-100 transition-transform">play_circle</span>
                      </div>
                    </div>
                    <div className="p-10 pt-4">
                      <h3 className="text-sm font-black uppercase leading-tight line-clamp-2 italic text-[#111827] dark:text-white">
                        {v.snippet.title}
                      </h3>
                    </div>
                  </div>
                ))
              )}
          </div>
      </div>

      <VideoModal videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} />
      
      {/* M3 Redirect Dialog */}
      {showRedirectPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0a0f1a] p-12 rounded-[3.5rem] max-w-sm w-full text-center border border-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-rail-accent/10 text-rail-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-rounded text-3xl">exit_to_app</span>
            </div>
            <h3 className="text-xl font-black italic uppercase text-foreground mb-4">Leaving Site</h3>
            <p className="text-[#74777f] text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed">Diverting to The Rails PK Official YouTube Channel for the full archive.</p>
            <div className="flex flex-col gap-4">
              <a href={CHANNEL_URL} target="_blank" onClick={() => setShowRedirectPopup(false)} className="bg-rail-accent text-white py-5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl active:scale-95 transition-all">Confirm & Open</a>
              <button onClick={() => setShowRedirectPopup(false)} className="text-[#74777f] py-2 font-bold uppercase text-[9px] tracking-widest hover:text-foreground">Stay Here</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}