import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Sparkles, Mail, Send, CheckCircle, ArrowLeft } from "lucide-react";
import { authApi } from "@/services/api";
import Link from "next/link";
import Footer from "@/components/Footer";
import Card from '@/components/Card';
import Button from '@/components/Button';
import SEO from '@/components/SEO';

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
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            <SEO
                title="Forgot Password"
                description="Reset your ToolBasketAI account password. Enter your email to receive a secure magic reset link."
                canonical="/auth/forgot-password"
                noIndex={true}
            />
            <Navbar />

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full animate-fadeIn">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="text-purple-400" size={16} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Recover Access</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            <span className="gradient-text">Forgot Password</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4">
                            {isSent ? "Check your inbox for the reset link" : "We'll send you a magic reset link"}
                        </p>
                    </div>

                    <Card variant="elevated" className="p-6 sm:p-8">
                        {isSent ? (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                        <CheckCircle className="text-green-500" size={32} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Email Sent!</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    We've sent a password reset link to <span className="text-gray-900 dark:text-white font-bold">{email}</span>. Please check your inbox.
                                </p>
                                <Link href="/login" className="block">
                                    <Button className="w-full" size="lg">
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="text-gray-500 dark:text-gray-500" size={20} />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            className="glass w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 transition-smooth"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="glass-strong border-l-4 border-red-500 p-4 rounded-lg">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    loading={isLoading}
                                >
                                    <Send size={20} className="mr-2" />
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>
                        )}
                    </Card>

                    {/* Back to Login */}
                    {!isSent && (
                        <div className="text-center mt-6">
                            <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-400 transition-smooth text-sm font-medium">
                                <ArrowLeft size={16} />
                                Wait, I remember it!
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
