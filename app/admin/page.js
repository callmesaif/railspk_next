"use client";
import { useState, useEffect } from 'react';
import { db, auth, storage } from '@/lib/firebase';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
    const [imageFile, setImageFile] = useState(null);
    const [existingImages, setExistingImages] = useState([]);

    // Polls State
    const [polls, setPolls] = useState([]);
    const [pollEditId, setPollEditId] = useState(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState('');

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

    const handlePostBroadcast = async (e) => {
        e.preventDefault();
        setStatus(editId ? 'Updating Broadcast...' : 'Uploading & Deploying...');
        setIsUploading(true);

        try {
            let finalImageUrls = [...existingImages];

            if (imageFile) {
                const storageRef = ref(storage, `broadcasts/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
                finalImageUrls = [downloadURL];
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
            setStatus('Error in operation.'); 
        } finally {
            setIsUploading(false);
        }
    };

    const resetBroadcastForm = () => {
        setEditId(null); setTitle(''); setContent(''); setImageFile(null); setExistingImages([]);
        setTimeout(() => setStatus(''), 3000);
    };

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
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-background text-foreground font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Container */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#f2f0f4] dark:bg-[#2e2f33] p-6 md:p-8 rounded-[2.5rem] mb-12 shadow-sm gap-6">
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                        Command <span className="text-rail-accent">Center</span>
                    </h1>
                    
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-2 rounded-full border border-[#74777f]/10">
                        <button 
                            onClick={() => setActiveTab('updates')} 
                            className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'updates' ? 'bg-rail-accent text-white shadow-lg' : 'text-[#74777f] hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            Updates
                        </button>
                        <button 
                            onClick={() => setActiveTab('polls')} 
                            className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'polls' ? 'bg-rail-accent text-white shadow-lg' : 'text-[#74777f] hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            Polls
                        </button>
                        <div className="w-px h-6 bg-[#74777f]/20 mx-2"></div>
                        <button onClick={() => signOut(auth)} className="px-5 py-3 text-[10px] font-bold uppercase text-red-500 hover:bg-red-500/10 rounded-full transition-all">
                            <span className="material-symbols-rounded align-middle text-lg">logout</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#f2f0f4] dark:bg-[#2e2f33] border border-transparent p-8 md:p-12 rounded-[3rem] shadow-sm relative overflow-hidden">
                            {/* Status Badge */}
                            {status && (
                                <div className="absolute top-0 inset-x-0 bg-rail-accent text-white text-[10px] font-bold uppercase py-2 text-center animate-m3">
                                    {status}
                                </div>
                            )}

                            <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-rail-accent mb-10">
                                <span className="material-symbols-rounded">{activeTab === 'updates' ? 'campaign' : 'quiz'}</span>
                                {editId || pollEditId ? "Modify Entry" : `New ${activeTab === 'updates' ? 'Broadcast' : 'Poll'}`}
                            </h2>
                            
                            {activeTab === 'updates' ? (
                                <form onSubmit={handlePostBroadcast} className="space-y-6">
                                    <input 
                                        type="text" 
                                        placeholder="Post Title" 
                                        className="w-full bg-white dark:bg-[#1b1b1f] p-5 rounded-2xl outline-none focus:ring-2 focus:ring-rail-accent transition-all text-sm font-bold shadow-sm" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        required 
                                    />
                                    <textarea 
                                        placeholder="Write your broadcast content..." 
                                        className="w-full bg-white dark:bg-[#1b1b1f] p-6 rounded-[2rem] outline-none focus:ring-2 focus:ring-rail-accent transition-all text-sm font-medium h-56 resize-none shadow-sm" 
                                        value={content} 
                                        onChange={(e) => setContent(e.target.value)} 
                                        required
                                    ></textarea>
                                    
                                    {/* M3 Style Upload Box */}
                                    <div className="bg-white/40 dark:bg-black/20 border-2 border-dashed border-[#74777f]/20 p-10 rounded-[2.5rem] text-center hover:border-rail-accent transition-all group">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            className="hidden" 
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${imageFile ? 'bg-green-500 text-white' : 'bg-rail-accent/10 text-rail-accent group-hover:bg-rail-accent group-hover:text-white'}`}>
                                                <span className="material-symbols-rounded text-3xl">
                                                    {imageFile ? 'check_circle' : 'add_a_photo'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#1b1b1f] dark:text-white">
                                                    {imageFile ? imageFile.name : "Select Device Image"}
                                                </p>
                                                <p className="text-[9px] text-[#74777f] uppercase mt-1">Recommended: 1280x720 (WEBP/PNG)</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button 
                                            disabled={isUploading}
                                            className={`flex-1 flex items-center justify-center gap-3 ${isUploading ? 'bg-gray-400' : 'bg-rail-accent'} text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all`}
                                        >
                                            <span className="material-symbols-rounded">{editId ? 'save' : 'rocket_launch'}</span>
                                            {isUploading ? 'Processing...' : (editId ? 'Update Broadcast' : 'Deploy Broadcast')}
                                        </button>
                                        {editId && (
                                            <button type="button" onClick={resetBroadcastForm} className="px-8 bg-[#e3e2e6] dark:bg-[#44474e] rounded-full font-bold uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleCreatePoll} className="space-y-6">
                                    <input 
                                        type="text" 
                                        placeholder="What is your question?" 
                                        className="w-full bg-white dark:bg-[#1b1b1f] p-5 rounded-2xl outline-none focus:ring-2 focus:ring-rail-accent text-sm font-bold shadow-sm" 
                                        value={pollQuestion} 
                                        onChange={(e) => setPollQuestion(e.target.value)} 
                                        required 
                                    />
                                    <div className="relative">
                                        <span className="material-symbols-rounded absolute left-5 top-5 text-rail-accent text-lg">list</span>
                                        <input 
                                            type="text" 
                                            placeholder="Options (e.g. Yes, No, Maybe)" 
                                            className="w-full bg-white dark:bg-[#1b1b1f] p-5 pl-14 rounded-2xl outline-none focus:ring-2 focus:ring-rail-accent text-sm font-bold shadow-sm" 
                                            value={pollOptions} 
                                            onChange={(e) => setPollOptions(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button className="flex-1 flex items-center justify-center gap-3 bg-rail-accent text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                            <span className="material-symbols-rounded">poll</span>
                                            {pollEditId ? 'Update Live Poll' : 'Activate Live Poll'}
                                        </button>
                                        {pollEditId && (
                                            <button type="button" onClick={resetPollForm} className="px-8 bg-[#e3e2e6] dark:bg-[#44474e] rounded-full font-bold uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Manage Items Container */}
                    <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
                        <div className="sticky top-0 bg-background/80 backdrop-blur-md pb-4 z-10">
                            <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#74777f] px-2">
                                <span className="material-symbols-rounded text-sm">settings_suggest</span>
                                Management Archive
                            </h3>
                        </div>

                        {(activeTab === 'updates' ? updates : polls).map((item) => (
                            <div key={item.id} className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-6 rounded-[2rem] border border-transparent hover:border-rail-accent/20 transition-all group shadow-sm">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="w-10 h-10 bg-white dark:bg-[#1b1b1f] rounded-xl flex items-center justify-center text-rail-accent shadow-sm">
                                        <span className="material-symbols-rounded text-xl">
                                            {activeTab === 'updates' ? 'article' : 'how_to_vote'}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold uppercase italic leading-tight flex-grow pt-1">
                                        {activeTab === 'updates' ? item.title : item.question}
                                    </h4>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-[#74777f]/10">
                                    <button 
                                        onClick={() => {
                                            if (activeTab === 'updates') {
                                                setEditId(item.id); setTitle(item.title); setContent(item.content); setExistingImages(item.imageUrls || []);
                                            } else {
                                                setPollEditId(item.id); setPollQuestion(item.question); setPollOptions(item.options?.map(o => o.text).join(', ') || '');
                                            }
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="flex items-center gap-2 text-rail-accent text-[10px] font-bold uppercase tracking-widest hover:bg-rail-accent/10 px-4 py-2 rounded-full transition-all"
                                    >
                                        <span className="material-symbols-rounded text-sm">edit</span>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteItem(activeTab, item.id)} 
                                        className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 px-4 py-2 rounded-full transition-all"
                                    >
                                        <span className="material-symbols-rounded text-sm">delete</span>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}