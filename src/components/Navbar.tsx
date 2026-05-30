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
            <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10">
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
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
            ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
            : 'bg-[#0a0a0f]/40 backdrop-blur-md py-4 sm:py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover-scale transition-smooth">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-2 shadow-lg">
                        <FileText className="text-white" size={24} />
                    </div>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold gradient-text whitespace-nowrap">
                        QuickPDF Tools
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center gap-6 lg:gap-8">
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
                    <Link
                        href="/svg"
                        className={`hover:text-white transition-smooth uppercase text-xs font-black tracking-widest ${router.pathname === '/svg' ? 'text-white' : 'text-gray-400'
                            }`}
                    >
                        Image to SVG
                    </Link>
                    <Link
                        href="/about"
                        className={`hover:text-white transition-smooth uppercase text-xs font-black tracking-widest ${router.pathname === '/about' ? 'text-white' : 'text-gray-400'
                            }`}
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className={`hover:text-white transition-smooth uppercase text-xs font-black tracking-widest ${router.pathname === '/contact' ? 'text-white' : 'text-gray-400'
                            }`}
                    >
                        Contact
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4 group relative">
                            <div className="flex items-center gap-2 glass px-3 py-2 rounded-lg cursor-pointer">
                                {user.avatar ? (
                                    <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-purple-500/30" />
                                ) : (
                                    <User size={18} className="text-purple-400" />
                                )}
                                <span className="text-white font-medium">{user.name}</span>
                            </div>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <div className="flex flex-col py-2">
                                    <Link href="/profile" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                        Profile
                                    </Link>
                                    <Link href="/history" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                        History
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
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
                    className="xl:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-smooth"
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
                        className="absolute top-full left-0 right-0 h-screen bg-black/60 backdrop-blur-sm xl:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div
                        className="absolute top-full left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 xl:hidden animate-slideInRight shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}
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
                                className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-smooth font-bold uppercase text-xs tracking-widest"
                            >
                                Image to SVG
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-smooth font-bold uppercase text-xs tracking-widest"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="px-4 py-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-smooth font-bold uppercase text-xs tracking-widest"
                            >
                                Contact
                            </Link>

                            <div className="border-t border-gray-700 my-2"></div>

                            {user ? (
                                <>
                                    <div className="px-4 py-3 glass rounded-lg flex items-center gap-2">
                                        {user.avatar ? (
                                            <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-purple-500/30" />
                                        ) : (
                                            <User size={18} className="text-purple-400" />
                                        )}
                                        <span className="text-white font-medium">{user.name}</span>
                                    </div>
                                    <Link href="/profile" className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-smooth">
                                        Profile
                                    </Link>
                                    <Link href="/history" className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-smooth">
                                        History
                                    </Link>
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


