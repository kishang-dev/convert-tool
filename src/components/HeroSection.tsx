import React from 'react';
import { ArrowRight, Zap, Shield } from 'lucide-react';
import Button from './Button';
import { useRouter } from 'next/router';

export default function HeroSection() {
    const router = useRouter();

    return (
        <section className="min-h-[88vh] flex items-center justify-center border-b border-[#1a1a1a]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-20">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-full mb-8 animate-fadeIn">
                    <span className="text-xs text-[#888] uppercase tracking-widest font-medium">Document Tools Platform</span>
                </div>

                {/* Heading */}
                <h1
                    className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6 animate-fadeIn"
                    style={{ animationDelay: '0.1s' }}
                >
                    Manage Your Documents<br />
                    <span className="text-[#888]">With Confidence</span>
                </h1>

                {/* Sub */}
                <p
                    className="text-base sm:text-lg text-[#555] mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeIn"
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
                        size="lg"
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                        onClick={() => router.push('/tools')}
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
                        { icon: <Zap size={14} className="text-[#666]" />, label: 'Lightning Fast' },
                        { icon: <Shield size={14} className="text-[#666]" />, label: '100% Secure' },
                        { icon: <span className="text-[#666] text-xs">∞</span>, label: 'No Registration' },
                    ].map(({ icon, label }) => (
                        <div key={label} className="flex items-center gap-2 bg-[#111] border border-[#222] px-3 py-1.5 rounded-full text-xs text-[#666]">
                            {icon}
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
