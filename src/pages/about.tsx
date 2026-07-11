import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LuUsers as Users, LuShield as Shield, LuZap as Zap, LuGlobe as Globe, LuHeart as Heart } from "react-icons/lu";
import SEO from "@/components/SEO";


export default function AboutPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:text-[var(--text)] flex flex-col font-sans">
            <SEO
                title="About Us"
                description="Learn about ToolBasketAI — the team building the world's most powerful free online toolkit for PDFs, images, and documents. Our mission is fast, private, and beautiful tools for everyone."
                canonical="/about"
                keywords="about ToolBasketAI, online PDF tools team, free document converter, ToolBasketAI mission"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'AboutPage',
                    name: 'About ToolBasketAI',
                    url: 'https://toolbasketai.com/about',
                    description: 'The team behind ToolBasketAI and our mission to revolutionize modern workflows.',
                }}
            />
            <Navbar />

            <main className="flex-1 pt-12 pb-20">
                <style>{`
                    .feature-card:hover .feature-icon-box {
                        background: var(--accent) !important;
                        border-color: var(--accent) !important;
                        transform: scale(1.05) rotate(3deg);
                    }
                    .feature-card:hover .feature-icon {
                        color: #fff !important;
                    }
                `}</style>

                {/* Hero Section */}
                <section className="px-4 sm:px-6 mb-24 text-center">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-4">Our Mission</p>
                        <h1 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 'clamp(38px, 6vw, 54px)', letterSpacing: '-.03em', margin: '0 0 20px', color: 'var(--text)' }}>
                            Revolutionizing modern workflows
                        </h1>
                        <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto', lineHeight: 1.6, fontFamily: '"Poppins", sans-serif' }}>
                            We are building the world's most powerful, fast conversion engine to help creators, engineers, and businesses transform data with precision and style.
                        </p>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-8 border-y border-[var(--border)] bg-[var(--surface-hover)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: Shield, title: 'Security First', desc: 'Your data is your most valuable asset. We use enterprise-grade encryption and privacy-focused processing for every single conversion.' },
                                { icon: Zap, title: 'Velocity Driven', desc: 'Speed shouldn\'t compromise quality. Our advanced infrastructure ensures lightning-fast processing across all file types.' },
                                { icon: Users, title: 'User Centric', desc: 'We design tools that feel human. Every feature is polished to perfection to ensure the best possible user experience.' }
                            ].map((v, i) => (
                                <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '32px 28px', transition: 'all 0.3s ease' }} className="hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)] feature-card">
                                    <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', width: 48, height: 48, borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 20, transition: 'all 0.3s ease' }} className="feature-icon-box">
                                        <v.icon size={22} className="text-[var(--accent)] transition-colors duration-300 feature-icon" />
                                    </div>
                                    <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 18, color: 'var(--text)', marginBottom: 10 }}>{v.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6, margin: 0, fontFamily: '"Poppins", sans-serif' }}>{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-8 px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-start">
                            <div>
                                <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-3">Who We Are</p>
                                <h2 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 36px)', letterSpacing: '-.02em', margin: '0 0 20px', color: 'var(--text)' }}>
                                    Our Story
                                </h2>
                                <p style={{ fontSize: 15.5, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20, fontFamily: '"Poppins", sans-serif' }}>
                                    Founded in 2024, ToolBasketAI started with a simple belief: file conversion shouldn't be a chore. Most tools on the market are slow, filled with intrusive ads, and look like they belong in the early 2000s. We decided to change that.
                                </p>
                                <p style={{ fontSize: 15.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, fontFamily: '"Poppins", sans-serif' }}>
                                    Today, we provide a comprehensive suite of tools ranging from simple PDF conversions to advanced AI-powered Flowchart generation and CV building. Our team consists of passionate developers and designers dedicated to pushing the boundaries of what's possible in a browser.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5 mt-4 md:mt-0">
                                <div style={{ background: 'linear-gradient(135deg, var(--surface), var(--surface-hover))', border: '1.5px solid var(--border)', borderRadius: 20, padding: 28, boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                                        <Globe size={20} className="text-[var(--accent)]" />
                                    </div>
                                    <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: 6 }}>100+</span>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', uppercase: 'uppercase', tracking: 'widest', fontWeight: 600, margin: 0 }}>Countries Reached</p>
                                </div>
                                <div style={{ background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', border: '1.5px solid var(--accent)', borderRadius: 20, padding: 28, boxShadow: '0 18px 40px color-mix(in srgb,var(--accent) 30%,transparent)', color: '#fff' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                                        <Heart size={20} color="#fff" />
                                    </div>
                                    <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 32, fontWeight: 800, display: 'block', marginBottom: 6 }}>10M+</span>
                                    <p style={{ fontSize: 12, opacity: 0.9, textTransform: 'uppercase', tracking: 'widest', fontWeight: 600, margin: 0 }}>Files Converted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
