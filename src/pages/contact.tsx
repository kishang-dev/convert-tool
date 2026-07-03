import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, MapPin, CheckCircle, Send, Loader2 } from "lucide-react";
import { supportApi } from "@/services/api";
import Button from "@/components/Button";
import SEO from "@/components/SEO";

export default function ContactPage() {
    const [mounted, setMounted] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSent, setIsSent] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await supportApi.contact(formData);
            setIsSent(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:text-[var(--text)] flex flex-col font-sans">
            <SEO
                title="Contact Us — ToolBasketAI Support"
                description="Get in touch with the ToolBasketAI team. We respond within 24 hours to all questions, feedback, and business inquiries."
                canonical="/contact"
                keywords="contact ToolBasketAI, support, help, feedback"
            />
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
                        {/* Info Section */}
                        <section>
                            <div className="mb-10">
                                <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium mb-2">Get in touch</p>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                    Let's start a conversation
                                </h1>
                                <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] leading-relaxed max-w-sm">
                                    Have a question or a project in mind? We'd love to hear from you. Our team typically responds within 24 hours.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email Support", value: "support@toolbasket.com" },
                                    { icon: MessageCircle, label: "Real-time Chat", value: "@converter_support" },
                                    { icon: MapPin, label: "Office Location", value: "Ahmedabad, Gujarat, IN" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] p-4 rounded">
                                        <div className="bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] border border-[var(--border-strong)] dark:border-[var(--border)] p-2.5 rounded">
                                            <item.icon size={18} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest mb-0.5 font-medium">{item.label}</p>
                                            <p className="text-sm font-semibold text-[var(--text)] dark:text-[var(--text)]">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Form Section */}
                        <section>
                            <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] rounded p-6 sm:p-8">
                                {isSent ? (
                                    <div className="text-center py-10">
                                        <div className="bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] border border-[var(--border-strong)] dark:border-[var(--border)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="text-[var(--text)] dark:text-[var(--text)]" size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                        <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm mb-8">
                                            Thank you for reaching out. We've received your inquiry and will get back to you shortly.
                                        </p>
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => setIsSent(false)}
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium mb-2">Full Name</label>
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-[var(--bg)] border border-[var(--border-strong)] dark:border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] dark:text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium mb-2">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-[var(--bg)] border border-[var(--border-strong)] dark:border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] dark:text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium mb-2">Subject</label>
                                            <input
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border-strong)] dark:border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] dark:text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium mb-2">Message</label>
                                            <textarea
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border-strong)] dark:border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] dark:text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors h-32 resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-3 bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] border border-red-900/30 text-red-400 rounded text-xs text-center">
                                                {error}
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full mt-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={16} className="animate-spin mx-auto" />
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    Dispatch Message
                                                    <Send size={14} />
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
