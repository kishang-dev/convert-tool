import React from 'react';
import { ResumeData } from '@/lib/api';

interface ResumeTemplateProps {
    data: ResumeData;
    template: string;
    primaryColor?: string;
}

const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&display=swap');
        @media print {
            .resume-page { box-shadow:none!important;margin:0!important;width:100%!important; }
            * { -webkit-print-color-adjust:exact!important;print-color-adjust:exact!important; }
        }
        .resume-page { -webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;background:white;overflow:hidden; }
        `
    }} />
);

// ─── Shared Micro-Components ─────────────────────────────────────────────────

const Dot = ({ color }: { color: string }) => (
    <span className="inline-block w-1.5 h-1.5 rounded-full mx-1 align-middle" style={{ background: color }} />
);

// ─── Template 1: MODERN PROFESSIONAL ─────────────────────────────────────────
// Two-column layout, colored top border, clean Inter typography
const T_Modern = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'DM Sans, sans-serif', borderTop: `6px solid ${c}` }}>
        <header className="px-14 pt-10 pb-8 flex justify-between items-end border-b border-gray-100">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
                <p className="text-sm font-medium mt-1" style={{ color: c }}>{data.experience[0]?.position}</p>
            </div>
            <div className="text-right text-[10px] text-gray-400 space-y-0.5">
                <div>{data.personalInfo.email}</div>
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.address}</div>
                {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
            </div>
        </header>
        <div className="flex px-14 py-8 gap-10">
            <main className="flex-1 space-y-7">
                <section>
                    <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3 text-gray-400">Profile</h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-4 text-gray-400">Experience</h2>
                    <div className="space-y-5">
                        {data.experience.map((e: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-semibold text-gray-800">{e.company}</span>
                                    <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                                </div>
                                <div className="text-[10px] font-medium mb-1" style={{ color: c }}>{e.position}</div>
                                <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-4 text-gray-400">Projects</h2>
                        <div className="space-y-3">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between"><span className="text-[11px] font-semibold text-gray-800">{p.name}</span><span className="text-[9px]" style={{ color: c }}>{p.link}</span></div>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <aside className="w-48 space-y-7">
                <section>
                    <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3 text-gray-400">Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[10px] font-semibold text-gray-800">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.startDate} – {e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3 text-gray-400">Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: `${c}40`, color: c, background: `${c}08` }}>{s}</span>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3 text-gray-400">Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="text-gray-700 font-medium">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3 text-gray-400">Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-semibold text-gray-700">{cert.name}</div>
                                <div className="text-[9px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3 text-gray-400">Interests</h2>
                        <p className="text-[10px] text-gray-500">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// ─── Template 2: CLASSIC SERIF ────────────────────────────────────────────────
// Centered header, Playfair Display, traditional dividers
const T_Classic = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-20 py-14" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
        <header className="text-center border-b-2 border-gray-800 pb-6 mb-8">
            <h1 className="text-5xl font-bold tracking-wide text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{data.personalInfo.fullName}</h1>
            <div className="flex justify-center flex-wrap gap-x-6 text-[11px] text-gray-500 mt-3">
                <span>{data.personalInfo.email}</span><span>·</span>
                <span>{data.personalInfo.phone}</span><span>·</span>
                <span>{data.personalInfo.address}</span>
                {data.personalInfo.linkedin && <><span>·</span><span>{data.personalInfo.linkedin}</span></>}
            </div>
        </header>
        <section className="mb-7">
            <h2 className="text-xs font-bold text-center uppercase tracking-[0.3em] text-gray-500 mb-3">Professional Summary</h2>
            <p className="text-[12px] text-gray-600 leading-relaxed text-center italic">{data.personalInfo.summary}</p>
        </section>
        <div className="border-t border-gray-200 pt-7 grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-7">
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 border-b border-gray-200 pb-1 mb-4">Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>{e.company}</h3>
                                <span className="text-[10px] text-gray-400 italic">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[11px] italic mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[11px] text-gray-600 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 border-b border-gray-200 pb-1 mb-4">Projects</h2>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-3">
                                <div className="text-[12px] font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>{p.name}</div>
                                <p className="text-[11px] text-gray-600 leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
            <div className="space-y-6">
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 border-b border-gray-200 pb-1 mb-4">Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-4">
                            <div className="text-[12px] font-bold text-gray-800">{e.school}</div>
                            <div className="text-[10px] italic text-gray-500">{e.degree}, {e.fieldOfStudy}</div>
                            <div className="text-[10px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 border-b border-gray-200 pb-1 mb-3">Skills</h2>
                    <div className="space-y-1">
                        {data.skills.map((s: string, i: number) => (
                            <div key={i} className="text-[11px] text-gray-600 flex items-center gap-2">
                                <span className="text-gray-300">◆</span>{s}
                            </div>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 border-b border-gray-200 pb-1 mb-3">Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="text-[11px] text-gray-600">{l.language} <span className="text-gray-400 italic">– {l.proficiency}</span></div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 border-b border-gray-200 pb-1 mb-3">Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2 text-[10px]">
                                <div className="font-bold text-gray-700">{cert.name}</div>
                                <div className="text-gray-400 italic">{cert.issuer}, {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 3: PREMIUM SIDEBAR ─────────────────────────────────────────────
// Dark sidebar with photo placeholder, elegant two-tone layout
const T_Elegant = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page flex" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <aside className="w-[240px] flex-shrink-0 flex flex-col" style={{ background: c }}>
            <div className="p-8 pb-6">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {data.personalInfo.fullName.charAt(0)}
                </div>
                <h1 className="text-xl font-bold text-white leading-tight">{data.personalInfo.fullName}</h1>
                <p className="text-[10px] text-white/70 mt-1 uppercase tracking-wider">{data.experience[0]?.position}</p>
            </div>
            <div className="px-8 py-5 bg-black/10 space-y-1">
                <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1">Contact</div>
                <div className="text-[10px] text-white/80">{data.personalInfo.email}</div>
                <div className="text-[10px] text-white/80">{data.personalInfo.phone}</div>
                <div className="text-[10px] text-white/80">{data.personalInfo.address}</div>
                {data.personalInfo.linkedin && <div className="text-[10px] text-white/80">{data.personalInfo.linkedin}</div>}
                {data.personalInfo.github && <div className="text-[10px] text-white/80">{data.personalInfo.github}</div>}
            </div>
            <div className="px-8 py-5 space-y-5">
                <div>
                    <div className="text-[9px] text-white/50 uppercase tracking-wider mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[8px] px-2 py-0.5 rounded bg-white/15 text-white font-medium">{s}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="text-[9px] text-white/50 uppercase tracking-wider mb-2">Education</div>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[10px] font-semibold text-white">{e.school}</div>
                            <div className="text-[9px] text-white/60">{e.degree}</div>
                            <div className="text-[9px] text-white/60">{e.fieldOfStudy}</div>
                            <div className="text-[9px] text-white/40">{e.endDate}</div>
                        </div>
                    ))}
                </div>
                {data.languages?.length > 0 && (
                    <div>
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-2">Languages</div>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[9px] text-white/80 mb-1">
                                <span>{l.language}</span><span className="text-white/40">{l.proficiency}</span>
                            </div>
                        ))}
                    </div>
                )}
                {data.interests?.length > 0 && (
                    <div>
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-2">Interests</div>
                        <p className="text-[9px] text-white/70 leading-relaxed">{data.interests.join(' · ')}</p>
                    </div>
                )}
            </div>
        </aside>
        <main className="flex-1 p-10 space-y-7 overflow-hidden">
            <section>
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: c }}>Profile</div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
            </section>
            <section>
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: c }}>Experience</div>
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-5 pl-4 border-l-2" style={{ borderColor: `${c}30` }}>
                        <div className="flex justify-between items-baseline">
                            <span className="text-[12px] font-bold text-gray-900">{e.company}</span>
                            <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] font-medium mb-1" style={{ color: c }}>{e.position}</div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                    </div>
                ))}
            </section>
            {data.projects?.length > 0 && (
                <section>
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: c }}>Projects</div>
                    <div className="grid grid-cols-2 gap-4">
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-[10px] font-bold text-gray-800">{p.name}</div>
                                <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.certifications?.length > 0 && (
                <section>
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: c }}>Certifications</div>
                    <div className="space-y-1.5">
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px]">
                                <span className="font-medium text-gray-700">{cert.name}</span>
                                <span className="text-gray-400">{cert.issuer} · {cert.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.awards?.length > 0 && (
                <section>
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: c }}>Awards</div>
                    <div className="space-y-1.5">
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px]">
                                <span className="font-medium text-gray-700">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    </div>
);

// ─── Template 4: CORPORATE EXECUTIVE ─────────────────────────────────────────
// Full-width colored header band, formal two-column body
const T_Executive = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Inter, sans-serif' }}>
        <header className="px-14 py-10" style={{ background: c }}>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">{data.personalInfo.fullName}</h1>
            <p className="text-white/70 text-sm font-medium mt-1 uppercase tracking-widest">{data.experience[0]?.position}</p>
            <div className="flex flex-wrap gap-x-8 mt-4 text-[10px] text-white/60">
                <span>{data.personalInfo.email}</span>
                <span>{data.personalInfo.phone}</span>
                <span>{data.personalInfo.address}</span>
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            </div>
        </header>
        <div className="flex gap-8 px-14 py-8">
            <main className="flex-1 space-y-7">
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-3" style={{ borderColor: c, color: c }}>Executive Summary</h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-4" style={{ borderColor: c, color: c }}>Professional Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-bold text-gray-900 text-[13px] uppercase tracking-tight">{e.company}</h3>
                                <span className="text-[9px] text-gray-400 font-medium">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{e.position}</div>
                            <p className="text-[10px] text-gray-600 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-4" style={{ borderColor: c, color: c }}>Key Projects</h2>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-3">
                                <div className="text-[11px] font-bold text-gray-800">{p.name}</div>
                                <p className="text-[10px] text-gray-500">{p.description}</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <aside className="w-52 space-y-6">
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-3" style={{ borderColor: c, color: c }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[10px] font-bold text-gray-800 uppercase">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}, {e.fieldOfStudy}</div>
                            <div className="text-[9px] text-gray-400">{e.startDate} – {e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-3" style={{ borderColor: c, color: c }}>Core Skills</h2>
                    {data.skills.map((s: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 mb-1.5">
                            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: c }} />
                            <span className="text-[10px] text-gray-600">{s}</span>
                        </div>
                    ))}
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-3" style={{ borderColor: c, color: c }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="font-medium text-gray-700">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-3" style={{ borderColor: c, color: c }}>Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[9px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-3" style={{ borderColor: c, color: c }}>Awards</h2>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{a.title}</div>
                                <div className="text-[9px] text-gray-400">{a.issuer} · {a.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.25em] border-b-2 pb-1 mb-3" style={{ borderColor: c, color: c }}>Interests</h2>
                        <p className="text-[10px] text-gray-500">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// ─── Template 5: MINIMALIST LUXE ─────────────────────────────────────────────
// Ultra-minimal, all lowercase labels, generous whitespace
const T_Minimalist = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-24 py-16" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <header className="mb-14">
            <h1 className="text-6xl font-extralight tracking-[0.05em] text-gray-800 mb-1">{data.personalInfo.fullName}</h1>
            <div className="h-px w-16 mb-4" style={{ background: c }} />
            <div className="flex gap-6 text-[10px] text-gray-400 tracking-wider">
                <span>{data.personalInfo.email}</span>
                <span>{data.personalInfo.phone}</span>
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            </div>
        </header>
        <div className="space-y-12">
            <section>
                <p className="text-[13px] font-light text-gray-500 leading-loose max-w-xl">{data.personalInfo.summary}</p>
            </section>
            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-7 space-y-10">
                    <section>
                        <div className="text-[8px] uppercase tracking-[0.35em] text-gray-300 mb-5 font-medium">experience</div>
                        {data.experience.map((e: any, i: number) => (
                            <div key={i} className="mb-7">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="text-[13px] font-medium text-gray-800">{e.company}</span>
                                    <span className="text-[9px] text-gray-300 tracking-wider">{e.startDate} – {e.endDate || 'now'}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 mb-2" style={{ color: c }}>{e.position}</div>
                                <p className="text-[10px] font-light text-gray-500 leading-loose">{e.description}</p>
                            </div>
                        ))}
                    </section>
                    {data.projects?.length > 0 && (
                        <section>
                            <div className="text-[8px] uppercase tracking-[0.35em] text-gray-300 mb-5 font-medium">projects</div>
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="mb-4">
                                    <span className="text-[12px] font-medium text-gray-700">{p.name}</span>
                                    <p className="text-[10px] font-light text-gray-400 mt-1 leading-loose">{p.description}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
                <div className="col-span-5 space-y-8">
                    <section>
                        <div className="text-[8px] uppercase tracking-[0.35em] text-gray-300 mb-4 font-medium">skills</div>
                        <div className="space-y-1.5">
                            {data.skills.map((s: string, i: number) => (
                                <div key={i} className="text-[11px] font-light text-gray-600 border-b border-gray-50 pb-1.5">{s}</div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="text-[8px] uppercase tracking-[0.35em] text-gray-300 mb-4 font-medium">education</div>
                        {data.education.map((e: any, i: number) => (
                            <div key={i} className="mb-4">
                                <div className="text-[11px] font-medium text-gray-700">{e.school}</div>
                                <div className="text-[10px] font-light text-gray-400">{e.degree}</div>
                                <div className="text-[9px] text-gray-300">{e.endDate}</div>
                            </div>
                        ))}
                    </section>
                    {data.languages?.length > 0 && (
                        <section>
                            <div className="text-[8px] uppercase tracking-[0.35em] text-gray-300 mb-4 font-medium">languages</div>
                            {data.languages.map((l: any, i: number) => (
                                <div key={i} className="flex justify-between text-[10px] mb-1.5 text-gray-500 font-light">
                                    <span>{l.language}</span><span className="text-gray-300">{l.proficiency}</span>
                                </div>
                            ))}
                        </section>
                    )}
                    {data.certifications?.length > 0 && (
                        <section>
                            <div className="text-[8px] uppercase tracking-[0.35em] text-gray-300 mb-4 font-medium">certifications</div>
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i} className="mb-2">
                                    <div className="text-[10px] font-light text-gray-600">{cert.name}</div>
                                    <div className="text-[9px] text-gray-300">{cert.issuer}</div>
                                </div>
                            ))}
                        </section>
                    )}
                    {data.interests?.length > 0 && (
                        <section>
                            <div className="text-[8px] uppercase tracking-[0.35em] text-gray-300 mb-4 font-medium">interests</div>
                            <p className="text-[10px] font-light text-gray-400 leading-loose">{data.interests.join('\n')}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// ─── Template 6: NEO-BRUTALISM ────────────────────────────────────────────────
// Thick black borders, raw typography, stark contrast
const T_Brutal = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Space Grotesk, sans-serif', border: '4px solid black' }}>
        <header style={{ background: c, borderBottom: '4px solid black' }} className="p-10">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{data.personalInfo.fullName}</h1>
            <div className="mt-3 flex gap-6 text-[11px] font-bold text-white uppercase tracking-wider">
                <span>{data.personalInfo.email}</span>
                <span>·</span><span>{data.personalInfo.phone}</span>
                <span>·</span><span>{data.personalInfo.address}</span>
            </div>
        </header>
        <div className="flex">
            <div style={{ borderRight: '4px solid black' }} className="w-[220px] flex-shrink-0">
                <div style={{ borderBottom: '3px solid black', background: 'black' }} className="p-4 text-white text-[9px] font-black uppercase tracking-widest">Skills</div>
                <div className="p-5 flex flex-wrap gap-2">
                    {data.skills.map((s: string, i: number) => (
                        <span key={i} style={{ border: '2px solid black' }} className="px-2 py-1 text-[9px] font-black uppercase">{s}</span>
                    ))}
                </div>
                <div style={{ borderTop: '3px solid black', borderBottom: '3px solid black', background: 'black' }} className="p-4 text-white text-[9px] font-black uppercase tracking-widest">Education</div>
                <div className="p-5 space-y-4">
                    {data.education.map((e: any, i: number) => (
                        <div key={i}>
                            <div className="text-[10px] font-black uppercase text-gray-900">{e.school}</div>
                            <div className="text-[9px] font-bold text-gray-600">{e.degree}</div>
                            <div className="text-[9px] text-gray-500">{e.endDate}</div>
                        </div>
                    ))}
                </div>
                {data.languages?.length > 0 && (
                    <>
                        <div style={{ borderTop: '3px solid black', borderBottom: '3px solid black', background: 'black' }} className="p-4 text-white text-[9px] font-black uppercase tracking-widest">Languages</div>
                        <div className="p-5 space-y-2">
                            {data.languages.map((l: any, i: number) => (
                                <div key={i} className="flex justify-between text-[10px] font-bold uppercase">
                                    <span>{l.language}</span><span className="text-gray-500">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {data.certifications?.length > 0 && (
                    <>
                        <div style={{ borderTop: '3px solid black', borderBottom: '3px solid black', background: 'black' }} className="p-4 text-white text-[9px] font-black uppercase tracking-widest">Certifications</div>
                        <div className="p-5 space-y-2">
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i}>
                                    <div className="text-[9px] font-black uppercase">{cert.name}</div>
                                    <div className="text-[8px] text-gray-500">{cert.issuer} · {cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {data.interests?.length > 0 && (
                    <>
                        <div style={{ borderTop: '3px solid black', borderBottom: '3px solid black', background: 'black' }} className="p-4 text-white text-[9px] font-black uppercase tracking-widest">Interests</div>
                        <div className="p-5">
                            <p className="text-[9px] font-bold text-gray-600 uppercase leading-loose">{data.interests.join(' / ')}</p>
                        </div>
                    </>
                )}
            </div>
            <div className="flex-1 p-8 space-y-6">
                <div style={{ border: '3px solid black' }} className="p-5">
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Summary</div>
                    <p className="text-[11px] font-medium text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
                </div>
                <div>
                    <div className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: c }}>Experience</div>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} style={{ borderLeft: `4px solid ${c}`, marginBottom: '20px' }} className="pl-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-black uppercase tracking-tight">{e.company}</span>
                                <span className="text-[9px] font-bold text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-bold mb-1.5 text-gray-500 uppercase">{e.position}</div>
                            <p className="text-[10px] text-gray-600 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </div>
                {data.projects?.length > 0 && (
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: c }}>Projects</div>
                        <div className="grid grid-cols-2 gap-3">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} style={{ border: '2px solid black' }} className="p-3">
                                    <div className="text-[10px] font-black uppercase mb-1">{p.name}</div>
                                    <p className="text-[9px] text-gray-600 leading-relaxed">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data.awards?.length > 0 && (
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: c }}>Awards</div>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] font-bold mb-1.5">
                                <span className="uppercase">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 7: VOGUE EDITORIAL ─────────────────────────────────────────────
// Magazine editorial style, large display typography, editorial feel
const T_Vogue = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-16 py-12" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
        <header className="mb-10 grid grid-cols-2 items-end" style={{ borderBottom: `3px solid ${c}`, paddingBottom: '24px' }}>
            <div>
                <div className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Curriculum Vitae</div>
                <h1 className="text-6xl font-bold italic leading-none text-gray-900">{data.personalInfo.fullName}</h1>
            </div>
            <div className="text-right" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                <p className="text-sm font-medium text-gray-600 mb-3">{data.experience[0]?.position}</p>
                <div className="text-[10px] text-gray-400 space-y-0.5">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                </div>
            </div>
        </header>
        <section className="mb-9 border-b border-gray-100 pb-9">
            <p className="text-[16px] italic font-normal text-gray-500 leading-loose text-center max-w-xl mx-auto">"{data.personalInfo.summary}"</p>
        </section>
        <div className="grid grid-cols-12 gap-10">
            <div className="col-span-8 space-y-9">
                <section>
                    <h2 className="text-[9px] uppercase tracking-[0.4em] mb-5 text-gray-400" style={{ fontFamily: 'DM Sans' }}>Career History</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-7 flex gap-6">
                            <div className="w-20 flex-shrink-0 text-right">
                                <div className="text-[9px] text-gray-400 leading-loose" style={{ fontFamily: 'DM Sans' }}>{e.startDate}</div>
                                <div className="text-[9px] text-gray-300" style={{ fontFamily: 'DM Sans' }}>—</div>
                                <div className="text-[9px] text-gray-400" style={{ fontFamily: 'DM Sans' }}>{e.endDate || 'Present'}</div>
                            </div>
                            <div className="flex-1 border-l border-gray-100 pl-6">
                                <h3 className="text-xl font-bold italic" style={{ color: c }}>{e.company}</h3>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2" style={{ fontFamily: 'DM Sans' }}>{e.position}</div>
                                <p className="text-[11px] text-gray-600 leading-relaxed" style={{ fontFamily: 'DM Sans' }}>{e.description}</p>
                            </div>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] uppercase tracking-[0.4em] mb-5 text-gray-400" style={{ fontFamily: 'DM Sans' }}>Featured Work</h2>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-5">
                                <h3 className="text-lg font-bold italic">{p.name}</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed mt-1" style={{ fontFamily: 'DM Sans' }}>{p.description}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
            <div className="col-span-4 space-y-8">
                <section>
                    <h2 className="text-[9px] uppercase tracking-[0.4em] mb-4 text-gray-400" style={{ fontFamily: 'DM Sans' }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-4">
                            <div className="text-sm font-bold italic">{e.school}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: 'DM Sans' }}>{e.degree}</div>
                            <div className="text-[9px] text-gray-400" style={{ fontFamily: 'DM Sans' }}>{e.fieldOfStudy} · {e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-[9px] uppercase tracking-[0.4em] mb-4 text-gray-400" style={{ fontFamily: 'DM Sans' }}>Expertise</h2>
                    <div className="space-y-1.5">
                        {data.skills.map((s: string, i: number) => (
                            <div key={i} className="text-[11px] italic text-gray-700 border-b border-gray-50 pb-1">{s}</div>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] uppercase tracking-[0.4em] mb-4 text-gray-400" style={{ fontFamily: 'DM Sans' }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[11px] mb-1">
                                <span className="italic">{l.language}</span>
                                <span className="text-[9px] text-gray-400" style={{ fontFamily: 'DM Sans' }}>{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] uppercase tracking-[0.4em] mb-4 text-gray-400" style={{ fontFamily: 'DM Sans' }}>Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[11px] italic">{cert.name}</div>
                                <div className="text-[9px] text-gray-400" style={{ fontFamily: 'DM Sans' }}>{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] uppercase tracking-[0.4em] mb-4 text-gray-400" style={{ fontFamily: 'DM Sans' }}>Passions</h2>
                        <p className="text-[11px] italic text-gray-600 leading-loose">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 8: DEVELOPER TERMINAL ──────────────────────────────────────────
// Monospace font, terminal-inspired dark header, code-style formatting
const T_Tech = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <header className="bg-gray-950 text-green-400 px-12 py-8">
            <div className="text-[9px] text-green-600 mb-1">$ whoami</div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: c }}>{data.personalInfo.fullName}</h1>
            <div className="text-[10px] text-green-600 mt-1"># {data.experience[0]?.position}</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[9px] text-gray-400">
                <span>email: <span className="text-green-400">{data.personalInfo.email}</span></span>
                <span>phone: <span className="text-green-400">{data.personalInfo.phone}</span></span>
                <span>location: <span className="text-green-400">{data.personalInfo.address}</span></span>
                {data.personalInfo.github && <span>github: <span className="text-green-400">{data.personalInfo.github}</span></span>}
            </div>
        </header>
        <div className="flex gap-0">
            <div className="flex-1 p-10 space-y-7">
                <section>
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: c }}>/** about */</div>
                    <p className="text-[11px] text-gray-600 leading-relaxed border-l-2 pl-4 border-gray-200">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-4" style={{ color: c }}>/** experience */</div>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between">
                                <span className="text-[12px] font-bold text-gray-800">{e.company}</span>
                                <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'present'}</span>
                            </div>
                            <div className="text-[10px] mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed pl-3 border-l border-gray-100">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-4" style={{ color: c }}>/** projects */</div>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-4 p-3 bg-gray-50 rounded border border-gray-100">
                                <div className="text-[10px] font-bold text-gray-800">{p.name}</div>
                                {p.link && <div className="text-[9px] text-gray-400 mb-1">{p.link}</div>}
                                <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                                {p.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {p.technologies.map((t: string, ti: number) => (
                                            <span key={ti} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: `${c}15`, color: c }}>{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}
            </div>
            <div className="w-52 bg-gray-50 border-l border-gray-100 p-6 space-y-6">
                <section>
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-3 text-gray-400">// skills</div>
                    {data.skills.map((s: string, i: number) => (
                        <div key={i} className="text-[9px] text-gray-600 py-0.5">
                            <span className="text-gray-300">→ </span>{s}
                        </div>
                    ))}
                </section>
                <section>
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-3 text-gray-400">// education</div>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[9px] font-bold text-gray-700">{e.school}</div>
                            <div className="text-[8px] text-gray-500">{e.degree}</div>
                            <div className="text-[8px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-3 text-gray-400">// languages</div>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="text-[9px] text-gray-600 mb-1">
                                {l.language}: <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-3 text-gray-400">// certs</div>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[8px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-3 text-gray-400">// awards</div>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[8px] font-bold text-gray-700">{a.title}</div>
                                <div className="text-[8px] text-gray-400">{a.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-3 text-gray-400">// interests</div>
                        <p className="text-[9px] text-gray-500">{data.interests.join(', ')}</p>
                    </section>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 9: VERTICAL TIMELINE ───────────────────────────────────────────
// Timeline left rail, Outfit font, visual timeline connecting experiences
const T_Timeline = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-14 py-12" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <header className="flex justify-between items-end mb-10 pb-6 border-b-2 border-gray-100">
            <div>
                <h1 className="text-5xl font-black tracking-tighter text-gray-900">{data.personalInfo.fullName}</h1>
                <p className="font-medium mt-1 text-sm" style={{ color: c }}>{data.experience[0]?.position}</p>
            </div>
            <div className="text-right text-[10px] text-gray-400 space-y-1">
                <div className="font-medium">{data.personalInfo.email}</div>
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.address}</div>
                {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
            </div>
        </header>
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-6" style={{ color: c }}>Experience</div>
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="flex gap-5 mb-7">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1" style={{ borderColor: c, background: i === 0 ? c : 'white' }} />
                            {i < data.experience.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: `${c}30` }} />}
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-black text-[13px] text-gray-900 uppercase">{e.company}</h3>
                                <span className="text-[9px] text-gray-400 font-medium">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-semibold mb-2" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    </div>
                ))}
                {data.projects?.length > 0 && (
                    <div className="mt-8">
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-5" style={{ color: c }}>Projects</div>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl border-2 border-gray-100">
                                    <div className="font-black text-[11px] uppercase text-gray-800 mb-1">{p.name}</div>
                                    <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                                    {p.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {p.technologies.slice(0, 3).map((t: string, ti: number) => (
                                                <span key={ti} className="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${c}10`, color: c }}>{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="col-span-4 space-y-6">
                <section>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: c }}>Summary</div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: c }}>Education</div>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-4 pl-3 border-l-2" style={{ borderColor: `${c}30` }}>
                            <div className="text-[10px] font-black text-gray-800 uppercase">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: c }}>Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[8px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: c }}>{s}</span>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Languages</div>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1 font-semibold">
                                <span className="text-gray-700">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Certifications</div>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Awards</div>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{a.title}</div>
                                <div className="text-[8px] text-gray-400">{a.issuer} · {a.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Interests</div>
                        <p className="text-[9px] text-gray-500">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 10: ACADEMIC FORMAL ────────────────────────────────────────────
// Traditional academic formatting, Crimson Pro, structured sections
const T_Formal = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-20 py-14" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">{data.personalInfo.fullName}</h1>
            <div className="text-[11px] text-gray-500 flex justify-center flex-wrap gap-x-4 mt-2">
                <span>{data.personalInfo.address}</span>
                <span>|</span><span>{data.personalInfo.phone}</span>
                <span>|</span><span>{data.personalInfo.email}</span>
                {data.personalInfo.linkedin && <><span>|</span><span>{data.personalInfo.linkedin}</span></>}
            </div>
        </header>
        <div className="space-y-6">
            <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-center text-gray-700 mb-1">PROFESSIONAL SUMMARY</h2>
                <div className="border-t-2 border-b border-gray-800 pt-2 pb-2 border-b-gray-200">
                    <p className="text-[12px] text-gray-600 text-center leading-relaxed">{data.personalInfo.summary}</p>
                </div>
            </section>
            <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 border-b-2 border-gray-800 pb-1 mb-4">PROFESSIONAL EXPERIENCE</h2>
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-5">
                        <div className="flex justify-between">
                            <div>
                                <span className="font-bold text-[14px]">{e.company}</span>
                                <span className="text-gray-500 text-[12px]"> — {e.position}</span>
                            </div>
                            <span className="text-[11px] text-gray-500 italic">{e.startDate} – {e.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 italic mb-1">{e.location}</div>
                        <p className="text-[12px] text-gray-700 leading-relaxed ml-4">{e.description}</p>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 border-b-2 border-gray-800 pb-1 mb-4">EDUCATION</h2>
                {data.education.map((e: any, i: number) => (
                    <div key={i} className="flex justify-between mb-3">
                        <div>
                            <span className="font-bold text-[14px]">{e.school}</span>
                            <span className="text-gray-500 text-[12px]"> — {e.degree} in {e.fieldOfStudy}</span>
                        </div>
                        <span className="text-[11px] text-gray-500 italic">{e.startDate} – {e.endDate}</span>
                    </div>
                ))}
            </section>
            <div className="grid grid-cols-2 gap-8">
                <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 border-b-2 border-gray-800 pb-1 mb-4">SKILLS</h2>
                    <p className="text-[12px] text-gray-700 leading-loose">{data.skills.join(', ')}</p>
                </section>
                <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 border-b-2 border-gray-800 pb-1 mb-4">LANGUAGES</h2>
                    {data.languages?.map((l: any, i: number) => (
                        <div key={i} className="text-[12px] text-gray-700">{l.language} ({l.proficiency})</div>
                    ))}
                </section>
            </div>
            {data.certifications?.length > 0 && (
                <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 border-b-2 border-gray-800 pb-1 mb-4">CERTIFICATIONS & AWARDS</h2>
                    <div className="grid grid-cols-2 gap-x-8">
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="flex justify-between text-[12px] mb-1">
                                <span>{cert.name}</span><span className="text-gray-500 italic">{cert.date}</span>
                            </div>
                        ))}
                        {data.awards?.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[12px] mb-1">
                                <span>{a.title}</span><span className="text-gray-500 italic">{a.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.projects?.length > 0 && (
                <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 border-b-2 border-gray-800 pb-1 mb-4">SELECTED PROJECTS</h2>
                    {data.projects.map((p: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="flex gap-2"><span className="font-bold text-[13px]">{p.name}.</span><span className="text-[12px] text-gray-600 italic">{p.link}</span></div>
                            <p className="text-[12px] text-gray-700 leading-relaxed ml-4">{p.description}</p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    </div>
);

// ─── Template 11: GRADIENT FLOW ──────────────────────────────────────────────
// Gradient header, modern card sections
const T_Gradient = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <header className="px-14 py-10 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c} 0%, ${c}88 100%)` }}>
            <div className="relative z-10">
                <h1 className="text-4xl font-black tracking-tight">{data.personalInfo.fullName}</h1>
                <p className="text-white/80 font-medium mt-1">{data.experience[0]?.position}</p>
                <p className="text-white/70 text-[11px] mt-3 max-w-lg leading-relaxed">{data.personalInfo.summary}</p>
                <div className="flex flex-wrap gap-6 mt-4 text-[10px] text-white/70">
                    <span>✉ {data.personalInfo.email}</span>
                    <span>☎ {data.personalInfo.phone}</span>
                    <span>⌖ {data.personalInfo.address}</span>
                    {data.personalInfo.linkedin && <span>in {data.personalInfo.linkedin}</span>}
                </div>
            </div>
        </header>
        <div className="flex gap-6 p-10">
            <main className="flex-1 space-y-7">
                <section>
                    <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[13px] text-gray-800">{e.company}</span>
                                <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-semibold mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Projects</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl" style={{ background: `${c}08`, border: `1px solid ${c}20` }}>
                                    <div className="font-bold text-[11px] text-gray-800 mb-1">{p.name}</div>
                                    <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Awards</h2>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-semibold text-gray-700">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <aside className="w-52 space-y-6">
                <section>
                    <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[10px] font-bold text-gray-800">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[8px] px-2 py-0.5 rounded font-medium" style={{ background: `${c}15`, color: c }}>{s}</span>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-3 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="text-gray-700">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-3 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.3em] mb-3 pb-1 border-b-2" style={{ color: c, borderColor: `${c}30` }}>Interests</h2>
                        <p className="text-[9px] text-gray-500">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// ─── Template 12: DEEP SLATE DARK ────────────────────────────────────────────
// Dark left sidebar, dark section headers
const T_Slate = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page flex" style={{ fontFamily: 'Inter, sans-serif' }}>
        <aside className="w-[230px] bg-slate-800 text-white p-8 flex flex-col gap-7">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tight leading-tight">{data.personalInfo.fullName}</h1>
                <div className="h-0.5 w-8 mt-2 mb-2" style={{ background: c }} />
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">{data.experience[0]?.position}</p>
            </div>
            <div className="space-y-2">
                <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-2">Contact</div>
                <div className="text-[10px] text-slate-300 leading-loose">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                    {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                    {data.personalInfo.github && <div>{data.personalInfo.github}</div>}
                </div>
            </div>
            <div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-3">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((s: string, i: number) => (
                        <span key={i} className="text-[8px] px-2 py-0.5 rounded text-slate-200 font-medium" style={{ background: `${c}30`, border: `1px solid ${c}40` }}>{s}</span>
                    ))}
                </div>
            </div>
            <div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-3">Education</div>
                {data.education.map((e: any, i: number) => (
                    <div key={i} className="mb-3">
                        <div className="text-[10px] font-bold text-slate-200">{e.school}</div>
                        <div className="text-[9px] text-slate-400">{e.degree}</div>
                        <div className="text-[8px] text-slate-500">{e.endDate}</div>
                    </div>
                ))}
            </div>
            {data.languages?.length > 0 && (
                <div>
                    <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-3">Languages</div>
                    {data.languages.map((l: any, i: number) => (
                        <div key={i} className="flex justify-between text-[9px] mb-1">
                            <span className="text-slate-300">{l.language}</span>
                            <span className="text-slate-500">{l.proficiency}</span>
                        </div>
                    ))}
                </div>
            )}
            {data.certifications?.length > 0 && (
                <div>
                    <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-3">Certifications</div>
                    {data.certifications.map((cert: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="text-[9px] font-bold text-slate-300">{cert.name}</div>
                            <div className="text-[8px] text-slate-500">{cert.issuer} · {cert.date}</div>
                        </div>
                    ))}
                </div>
            )}
            {data.interests?.length > 0 && (
                <div>
                    <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-2">Interests</div>
                    <p className="text-[9px] text-slate-400 leading-loose">{data.interests.join(' · ')}</p>
                </div>
            )}
        </aside>
        <main className="flex-1 p-10 space-y-7">
            <section>
                <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2 text-slate-400">About</h2>
                <div className="h-0.5 w-full bg-slate-100 mb-3" />
                <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
            </section>
            <section>
                <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2 text-slate-400">Experience</h2>
                <div className="h-0.5 w-full bg-slate-100 mb-4" />
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-5">
                        <div className="flex justify-between items-baseline">
                            <span className="font-black text-[13px] text-slate-800 uppercase tracking-tight">{e.company}</span>
                            <span className="text-[9px] text-slate-400">{e.startDate} – {e.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] font-semibold mb-1" style={{ color: c }}>{e.position}</div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                    </div>
                ))}
            </section>
            {data.projects?.length > 0 && (
                <section>
                    <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2 text-slate-400">Projects</h2>
                    <div className="h-0.5 w-full bg-slate-100 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="text-[10px] font-bold text-slate-700 mb-1">{p.name}</div>
                                <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.awards?.length > 0 && (
                <section>
                    <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2 text-slate-400">Awards</h2>
                    <div className="h-0.5 w-full bg-slate-100 mb-4" />
                    {data.awards.map((a: any, i: number) => (
                        <div key={i} className="flex justify-between text-[10px] mb-1.5">
                            <span className="font-semibold text-slate-700">{a.title}</span>
                            <span className="text-slate-400">{a.issuer} · {a.date}</span>
                        </div>
                    ))}
                </section>
            )}
        </main>
    </div>
);

