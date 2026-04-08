'use client';
import { useEffect, useState } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
  const getPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      // Check karein ke data array hai ya nahi
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]); // Error ki surat mein khali array rakhein
    }
  };

  getPosts();
}, []);

  return (
    <section className="py-20 bg-slate-100 px-6">
      <div className="container mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-8 italic">Latest Vlogs</h2>
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center text-white">
            <p>[ YouTube Video Embed Here ]</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-8 italic">Community Feed</h2>
          <div className="space-y-4">
            {posts.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-blue-900">
                <h4 className="font-bold text-blue-900">{p.title}</h4>
                <p className="text-gray-600 text-sm">{p.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}