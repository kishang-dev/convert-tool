import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FileText, LogOut, User, Sparkles, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [router.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    if (!mounted) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-2">
                            <FileText className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold gradient-text">
                            QuickPDF Tools
                        </span>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${scrolled ? 'glass-strong shadow-xl' : 'glass'
            }`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover-scale transition-smooth">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-2 shadow-lg">
                        <FileText className="text-white" size={24} />
                    </div>
                    <span className="text-xl md:text-2xl font-bold gradient-text">
                        QuickPDF Tools
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    <Link
                        href="/"
                        className={`text-gray-300 hover:text-white transition-smooth ${router.pathname === '/' ? 'text-white font-semibold' : ''
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/tools"
                        className={`text-gray-300 hover:text-white transition-smooth ${router.pathname === '/tools' ? 'text-white font-semibold' : ''
                            }`}
                    >
                        Tools
                    </Link>
                    <a
                        href="#features"
                        className="text-gray-300 hover:text-white transition-smooth"
                        onClick={(e) => {
                            if (router.pathname === '/') {
                                e.preventDefault();
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                router.push('/#features');
                            }
                        }}
                    >
                        Features
                    </a>
                    <Link href="/svg" className="text-gray-300 hover:text-white transition-smooth">
                        Image to SVG
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 glass px-3 py-2 rounded-lg">
                                <User size={18} className="text-purple-400" />
                                <span className="text-white font-medium">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="text-gray-300 hover:text-red-400 flex items-center gap-1 transition-smooth"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-300 hover:text-white transition-smooth"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 lg:px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-smooth shadow-lg hover-lift"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {!user && (
                        <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 lg:px-6 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-smooth shadow-lg hover-lift flex items-center gap-2">
                            <Sparkles size={16} />
                            <span className="hidden lg:inline">Upgrade to Pro</span>
                            <span className="lg:hidden">Pro</span>
                        </button>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-smooth"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
                        style={{ top: '72px' }}
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div
                        className="fixed top-[72px] left-0 right-0 glass-strong border-t border-gray-700 md:hidden animate-slideInRight shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}
                    >
                        <nav className="flex flex-col p-4 space-y-2">
                            <Link
                                href="/"
                                className={`px-4 py-3 rounded-lg transition-smooth ${router.pathname === '/'
                                    ? 'bg-purple-600 text-white font-semibold'
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/tools"
                                className={`px-4 py-3 rounded-lg transition-smooth ${router.pathname === '/tools'
                                    ? 'bg-purple-600 text-white font-semibold'
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Tools
                            </Link>
                            <a
                                href="#features"
                                className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-smooth"
                                onClick={(e) => {
                                    if (router.pathname === '/') {
                                        e.preventDefault();
                                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                        setMobileMenuOpen(false);
                                    } else {
                                        router.push('/#features');
                                    }
                                }}
                            >
                                Features
                            </a>
                            <Link
                                href="/svg"
                                className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-smooth"
                            >
                                Image to SVG
                            </Link>

                            <div className="border-t border-gray-700 my-2"></div>

                            {user ? (
                                <>
                                    <div className="px-4 py-3 glass rounded-lg flex items-center gap-2">
                                        <User size={18} className="text-purple-400" />
                                        <span className="text-white font-medium">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-smooth flex items-center gap-2"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-smooth"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-center hover:from-purple-700 hover:to-blue-700 transition-smooth shadow-lg"
                                    >
                                        Register
                                    </Link>
                                    <button className="px-4 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-700 hover:to-purple-700 transition-smooth shadow-lg flex items-center justify-center gap-2">
                                        <Sparkles size={16} />
                                        Upgrade to Pro
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
}


