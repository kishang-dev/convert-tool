import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, FileCheck, Info, AlertTriangle, HelpCircle } from "lucide-react";
import SEO from "@/components/SEO";

export default function TermsPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:text-[var(--text)] flex flex-col font-sans">
            <SEO
                title="Terms of Service"
                description="Read ToolBasketAI's Terms of Service. Understand the rules, rights, and responsibilities when using our free online PDF and document tools."
                canonical="/terms"
                keywords="ToolBasketAI terms of service, terms and conditions, online tool usage policy"
            />
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="mb-16">
                        <div className="bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] border border-[var(--border-strong)] dark:border-[var(--border)] p-3 rounded inline-block mb-6">
                            <Scale className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" size={24} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] dark:text-[var(--text)] tracking-tight mb-4">Terms of Service</h1>
                        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium">Effective Date: March 28, 2024</p>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)] mb-4">1. Acceptance of Terms</h2>
                            <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed">
                                By accessing or using ToolBasketAI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)] mb-4">2. Use License</h2>
                            <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                                Permission is granted to temporarily use our services for personal or commercial data processing. This is the grant of a license, not a transfer of title, and under this license, you may not:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {['Modify or copy the materials', 'Use for any unlawful purpose', 'Decompile or reverse engineer core software', 'Transfer data to another server'].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] rounded p-3">
                                        <FileCheck size={14} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
                                        <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-wider">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)] mb-4">3. AI Content Generation</h2>
                            <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border-strong)] dark:border-[var(--border-strong)] rounded p-5 border-l-2 border-l-[#555]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info size={16} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
                                    <span className="font-semibold text-[var(--text)] dark:text-[var(--text)] text-sm">Critical Notice</span>
                                </div>
                                <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed">
                                    For AI-generated content (like flowcharts and charts), we do not guarantee 100% accuracy. The output is provided "as is" and remains the responsibility of the user to verify before final implementation.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)] mb-4">4. Disclaimer</h2>
                            <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border-strong)] dark:border-[var(--border-strong)] rounded p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle size={16} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
                                    <span className="font-semibold text-[var(--text)] dark:text-[var(--text)] text-sm">No Warranties</span>
                                </div>
                                <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed">
                                    The materials on ToolBasketAI are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)] mb-4">5. Support & Governance</h2>
                            <div className="flex items-start gap-3">
                                <HelpCircle size={16} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)] mt-0.5" />
                                <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed">
                                    Any claim relating to ToolBasketAI shall be governed by the laws of India without regard to its conflict of law provisions. For support, please reach out via our contact page.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
