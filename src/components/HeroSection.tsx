import React from 'react';
import { LuArrowRight as ArrowRight, LuZap as Zap, LuShield as Shield } from "react-icons/lu";
import Button from './Button';
import { useRouter } from 'next/router';

export default function HeroSection() {
    const router = useRouter();

    return (
        <section className="min-h-[88vh] flex items-center justify-center border-b border-[var(--border)] relative overflow-hidden">
            {/* Subtle accent glow background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% -10%, var(--accent-soft) 0%, transparent 70%)',
                }}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 relative z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[var(--accent-soft)] border border-[var(--accent-ring)] px-3 py-1.5 rounded-full mb-8 animate-fadeIn">
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse-accent"
                        style={{ background: 'var(--accent)' }}
                    />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
                        Document Tools Platform
                    </span>
                </div>

                {/* Heading */}
                <h1
                    className="text-4xl sm:text-5xl md:text-7xl font-bold text-[var(--text)] tracking-tight leading-[1.05] mb-6 animate-fadeIn"
                    style={{ animationDelay: '0.1s' }}
                >
                    Manage Your Documents<br />
                    <span className="text-[var(--text-muted)]">With Confidence</span>
                </h1>

                {/* Sub */}
                <p
                    className="text-base sm:text-lg text-[var(--text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeIn"
                    style={{ animationDelay: '0.2s' }}
                >
                    Convert, merge, split, compress, and process your PDF files and images — entirely free, no account needed.
                </p>

                {/* CTAs */}
                <div
                    className="flex flex-col sm:flex-row gap-3 justify-center mb-14 animate-fadeIn"
                    style={{ animationDelay: '0.3s' }}
                >
                    <Button
                        variant="accent"
                        size="lg"
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                        onClick={() => router.push('/#tb-tools')}
                    >
                        Start for Free
                        <ArrowRight size={18} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        View Features
                    </Button>
                </div>

                {/* Trust chips */}
                <div
                    className="flex flex-wrap gap-3 justify-center animate-fadeIn"
                    style={{ animationDelay: '0.4s' }}
                >
                    {[
                        { icon: <Zap size={14} style={{ color: 'var(--accent)' }} />, label: 'Lightning Fast' },
                        { icon: <Shield size={14} style={{ color: 'var(--accent)' }} />, label: '100% Secure' },
                        { icon: <span style={{ color: 'var(--accent)', fontSize: '12px' }}>∞</span>, label: 'No Registration' },
                    ].map(({ icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full text-xs text-[var(--text-muted)]"
                        >
                            {icon}
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
