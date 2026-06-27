import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.success) {
                login(res.data);
                router.push('/tools');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            <Navbar />

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full animate-fadeIn">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="text-purple-400" size={16} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Welcome Back</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            <span className="gradient-text">Sign In</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4">Access your PDF tools and files</p>
                    </div>

                    {/* Login Form */}
                    <Card variant="elevated" className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
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

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-gray-500 dark:text-gray-500" size={20} />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        className="glass w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 transition-smooth"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="text-right mt-2 font-medium">
                                    <Link href="/auth/forgot-password" title="Recover Password" className="text-xs text-purple-400 hover:text-purple-300 transition-smooth uppercase tracking-widest">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="glass-strong border-l-4 border-red-500 p-4 rounded-lg">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={loading}
                            >
                                <LogIn size={20} />
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 glass text-gray-600 dark:text-gray-400">Don't have an account?</span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <Link href="/register">
                                <Button variant="secondary" className="w-full" size="lg">
                                    Create Account
                                </Button>
                            </Link>
                        </form>
                    </Card>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-400 transition-smooth text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

