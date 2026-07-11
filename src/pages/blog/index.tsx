import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Link from 'next/link';
import { blogs } from '@/data/blogData';
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function BlogPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "ToolBasketAI Blog",
        "description": "Insights, guides, and updates on AI, PDF manipulation, and developer tools.",
        "url": "https://toolbasketai.com/blog",
        "publisher": {
            "@type": "Organization",
            "name": "ToolBasketAI",
            "logo": {
                "@type": "ImageObject",
                "url": "https://toolbasketai.com/logo.png"
            }
        },
        "blogPost": blogs.map(blog => ({
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "datePublished": blog.date,
            "author": {
                "@type": "Person",
                "name": blog.author
            },
            "url": `https://toolbasketai.com/blog/${blog.slug}`
        }))
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
            <SEO
                title="Blog | ToolBasketAI"
                description="Read our latest articles on AI tools, PDF manipulation, image optimization, and web development. Stay updated with ToolBasketAI."
                canonical="/blog"
                structuredData={structuredData}
            />
            
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                <Breadcrumbs 
                    items={[
                        { label: 'Blog', href: '/blog' }
                    ]} 
                />

                <div className="text-center max-w-3xl mx-auto mb-16 mt-8 animate-fadeIn">
                    <h1 className="font-['Sora',sans-serif] font-extrabold text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-.03em] m-0 mb-4 text-[var(--text)]">
                        Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#8B5CF6]">Updates</span>
                    </h1>
                    <p className="text-[18px] text-[var(--text-muted)] font-['Poppins',sans-serif] leading-[1.6]">
                        Discover the latest guides, tutorials, and news about our tools, AI advancements, and productivity hacks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, idx) => (
                        <Link href={`/blog/${blog.slug}`} key={blog.slug} className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden hover:shadow-[0_20px_50px_rgba(20,20,43,0.12)] hover:border-[var(--accent)] transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="relative h-56 overflow-hidden">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute top-4 left-4 bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-white text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                    {blog.category}
                                </div>
                            </div>
                            
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-[13px] text-[var(--text-muted)] font-semibold mb-3">
                                    <span className="flex items-center gap-1.5"><FiCalendar size={14} className="text-[var(--accent)]"/> {blog.date}</span>
                                    <span className="flex items-center gap-1.5"><FiClock size={14} className="text-[var(--accent)]"/> {blog.readTime}</span>
                                </div>
                                <h3 className="font-['Sora',sans-serif] font-bold text-[20px] leading-[1.4] mb-3 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-[14.5px] text-[var(--text-muted)] leading-[1.6] font-['Poppins',sans-serif] mb-6 flex-1 line-clamp-3">
                                    {blog.excerpt}
                                </p>
                                <div className="mt-auto flex items-center font-bold text-[14px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors gap-2">
                                    Read Article <FiArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform"/>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
