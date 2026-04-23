"use client";
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
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

// Payload Optimization: CommentSection ko tabhi load karein jab zaroorat ho
const CommentSection = dynamic(() => import('@/components/Comments'), {
    loading: () => <p className="text-[10px] font-bold uppercase p-4 text-[#1b1b1f] dark:text-[#e3e2e6]">Loading Discussion...</p>,
    ssr: false 
});

const formatContent = (text) => {
    if (!text) return "";
    let formatted = text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-rail-accent font-black hover:underline break-all transition-all">${url}</a>`;
    });
    formatted = formatted.replace(/#(\w+)/g, '<span class="text-rail-accent font-bold">#$1</span>');
    formatted = formatted.replace(/^\* (.*$)/gim, '<div class="flex items-start gap-2 mb-1"><span class="text-rail-accent">•</span><span>$1</span></div>');
    return formatted.replace(/\n/g, '<br />');
};

export default function CommunityPage() {
    const [updates, setUpdates] = useState([]);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); 

    useEffect(() => {
        const init = async () => {
            try {
                await signInAnonymously(auth);
                const qUpdates = query(collection(db, "artifacts/railspk-official-1de54/public/data/updates"), orderBy("timestamp", "desc"), limit(10));
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

    const handleReaction = useCallback(async (id, type) => {
        try {
            const ref = doc(db, "artifacts/railspk-official-1de54/public/data/updates", id);
            await updateDoc(ref, { [`reactions.${type}`]: increment(1) });
        } catch (error) { console.error(error); }
    }, []);

    const castVote = useCallback(async (pollId, optionIndex, currentOptions) => {
        if (!auth.currentUser) return;
        try {
            const ref = doc(db, "artifacts/railspk-official-1de54/public/data/polls", pollId);
            const updated = [...currentOptions];
            updated[optionIndex].votes = (updated[optionIndex].votes || 0) + 1;
            await updateDoc(ref, { options: updated });
        } catch (error) { console.error(error); }
    }, []);

    return (
        <section className="min-h-screen pt-32 pb-20 bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-center mb-20">
                    RAILWAY <span className="text-rail-accent">CLOUD</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Updates Column */}
                    <div className="space-y-10">
                        {/* Contrast Fix: text-[#74777f] ko text-[#44474e] mein badla gaya hai */}
                        <h2 className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#44474e] dark:text-[#c4c6cf] px-4">
                            <span className="material-symbols-rounded text-rail-accent">campaign</span> Official Broadcasts
                        </h2>
                        
                        {updates.map((update, index) => (
                            <div key={update.id} className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-8 rounded-[2.5rem] border border-transparent shadow-sm">
                                {update.imageUrls?.length > 0 && (
                                    <div className={`grid gap-3 mb-6 ${update.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        {update.imageUrls.map((url, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setSelectedImage(url)}
                                                className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-background cursor-zoom-in group"
                                            >
                                                {/* Payload Optimization: Specific sizes add kiye gaye hain */}
                                                <Image 
                                                    src={url} 
                                                    alt={update.title || "Railway Update"} 
                                                    fill 
                                                    sizes="(max-width: 768px) 100vw, 450px"
                                                    priority={index === 0}
                                                    className="object-cover group-hover:scale-105 transition duration-500" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <h3 className="text-2xl font-black uppercase italic mb-4 leading-tight">{update.title}</h3>
                                {/* Contrast Fix: Content text ko dark kiya gaya hai */}
                                <div 
                                    className="text-[#1b1b1f] dark:text-[#e3e2e6] text-sm mb-8 italic leading-relaxed" 
                                    dangerouslySetInnerHTML={{ __html: formatContent(update.content) }} 
                                />
                                
                                <div className="flex gap-3 pb-8 border-b border-[#44474e]/10">
                                    <button 
                                        onClick={() => handleReaction(update.id, 'heart')} 
                                        aria-label="React with Heart"
                                        className="flex items-center gap-2 bg-white dark:bg-[#1b1b1f] px-5 py-2.5 rounded-full hover:bg-rail-accent/10 transition shadow-sm active:scale-95"
                                    >
                                        <span className="text-sm">❤️</span> <span className="text-[10px] font-bold text-[#1b1b1f] dark:text-[#e3e2e6]">{update.reactions?.heart || 0}</span>
                                    </button>
                                </div>

                                <div className="pt-6">
                                    {activeCommentId === update.id ? (
                                        <CommentSection docId={update.id} type="updates" />
                                    ) : (
                                        <button 
                                            onClick={() => setActiveCommentId(update.id)} 
                                            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-rail-accent px-4 py-2 hover:bg-rail-accent/5 rounded-full transition"
                                        >
                                            <span className="material-symbols-rounded text-lg">chat_bubble</span>
                                            Show Discussion
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Polls Column */}
                    <div className="space-y-10">
                        <h2 className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#44474e] dark:text-[#c4c6cf] px-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute h-full w-full rounded-full bg-rail-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rail-accent"></span>
                            </span>
                            Live Polls
                        </h2>

                        {polls.map(poll => {
                            const totalVotes = poll.options?.reduce((acc, opt) => acc + (opt.votes || 0), 0) || 0;
                            return (
                                <div key={poll.id} className="bg-white dark:bg-[#2e2f33] p-10 rounded-[2.5rem] border border-[#44474e]/10 shadow-md">
                                    <h3 className="text-xl font-black italic uppercase mb-10 flex items-start gap-3">
                                        <span className="material-symbols-rounded text-rail-accent">quiz</span>
                                        {poll.question}
                                    </h3>
                                    <div className="space-y-6">
                                        {poll.options?.map((opt, idx) => {
                                            const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                            return (
                                                <div 
                                                    key={idx} 
                                                    className="cursor-pointer group" 
                                                    role="button"
                                                    aria-label={`Vote for ${opt.text}`}
                                                    onClick={() => castVote(poll.id, idx, poll.options)}
                                                >
                                                    <div className="flex justify-between text-[11px] font-bold uppercase mb-3 px-1 text-[#1b1b1f] dark:text-[#e3e2e6]">
                                                        <span>{opt.text}</span>
                                                        <span className="text-rail-accent">{percent}%</span>
                                                    </div>
                                                    <div className="h-4 bg-[#f2f0f4] dark:bg-[#1b1b1f] rounded-full overflow-hidden p-0.5">
                                                        <div className="h-full bg-rail-accent rounded-full transition-all duration-1000 shadow-sm shadow-rail-accent/20" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-10 flex items-center gap-2 px-1">
                                        <span className="material-symbols-rounded text-sm text-[#44474e] dark:text-[#c4c6cf]">group</span>
                                        <p className="text-[9px] font-bold text-[#44474e] dark:text-[#c4c6cf] uppercase tracking-widest">{totalVotes} Total Votes</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}