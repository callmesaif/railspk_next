import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    { icon: 'fa-facebook', href: 'https://www.facebook.com/railoverspk/', color: 'hover:text-blue-600' },
    { icon: 'fa-youtube', href: 'https://youtube.com/@railoverspkofficial', color: 'hover:text-red-600' },
    { icon: 'fa-instagram', href: 'https://instagram.com/realinventivecadet', color: 'hover:text-pink-500' },
    { icon: 'fa-tiktok', href: 'https://tiktok.com/@railoverspk', color: 'hover:text-black dark:hover:text-white' },
    { icon: 'fa-whatsapp', href: 'https://whatsapp.com/channel/0029VbBHeff8PgsJZYRHww3O', color: 'hover:text-green-500' }
  ];

  return (
    <footer className="py-24 bg-[#f2f0f4] dark:bg-[#1b1b1f] border-t border-[#74777f]/10 px-6 mt-20">
            {/* Social Icons - M3 Individual Rounded Containers */}
            <div className="flex justify-center flex-wrap gap-4 mb-16">
                {socialLinks.map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-14 h-14 flex items-center justify-center bg-white dark:bg-[#2e2f33] rounded-full text-2xl text-[#44474e] dark:text-[#e3e2e6] shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg ${social.color}`}
                  >
                    <i className={`fab ${social.icon}`}></i>
                  </a>
                ))}
            </div>

            {/* Copyright with M3 Typography */}
            <div className="text-center mb-10">
              <p className="text-[#74777f] text-[10px] tracking-[0.5em] font-black uppercase italic">
                © 2026 RAILSPK | Digital Legacy Project
              </p>
            </div>

            {/* Bottom Links - M3 Pill Style */}
            <div className="flex justify-center gap-3">
                <Link 
                  href="/privacy" 
                  className="px-6 py-2 bg-white/50 dark:bg-[#2e2f33]/50 hover:bg-rail-accent hover:text-white dark:hover:bg-rail-accent rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Privacy
                </Link>
                <Link 
                  href="/terms" 
                  className="px-6 py-2 bg-white/50 dark:bg-[#2e2f33]/50 hover:bg-rail-accent hover:text-white dark:hover:bg-rail-accent rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Terms
                </Link>
            </div>
    </footer>
  );
}