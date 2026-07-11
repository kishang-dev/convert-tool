import React, { useState } from 'react';
import Link from 'next/link';
import { FiTwitter, FiFacebook, FiLinkedin, FiInstagram } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '54px 24px 34px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 mb-8">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', display: 'grid', placeItems: 'center' }}>
                                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8L3 8Z" /><path d="M8 8 9.5 4h5L16 8" /></svg>
                            </div>
                            <span style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--text)' }}>ToolBasket<span style={{ color: 'var(--accent)' }}>AI</span></span>
                        </div>
                        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 300, margin: 0, fontFamily: '"Poppins", sans-serif' }}>
                            Your all-in-one online toolkit. Convert, merge, split and process PDFs, images and documents. All files are deleted within 1 hour.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 14px', color: 'var(--text)' }}>Core Tools</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { name: 'All Tools', path: '/#tb-tools' },
                                { name: 'AI Chart Maker', path: '/drowChart' },
                                { name: 'AI Resume Builder', path: '/resume-builder' },
                                { name: 'Precision OCR', path: '/ocr' },
                                { name: 'Merge PDF', path: '/merge-pdf' }
                            ].map(link => (
                                <Link href={link.path} key={link.name} style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">{link.name}</Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 14px', color: 'var(--text)' }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link href="/about" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">About Us</Link>
                            <Link href="/contact" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">Contact</Link>
                            <Link href="/blog" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">Blog</Link>
                            <Link href="/privacy" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">Privacy</Link>
                            <Link href="/terms" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">Terms</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: 14, margin: '0 0 14px', color: 'var(--text)' }}>Support</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link href="/contact" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">Help Center</Link>
                            {/* <Link href="#" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">System Status</Link> */}
                            <Link href="/contact" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">Suggest a Tool</Link>
                            <Link href="/contact" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }} className="hover:text-[var(--accent)] transition-colors">Report a Bug</Link>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: '"Poppins", sans-serif' }}>© 2026 ToolBasketAI. All rights reserved.</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, fontFamily: '"Poppins", sans-serif' }}>Show us some love</span>
                        <a href="#" aria-label="Twitter" className="hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}><FiTwitter size={15} /></a>
                        <a href="#" aria-label="Facebook" className="hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}><FiFacebook size={15} /></a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}><FiLinkedin size={15} /></a>
                        <a href="#" aria-label="Instagram" className="hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center' }}><FiInstagram size={15} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
