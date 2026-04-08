'use client';
import { useEffect, useState } from 'react';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedPosts, setVotedPosts] = useState<Record<number, any>>({}); // To store results locally

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleVote = async (postId: number, optIndex: number) => {
    const res = await fetch(`/api/posts/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ option_index: optIndex }),
    });

    if (res.ok || res.status === 403) {
      // Fetch results after voting or if already voted
      const resData = await fetch(`/api/posts/${postId}/vote`);
      const votes = await resData.json();
      setVotedPosts(prev => ({ ...prev, [postId]: votes }));
      if (res.status === 403) alert("You have already voted for this train poll! 🚄");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen font-black text-blue-900 animate-pulse italic uppercase tracking-tighter">🚄 Loading RailsPK...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-b from-blue-900 to-black text-white py-20 text-center shadow-2xl mb-12">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">RAILSPK <span className="text-yellow-400 font-bold">COMMUNITY</span></h1>
        <p className="mt-4 text-blue-200 text-lg tracking-widest font-light">LATEST UPDATES & PASSENGER POLLS</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-16">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 transition-all">
            {post.image_url && post.image_url !== "0" && (
              <div className="w-full h-80 md:h-[550px] relative">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-10 md:p-14">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-black bg-yellow-400 text-blue-900 px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">Announcement</span>
                <time className="text-sm font-bold text-gray-400 italic underline decoration-blue-900 underline-offset-4">{new Date(post.created_at).toLocaleDateString('en-GB', {day:'numeric', month:'long'})}</time>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 italic leading-tight uppercase tracking-tighter">{post.title}</h2>
              <p className="text-gray-600 leading-relaxed text-xl md:text-2xl mb-10 whitespace-pre-wrap font-medium">{post.content}</p>
              
              {/* VOTE LOGIC UI */}
              {post.is_poll === 1 && post.poll_options && (
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border-4 border-double border-blue-100 shadow-inner">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></span>
                    <p className="font-black text-blue-900 uppercase text-sm tracking-[0.4em]">Live Passenger Poll</p>
                  </div>
                  <div className="space-y-4">
                    {post.poll_options.split(',').map((opt: string, i: number) => {
                      const result = votedPosts[post.id]?.find((v: any) => v.option_index === i);
                      const totalVotes = votedPosts[post.id]?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
                      const percentage = totalVotes > 0 ? Math.round((result?.count || 0) / totalVotes * 100) : 0;

                      return (
                        <button 
                          key={i} 
                          onClick={() => handleVote(post.id, i)}
                          className="w-full relative group overflow-hidden bg-white border-2 border-gray-100 p-6 rounded-2xl hover:border-blue-900 transition-all duration-500"
                        >
                          <div className="relative z-10 flex justify-between items-center font-black uppercase text-sm md:text-lg italic text-blue-900">
                            <span>{opt.trim()}</span>
                            {votedPosts[post.id] && <span>{percentage}%</span>}
                          </div>
                          {/* Progress Bar Animation */}
                          {votedPosts[post.id] && (
                            <div 
                              className="absolute top-0 left-0 h-full bg-blue-900/10 transition-all duration-1000 ease-out" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {votedPosts[post.id] && (
                    <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest animate-pulse">Your vote has been casted! 🚄</p>
                  )}
                </div>
              )}

              {post.admin_reply && (
                <div className="mt-10 bg-blue-900 text-white p-10 rounded-[2rem] shadow-2xl relative border-t-8 border-yellow-400">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🚆</div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400 mb-4">Official Admin Response</p>
                  <p className="text-2xl italic font-bold leading-relaxed">"{post.admin_reply}"</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}