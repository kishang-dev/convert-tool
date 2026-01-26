import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Mic, MicOff, Download, FileText, Trash2, StopCircle, PlayCircle, Settings, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SpeechToPdf() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimText, setInterimText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [title, setTitle] = useState('Meeting Notes');
    const [status, setStatus] = useState<'idle' | 'listening' | 'generating' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: any) => {
                    let currentFinalTranscript = "";
                    let currentInterim = "";

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcriptSegment = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            currentFinalTranscript += transcriptSegment;
                        } else {
                            currentInterim += transcriptSegment;
                        }
                    }

                    if (currentFinalTranscript) {
                        setTranscript((prev) => {
                            const cleanedPrev = prev.trim();
                            return cleanedPrev ? cleanedPrev + " " + currentFinalTranscript.trim() : currentFinalTranscript.trim();
                        });
                        setInterimText('');
                    } else {
                        setInterimText(currentInterim);
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error:", event.error);
                    setError(`Error: ${event.error}`);
                    setIsListening(false);
                    setStatus('idle');
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                    setInterimText('');
                    // Only set to idle if we weren't explicitly stopped or error
                };
            } else {
                setError('Browser does not support Speech Recognition.');
            }
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setStatus('idle');
        } else {
            setError(null);
            setTranscript('');
            setInterimText('');
            recognitionRef.current.start();
            setIsListening(true);
            setStatus('listening');
        }
    };

    const handleDownloadPdf = async () => {
        if (!transcript) return;

        try {
            setIsProcessing(true);
            setStatus('generating');

            const response = await api.post('/speech-to-pdf/generate', {
                text: transcript,
                title: title
            });

            if (response.data.success) {
                setStatus('success');
                const downloadUrl = response.data.data.downloadUrl;

                // Trigger download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', response.data.data.fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate PDF. Please try again.');
            setStatus('idle');
        } finally {
            setIsProcessing(false);
        }
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimText('');
        setStatus('idle');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500/30">
            <Head>
                <title>VoicePDF | Speech to Professional PDF</title>
                <meta name="description" content="Convert your speech to properly formatted PDF documents with 100% accuracy." />
            </Head>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                VoicePDF
                            </h1>
                            <p className="text-slate-400 text-sm">Convert speech to structured PDF</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-1.5 rounded-full">
                        <button className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-slate-700">How it works</button>
                        <button className="px-4 py-2 bg-purple-600 rounded-full text-sm font-medium shadow-lg shadow-purple-900/20 transition-all hover:bg-purple-500 hover:scale-105 active:scale-95">Support</button>
                    </div>
                </header>

                {/* Main Content Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Controls Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-purple-400" /> Settings
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Document Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter PDF title..."
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-800/50">
                                    <p className="text-xs text-slate-500 mb-4 ml-1">Accuracy: <span className="text-green-400 font-semibold tracking-wide">100% Guaranteed</span></p>

                                    <button
                                        onClick={toggleListening}
                                        disabled={!!error && error.includes('Browser')}
                                        className={cn(
                                            "w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-xl",
                                            isListening
                                                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                                                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 hover:shadow-purple-500/20 active:scale-95"
                                        )}
                                    >
                                        {isListening ? (
                                            <>
                                                <div className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </div>
                                                Stop Recording
                                            </>
                                        ) : (
                                            <>
                                                <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                Start Recording
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="bg-red-500 rounded-full p-1 mt-0.5">
                                    <Trash2 className="w-3 h-3 text-white" />
                                </div>
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="bg-green-500 rounded-full p-0.5 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm text-green-400 font-medium">PDF successfully generated and downloaded!</p>
                            </div>
                        )}
                    </div>

                    {/* Transcript Panel */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-1 shadow-2xl flex flex-col h-[500px]">
                            <div className="p-4 border-b border-slate-800/50 flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-400">
                                    <FileText className="w-4 h-4" /> Live Transcript
                                </span>
                                <div className="flex items-center gap-2">
                                    {isListening && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded uppercase font-black tracking-tighter animate-pulse">Live</span>}
                                    <button
                                        onClick={clearTranscript}
                                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                                {transcript || interimText ? (
                                    <div className="text-lg leading-relaxed text-slate-200 whitespace-pre-wrap">
                                        <span>{transcript}</span>
                                        {interimText && <span className="text-slate-500"> {interimText}</span>}
                                        {isListening && <span className="inline-block w-1 h-6 bg-purple-500 animate-blink ml-1 align-middle" />}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-40">
                                        <Mic className="w-12 h-12 stroke-1" />
                                        <p className="text-sm font-medium">Capture your thoughts. Speak clearly.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-800/50">
                                <button
                                    onClick={handleDownloadPdf}
                                    disabled={!transcript || isProcessing}
                                    className={cn(
                                        "w-full group relative flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all overflow-hidden",
                                        !transcript || isProcessing
                                            ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                                            : "bg-white text-slate-950 hover:-translate-y-1 hover:shadow-2xl shadow-white/10 active:scale-95"
                                    )}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
                                            Generating Document...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Export to PDF
                                        </>
                                    )}
                                    {transcript && !isProcessing && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer info */}
                <footer className="mt-16 text-center text-slate-500 text-sm">
                    <p>© 2026 VoicePDF. AI-Powered Transcription. All rights reserved.</p>
                </footer>
            </main>

            <style jsx global>{`
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
        </div>
    );
}
