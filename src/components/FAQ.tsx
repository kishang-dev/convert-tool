import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
    {
        question: 'Is this tool completely free?',
        answer: 'Yes! All our basic tools are completely free to use with no hidden charges. You can convert, merge, split, and edit PDFs without any cost. We also offer premium features for power users.',
    },
    {
        question: 'Is my data secure and private?',
        answer: 'Absolutely. We take security seriously. All files are processed securely and automatically deleted from our servers after 1 hour. We use industry-standard encryption and never share your data with third parties.',
    },
    {
        question: 'Do I need to create an account?',
        answer: 'No registration required for basic use! You can start using our tools immediately. However, creating a free account gives you access to file history, cloud storage, and advanced features.',
    },
    {
        question: 'What file formats do you support?',
        answer: 'We support all major document formats including PDF, Word (DOC, DOCX), Excel (XLS, XLSX), images (PNG, JPG, JPEG, SVG), and more. Our tools automatically detect and handle different formats.',
    },
    {
        question: 'Are there any file size limits?',
        answer: 'Free users can upload files up to 50MB. Premium users enjoy unlimited file sizes and batch processing capabilities for handling multiple large files simultaneously.',
    },
    {
        question: 'How long does processing take?',
        answer: 'Most operations complete in seconds! Simple tasks like merging or splitting PDFs take 2-5 seconds, while complex operations like OCR or format conversion may take up to 30 seconds depending on file size.',
    },
    {
        question: 'Can I use this on mobile devices?',
        answer: 'Yes! Our platform is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. You can access all features from any modern web browser.',
    },
    {
        question: 'What makes this different from other PDF tools?',
        answer: 'We combine AI-powered features with a modern, intuitive interface. Our tools are faster, more accurate, and offer unique features like speech-to-PDF and advanced OCR that you won\'t find elsewhere.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section style={{ maxWidth: 1200, margin: '66px auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 34 }}>
                <h2 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-.02em', margin: '0 0 8px', color: 'var(--text)' }}>
                    Frequently Asked Questions
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: 0, fontFamily: '"Poppins", sans-serif' }}>
                    Everything you need to know about our tools.
                </p>
            </div>

            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            background: 'var(--surface)', 
                            border: '1px solid var(--border)', 
                            borderRadius: 16, 
                            overflow: 'hidden',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                        className="hover:border-[var(--accent)] hover:shadow-md"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            style={{ 
                                width: '100%', 
                                padding: '18px 22px', 
                                textAlign: 'left', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                background: 'transparent', 
                                border: 'none', 
                                cursor: 'pointer' 
                            }}
                            className="hover:bg-[var(--surface-hover)] transition-colors"
                        >
                            <h3 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: 15.5, color: 'var(--text)', margin: 0, paddingRight: 16 }}>
                                {faq.question}
                            </h3>
                            <div style={{ flexShrink: 0, display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 10, background: openIndex === index ? 'var(--accent-soft)' : 'var(--surface-hover)', transition: 'background 0.2s' }}>
                                <FiChevronDown 
                                    size={18} 
                                    color={openIndex === index ? 'var(--accent)' : 'var(--text-muted)'} 
                                    style={{ transform: openIndex === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} 
                                />
                            </div>
                        </button>
                        <div style={{ 
                            maxHeight: openIndex === index ? 500 : 0, 
                            opacity: openIndex === index ? 1 : 0, 
                            overflow: 'hidden', 
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                        }}>
                            <p style={{ padding: '0 22px 20px', margin: 0, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, fontFamily: '"Poppins", sans-serif' }}>
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
