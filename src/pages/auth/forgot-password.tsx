import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Sparkles, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { authApi } from "@/services/api";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
    const [mounted, setMounted] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSent, setIsSent] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await authApi.forgotPassword(email);
            setIsSent(true);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col font-sans overflow-x-hidden">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-32 pb-20">
                <div className="w-full max-w-md relative">
                    {/* Animated background effects */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-700" />

                    <div className="bg-[#1e293b]/50 border border-white/10 rounded-[2.5rem] p-6 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] shadow-xl shadow-blue-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Sparkles className="text-white" size={32} />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-2 leading-none">Recover Access</h2>
                            <p className="text-gray-400 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em] opacity-70">
                                {isSent ? "Check your inbox" : "We'll send you a magic link"}
                            </p>
                        </div>

                        {isSent ? (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                        <CheckCircle className="text-green-500" size={32} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Email Sent!</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    We've sent a password reset link to <span className="text-white font-bold">{email}</span>. Please check your inbox.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <Link
                                        href="/login"
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 relative">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">
                                        Registered Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-14 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold text-center animate-shake">
                                        {error}
                                    </div>
                                )}

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[1.5rem] font-black text-lg transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] group/btn flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : (
                                        <>
                                            <span>SEND RESET LINK</span>
                                            <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="text-center pt-4">
                                    <Link href="/login" className="text-xs font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">
                                        Wait, I remember it!
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
