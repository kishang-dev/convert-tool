import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Sparkles, Lock, CheckCircle, ShieldCheck } from "lucide-react";
import { authApi } from "@/services/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Footer from "@/components/Footer";
import Card from '@/components/Card';
import Button from '@/components/Button';

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
        <div className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full animate-fadeIn">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] px-4 py-2 rounded-full mb-4">
                            <Sparkles className="text-[var(--accent)]" size={16} />
                            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">New Strength</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            <span className="gradient-text">Reset Password</span>
                        </h2>
                        <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm sm:text-base px-4">
                            Secure your account with a new password
                        </p>
                    </div>

                    <Card variant="elevated" className="p-6 sm:p-8">
                        {isSuccess ? (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                        <CheckCircle className="text-green-500" size={32} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)] mb-4">Password reset successful!</h3>
                                <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-8 leading-relaxed">
                                    Your new password is now active. You will be redirected to the login page momentarily.
                                </p>
                                <Link href="/login" className="block">
                                    <Button variant="accent" className="w-full" size="lg">
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="text-[var(--text-faint)] dark:text-[var(--text-faint)]" size={20} />
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            required
                                            minLength={6}
                                            className="bg-[var(--bg)] border border-[var(--border-strong)] w-full pl-10 pr-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-[var(--text)] dark:text-[var(--text)] placeholder-[var(--text-faint)] transition-smooth"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="text-[var(--text-faint)] dark:text-[var(--text-faint)]" size={20} />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            minLength={6}
                                            className="bg-[var(--bg)] border border-[var(--border-strong)] w-full pl-10 pr-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-[var(--text)] dark:text-[var(--text)] placeholder-[var(--text-faint)] transition-smooth"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-[var(--surface-hover)] border border-[var(--border-strong)] border-l-4 border-red-500 p-4 rounded">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <Button
                                    variant="accent"
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    loading={isLoading}
                                >
                                    <ShieldCheck size={20} className="mr-2" />
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
}
