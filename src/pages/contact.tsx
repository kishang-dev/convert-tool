import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, MapPin, CheckCircle, Send, Loader2 } from "lucide-react";
import { supportApi } from "@/services/api";

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
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 pt-24 md:pt-32 pb-16 md:pb-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    {/* Info Section */}
                    <section className="relative text-center md:text-left">
                        <div className="absolute top-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black gradient-text tracking-tighter mb-8 leading-[1.1]">
                            Let's Start a <br className="hidden sm:block" /> Conversation.
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto md:mx-0 leading-relaxed mb-12">
                            Have a question or a project in mind? We'd love to hear from you. Our team typically responds within 24 hours.
                        </p>

                        <div className="space-y-6 md:space-y-8 relative z-10">
                            {[
                                { icon: Mail, label: "Email Support", value: "support@convertertool.com", color: "text-blue-500", hover: "hover:bg-blue-600" },
                                { icon: MessageCircle, label: "Real-time Chat", value: "@converter_support", color: "text-purple-500", hover: "hover:bg-purple-600" },
                                { icon: MapPin, label: "Office Location", value: "Ahmedabad, Gujarat, IN", color: "text-pink-500", hover: "hover:bg-pink-600" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center md:items-center gap-4 sm:gap-6 group">
                                    <div className={`w-14 h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center ${item.color} group-hover:text-white group-active:scale-95 transition-all duration-500 shadow-2xl`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-lg md:text-xl font-bold">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Form Section */}
                    <section className="relative">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                        <div className="bg-[#1e293b]/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                            {isSent ? (
                                <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                                    <div className="flex justify-center mb-8">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                            <CheckCircle className="text-green-500" size={40} />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Message Sent!</h3>
                                    <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                                        Thank you for reaching out. We've received your inquiry and will get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setIsSent(false)}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                                    >
                                        Send Another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">Full Name</label>
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">Subject</label>
                                        <input
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                            placeholder="How can we help?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">Message Detail</label>
                                        <textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all h-40 resize-none font-bold placeholder:text-gray-600"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold text-center">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        disabled={isLoading}
                                        type="submit"
                                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[1.5rem] font-black text-lg transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] group/btn flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={22} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                                <span>DISPATCH MESSAGE</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
