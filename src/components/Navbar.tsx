import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FileText, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
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
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileMenuOpen(false); }, [router.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    if (!mounted) {
        return (
            <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a] border-b border-[#1a1a1a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-white rounded-md p-1.5">
                            <FileText className="text-black" size={18} />
                        </div>
                        <span className="text-white font-semibold text-lg tracking-tight">QuickPDF</span>
                    </div>
                </div>
            </header>
        );
    }

    const navLink = (href: string, label: string, exact = false) => {
        const active = exact ? router.pathname === href : router.pathname.startsWith(href);
        return (
            <Link
                href={href}
                className={`text-sm transition-colors ${active ? 'text-white font-medium' : 'text-[#888] hover:text-white'}`}
            >
                {label}
            </Link>
        );
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
            ? 'bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-[#1a1a1a] shadow-xl py-3'
            : 'bg-[#0a0a0a] border-b border-[#1a1a1a] py-4'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="bg-white rounded-md p-1.5">
                        <FileText className="text-black" size={18} />
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">QuickPDF</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-7">
                    {navLink('/', 'Home', true)}
                    {navLink('/tools', 'Tools')}
                    <a
                        href="#features"
                        className="text-sm text-[#888] hover:text-white transition-colors"
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
                    {navLink('/about', 'About')}
                    {navLink('/contact', 'Contact')}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden lg:flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3 relative group">
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#222] bg-[#111] hover:border-[#333] transition-colors text-sm">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                                        alt="Avatar"
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                                        <User size={12} className="text-[#888]" />
                                    </div>
                                )}
                                <span className="text-white">{user.name}</span>
                                <ChevronDown size={14} className="text-[#555]" />
                            </button>

                            {/* Dropdown */}
                            <div className="absolute top-full right-0 mt-2 w-44 bg-[#111] border border-[#222] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                                <Link href="/profile" className="flex px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors">
                                    Profile
                                </Link>
                                <Link href="/history" className="flex px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors">
                                    History
                                </Link>
                                <Link href="/my-resumes" className="flex px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors">
                                    My Resumes
                                </Link>
                                <div className="border-t border-[#1a1a1a] my-1" />
                                <button
                                    onClick={logout}
                                    className="w-full flex px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-[#1a1a1a] transition-colors items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-[#888] hover:text-white transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-[#888] hover:text-white p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 top-[57px] bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-[#1a1a1a] lg:hidden shadow-2xl animate-slideInRight">
                        <nav className="flex flex-col p-4 gap-1">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/tools', label: 'Tools' },
                                { href: '/about', label: 'About' },
                                { href: '/contact', label: 'Contact' },
                            ].map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-4 py-3 rounded-lg text-sm transition-colors ${router.pathname === href ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888] hover:text-white hover:bg-[#111]'}`}
                                >
                                    {label}
                                </Link>
                            ))}

                            <div className="border-t border-[#1a1a1a] my-2" />

                            {user ? (
                                <>
                                    <div className="px-4 py-3 flex items-center gap-2">
                                        {user.avatar ? (
                                            <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-[#222] flex items-center justify-center">
                                                <User size={14} className="text-[#888]" />
                                            </div>
                                        )}
                                        <span className="text-white text-sm font-medium">{user.name}</span>
                                    </div>
                                    <Link href="/profile" className="px-4 py-3 rounded-lg text-sm text-[#888] hover:text-white hover:bg-[#111] transition-colors">Profile</Link>
                                    <Link href="/history" className="px-4 py-3 rounded-lg text-sm text-[#888] hover:text-white hover:bg-[#111] transition-colors">History</Link>
                                    <Link href="/my-resumes" className="px-4 py-3 rounded-lg text-sm text-[#888] hover:text-white hover:bg-[#111] transition-colors">My Resumes</Link>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-[#111] transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={15} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-3 rounded-lg text-sm text-[#888] hover:text-white hover:bg-[#111] transition-colors">
                                        Sign in
                                    </Link>
                                    <Link href="/register" className="px-4 py-3 rounded-lg bg-white text-black text-sm font-medium text-center hover:bg-gray-100 transition-colors">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
}
