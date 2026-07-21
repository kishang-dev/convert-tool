import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { blogApi } from '@/services/api';
import { FiCalendar, FiClock, FiUser, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPost() {
    const router = useRouter();
    const { slug } = router.query;

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const slugStr = Array.isArray(slug) ? slug[0] : slug;
        setLoading(true);
        setNotFound(false);
        blogApi.getBlogById(slugStr)
            .then(res => {
                if (res.success && res.data) {
                    setBlog(res.data);
                } else {
                    setNotFound(true);
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    const renderContent = (text: string) => {
        if (!text) return null;
        return text.split(/\r?\n\r?\n/).map((block, i) => {
            const cleanBlock = block.trim();
            if (!cleanBlock) return null;
            if (cleanBlock.startsWith('## ')) {
                return <h2 key={i} className="text-2xl sm:text-3xl font-bold font-['Sora',sans-serif] mt-10 mb-4 text-[var(--text)]">{cleanBlock.replace('## ', '').trim()}</h2>;
            }
            return <p key={i} className="text-base sm:text-[17px] text-[var(--text-muted)] leading-[1.8] font-['Poppins',sans-serif] mb-6">{cleanBlock}</p>;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full animate-pulse">
                    <div className="h-8 bg-[var(--surface)] rounded w-1/3 mb-6" />
                    <div className="h-14 bg-[var(--surface)] rounded mb-4" />
                    <div className="h-[420px] bg-[var(--surface)] rounded-[24px] mb-8" />
                    {[1,2,3].map(i => <div key={i} className="h-5 bg-[var(--surface)] rounded mb-3" />)}
                </main>
                <Footer />
            </div>
        );
    }

    if (notFound || !blog) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center text-[var(--text)]">
                <Navbar />
                <div className="text-center py-20">
                    <h1 className="text-5xl font-bold mb-4">404</h1>
                    <p className="text-[var(--text-muted)] mb-6">Blog post not found.</p>
                    <Link href="/blog" className="text-[var(--accent)] font-semibold hover:underline">← Back to Blog</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://toolbasketai.com/blog/${blog.slug}` },
        "headline": blog.title,
        "description": blog.excerpt,
        "image": blog.image,
        "author": { "@type": "Person", "name": blog.author },
        "publisher": { "@type": "Organization", "name": "ToolBasketAI", "logo": { "@type": "ImageObject", "url": "https://toolbasketai.com/logo.png" } },
        "datePublished": blog.date
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
            <SEO
                title={`${blog.title} | ToolBasketAI Blog`}
                description={blog.excerpt}
                canonical={`/blog/${blog.slug}`}
                structuredData={structuredData}
            />

            <Head>
                <meta property="og:image" content={blog.image} />
                <meta name="twitter:image" content={blog.image} />
            </Head>

            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 md:py-12 animate-fadeIn">
                <Breadcrumbs
                    items={[
                        { label: 'Blog', href: '/blog' },
                        { label: blog.title, href: `/blog/${blog.slug}` }
                    ]}
                />

                <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] font-['Poppins',sans-serif] font-semibold text-[14px] mb-8 transition-colors">
                    <FiArrowLeft size={16} /> Back to all articles
                </Link>

                <article>
                    <div className="mb-8">
                        <div className="inline-block bg-[var(--accent-soft)] text-[var(--accent)] text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
                            {blog.category}
                        </div>
                        <h1 className="font-['Sora',sans-serif] font-extrabold text-[clamp(32px,5vw,52px)] leading-[1.15] tracking-[-.02em] text-[var(--text)] mb-6">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-[14px] text-[var(--text-muted)] font-['Poppins',sans-serif] font-medium border-b border-[var(--border)] pb-8 mb-8">
                            <span className="flex items-center gap-2"><FiUser size={16} className="text-[var(--accent)]" /> {blog.author}</span>
                            <span className="flex items-center gap-2"><FiCalendar size={16} className="text-[var(--accent)]" /> {blog.date}</span>
                            <span className="flex items-center gap-2"><FiClock size={16} className="text-[var(--accent)]" /> {blog.readTime}</span>
                        </div>
                    </div>

                    <div className="rounded-[24px] overflow-hidden mb-12 shadow-[0_20px_50px_rgba(20,20,43,0.12)] border border-[var(--border)]">
                        <Image src={blog.image} alt={blog.title} width={1200} height={500} className="w-full h-auto max-h-[500px] object-cover" />
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <p className="text-xl sm:text-[22px] text-[var(--text)] leading-[1.7] font-['Sora',sans-serif] font-medium mb-10">
                            {blog.excerpt}
                        </p>
                        <div className="prose prose-invert max-w-none">
                            {renderContent(blog.content || '')}
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