// ─── Template 13: BOLD ACCENT SIDEBAR ────────────────────────────────────────
// Bold colored top-left name block, strong visual hierarchy
const T_Accent = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <div className="flex h-full">
            <div className="w-[280px] flex-shrink-0">
                <div className="p-8 pb-6" style={{ background: c }}>
                    <h1 className="text-3xl font-black text-white tracking-tighter leading-tight">{data.personalInfo.fullName}</h1>
                    <p className="text-[10px] text-white/75 mt-2 uppercase tracking-widest font-medium">{data.experience[0]?.position}</p>
                </div>
                <div className="bg-gray-900 p-8 space-y-6">
                    <div>
                        <div className="text-[8px] uppercase tracking-widest font-black mb-2" style={{ color: c }}>Contact</div>
                        <div className="text-[10px] text-gray-300 space-y-1">
                            <div>{data.personalInfo.email}</div>
                            <div>{data.personalInfo.phone}</div>
                            <div>{data.personalInfo.address}</div>
                            {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                        </div>
                    </div>
                    <div>
                        <div className="text-[8px] uppercase tracking-widest font-black mb-3" style={{ color: c }}>Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                            {data.skills.map((s: string, i: number) => (
                                <span key={i} className="text-[8px] px-2 py-0.5 bg-white/10 text-gray-200 rounded font-medium">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-[8px] uppercase tracking-widest font-black mb-3" style={{ color: c }}>Education</div>
                        {data.education.map((e: any, i: number) => (
                            <div key={i} className="mb-3">
                                <div className="text-[10px] font-bold text-white">{e.school}</div>
                                <div className="text-[9px] text-gray-400">{e.degree}, {e.fieldOfStudy}</div>
                                <div className="text-[8px] text-gray-500">{e.endDate}</div>
                            </div>
                        ))}
                    </div>
                    {data.languages?.length > 0 && (
                        <div>
                            <div className="text-[8px] uppercase tracking-widest font-black mb-3" style={{ color: c }}>Languages</div>
                            {data.languages.map((l: any, i: number) => (
                                <div key={i} className="flex justify-between text-[9px] mb-1">
                                    <span className="text-gray-300">{l.language}</span>
                                    <span className="text-gray-500">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.certifications?.length > 0 && (
                        <div>
                            <div className="text-[8px] uppercase tracking-widest font-black mb-3" style={{ color: c }}>Certifications</div>
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i} className="mb-2">
                                    <div className="text-[9px] font-bold text-gray-200">{cert.name}</div>
                                    <div className="text-[8px] text-gray-500">{cert.date}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.interests?.length > 0 && (
                        <div>
                            <div className="text-[8px] uppercase tracking-widest font-black mb-2" style={{ color: c }}>Interests</div>
                            <p className="text-[9px] text-gray-400 leading-loose">{data.interests.join(' · ')}</p>
                        </div>
                    )}
                </div>
            </div>
            <main className="flex-1 p-10 space-y-7">
                <section>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c }} />
                        <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">About Me</h2>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c }} />
                        <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Work Experience</h2>
                    </div>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <span className="font-black text-[13px] text-gray-800 uppercase">{e.company}</span>
                                <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-semibold mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c }} />
                            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Projects</h2>
                        </div>
                        <div className="space-y-3">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-1 rounded-full flex-shrink-0" style={{ background: `${c}40` }} />
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-800">{p.name}</div>
                                        <p className="text-[10px] text-gray-500 leading-relaxed">{p.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c }} />
                            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Awards & Honors</h2>
                        </div>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-semibold text-gray-700">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    </div>
);

// ─── Template 14: SWISS DESIGN ───────────────────────────────────────────────
// Strict grid, International Typographic Style, red accent
const T_Clean = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <header className="bg-black px-12 py-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-white leading-none tracking-tighter">{data.personalInfo.fullName.split(' ')[0]}</h1>
                    <h1 className="text-5xl font-black leading-none tracking-tighter" style={{ color: c }}>{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
                </div>
                <div className="text-right text-[10px] text-gray-400 space-y-0.5">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                    {data.personalInfo.linkedin && <div className="text-white/50">{data.personalInfo.linkedin}</div>}
                </div>
            </div>
        </header>
        <div className="flex">
            <div className="flex-1 p-10 border-r border-gray-100 space-y-8">
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Profile</h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: c }}>Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5">
                            <div className="grid grid-cols-4">
                                <div className="col-span-3">
                                    <h3 className="font-black text-sm text-gray-900 uppercase">{e.company}</h3>
                                    <div className="text-[10px] font-medium text-gray-500">{e.position}</div>
                                </div>
                                <div className="text-right text-[9px] text-gray-400">{e.startDate}<br />{e.endDate || 'Present'}</div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: c }}>Projects</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="border-l-4 pl-3" style={{ borderColor: c }}>
                                    <div className="text-[11px] font-black uppercase">{p.name}</div>
                                    <p className="text-[9px] text-gray-500 mt-1">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <aside className="w-52 p-8 space-y-6">
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[10px] font-black uppercase">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Skills</h2>
                    <div className="space-y-1">
                        {data.skills.map((s: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] text-gray-600">
                                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: c }} />
                                {s}
                            </div>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="text-gray-700">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Awards</h2>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{a.title}</div>
                                <div className="text-[8px] text-gray-400">{a.issuer} · {a.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Interests</h2>
                        <p className="text-[9px] text-gray-500 leading-loose">{data.interests.join(' / ')}</p>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// ─── Template 15: MONOCHROME MASTERY ─────────────────────────────────────────
// Pure B&W, no color, strict typographic hierarchy, Bebas Neue headers
const T_Monochrome = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-16 py-12" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <header className="mb-10">
            <h1 className="text-7xl font-black tracking-tighter text-gray-900 leading-none uppercase" style={{ fontFamily: 'Bebas Neue, Outfit, sans-serif' }}>{data.personalInfo.fullName}</h1>
            <div className="flex items-center gap-0 mt-3">
                <div className="h-px flex-1 bg-gray-900" />
                <div className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-600">{data.experience[0]?.position}</div>
                <div className="h-px flex-1 bg-gray-900" />
            </div>
            <div className="flex flex-wrap gap-6 mt-3 text-[10px] text-gray-500">
                <span>{data.personalInfo.email}</span>
                <span>{data.personalInfo.phone}</span>
                <span>{data.personalInfo.address}</span>
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            </div>
        </header>
        <p className="text-sm text-gray-600 leading-relaxed mb-10 border-l-4 border-gray-200 pl-4">{data.personalInfo.summary}</p>
        <div className="grid grid-cols-12 gap-10">
            <div className="col-span-8 space-y-8">
                <section>
                    <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900 border-b-2 border-gray-900 pb-1 mb-5" style={{ fontFamily: 'Bebas Neue, Outfit' }}>Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5 grid grid-cols-4">
                            <div className="col-span-1 text-right pr-4 pt-0.5">
                                <div className="text-[9px] text-gray-400 uppercase leading-loose">{e.startDate}</div>
                                <div className="text-[9px] text-gray-400">–</div>
                                <div className="text-[9px] text-gray-400">{e.endDate || 'now'}</div>
                            </div>
                            <div className="col-span-3 border-l-2 border-gray-200 pl-4">
                                <h3 className="font-black text-gray-900 text-sm uppercase">{e.company}</h3>
                                <div className="text-[10px] text-gray-500 font-medium mb-1">{e.position}</div>
                                <p className="text-[10px] text-gray-600 leading-relaxed">{e.description}</p>
                            </div>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900 border-b-2 border-gray-900 pb-1 mb-5" style={{ fontFamily: 'Bebas Neue, Outfit' }}>Projects</h2>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-4 grid grid-cols-4">
                                <div className="col-span-1 text-right pr-4">
                                    <div className="text-[9px] text-gray-400 uppercase">{i + 1 < 10 ? '0' : ''}{i + 1}</div>
                                </div>
                                <div className="col-span-3 border-l-2 border-gray-200 pl-4">
                                    <div className="font-black text-[12px] uppercase">{p.name}</div>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{p.description}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
            <div className="col-span-4 space-y-7">
                <section>
                    <h2 className="text-lg font-black tracking-tighter uppercase border-b-2 border-gray-900 pb-1 mb-4" style={{ fontFamily: 'Bebas Neue, Outfit' }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[11px] font-black uppercase">{e.school}</div>
                            <div className="text-[10px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-lg font-black tracking-tighter uppercase border-b-2 border-gray-900 pb-1 mb-4" style={{ fontFamily: 'Bebas Neue, Outfit' }}>Skills</h2>
                    {data.skills.map((s: string, i: number) => (
                        <div key={i} className="text-[10px] text-gray-700 border-b border-gray-100 py-1">{s}</div>
                    ))}
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-lg font-black tracking-tighter uppercase border-b-2 border-gray-900 pb-1 mb-4" style={{ fontFamily: 'Bebas Neue, Outfit' }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="font-medium">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-lg font-black tracking-tighter uppercase border-b-2 border-gray-900 pb-1 mb-4" style={{ fontFamily: 'Bebas Neue, Outfit' }}>Certs</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-black uppercase">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {(data.awards?.length > 0 || data.interests?.length > 0) && (
                    <section>
                        <h2 className="text-lg font-black tracking-tighter uppercase border-b-2 border-gray-900 pb-1 mb-4" style={{ fontFamily: 'Bebas Neue, Outfit' }}>More</h2>
                        {data.awards?.map((a: any, i: number) => (
                            <div key={i} className="text-[9px] text-gray-700 mb-1 font-bold uppercase">{a.title}</div>
                        ))}
                        {data.interests && <p className="text-[9px] text-gray-400 mt-2 leading-loose">{data.interests.join(' · ')}</p>}
                    </section>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 16: COMPACT DENSE ──────────────────────────────────────────────
// Maximum information density, smaller fonts, efficient use of space
const T_Compact = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-12 py-10" style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px' }}>
        <header className="mb-6 pb-4 border-b-2" style={{ borderColor: c }}>
            <div className="flex justify-between items-baseline">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
                <div className="flex gap-4 text-[9px] text-gray-500">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.address}</span>
                </div>
            </div>
            <div className="flex gap-4 mt-1 text-[9px] text-gray-400">
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
            </div>
        </header>
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-5">
                <section>
                    <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-2" style={{ color: c, borderColor: `${c}30` }}>Summary</h2>
                    <p className="text-[10px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-3" style={{ color: c, borderColor: `${c}30` }}>Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-[11px] text-gray-800">{e.company}</span>
                                    <span className="text-[9px] text-gray-500">— {e.position}</span>
                                </div>
                                <span className="text-[8px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-3" style={{ color: c, borderColor: `${c}30` }}>Projects</h2>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-2 flex gap-2">
                                <span className="font-bold text-[10px] text-gray-800 flex-shrink-0">{p.name}:</span>
                                <span className="text-[10px] text-gray-500">{p.description}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-2" style={{ color: c, borderColor: `${c}30` }}>Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="text-[10px] text-gray-600 mb-0.5"><span className="font-bold">{cert.name}</span> — {cert.issuer}, {cert.date}</div>
                        ))}
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-2" style={{ color: c, borderColor: `${c}30` }}>Awards</h2>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="text-[10px] text-gray-600 mb-0.5"><span className="font-bold">{a.title}</span> — {a.issuer}, {a.date}</div>
                        ))}
                    </section>
                )}
            </div>
            <div className="col-span-4 space-y-5">
                <section>
                    <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-2" style={{ color: c, borderColor: `${c}30` }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="font-bold text-[10px] text-gray-800">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}, {e.fieldOfStudy}</div>
                            <div className="text-[9px] text-gray-400">{e.startDate} – {e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-2" style={{ color: c, borderColor: `${c}30` }}>Technical Skills</h2>
                    <p className="text-[10px] text-gray-600 leading-loose">{data.skills.join(' · ')}</p>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-2" style={{ color: c, borderColor: `${c}30` }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="text-[10px] text-gray-600 mb-0.5">{l.language} — <span className="text-gray-400">{l.proficiency}</span></div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="font-black uppercase tracking-[0.25em] text-[8px] pb-0.5 border-b mb-2" style={{ color: c, borderColor: `${c}30` }}>Interests</h2>
                        <p className="text-[10px] text-gray-500 leading-loose">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 17: BOLD IMPACT HIGH-CONTRAST ──────────────────────────────────
// Giant name as background watermark, high contrast
const T_Bold = ({ data, primaryColor: c }: any) => (
    <div className="bg-gray-950 w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <header className="px-12 pt-10 pb-8 relative overflow-hidden">
            <div className="absolute top-4 right-0 text-[120px] font-black text-white/3 leading-none select-none pointer-events-none uppercase tracking-tighter">
                {data.personalInfo.fullName.split(' ')[0]}
            </div>
            <div className="relative z-10">
                <h1 className="text-5xl font-black text-white leading-none">{data.personalInfo.fullName}</h1>
                <p className="text-sm font-medium mt-1" style={{ color: c }}>{data.experience[0]?.position}</p>
                <div className="flex flex-wrap gap-5 mt-4 text-[10px] text-gray-500">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.address}</span>
                </div>
            </div>
        </header>
        <div className="px-12 pb-12">
            <p className="text-[11px] text-gray-400 leading-relaxed mb-8 pb-8 border-b border-white/10">{data.personalInfo.summary}</p>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-5" style={{ color: c }}>Work Experience</h2>
                        {data.experience.map((e: any, i: number) => (
                            <div key={i} className="mb-6 pl-4" style={{ borderLeft: `2px solid ${c}` }}>
                                <div className="flex justify-between">
                                    <span className="font-black text-white text-sm uppercase">{e.company}</span>
                                    <span className="text-[9px] text-gray-500">{e.startDate} – {e.endDate || 'Present'}</span>
                                </div>
                                <div className="text-[10px] font-semibold mb-2 text-gray-400">{e.position}</div>
                                <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                            </div>
                        ))}
                    </section>
                    {data.projects?.length > 0 && (
                        <section>
                            <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-5" style={{ color: c }}>Projects</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.projects.map((p: any, i: number) => (
                                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div className="text-[10px] font-black text-white uppercase mb-1">{p.name}</div>
                                        <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.awards?.length > 0 && (
                        <section>
                            <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-4" style={{ color: c }}>Awards</h2>
                            {data.awards.map((a: any, i: number) => (
                                <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                    <span className="font-bold text-white">{a.title}</span>
                                    <span className="text-gray-500">{a.issuer} · {a.date}</span>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
                <div className="col-span-4 space-y-6">
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-4" style={{ color: c }}>Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((s: string, i: number) => (
                                <span key={i} className="text-[8px] px-2 py-0.5 rounded text-white font-bold" style={{ background: `${c}20`, border: `1px solid ${c}40` }}>{s}</span>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-4" style={{ color: c }}>Education</h2>
                        {data.education.map((e: any, i: number) => (
                            <div key={i} className="mb-3">
                                <div className="text-[10px] font-bold text-white">{e.school}</div>
                                <div className="text-[9px] text-gray-400">{e.degree}</div>
                                <div className="text-[9px] text-gray-500">{e.endDate}</div>
                            </div>
                        ))}
                    </section>
                    {data.languages?.length > 0 && (
                        <section>
                            <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Languages</h2>
                            {data.languages.map((l: any, i: number) => (
                                <div key={i} className="flex justify-between text-[10px] mb-1">
                                    <span className="text-gray-300">{l.language}</span>
                                    <span className="text-gray-500">{l.proficiency}</span>
                                </div>
                            ))}
                        </section>
                    )}
                    {data.certifications?.length > 0 && (
                        <section>
                            <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Certifications</h2>
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i} className="mb-2">
                                    <div className="text-[9px] font-bold text-gray-300">{cert.name}</div>
                                    <div className="text-[8px] text-gray-500">{cert.date}</div>
                                </div>
                            ))}
                        </section>
                    )}
                    {data.interests?.length > 0 && (
                        <section>
                            <h2 className="font-black text-[9px] uppercase tracking-[0.4em] mb-3" style={{ color: c }}>Interests</h2>
                            <p className="text-[9px] text-gray-500">{data.interests.join(' · ')}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// ─── Template 18: ORGANIC SOFT-UI ────────────────────────────────────────────
// Rounded corners, soft backgrounds, gentle card-based layout
const T_Soft = ({ data, primaryColor: c }: any) => (
    <div className="w-[794px] min-h-[1123px] resume-page p-10" style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8f7f5' }}>
        <div className="rounded-3xl bg-white shadow-sm p-10 mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{data.personalInfo.fullName}</h1>
                    <p className="font-medium mt-1" style={{ color: c }}>{data.experience[0]?.position}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-2 max-w-lg">{data.personalInfo.summary}</p>
                </div>
                <div className="text-right text-[10px] text-gray-400 space-y-1 flex-shrink-0 ml-6">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                    {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                </div>
            </div>
        </div>
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-8 space-y-5">
                <div className="rounded-2xl bg-white shadow-sm p-7">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b border-gray-100" style={{ color: c }}>Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5 last:mb-0">
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[13px] text-gray-800">{e.company}</span>
                                <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-medium mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </div>
                {data.projects?.length > 0 && (
                    <div className="rounded-2xl bg-white shadow-sm p-7">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b border-gray-100" style={{ color: c }}>Projects</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="rounded-xl p-3" style={{ background: `${c}08` }}>
                                    <div className="text-[10px] font-bold text-gray-800 mb-1">{p.name}</div>
                                    <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {(data.certifications?.length > 0 || data.awards?.length > 0) && (
                    <div className="rounded-2xl bg-white shadow-sm p-7">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b border-gray-100" style={{ color: c }}>Achievements</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.certifications?.map((cert: any, i: number) => (
                                <div key={i} className="p-3 rounded-xl bg-gray-50">
                                    <div className="text-[10px] font-bold text-gray-700">{cert.name}</div>
                                    <div className="text-[9px] text-gray-400">{cert.issuer} · {cert.date}</div>
                                </div>
                            ))}
                            {data.awards?.map((a: any, i: number) => (
                                <div key={i} className="p-3 rounded-xl bg-gray-50">
                                    <div className="text-[10px] font-bold text-gray-700">{a.title}</div>
                                    <div className="text-[9px] text-gray-400">{a.issuer} · {a.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="col-span-4 space-y-5">
                <div className="rounded-2xl bg-white shadow-sm p-6">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b border-gray-100" style={{ color: c }}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[9px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${c}12`, color: c }}>{s}</span>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl bg-white shadow-sm p-6">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b border-gray-100" style={{ color: c }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3 last:mb-0">
                            <div className="text-[10px] font-bold text-gray-800">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </div>
                {data.languages?.length > 0 && (
                    <div className="rounded-2xl bg-white shadow-sm p-6">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b border-gray-100" style={{ color: c }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-medium text-gray-700">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </div>
                )}
                {data.interests?.length > 0 && (
                    <div className="rounded-2xl bg-white shadow-sm p-6">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b border-gray-100" style={{ color: c }}>Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map((interest: string, i: number) => (
                                <span key={i} className="text-[9px] px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600">{interest}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// ─── Template 19: METRO GRID-SYNC ────────────────────────────────────────────
// Colored rectangles for section titles, grid-aligned layout
const T_Metro = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        <header className="grid grid-cols-12">
            <div className="col-span-8 p-10 pb-6" style={{ background: c }}>
                <h1 className="text-5xl font-black text-white tracking-tight leading-none">{data.personalInfo.fullName}</h1>
                <p className="text-white/70 text-sm mt-2 font-medium uppercase tracking-wider">{data.experience[0]?.position}</p>
            </div>
            <div className="col-span-4 bg-gray-900 p-8 flex flex-col justify-center">
                <div className="text-[9px] text-gray-400 space-y-1.5">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                    {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                </div>
            </div>
        </header>
        <div className="grid grid-cols-12">
            <main className="col-span-8 p-10 space-y-7 border-r border-gray-100">
                <section>
                    <div className="flex items-center gap-0 mb-4">
                        <div className="px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest" style={{ background: c }}>Profile</div>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <div className="flex items-center gap-0 mb-4">
                        <div className="px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest" style={{ background: c }}>Experience</div>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <span className="font-black text-sm text-gray-800 uppercase">{e.company}</span>
                                <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-medium mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-0 mb-4">
                            <div className="px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest" style={{ background: c }}>Projects</div>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="border-t-2 pt-2" style={{ borderColor: c }}>
                                    <div className="font-black text-[11px] uppercase text-gray-800">{p.name}</div>
                                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-0 mb-4">
                            <div className="px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest" style={{ background: c }}>Awards</div>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-bold text-gray-800">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <aside className="col-span-4 p-8 space-y-6">
                <section>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 inline-block mb-3" style={{ background: c }}>Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 font-medium border" style={{ borderColor: `${c}40`, color: c }}>{s}</span>
                        ))}
                    </div>
                </section>
                <section>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 inline-block mb-3" style={{ background: c }}>Education</div>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[10px] font-black uppercase text-gray-800">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 inline-block mb-3" style={{ background: c }}>Languages</div>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="font-medium text-gray-700">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 inline-block mb-3" style={{ background: c }}>Certifications</div>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <div className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 inline-block mb-3" style={{ background: c }}>Interests</div>
                        <p className="text-[9px] text-gray-500">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// ─── Template 20: AIRY MINIMAL RIGHT-SIDEBAR ─────────────────────────────────
const T_AiryMinimal = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page flex" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <main className="flex-1 p-12 space-y-8">
            <header>
                <h1 className="text-5xl font-thin text-gray-900 tracking-wide">{data.personalInfo.fullName}</h1>
                <div className="w-12 h-0.5 my-3" style={{ background: c }} />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">{data.experience[0]?.position}</p>
            </header>
            <section>
                <p className="text-[12px] text-gray-500 leading-loose font-light">{data.personalInfo.summary}</p>
            </section>
            <section>
                <h2 className="text-[8px] uppercase tracking-[0.4em] text-gray-300 mb-5">Work History</h2>
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-6">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <span className="text-[14px] font-semibold text-gray-800">{e.company}</span>
                            <span className="text-[9px] text-gray-300 tracking-wider">{e.startDate} – {e.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] mb-2 font-medium" style={{ color: c }}>{e.position}</div>
                        <p className="text-[10px] text-gray-500 leading-loose font-light">{e.description}</p>
                    </div>
                ))}
            </section>
            {data.projects?.length > 0 && (
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.4em] text-gray-300 mb-5">Projects</h2>
                    {data.projects.map((p: any, i: number) => (
                        <div key={i} className="mb-4">
                            <span className="text-[13px] font-semibold text-gray-700">{p.name}</span>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-light leading-loose">{p.description}</p>
                        </div>
                    ))}
                </section>
            )}
        </main>
        <aside className="w-[200px] bg-gray-50 p-8 space-y-7 border-l border-gray-100">
            <div className="text-[10px] text-gray-500 space-y-1.5">
                <div>{data.personalInfo.email}</div>
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.address}</div>
                {data.personalInfo.linkedin && <div className="text-gray-400">{data.personalInfo.linkedin}</div>}
            </div>
            <section>
                <h2 className="text-[8px] uppercase tracking-[0.4em] text-gray-300 mb-4">Education</h2>
                {data.education.map((e: any, i: number) => (
                    <div key={i} className="mb-3">
                        <div className="text-[10px] font-semibold text-gray-700">{e.school}</div>
                        <div className="text-[9px] text-gray-400 font-light">{e.degree}</div>
                        <div className="text-[9px] text-gray-300">{e.endDate}</div>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="text-[8px] uppercase tracking-[0.4em] text-gray-300 mb-4">Skills</h2>
                <div className="space-y-1.5">
                    {data.skills.map((s: string, i: number) => (
                        <div key={i} className="text-[10px] text-gray-500 font-light border-b border-gray-100 pb-1">{s}</div>
                    ))}
                </div>
            </section>
            {data.languages?.length > 0 && (
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.4em] text-gray-300 mb-4">Languages</h2>
                    {data.languages.map((l: any, i: number) => (
                        <div key={i} className="text-[10px] text-gray-500 font-light mb-1">{l.language} — {l.proficiency}</div>
                    ))}
                </section>
            )}
            {data.certifications?.length > 0 && (
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.4em] text-gray-300 mb-4">Certifications</h2>
                    {data.certifications.map((cert: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="text-[9px] text-gray-600 font-medium">{cert.name}</div>
                            <div className="text-[8px] text-gray-400">{cert.date}</div>
                        </div>
                    ))}
                </section>
            )}
            {(data.awards?.length > 0 || data.interests?.length > 0) && (
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.4em] text-gray-300 mb-4">More</h2>
                    {data.awards?.map((a: any, i: number) => (
                        <div key={i} className="text-[9px] text-gray-500 font-medium mb-1">{a.title}</div>
                    ))}
                    {data.interests && <p className="text-[9px] text-gray-400 font-light mt-2 leading-loose">{data.interests.join(' · ')}</p>}
                </section>
            )}
        </aside>
    </div>
);

// ─── Templates 21–30: Additional unique variants ──────────────────────────────

// 21. TRADITIONAL CLEAN – Single column, border line sections
const T_TraditionalClean = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-16 py-12" style={{ fontFamily: 'Lora, Georgia, serif' }}>
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">{data.personalInfo.fullName}</h1>
            <div className="flex justify-center flex-wrap gap-x-4 text-[10px] text-gray-500 mt-1">
                <span>{data.personalInfo.address}</span>
                <span>•</span><span>{data.personalInfo.phone}</span>
                <span>•</span><span>{data.personalInfo.email}</span>
                {data.personalInfo.linkedin && <><span>•</span><span>{data.personalInfo.linkedin}</span></>}
            </div>
        </header>
        {[
            { title: 'SUMMARY', content: <p className="text-[12px] text-gray-600 leading-relaxed text-justify">{data.personalInfo.summary}</p> },
            {
                title: 'EXPERIENCE', content: data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-4">
                        <div className="flex justify-between"><span className="font-bold text-[13px]">{e.company}</span><span className="text-[11px] italic text-gray-500">{e.startDate} – {e.endDate || 'Present'}</span></div>
                        <div className="italic text-[11px] mb-1" style={{ color: c }}>{e.position}, {e.location}</div>
                        <p className="text-[12px] text-gray-700 leading-relaxed">{e.description}</p>
                    </div>
                ))
            },
            {
                title: 'EDUCATION', content: data.education.map((e: any, i: number) => (
                    <div key={i} className="flex justify-between mb-2">
                        <div><span className="font-bold text-[13px]">{e.school}</span> <span className="text-[12px] text-gray-600">– {e.degree} in {e.fieldOfStudy}</span></div>
                        <span className="text-[11px] italic text-gray-500">{e.endDate}</span>
                    </div>
                ))
            },
        ].map(({ title, content }, si) => (
            <section key={si} className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-px bg-gray-400" />
                    <h2 className="text-[10px] font-bold tracking-[0.35em] text-gray-700">{title}</h2>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>
                {content}
            </section>
        ))}
        <div className="grid grid-cols-2 gap-8 mt-2">
            <section>
                <div className="flex items-center gap-3 mb-3"><div className="w-6 h-px bg-gray-400" /><h2 className="text-[10px] font-bold tracking-[0.35em] text-gray-700">SKILLS</h2><div className="flex-1 h-px bg-gray-200" /></div>
                <p className="text-[12px] text-gray-700 leading-loose">{data.skills.join(' • ')}</p>
            </section>
            <section>
                <div className="flex items-center gap-3 mb-3"><div className="w-6 h-px bg-gray-400" /><h2 className="text-[10px] font-bold tracking-[0.35em] text-gray-700">LANGUAGES</h2><div className="flex-1 h-px bg-gray-200" /></div>
                {data.languages?.map((l: any, i: number) => <div key={i} className="text-[12px] text-gray-700">{l.language} ({l.proficiency})</div>)}
            </section>
        </div>
        {data.certifications?.length > 0 && (
            <section className="mt-5">
                <div className="flex items-center gap-3 mb-3"><div className="w-6 h-px bg-gray-400" /><h2 className="text-[10px] font-bold tracking-[0.35em] text-gray-700">CERTIFICATIONS</h2><div className="flex-1 h-px bg-gray-200" /></div>
                {data.certifications.map((cert: any, i: number) => (
                    <div key={i} className="text-[12px] text-gray-700 mb-0.5">{cert.name} – {cert.issuer}, {cert.date}</div>
                ))}
            </section>
        )}
        {data.awards?.length > 0 && (
            <section className="mt-5">
                <div className="flex items-center gap-3 mb-3"><div className="w-6 h-px bg-gray-400" /><h2 className="text-[10px] font-bold tracking-[0.35em] text-gray-700">AWARDS</h2><div className="flex-1 h-px bg-gray-200" /></div>
                {data.awards.map((a: any, i: number) => (
                    <div key={i} className="text-[12px] text-gray-700 mb-0.5">{a.title} – {a.issuer}, {a.date}</div>
                ))}
            </section>
        )}
        {data.projects?.length > 0 && (
            <section className="mt-5">
                <div className="flex items-center gap-3 mb-3"><div className="w-6 h-px bg-gray-400" /><h2 className="text-[10px] font-bold tracking-[0.35em] text-gray-700">PROJECTS</h2><div className="flex-1 h-px bg-gray-200" /></div>
                {data.projects.map((p: any, i: number) => <div key={i} className="text-[12px] text-gray-700 mb-1"><span className="font-bold">{p.name}.</span> {p.description}</div>)}
            </section>
        )}
    </div>
);

// 22. MODERN ELEGANT – Right sidebar, serif/sans mix
const T_ModernElegant = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page flex" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <main className="flex-1 p-12 space-y-7">
            <header className="pb-6 border-b" style={{ borderColor: `${c}30` }}>
                <h1 className="text-5xl font-black tracking-tighter text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>{data.personalInfo.fullName}</h1>
                <p className="font-medium mt-2 text-sm" style={{ color: c }}>{data.experience[0]?.position}</p>
            </header>
            <section>
                <p className="text-[11px] text-gray-600 leading-relaxed italic">{data.personalInfo.summary}</p>
            </section>
            <section>
                <h2 className="text-base font-black tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Experience</h2>
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-5 pl-4 border-l" style={{ borderColor: `${c}30` }}>
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-gray-900">{e.company}</span>
                            <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] font-medium mb-1" style={{ color: c }}>{e.position}</div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                    </div>
                ))}
            </section>
            {data.projects?.length > 0 && (
                <section>
                    <h2 className="text-base font-black tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Projects</h2>
                    {data.projects.map((p: any, i: number) => (
                        <div key={i} className="mb-3">
                            <span className="text-[11px] font-bold text-gray-800">{p.name}</span>
                            <p className="text-[10px] text-gray-500 mt-0.5">{p.description}</p>
                        </div>
                    ))}
                </section>
            )}
            {data.awards?.length > 0 && (
                <section>
                    <h2 className="text-base font-black tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Awards</h2>
                    {data.awards.map((a: any, i: number) => (
                        <div key={i} className="flex justify-between text-[10px] mb-1.5">
                            <span className="font-medium text-gray-700">{a.title}</span>
                            <span className="text-gray-400">{a.issuer} · {a.date}</span>
                        </div>
                    ))}
                </section>
            )}
        </main>
        <aside className="w-[220px] p-8 border-l space-y-7" style={{ borderColor: `${c}15` }}>
            <div>
                <h2 className="text-base font-black tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Contact</h2>
                <div className="text-[10px] text-gray-500 space-y-1">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                    {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                </div>
            </div>
            <div>
                <h2 className="text-base font-black tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Education</h2>
                {data.education.map((e: any, i: number) => (
                    <div key={i} className="mb-3">
                        <div className="text-[10px] font-bold text-gray-800">{e.school}</div>
                        <div className="text-[9px] text-gray-500 italic">{e.degree}</div>
                        <div className="text-[9px] text-gray-400">{e.endDate}</div>
                    </div>
                ))}
            </div>
            <div>
                <h2 className="text-base font-black tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((s: string, i: number) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: `${c}40`, color: c }}>{s}</span>
                    ))}
                </div>
            </div>
            {data.languages?.length > 0 && (
                <div>
                    <h2 className="text-base font-black tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Languages</h2>
                    {data.languages.map((l: any, i: number) => (
                        <div key={i} className="flex justify-between text-[10px] mb-1">
                            <span className="font-medium text-gray-700">{l.language}</span>
                            <span className="text-gray-400">{l.proficiency}</span>
                        </div>
                    ))}
                </div>
            )}
            {data.certifications?.length > 0 && (
                <div>
                    <h2 className="text-base font-black tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Certifications</h2>
                    {data.certifications.map((cert: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                            <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                        </div>
                    ))}
                </div>
            )}
            {data.interests?.length > 0 && (
                <div>
                    <h2 className="text-base font-black tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif', color: c }}>Interests</h2>
                    <p className="text-[9px] text-gray-500 leading-loose italic">{data.interests.join(' · ')}</p>
                </div>
            )}
        </aside>
    </div>
);

