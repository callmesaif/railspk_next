import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-32 border-t border-gray-100 dark:border-white/5 text-center px-6">
        <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center mb-16">
                <span className="text-3xl font-black italic text-rail-accent uppercase tracking-tighter mb-4">RAILSPK HUB</span>
                <p className="text-gray-400 max-w-lg text-sm italic">"The digital archive of Pakistan Railways heritage. Join us in documenting every locomotive and track symmetry."</p>
            </div>
            <div className="flex justify-center space-x-10 mb-16">
                <a href="https://www.facebook.com/railoverspk/" target="_blank" className="text-2xl text-gray-400 hover:text-rail-accent transition-all hover:scale-125"><i className="fab fa-facebook"></i></a>
                <a href="https://youtube.com/@railoverspkofficial" target="_blank" className="text-2xl text-gray-400 hover:text-red-600 transition-all hover:scale-125"><i className="fab fa-youtube"></i></a>
                <a href="https://instagram.com/realinventivecadet" target="_blank" className="text-2xl text-gray-400 hover:text-pink-500 transition-all hover:scale-125"><i className="fab fa-instagram"></i></a>
                <a href="https://tiktok.com/@railoverspk" target="_blank" className="text-2xl text-gray-400 hover:text-pink-500 transition-all hover:scale-125"><i className="fab fa-tiktok"></i></a>
                <a href="https://whatsapp.com/channel/0029VbBHeff8PgsJZYRHww3O" target="_blank" className="text-2xl text-gray-400 hover:text-green-500 transition-all hover:scale-125"><i className="fab fa-whatsapp"></i></a>
            </div>
            <p className="text-gray-500 text-[9px] tracking-[0.6em] font-black uppercase italic mb-8">© 2026 RAILSPK | Digital Legacy Project</p>
            <div className="flex justify-center space-x-8 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <Link href="/privacy" className="hover:text-rail-accent transition">Privacy</Link>
                <Link href="/terms" className="hover:text-rail-accent transition">Terms</Link>
            </div>
        </div>
    </footer>
  );
}