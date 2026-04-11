"use client";
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin'); // Login ke baad dashboard par bhejo
    } catch (err) {
      setError("Invalid Credentials. Sirf Saif hi access kar sakta hai!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rail-dark p-6">
      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] w-full max-w-md backdrop-blur-xl">
        <h2 className="text-3xl font-black uppercase italic text-white mb-2 text-center">Admin <span className="text-rail-accent">Access</span></h2>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 text-center mb-8">RAILSPK Secure Gateway</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="w-full bg-rail-dark p-4 rounded-2xl border border-white/10 outline-none text-white text-xs focus:border-rail-accent"
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Security Code" 
            className="w-full bg-rail-dark p-4 rounded-2xl border border-white/10 outline-none text-white text-xs focus:border-rail-accent"
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
          <button type="submit" className="w-full bg-rail-accent text-white py-4 rounded-2xl font-black uppercase italic tracking-widest text-[11px] shadow-lg hover:scale-[1.02] transition">
            Initialize Session
          </button>
        </form>
      </div>
    </div>
  );
}