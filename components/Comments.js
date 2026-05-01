"use client";
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function CommentSection({ docId, type }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    // Categories for rating
    const [ratings, setRatings] = useState({ cleanliness: 5, punctuality: 5, food: 5, staff: 5 });

    useEffect(() => {
        const q = query(
            collection(db, `artifacts/railspk-official-1de54/public/data/${type}/${docId}/comments`),
            orderBy("timestamp", "desc")
        );
        return onSnapshot(q, (snap) => {
            setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }, [docId, type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        try {
            await addDoc(collection(db, `artifacts/railspk-official-1de54/public/data/${type}/${docId}/comments`), {
                text: newComment,
                ratings: ratings, // Saving numerical ratings
                timestamp: serverTimestamp(),
                user: auth.currentUser?.email || "Anonymous Railfan"
            });
            setNewComment("");
        } catch (err) { console.error("Error posting comment:", err); }
    };

    return (
        <div className="mt-8 pt-8 border-t border-[#74777f]/10">
            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-rail-accent mb-8 px-2">
                <span className="material-symbols-rounded text-sm">rate_review</span>
                Rate & Review
            </h4>
            
            <form onSubmit={handleSubmit} className="mb-10 px-2 space-y-6">
                {/* Star Selectors */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f2f0f4] dark:bg-[#2e2f33] p-6 rounded-[2rem]">
                    {Object.keys(ratings).map((cat) => (
                        <div key={cat} className="text-center">
                            <p className="text-[9px] font-bold uppercase mb-2 dark:text-[#a9abb1]">{cat}</p>
                            <select 
                                value={ratings[cat]} 
                                onChange={(e) => setRatings({...ratings, [cat]: parseInt(e.target.value)})}
                                className="bg-transparent font-black text-rail-accent outline-none cursor-pointer"
                            >
                                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} ★</option>)}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-[#1b1b1f] rounded-[1.5rem] p-1 border border-[#74777f]/20 focus-within:border-rail-accent transition-all">
                    <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your detailed review..."
                        className="w-full bg-transparent p-4 text-xs outline-none min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end p-2">
                        <button className="inline-flex items-center gap-2 bg-rail-accent text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all">
                            <span className="material-symbols-rounded text-sm">send</span>
                            Submit Review
                        </button>
                    </div>
                </div>
            </form>

            <div className="space-y-4">
                {comments.map(c => (
                    <div key={c.id} className="bg-white dark:bg-[#1b1b1f] p-5 rounded-[1.5rem] shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-rounded text-rail-accent">account_circle</span>
                                <p className="text-[10px] dark:text-[#a9abb1] font-bold uppercase">{c.user.split('@')[0]}</p>
                            </div>
                            {/* Display user's specific rating */}
                            <div className="flex gap-2">
                                {c.ratings && Object.entries(c.ratings).map(([key, val]) => (
                                    <span key={key} className="text-[8px] font-black bg-rail-accent/5 px-2 py-1 rounded-md text-rail-accent">
                                        {key.charAt(0).toUpperCase()}: {val}★
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-[#44474e] dark:text-[#c4c6cf] italic leading-relaxed pl-8">{c.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}