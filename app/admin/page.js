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
    limit,
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

    // --- State Management ---
    const [updates, setUpdates] = useState([]);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [existingImages, setExistingImages] = useState([]);

    const [polls, setPolls] = useState([]);
    const [pollEditId, setPollEditId] = useState(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState('');

    const [visits, setVisits] = useState([]);

    // --- Real-time Data Listeners ---
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) router.push('/admin/login');
        });

        // Listen for Broadcast Updates
        const qUpdates = query(collection(db, "artifacts/railspk-official-1de54/public/data/updates"), orderBy("timestamp", "desc"));
        const unsubUpdates = onSnapshot(qUpdates, (snap) => {
            setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // Listen for Polls
        const qPolls = query(collection(db, "artifacts/railspk-official-1de54/public/data/polls"), orderBy("timestamp", "desc"));
        const unsubPolls = onSnapshot(qPolls, (snap) => {
            setPolls(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // Listen for Analytics (Last 150 visits)
        const qAnalytics = query(collection(db, "analytics"), orderBy("timestamp", "desc"), limit(150));
        const unsubAnalytics = onSnapshot(qAnalytics, (snap) => {
            setVisits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubAuth(); unsubUpdates(); unsubPolls(); unsubAnalytics(); };
    }, [router]);

    // --- Handlers ---
    const handlePostBroadcast = async (e) => {
        e.preventDefault();
        setStatus(editId ? 'Updating Station Broadcast...' : 'Deploying to Cloud...');
        setIsUploading(true);
        try {
            let finalImageUrls = [...existingImages];
            if (imageFile) {
                const storageRef = ref(storage, `broadcasts/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
                finalImageUrls = [downloadURL];
            }
            const data = { title, content, imageUrls: finalImageUrls, lastUpdated: serverTimestamp() };
            if (editId) {
                await updateDoc(doc(db, "artifacts/railspk-official-1de54/public/data/updates", editId), data);
                setStatus('Broadcast Successfully Updated! ✅');
            } else {
                await addDoc(collection(db, "artifacts/railspk-official-1de54/public/data/updates"), {
                    ...data, timestamp: serverTimestamp(), reactions: { heart: 0, thumbs: 0 }
                });
                setStatus('New Broadcast is now Live! 🚀');
            }
            resetBroadcastForm();
        } catch (err) { setStatus('System Error. Check Console.'); } finally { setIsUploading(false); }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        setStatus(pollEditId ? 'Updating Poll...' : 'Activating Poll...');
        try {
            const optionsArray = pollOptions.split(',').map(opt => ({ text: opt.trim(), votes: 0 }));
            const data = { question: pollQuestion, options: optionsArray };
            if (pollEditId) {
                await updateDoc(doc(db, "artifacts/railspk-official-1de54/public/data/polls", pollEditId), data);
                setStatus('Poll Updated! ✅');
            } else {
                await addDoc(collection(db, "artifacts/railspk-official-1de54/public/data/polls"), {
                    ...data, timestamp: serverTimestamp(), active: true
                });
                setStatus('Poll is now Live! 🗳️');
            }
            resetPollForm();
        } catch (err) { setStatus('Error in poll operation.'); }
    };

    const resetBroadcastForm = () => { setEditId(null); setTitle(''); setContent(''); setImageFile(null); setExistingImages([]); setTimeout(() => setStatus(''), 3000); };
    const resetPollForm = () => { setPollEditId(null); setPollQuestion(''); setPollOptions(''); setTimeout(() => setStatus(''), 3000); };
    
    const deleteItem = async (col, id) => {
        if (confirm("Confirm Deletion? This will remove it from the Digital Legacy.")) {
            await deleteDoc(doc(db, `artifacts/railspk-official-1de54/public/data/${col}`, id));
            setStatus('Record Deleted.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-background text-foreground font-sans selection:bg-rail-accent selection:text-white">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#f2f0f4] dark:bg-[#2e2f33] p-8 rounded-[3rem] mb-12 shadow-sm gap-6 border border-black/5 dark:border-white/5">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                            COMMAND <span className="text-rail-accent">CENTER</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#74777f]">Operations Control Room</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-3 bg-white/40 dark:bg-black/20 p-2 rounded-full border border-[#74777f]/10 backdrop-blur-md">
                        {['updates', 'polls', 'analytics'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)} 
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab ? 'bg-rail-accent text-white shadow-xl scale-105' : 'text-[#74777f] hover:text-rail-accent'}`}
                            >
                                {tab}
                            </button>
                        ))}
                        <div className="w-[1px] h-6 bg-[#74777f]/20 mx-2 hidden md:block"></div>
                        <button onClick={() => signOut(auth)} className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-full transition-all">
                            <span className="material-symbols-rounded text-xl font-bold">power_settings_new</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Interaction Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-8 md:p-14 rounded-[3.5rem] shadow-sm relative overflow-hidden min-h-[600px] border border-black/5 dark:border-white/5">
                            
                            {status && (
                                <div className="absolute top-0 inset-x-0 bg-rail-accent text-white text-[10px] font-black uppercase py-3 text-center animate-m3 z-50 tracking-[0.2em]">
                                    {status}
                                </div>
                            )}

                            {activeTab === 'analytics' ? (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-rail-accent">
                                            <span className="material-symbols-rounded">monitoring</span> Traffic Insights
                                        </h2>
                                        <span className="text-[10px] font-bold uppercase text-[#74777f] animate-pulse">Live Stream Active</span>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Total Page Hits', val: visits.length, icon: 'analytics' },
                                            { label: 'Unique Sessions', val: new Set(visits.map(v => v.ip)).size, icon: 'fingerprint' },
                                            { label: 'Direct Entry', val: visits.filter(v => v.referrer === 'direct').length, icon: 'login' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white dark:bg-[#1b1b1f] p-8 rounded-[2.5rem] shadow-sm group hover:border-rail-accent/30 border border-transparent transition-all">
                                                <span className="material-symbols-rounded text-rail-accent mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                                                <p className="text-[9px] font-black uppercase text-[#74777f] tracking-widest mb-1">{stat.label}</p>
                                                <p className="text-4xl font-black italic">{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Analytics Table */}
                                    <div className="bg-white dark:bg-[#1b1b1f] rounded-[2.5rem] overflow-hidden shadow-inner p-2">
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            <table className="w-full text-left text-[11px]">
                                                <thead className="sticky top-0 bg-white dark:bg-[#1b1b1f] z-10">
                                                    <tr className="text-[#74777f] uppercase tracking-widest font-black border-b border-[#74777f]/10">
                                                        <th className="py-5 px-6">Timestamp</th>
                                                        <th className="py-5 px-6">Source IP</th>
                                                        <th className="py-5 px-6">Path</th>
                                                        <th className="py-5 px-6">Platform</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#74777f]/5">
                                                    {visits.map((v) => (
                                                        <tr key={v.id} className="hover:bg-rail-accent/[0.03] transition-colors group">
                                                            <td className="py-4 px-6 font-medium opacity-60 group-hover:opacity-100 italic">{v.timestamp?.toDate().toLocaleString() || 'Syncing...'}</td>
                                                            <td className="py-4 px-6 font-black text-rail-accent tracking-tighter">{v.ip}</td>
                                                            <td className="py-4 px-6"><span className="bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold">{v.path}</span></td>
                                                            <td className="py-4 px-6 italic opacity-50">{v.platform || 'Desktop/Unknown'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'updates' ? (
                                <form onSubmit={handlePostBroadcast} className="space-y-8 animate-fade-in">
                                    <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-rail-accent">
                                        <span className="material-symbols-rounded">campaign</span> {editId ? "Modify Signal" : "New Broadcast"}
                                    </h2>
                                    <input type="text" placeholder="Entry Title (e.g. Schedule Update)" className="w-full bg-white dark:bg-[#1b1b1f] p-6 rounded-3xl outline-none focus:ring-2 focus:ring-rail-accent transition-all text-sm font-black shadow-sm" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    <textarea placeholder="Station report or news content..." className="w-full bg-white dark:bg-[#1b1b1f] p-8 rounded-[2.5rem] outline-none focus:ring-2 focus:ring-rail-accent transition-all text-sm font-medium h-64 resize-none shadow-sm italic leading-relaxed" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                                    
                                    <div className="bg-white/40 dark:bg-black/20 border-2 border-dashed border-[#74777f]/20 p-12 rounded-[3rem] text-center hover:border-rail-accent transition-all group cursor-pointer relative">
                                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" id="file-upload" />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${imageFile ? 'bg-green-500 text-white shadow-lg' : 'bg-rail-accent/10 text-rail-accent group-hover:bg-rail-accent group-hover:text-white'}`}>
                                                <span className="material-symbols-rounded text-4xl">{imageFile ? 'verified' : 'add_photo_alternate'}</span>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#1b1b1f] dark:text-white">{imageFile ? imageFile.name : "Attach Visual Media"}</p>
                                        </label>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button disabled={isUploading} className={`flex-1 flex items-center justify-center gap-3 ${isUploading ? 'bg-gray-400 animate-pulse' : 'bg-rail-accent'} text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all`}>
                                            <span className="material-symbols-rounded text-lg">{editId ? 'save_as' : 'send'}</span>
                                            {isUploading ? 'TRANSMITTING...' : (editId ? 'COMMIT CHANGES' : 'PUSH TO CLOUD')}
                                        </button>
                                        {editId && <button type="button" onClick={resetBroadcastForm} className="px-10 bg-[#e3e2e6] dark:bg-[#44474e] rounded-full font-black uppercase text-[10px] tracking-widest">Abort</button>}
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleCreatePoll} className="space-y-8 animate-fade-in">
                                    <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-rail-accent">
                                        <span className="material-symbols-rounded">quiz</span> {pollEditId ? "Modify Inquiry" : "Activate Poll"}
                                    </h2>
                                    <input type="text" placeholder="Inquiry Question?" className="w-full bg-white dark:bg-[#1b1b1f] p-6 rounded-3xl outline-none focus:ring-2 focus:ring-rail-accent text-sm font-black shadow-sm" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} required />
                                    <div className="relative">
                                        <span className="material-symbols-rounded absolute left-6 top-6 text-rail-accent opacity-50">list_alt</span>
                                        <input type="text" placeholder="Options separated by commas (e.g. Yes, No, Maybe)" className="w-full bg-white dark:bg-[#1b1b1f] p-6 pl-16 rounded-3xl outline-none focus:ring-2 focus:ring-rail-accent text-sm font-black shadow-sm" value={pollOptions} onChange={(e) => setPollOptions(e.target.value)} required />
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-3 bg-rail-accent text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">
                                        <span className="material-symbols-rounded text-lg">ballot</span>
                                        {pollEditId ? 'UPDATE LIVE POLL' : 'LAUNCH LIVE POLL'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Digital Archive Management */}
                    <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
                        <div className="sticky top-0 bg-background/80 backdrop-blur-md pb-6 z-10 border-b border-[#74777f]/10 mb-6">
                            <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#74777f]">
                                <span className="material-symbols-rounded text-sm">history_edu</span> Active Logs
                            </h3>
                        </div>

                        {(activeTab === 'analytics' ? [] : (activeTab === 'updates' ? updates : polls)).map((item) => (
                            <div key={item.id} className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-7 rounded-[2.5rem] border border-transparent hover:border-rail-accent/30 transition-all group shadow-sm">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white dark:bg-[#1b1b1f] rounded-2xl flex-shrink-0 flex items-center justify-center text-rail-accent shadow-sm group-hover:bg-rail-accent group-hover:text-white transition-all duration-500">
                                        <span className="material-symbols-rounded text-xl">
                                            {activeTab === 'updates' ? 'article' : 'how_to_vote'}
                                        </span>
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase italic leading-tight flex-grow pt-2 line-clamp-2">
                                        {activeTab === 'updates' ? item.title : item.question}
                                    </h4>
                                </div>
                                <div className="flex justify-between items-center pt-5 border-t border-[#74777f]/10">
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
                                    >Edit Record</button>
                                    <button onClick={() => deleteItem(activeTab === 'updates' ? 'updates' : 'polls', item.id)} className="text-red-500/60 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-colors">Wipe</button>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'analytics' && (
                            <div className="p-8 text-center bg-[#f2f0f4] dark:bg-[#2e2f33] rounded-[2.5rem] italic opacity-50 border border-dashed border-[#74777f]/20">
                                <span className="material-symbols-rounded text-4xl mb-4 block">stream</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">System is tracking traffic in real-time. Check the main monitor for details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}