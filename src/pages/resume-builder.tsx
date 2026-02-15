import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Toast from '@/components/Toast';
import ResumeTemplate from '@/components/ResumeTemplate';
import { resumeAPI, ResumeData } from '@/lib/api';
import {
    Upload, FileText, Download, Save, Palette,
    User, Briefcase, GraduationCap, Code, Globe,
    Plus, Trash2, Edit3, ChevronRight, CheckCircle, Layout
} from 'lucide-react';

const INITIAL_DATA: ResumeData = {
    personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '', linkedin: '', github: '', website: '' },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: [],
    awards: [],
    interests: [],
    template: 'modern',
    color: '#3b82f6',
    font: 'Inter'
};

const TEMPLATES = [
    { id: 'modern', name: 'Modern Professional' },
    { id: 'classic', name: 'Classic Serif' },
    { id: 'elegant', name: 'Premium Sidebar' },
    { id: 'executive', name: 'Corporate Executive' },
    { id: 'minimalist', name: 'Minimalist Luxe' },
    { id: 'creative', name: 'Creative Portfolio' },
    { id: 'tech', name: 'Developer Terminal' },
    { id: 'bold', name: 'Impact High-Contrast' },
    { id: 'soft', name: 'Organic Soft-UI' },
    { id: 'neon', name: 'Neon Dark-Mode' },
    { id: 'metro', name: 'Metro Grid-Sync' },
    { id: 'brutal', name: 'Neo-Brutalism' },
    { id: 'vogue', name: 'Vogue Editorial' },
    { id: 'geometric', name: 'Geometric Fluid' },
    { id: 'timeline', name: 'Vertical Timeline' },
    { id: 'formal', name: 'Academic Formal' },
    { id: 'compact', name: 'Dense Compact' },
    { id: 'slate', name: 'Deep Slate Dark' },
    { id: 'minimalSidebar', name: 'Minimal Icon Sidebar' },
    { id: 'gradient', name: 'Gradient Flow' },
    { id: 'accent', name: 'Bold Accent Sidebar' },
    { id: 'folio', name: 'Portfolio Exhibition' },
    { id: 'hybrid', name: 'Hybrid Multi-Column' },
    { id: 'clean', name: 'Clean Swiss Design' },
    { id: 'monochrome', name: 'Monochrome Mastery' }
];

