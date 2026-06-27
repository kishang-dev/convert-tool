import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Sparkles, Lock, ArrowRight, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { authApi } from "@/services/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;
    const [mounted, setMounted] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!token) {
            setError("Invalid or missing token");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            await authApi.resetPassword(token as string, password);
            setIsSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-6 py-20">
                <div className="w-full max-w-md relative">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-700" />

                    <div className="bg-[#1e293b]/50 border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 mb-6 group-hover:rotate-12 transition-transform duration-500">
                                <ShieldCheck className="text-gray-900 dark:text-white" size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2 leading-none">New Strength</h2>
                            <p className="text-gray-600 dark:text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] opacity-70">
                                Set a core-level secret
                            </p>
                        </div>

                        {isSuccess ? (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500/30">
                                        <CheckCircle className="text-green-500" size={40} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Password reset successful!</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    Your new password is now active. You will be redirected to the login page momentarily.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <Link
                                        href="/login"
                                        className="w-full py-4 bg-gray-100 dark:bg-white/5 hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 relative">
                                <div>
                                    <label className="block text-xs font-black text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">
                                        New Secret Key
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-gray-100 dark:bg-white/5 border-2 border-white/5 rounded-2xl px-14 py-4 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">
                                        Confirm Secret Key
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            required
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-gray-100 dark:bg-white/5 border-2 border-white/5 rounded-2xl px-14 py-4 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                            placeholder="••••••••"
                                            minLength={6}
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
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-gray-900 dark:text-white rounded-[1.5rem] font-black text-lg transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] group/btn flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : (
                                        <>
                                            <span>UPDATE PASSWORD</span>
                                            <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