// 23. EXECUTIVE MINIMAL – Two-col, clean rules, minimal styling
const T_ExecutiveMinimal = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-14 py-12" style={{ fontFamily: 'Inter, sans-serif' }}>
        <header className="grid grid-cols-2 gap-8 pb-6 mb-8" style={{ borderBottom: `2px solid ${c}` }}>
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
                <p className="text-sm font-medium mt-1.5" style={{ color: c }}>{data.experience[0]?.position}</p>
            </div>
            <div className="text-right text-[10px] text-gray-500 space-y-1">
                <div>{data.personalInfo.email}</div>
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.address}</div>
                {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
            </div>
        </header>
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-7">
                <section>
                    <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Profile</h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed mt-3">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Experience</h2>
                    <div className="mt-3 space-y-5">
                        {data.experience.map((e: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <span className="font-black text-sm uppercase text-gray-900">{e.company}</span>
                                    <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                                </div>
                                <div className="text-[10px] font-semibold text-gray-500 mb-1">{e.position}</div>
                                <p className="text-[10px] text-gray-600 leading-relaxed">{e.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Projects</h2>
                        <div className="mt-3 space-y-3">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-1 rounded flex-shrink-0 mt-1" style={{ background: c }} />
                                    <div><div className="font-bold text-[11px] text-gray-800">{p.name}</div><p className="text-[10px] text-gray-500">{p.description}</p></div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Awards</h2>
                        <div className="mt-3 space-y-1.5">
                            {data.awards.map((a: any, i: number) => (
                                <div key={i} className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-gray-700">{a.title}</span>
                                    <span className="text-gray-400">{a.issuer} · {a.date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <div className="space-y-6">
                <section>
                    <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Education</h2>
                    <div className="mt-3 space-y-3">
                        {data.education.map((e: any, i: number) => (
                            <div key={i}>
                                <div className="text-[10px] font-bold text-gray-800 uppercase">{e.school}</div>
                                <div className="text-[9px] text-gray-500">{e.degree}</div>
                                <div className="text-[9px] text-gray-400">{e.endDate}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Skills</h2>
                    <div className="mt-3 space-y-1">
                        {data.skills.map((s: string, i: number) => (
                            <div key={i} className="text-[10px] text-gray-600 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full" style={{ background: c }} />{s}
                            </div>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Languages</h2>
                        <div className="mt-3 space-y-1">
                            {data.languages.map((l: any, i: number) => (
                                <div key={i} className="flex justify-between text-[10px]">
                                    <span className="text-gray-700">{l.language}</span>
                                    <span className="text-gray-400">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Certifications</h2>
                        <div className="mt-3 space-y-2">
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i}>
                                    <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                    <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="font-black text-xs uppercase tracking-[0.25em] text-gray-800 mb-1 pb-1" style={{ borderBottom: `1px solid ${c}` }}>Interests</h2>
                        <p className="text-[9px] text-gray-500 mt-3 leading-loose">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </div>
        </div>
    </div>
);

// 24. TECHNICAL LITE – Left sidebar, badge-heavy, tech-focused
const T_TechnicalLite = ({ data, primaryColor: c }: any) => (
    <div className="bg-gray-50 w-[794px] min-h-[1123px] resume-page flex" style={{ fontFamily: 'Inter, sans-serif' }}>
        <aside className="w-[220px] bg-white border-r border-gray-100 p-8 flex flex-col gap-6">
            <div style={{ borderBottom: `3px solid ${c}` }} className="pb-4">
                <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
                <p className="text-[9px] font-medium mt-1" style={{ color: c }}>{data.experience[0]?.position}</p>
            </div>
            <div className="text-[9px] text-gray-500 space-y-1">
                <div>{data.personalInfo.email}</div>
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.address}</div>
                {data.personalInfo.github && <div className="text-gray-400">{data.personalInfo.github}</div>}
                {data.personalInfo.linkedin && <div className="text-gray-400">{data.personalInfo.linkedin}</div>}
            </div>
            <div>
                <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Tech Stack</div>
                <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((s: string, i: number) => (
                        <span key={i} className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${c}15`, color: c }}>{s}</span>
                    ))}
                </div>
            </div>
            <div>
                <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-3">Education</div>
                {data.education.map((e: any, i: number) => (
                    <div key={i} className="mb-3 pb-3 border-b border-gray-50 last:border-0">
                        <div className="text-[9px] font-bold text-gray-800">{e.school}</div>
                        <div className="text-[8px] text-gray-500">{e.degree}</div>
                        <div className="text-[8px] text-gray-400">{e.endDate}</div>
                    </div>
                ))}
            </div>
            {data.languages?.length > 0 && (
                <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Languages</div>
                    {data.languages.map((l: any, i: number) => (
                        <div key={i} className="flex justify-between text-[9px] mb-0.5">
                            <span className="text-gray-600">{l.language}</span>
                            <span className="text-gray-400">{l.proficiency}</span>
                        </div>
                    ))}
                </div>
            )}
            {data.certifications?.length > 0 && (
                <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Certifications</div>
                    {data.certifications.map((cert: any, i: number) => (
                        <div key={i} className="mb-1.5">
                            <div className="text-[8px] font-bold text-gray-700">{cert.name}</div>
                            <div className="text-[7px] text-gray-400">{cert.issuer} · {cert.date}</div>
                        </div>
                    ))}
                </div>
            )}
            {data.interests?.length > 0 && (
                <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Interests</div>
                    <p className="text-[8px] text-gray-500 leading-loose">{data.interests.join(' / ')}</p>
                </div>
            )}
        </aside>
        <main className="flex-1 p-10 space-y-7">
            <section>
                <div className="font-black text-[8px] uppercase tracking-[0.3em] mb-2" style={{ color: c }}>About</div>
                <p className="text-[11px] text-gray-600 leading-relaxed bg-white rounded-lg p-4 border border-gray-100">{data.personalInfo.summary}</p>
            </section>
            <section>
                <div className="font-black text-[8px] uppercase tracking-[0.3em] mb-4" style={{ color: c }}>Experience</div>
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-4 bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[12px] text-gray-800">{e.company}</span>
                            <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[9px] font-semibold mb-1.5" style={{ color: c }}>{e.position}</div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                    </div>
                ))}
            </section>
            {data.projects?.length > 0 && (
                <section>
                    <div className="font-black text-[8px] uppercase tracking-[0.3em] mb-4" style={{ color: c }}>Projects</div>
                    <div className="grid grid-cols-2 gap-3">
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="font-bold text-[10px] text-gray-800 mb-1">{p.name}</div>
                                {p.link && <div className="text-[8px] text-gray-400 mb-1">{p.link}</div>}
                                <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                                {p.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {p.technologies.map((t: string, ti: number) => (
                                            <span key={ti} style={{ background: `${c}10`, color: c }} className="text-[7px] px-1.5 py-0.5 rounded font-bold">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.awards?.length > 0 && (
                <section>
                    <div className="font-black text-[8px] uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Awards</div>
                    {data.awards.map((a: any, i: number) => (
                        <div key={i} className="flex justify-between text-[10px] mb-1 bg-white rounded p-2 border border-gray-100">
                            <span className="font-bold text-gray-700">{a.title}</span>
                            <span className="text-gray-400">{a.issuer} · {a.date}</span>
                        </div>
                    ))}
                </section>
            )}
        </main>
    </div>
);

// 25. ACADEMIC SCHOLAR – Centered, formal, academic
const T_BasicAcademic = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-20 py-12" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
        <header className="text-center mb-6 pb-4 border-b border-gray-300">
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>{data.personalInfo.fullName}</h1>
            <p className="text-[12px] italic text-gray-500 mt-1" style={{ color: c }}>{data.experience[0]?.position}</p>
            <p className="text-[11px] text-gray-500 mt-2">{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.address}</p>
        </header>
        <div className="text-[12px] text-gray-600 text-center italic leading-relaxed mb-6 border-b border-gray-200 pb-5">{data.personalInfo.summary}</div>
        {[
            {
                title: 'Research & Professional Experience', rows: data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-4 flex gap-4">
                        <div className="w-20 text-right text-[10px] text-gray-400 italic flex-shrink-0 pt-0.5">{e.startDate}<br />–<br />{e.endDate || 'present'}</div>
                        <div className="flex-1 border-l border-gray-200 pl-4">
                            <div className="text-[13px] font-bold">{e.company}</div>
                            <div className="text-[11px] italic text-gray-500">{e.position}</div>
                            <p className="text-[11px] text-gray-700 mt-1 leading-relaxed">{e.description}</p>
                        </div>
                    </div>
                ))
            },
            {
                title: 'Education', rows: data.education.map((e: any, i: number) => (
                    <div key={i} className="mb-3 flex justify-between">
                        <div><div className="text-[13px] font-bold">{e.school}</div><div className="text-[11px] italic text-gray-500">{e.degree} in {e.fieldOfStudy}</div></div>
                        <div className="text-[10px] text-gray-400 italic text-right">{e.startDate}–{e.endDate}</div>
                    </div>
                ))
            },
        ].map(({ title, rows }, si) => (
            <section key={si} className="mb-5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 border-b border-gray-200 pb-1 mb-3">{title}</h2>
                {rows}
            </section>
        ))}
        <div className="grid grid-cols-2 gap-8">
            <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 border-b border-gray-200 pb-1 mb-2">Technical Skills</h2>
                <p className="text-[12px] text-gray-700 leading-loose">{data.skills.join(' • ')}</p>
            </section>
            <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 border-b border-gray-200 pb-1 mb-2">Languages</h2>
                {data.languages?.map((l: any, i: number) => <div key={i} className="text-[12px] text-gray-700">{l.language} ({l.proficiency})</div>)}
            </section>
        </div>
        {data.certifications?.length > 0 && (
            <section className="mt-5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 border-b border-gray-200 pb-1 mb-2">Certifications & Awards</h2>
                <div className="grid grid-cols-2 gap-x-8">
                    {data.certifications.map((cert: any, i: number) => <div key={i} className="text-[12px] text-gray-700 mb-0.5"><span className="font-bold">{cert.name}</span>, {cert.issuer} ({cert.date})</div>)}
                    {data.awards?.map((a: any, i: number) => <div key={i} className="text-[12px] text-gray-700 mb-0.5"><span className="font-bold">{a.title}</span>, {a.issuer} ({a.date})</div>)}
                </div>
            </section>
        )}
        {data.projects?.length > 0 && (
            <section className="mt-5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 border-b border-gray-200 pb-1 mb-2">Selected Projects</h2>
                {data.projects.map((p: any, i: number) => <div key={i} className="text-[12px] text-gray-700 mb-1"><span className="font-bold italic">{p.name}.</span> {p.description}</div>)}
            </section>
        )}
    </div>
);

// 26. AIRY PROFESSIONAL – Clean single column, much whitespace
const T_AiryProfessional = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-20 py-14" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <header className="mb-12">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mb-2">Curriculum Vitae</p>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
                </div>
                <div className="text-right text-[10px] text-gray-400 space-y-0.5">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                </div>
            </div>
            <div className="mt-5 flex items-center gap-4">
                <div className="h-0.5 flex-1 bg-gray-100" />
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{data.experience[0]?.position}</p>
                <div className="h-0.5 flex-1 bg-gray-100" />
            </div>
        </header>
        <section className="mb-10">
            <p className="text-[13px] font-light text-gray-600 leading-loose">{data.personalInfo.summary}</p>
        </section>
        <div className="space-y-10">
            <section>
                <h2 className="text-[8px] uppercase tracking-[0.45em] font-black mb-6" style={{ color: c }}>Work Experience</h2>
                {data.experience.map((e: any, i: number) => (
                    <div key={i} className="mb-7 grid grid-cols-12 gap-4">
                        <div className="col-span-3 text-right">
                            <p className="text-[9px] text-gray-400 leading-loose">{e.startDate}</p>
                            <p className="text-[9px] text-gray-300">—</p>
                            <p className="text-[9px] text-gray-400">{e.endDate || 'Present'}</p>
                        </div>
                        <div className="col-span-9 border-l pl-6" style={{ borderColor: `${c}30` }}>
                            <h3 className="font-black text-[14px] text-gray-900">{e.company}</h3>
                            <div className="text-[10px] font-medium mb-2" style={{ color: c }}>{e.position}</div>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-light">{e.description}</p>
                        </div>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="text-[8px] uppercase tracking-[0.45em] font-black mb-5" style={{ color: c }}>Education</h2>
                <div className="grid grid-cols-2 gap-6">
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="border-t-2 pt-3" style={{ borderColor: `${c}40` }}>
                            <div className="font-black text-[12px] text-gray-900">{e.school}</div>
                            <div className="text-[10px] text-gray-500 font-light">{e.degree}, {e.fieldOfStudy}</div>
                            <div className="text-[9px] text-gray-400">{e.startDate} – {e.endDate}</div>
                        </div>
                    ))}
                </div>
            </section>
            <div className="grid grid-cols-3 gap-8">
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.45em] font-black mb-4" style={{ color: c }}>Skills</h2>
                    {data.skills.map((s: string, i: number) => (
                        <div key={i} className="text-[11px] font-light text-gray-600 border-b border-gray-50 pb-1.5 mb-1.5">{s}</div>
                    ))}
                </section>
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.45em] font-black mb-4" style={{ color: c }}>Languages</h2>
                    {data.languages?.map((l: any, i: number) => (
                        <div key={i} className="flex justify-between text-[11px] font-light text-gray-600 mb-1.5">
                            <span>{l.language}</span><span className="text-gray-400">{l.proficiency}</span>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.45em] font-black mb-4" style={{ color: c }}>Interests</h2>
                    {data.interests?.map((interest: string, i: number) => (
                        <div key={i} className="text-[11px] font-light text-gray-500 mb-1">{interest}</div>
                    ))}
                </section>
            </div>
            {(data.certifications?.length > 0 || data.awards?.length > 0) && (
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.45em] font-black mb-5" style={{ color: c }}>Certifications & Awards</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.certifications?.map((cert: any, i: number) => (
                            <div key={i} className="border-t border-gray-100 pt-2">
                                <div className="text-[11px] font-medium text-gray-700">{cert.name}</div>
                                <div className="text-[9px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                        {data.awards?.map((a: any, i: number) => (
                            <div key={i} className="border-t border-gray-100 pt-2">
                                <div className="text-[11px] font-medium text-gray-700">{a.title}</div>
                                <div className="text-[9px] text-gray-400">{a.issuer} · {a.date}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.projects?.length > 0 && (
                <section>
                    <h2 className="text-[8px] uppercase tracking-[0.45em] font-black mb-5" style={{ color: c }}>Projects</h2>
                    <div className="grid grid-cols-3 gap-5">
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="border-t-2 pt-3" style={{ borderColor: `${c}40` }}>
                                <div className="font-black text-[11px] text-gray-900 mb-0.5">{p.name}</div>
                                <p className="text-[9px] font-light text-gray-500 leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

// 27. MINIMAL CLASSIC – Left aligned, serif accent, single column
const T_MinimalClassic = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page px-16 py-12" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <header className="mb-9 flex justify-between items-end">
            <div>
                <h1 className="text-5xl font-light text-gray-900 tracking-tight">{data.personalInfo.fullName}</h1>
                <p className="text-sm font-medium mt-1.5" style={{ color: c }}>{data.experience[0]?.position}</p>
            </div>
            <div className="text-right text-[10px] text-gray-400 space-y-0.5">
                <div>{data.personalInfo.email}</div>
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.address}</div>
                {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
            </div>
        </header>
        <div className="h-px bg-gray-200 mb-8" />
        <div className="grid grid-cols-12 gap-10">
            <main className="col-span-8 space-y-7">
                {[
                    { label: 'Profile', content: <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p> },
                    {
                        label: 'Experience', content: data.experience.map((e: any, i: number) => (
                            <div key={i} className="mb-5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[13px] font-semibold text-gray-800">{e.company}</span>
                                    <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                                </div>
                                <div className="text-[10px] mb-1.5" style={{ color: c }}>{e.position}</div>
                                <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                            </div>
                        ))
                    },
                    ...(data.projects?.length > 0 ? [{
                        label: 'Projects', content: data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-3">
                                <span className="text-[11px] font-semibold text-gray-700">{p.name}</span>
                                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{p.description}</p>
                            </div>
                        ))
                    }] : []),
                    ...(data.awards?.length > 0 ? [{
                        label: 'Awards', content: data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-medium text-gray-700">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))
                    }] : []),
                ].map(({ label, content }, si) => (
                    <section key={si}>
                        <h2 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-3">{label}</h2>
                        {content}
                    </section>
                ))}
            </main>
            <aside className="col-span-4 space-y-7">
                {[
                    {
                        label: 'Education', content: data.education.map((e: any, i: number) => (
                            <div key={i} className="mb-3">
                                <div className="text-[10px] font-semibold text-gray-700">{e.school}</div>
                                <div className="text-[9px] text-gray-500">{e.degree}</div>
                                <div className="text-[9px] text-gray-400">{e.endDate}</div>
                            </div>
                        ))
                    },
                    { label: 'Skills', content: <p className="text-[10px] text-gray-500 leading-loose">{data.skills.join(' · ')}</p> },
                    ...(data.languages?.length ? [{
                        label: 'Languages', content: data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="text-gray-600">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))
                    }] : []),
                    ...(data.certifications?.length ? [{
                        label: 'Certifications', content: data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-1.5">
                                <div className="text-[9px] font-medium text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))
                    }] : []),
                    ...(data.interests?.length ? [{ label: 'Interests', content: <p className="text-[9px] text-gray-500 leading-loose">{data.interests.join(' · ')}</p> }] : []),
                ].map(({ label, content }, si) => (
                    <section key={si}>
                        <h2 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-3">{label}</h2>
                        {content}
                    </section>
                ))}
            </aside>
        </div>
    </div>
);

// 28. COMPACT MODERN – Dense two-column, info-rich
const T_CompactModern = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Inter, sans-serif' }}>
        <header className="px-10 py-7" style={{ background: `linear-gradient(to right, ${c}, ${c}cc)` }}>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">{data.personalInfo.fullName}</h1>
                    <p className="text-white/80 text-[11px] mt-0.5 font-medium">{data.experience[0]?.position}</p>
                </div>
                <div className="text-right text-[9px] text-white/70 space-y-0.5">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                    {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                </div>
            </div>
        </header>
        <div className="flex">
            <main className="flex-1 p-8 space-y-6 border-r border-gray-100">
                <section>
                    <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Profile</h2>
                    <p className="text-[10px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-4 pb-3 border-b border-gray-50 last:border-0">
                            <div className="flex justify-between">
                                <span className="font-bold text-[11px] text-gray-800">{e.company}</span>
                                <span className="text-[8px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[9px] font-medium mb-1" style={{ color: c }}>{e.position}</div>
                            <p className="text-[9px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Projects</h2>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-2 flex gap-2">
                                <span className="font-bold text-[10px] text-gray-700">{p.name}:</span>
                                <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Awards</h2>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[9px] mb-1">
                                <span className="font-medium text-gray-700">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <aside className="w-48 p-6 space-y-5">
                <section>
                    <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="text-[9px] font-bold text-gray-700">{e.school}</div>
                            <div className="text-[8px] text-gray-500">{e.degree}</div>
                            <div className="text-[8px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Skills</h2>
                    <div className="flex flex-wrap gap-1">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${c}10`, color: c }}>{s}</span>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Languages</h2>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[9px] mb-0.5">
                                <span className="text-gray-600">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-1.5">
                                <div className="text-[8px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[7px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Interests</h2>
                        <p className="text-[8px] text-gray-500">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// 29. HYBRID MULTI-COLUMN – 3-col for skills/meta, 2-col for content
const T_Hybrid = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        <header className="px-12 pt-10 pb-7 bg-gray-950">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">{data.personalInfo.fullName}</h1>
                    <p className="text-sm font-medium mt-1" style={{ color: c }}>{data.experience[0]?.position}</p>
                </div>
                <div className="text-right text-[10px] text-gray-500 space-y-0.5">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/10">
                <div>
                    <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1">
                        {data.skills.slice(0, 7).map((s: string, i: number) => <span key={i} className="text-[8px] px-1.5 py-0.5 font-bold rounded" style={{ background: `${c}20`, color: c }}>{s}</span>)}
                    </div>
                </div>
                <div>
                    <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-2">More Skills</div>
                    <div className="flex flex-wrap gap-1">
                        {data.skills.slice(7).map((s: string, i: number) => <span key={i} className="text-[8px] px-1.5 py-0.5 font-bold rounded" style={{ background: `${c}20`, color: c }}>{s}</span>)}
                    </div>
                </div>
                <div>
                    <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-2">Languages</div>
                    {data.languages?.map((l: any, i: number) => <div key={i} className="text-[9px] text-gray-400">{l.language} — {l.proficiency}</div>)}
                </div>
            </div>
        </header>
        <div className="flex p-10 gap-8">
            <main className="flex-1 space-y-7">
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Profile</h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: c }}>Experience</h2>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5 pl-4 border-l-2" style={{ borderColor: `${c}40` }}>
                            <div className="flex justify-between">
                                <span className="font-black text-sm text-gray-900 uppercase">{e.company}</span>
                                <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-medium mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.awards?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Awards</h2>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-bold text-gray-800">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <aside className="w-52 space-y-6">
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Education</h2>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3 pl-3 border-l-2" style={{ borderColor: `${c}30` }}>
                            <div className="text-[10px] font-bold text-gray-800">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Projects</h2>
                        {data.projects.map((p: any, i: number) => (
                            <div key={i} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
                                <div className="text-[10px] font-bold text-gray-800">{p.name}</div>
                                <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: c }}>Certifications</h2>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: c }}>Interests</h2>
                        <p className="text-[9px] text-gray-500">{data.interests.join(' · ')}</p>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// 30. FOLIO PORTFOLIO – Large name as design element, portfolio-exhibition
const T_Folio = ({ data, primaryColor: c }: any) => (
    <div className="bg-white w-[794px] min-h-[1123px] resume-page" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <div className="relative overflow-hidden px-12 pt-12 pb-8" style={{ background: `${c}08` }}>
            <div className="absolute top-0 right-0 text-[200px] font-black leading-none opacity-[0.04] select-none pointer-events-none tracking-tighter" style={{ color: c }}>
                {data.personalInfo.fullName.split(' ').map((w: string) => w[0]).join('')}
            </div>
            <div className="relative z-10 flex justify-between items-end">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter leading-none" style={{ color: c }}>{data.personalInfo.fullName.split(' ')[0]}</h1>
                    <h1 className="text-6xl font-black tracking-tighter leading-none text-gray-900">{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
                    <p className="font-semibold mt-3 text-gray-600">{data.experience[0]?.position}</p>
                </div>
                <div className="text-right text-[10px] text-gray-400 space-y-1">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                    {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                    {data.personalInfo.github && <div>{data.personalInfo.github}</div>}
                </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-5 max-w-lg relative z-10">{data.personalInfo.summary}</p>
        </div>
        <div className="flex px-12 py-8 gap-8">
            <main className="flex-1 space-y-7">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-4 rounded" style={{ background: c }} />
                        <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-700">Experience</h2>
                    </div>
                    {data.experience.map((e: any, i: number) => (
                        <div key={i} className="mb-5 rounded-xl p-4" style={{ border: `1px solid ${c}20`, background: `${c}04` }}>
                            <div className="flex justify-between items-baseline">
                                <span className="font-black text-sm uppercase text-gray-800">{e.company}</span>
                                <span className="text-[9px] text-gray-400">{e.startDate} – {e.endDate || 'Present'}</span>
                            </div>
                            <div className="text-[10px] font-semibold mb-1.5" style={{ color: c }}>{e.position}</div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">{e.description}</p>
                        </div>
                    ))}
                </section>
                {data.projects?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-4 h-4 rounded" style={{ background: c }} />
                            <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-700">Featured Projects</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl" style={{ border: `1px solid ${c}25`, background: `${c}05` }}>
                                    <div className="font-black text-[11px] uppercase text-gray-800 mb-1">{p.name}</div>
                                    {p.link && <div className="text-[8px] text-gray-400 mb-1">{p.link}</div>}
                                    <p className="text-[9px] text-gray-500 leading-relaxed">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.awards?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-4 h-4 rounded" style={{ background: c }} />
                            <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-700">Awards</h2>
                        </div>
                        {data.awards.map((a: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-bold text-gray-700">{a.title}</span>
                                <span className="text-gray-400">{a.issuer} · {a.date}</span>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <aside className="w-52 space-y-6">
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded" style={{ background: c }} />
                        <h2 className="font-black text-[9px] uppercase tracking-[0.3em] text-gray-700">Education</h2>
                    </div>
                    {data.education.map((e: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="text-[10px] font-bold text-gray-800">{e.school}</div>
                            <div className="text-[9px] text-gray-500">{e.degree}</div>
                            <div className="text-[9px] text-gray-400">{e.endDate}</div>
                        </div>
                    ))}
                </section>
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded" style={{ background: c }} />
                        <h2 className="font-black text-[9px] uppercase tracking-[0.3em] text-gray-700">Skills</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s: string, i: number) => (
                            <span key={i} className="text-[8px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${c}15`, color: c }}>{s}</span>
                        ))}
                    </div>
                </section>
                {data.languages?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded" style={{ background: c }} />
                            <h2 className="font-black text-[9px] uppercase tracking-[0.3em] text-gray-700">Languages</h2>
                        </div>
                        {data.languages.map((l: any, i: number) => (
                            <div key={i} className="flex justify-between text-[10px] mb-1">
                                <span className="font-medium text-gray-700">{l.language}</span>
                                <span className="text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </section>
                )}
                {data.certifications?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded" style={{ background: c }} />
                            <h2 className="font-black text-[9px] uppercase tracking-[0.3em] text-gray-700">Certifications</h2>
                        </div>
                        {data.certifications.map((cert: any, i: number) => (
                            <div key={i} className="mb-2">
                                <div className="text-[9px] font-bold text-gray-700">{cert.name}</div>
                                <div className="text-[8px] text-gray-400">{cert.issuer} · {cert.date}</div>
                            </div>
                        ))}
                    </section>
                )}
                {data.interests?.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded" style={{ background: c }} />
                            <h2 className="font-black text-[9px] uppercase tracking-[0.3em] text-gray-700">Interests</h2>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {data.interests.map((interest: string, i: number) => (
                                <span key={i} className="text-[8px] px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </aside>
        </div>
    </div>
);

// ─── Template Registry ────────────────────────────────────────────────────────

const TEMPLATE_MAP: Record<string, React.FC<{ data: ResumeData; primaryColor: string }>> = {
    // Primary names
    modern: T_Modern,
    classic: T_Classic,
    elegant: T_Elegant,
    executive: T_Executive,
    minimalist: T_Minimalist,
    brutal: T_Brutal,
    vogue: T_Vogue,
    tech: T_Tech,
    timeline: T_Timeline,
    formal: T_Formal,
    gradient: T_Gradient,
    slate: T_Slate,
    accent: T_Accent,
    clean: T_Clean,
    monochrome: T_Monochrome,
    compact: T_Compact,
    bold: T_Bold,
    soft: T_Soft,
    metro: T_Metro,
    airy_minimal: T_AiryMinimal,
    traditional_clean: T_TraditionalClean,
    modern_elegant: T_ModernElegant,
    executive_minimal: T_ExecutiveMinimal,
    technical_lite: T_TechnicalLite,
    basic_academic: T_BasicAcademic,
    airy_professional: T_AiryProfessional,
    minimal_classic: T_MinimalClassic,
    compact_modern: T_CompactModern,
    hybrid: T_Hybrid,
    folio: T_Folio,
    // Aliases for all legacy template IDs
    neon: T_Bold,
    creative: T_Gradient,
    geometric: T_Metro,
    minimalSidebar: T_AiryMinimal,
    simple_sidebar: T_Elegant,
    cyber: T_Tech,
    glass: T_Soft,
    neural: T_Metro,
    hologram: T_Bold,
    focus: T_Minimalist,
    data: T_Compact,
    organic: T_Soft,
    terminal: T_Tech,
    nebula: T_Bold,
    prism: T_Gradient,
    quantum: T_Metro,
    atlas: T_Executive,
    vector: T_Clean,
    aurora: T_Gradient,
    cryptic: T_Tech,
    zenith: T_Folio,
    orbit: T_Timeline,
    pulse: T_Modern,
    fission: T_Brutal,
    glitch: T_Bold,
    echo: T_ModernElegant,
    void: T_Slate,
    stellar: T_Accent,
    pixel: T_Brutal,
    apex: T_Executive,
};

export default function ResumeTemplate({ data, template, primaryColor = '#3b82f6' }: ResumeTemplateProps) {
    const TemplateComponent = TEMPLATE_MAP[template] ?? T_Modern;
    return (
        <div className="select-none">
            <GlobalStyles />
            <TemplateComponent data={data} primaryColor={primaryColor} />
        </div>
    );
}