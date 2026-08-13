import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { 
    LuShieldCheck as ShieldCheck, 
    LuCalendar as Calendar, 
    LuClock as Clock, 
    LuTriangleAlert as AlertTriangle, 
    LuKeyRound as KeyRound, 
    LuCopy as Copy, 
    LuCheck as Check,
    LuEye as Eye,
    LuSignature as SignatureIcon,
    LuCpu as Cpu,
    LuHammer as Hammer,
    LuBookOpen as BookOpen
} from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

export default function JwtDecoder() {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');
    const [secret, setSecret] = useState('');
    const [signatureStatus, setSignatureStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
    const [copiedHeader, setCopiedHeader] = useState(false);
    const [copiedPayload, setCopiedPayload] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);
    
    // For Token Constructor/Builder
    const [buildHeader, setBuildHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    const [buildPayload, setBuildPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
    const [buildSecret, setBuildSecret] = useState('');
    const [isBuilding, setIsBuilding] = useState(false);

    const [tokenState, setTokenState] = useState<{
        isValid: boolean;
        algorithm: string;
        expiresAt: string | null;
        issuedAt: string | null;
        isExpired: boolean | null;
        timeRemaining: string | null;
        rawHeader: string;
        rawPayload: string;
        rawSignature: string;
    }>({
        isValid: false,
        algorithm: '',
        expiresAt: null,
        issuedAt: null,
        isExpired: null,
        timeRemaining: null,
        rawHeader: '',
        rawPayload: '',
        rawSignature: ''
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

    const base64UrlEncode = (str: string) => {
        try {
            const base64 = btoa(unescape(encodeURIComponent(str)));
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        } catch (e) {
            return '';
        }
    };

    // Helper to calculate cryptographic signatures (HMAC SHA-256) client-side
    const verifySignature = async (headerStr: string, payloadStr: string, signatureStr: string, secretKey: string) => {
        if (!secretKey) {
            setSignatureStatus('unchecked');
            return;
        }
        try {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(secretKey);
            const messageData = encoder.encode(`${headerStr}.${payloadStr}`);
            const key = await crypto.subtle.importKey(
                'raw', 
                keyData, 
                { name: 'HMAC', hash: 'SHA-256' }, 
                false, 
                ['verify', 'sign']
            );
            
            // Re-decode signature from base64url to bytes
            let base64 = signatureStr.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            const sigBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

            const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, messageData);
            setSignatureStatus(isValid ? 'valid' : 'invalid');
        } catch (e) {
            setSignatureStatus('invalid');
        }
    };

    const handleDecode = (jwtString: string) => {
        setToken(jwtString);
        setSignatureStatus('unchecked');
        if (!jwtString.trim()) {
            setHeader('');
            setPayload('');
            setSignature('');
            setTokenState({
                isValid: false,
                algorithm: '',
                expiresAt: null,
                issuedAt: null,
                isExpired: null,
                timeRemaining: null,
                rawHeader: '',
                rawPayload: '',
                rawSignature: ''
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
        setSignature(parts[2]);

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
                timeRemaining: exp ? timeRemaining : 'Never expires',
                rawHeader: parts[0],
                rawPayload: parts[1],
                rawSignature: parts[2]
            });

            // If secret is set, verify
            if (secret) {
                verifySignature(parts[0], parts[1], parts[2], secret);
            }

        } catch (e) {
            setTokenState(prev => ({ ...prev, isValid: false }));
        }
    };

    useEffect(() => {
        if (tokenState.isValid) {
            verifySignature(tokenState.rawHeader, tokenState.rawPayload, tokenState.rawSignature, secret);
        }
    }, [secret]);

    const handleCopyText = (text: string, setter: (val: boolean) => void) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setter(true);
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setter(false), 2000);
    };

    const handleBuildToken = async () => {
        setIsBuilding(true);
        try {
            // Clean/Parse json validation check
            const headerObj = JSON.parse(buildHeader);
            const payloadObj = JSON.parse(buildPayload);

            const encHeader = base64UrlEncode(JSON.stringify(headerObj));
            const encPayload = base64UrlEncode(JSON.stringify(payloadObj));

            let signaturePart = 'dummy_signature';
            if (buildSecret) {
                const encoder = new TextEncoder();
                const keyData = encoder.encode(buildSecret);
                const messageData = encoder.encode(`${encHeader}.${encPayload}`);
                const key = await crypto.subtle.importKey(
                    'raw', 
                    keyData, 
                    { name: 'HMAC', hash: 'SHA-256' }, 
                    false, 
                    ['sign']
                );
                const sigBuffer = await crypto.subtle.sign('HMAC', key, messageData);
                const sigBytes = new Uint8Array(sigBuffer);
                let binaryStr = '';
                for (let i = 0; i < sigBytes.byteLength; i++) {
                    binaryStr += String.fromCharCode(sigBytes[i]);
                }
                signaturePart = btoa(binaryStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            }

            const constructedToken = `${encHeader}.${encPayload}.${signaturePart}`;
            handleDecode(constructedToken);
            showToast('JWT constructed and loaded!', 'success');
        } catch (e: any) {
            showToast(`Build error: Invalid JSON syntax`, 'error');
        } finally {
            setIsBuilding(false);
        }
    };

    const claimExplanations: Record<string, string> = {
        iss: "Issuer: Identifies the principal that issued the JWT.",
        sub: "Subject: Identifies the principal that is the subject of the JWT (e.g. user ID).",
        aud: "Audience: Identifies the recipients that the JWT is intended for.",
        exp: "Expiration Time: Identifies the expiration time on or after which the JWT must not be accepted.",
        nbf: "Not Before: Identifies the time before which the JWT must not be accepted.",
        iat: "Issued At: Identifies the time at which the JWT was issued.",
        jti: "JWT ID: Provides a unique identifier for the JWT."
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

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'JWT Decoder', href: '/jwt' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JWT Decoder & Parser Pro</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Decode, analyze, signature-verify, and construct JSON Web Tokens securely. Done completely client-side.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Input & Builder */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Token Input */}
                        <Card variant="elevated" className="flex flex-col p-6 bg-[var(--surface)] border-[var(--border)]">
                            <h2 className="text-lg font-bold mb-3 text-[var(--accent)] flex items-center gap-2">
                                <KeyRound size={20} />
                                Paste JWT Token
                            </h2>
                            
                            {/* Segment Color Guide */}
                            <div className="flex gap-4 text-xs font-bold mb-2">
                                <span className="text-red-400">Header</span>
                                <span className="text-gray-400">.</span>
                                <span className="text-[#3b82f6]">Payload</span>
                                <span className="text-gray-400">.</span>
                                <span className="text-emerald-400">Signature</span>
                            </div>

                            <textarea
                                value={token}
                                onChange={(e) => handleDecode(e.target.value)}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4MTYyMzkwMjJ9..."
                                className="w-full p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs focus:outline-none focus:border-[var(--accent)] resize-none min-h-[160px] leading-relaxed"
                            />

                            {token && (
                                <button
                                    onClick={() => handleCopyText(token, setCopiedToken)}
                                    className="mt-2 self-end flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] font-medium px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] transition-all"
                                >
                                    {copiedToken ? <Check size={14} /> : <Copy size={14} />}
                                    {copiedToken ? 'Copied Token' : 'Copy Token'}
                                </button>
                            )}

                            {/* Signature Verification Inputs */}
                            <div className="mt-4 pt-4 border-t border-[var(--border-strong)]">
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                                    Verify Signature (HMAC Secret)
                                </label>
                                <input
                                    type="password"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    placeholder="Enter HMAC Secret to verify token validity..."
                                    className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-strong)] rounded text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)]"
                                />
                            </div>
                        </Card>

                        {/* Token Builder / Constructor */}
                        <Card variant="elevated" className="flex flex-col p-6 bg-[var(--surface)] border-[var(--border)]">
                            <h2 className="text-lg font-bold mb-3 text-teal-400 flex items-center gap-2">
                                <Hammer size={20} />
                                Construct & Encode JWT
                            </h2>
                            
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">HEADER JSON</label>
                                    <textarea
                                        value={buildHeader}
                                        onChange={(e) => setBuildHeader(e.target.value)}
                                        rows={3}
                                        className="w-full p-2 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">PAYLOAD JSON</label>
                                    <textarea
                                        value={buildPayload}
                                        onChange={(e) => setBuildPayload(e.target.value)}
                                        rows={5}
                                        className="w-full p-2 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">SIGNATURE HMAC SECRET (Optional)</label>
                                    <input
                                        type="password"
                                        value={buildSecret}
                                        onChange={(e) => setBuildSecret(e.target.value)}
                                        placeholder="Secret for signing HS256..."
                                        className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-strong)] rounded text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)]"
                                    />
                                </div>

                                <Button 
                                    onClick={handleBuildToken}
                                    loading={isBuilding}
                                    className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold w-full mt-1"
                                >
                                    Build & Decode Token
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Decoded Output & Metadata */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {tokenState.isValid ? (
                            <div className="grid gap-6">
                                {/* Token Status Banner */}
                                <Card variant="elevated" className={`p-4 ${
                                    signatureStatus === 'valid' && !tokenState.isExpired ? 'border-green-500/30 bg-green-500/5' :
                                    signatureStatus === 'invalid' ? 'border-red-500/30 bg-red-500/5' :
                                    tokenState.isExpired ? 'border-red-500/30 bg-red-500/5' : 'border-blue-500/30 bg-blue-500/5'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded ${
                                                signatureStatus === 'valid' && !tokenState.isExpired ? 'bg-green-500/10 text-green-400' :
                                                signatureStatus === 'invalid' ? 'bg-red-500/10 text-red-400' :
                                                tokenState.isExpired ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                                {tokenState.isExpired || signatureStatus === 'invalid' ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xs tracking-wide uppercase text-[var(--text-muted)]">Token Status</h3>
                                                <p className={`font-semibold ${
                                                    signatureStatus === 'valid' && !tokenState.isExpired ? 'text-green-400' :
                                                    signatureStatus === 'invalid' ? 'text-red-400' :
                                                    tokenState.isExpired ? 'text-red-400' : 'text-blue-400'
                                                }`}>
                                                    {signatureStatus === 'valid' && !tokenState.isExpired ? 'Valid Signature & Active' :
                                                     signatureStatus === 'invalid' ? 'Signature Verification Failed' :
                                                     tokenState.isExpired ? 'Expired' : 'Active (Signature Unverified)'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-[var(--text-muted)] block font-semibold uppercase tracking-wider">Time Remaining</span>
                                            <span className="font-mono text-sm font-semibold">{tokenState.timeRemaining}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Meta details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card variant="default" className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                                        <span className="text-xs text-[var(--text-muted)] font-semibold block mb-1 flex items-center gap-1"><Cpu size={12} /> ALGORITHM</span>
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
                                    {/* Header Panel */}
                                    <Card variant="elevated" className="p-4 flex flex-col bg-[var(--surface)] border-[var(--border)] border-l-4 border-l-red-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-[var(--text-muted)] font-bold tracking-wider">HEADER (ALGORITHM & TYPE)</span>
                                            <button
                                                onClick={() => handleCopyText(header, setCopiedHeader)}
                                                className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-medium px-2 py-0.5 rounded bg-red-500/10 transition-all"
                                            >
                                                {copiedHeader ? <Check size={10} /> : <Copy size={10} />}
                                                {copiedHeader ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <pre className="p-3 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-red-400 overflow-x-auto max-h-[250px] leading-relaxed">
                                            {header}
                                        </pre>
                                    </Card>

                                    {/* Payload Panel */}
                                    <Card variant="elevated" className="p-4 flex flex-col bg-[var(--surface)] border-[var(--border)] border-l-4 border-l-blue-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-[var(--text-muted)] font-bold tracking-wider">PAYLOAD (DATA & CLAIMS)</span>
                                            <button
                                                onClick={() => handleCopyText(payload, setCopiedPayload)}
                                                className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-medium px-2 py-0.5 rounded bg-blue-500/10 transition-all"
                                            >
                                                {copiedPayload ? <Check size={10} /> : <Copy size={10} />}
                                                {copiedPayload ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <pre className="p-3 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-blue-400 overflow-x-auto max-h-[250px] leading-relaxed">
                                            {payload}
                                        </pre>
                                    </Card>
                                </div>

                                {/* Signature Section */}
                                <Card variant="elevated" className="p-4 flex flex-col bg-[var(--surface)] border-[var(--border)] border-l-4 border-l-emerald-500">
                                    <span className="text-xs text-[var(--text-muted)] font-bold tracking-wider mb-2 flex items-center gap-2">
                                        <SignatureIcon size={14} className="text-emerald-400" />
                                        RAW SIGNATURE HASH
                                    </span>
                                    <div className="p-3 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-emerald-400 break-all leading-relaxed">
                                        {signature}
                                    </div>
                                </Card>

                                {/* Claim Explanations Helper */}
                                <Card variant="elevated" className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                                    <h3 className="text-sm font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                                        <BookOpen size={16} className="text-[var(--accent)]" />
                                        JWT Registered Claims Explanation
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        {Object.entries(claimExplanations).map(([key, desc]) => (
                                            <div key={key} className="p-2 rounded bg-[var(--bg)] border border-[var(--border-strong)]">
                                                <span className="font-mono font-bold text-[var(--accent)] mr-2">{key}:</span>
                                                <span className="text-[var(--text-muted)]">{desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
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
