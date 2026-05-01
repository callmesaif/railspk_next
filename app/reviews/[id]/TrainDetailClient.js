"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; //
import { collection, query, onSnapshot } from 'firebase/firestore';
import CommentSection from '@/components/Comments';
import BookingModal from '@/components/BookingModal';

export default function TrainDetailClient({ train }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Step 1: Dynamic Stats State (Initial value is from static lib)
    const [dynamicStats, setDynamicStats] = useState({
        cleanliness: train.stats.cleanliness || 0,
        punctuality: train.stats.punctuality || 0,
        food: train.stats.food || 0,
        staff: train.stats.staff || 0
    });

    // Step 2: Real-time Calculation Logic
    useEffect(() => {
        // Path matches the Discussion Hub structure
        const commentsRef = collection(db, `artifacts/railspk-official-1de54/public/data/reviews/${train.id}/comments`);
        const q = query(commentsRef);

        const unsubscribe = onSnapshot(q, (snap) => {
            const allComments = snap.docs.map(doc => doc.data());
            
            if (allComments.length > 0) {
                const totals = { cleanliness: 0, punctuality: 0, food: 0, staff: 0 };
                let ratedCommentsCount = 0;

                allComments.forEach(comment => {
                    if (comment.ratings) {
                        totals.cleanliness += comment.ratings.cleanliness || 0;
                        totals.punctuality += comment.ratings.punctuality || 0;
                        totals.food += comment.ratings.food || 0;
                        totals.staff += comment.ratings.staff || 0;
                        ratedCommentsCount++;
                    }
                });

                if (ratedCommentsCount > 0) {
                    setDynamicStats({
                        cleanliness: (totals.cleanliness / ratedCommentsCount).toFixed(1),
                        punctuality: (totals.punctuality / ratedCommentsCount).toFixed(1),
                        food: (totals.food / ratedCommentsCount).toFixed(1),
                        staff: (totals.staff / ratedCommentsCount).toFixed(1)
                    });
                }
            }
        });

        return () => unsubscribe();
    }, [train.id]);

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            {/* Cinematic Hero */}
            <section className="relative h-[65vh] flex items-end m-4 rounded-[3rem] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${train.slides[0]})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-10 pb-16 w-full text-white">
                    <Link href="/reviews" className="inline-flex items-center gap-2 text-[#ffb4ab] text-[11px] font-bold uppercase tracking-widest mb-6 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-all">
                        <span className="material-symbols-rounded text-sm">arrow_back</span>
                        Back to Scorecards
                    </Link>
                    <h1 className="text-6xl md:text-[8rem] font-black uppercase italic tracking-tighter leading-[0.85] hero-title">{train.name}</h1>
                    <div className="flex items-center gap-4 mt-8 opacity-80">
                         <span className="material-symbols-rounded">location_on</span>
                         <p className="italic font-medium text-lg">{train.route}</p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
                <div className="lg:col-span-2 space-y-10">
                    {/* Metrics Grid - Now using Dynamic Stats */}
                    <div className="bg-[#f2f0f4] dark:bg-[#2e2f33] border border-transparent p-8 md:p-12 rounded-[3rem] grid grid-cols-2 md:grid-cols-4 gap-8 shadow-sm">
                        {Object.entries(dynamicStats).map(([key, val]) => (
                            <div key={key} className="flex flex-col items-center text-center p-4 bg-white dark:bg-[#1b1b1f] rounded-[2rem] shadow-sm">
                                <p className="text-[9px] font-bold uppercase dark:text-[#a9abb1] mb-3 tracking-[0.2em]">{key}</p>
                                <p className="text-4xl font-black italic text-rail-accent leading-none">
                                    {val}<span className="text-xs opacity-40 font-normal">/5</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Timeline */}
                    <div className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-10 rounded-[3rem]">
                        <h3 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-rail-accent mb-10">
                            <span className="material-symbols-rounded">timeline</span> Stops Timeline
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {train.cities.map((city, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="px-6 py-3 bg-white dark:bg-[#1b1b1f] rounded-full text-xs font-bold shadow-sm">
                                        {city}
                                    </span>
                                    {idx !== train.cities.length - 1 && <span className="material-symbols-rounded text-gray-400">arrow_forward</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Composition */}
                    <div className="border border-[#74777f]/20 p-10 rounded-[3rem]">
                        <h3 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-rail-accent mb-8">
                            <span className="material-symbols-rounded">train</span> Rake Composition
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {Object.entries(train.composition).map(([key, val]) => (
                                <div key={key} className="flex justify-between items-center border-b border-[#74777f]/10 pb-4">
                                    <span className="uppercase text-[#44474e] dark:text-[#c4c6cf] font-bold text-[11px]">{key}</span>
                                    <span className="bg-rail-accent/10 text-rail-accent px-4 py-1 rounded-full font-black text-sm">{val} Coaches</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 pt-12 border-t border-[#74777f]/10">
                        <CommentSection docId={train.id} type="reviews" />
                    </div>
                </div>

                {/* Fares Sidebar */}
                <div className="lg:relative">
                    <div className="bg-rail-accent text-white p-10 rounded-[3.5rem] shadow-2xl sticky top-28 overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                        
                        <h3 className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] mb-10 opacity-80">
                            <span className="material-symbols-rounded">verified</span> Verified Fares
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {train.fares.map((f, i) => (
                                <div key={i} className="flex justify-between items-end border-b border-white/20 pb-4 hover:border-white/50 transition-colors">
                                    <span className="font-bold text-xs uppercase">{f.class}</span>
                                    <span className="font-black italic text-3xl">{f.price}</span>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="w-full flex items-center justify-center gap-3 bg-white text-rail-accent py-5 rounded-full mt-12 font-bold uppercase italic tracking-widest text-xs hover:shadow-2xl active:scale-95 transition-all shadow-xl"
                        >
                            <span className="material-symbols-rounded">local_activity</span>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedTrainId={train.id} />
        </main>
    );
}