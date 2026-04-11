"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BookingModal from './BookingModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile Drawer
  const [isModalOpen, setIsModalOpen] = useState(false); // Booking Modal
  const [isDark, setIsDark] = useState(true);

  // Theme Toggle Logic
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
    { name: "Scorecards", href: "/reviews" },
    { name: "Community", href: "/community" },
    { name: "Support", href: "/support" }
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[60] bg-background/70 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 h-20 flex items-center">
        <div className="max-w-screen-2xl mx-auto px-6 w-full flex justify-between items-center text-foreground">
          <Link href="/" className="text-2xl font-black italic text-rail-accent uppercase">
            RAILSPK
          </Link>

          <nav className="hidden lg:flex items-center space-x-8 text-[10px] font-black uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-rail-accent transition">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden md:block bg-rail-accent/10 text-rail-accent text-[9px] font-black px-5 py-2.5 rounded-xl border border-rail-accent/20 hover:bg-rail-accent hover:text-white transition"
            >
              BOOK A TICKET
            </button>
            
            <button onClick={toggleTheme} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full transition-all text-yellow-500">
              <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <button className="lg:hidden text-foreground" onClick={() => setIsOpen(true)}>
              <i className="fas fa-bars-staggered text-2xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-80 bg-background border-l border-white/5 p-8 transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black italic text-rail-accent">MENU</span>
            <button onClick={() => setIsOpen(false)} className="text-2xl text-foreground"><i className="fas fa-times"></i></button>
          </div>
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-2xl font-black uppercase italic hover:text-rail-accent transition text-foreground" onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-12 pt-12 border-t border-white/5">
            <button onClick={() => { setIsModalOpen(true); setIsOpen(false); }} className="w-full bg-rail-accent text-white py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px]">
              Book a Ticket
            </button>
          </div>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}