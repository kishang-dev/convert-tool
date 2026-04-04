import React from 'react';
import { ArrowRight, Shield, Zap, Heart, Globe, Clock, Users, Sparkles } from 'lucide-react';
import HeroSection from './HeroSection';
import FeaturesShowcase from './FeaturesShowcase';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import Button from './Button';
import Card from './Card';
import Footer from './Footer';
import { useRouter } from 'next/router';

export default function LandingPage() {
    const router = useRouter();

    const stats = [
        { label: "Files Processed", value: "10M+", icon: <Zap size={20} className="text-yellow-400" /> },
        { label: "OCR Accuracy", value: "99.9%", icon: <Shield size={20} className="text-green-400" /> },
        { label: "Active Users", value: "2.5M+", icon: <Users size={20} className="text-blue-400" /> },
        { label: "Uptime", value: "99.99%", icon: <Clock size={20} className="text-purple-400" /> }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a]">
            {/* Hero Section */}
            <HeroSection />

            {/* Live Stats Bar */}
            <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4 sm:gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="mb-4 p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</div>
                                <div className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Showcase */}
            <FeaturesShowcase />

            {/* How It Works */}
            <HowItWorks />

            {/* Benefits Section */}
            <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-24 px-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 md:mb-8 transition-all hover:bg-blue-500/20">
                            <Sparkles size={16} className="text-blue-400" />
                            <span className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">The Platform Edge</span>
                        </div>
                        <h2 className="text-2xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter text-white uppercase leading-[1.1]">
                            Engineered for <br className="hidden sm:block" /><span className="gradient-text">Precision & Speed</span>
                        </h2>
                        <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-bold px-2 sm:px-4 opacity-80">
                            We've built a rock-solid infrastructure to handle your most complex document tasks without breaking a sweat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <Card variant="elevated" className="p-8 md:p-10 border-white/5 bg-white/5 group hover:border-blue-500/30 transition-all duration-500">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                                <Shield className="text-green-500" size={28} md-size={32} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-white uppercase tracking-tight">Enterprise Security</h3>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
                                We utilize military-grade encryption for all file transfers. Your files are automatically purged from our servers within 24 hours.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-8 md:p-10 border-white/5 bg-white/5 group hover:border-yellow-500/30 transition-all duration-500">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                                <Zap className="text-yellow-500" size={28} md-size={32} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-white uppercase tracking-tight">AI Optimizers</h3>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
                                Our proprietary AI engines optimize PDF file sizes without losing quality, making your documents web-ready instantly.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-8 md:p-10 border-white/5 bg-white/5 group hover:border-pink-500/30 transition-all duration-500">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                                <Heart className="text-pink-500" size={28} md-size={32} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-white uppercase tracking-tight">Intuitive UI</h3>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
                                Design matters. We've crafted a seamless, glassmorphic interface that makes complex tasks feel like a breeze.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-8 md:p-10 border-white/5 bg-white/5 group hover:border-blue-500/30 transition-all duration-500">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                                <Globe className="text-blue-500" size={28} md-size={32} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-white uppercase tracking-tight">Global Reach</h3>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
                                Supporting over 100+ languages for OCR and document conversion, ensuring accuracy across borders.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-8 md:p-10 border-white/5 bg-white/5 group hover:border-purple-500/30 transition-all duration-500">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                                <Clock className="text-purple-500" size={28} md-size={32} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-white uppercase tracking-tight">Always Online</h3>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
                                Our distributed cloud infrastructure ensures 99.9% availability. Your tools are ready when you are.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-8 md:p-10 border-white/5 bg-white/5 group hover:border-indigo-500/30 transition-all duration-500">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                                <Users className="text-indigo-500" size={28} md-size={32} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-white uppercase tracking-tight">No Compromise</h3>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
                                Highest quality output in the industry. Whether it's SVG vectors or OCR text, we provide precision results.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* About QuickPDF Snippet */}
            <section className="py-16 md:py-24 px-4 sm:px-6 border-t border-white/5 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/20">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div className="text-center md:text-left px-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            The Vision Behind <br className="md:hidden" /><span className="text-blue-500">QuickPDF</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-400 leading-relaxed mb-8 font-bold px-2 md:px-0 opacity-80">
                            Founded in 2024, QuickPDF was born out of a simple need: universal, high-speed document processing without the clutter of traditional tools. We believe that professional-grade tools should be accessible to everyone, anywhere.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <Button variant="secondary" className="w-full sm:w-auto px-8" onClick={() => router.push('/about')}>Read Our Story</Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse"></div>
                        <div className="relative p-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-bold italic">PDF</div>
                                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[90%] h-full bg-blue-500"></div>
                                    </div>
                                    <span className="text-xs font-black text-gray-500">90%</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-bold italic">AI</div>
                                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[95%] h-full bg-purple-500"></div>
                                    </div>
                                    <span className="text-xs font-black text-gray-500">95%</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 font-bold italic">SVG</div>
                                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[85%] h-full bg-pink-500"></div>
                                    </div>
                                    <span className="text-xs font-black text-gray-500">85%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQ />

            {/* Pricing / Access Section */}
            <section className="py-16 md:py-32 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto text-center mb-10 md:mb-16 px-4">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter leading-none">Simple, Transparent <span className="text-blue-500">Access</span></h2>
                    <p className="text-xs sm:text-base text-gray-400 font-bold uppercase tracking-widest opacity-60">Professional tools should be accessible to everyone.</p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="bg-white/5 border-2 border-blue-500/50 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        <div className="absolute top-0 right-8 md:right-12 -translate-y-1/2 bg-blue-600 px-4 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">Popular</div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-2 uppercase tracking-tight text-center md:text-left">Community Free</h3>
                        <div className="flex items-baseline justify-center md:justify-start gap-2 mb-8">
                            <span className="text-4xl md:text-5xl font-black text-white">$0</span>
                            <span className="text-gray-500 font-bold uppercase text-xs">Forever</span>
                        </div>
                        <ul className="space-y-4 mb-10 text-left">
                            <li className="flex items-center gap-3 text-gray-400 font-medium transition-colors hover:text-white">
                                <div className="p-1 bg-green-500/20 text-green-500 rounded-lg"><ArrowRight size={14} /></div>
                                Unlimited Conversions
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 font-medium transition-colors hover:text-white">
                                <div className="p-1 bg-green-500/20 text-green-500 rounded-lg"><ArrowRight size={14} /></div>
                                High Precision OCR
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 font-medium transition-colors hover:text-white">
                                <div className="p-1 bg-green-500/20 text-green-500 rounded-lg"><ArrowRight size={14} /></div>
                                AI Diagram Generator
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 font-medium transition-colors hover:text-white">
                                <div className="p-1 bg-green-500/20 text-green-500 rounded-lg"><ArrowRight size={14} /></div>
                                24h File Retention
                            </li>
                        </ul>
                        <Button className="w-full py-4 text-sm font-black uppercase tracking-widest" onClick={() => router.push('/tools')}>Start Now</Button>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 md:py-40 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    <Card variant="elevated" className="p-10 sm:p-16 md:p-24 text-center relative overflow-hidden bg-gradient-to-b from-white/5 to-transparent border-white/10 rounded-[3rem] md:rounded-[4rem]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter text-white uppercase leading-[1.1]">
                                Start Your <br className="hidden sm:block" /><span className="gradient-text">Journey Now</span>
                            </h2>
                            <p className="text-sm sm:text-lg md:text-xl text-gray-400 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-bold px-4 opacity-80">
                                Join our ecosystem of millions and experience the future of document processing. Entirely free, remarkably fast.
                            </p>
                            <Button
                                size="lg"
                                className="w-full sm:w-auto px-10 py-5 sm:px-12 sm:py-6 text-base sm:text-xl rounded-2xl shadow-2xl shadow-blue-500/30 font-black uppercase tracking-widest"
                                onClick={() => router.push('/tools')}
                            >
                                Get Started Free
                                <ArrowRight size={24} />
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
