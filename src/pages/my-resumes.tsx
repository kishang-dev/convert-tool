import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { resumeAPI, ResumeData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import Card from '@/components/Card';
import Button from '@/components/Button';
import {
    FileText, Plus, Trash2, Edit3, Download, Sparkles,
    Search, Clock, User, Briefcase, ChevronRight
} from 'lucide-react';

export default function MyResumesPage() {
    const { user, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const [resumes, setResumes] = useState<ResumeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!_hasHydrated) return; // Wait for hydration before checking auth state

        if (!user) {
            router.push('/login?redirect=/my-resumes');
            return;
        }
        fetchResumes();
    }, [user, router, _hasHydrated]);

    const fetchResumes = async () => {
        setLoading(true);
        try {
            const res = await resumeAPI.getUserResumes();
            if (res.success) setResumes(res.data);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this resume?')) return;
        setDeletingId(id);
        try {
            const res = await resumeAPI.deleteResume(id);
            if (res.success) {
                setResumes(prev => prev.filter(r => r._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete resume:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (resume: ResumeData) => {
        // Store in session so resume-builder can pick it up
        sessionStorage.setItem('editResume', JSON.stringify(resume));
        router.push('/resume-builder?edit=' + resume._id);
    };

    const filteredResumes = resumes.filter(r => {
        const q = searchQuery.toLowerCase();
        return (
            (r.title || '').toLowerCase().includes(q) ||
            r.personalInfo.fullName.toLowerCase().includes(q) ||
            r.personalInfo.email.toLowerCase().includes(q)
        );
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (!_hasHydrated || !user) return null;

    return (
        <div className="min-h-screen bg-[var(--surface)] dark:bg-[#0a0a0f] text-[var(--text)] dark:text-[var(--text)]">
            <SEO
                title="My Resumes — Manage Your Saved Resumes"
                description="Manage, edit, download, and export all your saved resumes in one place. Built with ToolBasketAI's free AI-powered resume builder."
                canonical="/my-resumes"
                keywords="my resumes, saved resumes, resume manager, edit resume online, download resume PDF"
            />

            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 -z-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>
            <div className="fixed top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float -z-10"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: '1.5s' }}></div>

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="animate-fadeIn mb-10">
                    <div className="inline-flex items-center gap-2 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] px-4 py-2 rounded-full mb-4">
                        <Sparkles className="text-blue-400" size={16} />
                        <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Resume Library</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black gradient-text tracking-tight mb-2">
                                My Resumes
                            </h1>
                            <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-base">
                                {resumes.length > 0
                                    ? `${resumes.length} resume${resumes.length > 1 ? 's' : ''} saved to your account`
                                    : 'Create your first professional resume'}
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push('/resume-builder')}
                            size="lg"
                            className="shrink-0"
                        >
                            <Plus size={20} />
                            New Resume
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                {resumes.length > 0 && (
                    <div className="relative mb-8 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)] dark:text-[var(--text-faint)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search resumes..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] pl-12 pr-4 py-3 rounded outline-none focus:border-[var(--accent)] focus:bg-[var(--surface-hover)] transition-all text-[var(--text)] dark:text-[var(--text)] placeholder-[var(--text-faint)]"
                        />
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : resumes.length === 0 ? (
                    /* Empty State */
                    <Card variant="elevated" className="p-16 text-center bg-[var(--surface-hover)] border-dashed border-[var(--border)] dark:border-[var(--border)]">
                        <div className="w-24 h-24 bg-blue-500/10 rounded flex items-center justify-center mx-auto mb-8">
                            <FileText size={48} className="text-blue-400/60" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-[var(--text-muted)] dark:text-[var(--text-muted)]">No resumes yet</h2>
                        <p className="text-[var(--text-faint)] dark:text-[var(--text-faint)] mb-8 max-w-sm mx-auto">
                            Create your first professional resume using our AI-powered builder.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => router.push('/resume-builder')} size="lg">
                                <Plus size={20} />
                                Build from Scratch
                            </Button>
                            <Button variant="secondary" size="lg" onClick={() => router.push('/resume-builder')}>
                                <FileText size={20} />
                                Upload & Convert
                            </Button>
                        </div>
                    </Card>
                ) : filteredResumes.length === 0 ? (
                    <div className="text-center py-20">
                        <Search className="mx-auto text-[var(--text-muted)] mb-4" size={40} />
                        <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)]">No resumes match &quot;{searchQuery}&quot;</p>
                        <button onClick={() => setSearchQuery('')} className="text-blue-400 hover:text-blue-300 mt-2 text-sm">
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResumes.map(resume => (
                            <ResumeCard
                                key={resume._id}
                                resume={resume}
                                onEdit={() => handleEdit(resume)}
                                onDelete={() => handleDelete(resume._id as string)}
                                isDeleting={deletingId === resume._id}
                                formatDate={formatDate}
                            />
                        ))}

                        {/* Add New Card */}
                        <button
                            onClick={() => router.push('/resume-builder')}
                            className="group relative p-8 rounded border-2 border-dashed border-[var(--border)] dark:border-[var(--border)] hover:border-blue-500/40 bg-[var(--surface-hover)] hover:bg-[var(--surface)] dark:bg-[var(--accent-soft)] transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[280px]"
                        >
                            <div className="w-16 h-16 bg-blue-500/10 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus size={32} className="text-blue-400/70 group-hover:text-blue-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] font-semibold group-hover:text-[var(--text-muted)] dark:text-[var(--text-muted)] transition-colors">New Resume</p>
                                <p className="text-[var(--text-muted)] text-sm mt-1">Create from scratch or upload</p>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ResumeCard({
    resume,
    onEdit,
    onDelete,
    isDeleting,
    formatDate
}: {
    resume: ResumeData;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
    formatDate: (d: string) => string;
}) {
    const expCount = resume.experience?.length || 0;
    const skillCount = resume.skills?.length || 0;

    return (
        <Card
            variant="elevated"
            className="group relative p-6 bg-[var(--surface-hover)] border border-[var(--border)] hover:border-blue-500/30 hover:bg-[var(--surface-hover)] transition-all duration-300 cursor-pointer flex flex-col gap-4"
            onClick={onEdit}
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded flex items-center justify-center border border-[var(--border)] dark:border-[var(--border)]">
                    <FileText size={22} className="text-blue-300" />
                </div>
                <button
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    disabled={isDeleting}
                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                    title="Delete resume"
                >
                    {isDeleting
                        ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <Trash2 size={16} />
                    }
                </button>
            </div>

            {/* Title & Name */}
            <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight mb-1 text-[var(--text)] dark:text-[var(--text)] group-hover:text-blue-200 transition-colors truncate">
                    {resume.title || resume.personalInfo.fullName || 'Untitled Resume'}
                </h3>
                {resume.title && (
                    <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-2 flex items-center gap-1">
                        <User size={12} />
                        {resume.personalInfo.fullName}
                    </p>
                )}
                <p className="text-xs text-[var(--text-faint)] dark:text-[var(--text-faint)] line-clamp-2 leading-relaxed">
                    {resume.personalInfo.summary || 'No summary provided.'}
                </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
                {expCount > 0 && (
                    <span className="flex items-center gap-1 text-xs text-[var(--text-faint)] dark:text-[var(--text-faint)] bg-[var(--surface)] dark:bg-[var(--accent-soft)] px-2 py-1 rounded-full">
                        <Briefcase size={10} />
                        {expCount} job{expCount > 1 ? 's' : ''}
                    </span>
                )}
                {skillCount > 0 && (
                    <span className="text-xs text-[var(--text-faint)] dark:text-[var(--text-faint)] bg-[var(--surface)] dark:bg-[var(--accent-soft)] px-2 py-1 rounded-full">
                        {skillCount} skills
                    </span>
                )}
                {(resume as any).createdAt && (
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] ml-auto">
                        <Clock size={10} />
                        {formatDate((resume as any).createdAt)}
                    </span>
                )}
            </div>

            {/* Action Bar */}
            <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <Button
                    size="sm"
                    className="flex-1 text-sm py-2"
                    onClick={e => { e.stopPropagation(); onEdit(); }}
                >
                    <Edit3 size={14} />
                    Edit
                </Button>
                <div className="flex items-center gap-1 text-xs text-[var(--text-faint)] dark:text-[var(--text-faint)] bg-[var(--surface)] dark:bg-[var(--accent-soft)] px-3 py-2 rounded">
                    <ChevronRight size={12} className="text-[var(--text-muted)] dark:text-[var(--text-muted)]" />
                    Open
                </div>
            </div>
        </Card>
    );
}
