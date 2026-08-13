import React, { useState, useEffect, useRef } from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PdfUploadDropzone from '@/components/PdfUploadDropzone';
import { LuFileAudio, LuPlay, LuPause, LuSquare, LuDownload, LuSettings, LuFileText, LuActivity } from 'react-icons/lu';
import api from '@/services/api';
import { fileAPI } from '@/lib/api';
import Toast from '@/components/Toast';
import AdBanner from "@/components/AdBanner";

export default function PdfToSpeech() {
    const [file, setFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState('');
    
    // TTS State
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'ready' | 'generating'>('idle');
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Load voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                const englishVoice = availableVoices.find(v => v.lang.startsWith('en-')) || availableVoices[0];
                if (englishVoice) setSelectedVoiceURI(englishVoice.voiceURI);
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleFilesSelected = async (files: File[]) => {
        if (files.length === 0) return;
        const selected = files[0];
        setFile(selected);
        setStatus('uploading');
        
        try {
            const response = await fileAPI.uploadFiles([selected]);
            const uploadedFileId = response.files[0]._id;
            setFileId(uploadedFileId);
            
            // Auto extract text for preview
            setStatus('extracting');
            const extractRes = await api.post('/pdf-to-text', { fileId: uploadedFileId });
            if (extractRes.data.success && extractRes.data.textPreview) {
                setExtractedText(extractRes.data.textPreview);
                setStatus('ready');
            } else {
                throw new Error("Failed to extract text");
            }
        } catch (error: any) {
            showToast(error.message || "Upload failed", "error");
            setStatus('idle');
            setFile(null);
        }
    };

    const handlePlayPause = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
        } else if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
        } else {
            // Start playing
            if (!extractedText) return;
            window.speechSynthesis.cancel(); // clear queue
            const utterance = new SpeechSynthesisUtterance(extractedText.substring(0, 5000)); // Limit browser preview
            
            const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.rate = rate;
            utterance.pitch = pitch;
            
            utterance.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
            };
            
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    const handleGenerateMp3 = async () => {
        if (!fileId) return;
        setStatus('generating');
        try {
            const res = await api.post('/pdf-to-speech', { fileId });
            if (res.data.success && res.data.file) {
                const fileData = res.data.file;
                // Build the correct download URL using the filename from the output path
                const fileName = fileData.path ? fileData.path.split(/[\\/]/).pop() : fileData.originalName;
                // Strip /api suffix if present — static files are served at /outputs, not /api/outputs
                const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
                const downloadUrl = `${API_BASE}/outputs/${fileName}`;
                
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = fileData.originalName || fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast("Audio MP3 generated and downloaded successfully!");
            }
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to generate MP3", "error");
        } finally {
            setStatus('ready');
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ToolBasketAI PDF to Speech",
        "description": "Convert document text into high-fidelity audible voiceovers."
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
            <SEO title="PDF to Speech | Listen to PDF Documents" description="Convert document text into high-fidelity audible voiceovers and download as MP3." canonical="/pdf-to-speech" structuredData={structuredData} />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'PDF to Speech', href: '/pdf-to-speech' }]} />
                
                <header className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">PDF to Speech</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">Listen to your PDF documents instantly or export them as MP3 audio files.</p>
                </header>

                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Settings Panel */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded p-5 shadow-xl">
                            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-300">
                                <LuSettings className="w-4 h-4 text-[var(--accent)]" /> Voice Settings
                            </h2>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2">Voice Accent</label>
                                    <select
                                        value={selectedVoiceURI}
                                        onChange={(e) => {
                                            setSelectedVoiceURI(e.target.value);
                                            handleStop();
                                        }}
                                        className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm text-[var(--text)]"
                                    >
                                        {voices.map((v, i) => (
                                            <option key={i} value={v.voiceURI}>{v.name} ({v.lang})</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                                        <span>Reading Speed</span>
                                        <span>{rate}x</span>
                                    </label>
                                    <input 
                                        type="range" min="0.5" max="2" step="0.1" value={rate}
                                        onChange={(e) => {
                                            setRate(parseFloat(e.target.value));
                                            handleStop();
                                        }}
                                        className="w-full accent-[var(--accent)]"
                                    />
                                </div>
                                
                                <div>
                                    <label className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                                        <span>Voice Pitch</span>
                                        <span>{pitch}</span>
                                    </label>
                                    <input 
                                        type="range" min="0" max="2" step="0.1" value={pitch}
                                        onChange={(e) => {
                                            setPitch(parseFloat(e.target.value));
                                            handleStop();
                                        }}
                                        className="w-full accent-cyan-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded p-5 shadow-xl">
                            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-300">
                                <LuDownload className="w-4 h-4 text-[var(--accent)]" /> Export Audio
                            </h2>
                            <p className="text-xs text-slate-400 mb-4">Download the spoken text as an MP3 file (powered by high-fidelity Google TTS backend).</p>
                            
                            <button
                                onClick={handleGenerateMp3}
                                disabled={status !== 'ready'}
                                className="w-full py-3 rounded bg-[var(--accent)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'generating' ? (
                                    <span className="flex items-center gap-2 animate-pulse"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</span>
                                ) : (
                                    <><LuFileAudio className="w-4 h-4" /> Export MP3</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Main Area */}
                    <div className="lg:col-span-2">
                        {status === 'idle' || status === 'uploading' ? (
                            <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded p-8 flex flex-col items-center justify-center min-h-[400px]">
                                <PdfUploadDropzone 
                                    accept=".pdf" maxFiles={1} 
                                    loading={status === 'uploading'} 
                                    title="Upload PDF to Read" 
                                    onFilesSelected={handleFilesSelected} 
                                />
                            </div>
                        ) : status === 'extracting' ? (
                            <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded p-12 flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-12 h-12 rounded-full border-4 border-[var(--accent)]/30 border-t-[var(--accent)] animate-spin mb-4" />
                                <p className="text-[var(--text-muted)] font-medium animate-pulse">Extracting text for TTS engine...</p>
                            </div>
                        ) : (
                            <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded shadow-xl flex flex-col overflow-hidden h-[500px]">
                                <div className="bg-slate-900 border-b border-[var(--border-strong)] p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded">
                                            <LuActivity className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">{file?.name}</h3>
                                            <p className="text-xs text-slate-400">Live Browser Preview</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={handlePlayPause}
                                            className="w-10 h-10 rounded-full bg-[var(--accent)] hover:brightness-110 flex items-center justify-center text-white transition-all shadow-lg"
                                        >
                                            {isPlaying ? <LuPause className="w-4 h-4" /> : <LuPlay className="w-4 h-4 ml-0.5" />}
                                        </button>
                                        <button 
                                            onClick={handleStop}
                                            disabled={!isPlaying && !isPaused}
                                            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center text-white transition-all disabled:opacity-50"
                                        >
                                            <LuSquare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg)] text-slate-300 font-serif leading-relaxed relative">
                                    <LuFileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-5 text-slate-500 pointer-events-none" />
                                    {extractedText.split('\n').map((para, i) => (
                                        <p key={i} className="mb-4">{para}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
