import React from 'react';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import Button from './Button';
import { useRouter } from 'next/router';

export default function HeroSection() {
    const router = useRouter();

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-fadeIn">
                    <Sparkles className="text-purple-400" size={16} />
                    <span className="text-sm text-gray-300">AI-Powered Document Tools</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fadeIn leading-[1.1] tracking-tight px-2" style={{ animationDelay: '0.1s' }}>
                    Transform Your Documents
                    <br />
                    <span className="gradient-text">In Seconds</span>
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto animate-fadeIn leading-relaxed px-4" style={{ animationDelay: '0.2s' }}>
                    All-in-one PDF toolkit with AI-powered features. Convert, edit, merge, split, and more—all in your browser, completely free.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                    <Button
                        size="lg"
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                        onClick={() => router.push('/tools')}
                    >
                        Get Started Free
                        <ArrowRight size={20} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                        onClick={() => {
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Explore Features
                    </Button>
                </div>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                    <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                        <Zap className="text-yellow-400" size={16} />
                        <span className="text-sm text-gray-300">Lightning Fast</span>
                    </div>
                    <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                        <Shield className="text-green-400" size={16} />
                        <span className="text-sm text-gray-300">100% Secure</span>
                    </div>
                    <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                        <Sparkles className="text-purple-400" size={16} />
                        <span className="text-sm text-gray-300">No Registration</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
