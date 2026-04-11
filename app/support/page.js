"use client";
import { useState } from 'react';

const faqs = [
  { q: "How can I book a ticket via WhatsApp?", a: "Simply click the 'Book via WhatsApp' button on any train's detail page. Our team will assist you with availability and seat selection." },
  { q: "What is the difference between AC Business and AC Standard?", a: "AC Business offers more spacious seating and better bedding, while AC Standard is more economical with standard air-conditioning services." },
  { q: "How are the Punctuality scores calculated?", a: "Scores are based on real-time data from the last 30 days of the train's arrival history at major stations." },
  { q: "Can I cancel my booking?", a: "Cancellations are handled according to Pakistan Railways' official policy. Please contact our support via WhatsApp for specific case assistance." }
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="min-h-screen pt-32 pb-20 bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Support <span className="text-rail-accent">Center</span>
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-[10px] font-black mt-4">24/7 Digital Concierge</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rail-card p-6 cursor-pointer overflow-hidden transition-all duration-500" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
              <div className="flex justify-between items-center">
                <h3 className="text-xs md:text-sm font-black uppercase italic tracking-wider">{faq.q}</h3>
                <span className={`text-rail-accent text-xl transition-transform ${openIndex === idx ? 'rotate-45' : ''}`}>+</span>
              </div>
              <div className={`transition-all duration-500 overflow-hidden ${openIndex === idx ? 'max-h-40 mt-6' : 'max-h-0'}`}>
                <p className="text-gray-400 text-xs italic leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-6">Still need help?</p>
          <a href="https://wa.me/+923198550419" className="bg-rail-accent text-white px-10 py-5 rounded-full font-black uppercase text-xs italic tracking-widest shadow-xl hover:scale-105 transition-all">
            Direct WhatsApp Support
          </a>
        </div>
      </div>
    </section>
  );
}