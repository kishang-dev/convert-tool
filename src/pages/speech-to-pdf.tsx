import React, { useState, useEffect, useRef, useCallback } from 'react';
import SEO from '@/components/SEO';
import { LuMic as Mic, LuDownload as Download, LuFileText as FileText, LuTrash2 as Trash2, LuSettings as Settings, LuCircleCheck as CheckCircle2, LuCopy as Copy, LuLanguages as Languages, LuChartColumn as BarChart2, LuAlignLeft as AlignLeft, LuSave as Save, LuUndo2 as Undo2, LuType as Type, LuVideo as Video, LuMonitorUp as MonitorUp, LuWandSparkles as Wand2, LuSquarePlay as PlaySquare, LuCloudUpload as UploadCloud, LuFileAudio as FileAudio } from "react-icons/lu";
import api from '@/services/api';
import RichTextEditor from '@/components/RichTextEditor';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Navbar from '@/components/Navbar';
import AdBanner from "@/components/AdBanner";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Languages supported by Web Speech API
const LANGUAGES = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'gu-IN', label: 'Gujarati' },
    { code: 'es-ES', label: 'Spanish' },
    { code: 'fr-FR', label: 'French' },
    { code: 'de-DE', label: 'German' },
    { code: 'zh-CN', label: 'Chinese (Simplified)' },
    { code: 'ja-JP', label: 'Japanese' },
    { code: 'ar-SA', label: 'Arabic' },
    { code: 'pt-BR', label: 'Portuguese (Brazil)' },
    { code: 'ru-RU', label: 'Russian' },
];

const AUTO_SAVE_KEY = 'voicepdf_autosave';
const AUTO_SAVE_TITLE_KEY = 'voicepdf_autosave_title';

function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return 0;
    return text.split(' ').filter(Boolean).length;
}

function countChars(html: string): number {
    return html.replace(/<[^>]*>/g, '').length;
}