export default function ResumeBuilder() {
    const [step, setStep] = useState(1);
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resumeRef = useRef<HTMLDivElement>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);
            try {
                const res = await resumeAPI.parseResume(e.target.files[0]);
                if (res.success) {
                    setResumeData({ ...INITIAL_DATA, ...res.data });
                    setStep(2);
                    showToast('Resume parsed successfully!');
                }
            } catch (err: any) {
                showToast(err.response?.data?.error || 'Failed to parse resume', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await resumeAPI.saveResume(resumeData);
            if (res.success) {
                setResumeData(res.data);
                showToast('Resume saved to your account');
            }
        } catch (err: any) {
            showToast('Login required to save resumes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!resumeRef.current) return;
        setLoading(true);
        try {
            // In a real app, we'd send the HTML to the backend
            // For now, let's simulate the export
            const html = resumeRef.current.innerHTML;
            const res = await resumeAPI.exportResume(resumeData._id || 'temp', `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8">
                        <script src="https://cdn.tailwindcss.com"></script>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
                        <style>
                            @page { 
                                size: A4; 
                                margin: 0; 
                            }
                            body { 
                                margin: 0; 
                                padding: 0; 
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            .resume-page { 
                                box-shadow: none !important; 
                                margin: 0 !important; 
                                width: 210mm !important; 
                                min-height: 297mm !important;
                                page-break-after: always;
                            }
                            * { -webkit-print-color-adjust: exact !important; }
                        </style>
                        <script>
                            tailwind.config = {
                                theme: {
                                    extend: {
                                        fontFamily: {
                                            inter: ['Inter', 'sans-serif'],
                                            lora: ['Lora', 'serif'],
                                            outfit: ['Outfit', 'sans-serif'],
                                        }
                                    }
                                }
                            }
                        </script>
                    </head>
                    <body class="bg-white">${html}</body>
                </html>
            `);

            if (res.success) {
                const downloadUrl = res.downloadUrl.startsWith('http')
                    ? res.downloadUrl
                    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${res.downloadUrl}`;

                // More reliable download trigger
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `resume-${resumeData.personalInfo.fullName.replace(/\s+/g, '-')}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast('Export successful!');
            }
        } catch (err) {
            showToast('Failed to export PDF', 'error');
        } finally {
            setLoading(false);
        }
    };

    const addListItem = (field: keyof ResumeData, newItem: any) => {
        setResumeData(prev => ({
            ...prev,
            [field]: [...(Array.isArray(prev[field]) ? (prev[field] as any[]) : []), newItem]
        }));
    };

    const removeListItem = (field: keyof ResumeData, index: number) => {
        setResumeData(prev => ({
            ...prev,
            [field]: Array.isArray(prev[field])
                ? (prev[field] as any[]).filter((_, i) => i !== index)
                : prev[field]
        }));
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <Head>
                <title>AI Resume Builder | QuickPDF</title>
            </Head>

            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                {/* Stepper */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10">
                        {[1, 2, 3].map(s => (
                            <button
                                key={s}
                                onClick={() => step > s && setStep(s)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step === s ? 'bg-blue-600 text-white' :
                                    step > s ? 'bg-green-600 text-white' : 'text-gray-500'
                                    }`}
                            >
                                {step > s ? <CheckCircle size={20} /> : s}
                            </button>
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <div className="max-w-6xl mx-auto text-center animate-fadeIn py-12">
                        <h1 className="text-6xl font-black mb-6 gradient-text tracking-tighter">
                            Resume Builder & Converter
                        </h1>
                        <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto font-light">
                            Choose how you want to start. Upload an existing document for an instant AI conversion,
                            or build a professional resume from scratch.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Option 1: Upload */}
                            <Card variant="elevated" className="p-12 bg-white/5 border border-white/10 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl">
                                        <Upload size={48} className="text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Select your resume</h2>
                                    <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                                        Import details from PDF or Word <br /> for instant AI extraction.
                                    </p>

                                    <Button
                                        size="lg"
                                        loading={loading}
                                        className="w-full py-6 text-lg rounded-2xl shadow-xl hover:shadow-blue-500/20"
                                    >
                                        Choose File
                                    </Button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </Card>

                            {/* Option 2: Create New */}
                            <Card variant="elevated" className="p-12 bg-white/5 border border-white/10 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 cursor-pointer" onClick={() => setStep(2)}>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-purple-600/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl">
                                        <Plus size={48} className="text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Create From Scratch</h2>
                                    <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                                        Start fresh with our guide <br /> and professional suggestions.
                                    </p>

                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full py-6 text-lg rounded-2xl shadow-xl hover:shadow-purple-500/20 bg-white/5 border-white/10"
                                    >
                                        Build New Resume
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideIn">
                        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Edit3 className="text-blue-500" />
                                Edit Your Details
                            </h2>

                            {/* Personal Info */}
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-6 text-blue-400 font-bold border-b border-white/5 pb-2">
                                    <User size={20} />
                                    Personal Information
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase font-bold">Full Name</label>
                                        <input
                                            value={resumeData.personalInfo.fullName}
                                            onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, fullName: e.target.value } })}
                                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold">Email</label>
                                        <input
                                            value={resumeData.personalInfo.email}
                                            onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value } })}
                                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold">Phone</label>
                                        <input
                                            value={resumeData.personalInfo.phone}
                                            onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value } })}
                                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold">LinkedIn</label>
                                            <input
                                                value={resumeData.personalInfo.linkedin}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value } })}
                                                className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none"
                                                placeholder="linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold">GitHub</label>
                                            <input
                                                value={resumeData.personalInfo.github}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, github: e.target.value } })}
                                                className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none"
                                                placeholder="github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase font-bold">Website</label>
                                            <input
                                                value={resumeData.personalInfo.website}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, website: e.target.value } })}
                                                className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none"
                                                placeholder="portfolio.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase font-bold">Summary</label>
                                        <textarea
                                            rows={4}
                                            value={resumeData.personalInfo.summary}
                                            onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, summary: e.target.value } })}
                                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Experience */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-3 text-green-400 font-bold">
                                        <Briefcase size={20} />
                                        Work Experience
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => addListItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '', current: false })}>
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                {resumeData.experience.map((exp, i) => (
                                    <div key={i} className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 relative">
                                        <button
                                            onClick={() => removeListItem('experience', i)}
                                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Company" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={exp.company} onChange={e => {
                                                const newExp = [...resumeData.experience];
                                                newExp[i].company = e.target.value;
                                                setResumeData({ ...resumeData, experience: newExp });
                                            }} />
                                            <input placeholder="Position" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={exp.position} onChange={e => {
                                                const newExp = [...resumeData.experience];
                                                newExp[i].position = e.target.value;
                                                setResumeData({ ...resumeData, experience: newExp });
                                            }} />
                                            <div className="grid grid-cols-2 gap-4 col-span-2">
                                                <input placeholder="Start Date" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={exp.startDate} onChange={e => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp[i].startDate = e.target.value;
                                                    setResumeData({ ...resumeData, experience: newExp });
                                                }} />
                                                <input placeholder="End Date (or 'Present')" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={exp.endDate} onChange={e => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp[i].endDate = e.target.value;
                                                    setResumeData({ ...resumeData, experience: newExp });
                                                }} />
                                            </div>
                                            <textarea placeholder="Description" rows={3} className="col-span-2 bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500 resize-none mt-2" value={exp.description} onChange={e => {
                                                const newExp = [...resumeData.experience];
                                                newExp[i].description = e.target.value;
                                                setResumeData({ ...resumeData, experience: newExp });
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </Card>

                            {/* Education */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-3 text-orange-400 font-bold">
                                        <GraduationCap size={20} />
                                        Education
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => addListItem('education', { school: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', description: '' })}>
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                {resumeData.education.map((edu, i) => (
                                    <div key={i} className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 relative">
                                        <button onClick={() => removeListItem('education', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="School/University" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={edu.school} onChange={e => {
                                                const newEdu = [...resumeData.education];
                                                newEdu[i].school = e.target.value;
                                                setResumeData({ ...resumeData, education: newEdu });
                                            }} />
                                            <input placeholder="Degree" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={edu.degree} onChange={e => {
                                                const newEdu = [...resumeData.education];
                                                newEdu[i].degree = e.target.value;
                                                setResumeData({ ...resumeData, education: newEdu });
                                            }} />
                                            <input placeholder="Start Date" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={edu.startDate} onChange={e => {
                                                const newEdu = [...resumeData.education];
                                                newEdu[i].startDate = e.target.value;
                                                setResumeData({ ...resumeData, education: newEdu });
                                            }} />
                                            <input placeholder="End Date" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={edu.endDate} onChange={e => {
                                                const newEdu = [...resumeData.education];
                                                newEdu[i].endDate = e.target.value;
                                                setResumeData({ ...resumeData, education: newEdu });
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </Card>

                            {/* Projects */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-3 text-cyan-400 font-bold">
                                        <Globe size={20} />
                                        Featured Projects
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => addListItem('projects', { name: '', description: '', link: '', technologies: [] })}>
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                {resumeData.projects.map((proj, i) => (
                                    <div key={i} className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 relative">
                                        <button onClick={() => removeListItem('projects', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Project Name" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={proj.name} onChange={e => {
                                                const newProj = [...resumeData.projects];
                                                newProj[i].name = e.target.value;
                                                setResumeData({ ...resumeData, projects: newProj });
                                            }} />
                                            <input placeholder="Project Link" className="bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500" value={proj.link} onChange={e => {
                                                const newProj = [...resumeData.projects];
                                                newProj[i].link = e.target.value;
                                                setResumeData({ ...resumeData, projects: newProj });
                                            }} />
                                            <textarea placeholder="Key Contributions..." rows={2} className="col-span-2 bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500 resize-none" value={proj.description} onChange={e => {
                                                const newProj = [...resumeData.projects];
                                                newProj[i].description = e.target.value;
                                                setResumeData({ ...resumeData, projects: newProj });
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </Card>

                            {/* Certifications */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-3 text-amber-400 font-bold">
                                        <CheckCircle size={20} />
                                        Certifications
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => addListItem('certifications', { name: '', issuer: '', date: '' })}>
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                {resumeData.certifications?.map((cert, i) => (
                                    <div key={i} className="mb-4 grid grid-cols-3 gap-4 bg-white/5 p-3 rounded-lg relative">
                                        <button onClick={() => removeListItem('certifications', i)} className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 rounded-full p-1 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={12} />
                                        </button>
                                        <input placeholder="Certification" className="bg-transparent border-b border-white/10 p-1 text-sm outline-none" value={cert.name} onChange={e => {
                                            const newCert = [...(resumeData.certifications || [])];
                                            newCert[i].name = e.target.value;
                                            setResumeData({ ...resumeData, certifications: newCert });
                                        }} />
                                        <input placeholder="Issuer" className="bg-transparent border-b border-white/10 p-1 text-sm outline-none" value={cert.issuer} onChange={e => {
                                            const newCert = [...(resumeData.certifications || [])];
                                            newCert[i].issuer = e.target.value;
                                            setResumeData({ ...resumeData, certifications: newCert });
                                        }} />
                                        <input placeholder="Date" className="bg-transparent border-b border-white/10 p-1 text-sm outline-none" value={cert.date} onChange={e => {
                                            const newCert = [...(resumeData.certifications || [])];
                                            newCert[i].date = e.target.value;
                                            setResumeData({ ...resumeData, certifications: newCert });
                                        }} />
                                    </div>
                                ))}
                            </Card>

                            {/* Awards */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-3 text-yellow-500 font-bold">
                                        <Plus size={20} />
                                        Awards & Honors
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => addListItem('awards', { title: '', issuer: '', date: '' })}>
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                {resumeData.awards?.map((award, i) => (
                                    <div key={i} className="mb-4 grid grid-cols-3 gap-4 bg-white/5 p-3 rounded-lg relative group">
                                        <button onClick={() => removeListItem('awards', i)} className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 rounded-full p-1 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={12} />
                                        </button>
                                        <input placeholder="Award Title" className="bg-transparent border-b border-white/10 p-1 text-sm outline-none" value={award.title} onChange={e => {
                                            const newAwards = [...(resumeData.awards || [])];
                                            newAwards[i].title = e.target.value;
                                            setResumeData({ ...resumeData, awards: newAwards });
                                        }} />
                                        <input placeholder="Issuer" className="bg-transparent border-b border-white/10 p-1 text-sm outline-none" value={award.issuer} onChange={e => {
                                            const newAwards = [...(resumeData.awards || [])];
                                            newAwards[i].issuer = e.target.value;
                                            setResumeData({ ...resumeData, awards: newAwards });
                                        }} />
                                        <input placeholder="Date" className="bg-transparent border-b border-white/10 p-1 text-sm outline-none" value={award.date} onChange={e => {
                                            const newAwards = [...(resumeData.awards || [])];
                                            newAwards[i].date = e.target.value;
                                            setResumeData({ ...resumeData, awards: newAwards });
                                        }} />
                                    </div>
                                ))}
                            </Card>

                            {/* Languages */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-3 text-pink-400 font-bold">
                                        <Globe size={20} />
                                        Languages
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => addListItem('languages', { language: '', proficiency: '' })}>
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {resumeData.languages.map((lang, i) => (
                                        <div key={i} className="flex gap-2 bg-white/5 p-2 rounded-lg relative group">
                                            <input placeholder="Language" className="bg-transparent border-b border-white/10 p-1 text-sm outline-none flex-1" value={lang.language} onChange={e => {
                                                const newLang = [...resumeData.languages];
                                                newLang[i].language = e.target.value;
                                                setResumeData({ ...resumeData, languages: newLang });
                                            }} />
                                            <select className="bg-transparent border-b border-white/10 p-1 text-xs outline-none focus:bg-gray-800" value={lang.proficiency} onChange={e => {
                                                const newLang = [...resumeData.languages];
                                                newLang[i].proficiency = e.target.value;
                                                setResumeData({ ...resumeData, languages: newLang });
                                            }}>
                                                <option value="">Level</option>
                                                <option value="Native">Native</option>
                                                <option value="Fluent">Fluent</option>
                                                <option value="Professional">Professional</option>
                                                <option value="Conversational">Conversational</option>
                                                <option value="Beginner">Beginner</option>
                                            </select>
                                            <button onClick={() => removeListItem('languages', i)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Skills */}
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-6 text-purple-400 font-bold border-b border-white/5 pb-2">
                                    <Code size={20} />
                                    Skills & Expertise
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills.map((skill, i) => (
                                        <div key={i} className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 group border border-white/5">
                                            <span>{skill}</span>
                                            <button onClick={() => removeListItem('skills', i)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        placeholder="Add skill (Press Enter)"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && e.currentTarget.value) {
                                                addListItem('skills', e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        className="bg-transparent border-b border-white/10 p-1 outline-none focus:border-blue-500 text-sm w-32"
                                    />
                                </div>
                            </Card>

                            {/* Interests */}
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-6 text-emerald-400 font-bold border-b border-white/5 pb-2">
                                    <Globe size={20} />
                                    Interests & Hobbies
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.interests?.map((interest, i) => (
                                        <div key={i} className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 group border border-white/5">
                                            <span>{interest}</span>
                                            <button onClick={() => removeListItem('interests', i)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        placeholder="Add interest (Press Enter)"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && e.currentTarget.value) {
                                                addListItem('interests', e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        className="bg-transparent border-b border-white/10 p-1 outline-none focus:border-blue-500 text-sm w-32"
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Preview */}
                        <div className="sticky top-24 hidden lg:block h-[calc(100vh-120px)] flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <h3 className="font-bold text-gray-300">Live Preview</h3>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => setStep(3)} className="shadow-lg shadow-blue-600/20">Next: Styling <ChevronRight size={16} /></Button>
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-900/50 rounded-2xl border border-white/5 p-4 overflow-hidden relative flex justify-center items-start">
                                <div className="scale-[0.45] origin-top transform-gpu transition-transform duration-500 hover:scale-[0.5] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                    <div className="bg-white rounded-lg pointer-events-none">
                                        <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-[10px] text-gray-400 uppercase tracking-widest font-black border border-white/5">
                                    Preview Mode
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-slideIn">
                        {/* Sidebar: Styles */}
                        <div className="lg:col-span-1 space-y-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Palette className="text-pink-500" />
                                Customization
                            </h2>

                            <Card className="p-6">
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-4">Select Template</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {TEMPLATES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setResumeData({ ...resumeData, template: t.id })}
                                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${resumeData.template === t.id ? 'bg-blue-600' : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <span>{t.name}</span>
                                            {resumeData.template === t.id && <CheckCircle size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-4">Brand Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#000000', '#6366f1'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setResumeData({ ...resumeData, color: c })}
                                            className={`w-8 h-8 rounded-full border-2 ${resumeData.color === c ? 'border-white' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </Card>

                            <div className="space-y-3">
                                <Button className="w-full" onClick={handleExport} loading={loading}>
                                    <Download size={18} className="mr-2" /> Export to PDF
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={handleSave}>
                                    <Save size={18} className="mr-2" /> Save Draft
                                </Button>
                            </div>
                        </div>

                        {/* Main Content: Document Preview */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold">Final Look</h3>
                                <button onClick={() => setStep(2)} className="text-blue-400 text-sm hover:underline">← Back to editing</button>
                            </div>
                            <div className="flex justify-center overflow-x-auto bg-gray-900/50 p-8 rounded-2xl border border-white/5">
                                <div ref={resumeRef} className="bg-white shadow-2xl">
                                    <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

