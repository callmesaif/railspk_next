'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', image_url: '', is_poll: false, poll_options: '', admin_reply: '' });

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) setForm(prev => ({ ...prev, image_url: data.url }));
      } catch (err) { alert("Upload fail!"); } finally { setUploading(false); }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Submit karne se pehle console mein dekhein data sahi hai?
  console.log("Submitting Data:", form);

  try {
    const method = editingPost ? 'PUT' : 'POST';
    const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';

    const res = await fetch(url, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...form,
    is_poll: form.is_poll ? 1 : 0 // Force convert to 1 or 0
  }),
});

    if (res.ok) {
      setEditingPost(null);
      setForm({ title: '', content: '', image_url: '', is_poll: false, poll_options: '', admin_reply: '' });
      fetchPosts();
      alert("Post successful! 🚄");
    } else {
      const errorData = await res.json();
      alert("Server Error: " + errorData.error);
    }
  } catch (err) {
    console.error("Submit error:", err);
  }
};

  const updateReply = async (id: number, reply: string) => {
    await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_reply: reply }),
    });
    fetchPosts();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-900 border-b-4 border-yellow-400 inline-block italic uppercase">RAILSPK Admin</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl mb-12 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{editingPost ? '✏️ Edit Update' : '📢 New Announcement'}</h2>
        <div className="space-y-4">
          <input className="w-full p-4 bg-gray-50 border rounded-2xl text-black font-bold outline-none" placeholder="Post Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          <textarea className="w-full p-4 bg-gray-50 border rounded-2xl text-black h-32 outline-none" placeholder="Details..." value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} required></textarea>
          
          <div className="p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50 text-center">
            <label className="block text-sm font-bold text-blue-900 mb-2 cursor-pointer italic underline">📸 {form.image_url ? 'Change Image' : 'Select Image'}<input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" /></label>
            {uploading && <p className="text-blue-600 text-sm animate-pulse">Uploading... 🚂</p>}
            {form.image_url && <img src={form.image_url} className="h-24 mx-auto mt-2 rounded-xl shadow-md border" alt="Preview" />}
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <input type="checkbox" checked={form.is_poll} onChange={(e) => setForm({...form, is_poll: e.target.checked})} />
            <label className="font-bold text-slate-700">Add a Poll?</label>
          </div>
          {form.is_poll && <input className="w-full p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl text-black" placeholder="Options (comma separated)" value={form.poll_options} onChange={(e) => setForm({...form, poll_options: e.target.value})} />}
          
          <button type="submit" disabled={uploading} className="w-full py-4 rounded-2xl font-black uppercase bg-blue-900 text-white hover:bg-black transition-all shadow-lg">
            {uploading ? '⌛ Please Wait...' : editingPost ? 'Update Post' : '🚀 Publish to Feed'}
          </button>
        </div>
      </form>

      <div className="grid gap-6">
        <h3 className="text-xl font-bold text-slate-700 uppercase tracking-widest border-l-4 border-blue-900 pl-3">Manage Tracks</h3>
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg text-black">{post.title}</h4>
                <div className="flex gap-2 mt-1">
                  {post.image_url && post.image_url !== "0" && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">Photo</span>}
                  {post.is_poll === 1 && <span className="text-[10px] bg-yellow-400 text-blue-900 px-2 py-0.5 rounded font-bold uppercase">Poll</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingPost(post); setForm({...post}); window.scrollTo(0,0); }} className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl">Edit</button>
                <button onClick={async () => { if(confirm("Delete?")) { await fetch(`/api/posts/${post.id}`, {method:'DELETE'}); fetchPosts(); } }} className="text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl">Delete</button>
              </div>
            </div>
            <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-2xl border">
              <input type="text" placeholder="Add official reply..." className="flex-1 bg-transparent text-sm outline-none" defaultValue={post.admin_reply || ""} onBlur={(e) => updateReply(post.id, e.target.value)} />
              <span className="text-[10px] font-bold text-gray-400 uppercase italic">Auto-Save</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}