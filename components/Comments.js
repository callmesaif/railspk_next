"use client";
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function CommentSection({ docId, type }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        // Path example: artifacts/.../updates/POST_ID/comments
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
                timestamp: serverTimestamp(),
                user: auth.currentUser?.email || "Anonymous Railfan"
            });
            setNewComment("");
        } catch (err) { console.error("Error posting comment:", err); }
    };

    return (
        <div className="mt-12 pt-8 border-t border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-rail-accent mb-6">Discussion Hub</h4>
            
            <form onSubmit={handleSubmit} className="mb-8">
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-rail-accent"
                />
                <button className="mt-3 bg-rail-accent px-6 py-2 rounded-xl text-[10px] font-black uppercase">Post Comment</button>
            </form>

            <div className="space-y-4">
                {comments.map(c => (
                    <div key={c.id} className="bg-white/5 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-500 font-bold mb-1">{c.user}</p>
                        <p className="text-xs text-gray-300 italic">{c.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}