"use client";
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase'; 
import { signInAnonymously } from 'firebase/auth'; 
import { 
    collection, 
    onSnapshot, 
    query, 
    orderBy, 
    limit, 
    doc, 
    updateDoc, 
    increment 
} from 'firebase/firestore';
import Image from 'next/image'; 
import CommentSection from '@/components/Comments';

export default function CommunityPage() {
    const [updates, setUpdates] = useState([]);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); 

    // 1. Updated Rich Text Logic (Links Enabled)
    const formatContent = (text) => {
        if (!text) return "";
        
        // Step A: Convert URLs (http/https) to clickable <a> tags
        let formatted = text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-rail-accent font-black hover:underline break-all transition-all">${url}</a>`;
        });

        // Step B: HashTags Logic
        formatted = formatted.replace(/#(\w+)/g, '<span class="text-rail-accent font-bold">#$1</span>');
        
        // Step C: Bullet Points Logic
        formatted = formatted.replace(/^\* (.*$)/gim, '<div class="flex items-start gap-2 mb-1"><span class="text-rail-accent">•</span><span>$1</span></div>');
        
        // Step D: Line Breaks
        return formatted.replace(/\n/g, '<br />');
    };

    useEffect(() => {
        const init = async () => {
            try {
                await signInAnonymously(auth);
                
                const qUpdates = query(
                    collection(db, "artifacts/railspk-official-1de54/public/data/updates"), 
                    orderBy("timestamp", "desc"),
                    limit(10)
                );
                const unsubUpdates = onSnapshot(qUpdates, (snap) => {
                    setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                    setLoading(false);
                });

                const qPolls = query(collection(db, "artifacts/railspk-official-1de54/public/data/polls"), orderBy("timestamp", "desc"));
                const unsubPolls = onSnapshot(qPolls, (snap) => {
                    setPolls(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                });

                return () => { unsubUpdates(); unsubPolls(); };
            } catch (err) { console.error(err); setLoading(false); }
        };
        init();
    }, []);

    const handleReaction = async (id, type) => {
        try {
            const ref = doc(db, "artifacts/railspk-official-1de54/public/data/updates", id);
            await updateDoc(ref, { [`reactions.${type}`]: increment(1) });
        } catch (error) { console.error(error); }
    };

    const castVote = async (pollId, optionIndex, currentOptions) => {
        if (!auth.currentUser) return;
        try {
            const ref = doc(db, "artifacts/railspk-official-1de54/public/data/polls", pollId);
            const updated = [...currentOptions];
            updated[optionIndex].votes = (updated[optionIndex].votes || 0) + 1;
            await updateDoc(ref, { options: updated });
        } catch (error) { console.error(error); }
    };

    return (
        <section className="min-h-screen pt-32 pb-20 bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-center mb-20">
                    RAILWAY <span className="text-rail-accent text-transparent bg-clip-text bg-gradient-to-r from-rail-accent to-blue-400 px-2">CLOUD</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-12">
                        <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-2">
                            <i className="fas fa-bullhorn text-rail-accent"></i> Official Broadcasts
                        </h4>
                        
                        {updates.map(update => (
                            <div key={update.id} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                                {update.imageUrls?.length > 0 && (
                                    <div className={`grid gap-4 mb-6 ${update.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        {update.imageUrls.map((url, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setSelectedImage(url)}
                                                className="relative aspect-video rounded-2xl overflow-hidden bg-rail-dark cursor-zoom-in group"
                                            >
                                                <Image src={url} alt="Railspk" fill className="object-cover group-hover:scale-105 transition duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <h3 className="text-2xl font-black uppercase italic mb-3 leading-tight">{update.title}</h3>
                                {/* Dangerously set HTML renders our formatted links */}
                                <div className="text-gray-400 text-sm mb-6 italic" dangerouslySetInnerHTML={{ __html: formatContent(update.content) }} />
                                
                                <div className="flex gap-4 pb-6 border-b border-white/5">
                                    <button onClick={() => handleReaction(update.id, 'heart')} className="flex items-center gap-2 bg-rail-dark px-4 py-2 rounded-full hover:bg-rail-accent/10 transition border border-white/5">
                                        <span>❤️</span> <span className="text-[10px] font-black">{update.reactions?.heart || 0}</span>
                                    </button>
                                    <button onClick={() => handleReaction(update.id, 'surprised')} className="flex items-center gap-2 bg-rail-dark px-4 py-2 rounded-full hover:bg-rail-accent/10 transition border border-white/5">
                                        <span>😮</span> <span className="text-[10px] font-black">{update.reactions?.surprised || 0}</span>
                                    </button>
                                </div>

                                <div className="pt-6">
                                    {activeCommentId === update.id ? (
                                        <CommentSection docId={update.id} type="updates" />
                                    ) : (
                                        <button onClick={() => setActiveCommentId(update.id)} className="text-[10px] font-black uppercase tracking-widest text-rail-accent">Show Comments</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-12">
                        <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-2">
                            <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-rail-accent opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rail-accent"></span></span>
                            Live Polls
                        </h4>

                        {polls.map(poll => {
                            const totalVotes = poll.options?.reduce((acc, opt) => acc + (opt.votes || 0), 0) || 0;
                            return (
                                <div key={poll.id} className="bg-white/5 p-10 rounded-[3rem] border-2 border-rail-accent/20">
                                    <h3 className="text-xl font-black italic uppercase mb-8">{poll.question}</h3>
                                    <div className="space-y-6">
                                        {poll.options?.map((opt, idx) => {
                                            const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                            return (
                                                <div key={idx} className="cursor-pointer group" onClick={() => castVote(poll.id, idx, poll.options)}>
                                                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                                                        <span>{opt.text}</span>
                                                        <span className="text-rail-accent">{percent}%</span>
                                                    </div>
                                                    <div className="h-4 bg-rail-dark rounded-full overflow-hidden border border-white/5">
                                                        <div className="h-full bg-rail-accent transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="mt-8 text-[8px] font-black text-gray-500 uppercase tracking-widest">{totalVotes} Total Votes</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative w-full max-w-6xl aspect-video">
                        <Image src={selectedImage} alt="Full Preview" fill className="object-contain" />
                        <button className="absolute top-0 right-0 m-4 text-white text-4xl font-light">&times;</button>
                    </div>
                </div>
            )}
        </section>
    );
}