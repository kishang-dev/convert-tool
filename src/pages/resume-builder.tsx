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
    Plus, Trash2, Edit3, ChevronRight, CheckCircle, Layout, Eye, X, Clock
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// const INITIAL_DATA: ResumeData = {
//     personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '', linkedin: '', github: '', website: '' },
//     experience: [],
//     education: [],
//     skills: [],
//     projects: [],
//     languages: [],
//     certifications: [],
//     awards: [],
//     interests: [],
//     template: 'modern',
//     color: '#3b82f6',
//     font: 'Inter',
//     styling: {
//         fontSize: { name: 48, headings: 14, body: 10 },
//         sectionFonts: { name: 'Inter', headings: 'Inter', body: 'Inter' }
//     }
// };


const INITIAL_DATA: ResumeData = {
    _id: undefined,
    title: 'Senior Software Engineer — 2024',
    personalInfo: {
        fullName: 'Alexandra Carter',
        email: 'alexandra.carter@gmail.com',
        phone: '+1 (555) 234-7890',
        address: 'San Francisco, CA 94102',
        summary: 'Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean architecture, developer experience, and delivering high-impact products that serve millions of users.',
        linkedin: 'linkedin.com/in/alexandracarter',
        github: 'github.com/alexcarter',
        website: 'alexandracarter.dev'
    },
    experience: [
        {
            company: 'Stripe',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: 'Jan 2022',
            endDate: '',
            current: true,
            description: 'Led development of Stripe\'s next-gen payment dashboard used by 2M+ merchants. Architected a micro-frontend system reducing load time by 42%. Mentored a team of 5 engineers and drove adoption of TypeScript across 3 product squads.'
        },
        {
            company: 'Airbnb',
            position: 'Software Engineer II',
            location: 'San Francisco, CA',
            startDate: 'Mar 2019',
            endDate: 'Dec 2021',
            current: false,
            description: 'Built and maintained critical booking flow features handling $1B+ in annual transactions. Implemented A/B testing framework that improved conversion rates by 18%. Collaborated with design and product to ship 12 major features on time.'
        },
        {
            company: 'HubSpot',
            position: 'Software Engineer',
            location: 'Boston, MA',
            startDate: 'Jun 2017',
            endDate: 'Feb 2019',
            current: false,
            description: 'Developed CRM integrations and REST APIs consumed by 50,000+ business customers. Reduced API response time by 35% through query optimization and Redis caching. Contributed to open-source tooling used across the engineering org.'
        }
    ],
    education: [
        {
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: 'Aug 2013',
            endDate: 'May 2017',
            description: 'GPA: 3.8/4.0 — Dean\'s List all semesters. Senior thesis on distributed systems fault tolerance. President of Women in Computing club.'
        },
        {
            school: 'Stanford Online (Coursera)',
            degree: 'Professional Certificate',
            fieldOfStudy: 'Machine Learning Specialization',
            location: 'Online',
            startDate: 'Jan 2021',
            endDate: 'Aug 2021',
            description: 'Completed Andrew Ng\'s ML Specialization with distinction. Built projects covering supervised learning, neural networks, and recommender systems.'
        }
    ],
    skills: [
        'TypeScript', 'React', 'Next.js', 'Node.js', 'GraphQL',
        'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes',
        'Python', 'System Design', 'CI/CD', 'REST APIs', 'Git'
    ],
    projects: [
        {
            name: 'OpenFlow — API Gateway',
            description: 'Built an open-source API gateway with rate limiting, auth middleware, and real-time analytics. Gained 2,400+ GitHub stars and adopted by 300+ developers worldwide.',
            link: 'github.com/alexcarter/openflow',
            technologies: ['Node.js', 'TypeScript', 'Redis', 'Docker']
        },
        {
            name: 'Budgetly — Personal Finance App',
            description: 'Full-stack SaaS app for expense tracking and budget forecasting with 1,800+ active users. Featured on Product Hunt as #3 Product of the Day.',
            link: 'budgetly.app',
            technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS']
        },
        {
            name: 'NeuralSort — ML Document Classifier',
            description: 'Document classification tool using fine-tuned BERT achieving 94% accuracy. Deployed on AWS Lambda, processing 10k+ documents/day for an enterprise client.',
            link: 'github.com/alexcarter/neuralsort',
            technologies: ['Python', 'PyTorch', 'AWS Lambda', 'FastAPI']
        }
    ],
    languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Fluent' },
        { language: 'French', proficiency: 'Conversational' }
    ],
    certifications: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Mar 2023' },
        { name: 'Google Cloud Professional Data Engineer', issuer: 'Google', date: 'Nov 2022' },
        { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', date: 'Jul 2021' }
    ],
    awards: [
        { title: 'Engineer of the Year', issuer: 'Stripe', date: '2023' },
        { title: 'Best Hackathon Project', issuer: 'TechCrunch Disrupt', date: '2020' },
        { title: "Dean's List — Academic Excellence", issuer: 'UC Berkeley', date: '2017' }
    ],
    interests: [
        'Open Source', 'Rock Climbing', 'Technical Writing',
        'Chess', 'Photography', 'Hiking'
    ],
    template: 'modern',
    color: '#3b82f6',
    font: 'Inter',
    styling: {
        fontSize: {
            name: 48,
            headings: 14,
            body: 10
        },
        sectionFonts: {
            name: 'Inter',
            headings: 'Inter',
            body: 'Inter'
        }
    }
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
    { id: 'monochrome', name: 'Monochrome Mastery' },
    // AI-Inspired Templates
    { id: 'cyber', name: 'AI Matrix Theme' },
    { id: 'glass', name: 'Frosted Glass UI' },
    { id: 'neural', name: 'Neural Grid' },
    { id: 'hologram', name: 'Holograph Pro' },
    { id: 'focus', name: 'Precision Focus' },
    { id: 'data', name: 'Data Metadata' },
    { id: 'organic', name: 'Organic Fluid' },
    { id: 'terminal', name: 'CLI Root Access' },
    { id: 'nebula', name: 'Deep Nebula' },
    { id: 'prism', name: 'Prism Spectrum' },
    { id: 'quantum', name: 'Quantum Pulse' },
    { id: 'atlas', name: 'Global Atlas' },
    { id: 'vector', name: 'Vector Flow' },
    { id: 'aurora', name: 'Aurora Sky' },
    { id: 'cryptic', name: 'Cryptic Code' },
    { id: 'zenith', name: 'Zenith Peak' },
    { id: 'orbit', name: 'Orbit Motion' },
    { id: 'pulse', name: 'Pulse Signal' },
    { id: 'fission', name: 'Atomic Fission' },
    { id: 'glitch', name: 'Cyber Glitch' },
    { id: 'echo', name: 'Visual Echo' },
    { id: 'void', name: 'Deep Void' },
    { id: 'stellar', name: 'Stellar Galaxy' },
    { id: 'pixel', name: 'Retro Pixel' },
    { id: 'apex', name: 'Apex Elite' },
    // Simple & Minimalist Templates (New)
    { id: 'simple_sidebar', name: 'Elegant Sidebar' },
    { id: 'modern_elegant', name: 'Modern Elegant' },
    { id: 'airy_minimal', name: 'Airy Minimal' },
    { id: 'traditional_clean', name: 'Traditional Clean' },
    { id: 'compact_modern', name: 'Compact Modern' },
    { id: 'executive_minimal', name: 'Executive Minimal' },
    { id: 'technical_lite', name: 'Technical Lite' },
    { id: 'basic_academic', name: 'Academic Scholar' },
    { id: 'airy_professional', name: 'Airy Professional' },
    { id: 'minimal_classic', name: 'Minimal Classic' },
];

