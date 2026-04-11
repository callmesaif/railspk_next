"use client";
import { useState, useEffect } from 'react';
import { db, auth, storage } from '@/lib/firebase'; // storage add kiya gaya
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage functions
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('updates');
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    // Updates State
    const [updates, setUpdates] = useState([]);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null); // File state
    const [existingImages, setExistingImages] = useState([]); // Edit ke liye

    // Polls State
    const [polls, setPolls] = useState([]);
    const [pollEditId, setPollEditId] = useState(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState('');

    // 1. Auth Guard & Data Fetching
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) router.push('/admin/login');
        });

        const qUpdates = query(collection(db, "artifacts/railspk-official-1de54/public/data/updates"), orderBy("timestamp", "desc"));
        const unsubUpdates = onSnapshot(qUpdates, (snap) => {
            setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const qPolls = query(collection(db, "artifacts/railspk-official-1de54/public/data/polls"), orderBy("timestamp", "desc"));
        const unsubPolls = onSnapshot(qPolls, (snap) => {
            setPolls(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubAuth(); unsubUpdates(); unsubPolls(); };
    }, [router]);

    // 2. Broadcast Handlers with Image Upload
    const handlePostBroadcast = async (e) => {
        e.preventDefault();
        setStatus(editId ? 'Updating Broadcast...' : 'Uploading & Deploying...');
        setIsUploading(true);

        try {
            let finalImageUrls = [...existingImages];

            // Agar nayi file select ki hai to upload karein
            if (imageFile) {
                const storageRef = ref(storage, `broadcasts/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
                finalImageUrls = [downloadURL]; // Filhal single image support
            }

            const data = { 
                title, 
                content, 
                imageUrls: finalImageUrls,
                lastUpdated: serverTimestamp() 
            };

            if (editId) {
                await updateDoc(doc(db, "artifacts/railspk-official-1de54/public/data/updates", editId), data);
                setStatus('Broadcast Updated! ✅');
            } else {
                await addDoc(collection(db, "artifacts/railspk-official-1de54/public/data/updates"), {
                    ...data,
                    timestamp: serverTimestamp(),
                    reactions: { heart: 0, surprised: 0 }
                });
                setStatus('Broadcast Live! 🚀');
            }
            resetBroadcastForm();
        } catch (err) { 
            console.error(err);
            setStatus('Error: Upload failed or Firestore issue.'); 
        } finally {
            setIsUploading(false);
        }
    };

    const resetBroadcastForm = () => {
        setEditId(null); setTitle(''); setContent(''); setImageFile(null); setExistingImages([]);
        setTimeout(() => setStatus(''), 3000);
    };

    // 3. Poll Handlers
    const handleCreatePoll = async (e) => {
        e.preventDefault();
        setStatus(pollEditId ? 'Updating Poll...' : 'Activating Poll...');
        try {
            const optionsArray = pollOptions.split(',').map(opt => ({ 
                text: opt.trim(), 
                votes: 0 
            }));

            const data = { question: pollQuestion, options: optionsArray };

            if (pollEditId) {
                await updateDoc(doc(db, "artifacts/railspk-official-1de54/public/data/polls", pollEditId), data);
                setStatus('Poll Updated! ✅');
            } else {
                await addDoc(collection(db, "artifacts/railspk-official-1de54/public/data/polls"), {
                    ...data,
                    timestamp: serverTimestamp(),
                    active: true
                });
                setStatus('Poll is now Live! 🗳️');
            }
            resetPollForm();
        } catch (err) { setStatus('Error in poll operation.'); }
    };

    const resetPollForm = () => {
        setPollEditId(null); setPollQuestion(''); setPollOptions('');
        setTimeout(() => setStatus(''), 3000);
    };

    const deleteItem = async (col, id) => {
        if (confirm("Are you sure? This cannot be undone.")) {
            await deleteDoc(doc(db, `artifacts/railspk-official-1de54/public/data/${col}`, id));
            setStatus('Item Deleted.');
        }
    };

    return (
        <section className="min-h-screen pt-32 pb-20 bg-rail-dark text-white font-sans">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Command <span className="text-rail-accent">Center</span></h1>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                        <button onClick={() => setActiveTab('updates')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'updates' ? 'bg-rail-accent text-white' : 'text-gray-500'}`}>Updates</button>
                        <button onClick={() => setActiveTab('polls')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'polls' ? 'bg-rail-accent text-white' : 'text-gray-500'}`}>Polls</button>
                        <button onClick={() => signOut(auth)} className="px-6 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition">Logout</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3.5rem] backdrop-blur-xl">
                            <p className="text-rail-accent font-black text-[10px] uppercase mb-6 tracking-widest">
                                {status || (editId || pollEditId ? "Editing Mode" : "New Entry Mode")}
                            </p>
                            
                            {activeTab === 'updates' ? (
                                <form onSubmit={handlePostBroadcast} className="space-y-6">
                                    <input type="text" placeholder="Post Title" className="w-full bg-rail-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-rail-accent text-sm font-bold" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    <textarea placeholder="Description..." className="w-full bg-rail-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-rail-accent text-sm h-48" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                                    
                                    {/* Local File Upload Box */}
                                    <div className="border-2 border-dashed border-white/10 p-8 rounded-3xl text-center bg-rail-dark/50 group hover:border-rail-accent transition-all">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            className="hidden" 
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                            <i className={`fas ${imageFile ? 'fa-check-circle text-green-500' : 'fa-cloud-upload-alt text-rail-accent'} text-3xl mb-3`}></i>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">
                                                {imageFile ? imageFile.name : "Select Image from Local Device"}
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex gap-4">
                                        <button 
                                            disabled={isUploading}
                                            className={`flex-1 ${isUploading ? 'bg-gray-600' : 'bg-rail-accent'} py-5 rounded-2xl font-black uppercase italic tracking-widest shadow-xl transition active:scale-95`}
                                        >
                                            {isUploading ? 'Uploading...' : (editId ? 'Update Broadcast' : 'Deploy to Community')}
                                        </button>
                                        {editId && <button type="button" onClick={resetBroadcastForm} className="px-8 bg-gray-800 rounded-2xl font-black uppercase text-[10px]">Cancel</button>}
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleCreatePoll} className="space-y-6">
                                    <input type="text" placeholder="Poll Question" className="w-full bg-rail-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-rail-accent text-sm font-bold" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} required />
                                    <input type="text" placeholder="Options (Comma separated)" className="w-full bg-rail-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-rail-accent text-sm font-bold" value={pollOptions} onChange={(e) => setPollOptions(e.target.value)} required />
                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-rail-accent py-5 rounded-2xl font-black uppercase italic tracking-widest shadow-xl transition">
                                            {pollEditId ? 'Update Poll' : 'Launch Live Poll'}
                                        </button>
                                        {pollEditId && <button type="button" onClick={resetPollForm} className="px-8 bg-gray-800 rounded-2xl font-black uppercase text-[10px]">Cancel</button>}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Manage Items */}
                    <div className="space-y-6 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 px-2">Manage {activeTab}</h3>
                        {(activeTab === 'updates' ? updates : polls).map((item) => (
                            <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] hover:border-white/10 transition group">
                                <h4 className="text-xs font-bold uppercase truncate mb-3">{activeTab === 'updates' ? item.title : item.question}</h4>
                                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                    <button 
                                        onClick={() => {
                                            if (activeTab === 'updates') {
                                                setEditId(item.id); setTitle(item.title); setContent(item.content); setExistingImages(item.imageUrls || []);
                                            } else {
                                                setPollEditId(item.id); setPollQuestion(item.question); setPollOptions(item.options?.map(o => o.text).join(', ') || '');
                                            }
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-rail-accent text-[9px] font-black uppercase tracking-widest hover:underline"
                                    >Edit</button>
                                    <button onClick={() => deleteItem(activeTab, item.id)} className="text-red-500 text-[9px] font-black uppercase tracking-widest hover:underline">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}