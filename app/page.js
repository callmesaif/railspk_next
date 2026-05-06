"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import VideoModal from '@/components/VideoModal';
import { db } from '@/lib/firebase'; 
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { trainsData } from '@/lib/trains';

export default function HomePage() {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);
  const [searchData, setSearchData] = useState({ from: "", to: "" });

  const [latestUpdateTitle, setLatestUpdateTitle] = useState("Loading...");
  const [latestReview, setLatestReview] = useState({ id: "", name: "Loading..." });

  const CHANNEL_URL = "https://www.youtube.com/@railoverspkofficial";

  useEffect(() => {
    const qUpdates = query(
      collection(db, "artifacts/railspk-official-1de54/public/data/updates"), 
      orderBy("timestamp", "desc"), 
      limit(1)
    );
    
    const unsubUpdates = onSnapshot(qUpdates, (snap) => {
      if (!snap.empty) {
        setLatestUpdateTitle(snap.docs[0].data().title);
      } else {
        setLatestUpdateTitle("Cloud Live");
      }
    });

    if (trainsData && trainsData.length > 0) {
      setLatestReview({ 
        id: trainsData[0].id, 
        name: trainsData[0].name 
      });
    }

    const fetchTopVlogs = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YT_KEY;
        const channelId = process.env.NEXT_PUBLIC_YT_CHANNEL;
        
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&maxResults=20&type=video&order=viewCount`;
        const searchRes = await fetch(searchUrl);
        const searchResData = await searchRes.json();

        if (searchResData.items) {
          const videoIds = searchResData.items.map(v => v.id.videoId).join(',');
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
    return () => unsubUpdates();
  }, []);

  return (
    <main className="bg-background text-foreground animate-m3">
      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 m-2 md:m-4 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl">
          <Image 
            src="/images/train_background.webp"
            alt="Pakistan Railways Heritage Background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center text-white">
          {/* H1: Primary Page Heading[cite: 3] */}
          <h1 className="text-5xl md:text-[10rem] font-black leading-[1.1] md:leading-none uppercase italic tracking-tighter mb-6 md:mb-8 hero-title drop-shadow-2xl">
            EXPLORE <br className="md:hidden" /><span className="text-rail-accent-light">PAKISTAN</span>
          </h1>
          <p className="text-base md:text-2xl text-gray-200 max-w-2xl mx-auto italic font-medium mb-12 md:mb-16 px-2 md:px-4">
            The Digital Legacy of Pakistan Railways. Documenting heritage through modern cinematic storytelling.
          </p>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 md:p-5 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-4 max-w-5xl mx-auto transition-all hover:bg-white/15">
            <div className="flex-1 flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 bg-white dark:bg-black/40 rounded-full w-full shadow-inner group">
              <span className="material-symbols-rounded text-rail-accent" aria-hidden="true">train</span>
              <input 
                type="text" 
                placeholder="From: Karachi..." 
                aria-label="Departure Station"
                className="bg-transparent border-none outline-none text-xs md:text-sm font-bold w-full text-foreground dark:text-white placeholder-gray-400"
                value={searchData.from}
                onChange={(e) => setSearchData({...searchData, from: e.target.value})}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 bg-white dark:bg-black/40 rounded-full w-full shadow-inner group">
              <span className="material-symbols-rounded text-rail-accent" aria-hidden="true">near_me</span>
              <input 
                type="text" 
                placeholder="To: Lahore..." 
                aria-label="Destination Station"
                className="bg-transparent border-none outline-none text-xs md:text-sm font-bold w-full text-foreground dark:text-white placeholder-gray-400"
                value={searchData.to}
                onChange={(e) => setSearchData({...searchData, to: e.target.value})}
              />
            </div>
            <Link href="/reviews" aria-label="Search Train Reviews" className="w-full md:w-auto px-10 py-4 md:py-5 bg-rail-accent text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:shadow-rail-accent/30 active:scale-95 transition-all">
              Search Reviews
            </Link>
          </div>

          <nav className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in">
          <Link href="/planner" aria-label="Explore Journey Planner: Discover Destinations" className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-rail-accent/20 transition-all group">
    <span className="w-2 h-2 rounded-full bg-rail-accent animate-pulse" aria-hidden="true"></span>
    <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
      Explore: Journey Planner
    </span>
    <span className="material-symbols-rounded text-sm text-rail-accent group-hover:translate-x-1 transition-transform" aria-hidden="true">explore</span>
  </Link>

            <Link href={`/reviews/${latestReview.id}`} aria-label={`View Latest Review: ${latestReview.name}`} className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-green-500/20 transition-all group border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                New Review: {latestReview.name}
              </span>
              <span className="material-symbols-rounded text-sm text-green-500 group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_right_alt</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 md:py-40 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {[
          { icon: 'verified', title: 'Verified Reviews', desc: 'Real-time metrics on punctuality, cleanliness, and staff behavior.', color: 'text-purple-500' },
          { icon: 'videocam', title: 'Cinematic Vlogs', desc: 'Premium 4K visuals documenting the heritage of tracks and locomotives.', color: 'text-blue-500' },
          { icon: 'groups', title: 'Railway Cloud', desc: 'Join the largest digital community of rail enthusiasts in Pakistan.', color: 'text-green-500' }
        ].map((feat, i) => (
          <article key={i} className="m3-card p-10 md:p-12 hover:border-rail-accent/30 group">
            <div className={`w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-[#0a0f1a] rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center ${feat.color} shadow-sm mb-8 md:mb-10 group-hover:bg-rail-accent group-hover:text-white transition-all duration-500`} aria-hidden="true">
              <span className="material-symbols-rounded text-3xl md:text-4xl">{feat.icon}</span>
            </div>
            {/* H2 Fix: Features are main sections after H1[cite: 3] */}
            <h2 className="text-xl md:text-2xl font-black italic uppercase mb-4 md:mb-5 tracking-tight">{feat.title}</h2>
            <p className="text-sm dark:text-[#a9abb1] font-medium leading-relaxed italic">{feat.desc}</p>
          </article>
        ))}
      </section>

      {/* --- VLOGS ARCHIVE SECTION --- */}
      <section className="py-24 md:py-32 max-w-screen-2xl mx-auto px-6 bg-[#f2f0f4] dark:bg-[#0a0f1a]/40 rounded-[3rem] md:rounded-[5rem] mb-20 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-20 px-4 md:px-6 gap-6 md:gap-8 text-center md:text-left">
            {/* H2 Fix: Maintain consistency in section headings[cite: 3] */}
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">
              Featured <br /><span className="text-rail-accent">Broadcasts</span>
            </h2>
            <button 
              onClick={() => setShowRedirectPopup(true)}
              aria-label="View our full YouTube video archive"
              className="flex items-center gap-3 px-8 md:px-10 py-3 md:py-4 border-2 border-rail-accent text-rail-accent rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-rail-accent hover:text-white transition-all shadow-lg active:scale-95"
            >
              <span className="material-symbols-rounded" aria-hidden="true">open_in_new</span>
              View Full Archive
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 px-2 md:px-4">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white dark:bg-[#1f2937] h-80 w-full rounded-[2.5rem] animate-pulse" aria-hidden="true" />
                ))
              ) : (
                vlogs.map((v) => (
                  <article 
                    key={v.id.videoId} 
                    onClick={() => setSelectedVideoId(v.id.videoId)}
                    className="group bg-white dark:bg-[#1f2937] rounded-b-[2.5rem] md:rounded-b-[3.5rem] rounded-t-none overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-rail-accent/10"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <Image 
                        src={v.snippet.thumbnails.high.url} 
                        alt={`Thumbnail for video: ${v.snippet.title}`} 
                        fill 
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="material-symbols-rounded text-6xl md:text-7xl text-white scale-75 group-hover:scale-100 transition-transform" aria-hidden="true">play_circle</span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 pt-4 md:pt-6">
                      {/* H3 Fix: Vlog titles are sub-sections of Broadcasts (H2)[cite: 3] */}
                      <h3 className="text-xs md:text-sm font-black uppercase leading-tight line-clamp-2 italic text-[#111827] dark:text-white">
                        {v.snippet.title}
                      </h3>
                    </div>
                  </article>
                ))
              )}
          </div>
      </section>

      <VideoModal videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} />
      
      {showRedirectPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md" role="dialog" aria-labelledby="modal-title">
          <div className="bg-white dark:bg-[#0a0f1a] p-10 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] max-w-sm w-full text-center border border-white/10 shadow-2xl">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-rail-accent/10 text-rail-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-rounded text-2xl md:text-3xl" aria-hidden="true">exit_to_app</span>
            </div>
            <h2 id="modal-title" className="text-lg md:text-xl font-black italic uppercase text-foreground mb-4">Leaving Site</h2>
            <p className="dark:text-[#a9abb1] text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed">Diverting to The Rails PK Official YouTube Channel for the full archive.</p>
            <div className="flex flex-col gap-4">
              <a href={CHANNEL_URL} target="_blank" onClick={() => setShowRedirectPopup(false)} aria-label="Confirm and open YouTube channel" className="bg-rail-accent text-white py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-[11px] shadow-xl active:scale-95 transition-all text-center">Confirm & Open</a>
              <button onClick={() => setShowRedirectPopup(false)} aria-label="Close this modal and stay on current page" className="dark:text-[#a9abb1] py-2 font-bold uppercase text-[9px] tracking-widest hover:text-foreground">Stay Here</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}