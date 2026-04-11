"use client";
import { useState, useEffect } from 'react';
import { trainsData } from '@/lib/trains';

export default function BookingModal({ isOpen, onClose, selectedTrainId }) {
    const [formData, setFormData] = useState({
        trainId: selectedTrainId || "",
        class: "", // Naya state class ke liye
        fullName: "",
        phone: ""
    });

    const [availableClasses, setAvailableClasses] = useState([]);
    const [pricing, setPricing] = useState({ fare: 0, commission: 200, total: 0 });

    // 1. Train select hone par available classes load karein
    useEffect(() => {
        if (formData.trainId) {
            const train = trainsData.find(t => t.id === formData.trainId);
            if (train && train.fares) {
                setAvailableClasses(train.fares);
                setFormData(prev => ({ ...prev, class: train.fares[0].class })); // Default pehli class
            }
        } else {
            setAvailableClasses([]);
            setFormData(prev => ({ ...prev, class: "" }));
        }
    }, [formData.trainId]);

    // 2. Class select hone par pricing update karein
    useEffect(() => {
        if (formData.trainId && formData.class) {
            const train = trainsData.find(t => t.id === formData.trainId);
            const selectedFare = train.fares.find(f => f.class === formData.class);
            
            if (selectedFare) {
                const baseFare = parseInt(selectedFare.price.replace(/[^\d]/g, '')) || 0;
                const comm = 200; 
                setPricing({
                    fare: baseFare,
                    commission: comm,
                    total: baseFare + comm
                });
            }
        }
    }, [formData.trainId, formData.class]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const train = trainsData.find(t => t.id === formData.trainId);
        const message = `Assalam-o-Alaikum! \n\n*NEW TICKET REQUEST*\n------------------------------\n*Name:* ${formData.fullName}\n*Train:* ${train ? train.name : 'N/A'}\n*Class:* ${formData.class}\n*WhatsApp:* ${formData.phone}\n------------------------------\n*Base Fare:* Rs. ${pricing.fare.toLocaleString()}\n*Service Charges:* Rs. ${pricing.commission}\n*Total Payable:* Rs. ${pricing.total.toLocaleString()}\n------------------------------\nPlease confirm booking.`;
        
        window.open(`https://wa.me/+923198550419?text=${encodeURIComponent(message)}`, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="bg-rail-dark border border-white/10 p-10 rounded-[3rem] max-w-md w-full relative shadow-2xl text-white">
                <button onClick={onClose} className="absolute top-6 right-8 text-gray-500 hover:text-white text-2xl">&times;</button>
                
                <h3 className="text-xl font-black uppercase italic mb-8 text-rail-accent">Request Ticket</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Select Train */}
                    <select 
                        required
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none text-white appearance-none"
                        value={formData.trainId}
                        onChange={(e) => setFormData({...formData, trainId: e.target.value})}
                    >
                        <option value="" className="bg-rail-dark">Select Train</option>
                        {trainsData.map(t => (
                            <option key={t.id} value={t.id} className="bg-rail-dark text-white">{t.name}</option>
                        ))}
                    </select>

                    {/* Select Class (Only shown if train is selected) */}
                    {availableClasses.length > 0 && (
                        <select 
                            required
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none text-white appearance-none"
                            value={formData.class}
                            onChange={(e) => setFormData({...formData, class: e.target.value})}
                        >
                            {availableClasses.map((f, i) => (
                                <option key={i} value={f.class} className="bg-rail-dark text-white">{f.class}</option>
                            ))}
                        </select>
                    )}

                    <input type="text" placeholder="Your Full Name" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none text-white"
                        value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />

                    <input type="tel" placeholder="WhatsApp Number" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none text-white"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />

                    {/* Pricing Breakdown */}
                    {formData.trainId && formData.class && (
                        <div className="bg-white/5 p-6 rounded-2xl border border-dashed border-white/10 space-y-2 my-4">
                            <div className="flex justify-between text-[10px] font-black uppercase opacity-60">
                                <span>{formData.class} Fare:</span>
                                <span>Rs. {pricing.fare.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase text-rail-accent">
                                <span>Service Charges:</span>
                                <span>+ Rs. {pricing.commission}</span>
                            </div>
                            <div className="flex justify-between text-sm font-black border-t border-white/10 pt-2 mt-2 italic">
                                <span>Total Amount:</span>
                                <span>Rs. {pricing.total.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    <button className="w-full bg-rail-accent py-5 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition">
                        Proceed to WhatsApp
                    </button>
                </form>
            </div>
        </div>
    );
}