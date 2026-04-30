"use client";
import { useState, useEffect } from 'react';
import { trainsData } from '@/lib/trains';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BookingModal({ isOpen, onClose, selectedTrainId }) {
    const [formData, setFormData] = useState({
        trainId: selectedTrainId || "",
        class: "",
        fullName: "",
        phone: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [pricing, setPricing] = useState({ fare: 0, commission: 250, total: 0 });
    
    const [recentBooking, setRecentBooking] = useState(0);
    const recentData = [
        "Ali from Karachi booked 3 seats (Green Line)",
        "Zainab from Lahore booked 2 seats (Karakoram)",
        "Usman from Multan booked 4 seats (Tezgam)",
        "Saad from Pindi booked 1 seat (Shalimar Exp)"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setRecentBooking((prev) => (prev + 1) % recentData.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (formData.trainId) {
            const train = trainsData.find(t => t.id === formData.trainId);
            if (train && train.fares) {
                setAvailableClasses(train.fares);
                setFormData(prev => ({ ...prev, class: train.fares[0].class }));
            }
        }
    }, [formData.trainId]);

    useEffect(() => {
        if (formData.trainId && formData.class) {
            const train = trainsData.find(t => t.id === formData.trainId);
            const selectedFare = train.fares.find(f => f.class === formData.class);
            if (selectedFare) {
                const baseFare = parseInt(selectedFare.price.replace(/[^\d]/g, '')) || 0;
                setPricing({ fare: baseFare, commission: 250, total: baseFare + 250 });
            }
        }
    }, [formData.trainId, formData.class]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const train = trainsData.find(t => t.id === formData.trainId);
        
        try {
            // 1. Save to Firestore first
            await addDoc(collection(db, "booking_requests"), {
                ...formData,
                trainName: train ? train.name : 'Unknown',
                totalFare: pricing.total,
                status: 'pending', // default status
                timestamp: serverTimestamp(),
            });

            // 2. Open WhatsApp
            const message = `Assalam-o-Alaikum! \n\n*NEW TICKET REQUEST*\n------------------------------\n*Name:* ${formData.fullName}\n*Train:* ${train ? train.name : 'N/A'}\n*Class:* ${formData.class}\n*WhatsApp:* ${formData.phone}\n------------------------------\n*Status:* VERIFIED BOOKING\n------------------------------\nPlease confirm my seats.`;
            window.open(`https://wa.me/+923198550419?text=${encodeURIComponent(message)}`, '_blank');
            
            onClose();
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <div className="bg-[#1b1b1f] border border-white/10 p-8 md:p-12 rounded-[3.5rem] max-w-md w-full relative shadow-2xl text-white overflow-hidden">
                <div className="absolute top-0 right-0 bg-rail-accent px-6 py-2 rounded-bl-[2rem] flex items-center gap-2 shadow-lg">
                    <span className="material-symbols-rounded text-sm">verified_user</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Secured by RAILS.PK</span>
                </div>

                <button onClick={onClose} className="absolute top-6 left-8 text-gray-500 hover:text-white transition-all">
                    <span className="material-symbols-rounded">close</span>
                </button>
                
                <div className="mt-8 mb-8">
                    <h3 className="text-2xl font-black uppercase italic text-rail-accent leading-none mb-2">Request Ticket</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#74777f]">Authorized Ticketing Portal</p>
                </div>

                <div className="bg-rail-accent/10 border border-rail-accent/20 p-4 rounded-2xl mb-8 flex items-center gap-4 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-rail-accent"></div>
                    <p className="text-[9px] font-black uppercase italic text-rail-accent tracking-widest leading-none">
                        {recentData[recentBooking]}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-bold outline-none text-white appearance-none focus:border-rail-accent"
                        value={formData.trainId} onChange={(e) => setFormData({...formData, trainId: e.target.value})}>
                        <option value="" className="bg-rail-dark">Select Train</option>
                        {trainsData.map(t => <option key={t.id} value={t.id} className="bg-rail-dark">{t.name}</option>)}
                    </select>

                    {availableClasses.length > 0 && (
                        <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-bold outline-none text-white appearance-none focus:border-rail-accent"
                            value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})}>
                            {availableClasses.map((f, i) => <option key={i} value={f.class} className="bg-rail-dark">{f.class}</option>)}
                        </select>
                    )}

                    <input type="text" placeholder="Full Name (As per CNIC)" required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-bold outline-none text-white focus:border-rail-accent"
                        value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />

                    <input type="tel" placeholder="Active WhatsApp Number" required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-bold outline-none text-white focus:border-rail-accent"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />

                    {formData.trainId && formData.class && (
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-dashed border-white/10 space-y-2 my-6">
                            <div className="flex justify-between text-[10px] font-black uppercase opacity-60 italic">
                                <span>Official Train Fare:</span>
                                <span>Rs. {pricing.fare.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase text-rail-accent italic">
                                <span>E-Portal Fee:</span>
                                <span>+ Rs. {pricing.commission}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black border-t border-white/10 pt-4 mt-2 italic tracking-tighter">
                                <span>Payable Amount:</span>
                                <span className="text-rail-accent">Rs. {pricing.total.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    <button disabled={isSubmitting} className={`w-full bg-rail-accent py-6 rounded-full font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all ${isSubmitting ? 'opacity-50' : 'hover:scale-[1.03]'}`}>
                        {isSubmitting ? 'Processing...' : 'Verify & Send Request'}
                    </button>
                </form>

                <div className="mt-10 flex justify-center items-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-rounded text-xl">security</span>
                        <span className="text-[7px] font-bold uppercase mt-1">SSL Secured</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-white/10 px-6">
                        <span className="material-symbols-rounded text-xl">payments</span>
                        <span className="text-[7px] font-bold uppercase mt-1">Full Refund</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-rounded text-xl">support_agent</span>
                        <span className="text-[7px] font-bold uppercase mt-1">24/7 Help</span>
                    </div>
                </div>
            </div>
        </div>
    );
}