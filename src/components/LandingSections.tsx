import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiCheck, FiArrowRight, FiShield, FiZap, FiGlobe, FiClock, FiUsers, FiChevronRight } from 'react-icons/fi';
import {
    LuFiles, LuScissors, LuPackage, LuPenLine, LuLock, LuLockOpen, LuRotateCcw, LuImage,
    LuFileText, LuFileOutput, LuTable, LuMonitor, LuCode, LuGlobe, LuFilePlus, LuFileDown,
    LuVolume2, LuMic, LuVideo, LuHeadphones, LuMaximize2, LuCrop, LuRefreshCw, LuPenTool,
    LuBriefcase, LuChartBar, LuKey, LuBraces, LuSquareCheck, LuArrowLeftRight,
    LuSearch, LuFileCode, LuDatabase, LuLayoutGrid, LuScanText, LuSparkles, LuArrowRight,
} from 'react-icons/lu';
import Button from './Button';
import { C, allTools, toolIcons, catIcons, benefits, freeFeatures } from '../data/landingData';
import { blogApi } from '../services/api';

export function LandingHero({ query, setQuery, rotIdx, wcolors, words }: any) {
    return (
        <section className="relative overflow-hidden pt-[84px] px-6 pb-16">
            <div className="absolute w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_70%)] -top-[120px] -right-[60px] pointer-events-none animate-[tbFloat_9s_ease-in-out_infinite]" />
            <div className="absolute w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,#8B5CF6_26%,transparent),transparent_70%)] -bottom-[140px] -left-[60px] pointer-events-none animate-[tbFloat2_11s_ease-in-out_infinite]" />

            <div className="max-w-[900px] mx-auto text-center relative">
                <div className="inline-flex items-center gap-2 px-[15px] py-[7px] rounded-full bg-[var(--surface)] border border-[var(--border)] text-[13px] font-medium text-[var(--text-muted)] mb-[26px]">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#22C55E] shadow-[0_0_0_3px_color-mix(in_srgb,#22C55E_25%,transparent)]"></span>
                    40+ free tools · no sign-up required
                </div>
                <h1 className="font-['Sora',sans-serif] font-extrabold text-[clamp(38px,6vw,66px)] leading-[1.05] tracking-[-.03em] m-0 mb-5 text-[var(--text)]">
                    Smarter Tools for<br />
                    <span key={rotIdx} style={{ color: wcolors[rotIdx % wcolors.length] }} className="inline-block animate-[tbWordIn_0.5s_ease]">
                        {words[rotIdx]}
                    </span>
                    {' '}— Free
                </h1>
                <p className="text-[18px] text-[var(--text-muted)] max-w-[560px] mx-auto mt-0 mb-[34px] leading-[1.6] font-['Poppins',sans-serif]">
                    Convert, merge, split, compress and process your PDFs, images and documents — entirely free, right in your browser.
                </p>
                <div id="tb-search" className="max-w-[620px] mx-auto flex items-center gap-2 bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[16px] p-[8px_8px_8px_18px] shadow-[0_18px_50px_rgba(0,0,0,.10)]">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" className="shrink-0"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
                    <input value={query} onChange={(e) => { setQuery(e.target.value); }} placeholder='Search 40+ tools — try "merge", "resize", "OCR"…' className="flex-1 border-none outline-none bg-transparent text-[var(--text)] font-['Poppins',sans-serif] text-[16px] p-[10px_4px] min-w-0" />
                    <button onClick={() => { document.getElementById('tb-tools')?.scrollIntoView({ behavior: 'smooth' }); }} className="h-11 px-[22px] rounded-[11px] border-none bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] text-white font-['Poppins',sans-serif] font-semibold text-[15px] cursor-pointer shrink-0">Search</button>
                </div>
            </div>
        </section>
    );
}

