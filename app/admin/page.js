"use client";
import { useState, useEffect } from 'react';
import { db, auth, storage } from '@/lib/firebase';
import { 
    collection, addDoc, updateDoc, deleteDoc, doc, 
    onSnapshot, query, orderBy, limit, serverTimestamp, setDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { trainsData as staticTrains } from '@/lib/trains';

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
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const [polls, setPolls] = useState([]);
    const [pollEditId, setPollEditId] = useState(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState('');

    const [visits, setVisits] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [trains, setTrains] = useState([]);

    // --- Real-time Data Listeners ---
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) router.push('/admin/login');
        });

        // Fixed Parentheses in Listeners
        const unsubUpdates = onSnapshot(query(collection(db, "artifacts/railspk-official-1de54/public/data/updates"), orderBy("timestamp", "desc")), (snap) => {
            setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubPolls = onSnapshot(query(collection(db, "artifacts/railspk-official-1de54/public/data/polls"), orderBy("timestamp", "desc")), (snap) => {
            setPolls(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubAnalytics = onSnapshot(query(collection(db, "analytics"), orderBy("timestamp", "desc"), limit(150)), (snap) => {
            setVisits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubBookings = onSnapshot(query(collection(db, "booking_requests"), orderBy("timestamp", "desc")), (snap) => {
            setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubTrains = onSnapshot(collection(db, "trains"), (snap) => {
            setTrains(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubAuth(); unsubUpdates(); unsubPolls(); unsubAnalytics(); unsubBookings(); unsubTrains(); };
    }, [router]);

    // --- Handlers ---
    const handleFileChange = (e) => {
        if (e.target.files) {
            setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
        }
    };

    const removeNewFile = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
    };

    const removeExistingImage = (url) => {
        setExistingImages(existingImages.filter(img => img !== url));
    };

    const handlePostBroadcast = async (e) => {
        e.preventDefault();
        setStatus('Transmitting Media...');
        setIsUploading(true);

        try {
            let finalImageUrls = [...existingImages];

            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(async (file) => {
                    const storageRef = ref(storage, `broadcasts/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    return await getDownloadURL(snapshot.ref);
                });
                const newUrls = await Promise.all(uploadPromises);
                finalImageUrls = [...finalImageUrls, ...newUrls];
            }

            const data = { 
                title, 
                content, 
                imageUrls: finalImageUrls, 
                lastUpdated: serverTimestamp() 
            };

            if (editId) {
                await updateDoc(doc(db, "artifacts/railspk-official-1de54/public/data/updates", editId), data);
                setStatus('Signal Updated! ✅');
            } else {
                await addDoc(collection(db, "artifacts/railspk-official-1de54/public/data/updates"), {
                    ...data,
                    timestamp: serverTimestamp(),
                    reactions: { heart: 0, thumbs: 0 }
                });
                setStatus('Broadcast Live! 🚀');
            }
            resetBroadcastForm();
        } catch (err) { setStatus('Error.'); } finally { setIsUploading(false); }
    };

    const handleUpdateFare = async (trainId, fareIndex, newPrice) => {
        if (!newPrice) return;
        const train = trains.find(t => t.id === trainId);
        const updatedFares = [...train.fares];
        updatedFares[fareIndex].price = `Rs. ${newPrice.replace(/Rs\.\s*/g, '')}`;
        try {
            await updateDoc(doc(db, "trains", trainId), { fares: updatedFares });
            setStatus('Fare Updated! 💸');
            setTimeout(() => setStatus(''), 2000);
        } catch (e) { setStatus('Failed.'); }
    };

    const syncInitialData = async () => {
        if (!confirm("Proceed with Firebase Sync?")) return;
        setStatus('Syncing...');
        try {
            for (const train of staticTrains) { await setDoc(doc(db, "trains", train.id), train); }
            setStatus('Sync Done! ✅');
        } catch (e) { setStatus('Failed.'); }
        setTimeout(() => setStatus(''), 3000);
    };

    const updateBookingStatus = async (id, newStatus) => {
        await updateDoc(doc(db, "booking_requests", id), { status: newStatus });
        setStatus(`Booking ${newStatus}!`);
    };

    const resetBroadcastForm = () => {
        setEditId(null); setTitle(''); setContent(''); setImageFiles([]); setExistingImages([]);
        setTimeout(() => setStatus(''), 3000);
    };

    const deleteItem = async (col, id) => {
        if (confirm("Confirm Deletion?")) {
            const path = col === 'bookings' ? `booking_requests` : col === 'trains' ? 'trains' : `artifacts/railspk-official-1de54/public/data/${col}`;
            await deleteDoc(doc(db, path, id));
            setStatus('Removed.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-background text-foreground font-sans selection:bg-rail-accent">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#f2f0f4] dark:bg-[#2e2f33] p-8 rounded-[3rem] mb-12 shadow-sm gap-6 border border-black/5 dark:border-white/5">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">COMMAND <span className="text-rail-accent">CENTER</span></h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] dark:text-[#a9abb1]">Operations v4.5 Active</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3 bg-white/40 dark:bg-black/20 p-2 rounded-full backdrop-blur-md">
                        {['updates', 'bookings', 'trains', 'analytics'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab ? 'bg-rail-accent text-white shadow-xl scale-105' : 'dark:text-[#a9abb1] hover:text-rail-accent'}`}>
                                {tab}
                            </button>
                        ))}
                        <button onClick={() => signOut(auth)} className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-full transition-all"><span className="material-symbols-rounded">power_settings_new</span></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <div className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-8 md:p-14 rounded-[3.5rem] shadow-sm relative overflow-hidden min-h-[650px] border border-black/5 dark:border-white/5">
                            
                            {status && <div className="absolute top-0 inset-x-0 bg-rail-accent text-white text-[10px] font-black uppercase py-3 text-center z-50 tracking-[0.2em]">{status}</div>}

                            {activeTab === 'updates' ? (
                                <form onSubmit={handlePostBroadcast} className="space-y-8 animate-fade-in">
                                    <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-rail-accent">
                                        <span className="material-symbols-rounded">campaign</span> {editId ? "Modify Signal" : "New Multi-Image Broadcast"}
                                    </h2>
                                    <input type="text" placeholder="Entry Title" className="w-full bg-white dark:bg-[#1b1b1f] p-6 rounded-3xl outline-none focus:ring-2 focus:ring-rail-accent text-sm font-black shadow-sm" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    <textarea placeholder="Station report..." className="w-full bg-white dark:bg-[#1b1b1f] p-8 rounded-[2.5rem] outline-none focus:ring-2 focus:ring-rail-accent text-sm font-medium h-64 resize-none shadow-sm italic" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-white/40 dark:bg-black/20 border-2 border-dashed border-[#74777f]/20 p-12 rounded-[3rem] text-center hover:border-rail-accent transition-all group cursor-pointer relative">
                                            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-rail-accent/10 text-rail-accent group-hover:bg-rail-accent group-hover:text-white transition-all">
                                                    <span className="material-symbols-rounded text-4xl">add_photo_alternate</span>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#1b1b1f] dark:text-white">Attach Multiple Visuals</p>
                                            </label>
                                        </div>

                                        {imageFiles.length > 0 && (
                                            <div className="grid grid-cols-3 gap-4 p-4 bg-white/30 dark:bg-black/10 rounded-[2rem]">
                                                {imageFiles.map((file, i) => (
                                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10">
                                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                                                        <button type="button" onClick={() => removeNewFile(i)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <span className="material-symbols-rounded">delete</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {existingImages.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black uppercase dark:text-[#a9abb1] px-2">Currently on Cloud:</p>
                                                <div className="grid grid-cols-3 gap-4 p-4 bg-rail-accent/5 rounded-[2rem]">
                                                    {existingImages.map((url, i) => (
                                                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                                                            <img src={url} className="w-full h-full object-cover" alt="existing" />
                                                            <button type="button" onClick={() => removeExistingImage(url)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-black uppercase">Wipe</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button disabled={isUploading} className={`flex-1 flex items-center justify-center gap-3 ${isUploading ? 'bg-gray-400 animate-pulse' : 'bg-rail-accent'} text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all`}>
                                            {isUploading ? 'UPLOADING...' : (editId ? 'COMMIT CHANGES' : 'PUSH TO CLOUD')}
                                        </button>
                                        {editId && <button type="button" onClick={resetBroadcastForm} className="px-10 bg-[#e3e2e6] dark:bg-[#44474e] rounded-full font-black uppercase text-[10px] tracking-widest">Abort</button>}
                                    </div>
                                </form>
                            ) : activeTab === 'trains' ? (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-rail-accent"><span className="material-symbols-rounded">train</span> Train Data Manager</h2>
                                        <button onClick={syncInitialData} className="px-5 py-2 bg-rail-accent text-white text-[9px] font-black uppercase rounded-full">Sync Static Data</button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {trains.map((train) => (
                                            <div key={train.id} className="bg-white dark:bg-[#1b1b1f] p-8 rounded-[3rem] shadow-sm border border-black/5 hover:border-rail-accent/20 transition-all">
                                                <h3 className="text-2xl font-black italic uppercase leading-none mb-6">{train.name}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {train.fares.map((fare, fIdx) => (
                                                        <div key={fIdx} className="p-4 bg-[#f2f0f4] dark:bg-black/20 rounded-[1.5rem]">
                                                            <label className="text-[9px] font-black uppercase dark:text-[#a9abb1]">{fare.class}</label>
                                                            <input type="text" defaultValue={fare.price.replace(/[^\d]/g, '')} onBlur={(e) => handleUpdateFare(train.id, fIdx, e.target.value)} className="bg-white dark:bg-[#1b1b1f] w-full px-4 py-2 rounded-xl text-sm font-black outline-none mt-2 shadow-inner" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : activeTab === 'bookings' ? (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-rail-accent">Reservation Logs</h2>
                                    {bookings.map(b => (
                                        <div key={b.id} className="bg-white dark:bg-[#1b1b1f] p-6 rounded-[2.5rem] flex justify-between items-center border border-black/5 group">
                                            <div>
                                                <h4 className="font-black uppercase text-sm italic">{b.fullName}</h4>
                                                <p className="text-[9px] font-bold dark:text-[#a9abb1] uppercase">{b.trainName} • {b.class}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className={`p-2 rounded-full ${b.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-500'}`}><span className="material-symbols-rounded">check</span></button>
                                                <button onClick={() => deleteItem('bookings', b.id)} className="p-2 bg-red-500/10 text-red-500 rounded-full"><span className="material-symbols-rounded">delete</span></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : activeTab === 'analytics' ? (
                                <div className="space-y-10 animate-fade-in">
                                    <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-rail-accent">Traffic Insights</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Hits', val: visits.length },
                                            { label: 'Unique', val: new Set(visits.map(v => v.ip)).size },
                                            { label: 'Direct', val: visits.filter(v => v.referrer === 'direct').length }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white dark:bg-[#1b1b1f] p-8 rounded-[2.5rem] shadow-sm"><p className="text-[9px] font-black uppercase dark:text-[#a9abb1] mb-1">{stat.label}</p><p className="text-4xl font-black italic">{stat.val}</p></div>
                                        ))}
                                    </div>
                                    <div className="bg-white dark:bg-[#1b1b1f] rounded-[2.5rem] overflow-hidden p-2">
                                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                            <table className="w-full text-left text-[11px]">
                                                <tbody className="divide-y divide-[#74777f]/5">
                                                    {visits.map((v) => (
                                                        <tr key={v.id} className="hover:bg-rail-accent/[0.03] transition-colors"><td className="py-4 px-6 font-medium opacity-60">{v.timestamp?.toDate().toLocaleString()}</td><td className="py-4 px-6 font-black text-rail-accent">{v.ip}</td><td className="py-4 px-6 italic opacity-50">{v.path}</td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 dark:text-[#a9abb1] uppercase font-black text-xs tracking-widest italic opacity-50 italic animate-pulse">Monitoring Active...</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-8 rounded-[3rem] border border-black/5">
                            <h3 className="text-[10px] font-black uppercase tracking-widest dark:text-[#a9abb1] mb-6">Operations Hub</h3>
                            <div className="space-y-4 text-xs font-black">
                                <div className="flex justify-between items-center bg-white dark:bg-black/20 p-4 rounded-2xl"><span className="text-[9px] font-bold uppercase text-gray-500">Live Trains</span><span className="text-sm font-black text-rail-accent">{trains.length}</span></div>
                                <div className="flex justify-between items-center bg-white dark:bg-black/20 p-4 rounded-2xl"><span className="text-[9px] font-bold uppercase text-gray-500">Pending</span><span className="text-sm font-black text-orange-500">{bookings.filter(b => b.status === 'pending').length}</span></div>
                            </div>
                        </div>

                        {activeTab === 'updates' && updates.slice(0, 5).map(item => (
                            <div key={item.id} className="bg-[#f2f0f4] dark:bg-[#2e2f33] p-6 rounded-[2.5rem] hover:border-rail-accent/20 border border-transparent transition-all shadow-sm">
                                <h4 className="text-[10px] font-black uppercase italic leading-tight mb-4 line-clamp-1">{item.title}</h4>
                                <div className="flex justify-between items-center">
                                    <button onClick={() => { setEditId(item.id); setTitle(item.title); setContent(item.content); setExistingImages(item.imageUrls || []); setActiveTab('updates'); window.scrollTo(0,0); }} className="text-rail-accent text-[9px] font-black uppercase hover:underline">Edit</button>
                                    <button onClick={() => deleteItem('updates', item.id)} className="text-red-500/60 text-[9px] font-black uppercase hover:text-red-500">Wipe</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}