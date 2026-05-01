"use client";
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin');
        } catch (err) {
            setError("Invalid credentials. Access Denied.");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="w-full max-w-md bg-[#f2f0f4] dark:bg-[#2e2f33] p-10 md:p-12 rounded-[3rem] shadow-xl border border-[#74777f]/10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-rail-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-rounded text-3xl text-rail-accent">admin_panel_settings</span>
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">Admin <span className="text-rail-accent">Portal</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] dark:text-[#a9abb1] mt-2">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest dark:text-[#a9abb1] ml-4">Email Address</label>
                        <div className="relative">
                            <span className="material-symbols-rounded absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">mail</span>
                            <input 
                                type="email" 
                                placeholder="admin@therails.pk"
                                className="w-full bg-white dark:bg-[#1b1b1f] border border-transparent focus:border-rail-accent p-4 pl-14 rounded-full outline-none transition-all text-sm font-bold"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest dark:text-[#a9abb1] ml-4">Password</label>
                        <div className="relative">
                            <span className="material-symbols-rounded absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-white dark:bg-[#1b1b1f] border border-transparent focus:border-rail-accent p-4 pl-14 rounded-full outline-none transition-all text-sm font-bold"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center bg-red-500/10 py-3 rounded-xl">{error}</p>}

                    <button 
                        type="submit"
                        className="w-full bg-rail-accent text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-rail-accent/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-rounded text-lg">login</span>
                        Secure Login
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-[10px] font-bold uppercase tracking-widest dark:text-[#a9abb1] hover:text-rail-accent transition">
                        ← Return to Terminal
                    </Link>
                </div>
            </div>
        </section>
    );
}