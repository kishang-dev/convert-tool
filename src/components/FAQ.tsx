import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Card from './Card';

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
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter leading-none">
                        Frequently Asked
                        <span className="gradient-text"> Questions</span>
                    </h2>
                    <p className="text-sm sm:text-lg text-gray-400 font-bold uppercase tracking-widest opacity-60">
                        Everything you need to know about our tools
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Card
                            key={index}
                            variant="elevated"
                            className="overflow-hidden transition-smooth"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-smooth"
                            >
                                <h3 className="text-lg font-semibold text-white pr-8">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={`text-purple-400 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    size={24}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="px-6 pb-6 text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
