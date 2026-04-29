"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BookingModal from './BookingModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Theme Sync logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Train Reviews", href: "/reviews" },
    { name: "Latest Updates", href: "/community" },
    { name: "Support", href: "/support" }
  ];

  return (
    <>
      <header className="fixed top-6 inset-x-0 z-[60] flex justify-center px-6">
        <div className="max-w-screen-2xl w-full flex justify-between items-center h-20 px-8 bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-2xl border border-[#d1d5db]/20 dark:border-[#374151]/30 rounded-full shadow-2xl">
          {/* Logo Section */}
          <Link href="/" className="text-2xl font-black italic text-rail-accent uppercase tracking-tighter">
            THE RAILSPK
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-10 text-[12px] font-black uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-rail-accent transition-all px-4 py-2 rounded-full hover:bg-rail-accent/5">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-rail-accent text-white text-[11px] font-black px-8 py-3 rounded-full hover:shadow-xl hover:shadow-rail-accent/20 transition-all active:scale-95 shadow-lg"
            >
              <span className="material-symbols-rounded text-base">confirmation_number</span>
              BOOK TICKET
            </button>
            
            <button onClick={toggleTheme} className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-gray-600 dark:text-gray-300 transition-all active:rotate-90">
              <span className="material-symbols-rounded">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>

            <button className="lg:hidden text-foreground w-10 h-10 flex items-center justify-center" onClick={() => setIsOpen(true)}>
              <span className="material-symbols-rounded">menu_open</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE DRAWER (SLIDER) --- */}
      <div className={`fixed inset-0 z-[100] ${isOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsOpen(false)}
        ></div>
        
        {/* Drawer Content */}
        <div className={`absolute right-4 top-4 bottom-4 w-80 bg-white dark:bg-[#0a0f1a] rounded-[3rem] p-10 shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}>
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black italic text-rail-accent">MENU</span>
            <button onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <span className="material-symbols-rounded text-gray-500">close</span>
            </button>
          </div>

          <nav className="flex flex-col space-y-4 mb-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-2xl font-black italic rounded-3xl p-6 hover:bg-rail-accent/10 hover:text-rail-accent transition-all text-foreground dark:text-white" 
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Missing Button Fixed: Mobile view Book Ticket */}
          <button 
            onClick={() => { setIsModalOpen(true); setIsOpen(false); }} 
            className="w-full flex items-center justify-center gap-3 bg-rail-accent text-white py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-rail-accent/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-rounded">confirmation_number</span>
            Book Ticket Now
          </button>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}