"use client";

export default function VideoModal({ videoId, onClose }) {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-2xl animate-fade-in">
      <div className="bg-black w-full max-w-5xl aspect-video rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/5">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-8 text-white text-4xl z-20 hover:scale-110 transition"
        >
          &times;
        </button>
        
        {/* YouTube Embed (Autoplay Enabled) */}
        <div className="w-full h-full">
          // VideoModal.js ya jahan bhi YouTube embed hai
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Pakistan Railways Cinematic Vlog" // <-- Yeh lazmi add karein
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
          </iframe>
        </div>
      </div>
    </div>
  );
}