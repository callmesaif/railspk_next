"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

// 1. Formatting Logic: Links, Hashtags aur Bullets ko process karna
const formatContent = (text) => {
    if (!text) return "";
    
    // URLs ko clickable links mein badalna
    let formatted = text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-rail-accent font-black hover:underline break-all transition-all underline-offset-4">${url}</a>`;
    });

    // Hashtags ko clickable banana (Community page par redirect karega)
    formatted = formatted.replace(/#(\w+)/g, '<a href="/community" class="text-rail-accent font-bold hover:underline">#$1</a>');
    
    // Bullet points (Starting with *) ko stylish list mein badalna
    formatted = formatted.replace(/^\* (.*$)/gim, '<div class="flex items-start gap-3 mb-2 px-2"><span class="text-rail-accent text-xl leading-none">•</span><span class="text-foreground/90">$1</span></div>');
    
    // Line breaks handle karna
    return formatted.replace(/\n/g, '<br />');
};

export default function PostViewer() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // Image zoom/lightbox state

    useEffect(() => {
        const fetchPost = async () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            if (id) {
                try {
                    const docRef = doc(db, "artifacts/railspk-official-1de54/public/data/updates", id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = { id: docSnap.id, ...docSnap.data() };
                        setPost(data);
                        // Browser tab title update karna
                        document.title = `${data.title} | RAILSPK Official`;
                    }
                } catch (error) {
                    console.error("Post fetch error:", error);
                }
            }
            setLoading(false);
        };
        fetchPost();
    }, []);

    // Railway themed loading state
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <span className="material-symbols-rounded text-rail-accent text-4xl animate-spin">sync</span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/50 animate-pulse">Fetching Track Data...</p>
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
            <span className="material-symbols-rounded text-rail-accent text-6xl">train_broken</span>
            <p className="text-xl font-black italic uppercase text-foreground">Post Derailed (Not Found)</p>
            <Link href="/community" className="px-8 py-3 bg-rail-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Return to Terminal</Link>
        </div>
    );

    return (
        <section className="min-h-screen pt-32 pb-20 bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-6">
                
                {/* Back Button */}
                <Link href="/community" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rail-accent mb-12 hover:gap-4 transition-all group">
                    <span className="material-symbols-rounded text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span> 
                    Back to Cloud
                </Link>

                <div className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-8 md:p-14 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/5 transition-all duration-700 animate-fade-in">
                    
                    {/* Cinematic Image Section */}
                    {post.imageUrls?.map((url, i) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedImage(url)}
                            className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl cursor-zoom-in group border border-white/10"
                        >
                            <Image 
                                src={url} 
                                alt={post.title} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                priority={i === 0}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                    ))}
                    
                    {/* Post Content */}
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic mb-8 leading-tight tracking-tighter text-foreground">
                        {post.title}
                    </h1>
                    
                    <div 
                        className="text-base md:text-xl italic leading-relaxed mb-12 text-[#1b1b1f] dark:text-[#e3e2e6] space-y-4"
                        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                    />

                    {/* Post Meta (Optional footer for detailed view) */}
                    <div className="pt-10 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#74777f]">
                            Digital Record ID: <span className="text-rail-accent">{post.id.slice(0,8)}</span>
                        </p>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link Copied!");
                            }}
                            className="w-10 h-10 rounded-full bg-white dark:bg-black/20 flex items-center justify-center text-rail-accent hover:bg-rail-accent hover:text-white transition-all shadow-sm"
                        >
                            <span className="material-symbols-rounded text-lg">share</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- IMAGE LIGHTBOX (Zoom Overlay) --- */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative w-full h-full max-w-7xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <Image 
                            src={selectedImage} 
                            alt="Full Resolution Preview" 
                            fill 
                            className="object-contain" 
                        />
                        {/* Close Button */}
                        <button className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-rail-accent rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-2xl group">
                            <span className="material-symbols-rounded text-2xl group-hover:rotate-90 transition-transform">close</span>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}