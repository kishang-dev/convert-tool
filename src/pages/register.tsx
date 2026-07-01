import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Mail, Lock, User, UserPlus, Sparkles } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();
    const { login, user, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (_hasHydrated && user) {
            router.push('/tools');
        }
    }, [user, _hasHydrated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/register', { name, email, password });
            if (res.data.success) {
                login(res.data);
                router.push('/tools');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (tokenResponse: any) => {
        setError('');
        setGoogleLoading(true);
        try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const userInfo = await userInfoRes.json();

            const res = await api.post('/auth/google', {
                googleAccessToken: tokenResponse.access_token,
                googleUserInfo: userInfo,
            });

            if (res.data.success) {
                login(res.data);
                router.push('/tools');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => {
            setError('Google sign-in was cancelled or failed. Please try again.');
        },
    });

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            <SEO
                title="Create Free Account — ToolBasket"
                description="Sign up for a free ToolBasket account to save your work, access resume builder, and track your file conversion history."
                canonical="/register"
                keywords="sign up ToolBasket, create account, free PDF tools account, register online tools"
            />
            <Navbar />

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full animate-fadeIn">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="text-purple-400" size={16} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Join Us Today</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            <span className="gradient-text">Create Account</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4">Start using our powerful PDF tools for free</p>
                    </div>

                    {/* Register Form */}
                    <Card variant="elevated" className="p-6 sm:p-8">
                        {/* Google Sign-In Button */}
                        <button
                            id="google-register-btn"
                            type="button"
                            onClick={() => googleLogin()}
                            disabled={googleLoading || loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 font-medium text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        >
                            {googleLoading ? (
                                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            )}
                            {googleLoading ? 'Signing up with Google...' : 'Continue with Google'}
                        </button>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white dark:bg-[#1a1a2e] text-gray-500 dark:text-gray-400 rounded">or register with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="text-gray-500 dark:text-gray-500" size={20} />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 transition-smooth"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

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
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 transition-smooth"
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
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 transition-smooth"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                    Must be at least 8 characters long
                                </p>
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
                                <UserPlus size={20} />
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>

                            {/* Terms */}
                            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                                By creating an account, you agree to our{' '}
                                <a href="#" className="text-purple-400 hover:text-purple-300 transition-smooth">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-purple-400 hover:text-purple-300 transition-smooth">
                                    Privacy Policy
                                </a>
                            </p>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 glass text-gray-600 dark:text-gray-400">Already have an account?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <Link href="/login">
                                <Button variant="secondary" className="w-full" size="lg">
                                    Sign In
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

