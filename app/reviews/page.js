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
        <section className="min-h-screen pt-32 pb-20 bg-rail-dark text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">
                        Train <span className="text-rail-accent">Scorecards</span>
                    </h2>
                    <input 
                        type="text" 
                        placeholder="Search train or route..." 
                        className="mt-12 w-full max-w-2xl bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-rail-accent transition-all text-center font-bold text-lg"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.map(train => (
                        <div key={train.id} className="bg-white/5 rounded-[3rem] border border-white/10 p-8 shadow-2xl hover:scale-[1.02] transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-black uppercase italic leading-none">{train.name}</h3>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-gray-500">Punctuality</p>
                                    <p className="text-xl font-black italic text-rail-accent">{train.stats.punctuality}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">{train.route}</p>
                            
                            <div className="bg-rail-dark p-6 rounded-[2rem] border border-white/5 space-y-3 mb-8">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-500">
                                    <span>Cleanliness</span>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star ${i < train.stats.cleanliness ? 'text-rail-accent' : 'text-white/10'}`}></i>
                                        ))}
                                    </div>
                                </div>
                                <hr className="border-white/5" />
                                <div className="space-y-2">
                                    {train.fares.slice(0, 3).map((f, i) => (
                                        <div key={i} className="flex justify-between text-[11px] font-bold">
                                            <span className="text-gray-400">{f.class}</span>
                                            <span className="text-rail-accent italic">{f.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Fixed Link with Prefetch False and Trailing Slash */}
                            <Link 
                                href={`/reviews/${train.id}/`}
                                prefetch={false}
                                className="block w-full text-center bg-rail-accent text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest italic shadow-lg hover:bg-white hover:text-rail-dark transition-all"
                            >
                                Explore Detailed Review
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}