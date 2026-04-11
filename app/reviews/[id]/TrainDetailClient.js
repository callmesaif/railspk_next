"use client";
import { useState } from 'react';
import Link from 'next/link';
import CommentSection from '@/components/Comments';
import BookingModal from '@/components/BookingModal';

export default function TrainDetailClient({ train }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${train.slides[0]})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
                    <Link href="/reviews" className="text-rail-accent text-[10px] font-black uppercase tracking-widest mb-4 inline-block hover:underline">← Back to Scorecards</Link>
                    <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none hero-title">{train.name}</h1>
                    <p className="text-gray-400 italic mt-4 text-lg md:text-xl">{train.route}</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Metrics */}
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] grid grid-cols-2 md:grid-cols-4 gap-8">
                        {Object.entries(train.stats).map(([key, val]) => (
                            <div key={key} className="text-center">
                                <p className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">{key}</p>
                                <p className="text-3xl font-black italic">{val}{typeof val === 'number' ? '/5' : ''}</p>
                            </div>
                        ))}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem]">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-rail-accent mb-8">Stops Timeline</h3>
                        <div className="flex flex-wrap gap-4 text-sm font-bold leading-relaxed">
                            {train.cities.map((city, idx) => (
                                <span key={idx} className="flex items-center gap-3">
                                    {city} {idx !== train.cities.length - 1 && <i className="fas fa-chevron-right text-[8px] text-gray-600"></i>}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Composition */}
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem]">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-rail-accent mb-8">Rake Composition</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {Object.entries(train.composition).map(([key, val]) => (
                                <div key={key} className="flex justify-between border-b border-white/5 pb-2 text-xs">
                                    <span className="uppercase text-gray-500 font-bold">{key}</span>
                                    <span className="text-rail-accent font-black">{val} Coaches</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 pt-12 border-t border-white/10">
                        <CommentSection docId={train.id} type="reviews" />
                    </div>
                </div>

                {/* Fares Sidebar */}
                <div className="space-y-8">
                    <div className="bg-rail-accent p-10 rounded-[4rem] text-white shadow-2xl sticky top-32">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-80">Verified Fares</h3>
                        <div className="space-y-6">
                            {train.fares.map((f, i) => (
                                <div key={i} className="flex justify-between items-end border-b border-white/10 pb-4">
                                    <span className="font-bold text-sm uppercase">{f.class}</span>
                                    <span className="font-black italic text-2xl">{f.price}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="w-full bg-white text-rail-accent py-5 rounded-3xl mt-12 font-black uppercase italic tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedTrainId={train.id} />
        </main>
    );
}