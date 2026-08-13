import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { resumeAPI, ResumeData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { LuFileText as FileText, LuPlus as Plus, LuTrash2 as Trash2, LuPenLine as Edit3, LuSparkles as Sparkles, LuSearch as Search, LuClock as Clock, LuUser as User, LuBriefcase as Briefcase, LuChevronRight as ChevronRight } from "react-icons/lu";

export default function MyResumesPage() {
    const { user, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const [resumes, setResumes] = useState<ResumeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!_hasHydrated) return;

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
        sessionStorage.setItem('editResume', JSON.stringify(resume));
        router.push('/resume-builder?edit=' + resume._id);
    };

    const filteredResumes = resumes.filter(r => {
        const q = searchQuery.toLowerCase();
        return (
            (r.title || '').toLowerCase().includes(q) ||
            (r.personalInfo?.fullName || '').toLowerCase().includes(q) ||
            (r.personalInfo?.email || '').toLowerCase().includes(q)
        );
    });

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    if (!_hasHydrated || !user) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
            <SEO
                title="My Resumes — Manage Your Saved Resumes"
                description="Manage, edit, download, and export all your saved resumes in one place. Built with ToolBasketAI's free AI-powered resume builder."
                canonical="/my-resumes"
                noIndex={true}
                keywords="my resumes, saved resumes, resume manager, edit resume online, download resume PDF"
            />

            <Navbar />

            {/* Ambient Lighting Backdrops */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-3xl opacity-60 rounded-full"></div>
            </div>

            <main className="pt-8 sm:pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="animate-fadeIn mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-2 bg-[var(--accent-soft)] border border-[var(--accent-ring)] px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
                        <Sparkles className="text-[var(--accent)]" size={15} />
                        <span className="text-xs font-bold text-[var(--accent)]">RESUME CLOUD LIBRARY</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text)]">
                                My Resumes
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-1.5 font-normal">
                                {resumes.length > 0
                                    ? `${resumes.length} professional resume${resumes.length > 1 ? 's' : ''} saved to your cloud account`
                                    : 'Create your first ATS-friendly professional resume'}
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push('/resume-builder')}
                            size="lg"
                            className="shrink-0 font-bold shadow-lg shadow-blue-500/20 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl py-3 px-5 flex items-center gap-2"
                        >
                            <Plus size={18} />
                            <span>Create New Resume</span>
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                {resumes.length > 0 && (
                    <div className="relative mb-8 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, name or email..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--surface)] border border-[var(--border)] pl-11 pr-4 py-3 rounded-xl outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)] transition-all text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] shadow-sm"
                        />
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 gap-3">
                        <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-[var(--text-muted)] font-medium">Loading your cloud resumes...</p>
                    </div>
                ) : resumes.length === 0 ? (
                    /* Empty State */
                    <Card variant="elevated" className="p-10 sm:p-16 text-center bg-[var(--surface)] border-2 border-dashed border-[var(--border)] rounded-3xl shadow-sm">
                        <div className="w-20 h-20 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--accent-ring)]">
                            <FileText size={40} className="text-[var(--accent)]" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-[var(--text)]">No saved resumes found</h2>
                        <p className="text-[var(--text-muted)] text-sm mb-8 max-w-md mx-auto leading-relaxed">
                            Start fresh or upload an existing PDF/Word file to automatically create a stunning ATS-friendly resume.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                            <Button onClick={() => router.push('/resume-builder')} size="lg" className="w-full py-3 text-sm font-bold bg-[var(--accent)] text-white rounded-xl shadow-md">
                                <Plus size={18} />
                                Build from Scratch
                            </Button>
                            <Button variant="secondary" size="lg" onClick={() => router.push('/resume-builder')} className="w-full py-3 text-sm font-bold bg-[var(--surface-hover)] border-[var(--border)] text-[var(--text)] rounded-xl">
                                <FileText size={18} />
                                Upload PDF / Word
                            </Button>
                        </div>
                    </Card>
                ) : filteredResumes.length === 0 ? (
                    <div className="text-center py-20 bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8">
                        <Search className="mx-auto text-[var(--text-muted)] mb-3" size={36} />
                        <p className="text-[var(--text)] font-semibold">No resumes found matching &quot;{searchQuery}&quot;</p>
                        <button onClick={() => setSearchQuery('')} className="text-[var(--accent)] hover:underline mt-2 text-xs font-bold">
                            Clear search filter
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
                        <div
                            onClick={() => router.push('/resume-builder')}
                            className="group relative p-6 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 min-h-[260px] cursor-pointer shadow-sm"
                        >
                            <div className="w-14 h-14 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center border border-[var(--accent-ring)] group-hover:scale-110 transition-transform">
                                <Plus size={28} className="text-[var(--accent)]" />
                            </div>
                            <div>
                                <p className="text-[var(--text)] font-bold text-base group-hover:text-[var(--accent)] transition-colors">Create New Resume</p>
                                <p className="text-[var(--text-muted)] text-xs mt-1">Start fresh or import document</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
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
        <div
            className="group relative p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-lift)] transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5"
            onClick={onEdit}
        >
            <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center border border-[var(--accent-ring)] text-[var(--accent)]">
                        <FileText size={22} />
                    </div>
                    <button
                        onClick={e => { e.stopPropagation(); onDelete(); }}
                        disabled={isDeleting}
                        className="text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors p-2 rounded-lg"
                        title="Delete resume"
                    >
                        {isDeleting
                            ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            : <Trash2 size={16} />
                        }
                    </button>
                </div>

                {/* Title & Personal Info */}
                <h3 className="font-bold text-lg leading-snug mb-1 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                    {resume.title || resume.personalInfo?.fullName || 'Untitled Resume'}
                </h3>
                {resume.personalInfo?.fullName && (
                    <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 flex items-center gap-1.5 truncate">
                        <User size={13} className="text-[var(--text-faint)] shrink-0" />
                        <span>{resume.personalInfo.fullName}</span>
                    </p>
                )}
                <p className="text-xs text-[var(--text-faint)] line-clamp-2 leading-relaxed mt-1">
                    {resume.personalInfo?.summary || 'No professional summary provided.'}
                </p>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="space-y-4 pt-2 border-t border-[var(--border)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {expCount > 0 && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)] px-2.5 py-1 rounded-md">
                                <Briefcase size={11} className="text-[var(--accent)]" />
                                {expCount} job{expCount > 1 ? 's' : ''}
                            </span>
                        )}
                        {skillCount > 0 && (
                            <span className="text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)] px-2.5 py-1 rounded-md">
                                {skillCount} skills
                            </span>
                        )}
                    </div>
                    {(resume as any).createdAt && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-faint)]">
                            <Clock size={11} />
                            {formatDate((resume as any).createdAt)}
                        </span>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="w-full text-xs font-bold py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                        onClick={e => { e.stopPropagation(); onEdit(); }}
                    >
                        <Edit3 size={14} />
                        <span>Edit Details</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