export default function ResumeBuilder() {
    const [step, setStep] = useState(1);
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
    const [savedResumes, setSavedResumes] = useState<ResumeData[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resumeRef = useRef<HTMLDivElement>(null);
    const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchSavedResumes();
        }

        // Check if we came from My Resumes with an edit request
        const editDataStr = sessionStorage.getItem('editResume');
        if (editDataStr) {
            try {
                const parsed = JSON.parse(editDataStr);
                setResumeData(parsed);
                setStep(2);
                sessionStorage.removeItem('editResume');
            } catch (e) {
                console.error("Failed to parse edit resume data");
            }
        }
    }, [user]);

    const fetchSavedResumes = async () => {
        try {
            const res = await resumeAPI.getUserResumes();
            if (res.success) {
                setSavedResumes(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch resumes", error);
        }
    };

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
            let res;
            if (resumeData._id) {
                res = await resumeAPI.updateResume(resumeData._id, resumeData);
            } else {
                res = await resumeAPI.saveResume(resumeData);
            }
            if (res.success) {
                setResumeData(res.data);
                showToast('Resume saved to your account');
                fetchSavedResumes();
            }
        } catch (err: any) {
            showToast('Login required to save resumes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this resume?')) return;
        try {
            const res = await resumeAPI.deleteResume(id);
            if (res.success) {
                setSavedResumes(prev => prev.filter(r => r._id !== id));
                if (resumeData._id === id) {
                    setResumeData(INITIAL_DATA);
                    setStep(1);
                }
                showToast('Resume deleted successfully');
            }
        } catch (error) {
            showToast('Failed to delete resume', 'error');
        }
    };

    const handleEditResume = (resume: ResumeData) => {
        setResumeData(resume);
        setStep(2);
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
            `, resumeData);

            if (res.success) {
                const downloadUrl = res.downloadUrl.startsWith('http')
                    ? res.downloadUrl
                    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || process.env.NEXT_PUBLIC_BASE_URL}${res.downloadUrl}`;

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
                    <div className="max-w-6xl mx-auto text-center animate-fadeIn py-8 md:py-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 gradient-text tracking-tighter leading-tight">
                            Resume Builder <br className="sm:hidden" /> & Converter
                        </h1>
                        <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-12 md:mb-16 max-w-2xl mx-auto font-light px-4">
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
                            <Card variant="elevated" className="p-12 bg-white/5 border border-white/10 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 cursor-pointer" onClick={() => { setResumeData(INITIAL_DATA); setStep(2); }}>
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

                        {/* Saved Resumes Section */}
                        {user && savedResumes.length > 0 && (
                            <div className="mt-20 max-w-5xl mx-auto text-left">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Clock className="text-blue-400" />
                                    Your Saved Resumes
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {savedResumes.map(resume => (
                                        <Card key={resume._id} variant="elevated" className="p-6 bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer" onClick={() => handleEditResume(resume)}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                                    <FileText size={24} />
                                                </div>
                                                <button onClick={(e) => handleDeleteResume(resume._id as string, e)} className="text-gray-500 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1 truncate">{resume.title || resume.personalInfo.fullName || 'Untitled Resume'}</h4>
                                            <p className="text-sm text-gray-400 mb-4 truncate">{resume.personalInfo.summary || 'No summary provided.'}</p>
                                            <Button variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10">
                                                Edit Resume
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideIn">
                        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide">
                            <div className="flex items-center gap-4 mb-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg"
                                >
                                    <ChevronRight size={16} className="rotate-180" />
                                    My Resumes
                                </button>
                                <span className="text-gray-600">/</span>
                                <span className="text-sm text-gray-300 truncate max-w-[180px]">{resumeData.title || resumeData.personalInfo.fullName || 'New Resume'}</span>
                            </div>

                            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <Edit3 className="text-blue-500" />
                                Edit Your Details
                            </h2>

                            {/* Resume Title */}
                            <Card className="p-4">
                                <div className="flex items-center gap-3 mb-3 text-gray-400 font-bold border-b border-white/5 pb-2 text-sm">
                                    <FileText size={16} />
                                    Resume Title (for your reference)
                                </div>
                                <input
                                    value={resumeData.title || ''}
                                    onChange={e => setResumeData({ ...resumeData, title: e.target.value })}
                                    placeholder={`e.g. "Software Engineer — Google 2024"`}
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:border-blue-500 outline-none text-white placeholder-gray-600"
                                />
                            </Card>

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
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase font-bold">Photo (Optional)</label>
                                        <div className="flex items-center gap-4 mt-2">
                                            {resumeData.personalInfo.photo && (
                                                <div className="relative group">
                                                    <img src={resumeData.personalInfo.photo} className="w-16 h-16 rounded-xl object-cover border-2 border-white/10" alt="Avatar" />
                                                    <button
                                                        onClick={() => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, photo: '' } })}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, photo: reader.result as string } });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="w-full bg-white/5 border border-dashed border-white/20 p-4 rounded-xl text-xs text-gray-400 hover:border-blue-500 transition-colors cursor-pointer"
                                                />
                                                <p className="text-[10px] text-gray-500 mt-2">Recommended: Square Aspect Ratio, Base64 embedded</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold text-blue-400">Email Address</label>
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
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase font-bold">Address</label>
                                        <input
                                            value={resumeData.personalInfo.address}
                                            onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, address: e.target.value } })}
                                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mt-1 focus:border-blue-500 outline-none"
                                            placeholder="City, State / Full Address"
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
                                            <button onClick={() => removeListItem('interests', i)} className="text-red-400 transition-all">
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

                            {/* Mobile Preview FAB */}
                            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                                <Button
                                    onClick={() => setMobilePreviewOpen(true)}
                                    className="rounded-full w-16 h-16 shadow-2xl shadow-blue-500/40 p-0 flex items-center justify-center bg-blue-600"
                                >
                                    <Eye size={24} />
                                </Button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="sticky top-28 hidden lg:block h-[calc(100vh-140px)]">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <h3 className="font-bold text-gray-300 uppercase text-[10px] tracking-widest">Live Rendering</h3>
                                </div>
                                <Button size="sm" onClick={() => setStep(3)} className="shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700">
                                    Next: Style <ChevronRight size={14} className="ml-1" />
                                </Button>
                            </div>

                            <div className="bg-gray-900/50 rounded-[32px] border border-white/5 p-8 h-full flex justify-center items-start overflow-hidden relative group">
                                {/* The Wrapper: Fixed dimensions to match the scaled resume (794 * 0.45 = ~357) */}
                                <div className="relative w-[357px] h-[505px] transition-all duration-500 group-hover:scale-[1.02]">
                                    <div className="absolute top-0 left-0 origin-top-left scale-[0.45] pointer-events-none shadow-[0_30px_100px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden">
                                        <div className="bg-white">
                                            <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-xl rounded-full text-[9px] text-gray-400 uppercase tracking-[0.3em] font-black border border-white/10 z-20">
                                    Preview Mode
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-10 animate-slideIn">
                        {/* Final Review Header & Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 gap-6">
                            <div>
                                <h2 className="text-4xl font-black gradient-text tracking-tighter mb-2">Luxury Presentation</h2>
                                <p className="text-gray-400 font-medium">Your professional identity is ready for global deployment.</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-400 hover:text-white flex-1 md:flex-none">
                                    ← Back to Editing
                                </Button>
                                <Button size="lg" onClick={handleExport} loading={loading} className="px-10 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/30 flex-1 md:flex-none py-6 rounded-2xl text-lg">
                                    <Download size={22} className="mr-2" /> Export to PDF
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                            {/* Sidebar: Stylizing */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="flex items-center gap-3 mb-4 text-pink-500 px-2">
                                    <Palette size={20} />
                                    <h3 className="text-xl font-bold">Visual Vitals</h3>
                                </div>

                                <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-6">Accent Profile</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#000000', '#6366f1', '#ec4899', '#14b8a6'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setResumeData({ ...resumeData, color: c })}
                                                className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 ${resumeData.color === c ? 'border-white ring-4 ring-white/10' : 'border-transparent'}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-6">Master Typography</label>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <p className="text-[9px] text-gray-600 uppercase font-black tracking-tighter">Primary Glyph (Name)</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm w-20 focus:border-blue-500 outline-none"
                                                    value={resumeData.styling?.fontSize.name}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, fontSize: { ...prev.styling!.fontSize, name: parseInt(e.target.value) || 0 } }
                                                    }))}
                                                />
                                                <select
                                                    className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm flex-1 outline-none"
                                                    value={resumeData.styling?.sectionFonts.name}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, sectionFonts: { ...prev.styling!.sectionFonts, name: e.target.value } }
                                                    }))}
                                                >
                                                    <option value="Inter">Inter</option>
                                                    <option value="Lora">Lora</option>
                                                    <option value="Outfit">Outfit</option>
                                                    <option value="JetBrains Mono">Mono</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[9px] text-gray-600 uppercase font-black tracking-tighter">Headings Interface</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm w-20 focus:border-blue-500 outline-none"
                                                    value={resumeData.styling?.fontSize.headings}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, fontSize: { ...prev.styling!.fontSize, headings: parseInt(e.target.value) || 0 } }
                                                    }))}
                                                />
                                                <select
                                                    className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm flex-1 outline-none"
                                                    value={resumeData.styling?.sectionFonts.headings}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, sectionFonts: { ...prev.styling!.sectionFonts, headings: e.target.value } }
                                                    }))}
                                                >
                                                    <option value="Inter">Inter</option>
                                                    <option value="Lora">Lora</option>
                                                    <option value="Outfit">Outfit</option>
                                                    <option value="JetBrains Mono">Mono</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[9px] text-gray-600 uppercase font-black tracking-tighter">Core Data (Body)</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm w-20 focus:border-blue-500 outline-none"
                                                    value={resumeData.styling?.fontSize.body}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, fontSize: { ...prev.styling!.fontSize, body: parseInt(e.target.value) || 0 } }
                                                    }))}
                                                />
                                                <select
                                                    className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm flex-1 outline-none"
                                                    value={resumeData.styling?.sectionFonts.body}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, sectionFonts: { ...prev.styling!.sectionFonts, body: e.target.value } }
                                                    }))}
                                                >
                                                    <option value="Inter">Inter</option>
                                                    <option value="Lora">Lora</option>
                                                    <option value="Outfit">Outfit</option>
                                                    <option value="JetBrains Mono">Mono</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-3 pt-6">
                                    <Button variant="ghost" className="w-full text-gray-500 hover:text-white" onClick={handleSave}>
                                        <Save size={18} className="mr-2" /> Save to Cloud
                                    </Button>
                                </div>
                            </div>

                            {/* Main Presentation Area */}
                            <div className="lg:col-span-3 space-y-12">
                                {/* The High-Def Preview */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                    <div className="relative flex justify-center items-center bg-gray-950 p-12 lg:p-20 rounded-[40px] border border-white/5 min-h-[850px] overflow-hidden">
                                        <div className="absolute top-8 left-12 flex items-center gap-2 opacity-30 select-none z-20">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                            <span className="text-[10px] font-mono text-white/20 ml-4 tracking-[0.3em]">RENDER_ACTIVE_V0.1.X</span>
                                        </div>

                                        <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.9] xl:scale-[1.0] transition-all duration-700 ease-out origin-center shadow-2xl z-10">
                                            <div ref={resumeRef} className="bg-white">
                                                <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                                            </div>
                                        </div>

                                        <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 opacity-40 z-20">
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Selected Template</span>
                                            <span className="text-sm font-bold text-gray-400">{TEMPLATES.find(t => t.id === resumeData.template)?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Luxury Template Library */}
                                <div className="space-y-8 pt-12 border-t border-white/5">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                        <div>
                                            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Luxury Style Library</h3>
                                            <p className="text-gray-500 text-sm">Select a high-performance design to represent your brand.</p>
                                        </div>
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                            {TEMPLATES.length} Designs Live
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {TEMPLATES.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => {
                                                    setResumeData({ ...resumeData, template: t.id });
                                                    // Smooth scroll to top preview
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`group cursor-pointer relative rounded-[20px] overflow-hidden border-2 transition-all duration-500 ${resumeData.template === t.id
                                                    ? 'border-blue-500 ring-4 ring-blue-500/20 scale-105 shadow-2xl z-10'
                                                    : 'border-white/5 hover:border-white/20 hover:scale-[1.03]'
                                                    }`}
                                            >
                                                {/* Thumbnail Rendering */}
                                                <div className="aspect-[1/1.414] bg-white overflow-hidden relative grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 flex justify-center items-start">
                                                    <div className="w-[794px] origin-top scale-[0.23] sm:scale-[0.2] md:scale-[0.25] pointer-events-none transform-gpu">
                                                        <ResumeTemplate data={resumeData} template={t.id} primaryColor={resumeData.color} />
                                                    </div>
                                                </div>

                                                {/* Overlay Info */}
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent transition-opacity duration-500 flex flex-col justify-end p-4 ${resumeData.template === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                    }`}>
                                                    <p className="text-white text-[10px] font-black uppercase tracking-tighter sm:tracking-widest leading-none mb-1">{t.name}</p>
                                                    {resumeData.template === t.id && <p className="text-blue-400 text-[8px] font-black uppercase tracking-widest">Currently Active</p>}
                                                </div>

                                                {/* Active Badge */}
                                                {resumeData.template === t.id && (
                                                    <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1.5 shadow-xl z-20 animate-bounce-subtle">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Mobile Preview Modal */}
                {mobilePreviewOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setMobilePreviewOpen(false)}></div>
                        <div className="relative h-full flex flex-col p-6 pointer-events-none">
                            <div className="flex justify-between items-center mb-6 pointer-events-auto">
                                <h3 className="text-xl font-bold tracking-tight">Live Render</h3>
                                <button
                                    onClick={() => setMobilePreviewOpen(false)}
                                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 flex justify-center items-center overflow-hidden">
                                <div className="scale-[0.4] sm:scale-[0.6] origin-center shadow-2xl">
                                    <div className="bg-white pointer-events-auto">
                                        <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                                    </div>
                                </div>
                            </div>
                            <div className="py-6 pointer-events-auto">
                                <Button onClick={() => setMobilePreviewOpen(false)} className="w-full py-4 bg-white/10 border-white/10 text-white">
                                    Back to Editing
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Floating Preview Button (Mobile) */}
                {step === 2 && (
                    <div className="fixed bottom-8 right-8 z-40 lg:hidden animate-bounce-subtle">
                        <button
                            onClick={() => setMobilePreviewOpen(true)}
                            className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all border-4 border-[#0f172a]"
                        >
                            <Eye size={28} />
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}
