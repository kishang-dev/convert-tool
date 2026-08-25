import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LuMail as Mail, LuMessageCircle as MessageCircle, LuMapPin as MapPin, LuCircleCheck as CheckCircle, LuSend as Send, LuLoader as Loader2 } from "react-icons/lu";
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

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:text-[var(--text)] flex flex-col font-sans">
            <SEO
                title="Contact Us — ToolBasketAI Customer Support & Inquiries"
                description="Get in touch with the ToolBasketAI team. We respond within 24 hours to all questions, feedback, and inquiries."
                canonical="/contact"
                keywords="contact ToolBasketAI, support, help, feedback, toolbasketai customer service"
                breadcrumbs={[{ name: "Contact Us", item: "/contact" }]}
            />
            <Navbar />

            <main className="flex-1 pt-12 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
                        {/* Info Section */}
                        <section>
                            <div className="mb-12">
                                <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-3">Get in touch</p>
                                <h1 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 46px)', letterSpacing: '-.03em', margin: '0 0 16px', color: 'var(--text)' }}>
                                    Let's start a conversation
                                </h1>
                                <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, fontFamily: '"Poppins", sans-serif', maxWidth: 440 }}>
                                    Have a question or a project in mind? We'd love to hear from you. Our team typically responds within 24 hours.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email Support", value: "toolbasketai@gmail.com" },
                                    // { icon: MessageCircle, label: "Real-time Chat", value: "@toolbasket_support" },
                                    { icon: MapPin, label: "Office Location", value: "Gujarat, IN" }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '20px 24px', transition: 'all 0.3s ease' }} className="hover:-translate-y-1 hover:shadow-lg hover:border-[var(--accent)]">
                                        <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', width: 48, height: 48, borderRadius: 12, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                            <item.icon size={20} className="text-[var(--accent)]" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 4, fontFamily: '"Poppins", sans-serif' }}>{item.label}</p>
                                            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0, fontFamily: '"Poppins", sans-serif' }}>{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Form Section */}
                        <section>
                            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: '34px 30px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
                                {isSent ? (
                                    <div className="text-center py-10">
                                        <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                            <CheckCircle className="text-[var(--accent)]" size={32} />
                                        </div>
                                        <h3 style={{ fontFamily: '"Sora", sans-serif', fontSize: 24, fontWeight: 700, margin: '0 0 10px', color: 'var(--text)' }}>Message Sent!</h3>
                                        <p style={{ fontSize: 15, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif', marginBottom: 32 }}>
                                            Thank you for reaching out. We've received your inquiry and will get back to you shortly.
                                        </p>
                                        <button
                                            onClick={() => setIsSent(false)}
                                            style={{ height: 46, width: '100%', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--surface-hover)', color: 'var(--text)', fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 14.5, cursor: 'pointer', transition: 'all 0.2s' }}
                                            className="hover:border-[var(--text-muted)]"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 8, fontFamily: '"Poppins", sans-serif' }}>Full Name</label>
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 14.5, fontFamily: '"Poppins", sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                                                    className="focus:border-[var(--accent)]"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 8, fontFamily: '"Poppins", sans-serif' }}>Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 14.5, fontFamily: '"Poppins", sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                                                    className="focus:border-[var(--accent)]"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 8, fontFamily: '"Poppins", sans-serif' }}>Subject</label>
                                            <input
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 14.5, fontFamily: '"Poppins", sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                                                className="focus:border-[var(--accent)]"
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 8, fontFamily: '"Poppins", sans-serif' }}>Message</label>
                                            <textarea
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '16px', color: 'var(--text)', fontSize: 14.5, fontFamily: '"Poppins", sans-serif', outline: 'none', transition: 'border-color 0.2s', height: 140, resize: 'none' }}
                                                className="focus:border-[var(--accent)]"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                        </div>

                                        {error && (
                                            <div style={{ padding: '12px', background: 'var(--accent-soft)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--accent)', fontSize: 13.5, textAlign: 'center', fontFamily: '"Poppins", sans-serif' }}>
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            style={{ width: '100%', height: 50, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', color: '#fff', fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, boxShadow: '0 8px 20px color-mix(in srgb,var(--accent) 30%,transparent)' }}
                                            className="hover:-translate-y-0.5 transition-transform"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <>
                                                    Dispatch Message
                                                    <Send size={16} />
                                                </>
                                            )}
                                        </button>
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
