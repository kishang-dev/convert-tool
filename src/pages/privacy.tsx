import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import SEO from "@/components/SEO";

export default function PrivacyPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white flex flex-col font-sans">
            <SEO
                title="Privacy Policy"
                description="ToolBasket processes all files client-side. Read our Privacy Policy to understand how we protect your data and ensure your documents never leave your device."
                canonical="/privacy"
                keywords="ToolBasket privacy policy, data protection, client-side processing, no data stored"
            />
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="mb-16">
                        <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#222] p-3 rounded-xl inline-block mb-6">
                            <Shield className="text-gray-500 dark:text-gray-500 dark:text-[#888]" size={24} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Privacy Policy</h1>
                        <p className="text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium">Last Updated: March 2024</p>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                            <p className="text-gray-600 dark:text-[#555] text-sm leading-relaxed">
                                Welcome to ToolBasket. Your privacy is paramount. This policy details how we handle the information you provide when using our suite of data conversion and processing tools. By using our services, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Data Collection</h2>
                            <p className="text-gray-600 dark:text-[#555] text-sm leading-relaxed mb-6">
                                We collect minimal data necessary to provide a high-quality service:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded p-1 mt-0.5">
                                        <FileText size={12} className="text-gray-500 dark:text-gray-500 dark:text-[#888]" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-[#555]"><strong className="text-gray-900 dark:text-white font-medium">Account Info:</strong> Email address and name for registered users.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded p-1 mt-0.5">
                                        <FileText size={12} className="text-gray-500 dark:text-gray-500 dark:text-[#888]" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-[#555]"><strong className="text-gray-900 dark:text-white font-medium">Technical Data:</strong> IP address, browser type, and usage patterns for performance optimization.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded p-1 mt-0.5">
                                        <FileText size={12} className="text-gray-500 dark:text-gray-500 dark:text-[#888]" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-[#555]"><strong className="text-gray-900 dark:text-white font-medium">Transient Files:</strong> Files uploaded for conversion are processed in a secure environment and automatically deleted after a set period.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Security Measures</h2>
                            <p className="text-gray-600 dark:text-[#555] text-sm leading-relaxed mb-6">
                                We employ cutting-edge security protocols to prevent unauthorized access, alteration, disclosure, or destruction of your personal data. This includes end-to-end encryption for file transfers and restricted access to our processing servers.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6">
                                    <Lock size={18} className="text-gray-500 dark:text-gray-500 dark:text-[#888] mb-4" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">TLS 1.3 Encryption</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#555]">Industry standard for safe data transmission</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6">
                                    <Eye size={18} className="text-gray-500 dark:text-gray-500 dark:text-[#888] mb-4" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">24h Auto-Delete</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#555]">Ephemeral processing ensures data privacy</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Cookies</h2>
                            <p className="text-gray-600 dark:text-[#555] text-sm leading-relaxed">
                                We use cookies to enhance your experience, remember your preferences, and track anonymous usage statistics. You can control cookie settings in your browser at any time.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
