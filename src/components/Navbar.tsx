import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { FiMenu, FiX, FiChevronDown, FiSun, FiMoon, FiLogOut, FiUser, FiSearch, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiInstagram, FiMail, FiCopy } from 'react-icons/fi';

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
            <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', display: 'grid', placeItems: 'center', boxShadow: '0 6px 16px color-mix(in srgb, var(--accent) 40%, transparent)' }}>
                            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8L3 8Z" /><path d="M8 8 9.5 4h5L16 8" /></svg>
                        </div>
                        <span style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 19, letterSpacing: '-.02em', color: 'var(--text)' }}>ToolBasket<span style={{ color: 'var(--accent)' }}>AI</span></span>
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
                style={{
                    border: 'none', background: 'transparent',
                    color: active ? 'var(--text)' : 'var(--text-muted)',
                    fontFamily: '"Poppins", sans-serif', fontWeight: active ? 600 : 500,
                    fontSize: 14.5, padding: '8px 12px', borderRadius: 9, cursor: 'pointer',
                    transition: 'color .15s, background .15s'
                }}
                className="hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
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
        const text = encodeURIComponent('Check out ToolBasketAI - 40+ Free Online Document & PDF Tools!');
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
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                backdropFilter: 'blur(14px)',
                background: scrolled ? 'var(--glass-bg)' : 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', gap: 20 }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', display: 'grid', placeItems: 'center', boxShadow: '0 6px 16px color-mix(in srgb, var(--accent) 40%, transparent)' }}>
                            <Image
                                src="/assets/logo1.png"
                                alt="ToolBasketAI Logo"
                                width={38}
                                height={38}
                                style={{ width: 38, height: 38, objectFit: 'contain' }}
                            />
                        </div>
                        <span style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 19, letterSpacing: '-.02em', color: 'var(--text)' }}>ToolBasket<span style={{ color: 'var(--accent)' }}>AI</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1 ml-3" aria-label="Main navigation">
                        {navLink('/', 'Home', true)}
                        <a
                            href="#features"
                            style={{
                                border: 'none', background: 'transparent',
                                color: 'var(--text-muted)',
                                fontFamily: '"Poppins", sans-serif', fontWeight: 500,
                                fontSize: 14.5, padding: '8px 12px', borderRadius: 9, cursor: 'pointer',
                                transition: 'color .15s, background .15s'
                            }}
                            className="hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
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

                    <div style={{ flex: 1 }}></div>

                    {/* Desktop Auth & Theme */}
                    <div className="hidden lg:flex items-center gap-1.5">

                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            title="Toggle theme"
                            className="hover:text-[var(--text)]"
                            style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        <button
                            onClick={() => setShareOpen(true)}
                            title="Share"
                            className="hover:text-[var(--text)]"
                            style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                            <FiShare2 size={18} />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3 relative group ml-2">
                                <button
                                    className="flex items-center gap-2 px-3 h-[40px] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all duration-200 text-sm"
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
                            <>
                                <Link
                                    href="/login"
                                    className="hover:border-[var(--accent)]"
                                    style={{ marginLeft: 6, height: 40, padding: '0 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'border-color 0.2s' }}
                                >
                                    Sign In
                                </Link>
                                {/* <Link
                                    href="/register"
                                    style={{ height: 40, padding: '0 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', color: '#fff', fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '0 8px 20px color-mix(in srgb, var(--accent) 35%, transparent)', display: 'flex', alignItems: 'center' }}
                                >
                                    Upgrade
                                </Link> */}
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text)] p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
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
                                {[
                                    { href: '/', label: 'Home' },
                                    { href: '/about', label: 'About' },
                                    { href: '/contact', label: 'Contact' },
                                ].map(({ href, label }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`px-4 py-3 rounded-lg text-sm transition-colors font-['Poppins'] ${router.pathname === href
                                            ? 'bg-[var(--surface-hover)] text-[var(--text)] font-semibold'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] font-medium'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => { setMobileMenuOpen(false); setShareOpen(true); }}
                                    className="px-4 py-3 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between w-full font-medium font-['Poppins']"
                                >
                                    <span>Share ToolBasketAI</span>
                                    <FiShare2 size={15} />
                                </button>

                                <div className="border-t border-[var(--border)] my-2" />

                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="px-4 py-3 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between w-full font-medium font-['Poppins']"
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
                                            <span className="text-[var(--text)] text-sm font-semibold font-['Poppins']">{user.name}</span>
                                        </div>
                                        <Link href="/profile" className="px-4 py-3 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-medium font-['Poppins']">Profile</Link>
                                        <Link href="/history" className="px-4 py-3 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-medium font-['Poppins']">History</Link>
                                        <Link href="/my-resumes" className="px-4 py-3 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-medium font-['Poppins']">My Resumes</Link>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2 font-medium font-['Poppins']"
                                        >
                                            <FiLogOut size={15} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="px-4 py-3 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors font-semibold font-['Poppins'] border border-[var(--border)] text-center mb-2">
                                            Sign In
                                        </Link>
                                        <Link href="/register" className="px-4 py-3 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold font-['Poppins'] text-center hover:opacity-90 transition-opacity shadow-md shadow-[var(--accent)]/30">
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
                <div onClick={() => setShareOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,10,20,.55)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', padding: 24 }} className="animate-fadeIn">
                    <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 440, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 22, padding: 28, boxShadow: '0 18px 50px rgba(0,0,0,.15)' }} className="animate-slideUp">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <h3 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 20, margin: 0, color: 'var(--text)' }}>Share ToolBasketAI</h3>
                            <button onClick={() => setShareOpen(false)} style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface-hover)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, display: 'grid', placeItems: 'center' }}>
                                <FiX size={18} />
                            </button>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 22px', fontFamily: '"Poppins", sans-serif' }}>Tell the world about these free tools.</p>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                            {shareTargets.map((s) => (
                                <button key={s.name} onClick={() => handleShare(s.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 6px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface-hover)', cursor: 'pointer', transition: 'transform .15s' }} className="hover:-translate-y-1">
                                    <span style={{ width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center', background: s.bg }}>{s.icon}</span>
                                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500, fontFamily: '"Poppins", sans-serif' }}>{s.name}</span>
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 12, padding: '6px 6px 6px 14px' }}>
                            <span style={{ flex: 1, fontSize: 13.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: '"Poppins", sans-serif' }}>https://toolbasketai.com</span>
                            <button onClick={copyLink} style={{ height: 38, padding: '0 16px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', color: '#fff', fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
