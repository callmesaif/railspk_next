"use client";
import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const contactInfo = [
    { icon: 'mail', title: 'Email Us', detail: 'railoverspkofficial@gmail.com', sub: 'For business & inquiries' },
    { icon: 'chat', title: 'WhatsApp', detail: '+92 319 8550419', sub: 'Join the community' },
    { icon: 'location_on', title: 'Station Base', detail: 'Karachi Cantt', sub: 'The Digital Legacy Hub' }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter">
          Contact <span className="text-rail-accent">Base</span>
        </h1>
        <p className="dark:text-[#a9abb1] font-bold uppercase tracking-widest text-[10px] mt-4 italic">
          Let’s talk about the future of Pakistan Railways
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        <div className="lg:col-span-1 space-y-6">
          {contactInfo.map((info, i) => (
            <div key={i} className="bg-[#f2f0f4] dark:bg-[#1b1b1f] p-8 rounded-[2.5rem] border border-transparent hover:border-rail-accent/20 transition-all group">
              <span className="material-symbols-rounded text-rail-accent text-3xl mb-4 block group-hover:scale-110 transition-transform">{info.icon}</span>
              <h3 className="text-xl font-black italic uppercase">{info.title}</h3>
              <p className="text-sm font-bold text-rail-accent my-1">{info.detail}</p>
              <p className="text-[10px] dark:text-[#a9abb1] uppercase font-bold tracking-widest italic">{info.sub}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-[#f2f0f4] dark:bg-[#1b1b1f] p-10 md:p-16 rounded-[3.5rem] shadow-sm">
          {!sent ? (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-4 dark:text-[#a9abb1]">Full Name</label>
                  <input required type="text" className="w-full bg-white dark:bg-[#2e2f33] p-5 rounded-3xl outline-none focus:ring-2 ring-rail-accent/30 transition-all font-bold text-sm" placeholder="Inventive Cadet" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-4 dark:text-[#a9abb1]">Email Address</label>
                  <input required type="email" className="w-full bg-white dark:bg-[#2e2f33] p-5 rounded-3xl outline-none focus:ring-2 ring-rail-accent/30 transition-all font-bold text-sm" placeholder="fan@therails.pk" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-4 dark:text-[#a9abb1]">Message</label>
                <textarea required className="w-full bg-white dark:bg-[#2e2f33] p-5 rounded-[2rem] outline-none focus:ring-2 ring-rail-accent/30 transition-all font-bold text-sm h-40" placeholder="Type your message here..."></textarea>
              </div>
              <button className="w-full md:w-auto px-12 py-5 bg-rail-accent text-white rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:shadow-rail-accent/30 active:scale-95 transition-all">
                Send Broadcast
              </button>
            </form>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <span className="material-symbols-rounded text-7xl text-rail-accent mb-6">task_alt</span>
              <h2 className="text-3xl font-black italic uppercase mb-2">Message Sent!</h2>
              <p className="text-sm dark:text-[#a9abb1] font-medium italic">We'll get back to your signal soon.</p>
              <button onClick={() => setSent(false)} className="mt-10 text-rail-accent font-black uppercase text-[10px] tracking-widest hover:underline">Send another one</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}