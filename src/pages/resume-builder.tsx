import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Toast from '@/components/Toast';
import SEO from '@/components/SEO';
import ResumeTemplate from '@/components/ResumeTemplate';
import { resumeAPI, ResumeData } from '@/lib/api';
import { LuUpload as Upload, LuFileText as FileText, LuDownload as Download, LuSave as Save, LuPalette as Palette, LuUser as User, LuBriefcase as Briefcase, LuGraduationCap as GraduationCap, LuCode as Code, LuGlobe as Globe, LuPlus as Plus, LuTrash2 as Trash2, LuPenLine as Edit3, LuChevronRight as ChevronRight, LuCircleCheck as CheckCircle, LuLayoutDashboard as Layout, LuEye as Eye, LuX as X, LuClock as Clock, LuUsers as Users, LuBookOpen as BookOpen, LuHeart as Heart, LuSparkles as Sparkles, LuChevronDown as ChevronDown, LuSearch as Search } from "react-icons/lu";
import { LuTriangleAlert as AlertTriangle } from "react-icons/lu";
import { useAuthStore } from '@/store/authStore';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from '@/components/AdBanner';

const INITIAL_DATA: ResumeData = {
    _id: undefined,
    title: 'Senior Software Engineer — 2026',
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
    references: [
        { name: 'Dr. Emily Chen', position: 'CTO', company: 'Stripe', contact: 'emily.chen@stripe.com' }
    ],
    publications: [
        { title: 'Scaling Micro-Frontends for 2M+ Users', publisher: 'Smashing Magazine', date: 'Aug 2024' }
    ],
    volunteer: [{ organization: 'Girls Who Code', role: 'Lead Mentor', startDate: '2020', endDate: 'Present', description: 'Mentoring high school girls in JavaScript and React.' }],
    softSkills: ['Leadership', 'Communication', 'Problem Solving'],
    coursework: ['Data Structures', 'Algorithms', 'Machine Learning'],
    patents: [{ title: 'Distributed Database Consistency', date: '2025', description: 'System for resolving cross-node conflicts.' }],
    speakingEngagements: [{ title: 'Keynote: The Future of React', event: 'ReactConf', date: 'Oct 2025' }],
    testimonials: [{ name: 'Sarah Jenkins', quote: 'An exceptional engineer who elevated our entire team.', position: 'VP of Engineering' }],
    template: 'modern',
    color: '#3b82f6',
    font: 'Inter',
    styling: {
        fontSize: {
            name: 48,
            headings: 14,
            body: 10
        },
        sectionFonts: { name: 'Inter', headings: 'Inter', body: 'Inter' },
        lineHeight: 1.5,
        margins: 'normal',
        pageSize: 'A4'
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
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [previewScale, setPreviewScale] = useState(1);
    const [resumeContentHeight, setResumeContentHeight] = useState(1123); // Default A4 height in px
    const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
    const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
    const [templateSearch, setTemplateSearch] = useState('');
    const templateDropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target as Node)) {
                setTemplateDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    // Auto-scale the preview template to fill its container
    useEffect(() => {
        const updateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                setPreviewScale(containerWidth / 794);
            }
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        if (previewContainerRef.current) observer.observe(previewContainerRef.current);
        return () => observer.disconnect();
    }, [step]);

    // Track actual resume content height to prevent clipping
    useEffect(() => {
        if (!resumeRef.current) return;
        const heightObserver = new ResizeObserver(() => {
            if (resumeRef.current) {
                setResumeContentHeight(resumeRef.current.scrollHeight);
            }
        });
        heightObserver.observe(resumeRef.current);
        // Measure immediately too
        setResumeContentHeight(resumeRef.current.scrollHeight);
        return () => heightObserver.disconnect();
    }, [step, resumeData]);

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
            console.error("Save error:", err);
            showToast(err.response?.data?.error || 'Failed to save resume. Ensure you are logged in.', 'error');
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
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <script src="https://cdn.tailwindcss.com"></script>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
                        <style>
                            @page { 
                                size: A4 portrait; 
                                margin: 0; 
                            }
                            *, *::before, *::after {
                                box-sizing: border-box !important;
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            html, body { 
                                margin: 0 !important; 
                                padding: 0 !important; 
                                width: 210mm !important;
                                background: #ffffff !important;
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            .resume-page { 
                                box-shadow: none !important; 
                                margin: 0 auto !important; 
                                width: 210mm !important; 
                                max-width: 210mm !important;
                                padding-bottom: 0 !important;
                                box-sizing: border-box !important;
                                overflow: hidden !important;
                                page-break-inside: avoid !important;
                                break-inside: avoid !important;
                            }
                        </style>
                        <script>
                            tailwind.config = {
                                theme: {
                                    extend: {
                                        fontFamily: {
                                            inter: ['Inter', 'sans-serif'],
                                            lora: ['Lora', 'serif'],
                                            outfit: ['Outfit', 'sans-serif'],
                                            dmsans: ['DM Sans', 'sans-serif'],
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

                // Track tool usage event
                gtag.event({
                    action: "use_tool",
                    category: "Tool",
                    label: "resume-builder",
                });
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
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="Free Resume Builder — 50+ Professional Templates"
                description="Build a professional resume in minutes with ToolBasketAI's free AI-powered resume builder. Choose from 50+ templates, export to PDF instantly. No sign-up needed."
                canonical="/resume-builder"
                keywords="free resume builder, resume maker online, AI resume builder, resume templates, CV builder, PDF resume download, professional resume"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: 'Resume Builder — ToolBasketAI',
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                }}
            />

            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'Resume Builder', href: '/resume-builder' }
                    ]}
                />
                {/* Responsive Stepper */}
                <div className="flex justify-center mb-8 md:mb-12">
                    <div className="flex items-center gap-1.5 sm:gap-3 bg-[var(--surface)] p-2 rounded-2xl border border-[var(--border)] shadow-sm max-w-full overflow-x-auto no-scrollbar">
                        {[
                            { num: 1, label: "Start", desc: "Upload / New" },
                            { num: 2, label: "Edit Details", desc: "Form Editor" },
                            { num: 3, label: "Style & Export", desc: "Templates & PDF" },
                        ].map((item) => (
                            <button
                                key={item.num}
                                onClick={() => (step >= item.num || step > 1) && setStep(item.num)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${step === item.num
                                    ? "bg-blue-600 text-white shadow-md"
                                    : step > item.num
                                        ? "bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30"
                                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                                    }`}
                            >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step === item.num ? "bg-white text-blue-600" : step > item.num ? "bg-emerald-600 text-white" : "bg-[var(--border)] text-[var(--text-muted)]"
                                    }`}>
                                    {step > item.num ? <CheckCircle size={14} /> : item.num}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>


                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />

                {step === 1 && (
                    <div className="max-w-6xl mx-auto text-center animate-fadeIn py-8 md:py-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 gradient-text tracking-tighter leading-tight">
                            Resume Builder <br className="sm:hidden" /> & Converter
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl mb-12 md:mb-16 max-w-2xl mx-auto font-light px-4">
                            Choose how you want to start. Upload an existing document for an instant AI conversion,
                            or build a professional resume from scratch.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Option 1: Upload */}
                            <Card variant="elevated" className="p-12 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl">
                                        <Upload size={48} className="text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Select your resume</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
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
                            <Card variant="elevated" className="p-12 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 cursor-pointer" onClick={() => { setResumeData(INITIAL_DATA); setStep(2); }}>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-purple-600/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl">
                                        <Plus size={48} className="text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Create From Scratch</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
                                        Start fresh with our guide <br /> and professional suggestions.
                                    </p>

                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full py-6 text-lg rounded-2xl shadow-xl hover:shadow-purple-500/20 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                    >
                                        Build New Resume
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Saved Resumes Section */}
                        {user && savedResumes.length > 0 && (
                            <div className="mt-16 max-w-5xl mx-auto text-left">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--text)]">
                                    <Clock className="text-[var(--accent)]" />
                                    Your Saved Cloud Resumes
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {savedResumes.map(resume => (
                                        <div
                                            key={resume._id}
                                            className="group relative p-6 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-lift)] rounded-2xl transition-all cursor-pointer flex flex-col justify-between"
                                            onClick={() => handleEditResume(resume)}
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center text-[var(--accent)] border border-[var(--accent-ring)]">
                                                        <FileText size={22} />
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDeleteResume(resume._id as string, e)}
                                                        className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <h4 className="font-bold text-lg mb-1 truncate text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{resume.title || resume.personalInfo.fullName || 'Untitled Resume'}</h4>
                                                <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2">{resume.personalInfo.summary || 'No summary provided.'}</p>
                                            </div>
                                            <Button variant="secondary" size="sm" className="w-full text-xs font-bold py-2 bg-[var(--surface-hover)] border-[var(--border)] text-[var(--text)]">
                                                Edit Resume
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-6 animate-slideIn pb-20 lg:pb-0">
                        {/* Top Control Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] shadow-sm">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5 text-xs bg-[var(--surface-hover)] border border-[var(--border)] px-3 py-1.5 rounded-xl font-semibold"
                                >
                                    <ChevronRight size={14} className="rotate-180" />
                                    My Resumes
                                </button>
                                <span className="text-[var(--text-faint)] text-xs">/</span>
                                <span className="text-xs font-bold text-[var(--text)] truncate max-w-[140px] sm:max-w-[200px]">{resumeData.title || resumeData.personalInfo.fullName || 'New Resume'}</span>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="flex items-center gap-2 relative w-full sm:w-auto" ref={templateDropdownRef}>
                                    <span className="text-[11px] font-bold uppercase text-[var(--text-muted)] shrink-0">Template:</span>
                                    <button
                                        type="button"
                                        onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
                                        className="flex items-center justify-between gap-2 bg-[var(--bg)] text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-all flex-1 sm:flex-initial sm:min-w-[170px] shadow-sm"
                                    >
                                        <span className="truncate max-w-[140px] sm:max-w-[160px]">{TEMPLATES.find(t => t.id === resumeData.template)?.name || 'Select Template'}</span>
                                        <ChevronDown size={14} className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${templateDropdownOpen ? 'rotate-180 text-[var(--accent)]' : ''}`} />
                                    </button>

                                    {templateDropdownOpen && (
                                        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-40px)] max-w-[320px] sm:w-72 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 p-2.5 animate-fadeIn backdrop-blur-xl">
                                            <div className="p-1.5 border-b border-[var(--border)] mb-2">
                                                <div className="relative">
                                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search 50+ templates..."
                                                        value={templateSearch}
                                                        onChange={(e) => setTemplateSearch(e.target.value)}
                                                        className="w-full bg-[var(--bg)] text-xs pl-8 pr-3 py-2 rounded-xl border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                                {TEMPLATES.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase())).map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setResumeData({ ...resumeData, template: t.id });
                                                            setTemplateDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${resumeData.template === t.id
                                                            ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-ring)] font-bold'
                                                            : 'text-[var(--text)] hover:bg-[var(--surface-hover)] font-medium'
                                                            }`}
                                                    >
                                                        <span className="truncate">{t.name}</span>
                                                        {resumeData.template === t.id && <CheckCircle size={14} className="shrink-0 text-[var(--accent)]" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Two-column layout for Form Editor & Live Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 sm:pr-4 scrollbar-hide">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-[var(--text)]">
                                        <Edit3 className="text-[var(--accent)]" />
                                        Edit Details
                                    </h2>
                                    <Button
                                        size="sm"
                                        onClick={() => setStep(3)}
                                        className="lg:hidden bg-[var(--accent)] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md"
                                    >
                                        Style & Export →
                                    </Button>
                                </div>

                                {/* Resume Title */}
                                <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                                    <div className="flex items-center gap-2 mb-3 text-[var(--text-muted)] font-extrabold border-b border-[var(--border)] pb-2 text-xs tracking-wider uppercase">
                                        <FileText size={15} className="text-[var(--accent)]" />
                                        Resume Title (for your reference)
                                    </div>
                                    <input
                                        value={resumeData.title || ''}
                                        onChange={e => setResumeData({ ...resumeData, title: e.target.value })}
                                        placeholder={`e.g. "Senior Software Engineer — 2026"`}
                                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                    />
                                </div>

                                {/* Personal Info */}
                                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                                    <div className="flex items-center gap-2.5 mb-6 text-[var(--accent)] font-extrabold border-b border-[var(--border)] pb-3 text-sm tracking-wide">
                                        <User size={18} />
                                        Personal Information
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Full Name</label>
                                            <input
                                                value={resumeData.personalInfo.fullName}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, fullName: e.target.value } })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Photo (Optional)</label>
                                            <div className="flex items-center gap-4 mt-2">
                                                {resumeData.personalInfo.photo && (
                                                    <div className="relative group">
                                                        <Image src={resumeData.personalInfo.photo} width={64} height={64} className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--border)]" alt="Avatar" />
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
                                                        className="w-full bg-[var(--bg)] border border-dashed border-[var(--border)] p-3.5 rounded-xl text-xs text-[var(--text-muted)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                                                    />
                                                    <p className="text-[10px] text-[var(--text-faint)] mt-1.5">Recommended: Square Aspect Ratio, PNG or JPG</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Email Address</label>
                                            <input
                                                value={resumeData.personalInfo.email}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value } })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Phone</label>
                                            <input
                                                value={resumeData.personalInfo.phone}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value } })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Address</label>
                                            <input
                                                value={resumeData.personalInfo.address}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, address: e.target.value } })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                                placeholder="City, State / Full Address"
                                            />
                                        </div>
                                        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">LinkedIn</label>
                                                <input
                                                    value={resumeData.personalInfo.linkedin}
                                                    onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value } })}
                                                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                                    placeholder="linkedin.com/in/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">GitHub</label>
                                                <input
                                                    value={resumeData.personalInfo.github}
                                                    onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, github: e.target.value } })}
                                                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                                    placeholder="github.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Website</label>
                                                <input
                                                    value={resumeData.personalInfo.website}
                                                    onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, website: e.target.value } })}
                                                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all"
                                                    placeholder="portfolio.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Summary</label>
                                            <textarea
                                                rows={4}
                                                value={resumeData.personalInfo.summary}
                                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, summary: e.target.value } })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl mt-1 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Experience */}
                                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                                    <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-3">
                                        <div className="flex items-center gap-2.5 text-[var(--accent)] font-extrabold text-sm tracking-wide">
                                            <Briefcase size={18} />
                                            Work Experience
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '', current: false })} className="text-[var(--accent)] hover:bg-[var(--accent-soft)]">
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} className="mb-6 p-4 bg-[var(--surface-hover)] rounded-xl border border-[var(--border)] relative">
                                            <button
                                                onClick={() => removeListItem('experience', i)}
                                                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input placeholder="Company" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={exp.company} onChange={e => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp[i].company = e.target.value;
                                                    setResumeData({ ...resumeData, experience: newExp });
                                                }} />
                                                <input placeholder="Position" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={exp.position} onChange={e => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp[i].position = e.target.value;
                                                    setResumeData({ ...resumeData, experience: newExp });
                                                }} />
                                                <div className="grid grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                                                    <input placeholder="Start Date" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={exp.startDate} onChange={e => {
                                                        const newExp = [...resumeData.experience];
                                                        newExp[i].startDate = e.target.value;
                                                        setResumeData({ ...resumeData, experience: newExp });
                                                    }} />
                                                    <input placeholder="End Date (or 'Present')" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={exp.endDate} onChange={e => {
                                                        const newExp = [...resumeData.experience];
                                                        newExp[i].endDate = e.target.value;
                                                        setResumeData({ ...resumeData, experience: newExp });
                                                    }} />
                                                </div>

                                                <textarea placeholder="Description..." rows={3} className="col-span-1 sm:col-span-2 bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)] resize-none" value={exp.description} onChange={e => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp[i].description = e.target.value;
                                                    setResumeData({ ...resumeData, experience: newExp });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Education */}
                                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                                    <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-3">
                                        <div className="flex items-center gap-2.5 text-[var(--accent)] font-extrabold text-sm tracking-wide">
                                            <GraduationCap size={18} />
                                            Education
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('education', { school: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', description: '' })} className="text-[var(--accent)] hover:bg-[var(--accent-soft)]">
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    {resumeData.education.map((edu, i) => (
                                        <div key={i} className="mb-6 p-4 bg-[var(--surface-hover)] rounded-xl border border-[var(--border)] relative">
                                            <button onClick={() => removeListItem('education', i)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input placeholder="School/University" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={edu.school} onChange={e => {
                                                    const newEdu = [...resumeData.education];
                                                    newEdu[i].school = e.target.value;
                                                    setResumeData({ ...resumeData, education: newEdu });
                                                }} />
                                                <input placeholder="Degree" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={edu.degree} onChange={e => {
                                                    const newEdu = [...resumeData.education];
                                                    newEdu[i].degree = e.target.value;
                                                    setResumeData({ ...resumeData, education: newEdu });
                                                }} />
                                                <input placeholder="Start Date" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={edu.startDate} onChange={e => {
                                                    const newEdu = [...resumeData.education];
                                                    newEdu[i].startDate = e.target.value;
                                                    setResumeData({ ...resumeData, education: newEdu });
                                                }} />
                                                <input placeholder="End Date" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={edu.endDate} onChange={e => {
                                                    const newEdu = [...resumeData.education];
                                                    newEdu[i].endDate = e.target.value;
                                                    setResumeData({ ...resumeData, education: newEdu });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Projects */}
                                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                                    <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-3">
                                        <div className="flex items-center gap-2.5 text-[var(--accent)] font-extrabold text-sm tracking-wide">
                                            <Globe size={18} />
                                            Featured Projects
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('projects', { name: '', description: '', link: '', technologies: [] })} className="text-[var(--accent)] hover:bg-[var(--accent-soft)]">
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    {resumeData.projects.map((proj, i) => (
                                        <div key={i} className="mb-6 p-4 bg-[var(--surface-hover)] rounded-xl border border-[var(--border)] relative">
                                            <button onClick={() => removeListItem('projects', i)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input placeholder="Project Name" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={proj.name} onChange={e => {
                                                    const newProj = [...resumeData.projects];
                                                    newProj[i].name = e.target.value;
                                                    setResumeData({ ...resumeData, projects: newProj });
                                                }} />
                                                <input placeholder="Project Link" className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)]" value={proj.link} onChange={e => {
                                                    const newProj = [...resumeData.projects];
                                                    newProj[i].link = e.target.value;
                                                    setResumeData({ ...resumeData, projects: newProj });
                                                }} />
                                                <textarea placeholder="Key Contributions..." rows={2} className="col-span-1 sm:col-span-2 bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-lg outline-none focus:border-[var(--accent)] text-sm text-[var(--text)] resize-none" value={proj.description} onChange={e => {
                                                    const newProj = [...resumeData.projects];
                                                    newProj[i].description = e.target.value;
                                                    setResumeData({ ...resumeData, projects: newProj });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Skills */}
                                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                                    <div className="flex items-center gap-2.5 mb-6 text-[var(--accent)] font-extrabold text-sm tracking-wide border-b border-[var(--border)] pb-3">
                                        <Code size={18} />
                                        Skills & Expertise
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.map((skill, i) => (
                                            <div key={i} className="bg-[var(--surface-hover)] border border-[var(--border)] px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
                                                <span>{skill}</span>
                                                <button onClick={() => removeListItem('skills', i)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                                    <Trash2 size={13} />
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
                                            className="bg-[var(--bg)] border border-[var(--border)] px-3 py-1 rounded-full outline-none focus:border-[var(--accent)] text-xs text-[var(--text)] w-36"
                                        />
                                    </div>
                                </div>                {/* Certifications */}
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
                                        <div key={i} className="mb-4 grid grid-cols-3 gap-4 bg-gray-100 dark:bg-white/5 p-3 rounded-lg relative">
                                            <button onClick={() => removeListItem('certifications', i)} className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 rounded-full p-1 opacity-100 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={12} />
                                            </button>
                                            <input placeholder="Certification" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-sm outline-none" value={cert.name} onChange={e => {
                                                const newCert = [...(resumeData.certifications || [])];
                                                newCert[i].name = e.target.value;
                                                setResumeData({ ...resumeData, certifications: newCert });
                                            }} />
                                            <input placeholder="Issuer" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-sm outline-none" value={cert.issuer} onChange={e => {
                                                const newCert = [...(resumeData.certifications || [])];
                                                newCert[i].issuer = e.target.value;
                                                setResumeData({ ...resumeData, certifications: newCert });
                                            }} />
                                            <input placeholder="Date" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-sm outline-none" value={cert.date} onChange={e => {
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
                                        <div key={i} className="mb-4 grid grid-cols-3 gap-4 bg-gray-100 dark:bg-white/5 p-3 rounded-lg relative group">
                                            <button onClick={() => removeListItem('awards', i)} className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 rounded-full p-1 opacity-100 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={12} />
                                            </button>
                                            <input placeholder="Award Title" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-sm outline-none" value={award.title} onChange={e => {
                                                const newAwards = [...(resumeData.awards || [])];
                                                newAwards[i].title = e.target.value;
                                                setResumeData({ ...resumeData, awards: newAwards });
                                            }} />
                                            <input placeholder="Issuer" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-sm outline-none" value={award.issuer} onChange={e => {
                                                const newAwards = [...(resumeData.awards || [])];
                                                newAwards[i].issuer = e.target.value;
                                                setResumeData({ ...resumeData, awards: newAwards });
                                            }} />
                                            <input placeholder="Date" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-sm outline-none" value={award.date} onChange={e => {
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
                                            <div key={i} className="flex gap-2 bg-gray-100 dark:bg-white/5 p-2 rounded-lg relative group">
                                                <input placeholder="Language" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-sm outline-none flex-1" value={lang.language} onChange={e => {
                                                    const newLang = [...resumeData.languages];
                                                    newLang[i].language = e.target.value;
                                                    setResumeData({ ...resumeData, languages: newLang });
                                                }} />
                                                <select className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 text-xs outline-none focus:bg-gray-800" value={lang.proficiency} onChange={e => {
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
                                            className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 outline-none focus:border-blue-500 text-sm w-32"
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
                                            className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 outline-none focus:border-blue-500 text-sm w-32"
                                        />
                                    </div>
                                </Card>

                                {/* Publications */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-3 text-cyan-400 font-bold">
                                            <BookOpen size={20} />
                                            Publications
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('publications', { title: '', publisher: '', date: '', url: '' })}>
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    {resumeData.publications?.map((pub, i) => (
                                        <div key={i} className="mb-4 p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-white/5 relative">
                                            <button onClick={() => removeListItem('publications', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Title" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={pub.title} onChange={e => {
                                                    const newPubs = [...(resumeData.publications || [])]; newPubs[i].title = e.target.value; setResumeData({ ...resumeData, publications: newPubs });
                                                }} />
                                                <input placeholder="Publisher / Journal" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={pub.publisher} onChange={e => {
                                                    const newPubs = [...(resumeData.publications || [])]; newPubs[i].publisher = e.target.value; setResumeData({ ...resumeData, publications: newPubs });
                                                }} />
                                                <input placeholder="Date (e.g., Aug 2024)" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={pub.date} onChange={e => {
                                                    const newPubs = [...(resumeData.publications || [])]; newPubs[i].date = e.target.value; setResumeData({ ...resumeData, publications: newPubs });
                                                }} />
                                                <input placeholder="URL" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={pub.url || ''} onChange={e => {
                                                    const newPubs = [...(resumeData.publications || [])]; newPubs[i].url = e.target.value; setResumeData({ ...resumeData, publications: newPubs });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </Card>

                                {/* Volunteer Experience */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-3 text-red-400 font-bold">
                                            <Heart size={20} />
                                            Volunteer Experience
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('volunteer', { organization: '', role: '', startDate: '', endDate: '', description: '' })}>
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    {resumeData.volunteer?.map((vol, i) => (
                                        <div key={i} className="mb-4 p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-white/5 relative">
                                            <button onClick={() => removeListItem('volunteer', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Organization" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={vol.organization} onChange={e => {
                                                    const newVols = [...(resumeData.volunteer || [])]; newVols[i].organization = e.target.value; setResumeData({ ...resumeData, volunteer: newVols });
                                                }} />
                                                <input placeholder="Role" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={vol.role} onChange={e => {
                                                    const newVols = [...(resumeData.volunteer || [])]; newVols[i].role = e.target.value; setResumeData({ ...resumeData, volunteer: newVols });
                                                }} />
                                                <input placeholder="Start Date" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={vol.startDate} onChange={e => {
                                                    const newVols = [...(resumeData.volunteer || [])]; newVols[i].startDate = e.target.value; setResumeData({ ...resumeData, volunteer: newVols });
                                                }} />
                                                <input placeholder="End Date" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={vol.endDate} onChange={e => {
                                                    const newVols = [...(resumeData.volunteer || [])]; newVols[i].endDate = e.target.value; setResumeData({ ...resumeData, volunteer: newVols });
                                                }} />
                                                <div className="col-span-2">
                                                    <textarea placeholder="Description" rows={3} className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500 resize-none" value={vol.description} onChange={e => {
                                                        const newVols = [...(resumeData.volunteer || [])]; newVols[i].description = e.target.value; setResumeData({ ...resumeData, volunteer: newVols });
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Card>

                                {/* References */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-3 text-orange-400 font-bold">
                                            <Users size={20} />
                                            References
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('references', { name: '', position: '', company: '', contact: '' })}>
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    {resumeData.references?.map((ref, i) => (
                                        <div key={i} className="mb-4 p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-white/5 relative">
                                            <button onClick={() => removeListItem('references', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Name" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={ref.name} onChange={e => {
                                                    const newRefs = [...(resumeData.references || [])]; newRefs[i].name = e.target.value; setResumeData({ ...resumeData, references: newRefs });
                                                }} />
                                                <input placeholder="Position" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={ref.position} onChange={e => {
                                                    const newRefs = [...(resumeData.references || [])]; newRefs[i].position = e.target.value; setResumeData({ ...resumeData, references: newRefs });
                                                }} />
                                                <input placeholder="Company" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={ref.company} onChange={e => {
                                                    const newRefs = [...(resumeData.references || [])]; newRefs[i].company = e.target.value; setResumeData({ ...resumeData, references: newRefs });
                                                }} />
                                                <input placeholder="Contact Info" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={ref.contact} onChange={e => {
                                                    const newRefs = [...(resumeData.references || [])]; newRefs[i].contact = e.target.value; setResumeData({ ...resumeData, references: newRefs });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </Card>

                                {/* Soft Skills */}
                                <Card className="p-6">
                                    <div className="flex items-center gap-3 mb-6 text-indigo-400 font-bold border-b border-white/5 pb-2">
                                        <Globe size={20} />
                                        Soft Skills
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.softSkills?.map((skill, i) => (
                                            <div key={i} className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 group border border-white/5">
                                                <span>{skill}</span>
                                                <button onClick={() => removeListItem('softSkills', i)} className="text-red-400 transition-all"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                        <input placeholder="Add soft skill (Press Enter)" onKeyDown={e => { if (e.key === 'Enter' && e.currentTarget.value) { addListItem('softSkills', e.currentTarget.value); e.currentTarget.value = ''; } }} className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 outline-none focus:border-blue-500 text-sm w-32" />
                                    </div>
                                </Card>

                                {/* Coursework */}
                                <Card className="p-6">
                                    <div className="flex items-center gap-3 mb-6 text-fuchsia-400 font-bold border-b border-white/5 pb-2">
                                        <GraduationCap size={20} />
                                        Relevant Coursework
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.coursework?.map((course, i) => (
                                            <div key={i} className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 group border border-white/5">
                                                <span>{course}</span>
                                                <button onClick={() => removeListItem('coursework', i)} className="text-red-400 transition-all"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                        <input placeholder="Add coursework (Press Enter)" onKeyDown={e => { if (e.key === 'Enter' && e.currentTarget.value) { addListItem('coursework', e.currentTarget.value); e.currentTarget.value = ''; } }} className="bg-transparent border-b border-gray-200 dark:border-white/10 p-1 outline-none focus:border-blue-500 text-sm w-32" />
                                    </div>
                                </Card>

                                {/* Patents */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-3 text-yellow-400 font-bold">
                                            <FileText size={20} />
                                            Patents
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('patents', { title: '', date: '', url: '', description: '' })}><Plus size={16} /></Button>
                                    </div>
                                    {resumeData.patents?.map((pat, i) => (
                                        <div key={i} className="mb-4 p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-white/5 relative">
                                            <button onClick={() => removeListItem('patents', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Title" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={pat.title} onChange={e => { const newPats = [...(resumeData.patents || [])]; newPats[i].title = e.target.value; setResumeData({ ...resumeData, patents: newPats }); }} />
                                                <input placeholder="Date (e.g. 2025)" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={pat.date} onChange={e => { const newPats = [...(resumeData.patents || [])]; newPats[i].date = e.target.value; setResumeData({ ...resumeData, patents: newPats }); }} />
                                                <div className="col-span-2">
                                                    <input placeholder="Description" className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={pat.description} onChange={e => { const newPats = [...(resumeData.patents || [])]; newPats[i].description = e.target.value; setResumeData({ ...resumeData, patents: newPats }); }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Card>

                                {/* Speaking Engagements */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-3 text-pink-400 font-bold">
                                            <Code size={20} />
                                            Speaking Engagements
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('speakingEngagements', { title: '', event: '', date: '', url: '' })}><Plus size={16} /></Button>
                                    </div>
                                    {resumeData.speakingEngagements?.map((speak, i) => (
                                        <div key={i} className="mb-4 p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-white/5 relative">
                                            <button onClick={() => removeListItem('speakingEngagements', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Talk Title" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={speak.title} onChange={e => { const newSpk = [...(resumeData.speakingEngagements || [])]; newSpk[i].title = e.target.value; setResumeData({ ...resumeData, speakingEngagements: newSpk }); }} />
                                                <input placeholder="Event Name" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={speak.event} onChange={e => { const newSpk = [...(resumeData.speakingEngagements || [])]; newSpk[i].event = e.target.value; setResumeData({ ...resumeData, speakingEngagements: newSpk }); }} />
                                                <input placeholder="Date" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={speak.date} onChange={e => { const newSpk = [...(resumeData.speakingEngagements || [])]; newSpk[i].date = e.target.value; setResumeData({ ...resumeData, speakingEngagements: newSpk }); }} />
                                                <input placeholder="Video URL" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={speak.url || ''} onChange={e => { const newSpk = [...(resumeData.speakingEngagements || [])]; newSpk[i].url = e.target.value; setResumeData({ ...resumeData, speakingEngagements: newSpk }); }} />
                                            </div>
                                        </div>
                                    ))}
                                </Card>

                                {/* Testimonials */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-3 text-sky-400 font-bold">
                                            <User size={20} />
                                            Testimonials
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => addListItem('testimonials', { name: '', quote: '', position: '' })}><Plus size={16} /></Button>
                                    </div>
                                    {resumeData.testimonials?.map((test, i) => (
                                        <div key={i} className="mb-4 p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-white/5 relative">
                                            <button onClick={() => removeListItem('testimonials', i)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Reviewer Name" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={test.name} onChange={e => { const newTest = [...(resumeData.testimonials || [])]; newTest[i].name = e.target.value; setResumeData({ ...resumeData, testimonials: newTest }); }} />
                                                <input placeholder="Position (e.g. CEO at ACME)" className="bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500" value={test.position} onChange={e => { const newTest = [...(resumeData.testimonials || [])]; newTest[i].position = e.target.value; setResumeData({ ...resumeData, testimonials: newTest }); }} />
                                                <div className="col-span-2">
                                                    <textarea placeholder="Quote" rows={2} className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 p-2 outline-none focus:border-blue-500 resize-none" value={test.quote} onChange={e => { const newTest = [...(resumeData.testimonials || [])]; newTest[i].quote = e.target.value; setResumeData({ ...resumeData, testimonials: newTest }); }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                            <div className="sticky  hidden lg:block h-[calc(100vh-140px)]">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <h3 className="font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-widest">Live Rendering</h3>
                                    </div>
                                    <Button size="sm" onClick={() => setStep(3)} className="shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700">
                                        Next: Style <ChevronRight size={14} className="ml-1" />
                                    </Button>
                                </div>

                                <div className="bg-[var(--surface)] rounded border border-[var(--border)] p-8 h-full flex justify-center items-start overflow-hidden relative group">
                                    {/* The Wrapper: Fixed dimensions to match the scaled resume (794 * 0.45 = ~357) */}
                                    <div className="relative w-[357px] h-[505px] transition-all duration-500 group-hover:scale-[1.02]">
                                        <div className="absolute top-0 left-0 origin-top-left scale-[0.45] pointer-events-none shadow-xl border border-[var(--border)] rounded overflow-hidden">
                                            <div className="bg-white">
                                                <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-[var(--accent)] text-white rounded shadow-lg text-[9px] uppercase tracking-[0.3em] font-black z-20">
                                        Live Rendering
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-10 animate-slideIn">
                        {/* Final Review Header & Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--surface)] p-4 rounded border border-[var(--border)] gap-4">
                            <div>
                                <h2 className="text-2xl font-black gradient-text tracking-tighter">Luxury Presentation</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Your professional identity is ready for global deployment.</p>
                            </div>
                            <div className="flex gap-3 items-center shrink-0">
                                <button onClick={() => setStep(2)} className="text-sm text-[var(--text)] opacity-60 hover:opacity-100 transition-opacity px-3 py-1.5">
                                    ← Back to Editing
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded hover:opacity-90 transition-opacity shadow-md disabled:opacity-60"
                                >
                                    <Download size={16} />
                                    {loading ? 'Exporting...' : 'Export to PDF'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Sidebar: Stylizing */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="flex items-center gap-3 mb-4 text-pink-500 px-2">
                                    <Palette size={20} />
                                    <h3 className="text-xl font-bold">Visual Vitals</h3>
                                </div>

                                <Card className="p-6 bg-[var(--surface)] border-[var(--border)] rounded">
                                    <label className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-black tracking-widest block mb-6">Accent Profile</label>
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

                                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm space-y-6">
                                    <label className="text-[10px] text-[var(--text-muted)] uppercase font-extrabold tracking-widest block">Master Typography</label>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Primary Glyph (Name)</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm w-20 outline-none text-[var(--text)] focus:border-[var(--accent)]"
                                                    value={resumeData.styling?.fontSize.name}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, fontSize: { ...prev.styling!.fontSize, name: parseInt(e.target.value) || 0 } }
                                                    }))}
                                                />
                                                <select
                                                    className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm flex-1 outline-none text-[var(--text)] focus:border-[var(--accent)]"
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

                                        <div className="space-y-2">
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Headings Interface</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm w-20 outline-none text-[var(--text)] focus:border-[var(--accent)]"
                                                    value={resumeData.styling?.fontSize.headings}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, fontSize: { ...prev.styling!.fontSize, headings: parseInt(e.target.value) || 0 } }
                                                    }))}
                                                />
                                                <select
                                                    className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm flex-1 outline-none text-[var(--text)] focus:border-[var(--accent)]"
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

                                        <div className="space-y-2">
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-extrabold tracking-wider">Core Data (Body)</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm w-20 outline-none text-[var(--text)] focus:border-[var(--accent)]"
                                                    value={resumeData.styling?.fontSize.body}
                                                    onChange={e => setResumeData(prev => ({
                                                        ...prev,
                                                        styling: { ...prev.styling!, fontSize: { ...prev.styling!.fontSize, body: parseInt(e.target.value) || 0 } }
                                                    }))}
                                                />
                                                <select
                                                    className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm flex-1 outline-none text-[var(--text)] focus:border-[var(--accent)]"
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
                                </div>

                                <div className="space-y-3 pt-4">
                                    <Button variant="secondary" className="w-full text-xs font-bold py-3 bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]" onClick={handleSave}>
                                        <Save size={16} className="mr-2 text-[var(--accent)]" /> Save Cloud Backup
                                    </Button>
                                </div>
                            </div>

                            {/* Main Presentation Area */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* The High-Def Preview */}
                                <div className="relative group w-full" ref={previewContainerRef}>
                                    {/* Bounding box: dynamically sized to match actual resume content height */}
                                    <div
                                        className="relative w-full shadow-xl border border-[var(--border)] rounded-2xl bg-white overflow-hidden"
                                        style={{ height: `${resumeContentHeight * previewScale}px` }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 origin-top-left"
                                            style={{ width: '794px', transform: `scale(${previewScale})`, transformOrigin: 'top left' }}
                                        >
                                            <div ref={resumeRef} className="w-[794px] bg-white">
                                                <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Luxury Template Library */}
                                <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text)]">Design Template Library</h3>
                                            <p className="text-[var(--text-muted)] text-xs sm:text-sm">Select a high-performance ATS template layout.</p>
                                        </div>
                                        <div className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--surface-hover)] px-4 py-2 rounded-full border border-[var(--border)]">
                                            {TEMPLATES.length} Live Layouts
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                        {TEMPLATES.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => {
                                                    setResumeData({ ...resumeData, template: t.id });
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`group cursor-pointer relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${resumeData.template === t.id
                                                    ? 'border-blue-500 ring-4 ring-blue-500/20 scale-[1.03] shadow-xl z-10'
                                                    : 'border-[var(--border)] hover:border-[var(--accent)] hover:scale-[1.02]'
                                                    }`}
                                            >
                                                {/* Thumbnail Rendering */}
                                                <div className="aspect-[1/1.414] bg-white overflow-hidden relative grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[794px] origin-top scale-[0.23] sm:scale-[0.2] md:scale-[0.25] pointer-events-none transform-gpu">
                                                        <ResumeTemplate data={resumeData} template={t.id} primaryColor={resumeData.color} />
                                                    </div>
                                                </div>

                                                {/* Overlay Info */}
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent transition-opacity duration-500 flex flex-col justify-end p-4 ${resumeData.template === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                    }`}>
                                                    <p className="text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-tighter sm:tracking-widest leading-none mb-1">{t.name}</p>
                                                    {resumeData.template === t.id && <p className="text-blue-400 text-[8px] font-black uppercase tracking-widest">Currently Active</p>}
                                                </div>

                                                {/* Active Badge */}
                                                {resumeData.template === t.id && (
                                                    <div className="absolute top-3 right-3 bg-blue-500 text-gray-900 dark:text-white rounded-full p-1.5 shadow-xl z-20 animate-bounce-subtle">
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
                    <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn flex flex-col bg-black/90 backdrop-blur-xl">
                        <div className="flex justify-between items-center px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <h3 className="text-sm font-bold tracking-tight text-[var(--text)]">Live Resume Preview</h3>
                            </div>
                            <button
                                onClick={() => setMobilePreviewOpen(false)}
                                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[var(--text)] hover:bg-white/20 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start">
                            <div className="w-full max-w-[400px] overflow-hidden rounded-xl shadow-2xl border border-[var(--border)] bg-white my-2" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                                <ResumeTemplate data={resumeData} template={resumeData.template} primaryColor={resumeData.color} />
                            </div>
                        </div>
                        <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
                            <Button onClick={() => setMobilePreviewOpen(false)} className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg">
                                Back to Editing
                            </Button>
                        </div>
                    </div>
                )}

                {/* Mobile Bottom Navigation Bar (Step 2) */}
                {step === 2 && (
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 border-t border-[var(--border)] backdrop-blur-md p-3 shadow-2xl flex items-center justify-between gap-3">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={() => setMobilePreviewOpen(true)}
                            className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 bg-[var(--bg)] border-[var(--border)] text-[var(--text)] rounded-xl"
                        >
                            <Eye size={16} />
                            Preview Resume
                        </Button>

                        <Button
                            variant="accent"
                            size="md"
                            onClick={() => setStep(3)}
                            className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 bg-blue-600 text-white shadow-lg rounded-xl"
                        >
                            <Palette size={16} />
                            Next: Style & Export →
                        </Button>
                    </div>
                )}

                <ToolSEOContent toolName="Free Resume Builder — 50+ Professional Templates" toolDescription="Build a professional resume in minutes with ToolBasketAI" />
            </main>
            <Footer />
        </div>
    );
}
