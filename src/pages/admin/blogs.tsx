import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogApi } from '@/services/api';
import { FiEdit, FiTrash2, FiUpload, FiImage, FiX } from 'react-icons/fi';
import Image from 'next/image';
import Button from '@/components/Button';

const emptyForm = {
    _id: '', slug: '', title: '', excerpt: '', content: '', date: '', readTime: '5 min read', category: '', image: ''
};

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await blogApi.getAllBlogs();
            if (res.success) setBlogs(res.data);
        } catch (error) {
            console.error('Error fetching blogs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Local preview instantly
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        // Upload to backend
        try {
            setUploading(true);
            const res = await blogApi.uploadImage(file);
            if (res.success && res.url) {
                setFormData(prev => ({ ...prev, image: res.url }));
            } else {
                alert('Image upload failed.');
                setImagePreview(null);
            }
        } catch (error) {
            console.error('Image upload error', error);
            alert('Image upload failed. Make sure backend is running.');
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            alert('Please upload a cover image first.');
            return;
        }
        try {
            setSaving(true);
            const dataToSave = { ...formData, date: formData.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) };
            if (isEditing) {
                await blogApi.updateBlog(formData._id, dataToSave);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _id, ...createPayload } = dataToSave; // strip empty _id so MongoDB auto-generates it
                await blogApi.createBlog(createPayload);
            }
            fetchBlogs();
            handleReset();
        } catch (error: any) {
            console.error('Error saving blog', error);
            alert(error?.response?.data?.error || 'Failed to save. Ensure slug is unique and all fields are filled.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        try {
            await blogApi.deleteBlog(id);
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog', error);
        }
    };

    const handleEdit = (blog: any) => {
        setFormData(blog);
        setImagePreview(blog.image || null);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        setFormData({ ...emptyForm });
        setImagePreview(null);
        setIsEditing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="font-['Sora',sans-serif] text-3xl font-extrabold text-[var(--text)]">Blog Manager</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1 font-['Poppins',sans-serif]">Create, edit and delete blog posts.</p>
                </div>

                <div className="grid md:grid-cols-[380px_1fr] gap-8 items-start">

                    {/* ── Form ─────────────────── */}
                    <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] sticky top-24">
                        <h2 className="text-lg font-bold font-['Sora',sans-serif] mb-5">{isEditing ? '✏️ Edit Post' : '➕ New Post'}</h2>
                        <form onSubmit={handleSave} className="flex flex-col gap-3.5 text-sm">

                            {/* Image Upload */}
                            <div>
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Cover Image *</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageSelect}
                                    ref={fileInputRef}
                                    className="hidden"
                                    id="blog-image-upload"
                                />
                                {imagePreview ? (
                                    <div className="relative rounded-xl overflow-hidden border border-[var(--border)]">
                                        <Image src={imagePreview} alt="Preview" width={800} height={160} className="w-full h-40 object-cover" />
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                                                Uploading...
                                            </div>
                                        )}
                                        <button type="button" onClick={() => { setImagePreview(null); setFormData(p => ({ ...p, image: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors">
                                            <FiX size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="blog-image-upload" className="flex flex-col items-center gap-2 border-2 border-dashed border-[var(--border)] rounded-xl p-6 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all">
                                        <FiUpload size={22} className="text-[var(--text-muted)]" />
                                        <span className="text-[var(--text-muted)] text-xs text-center">Click to upload cover image<br /><span className="text-[var(--accent)]">JPG, PNG, WEBP</span></span>
                                    </label>
                                )}
                            </div>

                            <input placeholder="Title *" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" />
                            <input placeholder="Slug (e.g. my-blog-post) *" value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} required className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors font-mono text-xs" />
                            <input placeholder="Category *" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} required className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" />
                            <input placeholder="Read Time (e.g. 5 min read)" value={formData.readTime} onChange={e => setFormData(p => ({ ...p, readTime: e.target.value }))} className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" />
                            <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" />
                            <textarea placeholder="Excerpt (short description) *" value={formData.excerpt} onChange={e => setFormData(p => ({ ...p, excerpt: e.target.value }))} required className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors h-20 resize-none" />
                            <textarea placeholder="Content&#10;&#10;## Use ## for headings&#10;&#10;Write paragraphs with blank lines between them." value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} required className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors h-44 font-mono text-xs resize-none" />

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" variant="accent" className="flex-1" disabled={uploading || saving}>
                                    {saving ? 'Saving...' : uploading ? 'Uploading...' : isEditing ? 'Update Post' : 'Publish Post'}
                                </Button>
                                {isEditing && (
                                    <Button type="button" onClick={handleReset} variant="secondary">Cancel</Button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* ── Blog List ─────────────── */}
                    <div>
                        <h2 className="text-lg font-bold font-['Sora',sans-serif] mb-5">Published Posts ({blogs.length})</h2>
                        {loading ? (
                            <p className="text-[var(--text-muted)] text-sm">Loading...</p>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-2xl text-[var(--text-muted)]">
                                <FiImage size={36} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No posts yet. Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {blogs.map(blog => (
                                    <div key={blog._id} className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] flex justify-between items-center hover:border-[var(--accent)] transition-colors gap-4">
                                        <div className="flex gap-4 items-center flex-1 min-w-0">
                                            <Image src={blog.image} alt={blog.title} width={64} height={64} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[var(--border)]" />
                                            <div className="min-w-0">
                                                <h3 className="font-semibold font-['Sora',sans-serif] truncate text-[var(--text)]">{blog.title}</h3>
                                                <p className="text-xs text-[var(--text-muted)] mt-1 font-['Poppins',sans-serif]">/{blog.slug}</p>
                                                <span className="text-[11px] font-bold bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 rounded-full mt-1 inline-block">{blog.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => handleEdit(blog)} title="Edit" className="p-2.5 bg-[var(--bg)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] rounded-xl transition-colors">
                                                <FiEdit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(blog._id)} title="Delete" className="p-2.5 bg-[var(--bg)] hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