export function LandingCategories({ setTab, setQuery }: any) {
    return (
        <section className="max-w-7xl mx-auto px-6 pt-6 pb-5">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
                {(Object.entries(C) as [keyof typeof C, typeof C[keyof typeof C]][]).map(([key, cat]) => (
                    <div
                        key={key}
                        onClick={() => { setTab(key); setQuery(''); document.getElementById('tb-tools')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="cursor-pointer bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-[22px] shadow-[0_10px_30px_rgba(20,20,43,0.06)] transition-[transform,box-shadow,border-color] duration-[220ms] cubic-bezier-[.2,.8,.2,1] hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,20,43,0.10)] hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--border))]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-[13px] grid place-items-center" style={{ background: cat.tint }}>
                                {React.createElement(catIcons[key], { size: 22, color: cat.color })}
                            </div>
                            <span className="text-[12px] font-semibold text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)] px-[10px] py-1 rounded-full">{cat.count}</span>
                        </div>
                        <h3 className="font-['Sora',sans-serif] font-bold text-[18px] m-0 mb-1.5 text-[var(--text)]">{cat.label}</h3>
                        <p className="text-[13.5px] text-[var(--text-muted)] m-0 mb-3.5 leading-[1.5] font-['Poppins',sans-serif]">{cat.desc}</p>
                        <div className="text-[13px] font-semibold flex items-center gap-1.5 font-['Poppins',sans-serif]" style={{ color: cat.color }}>
                            Featured: {cat.featured}
                            <LuArrowRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function LandingTools({ query, list, tabKeys, tab, setTab, setQuery, tabLabels }: any) {
    const router = useRouter();
    return (
        <section id="tb-tools" className="max-w-7xl mx-auto mt-[60px] mb-0 px-6 scroll-mt-[90px]">
            <div className="text-center mb-[30px]">
                <h2 className="font-['Sora',sans-serif] font-extrabold text-[clamp(28px,4vw,42px)] tracking-[-.02em] m-0 mb-2.5 text-[var(--text)]">
                    {query ? `Search Results for "${query}"` : "Our Most Popular Tools"}
                </h2>
                <p className="text-[var(--text-muted)] text-base m-0 font-['Poppins',sans-serif]">
                    {query ? `Found ${list.length} tool${list.length === 1 ? '' : 's'}` : "The best of the best — all free, no catch."}
                </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2.5 mb-[26px] justify-center flex-wrap" style={{ WebkitOverflowScrolling: 'touch' as any }}>
                {tabKeys.map((k: string) => {
                    const active = tab === k && !query;
                    return (
                        <button
                            key={k}
                            onClick={() => { setTab(k); setQuery(''); }}
                            className={`font-['Poppins',sans-serif] font-semibold text-sm px-[18px] py-[9px] rounded-[11px] cursor-pointer whitespace-nowrap transition-all duration-200 ${active
                                ? 'border border-transparent bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] text-white shadow-[0_8px_20px_color-mix(in_srgb,var(--accent)_30%,transparent)]'
                                : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
                                }`}
                        >
                            {tabLabels[k as keyof typeof tabLabels]}
                        </button>
                    );
                })}
            </div>

            {list.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
                    {list.map((t: any) => {
                        const catKey = t[1] as keyof typeof C;
                        const cat = C[catKey];
                        return (
                            <div key={t[0]} onClick={() => router.push(t[3])} className="cursor-pointer bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-[18px] flex gap-[14px] items-start shadow-[0_10px_30px_rgba(20,20,43,0.06)] transition-[transform,box-shadow,border-color] duration-[220ms] hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,20,43,0.10)] hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--border))]">
                                <div className="shrink-0 w-11 h-11 rounded-xl grid place-items-center" style={{ background: cat.tint }}>
                                    {React.createElement(toolIcons[t[0]] || catIcons[catKey], { size: 20, color: cat.color })}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-['Sora',sans-serif] font-bold text-[15.5px] m-0 whitespace-nowrap overflow-hidden text-ellipsis text-[var(--text)]">{t[0]}</h3>
                                    <span className="inline-block text-[11px] font-semibold mt-[3px] mb-[5px] mx-0" style={{ color: cat.color }}>{cat.label}</span>
                                    <p className="text-[13px] text-[var(--text-muted)] m-0 leading-[1.5] font-['Poppins',sans-serif]">{t[2]}</p>
                                </div>
                                <LuArrowRight size={17} color="var(--text-muted)" className="shrink-0 mt-1" />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-[60px] px-5 text-[var(--text-muted)]">
                    <div className="text-[42px] mb-2.5">🔍</div>
                    <p className="text-base m-0 font-['Poppins',sans-serif]">No tools match “{query}”. Try another search.</p>
                </div>
            )}
        </section>
    );
}

export function LandingStats() {
    return (
        <section className="max-w-7xl mx-auto my-[30px] px-6">
            <div className="bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] rounded-[22px] p-[34px_24px] grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5 shadow-[0_18px_50px_rgba(0,0,0,.10)]">
                {[
                    { num: '1K+', label: 'Active Users' },
                    { num: '5K+', label: 'Files Processed' },
                    { num: '40+', label: 'Free Tools' },
                    { num: '99.9%', label: 'OCR Accuracy' }
                ].map((s) => (
                    <div key={s.label} className="text-center text-white">
                        <div className="font-['Sora',sans-serif] font-extrabold text-[34px] tracking-[-.02em]">{s.num}</div>
                        <div className="text-[13.5px] opacity-90 mt-1 font-['Poppins',sans-serif] uppercase tracking-[1px]">{s.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function LandingPremium() {
    const router = useRouter();
    return (
        <section className="bg-[var(--surface-hover)] border-y border-[var(--border)] py-[66px] px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-[34px]">
                    <span className="text-[13px] font-semibold text-[var(--accent)] tracking-[.08em] uppercase">Premium quality · $0</span>
                    <h2 className="font-['Sora',sans-serif] font-extrabold text-[clamp(26px,4vw,40px)] tracking-[-.02em] mt-2.5 mb-2 text-[var(--text)]">Free Tools You'd Usually Pay For</h2>
                    <p className="text-[var(--text-muted)] text-base m-0 font-['Poppins',sans-serif]">No limits, no watermarks, no sign-up.</p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
                    {[
                        { name: 'Merge PDF', cat: 'pdf', desc: 'Combine any number of PDFs into a single, polished file — drag to reorder.', link: '/merge-pdf' },
                        { name: 'AI Resume Builder', cat: 'ai', desc: 'Craft a recruiter-ready resume in minutes with AI-guided sections.', link: '/resume-builder' },
                        { name: 'Precision OCR', cat: 'ocr', desc: 'Turn scanned pages and photos into editable text across 100+ languages.', link: '/ocr' }
                    ].map(f => {
                        const cat = C[f.cat as keyof typeof C];
                        return (
                            <div key={f.name} onClick={() => router.push(f.link)} className="cursor-pointer bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)] transition-all duration-300">
                                <div className="h-[150px] grid place-items-center relative" style={{ background: cat.grad }}>
                                    <div className="w-[66px] h-[66px] rounded-[18px] bg-[rgba(255,255,255,.22)] backdrop-blur-[6px] grid place-items-center">
                                        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {f.cat === 'pdf' && <><path d="M14 3v5h5" /><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5z" /><path d="M8 13h5M8 17h4" /></>}
                                            {f.cat === 'ai' && <><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><rect x="7" y="7" width="10" height="10" rx="3" /><path d="M10 11h4M10 14h2" /></>}
                                            {f.cat === 'ocr' && <><path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 0-1 1h-3" /><path d="M8 12h8" /></>}
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-['Sora',sans-serif] font-bold text-[18px] m-0 mb-1.5 text-[var(--text)]">{f.name}</h3>
                                    <p className="text-[14px] text-[var(--text-muted)] m-0 mb-3.5 leading-[1.55] font-['Poppins',sans-serif]">{f.desc}</p>
                                    <span className="text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1.5 font-['Poppins',sans-serif]">Try it free <FiChevronRight size={15} /></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function LandingBenefits() {
    return (
        <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-2">Why ToolBasketAI</p>
                    <h2 style={{ fontFamily: '"Sora", sans-serif' }} className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
                        Built for precision & speed
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-2 max-w-lg font-['Poppins']">
                        A rock-solid infrastructure to handle your most complex document tasks without breaking a sweat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {benefits.map((b, i) => {
                        const Icon = b.icon;
                        return (
                            <div
                                key={i}
                                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 24, transition: 'all 0.3s ease' }}
                                className="hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)] feature-card"
                            >
                                <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 16, transition: 'all 0.3s ease' }} className="feature-icon-box">
                                    <Icon size={20} className="text-[var(--accent)] transition-colors duration-300 feature-icon" />
                                </div>
                                <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>{b.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{b.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function LandingAbout() {
    const router = useRouter();
    return (
        <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-2">About</p>
                    <h2 className="font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight mb-4">
                        The vision behind ToolBasketAI
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 font-['Poppins',sans-serif]">
                        Founded in 2026, ToolBasketAI was born out of a simple need: universal, high-speed document processing without the clutter of traditional tools. We believe professional-grade tools should be accessible to everyone, anywhere.
                    </p>
                    <Button variant="secondary" onClick={() => router.push('/about')}>
                        Read Our Story
                    </Button>
                </div>

                <div className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-3xl p-[30px] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                    <div className="flex flex-col gap-6">
                        {[
                            { label: 'PDF Processing', pct: 99 },
                            { label: 'AI Accuracy', pct: 95 },
                            { label: 'SVG Vectorization', pct: 92 },
                        ].map(({ label, pct }) => (
                            <div key={label}>
                                <div className="flex justify-between text-[13px] font-semibold mb-2 font-['Poppins',sans-serif]">
                                    <span className="text-[var(--text)]">{label}</span>
                                    <span className="text-[var(--accent)]">{pct}%</span>
                                </div>
                                <div className="h-1.5 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#8B5CF6] transition-[width] duration-1000 ease-out"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function LandingPricing() {
    return (
        <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center">
                    <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-2">Pricing</p>
                    <h2 className="font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">Simple, transparent access</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-2 font-['Poppins',sans-serif]">Professional tools should be accessible to everyone.</p>
                </div>

                <div className="max-w-sm mx-auto">
                    <div className="bg-[var(--surface)] border-[1.5px] border-[var(--accent)] rounded-3xl p-[36px_30px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative">
                        <div className="absolute top-0 left-[30px] right-[30px] h-1 bg-gradient-to-r from-[var(--accent)] to-[#8B5CF6] rounded-b"></div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-['Sora',sans-serif] text-xl font-bold text-[var(--text)]">Community Free</h3>
                            <span className="text-[10px] font-bold uppercase tracking-[0.05em] py-1 px-2.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">Popular</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-8 mt-4">
                            <span className="font-['Sora',sans-serif] text-5xl font-extrabold text-[var(--text)] leading-none">$0</span>
                            <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-[0.05em]">Forever</span>
                        </div>

                        <ul className="flex flex-col gap-3.5 mb-8 font-['Poppins',sans-serif]">
                            {freeFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                    <div className="bg-[var(--accent-soft)] w-[22px] h-[22px] rounded-full grid place-items-center shrink-0">
                                        <FiCheck size={12} className="text-[var(--accent)]" strokeWidth={3} />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <button onClick={() => document.getElementById('tb-tools')?.scrollIntoView({ behavior: 'smooth' })} className="w-full h-12 rounded-xl border-none bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] text-white font-['Poppins',sans-serif] font-semibold text-[15px] cursor-pointer flex items-center justify-center gap-2 shadow-[0_8px_20px_color-mix(in_srgb,var(--accent)_30%,transparent)] hover:-translate-y-0.5 transition-transform">
                            Start Now
                            <FiArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function LandingCTA() {
    return (
        <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-['Sora',sans-serif] text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] tracking-tight mb-4">
                    Start your journey now
                </h2>
                <p className="text-[var(--text-muted)] text-sm mb-8 max-w-md mx-auto leading-relaxed font-['Poppins',sans-serif]">
                    Join millions of users and experience the future of document processing. Entirely free, remarkably fast.
                </p>
                <Button variant="accent" size="lg" onClick={() => document.getElementById('tb-tools')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 font-['Poppins'] font-semibold">
                    Get Started Free
                    <FiArrowRight size={18} />
                </Button>
                <p className="text-[var(--text-faint)] text-xs mt-4 uppercase tracking-widest font-bold">No sign-up required · 100% free</p>
            </div>
        </section>
    );
}
export function LandingBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await blogApi.getAllBlogs();
                if (res.success && res.data) {
                    setBlogs(res.data.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section className="py-24 px-6 border-t border-[var(--border)] bg-[var(--bg)]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <p className="text-xs text-[var(--accent)] uppercase tracking-[0.15em] font-bold mb-3">Resources & Guides</p>
                        <h2 className="font-['Sora',sans-serif] text-[clamp(28px,4vw,40px)] font-extrabold text-[var(--text)] tracking-[-.02em] leading-tight">
                            Latest from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#8B5CF6]">Blog</span>
                        </h2>
                    </div>
                    <Button variant="secondary" onClick={() => document.location.href = '/blog'} className="mt-6 md:mt-0">
                        View All Articles
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog: any, idx: number) => (
                        <a href={`/blog/${blog.slug}`} key={blog.slug} className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden hover:shadow-[0_20px_50px_rgba(20,20,43,0.12)] hover:border-[var(--accent)] transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative h-52 overflow-hidden">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute top-4 left-4 bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                    {blog.category}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-['Sora',sans-serif] font-bold text-[18px] leading-[1.4] mb-3 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-[14px] text-[var(--text-muted)] leading-[1.6] font-['Poppins',sans-serif] mb-6 flex-1 line-clamp-2">
                                    {blog.excerpt}
                                </p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-[12.5px] font-semibold text-[var(--text-muted)]">
                                        {blog.date}
                                    </span>
                                    <div className="font-bold text-[13px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors flex items-center gap-1.5">
                                        Read <FiArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
