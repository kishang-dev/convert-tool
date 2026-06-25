import React from 'react';
import { ArrowRight, Shield, Zap, Globe, Clock, Users, Check } from 'lucide-react';
import HeroSection from './HeroSection';
import FeaturesShowcase from './FeaturesShowcase';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import Button from './Button';
import Footer from './Footer';
import { useRouter } from 'next/router';

const benefits = [
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Military-grade encryption for all file transfers. Files are auto-deleted from our servers within 24 hours.',
    },
    {
        icon: Zap,
        title: 'AI Optimizers',
        description: 'Our AI engines optimize PDF file sizes without losing quality, making your documents web-ready instantly.',
    },
    {
        icon: Globe,
        title: 'Global Reach',
        description: 'Supporting 100+ languages for OCR and document conversion, ensuring accuracy across all borders.',
    },
    {
        icon: Clock,
        title: 'Always Online',
        description: 'Distributed cloud infrastructure ensures 99.9% availability. Your tools are ready when you are.',
    },
    {
        icon: Users,
        title: 'No Compromise',
        description: 'Highest quality output in the industry — whether SVG vectors or OCR text, we deliver precision.',
    },
    {
        icon: Shield,
        title: 'Intuitive Interface',
        description: 'A clean, modern interface designed for focus. Custom views to match your workflow preferences.',
    },
];

const freeFeatures = [
    'Unlimited Conversions',
    'High Precision OCR',
    'AI Diagram Generator',
    '24h File Retention',
    'No Account Required',
    'All 40+ Tools Included',
];

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0a0a0a]">

            {/* Hero */}
            <HeroSection />

            {/* Stats bar */}
            <div className="border-y border-[#1a1a1a] bg-[#0d0d0d]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: '10M+', label: 'Files Processed' },
                            { value: '99.9%', label: 'OCR Accuracy' },
                            { value: '2.5M+', label: 'Active Users' },
                            { value: '40+', label: 'Free Tools' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                                <div className="text-xs text-[#555] uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Showcase */}
            <FeaturesShowcase />

            {/* How It Works */}
            <HowItWorks />

            {/* Benefits Grid */}
            <section className="py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12">
                        <p className="text-xs text-[#555] uppercase tracking-widest font-medium mb-2">Why QuickPDF</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Built for precision & speed
                        </h2>
                        <p className="text-sm text-[#555] mt-2 max-w-lg">
                            A rock-solid infrastructure to handle your most complex document tasks without breaking a sweat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {benefits.map((b, i) => {
                            const Icon = b.icon;
                            return (
                                <div
                                    key={i}
                                    className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#2a2a2a] transition-colors"
                                >
                                    <div className="bg-[#1a1a1a] border border-[#222] p-2.5 rounded-lg inline-block mb-4">
                                        <Icon size={17} className="text-[#888]" />
                                    </div>
                                    <h3 className="text-white font-semibold text-sm mb-2">{b.title}</h3>
                                    <p className="text-[#555] text-xs leading-relaxed">{b.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* About section */}
            <section className="py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-xs text-[#555] uppercase tracking-widest font-medium mb-2">About</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                            The vision behind QuickPDF
                        </h2>
                        <p className="text-sm text-[#555] leading-relaxed mb-6">
                            Founded in 2024, QuickPDF was born out of a simple need: universal, high-speed document processing without the clutter of traditional tools. We believe professional-grade tools should be accessible to everyone, anywhere.
                        </p>
                        <Button variant="secondary" onClick={() => router.push('/about')}>
                            Read Our Story
                        </Button>
                    </div>

                    {/* Accuracy bars */}
                    <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-5">
                        {[
                            { label: 'PDF Processing', pct: 90 },
                            { label: 'AI Accuracy', pct: 95 },
                            { label: 'SVG Vectorization', pct: 85 },
                        ].map(({ label, pct }) => (
                            <div key={label}>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-[#888]">{label}</span>
                                    <span className="text-[#555]">{pct}%</span>
                                </div>
                                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <FAQ />

            {/* Pricing / Free access */}
            <section className="py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10">
                        <p className="text-xs text-[#555] uppercase tracking-widest font-medium mb-2">Pricing</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Simple, transparent access</h2>
                        <p className="text-sm text-[#555] mt-2">Professional tools should be accessible to everyone.</p>
                    </div>

                    <div className="max-w-sm">
                        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-8">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-white font-semibold">Community Free</h3>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#555] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded-full">Popular</span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mb-6 mt-3">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-xs text-[#555] uppercase">Forever</span>
                            </div>

                            <ul className="space-y-3 mb-7">
                                {freeFeatures.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-[#888]">
                                        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded p-0.5">
                                            <Check size={12} className="text-white" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full" onClick={() => router.push('/tools')}>
                                Start Now
                                <ArrowRight size={15} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Start your journey now
                    </h2>
                    <p className="text-[#555] text-sm mb-8 max-w-md mx-auto leading-relaxed">
                        Join millions of users and experience the future of document processing. Entirely free, remarkably fast.
                    </p>
                    <Button size="lg" onClick={() => router.push('/tools')} className="inline-flex items-center gap-2">
                        Get Started Free
                        <ArrowRight size={18} />
                    </Button>
                    <p className="text-[#333] text-xs mt-4 uppercase tracking-widest">No sign-up required · 100% free</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