export default function SpeechToPdf() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimText, setInterimText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [title, setTitle] = useState('Meeting Notes');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'idle' | 'listening' | 'generating' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);
    const [copyStatus, setCopyStatus] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [volume, setVolume] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [recordMode, setRecordMode] = useState<'audio' | 'meeting'>('audio');
    const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
    const [isUploadingFile, setIsUploadingFile] = useState(false);

    const recognitionRef = useRef<any>(null);
    const editorRef = useRef<any>(null);
    const isListeningRef = useRef(false);
    // Track result indices that have been committed to avoid duplicates
    const committedIndicesRef = useRef(new Set<number>());
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
    // AudioContext for volume visualizer
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const displayStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const volumeRafRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sttTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ── Load auto-save on mount ──────────────────────────────────────────────
    useEffect(() => {
        try {
            const savedTranscript = localStorage.getItem(AUTO_SAVE_KEY);
            const savedTitle = localStorage.getItem(AUTO_SAVE_TITLE_KEY);
            if (savedTranscript) setTranscript(savedTranscript);
            if (savedTitle) setTitle(savedTitle);
        } catch (_) { }
    }, []);

    // ── Auto-save transcript ─────────────────────────────────────────────────
    useEffect(() => {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        if (!transcript) return;

        setAutoSaveStatus('saving');
        autoSaveTimerRef.current = setTimeout(() => {
            try {
                localStorage.setItem(AUTO_SAVE_KEY, transcript);
                localStorage.setItem(AUTO_SAVE_TITLE_KEY, title);
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus(null), 2000);
            } catch (_) { }
        }, 1500);

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        };
    }, [transcript, title]);

    // ── Speech recognition setup ─────────────────────────────────────────────
    const setupRecognition = useCallback(() => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechSupported(false);
            setError('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
            return;
        }

        // Cleanup old instance
        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (_) { }
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = selectedLang;

        recognition.onstart = () => {
            setStatus('listening');
            setError(null);
        };

        recognition.onresult = (event: any) => {
            let newFinalText = '';
            let currentInterim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = result[0].transcript;

                if (result.isFinal) {
                    // Only commit if we haven't already committed this result index
                    if (!committedIndicesRef.current.has(i)) {
                        committedIndicesRef.current.add(i);
                        newFinalText += transcript;
                    }
                } else {
                    currentInterim += transcript;
                }
            }

            // Commit final text to editor
            if (newFinalText.trim()) {
                const textToInsert = ' ' + newFinalText.trim();
                setHistory(prev => [...prev.slice(-49), transcript]); // keep last 50 snapshots
                if (editorRef.current) {
                    editorRef.current.insertTextAtCursor(textToInsert);
                } else {
                    setTranscript(prev => prev.trim()
                        ? prev + textToInsert
                        : `<p>${newFinalText.trim()}</p>`
                    );
                }
            }

            // Interim is only shown as preview — NEVER committed proactively
            setInterimText(currentInterim);
        };

        recognition.onerror = (event: any) => {
            // 'no-speech' is a benign browser timeout — suppress it
            if (event.error === 'no-speech') return;
            // 'aborted' happens on manual stop — suppress it
            if (event.error === 'aborted') return;
            setError(`Recognition error: ${event.error}`);
            stopListening();
        };

        recognition.onend = () => {
            // If we still want to listen, auto-restart (handles browser's 60s cutoff)
            if (isListeningRef.current) {
                if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
                restartTimerRef.current = setTimeout(() => {
                    try {
                        if (isListeningRef.current) recognition.start();
                    } catch (_) { }
                }, 200); // small delay prevents "already started" errors
            } else {
                setIsListening(false);
                setInterimText('');
                setStatus('idle');
            }
        };

        recognitionRef.current = recognition;
    }, [selectedLang]);

    useEffect(() => {
        setupRecognition();
        return () => {
            try { recognitionRef.current?.abort(); } catch (_) { }
        };
    }, [setupRecognition]);

    // ── Auto-Generate Description ────────────────────────────────────────────
    const autoGenerateDescription = async (textToSummarize: string) => {
        if (!textToSummarize.trim()) return;
        try {
            // Attempt to use Chrome's built-in AI window.ai API if available
            if ('ai' in window && 'summarizer' in (window as any).ai) {
                const summarizer = await (window as any).ai.summarizer.create();
                const cleanText = textToSummarize.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                const summary = await summarizer.summarize(cleanText);
                setDescription(summary);
                return;
            }
        } catch (_) {}
        
        // Fallback: simple heuristic auto-description
        const words = countWords(textToSummarize);
        const cleanText = textToSummarize.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const snippet = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
        setDescription(`Meeting recorded on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.\nTotal words: ${words}.\nSummary/Topics: ${snippet || 'No speech detected.'}`);
    };

    useEffect(() => {
        if (!isListening && transcript.trim() && !description.trim()) {
            // Auto generate description slightly after stopping if empty
            const timer = setTimeout(() => autoGenerateDescription(transcript), 500);
            return () => clearTimeout(timer);
        }
    }, [isListening, transcript, description]);

    // ── Volume visualizer via AudioContext ───────────────────────────────────
    const startVolumeMonitor = async (stream?: MediaStream) => {
        try {
            const streamToUse = stream || await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!stream) micStreamRef.current = streamToUse;
            
            const ctx = new AudioContext();
            audioContextRef.current = ctx;
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
            const source = ctx.createMediaStreamSource(streamToUse);
            source.connect(analyser);

            const data = new Uint8Array(analyser.frequencyBinCount);
            const tick = () => {
                if (!isListeningRef.current) return;
                analyser.getByteFrequencyData(data);
                const avg = data.reduce((a, b) => a + b, 0) / data.length;
                setVolume(Math.min(100, Math.round((avg / 128) * 100)));
                volumeRafRef.current = requestAnimationFrame(tick);
            };
            tick();
        } catch (_) {
            // Mic access denied — volume meter stays at 0, not critical
        }
    };

    const stopVolumeMonitor = () => {
        if (volumeRafRef.current) cancelAnimationFrame(volumeRafRef.current);
        micStreamRef.current?.getTracks().forEach(t => t.stop());
        displayStreamRef.current?.getTracks().forEach(t => t.stop());
        audioContextRef.current?.close();
        audioContextRef.current = null;
        analyserRef.current = null;
        micStreamRef.current = null;
        displayStreamRef.current = null;
        setVolume(0);
        if (sttTimeoutRef.current) clearTimeout(sttTimeoutRef.current);
    };

    // ── Controls ─────────────────────────────────────────────────────────────
    const startListening = async () => {
        setError(null);
        committedIndicesRef.current.clear();
        setInterimText('');
        if (recordingUrl) {
            URL.revokeObjectURL(recordingUrl);
            setRecordingUrl(null);
        }
        isListeningRef.current = true;
        
        try {
            if (recordMode === 'meeting') {
                // Check if screen sharing is supported (fails on most mobile browsers)
                if (!navigator.mediaDevices.getDisplayMedia) {
                    throw new Error("Screen sharing is not supported on this device/browser (try using a desktop).");
                }

                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).catch(err => {
                    throw new Error("Screen sharing permission denied or not supported.");
                });
                const micStream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
                    throw new Error("Microphone permission denied.");
                });
                
                displayStreamRef.current = displayStream;
                micStreamRef.current = micStream;

                const tracks = [...displayStream.getVideoTracks()];
                const audioContext = new AudioContext();
                const dest = audioContext.createMediaStreamDestination();
                
                if (displayStream.getAudioTracks().length > 0) {
                    const displaySource = audioContext.createMediaStreamSource(displayStream);
                    displaySource.connect(dest);
                }
                if (micStream.getAudioTracks().length > 0) {
                    const micSource = audioContext.createMediaStreamSource(micStream);
                    micSource.connect(dest);
                }
                
                const mixedStream = new MediaStream([
                    ...tracks,
                    ...dest.stream.getAudioTracks()
                ]);

                // 1. Recorder for the full video file
                const mediaRecorder = new MediaRecorder(mixedStream);
                const chunks: BlobPart[] = [];
                mediaRecorder.ondataavailable = e => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    setRecordingUrl(URL.createObjectURL(blob));
                    audioContext.close();
                };
                
                mediaRecorder.start();
                mediaRecorderRef.current = mediaRecorder;
                
                startVolumeMonitor(micStream);

                // 2. Real-Time Audio Chunking loop for Remote Speaker Transcription
                const mlStream = new MediaStream(dest.stream.getAudioTracks());
                startCloudTranscriptionLoop(mlStream);

            } else {
                // AUDIO MODE (Mic Only)
                const micStream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
                    throw new Error("Microphone permission denied.");
                });
                startVolumeMonitor(micStream);

                // If native SpeechRecognition is unsupported (e.g. iOS Safari < 14.5 or Firefox), fallback to Cloud AI!
                if (!speechSupported) {
                    console.log("Native STT not supported, falling back to Cloud AI...");
                    startCloudTranscriptionLoop(micStream);
                }
            }
        } catch (e: any) {
            setError('Failed to start media capturing: ' + e.message);
            isListeningRef.current = false;
            return;
        }

        // Start native recognition if supported
        if (speechSupported) {
            try {
                recognitionRef.current?.start();
            } catch (_) { }
        }
        setIsListening(true);
        setStatus('listening');
    };

    const startCloudTranscriptionLoop = (stream: MediaStream) => {
        const loopSTT = () => {
            if (!isListeningRef.current) return;

            try {
                const sttRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                sttRecorder.ondataavailable = async (e) => {
                    if (e.data.size > 0 && isListeningRef.current) {
                        try {
                            const formData = new FormData();
                            const blob = new Blob([e.data], { type: 'audio/webm' });
                            formData.append('audio', blob, 'chunk.webm');
                            
                            const res = await api.post('/transcribe-chunk', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            if (res.data?.success && res.data.text) {
                                setTranscript(prev => {
                                    const newText = res.data.text;
                                    return prev ? `${prev} ${newText}` : newText;
                                });
                            }
                        } catch (_) {}
                    }
                };
                sttRecorder.start();
                sttTimeoutRef.current = setTimeout(() => {
                    if (isListeningRef.current && sttRecorder.state !== 'inactive') {
                        sttRecorder.stop();
                        loopSTT();
                    } else if (sttRecorder.state !== 'inactive') {
                        sttRecorder.stop();
                    }
                }, 6000); // 6s chunks
            } catch (_) {}
        };
        loopSTT();
    };

    const stopListening = () => {
        isListeningRef.current = false;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        try {
            recognitionRef.current?.stop();
        } catch (_) { }
        
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        setIsListening(false);
        setInterimText('');
        setStatus('idle');
        stopVolumeMonitor();
    };

    const toggleListening = () => {
        if (isListening) stopListening();
        else startListening();
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setHistory(h => h.slice(0, -1));
        setTranscript(prev ?? '');
    };

    const handleCopy = async () => {
        const text = transcript.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(true);
            setTimeout(() => setCopyStatus(false), 2000);
        } catch (_) { }
    };

    const handleDownloadTxt = () => {
        const text = transcript.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'transcript'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadPdf = async () => {
        if (!transcript) return;
        try {
            setIsProcessing(true);
            setStatus('generating');
            const response = await api.post('/speech-to-pdf/generate', {
                text: transcript,
                title,
                description
            });
            if (response.data.success) {
                setStatus('success');
                const link = document.createElement('a');
                link.href = response.data.data.downloadUrl;
                link.setAttribute('download', response.data.data.fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (_) {
            setError('Failed to generate PDF. Please try again.');
            setStatus('idle');
        } finally {
            setIsProcessing(false);
        }
    };

    const clearTranscript = () => {
        setHistory([]);
        setTranscript('');
        setInterimText('');
        setStatus('idle');
        try {
            localStorage.removeItem(AUTO_SAVE_KEY);
        } catch (_) { }
    };

    const handleLocalAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingFile(true);
            setError(null);
            setStatus('generating'); // Reusing generating state to show loader

            const formData = new FormData();
            formData.append('files', file);

            // Upload the file to be stored temporarily
            const uploadRes = await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const fileId = uploadRes.data?.files?.[0]?._id;
            if (!fileId) throw new Error("File upload failed.");

            // Directly call the transcribe-file endpoint since it's mounted at /api/transcribe-file
            const transcribeRes = await api.post('/transcribe-file', { fileId });

            if (transcribeRes.data?.success) {
                const newText = transcribeRes.data.text;
                setTranscript(prev => prev ? `${prev}<br><br>${newText}` : newText);
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                throw new Error("Local transcription had an issue.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || "Failed to transcribe uploaded file.");
            setStatus('idle');
        } finally {
            setIsUploadingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const wordCount = countWords(transcript);
    const charCount = countChars(transcript);

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "VoicePDF | Speech to Professional PDF",
        "description": "Convert your speech to properly formatted PDF documents.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/speech-to-pdf`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[var(--accent)]/30">
            <SEO 
                title="VoicePDF | Speech to Professional PDF" 
                description="Convert your speech to properly formatted PDF documents." 
                canonical="/speech-to-pdf"
                structuredData={structuredData}
            />

            <Navbar />

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                <Breadcrumbs 
                    items={[
                        { label: 'VoicePDF', href: '/speech-to-pdf' }
                    ]} 
                />
                
                {/* ── Header ── */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded flex items-center justify-center shadow-lg shadow-[var(--accent-ring)] rotate-3">
                            <Mic className="w-5 h-5 text-[var(--text)] dark:text-[var(--text)]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] dark:text-[var(--text)]">VoicePDF</h1>
                            <p className="text-slate-400 text-xs">Real-time speech → formatted document</p>
                        </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />

                    </div>

                    {/* Auto-save status */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        {autoSaveStatus === 'saving' && (
                            <span className="flex items-center gap-1.5 animate-pulse">
                                <Save className="w-3 h-3" /> Auto-saving…
                            </span>
                        )}
                        {autoSaveStatus === 'saved' && (
                            <span className="flex items-center gap-1.5 text-green-400 animate-in fade-in duration-300">
                                <CheckCircle2 className="w-3 h-3" /> Saved locally
                            </span>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left Panel: Settings & Controls ── */}
                    <aside className="lg:col-span-1 space-y-4">

                        {/* Settings Card */}
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded p-5 shadow-xl">
                            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-300">
                                <Settings className="w-4 h-4 text-[var(--accent)]" /> Settings
                            </h2>

                            <div className="space-y-4">
                                {/* Record Mode */}
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                                        Recording Mode
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setRecordMode('audio')}
                                            disabled={isListening}
                                            className={cn(
                                                'py-2 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 transition-all border',
                                                recordMode === 'audio' 
                                                    ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' 
                                                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50'
                                            )}
                                        >
                                            <Mic className="w-3.5 h-3.5" /> Mic Only
                                        </button>
                                        <button
                                            onClick={() => setRecordMode('meeting')}
                                            disabled={isListening}
                                            className={cn(
                                                'py-2 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 transition-all border',
                                                recordMode === 'meeting' 
                                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                                                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50'
                                            )}
                                        >
                                            <MonitorUp className="w-3.5 h-3.5" /> Screen + Mic
                                        </button>
                                    </div>
                                </div>

                                {/* Document title */}
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                                        Document Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Enter PDF title…"
                                        className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] transition-all placeholder-[var(--text-faint)] text-[var(--text)]"
                                    />
                                </div>

                                {/* Document Description */}
                                <div>
                                    <label className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                                        <span>Meeting Description</span>
                                        <button 
                                            onClick={() => autoGenerateDescription(transcript)}
                                            disabled={!transcript.trim()}
                                            className="text-[var(--accent)] hover:text-indigo-300 flex items-center gap-1 normal-case tracking-normal disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Wand2 className="w-3 h-3" /> Auto-write
                                        </button>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Meeting summary will generate here automatically or you can type it..."
                                        rows={3}
                                        className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] transition-all placeholder-[var(--text-faint)] text-[var(--text)] resize-none"
                                    />
                                </div>

                                {/* Local File Transcription Upload */}
                                <div className="pt-2 border-t border-slate-800">
                                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                                        Transcribe Pre-recorded Media
                                    </label>
                                    <input 
                                        type="file" 
                                        accept="audio/*,video/*" 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        onChange={handleLocalAudioUpload} 
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isListening || isUploadingFile || isProcessing}
                                        className="w-full py-2.5 rounded border border-dashed border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all text-xs font-medium flex justify-center items-center gap-2 group disabled:opacity-50"
                                    >
                                        {isUploadingFile ? (
                                            <span className="flex items-center gap-2 animate-pulse text-[var(--accent)]">
                                                <div className="w-3.5 h-3.5 border-2 border-[var(--accent)]/30 border-t-indigo-500 rounded-full animate-spin" />
                                                Processing with Whisper AI...
                                            </span>
                                        ) : (
                                            <>
                                                <UploadCloud className="w-4 h-4 text-slate-500 group-hover:text-[var(--accent)] transition-colors" />
                                                Upload Audio/Video File
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Language selector */}
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                                        <span className="flex items-center gap-1.5"><Languages className="w-3 h-3" /> Language</span>
                                    </label>
                                    <select
                                        value={selectedLang}
                                        onChange={e => {
                                            if (isListening) stopListening();
                                            setSelectedLang(e.target.value);
                                        }}
                                        className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] transition-all text-[var(--text)]"
                                    >
                                        {LANGUAGES.map(l => (
                                            <option key={l.code} value={l.code}>{l.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Volume visualizer */}
                                {isListening && (
                                    <div className="space-y-1.5 animate-in fade-in duration-300">
                                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">Mic Level</p>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-75"
                                                style={{ width: `${volume}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            {[...Array(12)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 rounded-full transition-all duration-75"
                                                    style={{
                                                        height: `${Math.max(4, volume > (i * 8.5) ? 8 + Math.random() * 16 : 4)}px`,
                                                        backgroundColor: volume > (i * 8.5) ? '#818cf8' : '#1e293b',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Record button */}
                                <div className="pt-1 border-t border-slate-800/50">
                                    <button
                                        onClick={toggleListening}
                                        disabled={!speechSupported}
                                        className={cn(
                                            'w-full flex items-center justify-center gap-2.5 py-3.5 rounded font-semibold text-sm transition-all duration-200 select-none',
                                            isListening
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 active:scale-95'
                                                : 'bg-[var(--accent)] text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'
                                        )}
                                    >
                                        {isListening ? (
                                            <>
                                                <span className="relative flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                                                </span>
                                                Stop Recording
                                            </>
                                        ) : (
                                            <>
                                                <Mic className="w-4 h-4" />
                                                Start Recording
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded p-5 shadow-xl">
                            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-300">
                                <BarChart2 className="w-4 h-4 text-[var(--accent)]" /> Stats
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: <Type className="w-3.5 h-3.5" />, label: 'Words', value: wordCount.toLocaleString() },
                                    { icon: <AlignLeft className="w-3.5 h-3.5" />, label: 'Characters', value: charCount.toLocaleString() },
                                ].map(stat => (
                                    <div key={stat.label} className="bg-[var(--bg-elevated)] rounded p-3 border border-[var(--border)]">
                                        <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs mb-1">{stat.icon}{stat.label}</div>
                                        <p className="text-xl font-bold text-[var(--text)] tabular-nums">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 bg-slate-800/50 rounded p-3 border border-slate-700/30">
                                <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs mb-1">
                                    <FileText className="w-3.5 h-3.5" /> Est. Reading Time
                                </div>
                                <p className="text-base font-semibold text-[var(--text)]">
                                    {wordCount < 200 ? '< 1 min' : `~${Math.round(wordCount / 200)} min`}
                                </p>
                            </div>
                        </div>

                        {/* Errors / success */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded p-4 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="shrink-0 bg-red-500 rounded-full p-0.5 mt-0.5">
                                    <Trash2 className="w-3 h-3 text-[var(--text)] dark:text-[var(--text)]" />
                                </div>
                                <p className="text-xs text-red-400 leading-relaxed">{error}</p>
                            </div>
                        )}

                        {recordingUrl && !isListening && recordMode === 'meeting' && (
                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                                    <PlaySquare className="w-4 h-4" /> Meeting Recorded Details
                                </div>
                                <a
                                    href={recordingUrl}
                                    download={`Meeting_Recording_${new Date().getTime()}.webm`}
                                    className="flex items-center justify-center gap-2 py-2 px-4 rounded bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
                                >
                                    <Video className="w-4 h-4" /> Download Video (.webm)
                                </a>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded p-4 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-green-400 font-medium">PDF generated and downloaded!</p>
                            </div>
                        )}
                    </aside>

                    {/* ── Right Panel: Transcript ── */}
                    <section className="lg:col-span-2 flex flex-col gap-4">
                        <div className="relative bg-[var(--surface)] border border-[var(--border-strong)] rounded shadow-2xl flex flex-col"
                            style={{ minHeight: '620px', maxHeight: '780px' }}>

                            {/* Panel header */}
                            <div className="px-5 py-3.5 border-b border-[var(--border)] flex justify-between items-center gap-3 shrink-0">
                                <span className="flex items-center gap-2 text-sm text-[var(--text-muted)] font-medium">
                                    <FileText className="w-4 h-4 text-[var(--accent)]" /> Live Transcript
                                    {isListening && (
                                        <span className="text-[10px] bg-red-500 text-[var(--text)] dark:text-[var(--text)] px-2 py-0.5 rounded-full uppercase font-black tracking-tight animate-pulse">
                                            Live
                                        </span>
                                    )}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    {/* Undo */}
                                    <button
                                        onClick={handleUndo}
                                        disabled={history.length === 0}
                                        title="Undo last speech"
                                        className="p-2 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                    </button>

                                    {/* Copy */}
                                    <button
                                        onClick={handleCopy}
                                        disabled={!transcript}
                                        title="Copy as plain text"
                                        className="p-2 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {copyStatus
                                            ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            : <Copy className="w-4 h-4" />
                                        }
                                    </button>

                                    {/* Clear */}
                                    <button
                                        onClick={clearTranscript}
                                        title="Clear transcript"
                                        className="p-2 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Editor */}
                            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                                <RichTextEditor
                                    ref={editorRef}
                                    value={transcript}
                                    onChange={setTranscript}
                                    placeholder={isListening
                                        ? 'Listening… speak now.'
                                        : 'Your transcript appears here. You can also type manually or paste text.'}
                                    className="flex-1"
                                    isSpeechActive={isListening}
                                />

                                {/* Interim preview bar */}
                                {isListening && (
                                    <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-sm shrink-0 animate-in slide-in-from-bottom-2 duration-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                                            </span>
                                            <span className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-widest">Recognizing…</span>
                                        </div>
                                        <p className="text-[var(--text-muted)] italic text-sm min-h-[1.25rem] leading-relaxed line-clamp-2">
                                            {interimText || 'Waiting for speech…'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Export footer */}
                            <div className="p-4 border-t border-[var(--border)] flex gap-3 shrink-0">
                                {/* Export .txt */}
                                <button
                                    onClick={handleDownloadTxt}
                                    disabled={!transcript}
                                    title="Export as plain text"
                                    className={cn(
                                        'flex items-center justify-center gap-2 px-4 py-3 rounded text-sm font-medium transition-all border',
                                        !transcript
                                            ? 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] cursor-not-allowed'
                                            : 'bg-[var(--surface-hover)] text-[var(--text)] border-[var(--border-strong)] hover:bg-[var(--surface)] active:scale-95'
                                    )}
                                >
                                    <FileText className="w-4 h-4" /> .TXT
                                </button>

                                {/* Export PDF */}
                                <button
                                    onClick={handleDownloadPdf}
                                    disabled={!transcript || isProcessing}
                                    className={cn(
                                        'flex-1 group relative flex items-center justify-center gap-2.5 py-3 rounded font-semibold text-sm transition-all overflow-hidden',
                                        !transcript || isProcessing
                                            ? 'bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed'
                                            : 'bg-[var(--accent)] text-white hover:-translate-y-0.5 hover:shadow-2xl shadow-[var(--accent-ring)] active:scale-95'
                                    )}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
                                            Generating…
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" /> Export PDF
                                            {transcript && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease_infinite]" />
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="mt-12 text-center text-slate-600 text-xs">
                    © 2026 VoicePDF · AI-Powered Transcription
                </footer>
            </main>

            <style jsx global>{`
        @keyframes shine { 100% { transform: translateX(100%); } }
      `}</style>
        
            <ToolSEOContent toolName="VoicePDF | Speech to Professional PDF" toolDescription="Convert your speech to properly formatted PDF documents." />
            <Footer />
        </div>
    );
}
