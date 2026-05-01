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
        {/* M3 Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Support <span className="text-rail-accent">Center</span>
          </h2>
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 bg-[#f2f0f4] dark:bg-[#2e2f33] rounded-full">
            <span className="material-symbols-rounded text-sm text-rail-accent">contact_support</span>
            <span className="dark:text-[#a9abb1] uppercase tracking-[0.2em] text-[10px] font-bold">24/7 Digital Concierge</span>
          </div>
        </div>

        {/* M3 FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`rounded-[2rem] transition-all duration-500 border border-transparent ${
                openIndex === idx 
                ? 'bg-[#f2f0f4] dark:bg-[#2e2f33] shadow-md' 
                : 'bg-white dark:bg-[#1b1b1f] border-[#74777f]/10 shadow-sm'
              }`}
            >
              <div 
                className="p-6 md:p-8 cursor-pointer flex justify-between items-center" 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <h3 className="text-sm md:text-base font-bold uppercase italic tracking-wide pr-4">
                  {faq.q}
                </h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  openIndex === idx ? 'bg-rail-accent text-white rotate-45' : 'bg-rail-accent/10 text-rail-accent'
                }`}>
                  <span className="material-symbols-rounded">add</span>
                </div>
              </div>
              
              <div className={`transition-all duration-500 overflow-hidden ${
                openIndex === idx ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8">
                  <div className="border-t border-[#74777f]/10 pt-6">
                    <p className="text-[#44474e] dark:text-[#c4c6cf] text-sm italic leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* M3 Call to Action Section */}
        <div className="mt-24 text-center p-12 bg-rail-accent/5 rounded-[3rem] border border-rail-accent/10">
          <div className="w-16 h-16 bg-white dark:bg-[#2e2f33] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
             <span className="material-symbols-rounded text-3xl text-rail-accent">chat</span>
          </div>
          <p className="dark:text-[#a9abb1] text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
            Still need assistance from our team?
          </p>
          <a 
            href="https://wa.me/+923198550419" 
            target="_blank"
            className="inline-flex items-center gap-3 bg-rail-accent text-white px-12 py-5 rounded-full font-bold uppercase text-xs italic tracking-widest shadow-xl hover:shadow-rail-accent/30 active:scale-95 transition-all"
          >
            <span className="material-symbols-rounded"></span>
            Contact WhatsApp Support
          </a>
        </div>
      </div>
    </section>
  );
}