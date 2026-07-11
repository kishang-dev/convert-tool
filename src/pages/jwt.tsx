import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { LuShieldCheck as ShieldCheck, LuCalendar as Calendar, LuClock as Clock, LuTriangleAlert as AlertTriangle, LuKeyRound as KeyRound } from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function JwtDecoder() {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [tokenState, setTokenState] = useState<{
        isValid: boolean;
        algorithm: string;
        expiresAt: string | null;
        issuedAt: string | null;
        isExpired: boolean | null;
        timeRemaining: string | null;
    }>({
        isValid: false,
        algorithm: '',
        expiresAt: null,
        issuedAt: null,
        isExpired: null,
        timeRemaining: null
    });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const base64UrlDecode = (str: string) => {
        try {
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            return decodeURIComponent(escape(atob(base64)));
        } catch (e) {
            return null;
        }
    };

    const handleDecode = (jwtString: string) => {
        setToken(jwtString);
        if (!jwtString.trim()) {
            setHeader('');
            setPayload('');
            setTokenState({
                isValid: false,
                algorithm: '',
                expiresAt: null,
                issuedAt: null,
                isExpired: null,
                timeRemaining: null
            });
            return;
        }

        const parts = jwtString.trim().split('.');
        if (parts.length !== 3) {
            setTokenState(prev => ({ ...prev, isValid: false }));
            return;
        }

        const decodedHeaderStr = base64UrlDecode(parts[0]);
        const decodedPayloadStr = base64UrlDecode(parts[1]);

        if (!decodedHeaderStr || !decodedPayloadStr) {
            setTokenState(prev => ({ ...prev, isValid: false }));
            return;
        }

        try {
            const headerObj = JSON.parse(decodedHeaderStr);
            const payloadObj = JSON.parse(decodedPayloadStr);

            setHeader(JSON.stringify(headerObj, null, 2));
            setPayload(JSON.stringify(payloadObj, null, 2));

            // Extract metadata
            const alg = headerObj.alg || 'Unknown';
            const exp = payloadObj.exp ? new Date(payloadObj.exp * 1000) : null;
            const iat = payloadObj.iat ? new Date(payloadObj.iat * 1000) : null;

            let isExpired = false;
            let timeRemaining = '';

            if (exp) {
                const now = new Date();
                isExpired = now > exp;
                
                if (isExpired) {
                    timeRemaining = 'Expired';
                } else {
                    const diffMs = exp.getTime() - now.getTime();
                    const diffHrs = Math.floor(diffMs / 3600000);
                    const diffMins = Math.floor((diffMs % 3600000) / 60000);
                    timeRemaining = `${diffHrs}h ${diffMins}m remaining`;
                }
            }

            setTokenState({
                isValid: true,
                algorithm: alg,
                expiresAt: exp ? exp.toLocaleString() : 'Never expires',
                issuedAt: iat ? iat.toLocaleString() : 'N/A',
                isExpired,
                timeRemaining: exp ? timeRemaining : 'Never expires'
            });

        } catch (e) {
            setTokenState(prev => ({ ...prev, isValid: false }));
        }
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "JWT Decoder & Parser Tools",
        "description": "Decode JSON Web Tokens (JWT) client-side in real-time. View header, payload, and expiration details.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/jwt`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                title="JWT Decoder & Parser Tools" 
                description="Decode JSON Web Tokens (JWT) client-side in real-time. View header, payload, and expiration details." 
                canonical="/jwt"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'JWT Decoder', href: '/jwt' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JWT Decoder & Parser</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Decode and analyze JSON Web Tokens (JWT) securely in real-time. Done completely in your browser.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Paste Token */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <Card variant="elevated" className="flex flex-col p-6 h-full bg-[var(--surface)] border-[var(--border)]">
                            <h2 className="text-lg font-bold mb-3 text-[var(--accent)] flex items-center gap-2">
                                <KeyRound size={20} />
                                Paste JWT Token
                            </h2>
                            <textarea
                                value={token}
                                onChange={(e) => handleDecode(e.target.value)}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4MTYyMzkwMjJ9..."
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[300px] leading-relaxed"
                            />
                        </Card>
                    </div>

                    {/* Right: Decoded Output & Metadata */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {tokenState.isValid ? (
                            <div className="grid gap-6">
                                {/* Token Status Banner */}
                                <Card variant="elevated" className={`p-4 ${tokenState.isExpired ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded ${tokenState.isExpired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                                {tokenState.isExpired ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm tracking-wide uppercase text-[var(--text-muted)]">Token Status</h3>
                                                <p className={`font-semibold ${tokenState.isExpired ? 'text-red-400' : 'text-green-400'}`}>
                                                    {tokenState.isExpired ? 'Token Expired' : 'Token Active'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-[var(--text-muted)] block font-semibold uppercase tracking-wider">Time Info</span>
                                            <span className="font-mono text-sm font-semibold">{tokenState.timeRemaining}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Meta details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card variant="default" className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                                        <span className="text-xs text-[var(--text-muted)] font-semibold block mb-1">ALGORITHM</span>
                                        <span className="font-mono font-bold text-[var(--accent)]">{tokenState.algorithm}</span>
                                    </Card>
                                    <Card variant="default" className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                                        <span className="text-xs text-[var(--text-muted)] font-semibold block mb-1 flex items-center gap-1"><Calendar size={12} /> ISSUED AT</span>
                                        <span className="text-xs font-semibold text-[var(--text-muted)]">{tokenState.issuedAt}</span>
                                    </Card>
                                    <Card variant="default" className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                                        <span className="text-xs text-[var(--text-muted)] font-semibold block mb-1 flex items-center gap-1"><Clock size={12} /> EXPIRES AT</span>
                                        <span className="text-xs font-semibold text-[var(--text-muted)]">{tokenState.expiresAt}</span>
                                    </Card>
                                </div>

                                {/* JSON Header & Payload splits */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card variant="elevated" className="p-4 flex flex-col bg-[var(--surface)] border-[var(--border)]">
                                        <span className="text-xs text-[var(--text-muted)] font-bold tracking-wider mb-2">HEADER: ALGORITHM & TOKEN TYPE</span>
                                        <pre className="p-3 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-[var(--accent)] overflow-x-auto max-h-[250px] leading-relaxed">
                                            {header}
                                        </pre>
                                    </Card>
                                    <Card variant="elevated" className="p-4 flex flex-col bg-[var(--surface)] border-[var(--border)]">
                                        <span className="text-xs text-[var(--text-muted)] font-bold tracking-wider mb-2">PAYLOAD: DATA & CLAIMS</span>
                                        <pre className="p-3 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-emerald-400 overflow-x-auto max-h-[250px] leading-relaxed">
                                            {payload}
                                        </pre>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <Card variant="elevated" className="p-8 flex flex-col items-center justify-center text-center h-full bg-[var(--surface)] border-[var(--border)] text-[var(--text-faint)]">
                                <ShieldCheck size={48} className="opacity-10 mb-3" />
                                <p className="text-base font-medium">Paste a valid JWT to view payload details</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">A typical JWT structure is xxxxx.yyyyy.zzzzz</p>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        
            <ToolSEOContent toolName="JWT Decoder & Parser Tools" toolDescription="Decode JSON Web Tokens (JWT) client-side in real-time. View header, payload, and expiration details." />
            <Footer />
        </div>
    );
}
