import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { FileText, LogOut, User, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();

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
            <header className="fixed top-0 left-0 right-0 z-[100] bg-[var(--surface)] border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-[var(--accent)] rounded p-1.5">
                            <FileText className="text-white" size={16} />
                        </div>
                        <span className="text-[var(--text)] font-semibold text-lg tracking-tight">ToolBasketAI</span>
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
                className={`text-sm transition-colors ${active
                    ? 'text-[var(--text)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-[var(--border)] ${scrolled
            ? 'bg-[var(--glass-bg)] backdrop-blur-xl shadow-sm py-3'
            : 'bg-[var(--surface)] py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="bg-[var(--accent)] rounded p-1.5">
                        <FileText className="text-white" size={16} />
                    </div>
                    <span className="text-[var(--text)] font-semibold text-lg tracking-tight">ToolBasketAI</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
                    {navLink('/', 'Home', true)}
                    {navLink('/tools', 'Tools')}
                    <a
                        href="#features"
                        className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
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

                {/* Desktop Auth & Theme */}
                <div className="hidden lg:flex items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded hover:bg-[var(--surface-hover)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3 relative group">
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] transition-all duration-200 text-sm"
                            >
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.avatar}`}
                                        alt="Avatar"
                                        width={20}
                                        height={20}
                                        loading="lazy"
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center">
                                        <User size={11} className="text-[var(--accent)]" />
                                    </div>
                                )}
                                <span className="text-[var(--text)]">{user.name}</span>
                                <ChevronDown size={14} className="text-[var(--text-faint)]" />
                            </button>

                            {/* Dropdown */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded shadow-[var(--shadow-lift)] py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <Link href="/profile" className="flex px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">
                                    Profile
                                </Link>
                                <Link href="/history" className="flex px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">
                                    History
                                </Link>
                                <Link href="/my-resumes" className="flex px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">
                                    My Resumes
                                </Link>
                                <div className="border-t border-[var(--border)] my-1" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-[var(--surface-hover)] transition-colors"
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
                                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm bg-[var(--accent)] text-white px-4 py-2 rounded hover:bg-[var(--accent-hover)] transition-colors font-medium"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text)] p-2 rounded hover:bg-[var(--surface-hover)] transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 top-[57px] bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 bg-[var(--surface)] border-b border-[var(--border)] lg:hidden shadow-[var(--shadow-lift)] animate-slideInRight">
                        <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/tools', label: 'Tools' },
                                { href: '/about', label: 'About' },
                                { href: '/contact', label: 'Contact' },
                            ].map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-4 py-3 rounded text-sm transition-colors ${router.pathname === href
                                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            <div className="border-t border-[var(--border)] my-2" />

                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="px-4 py-3 rounded text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between w-full"
                            >
                                <span>Theme</span>
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                            </button>

                            <div className="border-t border-[var(--border)] my-2" />

                            {user ? (
                                <>
                                    <div className="px-4 py-3 flex items-center gap-2">
                                        {user.avatar ? (
                                            <Image src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.avatar}`} alt="Avatar" width={28} height={28} loading="lazy" className="w-7 h-7 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center">
                                                <User size={13} className="text-[var(--accent)]" />
                                            </div>
                                        )}
                                        <span className="text-[var(--text)] text-sm font-medium">{user.name}</span>
                                    </div>
                                    <Link href="/profile" className="px-4 py-3 rounded text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">Profile</Link>
                                    <Link href="/history" className="px-4 py-3 rounded text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">History</Link>
                                    <Link href="/my-resumes" className="px-4 py-3 rounded text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">My Resumes</Link>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-3 rounded text-sm text-red-500 hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={15} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-3 rounded text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">
                                        Sign in
                                    </Link>
                                    <Link href="/register" className="px-4 py-3 rounded bg-[var(--accent)] text-white text-sm font-medium text-center hover:bg-[var(--accent-hover)] transition-colors">
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
