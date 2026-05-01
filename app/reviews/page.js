"use client";
import { useState } from 'react';
import Link from 'next/link';
import { trainsData } from '@/lib/trains';

export default function ReviewsPage() {
    const [search, setSearch] = useState("");

    const filtered = trainsData.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.route.toLowerCase().includes(search.toLowerCase())
    );

    return (
        /* Lighthouse Fix: Using <main> tag as the primary landmark */
        <main className="min-h-screen pt-32 pb-20 bg-background text-foreground animate-m3">
            <div className="max-w-7xl mx-auto px-6">
                <header className="text-center mb-20">
                    <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8">
                        Train <span className="text-rail-accent">Reviews</span>
                    </h1>
                    
                    {/* M3 Search Bar Style with Accessibility Label */}
                    <div className="relative max-w-2xl mx-auto group">
                        <span className="material-symbols-rounded absolute left-6 top-1/2 -translate-y-1/2 dark:text-[#a9abb1]" aria-hidden="true">
                            search
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search train or route..." 
                            aria-label="Search for a train or railway route"
                            className="w-full bg-[#f2f0f4] dark:bg-[#2e2f33] border-none p-6 pl-16 rounded-full outline-none focus:ring-2 focus:ring-rail-accent transition-all font-bold text-lg shadow-sm group-hover:shadow-md"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(train => (
                        /* Semantic article tag for individual train reviews */
                        <article key={train.id} className="bg-[#f2f0f4] dark:bg-[#2e2f33] rounded-[2.5rem] border border-transparent hover:border-rail-accent/30 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-black uppercase italic leading-tight max-w-[70%]">{train.name}</h2>
                                <div className="bg-white dark:bg-[#1b1b1f] p-3 rounded-2xl text-center min-w-[70px] shadow-sm">
                                    <p className="text-[8px] font-black uppercase dark:text-[#a9abb1]">Punctuality</p>
                                    <p className="text-xl font-black italic text-rail-accent">{train.stats.punctuality}</p>
                                </div>
                            </div>
                            
                            <p className="text-[#44474e] dark:text-[#c4c6cf] text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                <span className="material-symbols-rounded text-sm" aria-hidden="true">route</span>
                                {train.route}
                            </p>
                            
                            <div className="bg-white/40 dark:bg-black/20 p-6 rounded-[2rem] space-y-4 mb-8 flex-grow">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase dark:text-[#a9abb1]">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-rounded text-sm" aria-hidden="true">cleaning_services</span> 
                                        Cleanliness
                                    </span>
                                    <div className="flex gap-1" aria-label={`${train.stats.cleanliness} out of 5 stars`}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`material-symbols-rounded text-xs ${i < train.stats.cleanliness ? 'text-rail-accent' : 'text-gray-300 dark:text-gray-700'}`}>
                                                star
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <hr className="opacity-10" />
                                <div className="space-y-3">
                                    {train.fares.slice(0, 3).map((f, i) => (
                                        <div key={i} className="flex justify-between text-[11px] font-bold">
                                            <span className="text-[#44474e] dark:text-[#c4c6cf] uppercase">{f.class}</span>
                                            <span className="text-rail-accent italic font-black">{f.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Accessibility: Providing a discernible name for the link */}
                            <Link 
                                href={`/reviews/${train.id}/`}
                                prefetch={false}
                                aria-label={`View detailed review for ${train.name}`}
                                className="inline-flex items-center justify-center gap-3 w-full bg-rail-accent text-white py-4 rounded-full font-bold uppercase text-[11px] tracking-widest shadow-lg hover:shadow-rail-accent/30 active:scale-95 transition-all"
                            >
                                <span className="material-symbols-rounded text-lg" aria-hidden="true">analytics</span>
                                Detailed Review
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}