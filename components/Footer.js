import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    { icon: 'fa-facebook', href: 'https://www.facebook.com/railoverspk/', color: 'hover:text-blue-600' },
    { icon: 'fa-youtube', href: 'https://youtube.com/@railoverspkofficial', color: 'hover:text-red-600' },
    { icon: 'fa-instagram', href: 'https://instagram.com/realinventivecadet', color: 'hover:text-pink-500' },
    { icon: 'fa-tiktok', href: 'https://tiktok.com/@railoverspk', color: 'hover:text-black dark:hover:text-white' },
    { icon: 'fa-whatsapp', href: 'https://whatsapp.com/channel/0029VbBHeff8PgsJZYRHww3O', color: 'hover:text-green-500' }
  ];

  const helpLinks = [
    {
      title: "Travel Tools",
      links: [
        { name: "Live Tracking", href: "https://traintracking.pk" },
        { name: "Train Schedule", href: "/schedule" },
        { name: "Fare Calculator", href: "/fares" }
      ]
    },
    {
      title: "Official Sites",
      links: [
        { name: "Pakistan Railways", href: "https://pakrail.gov.pk" },
        { name: "Railway Heritage", href: "/heritage" },
        { name: "Review Hub", href: "/reviews" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/support" },
        { name: "Refund Guide", href: "/refunds" },
        { name: "Locomotive DB", href: "/locomotives" },
        { name: "Contact Us", href: "/contact" }
      ]
    }
  ];

  return (
    <footer className="py-24 bg-[#f2f0f4] dark:bg-[#1b1b1f] border-t border-[#74777f]/10 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          
          {/* Left Side: Helpful Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {helpLinks.map((group, i) => (
              <div key={i}>
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-rail-accent mb-6">
                  {group.title}
                </h4>
                <ul className="space-y-4">
                  {group.links.map((link, j) => (
                    <li key={j}>
                      <Link 
                        href={link.href} 
                        className="text-xs font-bold text-[#44474e] dark:text-[#c4c6cf] hover:text-rail-accent transition-colors italic"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Side: Karachi Cantt Map Container */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-rail-accent">
              Major Hub: Karachi Cantonment
            </h4>
            <div className="w-full h-64 rounded-[2rem] overflow-hidden border-4 border-white dark:border-[#2e2f33] shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.3541433285!2d67.03157771141753!3d24.85172407784351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6ff702581f%3A0x6b245a49479e0b1d!2sKarachi%20Cantt.%20Station!5e0!3m2!1sen!2spk!4v1714200000000!5m2!1sen!2spk" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
              ></iframe>
            </div>
            <p className="text-[9px] font-bold text-[#74777f] uppercase tracking-widest text-center italic">
              Platform Layout • Live GPS Feed • 24/7 Arrivals
            </p>
          </div>
        </div>

        {/* Social Icons - M3 Style */}
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

        {/* Copyright & Legal Pills */}
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <p className="text-[#74777f] text-[10px] tracking-[0.5em] font-black uppercase italic">
              © 2026 RAILSPK | Digital Legacy Project
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Link 
              href="/privacy" 
              className="px-6 py-2 bg-white/50 dark:bg-[#2e2f33]/50 hover:bg-rail-accent hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="px-6 py-2 bg-white/50 dark:bg-[#2e2f33]/50 hover:bg-rail-accent hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}