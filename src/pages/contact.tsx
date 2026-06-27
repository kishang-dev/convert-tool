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
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
                        {/* Info Section */}
                        <section>
                            <div className="mb-10">
                                <p className="text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium mb-2">Get in touch</p>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                    Let's start a conversation
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-[#555] leading-relaxed max-w-sm">
                                    Have a question or a project in mind? We'd love to hear from you. Our team typically responds within 24 hours.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email Support", value: "support@toolbasket.com" },
                                    { icon: MessageCircle, label: "Real-time Chat", value: "@converter_support" },
                                    { icon: MapPin, label: "Office Location", value: "Ahmedabad, Gujarat, IN" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] p-4 rounded-xl">
                                        <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#222] p-2.5 rounded-lg">
                                            <item.icon size={18} className="text-gray-500 dark:text-gray-500 dark:text-[#888]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-600 dark:text-[#555] uppercase tracking-widest mb-0.5 font-medium">{item.label}</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Form Section */}
                        <section>
                            <div className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6 sm:p-8">
                                {isSent ? (
                                    <div className="text-center py-10">
                                        <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#222] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="text-gray-900 dark:text-white" size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                        <p className="text-gray-600 dark:text-[#555] text-sm mb-8">
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
                                                <label className="block text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium mb-2">Full Name</label>
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#222] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:border-[#444] transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium mb-2">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#222] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:border-[#444] transition-colors"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium mb-2">Subject</label>
                                            <input
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#222] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:border-[#444] transition-colors"
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium mb-2">Message</label>
                                            <textarea
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#222] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:border-[#444] transition-colors h-32 resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-3 bg-gray-200 dark:bg-[#1a1a1a] border border-red-900/30 text-red-400 rounded-lg text-xs text-center">
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
