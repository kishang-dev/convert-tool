import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import {
    LandingHero,
    LandingCategories,
    LandingTools,
    LandingStats,
    LandingPremium,
    LandingBenefits,
    LandingAbout,
    LandingPricing,
    LandingCTA,
    LandingBlogs
} from './LandingSections';
import { allTools, C } from '../data/landingData';

export default function LandingPage() {
    const [rotIdx, setRotIdx] = useState(0);
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState('all');

    const words = ['PDFs', 'Images', 'Documents', 'Conversions', 'Your Files', 'Any Task'];
    const wcolors = ['#FF5C7A', '#22C55E', '#5D5FEF', '#F59E0B', '#EC4899', '#8B5CF6'];

    useEffect(() => {
        const timer = setInterval(() => {
            setRotIdx((prev) => (prev + 1) % words.length);
        }, 2200);
        return () => clearInterval(timer);
    }, [words.length]);

    const tabKeys = ['all', 'pdf', 'image', 'docs', 'ai', 'dev', 'ocr'];
    const tabLabels = { all: 'All Tools', pdf: 'PDF', image: 'Image', docs: 'Documents', ai: 'AI Suite', dev: 'Developer', ocr: 'OCR' };

    const q = query.trim().toLowerCase();
    let list = allTools;
    if (q) {
        list = list.filter(t => t[0].toLowerCase().includes(q) || t[2].toLowerCase().includes(q) || C[t[1] as keyof typeof C].label.toLowerCase().includes(q));
    } else if (tab !== 'all') {
        list = list.filter(t => t[1] === tab);
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <Head>
                <title>ToolBasketAI | Free Online PDF, Image, and Document Tools</title>
                <meta name="description" content="Convert, merge, split, compress and process your PDFs, images and documents — entirely free, right in your browser. 75+ free tools with no sign-up required." />
                <meta name="keywords" content="PDF tools, image resizer, document converter, free OCR, AI tools, online tools, file converter" />
                <meta property="og:title" content="ToolBasketAI | Free Online PDF, Image, and Document Tools" />
                <meta property="og:description" content="Convert, merge, split, compress and process your PDFs, images and documents — entirely free, right in your browser." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="ToolBasketAI | Free Online PDF, Image, and Document Tools" />
                <meta name="twitter:description" content="Convert, merge, split, compress and process your PDFs, images and documents — entirely free, right in your browser." />
                <link rel="canonical" href="https://toolbasketai.com/" />
            </Head>

            <style>{`
                .feature-card:hover .feature-icon-box {
                    background: var(--accent) !important;
                    border-color: var(--accent) !important;
                    transform: scale(1.05) rotate(3deg);
                }
                .feature-card:hover .feature-icon {
                    color: #fff !important;
                }
            `}</style>
            <main>
                <LandingHero
                    query={query}
                    setQuery={setQuery}
                    rotIdx={rotIdx}
                    wcolors={wcolors}
                    words={words}
                />


                <LandingTools
                    query={query}
                    list={list}
                    tabKeys={tabKeys}
                    tab={tab}
                    setTab={setTab}
                    setQuery={setQuery}
                    tabLabels={tabLabels}
                />

                <LandingStats />
                <LandingPremium />
                <HowItWorks />
                <LandingBenefits />
                <LandingAbout />
                <FAQ />
                <LandingPricing />
                <LandingBlogs />
                <LandingCTA />
            </main>

            <Footer />
        </div>
    );
}
