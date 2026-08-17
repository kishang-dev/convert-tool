import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { FiMenu, FiX, FiChevronDown, FiSun, FiMoon, FiLogOut, FiUser, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiInstagram, FiMail, FiCopy } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
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
        document.body.style.overflow = mobileMenuOpen || shareOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen, shareOpen]);

    const copyLink = () => {
        try { navigator.clipboard && navigator.clipboard.writeText('https://toolbasketai.com'); } catch (e) { }
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 backdrop-blur-[14px] bg-[var(--surface)] border-b border-[var(--border)]">
                <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] grid place-items-center shadow-[0_6px_16px_color-mix(in_srgb,var(--accent)_40%,transparent)]">
                            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8L3 8Z" /><path d="M8 8 9.5 4h5L16 8" /></svg>
                        </div>
                        <span className="font-['Sora',sans-serif] font-extrabold text-[19px] tracking-[-0.02em] text-[var(--text)]">ToolBasket<span className="text-[var(--accent)]">AI</span></span>
                    </div>
                </div>
            </header>
        );
    }

    const navItems = [
        { href: '/', label: 'Home', exact: true },
        { href: '/about', label: 'About', exact: false },
        { href: '/contact', label: 'Contact', exact: false },
    ];

    const navLink = (href: string, label: string, exact = false) => {
        const active = exact ? router.pathname === href : router.pathname.startsWith(href);
        return (
            <Link
                key={href}
                href={href}
                className={`border-none bg-transparent font-['Poppins',sans-serif] text-[14.5px] px-3 py-2 rounded-[9px] cursor-pointer transition-colors duration-150 hover:text-[var(--text)] hover:bg-[var(--surface-hover)] ${active ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-muted)] font-medium'
                    }`}
            >
                {label}
            </Link>
        );
    };

    const shareTargets = [
        { name: 'X', bg: '#000', icon: <FiTwitter size={20} color="#fff" /> },
        { name: 'Facebook', bg: '#1877F2', icon: <FiFacebook size={20} color="#fff" /> },
        { name: 'LinkedIn', bg: '#0A66C2', icon: <FiLinkedin size={20} color="#fff" /> },
        { name: 'WhatsApp', bg: '#25D366', icon: <FiInstagram size={20} color="#fff" /> }, // Substitute for whatsapp in feather
        { name: 'Email', bg: 'var(--text-muted)', icon: <FiMail size={20} color="#fff" /> },
        { name: 'Copy', bg: 'var(--accent)', icon: <FiCopy size={20} color="#fff" /> },
    ];

    const handleShare = (target: string) => {
        const url = encodeURIComponent('https://toolbasketai.com');
        const text = encodeURIComponent('Check out ToolBasketAI - 75+ Free Online Document & PDF Tools!');
        let shareUrl = '';

        switch (target) {
            case 'X': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
            case 'Facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
            case 'LinkedIn': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
            case 'WhatsApp': shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`; break;
            case 'Email': window.location.href = `mailto:?subject=${text}&body=${url}`; return;
            case 'Copy': copyLink(); return;
        }
        if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    };

    return (
        <>
            <header
                className={`sticky top-0 z-[100] backdrop-blur-[14px] border-b border-[var(--border)] transition-all duration-300 ${scrolled ? 'bg-[var(--glass-bg)]' : 'bg-[var(--surface)]'
                    }`}
            >
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[68px] grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
                        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] grid place-items-center shadow-[0_6px_16px_color-mix(in_srgb,var(--accent)_40%,transparent)]">
                            <Image
                                src="/assets/logo1.png"
                                alt="ToolBasketAI Logo"
                                width={38}
                                height={38}
                                className="w-[38px] h-[38px] object-contain"
                            />
                        </div>
                        <span className="font-['Sora',sans-serif] font-extrabold text-[19px] tracking-[-0.02em] text-[var(--text)] whitespace-nowrap">
                            ToolBasket<span className="text-[var(--accent)]">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav — centered */}
                    <nav className="hidden lg:flex items-center justify-center gap-1" aria-label="Main navigation">
                        {navLink('/', 'Home', true)}
                        <a
                            href="#features"
                            className="border-none bg-transparent text-[var(--text-muted)] font-['Poppins',sans-serif] font-medium text-[14.5px] px-3 py-2 rounded-[9px] cursor-pointer transition-colors duration-150 hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
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
                    <div className="hidden lg:flex items-center justify-end gap-1.5">

                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            title="Toggle theme"
                            className="w-10 h-10 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] grid place-items-center cursor-pointer transition-colors duration-200 hover:text-[var(--text)]"
                        >
                            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        <button
                            onClick={() => setShareOpen(true)}
                            title="Share"
                            className="w-10 h-10 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] grid place-items-center cursor-pointer transition-colors duration-200 hover:text-[var(--text)]"
                        >
                            <FiShare2 size={18} />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3 relative group ml-2">
                                <button className="flex items-center gap-2 px-3 h-10 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all duration-200 text-sm">
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
                                            <FiUser size={11} className="text-[var(--accent)]" />
                                        </div>
                                    )}
                                    <span className="text-[var(--text)] font-semibold font-['Poppins']">{user.name}</span>
                                    <FiChevronDown size={14} className="text-[var(--text-faint)]" />
                                </button>

                                {/* Dropdown */}
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lift)] py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
                                        <FiLogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-1.5 h-10 px-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-['Poppins',sans-serif] font-semibold text-sm cursor-pointer flex items-center transition-colors duration-200 hover:border-[var(--accent)]"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden justify-self-end text-[var(--text-muted)] hover:text-[var(--text)] p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 top-[68px] bg-black/40 backdrop-blur-sm lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 bg-[var(--surface)] border-b border-[var(--border)] lg:hidden shadow-[var(--shadow-lift)] animate-slideInRight">
                            <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
                                {navItems.map(({ href, label, exact }) => {
                                    const active = exact ? router.pathname === href : router.pathname.startsWith(href);
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            className={`px-4 py-3 rounded-lg text-[14.5px] transition-colors font-['Poppins'] ${active
                                                ? 'bg-[var(--surface-hover)] text-[var(--text)] font-semibold'
                                                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] font-medium'
                                                }`}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={() => { setMobileMenuOpen(false); setShareOpen(true); }}
                                    className="px-4 py-3 rounded-lg text-[14.5px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between w-full font-medium font-['Poppins']"
                                >
                                    <span>Share ToolBasketAI</span>
                                    <FiShare2 size={15} />
                                </button>

                                <div className="border-t border-[var(--border)] my-2" />

                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="px-4 py-3 rounded-lg text-[14.5px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between w-full font-medium font-['Poppins']"
                                >
                                    <span>Theme</span>
                                    {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
                                </button>

                                <div className="border-t border-[var(--border)] my-2" />

                                {user ? (
                                    <>
                                        <div className="px-4 py-3 flex items-center gap-2">
                                            {user.avatar ? (
                                                <Image src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.avatar}`} alt="Avatar" width={28} height={28} loading="lazy" className="w-7 h-7 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center">
                                                    <FiUser size={13} className="text-[var(--accent)]" />
                                                </div>
                                            )}
                                            <span className="text-[var(--text)] text-[14.5px] font-semibold font-['Poppins']">{user.name}</span>
                                        </div>
                                        <Link href="/profile" className="px-4 py-3 rounded-lg text-[14.5px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-medium font-['Poppins']">Profile</Link>
                                        <Link href="/history" className="px-4 py-3 rounded-lg text-[14.5px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-medium font-['Poppins']">History</Link>
                                        <Link href="/my-resumes" className="px-4 py-3 rounded-lg text-[14.5px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-medium font-['Poppins']">My Resumes</Link>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-3 rounded-lg text-[14.5px] text-red-500 hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2 font-medium font-['Poppins']"
                                        >
                                            <FiLogOut size={15} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="px-4 py-3 rounded-lg text-[14.5px] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-semibold font-['Poppins'] border border-[var(--border)] text-center mb-2">
                                            Sign In
                                        </Link>
                                        <Link href="/register" className="px-4 py-3 rounded-lg bg-[var(--accent)] text-white text-[14.5px] font-semibold font-['Poppins'] text-center hover:opacity-90 transition-opacity shadow-md shadow-[var(--accent)]/30">
                                            Upgrade
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </>
                )}
            </header>

            {/* SHARE MODAL */}
            {shareOpen && (
                <div
                    onClick={() => setShareOpen(false)}
                    className="fixed inset-0 z-[1000] bg-[rgba(10,10,20,0.55)] backdrop-blur-sm grid place-items-center p-6 animate-fadeIn"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[440px] bg-[var(--surface)] border border-[var(--border)] rounded-[22px] p-7 shadow-[0_18px_50px_rgba(0,0,0,0.15)] animate-slideUp"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-['Sora',sans-serif] font-extrabold text-xl m-0 text-[var(--text)]">Share ToolBasketAI</h3>
                            <button
                                onClick={() => setShareOpen(false)}
                                className="w-[34px] h-[34px] rounded-[9px] border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-muted)] cursor-pointer grid place-items-center"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mb-[22px] font-['Poppins',sans-serif]">Tell the world about these free tools.</p>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                            {shareTargets.map((s) => (
                                <button
                                    key={s.name}
                                    onClick={() => handleShare(s.name)}
                                    className="flex flex-col items-center gap-2 py-3.5 px-1.5 rounded-[14px] border border-[var(--border)] bg-[var(--surface-hover)] cursor-pointer transition-transform duration-150 hover:-translate-y-1"
                                >
                                    <span className="w-[42px] h-[42px] rounded-xl grid place-items-center" style={{ background: s.bg }}>{s.icon}</span>
                                    <span className="text-[11.5px] text-[var(--text-muted)] font-medium font-['Poppins',sans-serif]">{s.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl py-1.5 pr-1.5 pl-3.5">
                            <span className="flex-1 text-[13.5px] text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap font-['Poppins',sans-serif]">https://toolbasketai.com</span>
                            <button
                                onClick={copyLink}
                                className="h-[38px] px-4 rounded-[9px] border-none bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] text-white font-['Poppins',sans-serif] font-semibold text-[13.5px] cursor-pointer whitespace-nowrap"
                            >
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}