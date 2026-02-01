import React from 'react';
import { ArrowRight, Shield, Zap, Heart, Globe, Clock, Users } from 'lucide-react';
import HeroSection from './HeroSection';
import FeaturesShowcase from './FeaturesShowcase';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import Button from './Button';
import Card from './Card';
import { useRouter } from 'next/router';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection />

            {/* Features Showcase */}
            <FeaturesShowcase />

            {/* How It Works */}
            <HowItWorks />

            {/* Benefits Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Why Choose <span className="gradient-text">Our Tools</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Built with cutting-edge technology to give you the best experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card variant="elevated" className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                                <Shield className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">100% Secure</h3>
                            <p className="text-gray-400">
                                Your files are encrypted and automatically deleted after processing. We never store or share your data.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                                <Zap className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
                            <p className="text-gray-400">
                                Powered by advanced algorithms and cloud infrastructure for instant results.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
                                <Heart className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Easy to Use</h3>
                            <p className="text-gray-400">
                                Intuitive interface designed for everyone. No technical knowledge required.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                                <Globe className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Works Everywhere</h3>
                            <p className="text-gray-400">
                                Access from any device with a browser. Desktop, tablet, or mobile - we've got you covered.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-4">
                                <Clock className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">24/7 Available</h3>
                            <p className="text-gray-400">
                                Our tools are always online and ready to use, whenever you need them.
                            </p>
                        </Card>

                        <Card variant="elevated" className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4">
                                <Users className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Trusted by Millions</h3>
                            <p className="text-gray-400">
                                Join millions of users worldwide who trust our platform for their document needs.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQ />

            {/* Final CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card variant="elevated" className="p-12 text-center relative overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join millions of users and transform your documents today. No credit card required.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => router.push('/tools')}
                            >
                                Start Using Free Tools
                                <ArrowRight size={20} />
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">QuickPDF Tools</h3>
                            <p className="text-gray-400 text-sm">
                                Your all-in-one solution for PDF and document management.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-white">Tools</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="/tools" className="hover:text-purple-400 transition-smooth">PDF Converter</a></li>
                                <li><a href="/tools" className="hover:text-purple-400 transition-smooth">Merge PDF</a></li>
                                <li><a href="/tools" className="hover:text-purple-400 transition-smooth">Split PDF</a></li>
                                <li><a href="/tools" className="hover:text-purple-400 transition-smooth">Edit PDF</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-white">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">About Us</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">Contact</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-white">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">Help Center</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">FAQ</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">Blog</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-smooth">API</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; 2026 QuickPDF Tools. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
