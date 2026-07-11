import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FiCalendar, FiClock, FiUser, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

export default function BlogPost({ blog }: { blog: any }) {
    if (!blog) return null;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://toolbasketai.com/blog/${blog.slug}`
        },
        "headline": blog.title,
        "description": blog.excerpt,
        "image": blog.image,
        "author": {
            "@type": "Person",
            "name": blog.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "ToolBasketAI",
            "logo": {
                "@type": "ImageObject",
                "url": "https://toolbasketai.com/logo.png"
            }
        },
        "datePublished": new Date(blog.date).toISOString()
    };

    // A very simple markdown to HTML parser for our basic blog structure
    const renderContent = (text: string) => {
        if (!text) return null;
        return text.split(/\r?\n\r?\n/).map((block, i) => {
            const cleanBlock = block.trim();
            if (cleanBlock.startsWith('## ')) {
                return <h2 key={i} className="text-2xl sm:text-3xl font-bold font-['Sora',sans-serif] mt-10 mb-4 text-[var(--text)]">{cleanBlock.replace('## ', '').trim()}</h2>;
            }
            if (cleanBlock === '') return null;
            return <p key={i} className="text-base sm:text-[17px] text-[var(--text-muted)] leading-[1.8] font-['Poppins',sans-serif] mb-6">{cleanBlock}</p>;
        });
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
                            <span className="flex items-center gap-2"><FiUser size={16} className="text-[var(--accent)]"/> {blog.author}</span>
                            <span className="flex items-center gap-2"><FiCalendar size={16} className="text-[var(--accent)]"/> {blog.date}</span>
                            <span className="flex items-center gap-2"><FiClock size={16} className="text-[var(--accent)]"/> {blog.readTime}</span>
                        </div>
                    </div>

                    <div className="rounded-[24px] overflow-hidden mb-12 shadow-[0_20px_50px_rgba(20,20,43,0.12)] border border-[var(--border)]">
                        <img src={blog.image} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover" />
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const api_root = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

        const res = await fetch(`${api_root}/blogs/${params?.slug}`);
        const data = await res.json();
        
        if (!data.success || !data.data) {
            return { notFound: true };
        }

        return {
            props: {
                blog: data.data,
            },
        };
    } catch (error) {
        return { notFound: true };
    }
};
