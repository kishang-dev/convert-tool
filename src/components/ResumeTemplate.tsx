import React from 'react';
import { ResumeData } from '@/lib/api';

interface ResumeTemplateProps {
    data: ResumeData;
    template: string;
    primaryColor?: string;
}

const PageBreakStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono&family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        @media print {
            .resume-page { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
            section { page-break-inside: avoid; }
            header, .bg-slate-900, .bg-slate-800, .bg-slate-100 { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .resume-page { line-height: 1.5; color: #1e293b; overflow: hidden; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .resume-page section { page-break-inside: avoid; margin-bottom: 2rem; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-lora { font-family: 'Lora', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-inter { font-family: 'Inter', sans-serif; }
    `}} />
);

const SectionHeader = ({ title, color, variant = 'default' }: { title: string, color: string, variant?: string }) => {
    if (variant === 'premium') {
        return (
            <div className="mb-6">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-3" style={{ color }}>
                    {title}
                    <div className="flex-1 h-[2px] opacity-20" style={{ backgroundColor: color }}></div>
                </h2>
            </div>
        );
    }
    if (variant === 'minimal') return <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 mb-8 tracking-tighter">{title}</h2>;
    if (variant === 'line') return <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4 text-gray-400">{title} <span className="flex-1 h-px bg-gray-100"></span></h2>;
    return <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color }}>{title}</h2>;
};

const templates: Record<string, React.FC<{ data: ResumeData; primaryColor: string }>> = {
    modern: ({ data, primaryColor }) => {
        const s = data.styling || { fontSize: { name: 48, headings: 14, body: 10 }, sectionFonts: { name: 'Inter', headings: 'Inter', body: 'Inter' } };
        return (
            <div className="bg-white w-[794px] mx-auto shadow-2xl resume-page" style={{ fontFamily: s.sectionFonts.body, fontSize: `${s.fontSize.body}px` }}>
                <header className="p-16 text-white bg-slate-900 overflow-hidden relative" style={{ borderLeft: `12px solid ${primaryColor}`, backgroundColor: '#0f172a' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h1 className="font-black tracking-tighter mb-4 uppercase leading-none" style={{ fontSize: `${s.fontSize.name}px`, fontFamily: s.sectionFonts.name }}>{data.personalInfo.fullName}</h1>
                        <div className="flex items-center gap-6 text-sm font-medium opacity-70">
                            <span>{data.personalInfo.email}</span>
                            <span>•</span>
                            <span>{data.personalInfo.phone}</span>
                            <span>•</span>
                            <span>{data.personalInfo.address}</span>
                        </div>
                    </div>
                </header>

                <div className="p-16 grid grid-cols-12 gap-12">
                    <div className="col-span-8 space-y-12">
                        <section>
                            <SectionHeader title="Professional Summary" color={primaryColor} variant="premium" />
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                {data.personalInfo.summary}
                            </p>
                        </section>

                        <section>
                            <SectionHeader title="Experience" color={primaryColor} variant="premium" />
                            <div className="space-y-10">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{exp.company}</h3>
                                            <span className="text-xs font-bold text-slate-400 tabular-nums">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                        </div>
                                        <div className="text-sm font-bold mb-4" style={{ color: primaryColor }}>{exp.position}</div>
                                        <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-slate-100 group-hover:border-slate-200 transition-colors">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <SectionHeader title="Selected Projects" color={primaryColor} variant="premium" />
                                <div className="space-y-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                                {proj.link && <span className="text-[10px] tabular-nums font-bold" style={{ color: primaryColor }}>{proj.link}</span>}
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-4 space-y-12">
                        {data.skills && data.skills.length > 0 && (
                            <section>
                                <SectionHeader title="Competencies" color={primaryColor} variant="premium" />
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((s, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-slate-50 text-[10px] font-bold text-slate-700 rounded-md border border-slate-100 uppercase tracking-wider">{s}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.education && data.education.length > 0 && (
                            <section>
                                <SectionHeader title="Education" color={primaryColor} variant="premium" />
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <div className="text-xs font-black text-slate-800 uppercase leading-snug">{edu.degree}</div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-1">{edu.school}</div>
                                            <div className="text-[10px] text-slate-300 mt-1 tabular-nums">{edu.startDate} — {edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <SectionHeader title="Languages" color={primaryColor} variant="premium" />
                                <div className="space-y-3">
                                    {data.languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-700">{lang.language}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section>
                                <SectionHeader title="Interests" color={primaryColor} variant="premium" />
                                <div className="flex flex-wrap gap-2">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-xs text-slate-500 font-medium">
                                            {interest}{i < (data.interests?.length || 0) - 1 ? ' • ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    },

    classic: ({ data, primaryColor }) => {
        const s = data.styling || { fontSize: { name: 48, headings: 14, body: 10 }, sectionFonts: { name: 'Lora', headings: 'Lora', body: 'Lora' } };
        return (
            <div className="bg-white w-[794px] mx-auto shadow-2xl p-20 resume-page text-slate-900 border-[20px] border-slate-50" style={{ fontFamily: s.sectionFonts.body, fontSize: `${s.fontSize.body}px` }}>
                <header className="text-center mb-16 border-b-2 border-slate-900 pb-12">
                    <h1 className="font-bold uppercase tracking-[0.2em] mb-6 transform scale-y-110" style={{ fontSize: `${s.fontSize.name}px`, fontFamily: s.sectionFonts.name }}>{data.personalInfo.fullName}</h1>
                    <div className="flex justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span>{data.personalInfo.email}</span>
                        <span className="text-slate-200">/</span>
                        <span>{data.personalInfo.phone}</span>
                        <span className="text-slate-200">/</span>
                        <span>{data.personalInfo.address}</span>
                    </div>
                </header>

                <div className="space-y-14">
                    <section>
                        <h2 className="font-black uppercase tracking-[0.4em] mb-8 text-center text-slate-300" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Executive Profile</h2>
                        <p className="text-lg leading-relaxed text-slate-700 italic text-center max-w-2xl mx-auto">
                            "{data.personalInfo.summary}"
                        </p>
                    </section>

                    <section>
                        <h2 className="font-black uppercase tracking-[0.4em] mb-10 border-b-2 border-slate-100 pb-2" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Professional Experience</h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-xl font-bold italic serif tracking-tight">{exp.company}</h3>
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 tabular-nums">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                    </div>
                                    <div className="text-sm font-black uppercase tracking-[0.2em] mb-4" style={{ color: primaryColor }}>{exp.position}</div>
                                    <p className="text-sm text-slate-600 leading-relaxed text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-[0.4em] mb-10 border-b-2 border-slate-100 pb-2" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Education & Credentials</h2>
                            <div className="grid grid-cols-2 gap-12">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h4 className="text-base font-bold mb-1">{edu.school}</h4>
                                        <p className="text-sm italic text-slate-500 mb-1">{edu.degree}</p>
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest tabular-nums">{edu.startDate} — {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-2 gap-16">
                        {data.skills && data.skills.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.4em] mb-6 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Expertise</h2>
                                <div className="grid grid-cols-1 gap-2">
                                    {data.skills.map((s, i) => (
                                        <div key={i} className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-slate-200 rotate-45"></div>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.4em] mb-6 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Languages</h2>
                                <div className="space-y-3">
                                    {data.languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                            <span>{lang.language}</span>
                                            <span className="text-slate-300">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && data.projects.length > 0 && (
                            <section className="col-span-2">
                                <h2 className="font-black uppercase tracking-[0.4em] mb-10 border-b-2 border-slate-100 pb-2" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Notable Projects</h2>
                                <div className="space-y-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-2">
                                                <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                                {proj.link && <span className="text-[10px] tabular-nums font-bold" style={{ color: primaryColor }}>{proj.link}</span>}
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed text-justify">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.4em] mb-6 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Certifications</h2>
                                <div className="space-y-4">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i}>
                                            <h4 className="text-sm font-bold text-slate-800">{cert.name}</h4>
                                            <p className="text-xs italic text-slate-500">{cert.issuer} • {cert.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.4em] mb-6 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Awards</h2>
                                <div className="space-y-4">
                                    {data.awards.map((award, i) => (
                                        <div key={i}>
                                            <h4 className="text-sm font-bold text-slate-800">{award.title}</h4>
                                            <p className="text-xs italic text-slate-500">{award.issuer} • {award.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.4em] mb-6 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Interests</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-xs text-slate-500 font-medium border border-slate-200 px-2 py-1 rounded">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    },
    elegant: ({ data, primaryColor }) => {
        const s = data.styling || { fontSize: { name: 30, headings: 14, body: 14 }, sectionFonts: { name: 'Outfit', headings: 'Outfit', body: 'Outfit' } };
        return (
            <div className="bg-slate-50 w-[794px] mx-auto shadow-2xl flex resume-page min-h-[1123px]" style={{ fontFamily: s.sectionFonts.body, fontSize: `${s.fontSize.body}px` }}>
                <aside className="w-[280px] p-10 bg-slate-900 text-white flex flex-col gap-12">
                    <div className="mb-4">
                        <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center text-4xl font-black mb-6 border border-white/20 shadow-2xl rotate-3">
                            {data.personalInfo.fullName.charAt(0)}
                        </div>
                        <h1 className="font-black uppercase leading-tight tracking-tighter mb-2" style={{ fontSize: `${s.fontSize.name}px`, fontFamily: s.sectionFonts.name }}>{data.personalInfo.fullName}</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Professional Record</p>
                    </div>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-slate-500 border-b border-white/10 pb-2">Contact</h2>
                        <div className="space-y-4 text-[11px] font-medium opacity-80">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-widest text-slate-500">Email</span>
                                <span>{data.personalInfo.email}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-widest text-slate-500">Phone</span>
                                <span>{data.personalInfo.phone}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-widest text-slate-500">Location</span>
                                <span>{data.personalInfo.address}</span>
                            </div>
                        </div>
                    </section>

                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-slate-500 border-b border-white/10 pb-2">Expertise</h2>
                            <div className="space-y-4">
                                {data.skills.slice(0, 10).map((s, i) => (
                                    <div key={i} className="text-[10px] uppercase font-bold tracking-widest">
                                        <div className="flex justify-between mb-2">
                                            <span>{s}</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 overflow-hidden rounded-full">
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: primaryColor, width: `${90 - (i * 3)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-slate-500 border-b border-white/10 pb-2">Languages</h2>
                            <div className="space-y-3">
                                {data.languages.map((lang, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <span className="text-[11px] font-bold">{lang.language}</span>
                                        <span className="text-[9px] uppercase tracking-widest text-slate-500">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-slate-500 border-b border-white/10 pb-2">Interests</h2>
                            <div className="space-y-2">
                                {data.interests.map((interest, i) => (
                                    <div key={i} className="text-xs font-bold text-slate-600 border-b border-slate-200 pb-1">{interest}</div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                <main className="flex-1 p-16 bg-white flex flex-col gap-12 overflow-hidden">
                    <section>
                        <h2 className="font-black uppercase tracking-[0.4em] text-slate-200 mb-6 flex items-center gap-6" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Biography <span className="flex-1 h-px bg-slate-100"></span></h2>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                            "{data.personalInfo.summary}"
                        </p>
                    </section>

                    <section>
                        <h2 className="font-black uppercase tracking-[0.4em] text-slate-200 mb-8 flex items-center gap-6" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Experience <span className="flex-1 h-px bg-slate-100"></span></h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 border-slate-100" style={{ backgroundColor: primaryColor }}></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest mb-2 block tabular-nums text-slate-300">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">{exp.company}</h3>
                                    <p className="text-sm font-bold text-slate-400 mb-4">{exp.position}</p>
                                    <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-[0.4em] text-slate-200 mb-8 flex items-center gap-6" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Projects <span className="flex-1 h-px bg-slate-100"></span></h2>
                            <div className="space-y-8">
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="text-base font-bold text-slate-800">{proj.name}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mt-2">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-[0.4em] text-slate-200 mb-8 flex items-center gap-6" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Academic <span className="flex-1 h-px bg-slate-100"></span></h2>
                            <div className="space-y-8">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h4 className="text-base font-bold text-slate-800">{edu.school}</h4>
                                        <div className="flex justify-between items-center text-xs mt-1">
                                            <span className="font-medium text-slate-400">{edu.degree}</span>
                                            <span className="font-bold tabular-nums text-slate-200 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-[0.4em] text-slate-200 mb-8 flex items-center gap-6" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Certifications <span className="flex-1 h-px bg-slate-100"></span></h2>
                            <div className="space-y-6">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-slate-800">{cert.name}</h3>
                                        <p className="text-xs text-slate-500 italic mb-1">{cert.issuer} • {cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-[0.4em] text-slate-200 mb-8 flex items-center gap-6" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Awards <span className="flex-1 h-px bg-slate-100"></span></h2>
                            <div className="space-y-6">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-slate-800">{award.title}</h3>
                                        <p className="text-xs text-slate-500 italic mb-1">{award.issuer} • {award.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        );
    },

    executive: ({ data, primaryColor }) => {
        const s = data.styling || { fontSize: { name: 72, headings: 11, body: 14 }, sectionFonts: { name: 'Inter', headings: 'Inter', body: 'Inter' } };
        return (
            <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page border-t-[24px]" style={{ borderColor: primaryColor, fontFamily: s.sectionFonts.body, fontSize: `${s.fontSize.body}px` }}>
                <div className="flex justify-between items-start mb-20 border-b border-slate-100 pb-12">
                    <div>
                        <h1 className="font-black text-slate-900 tracking-tighter mb-4 leading-tight" style={{ fontSize: `${s.fontSize.name}px`, fontFamily: s.sectionFonts.name }}>
                            {data.personalInfo.fullName.split(' ')[0]} <br />
                            <span className="font-thin text-slate-300">{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-bold tracking-[0.3em] uppercase">{data.experience[0]?.position || 'Executive'}</p>
                    </div>
                    <div className="text-right space-y-3 pt-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-1">Contact</span>
                            <p className="text-sm font-bold text-slate-800 tabular-nums">{data.personalInfo.email}</p>
                            <p className="text-sm font-bold text-slate-800 tabular-nums">{data.personalInfo.phone}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-1">Location</span>
                            <p className="text-sm font-bold text-slate-800">{data.personalInfo.address}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-16">
                    <div className="col-span-8 space-y-16">
                        <section>
                            <h2 className="font-black uppercase tracking-[0.6em] text-slate-200 mb-10" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Professional Summary</h2>
                            <p className="leading-relaxed text-slate-600 font-medium italic border-l-4 pl-8" style={{ borderColor: primaryColor }}>
                                {data.personalInfo.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-black uppercase tracking-[0.6em] text-slate-200 mb-10" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Career Trajectory</h2>
                            <div className="space-y-14">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-4">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{exp.company}</h3>
                                            <span className="text-xs font-black tabular-nums text-slate-300">{exp.startDate} // {exp.endDate || 'PRESENT'}</span>
                                        </div>
                                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-6" style={{ color: primaryColor }}>{exp.position}</p>
                                        <p className="text-sm text-slate-500 leading-relaxed text-justify">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 space-y-16">
                        {data.skills && data.skills.length > 0 && (
                            <section className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
                                <h2 className="uppercase tracking-[0.5em] text-slate-300 mb-8 underline decoration-slate-200 underline-offset-8 font-black" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Core Skills</h2>
                                <div className="space-y-4">
                                    {data.skills.map((s, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-2 h-2 bg-slate-200 group-hover:scale-150 transition-transform" style={{ backgroundColor: primaryColor }}></div>
                                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.5em] text-slate-300 mb-8" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Languages</h2>
                                <div className="space-y-4 px-4">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">{l.language}</span>
                                            <span className="text-[9px] font-bold text-slate-300">{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.5em] text-slate-300 mb-8" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Credentials</h2>
                                <div className="space-y-8">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1 leading-snug">{edu.degree}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{edu.school}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.5em] text-slate-300 mb-8" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Projects</h2>
                                <div className="space-y-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i}>
                                            <div className="text-xs font-black text-slate-900 uppercase mb-2">{proj.name}</div>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.5em] text-slate-300 mb-8" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Certifications</h2>
                                <div className="space-y-8">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i}>
                                            <div className="text-xs font-black text-slate-900 uppercase mb-2">{cert.name}</div>
                                            <p className="text-[10px] text-slate-400 italic">{cert.issuer} • {cert.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.5em] text-slate-300 mb-8" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Awards</h2>
                                <div className="space-y-8">
                                    {data.awards.map((award, i) => (
                                        <div key={i}>
                                            <div className="text-xs font-black text-slate-900 uppercase mb-2">{award.title}</div>
                                            <p className="text-[10px] text-slate-400 italic">{award.issuer} • {award.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section>
                                <h2 className="font-black uppercase tracking-[0.5em] text-slate-300 mb-8" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Interests</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200 px-2 py-1 rounded">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    },

    minimalist: ({ data, primaryColor }) => {
        const s = data.styling || { fontSize: { name: 96, headings: 10, body: 16 }, sectionFonts: { name: 'Inter', headings: 'Inter', body: 'Inter' } };
        return (
            <div className="bg-white w-[794px] mx-auto shadow-2xl p-24 resume-page text-slate-600 leading-normal" style={{ fontFamily: s.sectionFonts.body, fontSize: `${s.fontSize.body}px` }}>
                <header className="mb-32">
                    <h1 className="font-thin tracking-tighter text-slate-900 mb-8 -ml-1 uppercase" style={{ fontSize: `${s.fontSize.name}px`, fontFamily: s.sectionFonts.name }}>{data.personalInfo.fullName}</h1>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 border-t pt-8">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                        <span>{data.personalInfo.address}</span>
                    </div>
                </header>
                <div className="space-y-24">
                    <section className="max-w-2xl">
                        <p className="text-2xl font-light leading-relaxed text-slate-400 italic">"{data.personalInfo.summary}"</p>
                    </section>

                    <div className="grid grid-cols-4 gap-12">
                        <div className="col-span-1 space-y-12">
                            <section>
                                <h2 className="font-black uppercase tracking-[0.6em] mb-8 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Capabilites</h2>
                                <div className="space-y-4">
                                    {data.skills.map((s, i) => (
                                        <div key={i} className="text-xs font-black uppercase tracking-widest text-slate-400">{s}</div>
                                    ))}
                                </div>
                            </section>
                            {data.education && data.education.length > 0 && (
                                <section>
                                    <h2 className="font-black uppercase tracking-[0.6em] mb-8 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Academic</h2>
                                    <div className="space-y-6">
                                        {data.education.map((edu, i) => (
                                            <div key={i} className="text-[10px] font-bold text-slate-400">
                                                <p className="uppercase">{edu.school}</p>
                                                <p className="mt-1 opacity-50 italic">{edu.degree}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                            {data.languages && data.languages.length > 0 && (
                                <section>
                                    <h2 className="font-black uppercase tracking-[0.6em] mb-8 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Globals</h2>
                                    <div className="space-y-3 text-[10px] font-black uppercase text-slate-300">
                                        {data.languages.map((l, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span>{l.language}</span>
                                                <span className="opacity-40">{l.proficiency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {data.certifications && data.certifications.length > 0 && (
                                <section>
                                    <h2 className="font-black uppercase tracking-[0.6em] mb-8 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Certifications</h2>
                                    <div className="space-y-6">
                                        {data.certifications.map((cert, i) => (
                                            <div key={i} className="text-[10px] font-bold text-slate-400">
                                                <p className="uppercase">{cert.name}</p>
                                                <p className="mt-1 opacity-50 italic">{cert.issuer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {data.awards && data.awards.length > 0 && (
                                <section>
                                    <h2 className="font-black uppercase tracking-[0.6em] mb-8 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Awards</h2>
                                    <div className="space-y-6">
                                        {data.awards.map((award, i) => (
                                            <div key={i} className="text-[10px] font-bold text-slate-400">
                                                <p className="uppercase">{award.title}</p>
                                                <p className="mt-1 opacity-50 italic">{award.issuer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {data.interests && data.interests.length > 0 && (
                                <section>
                                    <h2 className="font-black uppercase tracking-[0.6em] mb-8 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Interests</h2>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        {data.interests.map((interest, i) => (
                                            <div key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">
                                                {interest}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                        <div className="col-span-3 space-y-24">
                            <section>
                                <h2 className="font-black uppercase tracking-[0.6em] mb-12 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Selected Experience</h2>
                                <div className="space-y-20">
                                    {data.experience.map((exp, i) => (
                                        <div key={i} className="grid grid-cols-4 gap-12">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 pt-1.5">{exp.startDate} — {exp.endDate || 'Now'}</div>
                                            <div className="col-span-3">
                                                <h3 className="text-3xl font-medium text-slate-800 mb-2">{exp.company}</h3>
                                                <p className="text-sm font-bold uppercase tracking-[0.3em] mb-8 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                                <p className="text-base text-slate-500 leading-relaxed font-light">{exp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {data.projects && data.projects.length > 0 && (
                                <section>
                                    <h2 className="font-black uppercase tracking-[0.6em] mb-12 opacity-30" style={{ fontSize: `${s.fontSize.headings}px`, fontFamily: s.sectionFonts.headings }}>Notable Works</h2>
                                    <div className="space-y-16">
                                        {data.projects.map((proj, i) => (
                                            <div key={i} className="border-l-4 pl-12" style={{ borderColor: primaryColor }}>
                                                <h3 className="text-2xl font-medium text-slate-800 mb-4 uppercase tracking-tighter">{proj.name}</h3>
                                                <p className="text-base text-slate-500 leading-relaxed font-light">{proj.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        );
    },
    creative: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl resume-page font-outfit overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-10" style={{ backgroundColor: primaryColor }}></div>
            <header className="p-16 relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl rotate-12 flex items-center justify-center text-white text-5xl font-black mb-8 shadow-xl" style={{ backgroundColor: primaryColor }}>
                    {data.personalInfo.fullName.charAt(0)}
                </div>
                <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">{data.personalInfo.fullName}</h1>
                <p className="text-sm font-bold tracking-[0.5em] text-gray-400 uppercase">{data.experience[0]?.position || 'Creative Professional'}</p>
            </header>
            <div className="px-16 pb-16 grid grid-cols-2 gap-16 relative z-10">
                <section>
                    <SectionHeader title="The Story" color={primaryColor} />
                    <p className="text-sm text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <SectionHeader title="The Tools" color={primaryColor} />
                    <div className="flex flex-wrap gap-3">
                        {data.skills.map((s, i) => (
                            <span key={i} className="px-4 py-1.5 rounded-full bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">{s}</span>
                        ))}
                    </div>
                </section>
                <section className="col-span-2">
                    <SectionHeader title="The Journey" color={primaryColor} />
                    <div className="grid grid-cols-2 gap-10">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-4 block">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                <h3 className="text-xl font-bold mb-1">{exp.company}</h3>
                                <p className="text-sm font-bold mb-4 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {data.projects && data.projects.length > 0 && (
                    <section className="col-span-2">
                        <SectionHeader title="The Projects" color={primaryColor} />
                        <div className="grid grid-cols-3 gap-8">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="p-6 border-2 border-slate-50 rounded-2xl">
                                    <h3 className="text-sm font-black uppercase mb-3" style={{ color: primaryColor }}>{proj.name}</h3>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <SectionHeader title="Academic" color={primaryColor} />
                    <div className="space-y-6">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <h3 className="text-sm font-black uppercase">{edu.school}</h3>
                                <p className="text-xs text-gray-400 italic">{edu.degree}</p>
                                <span className="text-[10px] font-bold opacity-30">{edu.startDate} - {edu.endDate}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <SectionHeader title="Communication" color={primaryColor} />
                    <div className="space-y-4">
                        {data.languages.map((l, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                                <span className="text-xs font-black uppercase">{l.language}</span>
                                <span className="text-[10px] font-bold text-gray-400">{l.proficiency}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <SectionHeader title="Certifications" color={primaryColor} />
                        <div className="space-y-4">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-xl">
                                    <h3 className="text-sm font-black uppercase">{cert.name}</h3>
                                    <p className="text-xs text-gray-400 italic">{cert.issuer} • {cert.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <SectionHeader title="Awards" color={primaryColor} />
                        <div className="space-y-4">
                            {data.awards.map((award, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-xl">
                                    <h3 className="text-sm font-black uppercase">{award.title}</h3>
                                    <p className="text-xs text-gray-400 italic">{award.issuer} • {award.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <SectionHeader title="Interests" color={primaryColor} />
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),
    tech: ({ data, primaryColor }) => (
        <div className="bg-[#0a0a0b] w-[794px] mx-auto shadow-2xl p-12 resume-page font-mono text-[#00ff9d]">
            <header className="border-b border-[#00ff9d]/20 pb-8 mb-12 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase underline decoration-double">{data.personalInfo.fullName}</h1>
                    <p className="text-lg opacity-70">./{data.experience[0]?.position.toLowerCase().replace(/\s+/g, '_')}.sh</p>
                </div>
                <div className="text-right text-[10px] opacity-50 space-y-1">
                    <p>EMAIL: {data.personalInfo.email}</p>
                    <p>PH: {data.personalInfo.phone}</p>
                </div>
            </header>
            <div className="space-y-12">
                <section>
                    <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/summary</h2>
                    <p className="text-xs leading-relaxed opacity-80">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/work_history</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-8 pl-4 border-l border-[#00ff9d]/20 relative">
                            <div className="absolute -left-[4.5px] top-1 w-2 h-2 bg-[#00ff9d]"></div>
                            <div className="flex justify-between font-bold mb-1">
                                <span>[ {exp.company} ]</span>
                                <span className="opacity-40">{exp.startDate} {" >> "} {exp.endDate || '∞'}</span>
                            </div>
                            <p className="text-xs font-bold mb-3 italic">@position: {exp.position}</p>
                            <p className="text-[11px] opacity-60 leading-relaxed whitespace-pre-line">{exp.description}</p>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/skills.exe</h2>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-[#00ff9d]">#</span>
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/education.log</h2>
                        <div className="space-y-4 text-[10px]">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <p className="text-[#00ff9d] underline uppercase">{edu.school}</p>
                                    <p className="opacity-50 mt-1">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/projects_repo</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="p-4 border border-[#00ff9d]/20 rounded">
                                    <h3 className="text-xs font-bold mb-2 uppercase tracking-tight">{proj.name}</h3>
                                    <p className="text-[10px] opacity-40 italic">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/locales.sys</h2>
                        <div className="flex flex-wrap gap-8 text-[10px]">
                            {data.languages.map((l, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="opacity-40">LANG:</span>
                                    <span>{l.language} ({l.proficiency})</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/certifications.key</h2>
                        <div className="space-y-4">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="mb-2">
                                    <p className="text-[11px] font-bold text-white mb-1"><span className="text-[#00ff9d] opacity-50">$</span> {cert.name}</p>
                                    <p className="text-[10px] opacity-40 pl-4">{cert.issuer} | {cert.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/trophy.bin</h2>
                        <div className="space-y-4">
                            {data.awards.map((award, i) => (
                                <div key={i} className="mb-2">
                                    <p className="text-[11px] font-bold text-white mb-1"><span className="text-[#00ff9d] opacity-50">*</span> {award.title}</p>
                                    <p className="text--[10px] opacity-40 pl-4">{award.issuer} | {award.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-sm bg-[#00ff9d]/5 px-2 py-1 mb-4 border-l-4 border-[#00ff9d]">~/interests.txt</h2>
                        <div className="flex flex-wrap gap-2 text-[10px] opacity-70">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="border border-[#00ff9d]/30 px-2 py-1 rounded-sm">"{interest}"</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),
    bold: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl flex resume-page font-inter">
            <div className="w-20 flex-shrink-0" style={{ backgroundColor: primaryColor }}></div>
            <div className="p-16 flex-1">
                <header className="mb-20">
                    <h1 className="text-8xl font-black uppercase leading-[0.8] tracking-tighter mb-8">{data.personalInfo.fullName.split(' ')[0]}<br />{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
                    <div className="w-24 h-4 bg-black mb-8" style={{ backgroundColor: primaryColor }}></div>
                    <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
                        <span className="text-black">{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                    </div>
                </header>
                <div className="space-y-16">
                    <section>
                        <h2 className="text-2xl font-black uppercase italic skew-x-[-12deg] inline-block bg-black text-white px-6 py-2 mb-8" style={{ backgroundColor: primaryColor }}>Experience</h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="border-l-8 border-black pl-8" style={{ borderColor: primaryColor }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-black uppercase">{exp.company}</h3>
                                        <span className="text-sm font-bold opacity-40">{exp.startDate} - {exp.endDate || 'NOW'}</span>
                                    </div>
                                    <p className="text-sm font-black uppercase mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm font-medium leading-relaxed text-gray-600">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-16">
                        <section>
                            <h2 className="text-xl font-black uppercase mb-8 border-b-4 border-black inline-block">Skills</h2>
                            <div className="flex flex-wrap gap-4">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="text-xs font-black uppercase tracking-widest bg-gray-100 px-3 py-1">{s}</span>
                                ))}
                            </div>
                        </section>
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-xl font-black uppercase mb-8 border-b-4 border-black inline-block">Academic</h2>
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="border-l-4 border-gray-200 pl-4">
                                            <p className="text-sm font-black uppercase">{edu.school}</p>
                                            <p className="text-xs font-bold text-gray-400 mt-1">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black uppercase italic skew-x-[-12deg] inline-block bg-black text-white px-6 py-2 mb-8" style={{ backgroundColor: primaryColor }}>Selected Works</h2>
                            <div className="grid grid-cols-2 gap-12">
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="text-lg font-black uppercase mb-2">{proj.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black uppercase mb-8 border-b-4 border-black inline-block">Certifications</h2>
                            <div className="space-y-6">
                                {data.certifications.map((cert, i) => (
                                    <div key={i} className="border-l-4 border-gray-200 pl-4">
                                        <p className="text-sm font-black uppercase">{cert.name}</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1">{cert.issuer} • {cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black uppercase mb-8 border-b-4 border-black inline-block">Awards</h2>
                            <div className="space-y-6">
                                {data.awards.map((award, i) => (
                                    <div key={i} className="border-l-4 border-gray-200 pl-4">
                                        <p className="text-sm font-black uppercase">{award.title}</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1">{award.issuer} • {award.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black uppercase mb-8 border-b-4 border-black inline-block">Interests</h2>
                            <div className="flex flex-wrap gap-4">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="text-xs font-black uppercase tracking-widest bg-gray-100 px-3 py-1">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),
    soft: ({ data, primaryColor }) => (
        <div className="bg-[#fdf9f4] w-[794px] mx-auto shadow-2xl p-16 resume-page font-outfit text-slate-700">
            <header className="flex justify-between items-center mb-16">
                <div>
                    <h1 className="text-5xl font-black text-slate-800 tracking-tight mb-2">{data.personalInfo.fullName}</h1>
                    <p className="text-lg font-medium text-slate-400">{data.experience[0]?.position}</p>
                </div>
                <div className="w-24 h-24 rounded-full p-1 border-2 border-slate-100 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white" style={{ backgroundColor: primaryColor }}>
                        {data.personalInfo.fullName.charAt(0)}
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-8 space-y-12">
                    <section className="bg-white p-8 rounded-[40px] shadow-sm space-y-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200">The Journey</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-300">
                                    <span>{exp.company}</span>
                                    <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{exp.position}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-light">{exp.description}</p>
                                {i < data.experience.length - 1 && <div className="h-px w-full bg-slate-50 mt-8"></div>}
                            </div>
                        ))}
                    </section>

                    {data.projects && data.projects.length > 0 && (
                        <section className="bg-white p-10 rounded-[40px] shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-8">Crafted Projects</h2>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">{proj.name}</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed font-light">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className="col-span-4 space-y-8">
                    <section className="bg-white p-8 rounded-[40px] shadow-sm">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-6">Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((s, i) => (
                                <span key={i} className="px-4 py-2 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500" style={{ color: i % 2 === 0 ? primaryColor : undefined }}>{s}</span>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section className="bg-white p-8 rounded-[40px] shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-6">Education</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="text-sm font-bold text-slate-800">{edu.school}</p>
                                        <p className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section className="bg-white p-8 rounded-[40px] shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-6">Vocal</h2>
                            <div className="space-y-3">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-slate-800 tracking-tight">{l.language}</span>
                                        <span className="text-slate-200 text-[10px] uppercase">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section className="bg-white p-8 rounded-[40px] shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-6">Certifications</h2>
                            <div className="space-y-6">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <p className="text-sm font-bold text-slate-800">{cert.name}</p>
                                        <p className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section className="bg-white p-8 rounded-[40px] shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-6">Awards</h2>
                            <div className="space-y-6">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <p className="text-sm font-bold text-slate-800">{award.title}</p>
                                        <p className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section className="bg-white p-8 rounded-[40px] shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-6">Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-4 py-2 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),
    neon: ({ data, primaryColor }) => (
        <div className="bg-[#0f172a] w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-white">
            <header className="mb-20">
                <h1 className="text-7xl font-black tracking-tighter mb-4 italic" style={{ textShadow: `0 0 20px ${primaryColor}77` }}>{data.personalInfo.fullName}</h1>
                <div className="h-1 w-full flex bg-slate-800">
                    <div className="h-full w-1/4" style={{ backgroundColor: primaryColor, boxShadow: `0 0 15px ${primaryColor}` }}></div>
                </div>
                <div className="mt-6 flex gap-10 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                    <span style={{ color: primaryColor }}>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-16">
                <div className="col-span-7 space-y-16">
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 flex items-center gap-6">Exp <div className="h-px flex-1 bg-slate-800"></div></h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <h3 className="text-xl font-bold tracking-tight">{exp.company}</h3>
                                        <span className="text-xs font-bold text-slate-500">{exp.startDate} - {exp.endDate || 'NOW'}</span>
                                    </div>
                                    <p className="text-sm font-black uppercase mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="col-span-5 space-y-16">
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 border-b border-slate-800 pb-4">Skills</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-3 h-3 border-2" style={{ borderColor: primaryColor }}></div>
                                    <span className="text-xs font-bold uppercase tracking-widest">{s}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 border-b border-slate-800 pb-4">Education</h2>
                            <div className="space-y-8">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-lg font-bold">{edu.school}</h3>
                                        <p className="text-xs text-slate-500 mt-2">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 border-b border-slate-800 pb-4">Projects</h2>
                            <div className="space-y-8">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="p-6 border border-slate-800 hover:border-white transition-colors">
                                        <h3 className="text-sm font-black uppercase mb-3" style={{ color: primaryColor }}>{proj.name}</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 border-b border-slate-800 pb-4">Certifications</h2>
                            <div className="space-y-8">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold">{cert.name}</h3>
                                        <p className="text-xs text-slate-500 mt-2">{cert.issuer} • {cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 border-b border-slate-800 pb-4">Awards</h2>
                            <div className="space-y-8">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold">{award.title}</h3>
                                        <p className="text-xs text-slate-500 mt-2">{award.issuer} • {award.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 border-b border-slate-800 pb-4">Languages</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-xs font-bold uppercase">{l.language}</span>
                                        <span className="text-[10px] text-slate-500">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-10 border-b border-slate-800 pb-4">Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-3 py-1 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),
    metro: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl resume-page font-inter overflow-hidden border-8 border-slate-100">
            <div className="grid grid-cols-12 grid-rows-6 h-[1122px] gap-2 p-2">
                <div className="col-span-8 row-span-2 p-12 text-white flex flex-col justify-end" style={{ backgroundColor: primaryColor }}>
                    <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">{data.personalInfo.fullName}</h1>
                    <p className="text-xl font-light opacity-80">{data.experience[0]?.position}</p>
                </div>
                <div className="col-span-4 row-span-1 bg-slate-900 p-8 text-white text-xs font-bold uppercase flex flex-col justify-center gap-2">
                    <p className="opacity-40 tracking-widest mb-1">Contact</p>
                    <p>{data.personalInfo.email}</p>
                    <p>{data.personalInfo.phone}</p>
                </div>
                <div className="col-span-4 row-span-2 bg-slate-100 p-10 flex flex-col gap-6">
                    <h2 className="text-xs font-black uppercase tracking-widest opacity-30">Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-[10px] font-bold uppercase tracking-wider">{s}</span>
                        ))}
                    </div>
                </div>
                <div className="col-span-8 row-span-4 p-12 space-y-12">
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-300">Working History</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="group">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-xl font-bold">{exp.company}</h3>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{exp.startDate} - {exp.endDate || 'Now'}</span>
                            </div>
                            <p className="text-sm font-black uppercase mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{exp.description}</p>
                        </div>
                    ))}
                </div>
                <div className="col-span-4 row-span-1 bg-slate-50 p-10 flex flex-col gap-4">
                    <h2 className="text-xs font-black uppercase tracking-widest opacity-30 mb-2 italic">Academic</h2>
                    {data.education.map((edu, i) => (
                        <div key={i}>
                            <p className="text-xs font-bold text-slate-600">{edu.school}</p>
                            <p className="text-[10px] text-slate-400">{edu.degree}</p>
                        </div>
                    ))}
                </div>

                <div className="col-span-4 row-span-2 bg-slate-100 p-10 flex flex-col gap-8 overflow-hidden">
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-widest opacity-30 mb-2 italic">Certifications</h2>
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="mb-2">
                                    <p className="text-xs font-bold text-slate-600">{cert.name}</p>
                                    <p className="text-[10px] text-slate-400">{cert.issuer}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-widest opacity-30 mb-2 italic">Awards</h2>
                            {data.awards.map((award, i) => (
                                <div key={i} className="mb-2">
                                    <p className="text-xs font-bold text-slate-600">{award.title}</p>
                                    <p className="text-[10px] text-slate-400">{award.issuer}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-widest opacity-30 mb-2 italic">Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-2 py-1 bg-white text-[9px] font-bold uppercase tracking-wider">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                {data.projects && data.projects.length > 0 && (
                    <div className="col-span-12 row-span-1 border-t border-slate-100 p-8 grid grid-cols-3 gap-8">
                        {data.projects.map((proj, i) => (
                            <div key={i}>
                                <h3 className="text-xs font-black uppercase mb-2" style={{ color: primaryColor }}>{proj.name}</h3>
                                <p className="text-[10px] text-slate-400 line-clamp-2">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    ),
    brutal: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-mono text-black">
            <header className="border-[6px] border-black p-10 mb-16 shadow-[12px_12px_0_0_#000]">
                <h1 className="text-6xl font-black uppercase leading-[0.8] mb-6 tracking-tighter">{data.personalInfo.fullName}</h1>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="bg-black text-white px-2 py-1">{data.personalInfo.email}</span>
                    <span className="border-2 border-black px-2 py-1" style={{ backgroundColor: `${primaryColor}22` }}>{data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="space-y-16">
                <div className="grid grid-cols-2 gap-16">
                    <section>
                        <h2 className="text-4xl font-black uppercase mb-10 bg-black text-white px-4 py-2 inline-block">Work</h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="border-4 border-black p-8 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] transition-all bg-white relative">
                                    <div className="absolute right-8 top-8 font-black text-xs uppercase opacity-30">{exp.startDate} — {exp.endDate || 'CURR'}</div>
                                    <h3 className="text-2xl font-black uppercase mb-2">{exp.company}</h3>
                                    <p className="text-sm font-black mb-6 underline underline-offset-4" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm font-medium leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-10 bg-black text-white px-4 py-2 inline-block">Skills</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.skills.map((s, i) => (
                                    <div key={i} className="text-sm font-black uppercase border-b-2 border-black pb-1">{s}</div>
                                ))}
                            </div>
                        </section>

                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-10 bg-black text-white px-4 py-2 inline-block">Study</h2>
                                <div className="space-y-8">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="p-4 border-2 border-black">
                                            <p className="text-lg font-black uppercase">{edu.school}</p>
                                            <p className="text-xs font-bold opacity-40 mt-1">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-10 bg-black text-white px-4 py-2 inline-block">Works</h2>
                                <div className="space-y-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i} className="border-l-8 border-black pl-4">
                                            <h3 className="text-sm font-black uppercase mb-1">{proj.name}</h3>
                                            <p className="text-xs font-medium">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-10 bg-black text-white px-4 py-2 inline-block">Certifications</h2>
                                <div className="space-y-8">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i} className="border-l-8 border-black pl-4">
                                            <p className="text-sm font-black uppercase mb-1">{cert.name}</p>
                                            <p className="text-xs font-medium">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-10 bg-black text-white px-4 py-2 inline-block">Awards</h2>
                                <div className="space-y-8">
                                    {data.awards.map((award, i) => (
                                        <div key={i} className="border-l-8 border-black pl-4">
                                            <p className="text-sm font-black uppercase mb-1">{award.title}</p>
                                            <p className="text-xs font-medium">{award.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-10 bg-black text-white px-4 py-2 inline-block">Interests</h2>
                                <div className="flex flex-wrap gap-4">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-sm font-black uppercase border-2 border-black px-2 py-1 bg-white hover:bg-black hover:text-white transition-colors">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),
    vogue: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-playfair text-slate-900">
            <header className="text-center mb-24 flex flex-col items-center">
                <div className="h-px w-24 bg-slate-200 mb-8"></div>
                <h1 className="text-7xl font-bold italic tracking-tighter mb-4">{data.personalInfo.fullName}</h1>
                <p className="text-sm font-light tracking-[0.8em] text-slate-400 uppercase mb-8">{data.experience[0]?.position}</p>
                <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 italic">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
                <div className="h-px w-24 bg-slate-200 mt-8"></div>
            </header>
            <div className="grid grid-cols-12 gap-16">
                <div className="col-span-12">
                    <section className="text-center max-w-2xl mx-auto mb-20 italic font-lora text-xl leading-relaxed text-slate-500">
                        "{data.personalInfo.summary}"
                    </section>
                    <section className="mb-24">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-slate-300 mb-12 text-center">Selected Career Highlights</h2>
                        <div className="space-y-20">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="grid grid-cols-12 gap-8 items-start">
                                    <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest italic text-slate-300 pt-2">{exp.startDate} — {exp.endDate || 'Now'}</div>
                                    <div className="col-span-9 border-l border-slate-100 pl-10">
                                        <h3 className="text-2xl font-bold mb-1 italic" style={{ color: primaryColor }}>{exp.company}</h3>
                                        <p className="text-xs font-bold uppercase tracking-[0.3em] mb-6 opacity-40">{exp.position}</p>
                                        <p className="text-sm font-lora leading-relaxed text-slate-600 text-justify">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-20 mb-24">
                        <section>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-slate-300 mb-12 text-center">Core Competencies</h2>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="text-sm font-bold uppercase tracking-widest text-slate-800">{s}</span>
                                ))}
                            </div>
                        </section>
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-slate-300 mb-12 text-center">Academic History</h2>
                                <div className="space-y-8 text-center">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-lg font-bold italic">{edu.school}</h3>
                                            <p className="text-xs uppercase tracking-widest text-slate-400 mt-2">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-slate-300 mb-12 text-center">Notable Projects</h2>
                            <div className="grid grid-cols-2 gap-16">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="border-b border-slate-50 pb-8 last:border-0 text-center">
                                        <h3 className="text-xl font-bold italic mb-4" style={{ color: primaryColor }}>{proj.name}</h3>
                                        <p className="text-sm font-lora text-slate-500 leading-relaxed italic">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),
    geometric: ({ data, primaryColor }) => (
        <div className="bg-slate-50 w-[794px] mx-auto shadow-2xl resume-page font-outfit overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-[100px] rotate-[35deg] translate-x-1/2 -translate-y-1/2 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full translate-y-1/2 -translate-x-1/2 z-0 opacity-20" style={{ backgroundColor: primaryColor }}></div>
            <div className="relative z-10 p-16">
                <header className="mb-20">
                    <h1 className="text-6xl font-black tracking-tight mb-2 uppercase text-slate-900">{data.personalInfo.fullName}</h1>
                    <div className="flex gap-4 items-center">
                        <div className="h-2 w-12 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">{data.experience[0]?.position}</p>
                    </div>
                </header>
                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-7 bg-white/50 backdrop-blur-sm p-10 rounded-[40px] border border-white space-y-12">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 border-b pb-4">Experience</h2>
                            <div className="space-y-10">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <h3 className="text-lg font-bold mb-1 text-slate-800">{exp.company}</h3>
                                        <p className="text-sm font-bold opacity-40 mb-3">{exp.position} • {exp.startDate} - {exp.endDate || 'Present'}</p>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                    <div className="col-span-5 space-y-12">
                        <section className="bg-slate-900 text-white p-10 rounded-[40px] shadow-xl">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-6">Expertise</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {data.skills.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <span className="text-xs font-bold tracking-widest">{s}</span>
                                        <div className="w-1.5 h-1.5 rotate-45 group-hover:rotate-0 transition-transform" style={{ backgroundColor: primaryColor }}></div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.education && data.education.length > 0 && (
                            <section className="bg-white p-10 rounded-[40px] border border-slate-100">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Education</h2>
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{edu.school}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && data.projects.length > 0 && (
                            <section className="p-10">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 border-b pb-4">Projects</h2>
                                <div className="space-y-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tight">{proj.name}</h3>
                                            <p className="text-[10px] text-slate-400 line-clamp-3">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section className="bg-white p-10 rounded-[40px] border border-slate-100">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Certifications</h2>
                                <div className="space-y-6">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i}>
                                            <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{cert.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section className="p-10">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 border-b pb-4">Awards</h2>
                                <div className="space-y-6">
                                    {data.awards.map((award, i) => (
                                        <div key={i}>
                                            <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{award.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{award.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section className="bg-slate-900 text-white p-10 rounded-[40px] shadow-xl">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-6">Interests</h2>
                                <div className="flex flex-wrap gap-4">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-xs font-bold tracking-widest">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),
    timeline: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter">
            <header className="mb-20">
                <h1 className="text-5xl font-black text-slate-900 mb-2">{data.personalInfo.fullName}</h1>
                <p className="text-lg text-slate-400 font-bold uppercase tracking-widest">{data.experience[0]?.position}</p>
            </header>
            <div className="relative pl-8 border-l-4 border-slate-100 space-y-16">
                {data.experience.map((exp, i) => (
                    <div key={i} className="relative">
                        <div className="absolute -left-[38px] top-1 w-4 h-4 rounded-full bg-white border-4" style={{ borderColor: primaryColor }}></div>
                        <div className="flex justify-between items-baseline mb-4">
                            <h3 className="text-2xl font-bold text-slate-800">{exp.company}</h3>
                            <span className="text-sm font-black uppercase tracking-widest text-slate-300">{exp.startDate} — {exp.endDate || 'Present'}</span>
                        </div>
                        <p className="text-sm font-bold uppercase mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                        <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-16 grid grid-cols-2 gap-16 border-t pt-16">
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8 underline decoration-4 underline-offset-8" style={{ textDecorationColor: primaryColor }}>Core Expert</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded uppercase tracking-widest">{s}</span>
                        ))}
                    </div>
                </section>
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8 underline decoration-4 underline-offset-8" style={{ textDecorationColor: primaryColor }}>Academic</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{edu.school}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {data.projects && data.projects.length > 0 && (
                <section className="mt-16 border-t pt-16">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-12 text-center italic">Project Timeline</h2>
                    <div className="grid grid-cols-3 gap-8">
                        {data.projects.map((proj, i) => (
                            <div key={i} className="text-center">
                                <h3 className="text-xs font-black uppercase mb-3" style={{ color: primaryColor }}>{proj.name}</h3>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            < div className="mt-16 border-t pt-16 grid grid-cols-3 gap-16" >
                {
                    data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8 underline decoration-4 underline-offset-8" style={{ textDecorationColor: primaryColor }}>Certifications</h2>
                            <div className="space-y-6">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{cert.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }

                {
                    data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8 underline decoration-4 underline-offset-8" style={{ textDecorationColor: primaryColor }}>Awards</h2>
                            <div className="space-y-6">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{award.title}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }

                {
                    data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8 underline decoration-4 underline-offset-8" style={{ textDecorationColor: primaryColor }}>Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded uppercase tracking-widest">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )
                }
            </div >
        </div >
    ),
    formal: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-20 resume-page font-serif text-slate-900 border-[20px] border-slate-50">
            <header className="text-center mb-16 border-b pb-12">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">{data.personalInfo.fullName}</h1>
                <div className="text-sm space-x-4 opacity-60 italic">
                    <span>{data.personalInfo.email}</span>
                    <span>|</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>
            <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center text-slate-400 font-sans">Professional Experience</h2>
                <div className="space-y-10">
                    {data.experience.map((exp, i) => (
                        <div key={i}>
                            <div className="flex justify-between font-bold text-lg mb-1">
                                <span>{exp.company}</span>
                                <span className="text-sm">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="italic text-slate-600 mb-4">{exp.position}</p>
                            <p className="text-sm leading-relaxed text-justify">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-2 gap-20 mt-16 border-t pt-16">
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-slate-400 font-sans">Education & Credentials</h2>
                    <div className="space-y-8">
                        {data.education.map((edu, i) => (
                            <div key={i}>
                                <h3 className="font-bold text-base uppercase tracking-tight">{edu.school}</h3>
                                <p className="text-sm italic text-slate-500 mt-1">{edu.degree}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-slate-400 font-sans">Core Proficiencies</h2>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                        {data.skills.map((s, i) => (
                            <div key={i} className="text-sm flex items-center gap-2">
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                {s}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {data.projects && data.projects.length > 0 && (
                <section className="mt-16 border-t pt-16">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center text-slate-400 font-sans">Selected Portfolio Works</h2>
                    <div className="space-y-12">
                        {data.projects.map((proj, i) => (
                            <div key={i} className="text-center">
                                <h3 className="font-bold text-lg italic mb-2">{proj.name}</h3>
                                <p className="text-sm leading-relaxed max-w-2xl mx-auto">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            < div className="grid grid-cols-2 gap-20 mt-16 border-t pt-16" >
                {
                    data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-slate-400 font-sans">Certifications</h2>
                            <div className="space-y-8">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-base uppercase tracking-tight">{cert.name}</h3>
                                        <p className="text-sm italic text-slate-500 mt-1">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }
                {
                    data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-slate-400 font-sans">Awards</h2>
                            <div className="space-y-8">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-base uppercase tracking-tight">{award.title}</h3>
                                        <p className="text-sm italic text-slate-500 mt-1">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }
            </div >

            {
                data.interests && data.interests.length > 0 && (
                    <section className="mt-16 border-t pt-16 text-center">
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-slate-400 font-sans">Interests & Hobbies</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="text-sm italic text-slate-600">{interest}</span>
                            ))}
                        </div>
                    </section>
                )
            }
        </div >
    ),
    compact: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-8 resume-page font-inter text-[11px] leading-tight text-slate-700">
            <div className="flex justify-between items-center border-b-2 pb-4 mb-6" style={{ borderColor: primaryColor }}>
                <h1 className="text-2xl font-black uppercase">{data.personalInfo.fullName}</h1>
                <div className="text-right space-y-0.5 opacity-60">
                    <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
                    <p>{data.personalInfo.address}</p>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-6">
                    <section>
                        <h2 className="font-black uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor }}>Experience</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between font-bold">
                                    <span>{exp.company} — {exp.position}</span>
                                    <span>{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="mt-1 opacity-80">{exp.description}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className="col-span-4 space-y-6">
                    <section>
                        <h2 className="font-black uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor }}>Skills</h2>
                        <div className="flex flex-wrap gap-1">
                            {data.skills.map((s, i) => (
                                <span key={i} className="bg-slate-50 px-1.5 py-0.5 rounded border">{s}</span>
                            ))}
                        </div>
                    </section>
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor }}>Education</h2>
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-3">
                                    <p className="font-bold">{edu.school}</p>
                                    <p className="text-[10px] opacity-60 italic">{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    )}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor }}>Works</h2>
                            {data.projects.map((proj, i) => (
                                <div key={i} className="mb-3">
                                    <p className="font-bold uppercase text-[10px]">{proj.name}</p>
                                    <p className="text-[10px] opacity-60 mt-0.5">{proj.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor }}>Certifications</h2>
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="mb-3">
                                    <p className="font-bold uppercase text-[10px]">{cert.name}</p>
                                    <p className="text-[10px] opacity-60 mt-0.5">{cert.issuer}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor }}>Awards</h2>
                            {data.awards.map((award, i) => (
                                <div key={i} className="mb-3">
                                    <p className="font-bold uppercase text-[10px]">{award.title}</p>
                                    <p className="text-[10px] opacity-60 mt-0.5">{award.issuer}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="font-black uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor }}>Interests</h2>
                            <div className="flex flex-wrap gap-1">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="bg-slate-50 px-1.5 py-0.5 rounded border">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),
    slate: ({ data, primaryColor }) => (
        <div className="bg-[#1e293b] w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-300">
            <header className="mb-20 flex justify-between items-start">
                <div>
                    <h1 className="text-6xl font-black text-white tracking-tighter mb-2">{data.personalInfo.fullName}</h1>
                    <p className="text-xl font-bold uppercase tracking-[0.3em]" style={{ color: primaryColor }}>{data.experience[0]?.position}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl text-xs font-medium space-y-2 border border-white/10">
                    <p className="text-white">{data.personalInfo.email}</p>
                    <p>{data.personalInfo.phone}</p>
                </div>
            </header>
            <div className="space-y-16">
                {data.experience.map((exp, i) => (
                    <div key={i} className="group flex gap-8">
                        <div className="w-32 flex-shrink-0 text-xs font-black uppercase tracking-widest opacity-20 pt-2 group-hover:opacity-100 transition-opacity" style={{ color: primaryColor }}>{exp.startDate}<br />{exp.endDate || 'Now'}</div>
                        <div className="flex-1 border-l border-white/10 pl-8 pb-8">
                            <h3 className="text-2xl font-bold text-white mb-1">{exp.company}</h3>
                            <p className="text-sm font-bold italic mb-4 opacity-50">{exp.position}</p>
                            <p className="text-sm leading-relaxed text-slate-400">{exp.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 grid grid-cols-2 gap-16">
                <section>
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-4">Knowledge Base</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.skills.map((s, i) => (
                            <div key={i} className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-white/20" style={{ backgroundColor: primaryColor }}></div>
                                {s}
                            </div>
                        ))}
                    </div>
                </section>
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-4">Academic Log</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="text-xs font-bold text-white uppercase">{edu.school}</h3>
                                    <p className="text-[10px] opacity-40 mt-1">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {data.projects && data.projects.length > 0 && (
                <section className="mt-20">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-4">Selected Deployments</h2>
                    <div className="grid grid-cols-3 gap-8">
                        {data.projects.map((proj, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <h3 className="text-xs font-black uppercase mb-3" style={{ color: primaryColor }}>{proj.name}</h3>
                                <p className="text-[10px] opacity-40 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            < div className="mt-20 grid grid-cols-2 gap-16" >
                {
                    data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-4">Credentials</h2>
                            <div className="space-y-6">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-xs font-bold text-white uppercase">{cert.name}</h3>
                                        <p className="text-[10px] opacity-40 mt-1">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }
                {
                    data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-4">Achievements</h2>
                            <div className="space-y-6">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-xs font-bold text-white uppercase">{award.title}</h3>
                                        <p className="text-[10px] opacity-40 mt-1">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }
            </div >

            {
                data.interests && data.interests.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-4">Personal Interests</h2>
                        <div className="flex flex-wrap gap-4">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">{interest}</span>
                            ))}
                        </div>
                    </section>
                )
            }
        </div >
    ),
    minimalSidebar: ({ data, primaryColor }) => (
        <div className="bg-[#f8fafc] w-[794px] mx-auto shadow-2xl flex resume-page font-inter">
            <div className="w-16 bg-slate-900 flex flex-col items-center py-12 gap-8">
                <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white text-xs font-bold">KP</div>
            </div>
            <div className="flex-1 p-16">
                <header className="mb-16">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase mb-2">{data.personalInfo.fullName}</h1>
                    <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">{data.experience[0]?.position}</p>
                </header>
                <div className="grid grid-cols-2 gap-16">
                    <section>
                        <SectionHeader title="Experience" color={primaryColor} variant="line" />
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                                        <span>{exp.company}</span>
                                        <span className="opacity-40">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-xs font-bold mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-light">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="Expertise" color={primaryColor} variant="line" />
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="text-xs font-bold uppercase tracking-widest text-slate-600 flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-slate-300" style={{ backgroundColor: primaryColor }}></div>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section>
                            <SectionHeader title="Education" color={primaryColor} variant="line" />
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-6">
                                    <p className="text-sm font-bold text-slate-800">{edu.school}</p>
                                    <p className="text-xs font-medium text-slate-400 mt-1">{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <SectionHeader title="Projects" color={primaryColor} variant="line" />
                            <div className="space-y-8">
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="text-xs font-black uppercase mb-2 tracking-widest">{proj.name}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <SectionHeader title="Certifications" color={primaryColor} variant="line" />
                            <div className="space-y-6">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <p className="text-sm font-bold text-slate-800">{cert.name}</p>
                                        <p className="text-xs font-medium text-slate-400 mt-1">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <SectionHeader title="Awards" color={primaryColor} variant="line" />
                            <div className="space-y-6">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <p className="text-sm font-bold text-slate-800">{award.title}</p>
                                        <p className="text-xs font-medium text-slate-400 mt-1">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <SectionHeader title="Interests" color={primaryColor} variant="line" />
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-3 py-1 bg-white text-xs font-bold uppercase tracking-widest text-slate-600 border border-slate-100 rounded">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),
    gradient: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl resume-page font-inter overflow-hidden">
            <div className="h-4 w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, #8b5cf6)` }}></div>
            <header className="p-16 pb-12">
                <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4">{data.personalInfo.fullName}</h1>
                <div className="flex gap-10 items-center">
                    <p className="text-lg font-bold uppercase tracking-widest text-slate-400">{data.experience[0]?.position}</p>
                    <div className="h-px w-20 bg-slate-100"></div>
                </div>
            </header>
            <div className="px-16 pb-16 grid grid-cols-12 gap-12">
                <div className="col-span-4 bg-slate-50 p-8 rounded-3xl space-y-10">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Expertise</h2>
                        <div className="space-y-3">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-baseline gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{s}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Academic</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold text-slate-800 uppercase leading-snug">{edu.school}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 italic">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Works</h2>
                            <div className="space-y-6">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                                        <p className="text-[10px] font-black uppercase mb-2" style={{ color: primaryColor }}>{proj.name}</p>
                                        <p className="text-[10px] text-slate-400 line-clamp-2">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Certifications</h2>
                            <div className="space-y-6">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold text-slate-800 uppercase leading-snug">{cert.name}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 italic">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Awards</h2>
                            <div className="space-y-6">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold text-slate-800 uppercase leading-snug">{award.title}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 italic">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-2 py-1 bg-white text-[9px] font-bold text-slate-500 rounded uppercase tracking-widest border border-slate-100">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className="col-span-8 space-y-12">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 border-b pb-4">Timeline</h2>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{exp.company}</h3>
                                        <span className="text-xs font-bold text-slate-400">{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <p className="text-sm font-bold opacity-60 italic mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-light">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    ),
    accent: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl flex resume-page font-inter">
            <div className="w-1/3 p-12 text-white flex flex-col gap-10" style={{ backgroundColor: primaryColor }}>
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">{data.personalInfo.fullName}</h1>
                    <div className="text-xs space-y-2 opacity-80">
                        <p>{data.personalInfo.email}</p>
                        <p>{data.personalInfo.phone}</p>
                        {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
                    </div>
                </div>
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-40 border-b border-white/20 pb-2">Top Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((s, i) => (
                            <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded">{s}</span>
                        ))}
                    </div>
                </section>
                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-40 border-b border-white/20 pb-2">Certifications</h2>
                        <div className="space-y-4">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="text-[10px]">
                                    <p className="font-bold">{cert.name}</p>
                                    <p className="opacity-60">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-40 border-b border-white/20 pb-2">Awards</h2>
                        <div className="space-y-4">
                            {data.awards.map((award, i) => (
                                <div key={i} className="text-[10px]">
                                    <p className="font-bold">{award.title}</p>
                                    <p className="opacity-60">{award.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-40 border-b border-white/20 pb-2">Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <div className="w-2/3 p-16 space-y-12">
                <section>
                    <SectionHeader title="Experience" color={primaryColor} variant="line" />
                    <div className="space-y-10">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{exp.company}</h3>
                                    <span className="text-xs font-bold text-slate-400">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-sm text-slate-500 leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {data.education && data.education.length > 0 && (
                    <section>
                        <SectionHeader title="Education" color={primaryColor} variant="line" />
                        <div className="space-y-6">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-base font-bold text-slate-800">{edu.school}</h3>
                                        <span className="text-xs font-bold text-slate-400">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest">{edu.degree} in {edu.fieldOfStudy}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <SectionHeader title="Projects" color={primaryColor} variant="line" />
                        <div className="grid grid-cols-2 gap-6">
                            {data.projects.map((p, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{p.name}</h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-2">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.languages && data.languages.length > 0 && (
                    <section>
                        <SectionHeader title="Languages" color={primaryColor} variant="line" />
                        <div className="flex flex-wrap gap-4">
                            {data.languages.map((l, i) => (
                                <div key={i} className="text-sm text-slate-600 font-medium">
                                    {l.language} <span className="text-xs text-slate-400">({l.proficiency})</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),
    folio: ({ data, primaryColor }) => (
        <div className="bg-[#111] w-[794px] mx-auto shadow-2xl p-20 resume-page font-outfit text-white">
            <header className="mb-24 flex justify-between items-end border-b border-white/10 pb-12">
                <div className="max-w-md">
                    <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6">{data.personalInfo.fullName}</h1>
                    <p className="text-xl font-bold opacity-30 uppercase tracking-[0.4em]">{data.experience[0]?.position}</p>
                </div>
                <div className="text-right text-xs font-bold uppercase tracking-widest leading-loose">
                    <p style={{ color: primaryColor }}>{data.personalInfo.email}</p>
                    <p>{data.personalInfo.phone}</p>
                    <p className="opacity-30">{data.personalInfo.address}</p>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-20">
                <div className="col-span-12">
                    <section className="mb-24">
                        <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Profile</h2>
                        <p className="text-lg opacity-60 leading-relaxed max-w-4xl italic font-light">"{data.personalInfo.summary}"</p>
                    </section>

                    <div className="columns-2 gap-20">
                        <section className="break-inside-avoid">
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Experience</h2>
                            {data.experience.map((exp, i) => (
                                <div key={i} className="mb-12 border-l-2 pl-8" style={{ borderColor: primaryColor }}>
                                    <h3 className="text-2xl font-bold mb-1">{exp.company}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-4">{exp.position} / {exp.startDate}-{exp.endDate || 'Present'}</p>
                                    <p className="text-sm opacity-60 leading-relaxed mb-6">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                        {data.education && data.education.length > 0 && (
                            <section className="break-inside-avoid mb-12">
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Academic</h2>
                                {data.education.map((edu, i) => (
                                    <div key={i} className="mb-8 border-l-2 pl-8" style={{ borderColor: primaryColor }}>
                                        <h3 className="text-xl font-bold mb-1">{edu.school}</h3>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-2">{edu.degree}</p>
                                        <p className="text-[10px] opacity-30 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                        {data.projects && data.projects.length > 0 && (
                            <section className="break-inside-avoid mb-12">
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Projects</h2>
                                <div className="space-y-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i} className="border-l-2 pl-8" style={{ borderColor: primaryColor }}>
                                            <h3 className="text-xl font-bold mb-2">{proj.name}</h3>
                                            <p className="text-sm opacity-60 leading-relaxed mb-4">{proj.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {proj.technologies.slice(0, 3).map((tech, j) => (
                                                    <span key={j} className="text-[10px] font-bold uppercase tracking-tighter opacity-30">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        <section className="break-inside-avoid mb-12">
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Specializations</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.skills.map((s, i) => (
                                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded flex items-center justify-between text-xs font-bold group hover:bg-white text-white hover:text-black transition-all">
                                        <span>{s}</span>
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {data.languages && data.languages.length > 0 && (
                            <section className="break-inside-avoid mb-12">
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Communication</h2>
                                <div className="space-y-4">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs font-bold opacity-60 uppercase tracking-widest">
                                            <span>{l.language}</span>
                                            <span>{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                            <section className="break-inside-avoid mb-12">
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Credentials</h2>
                                <div className="space-y-6">
                                    {(data.certifications || []).map((c, i) => (
                                        <div key={i}>
                                            <p className="text-lg font-bold">{c.name}</p>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-30 mt-1">{c.issuer}</p>
                                        </div>
                                    ))}
                                    {(data.awards || []).map((a, i) => (
                                        <div key={`a-${i}`}>
                                            <p className="text-lg font-bold">{a.title}</p>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-30 mt-1">{a.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {data.interests && data.interests.length > 0 && (
                            <section className="break-inside-avoid">
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Interests</h2>
                                <div className="flex flex-wrap gap-4">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-xs font-bold uppercase tracking-widest opacity-60 italic">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),
    hybrid: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl resume-page font-inter">
            <header className="p-16 grid grid-cols-12 gap-10 items-center">
                <div className="col-span-8">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4">{data.personalInfo.fullName}</h1>
                    <div className="flex gap-6 text-sm font-bold text-slate-400">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                    </div>
                </div>
                <div className="col-span-4 bg-slate-50 p-6 rounded-2xl flex flex-col items-center border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-2 underline decoration-4 underline-offset-8" style={{ textDecorationColor: primaryColor }}>Professional Role</p>
                    <p className="text-lg font-bold text-slate-800 uppercase tracking-widest">{data.experience[0]?.position}</p>
                </div>
            </header>
            <div className="px-16 pb-16 grid grid-cols-12 gap-16">
                <div className="col-span-4 space-y-12">
                    <section>
                        <SectionHeader title="Expertise" color={primaryColor} variant="line" />
                        <div className="space-y-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold uppercase tracking-wider">{s}</span>
                                        <span className="text-[10px] opacity-40">90%</span>
                                    </div>
                                    <div className="h-0.5 w-full bg-slate-100">
                                        <div className="h-full" style={{ backgroundColor: primaryColor, width: '90%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <SectionHeader title="Certifications" color={primaryColor} variant="line" />
                            <div className="space-y-4">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold uppercase tracking-wider">{cert.name}</p>
                                        <p className="text-[10px] opacity-40">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <SectionHeader title="Awards" color={primaryColor} variant="line" />
                            <div className="space-y-4">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold uppercase tracking-wider">{award.title}</p>
                                        <p className="text-[10px] opacity-40">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <SectionHeader title="Interests" color={primaryColor} variant="line" />
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 rounded border border-slate-100">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className="col-span-8 flex flex-col gap-12">
                    <section>
                        <SectionHeader title="Professional Summary" color={primaryColor} variant="line" />
                        <p className="text-sm text-slate-500 leading-relaxed font-light">{data.personalInfo.summary}</p>
                    </section>
                    <section>
                        <SectionHeader title="Work History" color={primaryColor} variant="line" />
                        <div className="space-y-8">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                                        <span>{exp.company}</span>
                                        <span className="text-xs opacity-40 uppercase">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-3 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-light">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {data.education && data.education.length > 0 && (
                        <section>
                            <SectionHeader title="Education" color={primaryColor} variant="line" />
                            <div className="space-y-8">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between font-bold text-slate-800 mb-1">
                                            <span>{edu.school}</span>
                                            <span className="text-xs opacity-40 uppercase">{edu.startDate} - {edu.endDate}</span>
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest italic" style={{ color: primaryColor }}>{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <SectionHeader title="Key Projects" color={primaryColor} variant="line" />
                            <div className="grid grid-cols-2 gap-8">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest">{proj.name}</h3>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <SectionHeader title="Languages" color={primaryColor} variant="line" />
                            <div className="flex flex-wrap gap-8">
                                {data.languages.map((l, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold uppercase tracking-wider">{l.language}</p>
                                        <p className="text-[10px] opacity-40">{l.proficiency}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),
    clean: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-20 resume-page font-inter text-slate-800">
            <header className="mb-20">
                <h1 className="text-5xl font-black mb-4">{data.personalInfo.fullName}</h1>
                <p className="text-xl font-medium tracking-widest text-slate-400 uppercase border-l-4 pl-6" style={{ borderColor: primaryColor }}>{data.experience[0]?.position}</p>
            </header>
            <div className="grid grid-cols-1 gap-16">
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Personal Summary</h2>
                    <p className="text-lg leading-relaxed text-slate-500 font-light italic">"{data.personalInfo.summary}"</p>
                </section>
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Professional Record</h2>
                    <div className="space-y-12">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="flex gap-12">
                                <div className="w-40 flex-shrink-0 text-xs font-bold text-slate-300 pt-1.5 uppercase tracking-widest">{exp.startDate} – {exp.endDate}</div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-1">{exp.company}</h3>
                                    <p className="text-sm font-bold opacity-60 mb-4 uppercase tracking-[0.2em]">{exp.position}</p>
                                    <p className="text-base text-slate-500 font-light leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Certifications</h2>
                        <div className="space-y-6">
                            {data.certifications.map((cert, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{cert.name}</h3>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1 italic">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Awards</h2>
                        <div className="space-y-6">
                            {data.awards.map((award, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{award.title}</h3>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1 italic">{award.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),
    monochrome: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-serif border-x-[40px] border-slate-900 border-opacity-[0.02]">
            <header className="text-center mb-24 grid grid-cols-3 gap-8 items-center border-b border-black pb-12">
                <div className="text-left text-[10px] uppercase font-bold tracking-widest border-r border-black/10 pr-8">
                    <p>{data.personalInfo.email}</p>
                    <p>{data.personalInfo.phone}</p>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-[0.2em]">{data.personalInfo.fullName}</h1>
                <div className="text-right text-[10px] uppercase font-bold tracking-widest border-l border-black/10 pl-8">
                    <p>{data.personalInfo.address}</p>
                    {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
                </div>
            </header>
            <section className="mb-20 text-center uppercase tracking-[0.1em] text-sm font-bold opacity-70 italic border-y py-6 border-black/5">
                {data.experience[0]?.position} / Specialized in Architecture
            </section>
            <div className="space-y-20">
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Professional Narrative</h2>
                    <p className="text-lg leading-relaxed text-center italic max-w-2xl mx-auto opacity-60">"{data.personalInfo.summary}"</p>
                </section>
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Selection of Works</h2>
                    <div className="space-y-16">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end border-b border-black/5 pb-2 mb-6">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">{exp.company}</h3>
                                    <span className="text-xs font-bold italic opacity-40">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest mb-6 border-l-4 pl-4 border-black">{exp.position}</p>
                                <p className="text-sm leading-relaxed text-justify opacity-60">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <div className="grid grid-cols-2 gap-20">
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Expertise Spectrum</h2>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="text-xs font-bold uppercase tracking-widest border-b border-black/10 pb-1">{s}</span>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Scholastic Records</h2>
                            <div className="space-y-8">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="text-center">
                                        <h3 className="text-sm font-black uppercase tracking-widest mb-2">{edu.school}</h3>
                                        <p className="text-xs font-bold italic opacity-40">{edu.degree}</p>
                                        <p className="text-[10px] opacity-20 mt-1 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Curated Projects</h2>
                        <div className="grid grid-cols-2 gap-16">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="text-center">
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black/5 pb-2">{proj.name}</h3>
                                    <p className="text-xs leading-relaxed opacity-60 text-center italic">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                <div className="grid grid-cols-2 gap-20">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Linguistic Ability</h2>
                        <div className="space-y-4 text-center">
                            {data.languages.map((l, i) => (
                                <div key={i} className="text-xs font-bold uppercase tracking-widest">
                                    {l.language} / <span className="opacity-40 italic">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Honours & Merits</h2>
                            <div className="space-y-6 text-center">
                                {(data.certifications || []).map((c, i) => (
                                    <div key={i}>
                                        <p className="text-[11px] font-black uppercase tracking-widest">{c.name}</p>
                                        <p className="text-[10px] opacity-30 italic">{c.issuer}</p>
                                    </div>
                                ))}
                                {(data.awards || []).map((a, i) => (
                                    <div key={`a-${i}`}>
                                        <p className="text-[11px] font-black uppercase tracking-widest">{a.title}</p>
                                        <p className="text-[10px] opacity-30 italic">{a.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Personal Affinities</h2>
                        <p className="text-xs font-bold uppercase tracking-[0.5em] text-center opacity-30">
                            {data.interests.join(" / ")}
                        </p>
                    </section>
                )}
            </div>
        </div>
    ),

    cyber: ({ data, primaryColor }) => (
        <div className="bg-[#050505] w-[794px] mx-auto shadow-2xl p-16 resume-page font-mono text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }}></div>
            <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }}></div>
            <header className="mb-16 relative">
                <div className="absolute -left-8 top-0 w-1 h-full" style={{ backgroundColor: primaryColor }}></div>
                <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase italic" style={{ textShadow: `0 0 10px ${primaryColor}` }}>{data.personalInfo.fullName}</h1>
                <div className="flex gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div> {data.personalInfo.email}</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div> {data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-8 space-y-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4" style={{ color: primaryColor }}>
                            <span className="opacity-50">[01]</span> PROFESSIONAL_LOG
                        </h2>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l border-white/10 group">
                                    <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-white/10 group-hover:bg-current transition-colors" style={{ color: primaryColor }}></div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-bold uppercase">{exp.company}</h3>
                                        <span className="text-[10px] opacity-40">{exp.startDate} // {exp.endDate || 'PRESENT'}</span>
                                    </div>
                                    <p className="text-xs font-bold mb-4 opacity-70 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-xs text-gray-400 leading-relaxed font-light">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4" style={{ color: primaryColor }}>
                                <span className="opacity-50">[02]</span> DEPLOYED_PROJECTS
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg">
                                        <h3 className="text-sm font-black mb-2 uppercase">{proj.name}</h3>
                                        <p className="text-[10px] text-gray-500 mb-4">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.technologies.slice(0, 3).map((tech, j) => (
                                                <span key={j} className="text-[8px] px-1.5 py-0.5 bg-black/50 text-white/40 border border-white/5 uppercase">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className="col-span-4 space-y-12">
                    <section className="bg-white/5 p-8 border border-white/10">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>
                            CORE_STACK
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((s, i) => (
                                <span key={i} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 uppercase font-bold tracking-tighter">{s}</span>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section className="bg-white/5 p-8 border border-white/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>
                                EDUCATION_NODES
                            </h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-black uppercase">{edu.school}</p>
                                        <p className="text-[9px] text-gray-500 mb-1">{edu.degree}</p>
                                        <p className="text-[9px] opacity-30 mt-1">{edu.startDate} — {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section className="bg-white/5 p-8 border border-white/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>
                                LANG_PARAMS
                            </h2>
                            <div className="space-y-4">
                                {data.languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px]">
                                        <span className="font-bold">{lang.language}</span>
                                        <span className="opacity-40">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section className="bg-white/5 p-8 border border-white/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>
                                CERT_KEYS
                            </h2>
                            <div className="space-y-4">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-black uppercase">{cert.name}</p>
                                        <p className="text-[9px] text-gray-500 mb-1">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section className="bg-white/5 p-8 border border-white/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>
                                AWARD_TOKENS
                            </h2>
                            <div className="space-y-4">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-black uppercase">{award.title}</p>
                                        <p className="text-[9px] text-gray-500 mb-1">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section className="bg-white/5 p-8 border border-white/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>
                                INTEREST_FLAGS
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 uppercase font-bold tracking-tighter">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    glass: ({ data, primaryColor }) => (
        <div className="bg-slate-900 w-[794px] mx-auto shadow-2xl resume-page font-inter relative overflow-hidden min-h-[1123px]">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: primaryColor }}></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-10" style={{ backgroundColor: primaryColor }}></div>
            <div className="relative z-10 p-16">
                <header className="mb-16 backdrop-blur-md bg-white/5 border border-white/10 p-12 rounded-[32px] shadow-2xl">
                    <h1 className="text-6xl font-black text-white tracking-tighter mb-4">{data.personalInfo.fullName}</h1>
                    <p className="text-lg font-medium text-white/50 mb-4">{data.experience[0]?.position}</p>
                    <p className="text-sm text-white/40 leading-relaxed font-light mb-8 max-w-2xl italic">"{data.personalInfo.summary}"</p>
                    <div className="flex gap-8 text-[11px] font-bold text-white/30 uppercase tracking-widest">
                        <span>{data.personalInfo.email}</span>
                        <span>•</span>
                        <span>{data.personalInfo.phone}</span>
                    </div>
                </header>
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-7 space-y-8">
                        <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10">Experience</h2>
                            <div className="space-y-12">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-2 text-white">
                                            <h3 className="text-xl font-bold">{exp.company}</h3>
                                            <span className="text-[10px] font-black opacity-30">{exp.startDate} - {exp.endDate || 'Now'}</span>
                                        </div>
                                        <p className="text-sm font-bold mb-4 opacity-60" style={{ color: primaryColor }}>{exp.position}</p>
                                        <p className="text-xs text-white/40 leading-relaxed font-light">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.projects && data.projects.length > 0 && (
                            <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10">Featured Projects</h2>
                                <div className="space-y-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i} className="border-l-2 border-white/10 pl-6">
                                            <h3 className="text-base font-bold text-white mb-2">{proj.name}</h3>
                                            <p className="text-xs text-white/40 leading-relaxed">{proj.description}</p>
                                            <div className="flex gap-4 mt-4 text-[9px] text-white/30 uppercase font-black tracking-widest">
                                                {proj.technologies.slice(0, 3).map((tech, j) => (
                                                    <span key={j}>{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="col-span-5 space-y-8">
                        <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-8">Technical</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white/70">{s}</span>
                                ))}
                            </div>
                        </section>

                        {data.education && data.education.length > 0 && (
                            <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10">Education</h2>
                                <div className="space-y-8">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-bold text-white mb-1">{edu.school}</h3>
                                            <p className="text-xs text-white/40 mb-2">{edu.degree}</p>
                                            <p className="text-[10px] text-white/20 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-8">Languages</h2>
                                <div className="space-y-4">
                                    {data.languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between items-center text-[10px] text-white/60">
                                            <span className="font-bold">{lang.language}</span>
                                            <span className="text-white/20">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10">Certifications</h2>
                                <div className="space-y-8">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-bold text-white mb-1">{cert.name}</h3>
                                            <p className="text-xs text-white/40 mb-2">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10">Awards</h2>
                                <div className="space-y-8">
                                    {data.awards.map((award, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-bold text-white mb-1">{award.title}</h3>
                                            <p className="text-xs text-white/40 mb-2">{award.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section className="backdrop-blur-sm bg-white/[0.02] border border-white/5 p-10 rounded-[32px]">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10">Interests</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white/70">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),

    neural: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-outfit text-slate-900 border-x-[16px] border-slate-50 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 800 1200">
                <circle cx="100" cy="100" r="2" fill={primaryColor} />
                <circle cx="700" cy="200" r="3" fill={primaryColor} />
                <circle cx="400" cy="600" r="2" fill={primaryColor} />
                <path d="M100 100 L700 200 L400 600 Z" stroke={primaryColor} fill="none" strokeWidth="0.5" />
            </svg>
            <header className="mb-20 flex justify-between items-center relative z-10">
                <div className="max-w-xl">
                    <h1 className="text-7xl font-black tracking-tight leading-none mb-4 uppercase">{data.personalInfo.fullName}</h1>
                    <p className="text-sm font-bold tracking-[0.4em] text-slate-300 uppercase">{data.personalInfo.summary.substring(0, 100)}...</p>
                </div>
                <div className="w-24 h-24 rounded-full border border-slate-100 flex items-center justify-center p-2">
                    <div className="w-full h-full rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></div>
                </div>
            </header>
            <div className="grid grid-cols-1 gap-20 relative z-10">
                <section>
                    <div className="flex items-center gap-6 mb-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Nodes</h2>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-12">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="p-8 border border-slate-50 rounded-[40px] hover:border-slate-200 transition-colors bg-white">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-4 italic">{exp.startDate} // {exp.endDate || 'LATEST'}</span>
                                <h3 className="text-2xl font-black mb-1">{exp.company}</h3>
                                <p className="text-sm font-bold mb-6" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-4">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-12 gap-16">
                    <div className="col-span-4">
                        <section className="mb-12">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Base Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-full">{s}</span>
                                ))}
                            </div>
                        </section>

                        {(data.languages && data.languages.length > 0) && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Communication</h2>
                                <div className="space-y-3">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="text-xs font-bold text-slate-600 flex justify-between">
                                            <span>{l.language}</span>
                                            <span className="opacity-40">{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section className="mt-12">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Credentials</h2>
                                <div className="space-y-6">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i} className="border-l border-slate-100 pl-6">
                                            <p className="text-xs font-bold text-slate-800 uppercase">{cert.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section className="mt-12">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Feats</h2>
                                <div className="space-y-6">
                                    {data.awards.map((award, i) => (
                                        <div key={i} className="border-l border-slate-100 pl-6">
                                            <p className="text-xs font-bold text-slate-800 uppercase">{award.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{award.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section className="mt-12">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Interests</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-full">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="col-span-8">
                        {data.education && data.education.length > 0 && (
                            <section className="mb-16">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Academic Pulse</h2>
                                <div className="space-y-8">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="border-l border-slate-100 pl-8">
                                            <h3 className="text-lg font-bold text-slate-800">{edu.school}</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-1">{edu.degree}</p>
                                            <span className="text-[9px] text-slate-200 font-black uppercase tracking-widest mt-2 block">{edu.startDate} — {edu.endDate}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Neural Projects</h2>
                                <div className="grid grid-cols-2 gap-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-black text-slate-800 mb-2">{proj.name}</h3>
                                            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),

    hologram: ({ data, primaryColor }) => (
        <div className="bg-[#000411] w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-[300px] opacity-30" style={{ background: `linear-gradient(135deg, ${primaryColor}77, transparent)` }}></div>
            <header className="mb-24 text-center">
                <h1 className="text-8xl font-black tracking-tighter italic mb-4" style={{
                    background: `linear-gradient(to right, #fff, ${primaryColor}, #fff)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: `0 0 30px ${primaryColor}44`
                }}>{data.personalInfo.fullName}</h1>
                <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                    <span>{data.personalInfo.email}</span>
                    <div className="w-1 h-1 rounded-full bg-white/20 mt-1.5"></div>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-16">
                <div className="col-span-12">
                    <section className="mb-20">
                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-px w-12 bg-white/10"></div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Personal Fragment</h2>
                        </div>
                        <p className="text-sm leading-relaxed text-white/60 font-medium italic border-l border-white/20 pl-6">"{data.personalInfo.summary}"</p>
                    </section>
                    <section className="mb-24">
                        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white">System Experience</h2>
                            <span className="text-[10px] text-white/30 font-mono tracking-tighter">BUILD v2.0.4</span>
                        </div>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="grid grid-cols-12 gap-8 items-start">
                                    <div className="col-span-3">
                                        <div className="text-[10px] font-black font-mono text-white/20 uppercase mb-2">TIMELINE</div>
                                        <div className="text-sm font-bold text-white/50">{exp.startDate} — {exp.endDate || 'INF'}</div>
                                    </div>
                                    <div className="col-span-9 border-l-2 border-white/5 pl-10">
                                        <h3 className="text-3xl font-black mb-2 italic" style={{ color: primaryColor }}>{exp.company}</h3>
                                        <p className="text-sm font-bold text-white/40 mb-6 uppercase tracking-widest">{exp.position}</p>
                                        <p className="text-xs text-white/50 leading-relaxed font-medium text-justify">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-16 mb-24">
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/10 pb-4">Specializations</h2>
                            <div className="flex flex-wrap gap-3">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 rounded uppercase tracking-tighter italic">{s}</span>
                                ))}
                            </div>
                        </section>
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/10 pb-4">Academic Nodes</h2>
                                <div className="space-y-8">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-lg font-bold text-white italic">{edu.school}</h3>
                                            <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/10 pb-4">Project Fragments</h2>
                            <div className="grid grid-cols-3 gap-8">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                                        <h3 className="text-sm font-black uppercase italic mb-2" style={{ color: primaryColor }}>{proj.name}</h3>
                                        <p className="text-[10px] text-white/30 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section className="mt-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/10 pb-4">Auth Tokens</h2>
                            <div className="space-y-8">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-lg font-bold text-white italic">{cert.name}</h3>
                                        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section className="mt-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/10 pb-4">Achievements</h2>
                            <div className="space-y-8">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-lg font-bold text-white italic">{award.title}</h3>
                                        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section className="mt-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/10 pb-4">Linguistic Matrix</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg">
                                        <span className="text-xs font-bold text-white/70">{l.language}</span>
                                        <span className="text-[10px] font-medium text-white/30 italic uppercase">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section className="mt-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/10 pb-4">Idle Processes</h2>
                            <div className="flex flex-wrap gap-3">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 rounded uppercase tracking-tighter italic">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    focus: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-24 resume-page font-inter text-slate-900 border-[32px] border-slate-50">
            <header className="mb-24 flex flex-col items-start">
                <div className="h-1.5 w-16 mb-12 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                <h1 className="text-7xl font-black tracking-tighter mb-4 leading-[0.9]">{data.personalInfo.fullName}</h1>
                <p className="text-xl font-medium text-slate-400 max-w-lg mb-8 italic">"{data.personalInfo.summary.substring(0, 150)}..."</p>
                <div className="flex gap-16 text-xs font-black uppercase tracking-[0.5em] text-white/40 mb-12">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
                <p className="text-lg leading-relaxed text-white/20 font-light italic max-w-2xl">"{data.personalInfo.summary}"</p>
            </header>
            <div className="grid grid-cols-12 gap-16">
                <div className="col-span-4 self-start sticky top-24">
                    <section className="mb-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Specialties</h2>
                        <div className="flex flex-col gap-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{s}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Education</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{edu.school}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Languages</h2>
                            <div className="space-y-3">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="text-xs font-bold text-slate-600 flex justify-between">
                                        <span>{l.language}</span>
                                        <span className="opacity-30">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Certifications</h2>
                            <div className="space-y-3">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{cert.name}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Awards</h2>
                            <div className="space-y-3">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{award.title}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-2 py-1 border border-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase tracking-widest">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className="col-span-8 space-y-20">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12">Track Record</h2>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-3xl font-black tracking-tighter text-slate-800">{exp.company}</h3>
                                        <span className="text-[10px] font-black text-slate-300 tabular-nums">{exp.startDate} - {exp.endDate || 'NOW'}</span>
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-[0.2em] mb-6 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12">Projects Focus</h2>
                            <div className="space-y-12">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="border-l border-slate-100 pl-8">
                                        <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-wide">{proj.name}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-light">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    data: ({ data, primaryColor }) => (
        <div className="bg-slate-50 w-[794px] mx-auto shadow-2xl p-16 resume-page font-mono text-slate-800">
            <header className="mb-20 grid grid-cols-4 gap-4">
                <div className="col-span-3 bg-white p-10 border border-slate-200">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">{data.personalInfo.fullName}</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] italic">Identity verified // {data.experience[0]?.position}</p>
                </div>
                <div className="bg-slate-900 p-8 text-white flex flex-col justify-center">
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-4">Contact Detail</div>
                    <p className="text-[10px] font-bold truncate">{data.personalInfo.email}</p>
                    <p className="text-[10px] font-bold">{data.personalInfo.phone}</p>
                </div>
            </header>
            <div className="space-y-12">
                <section className="bg-white p-8 border border-slate-200">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 border-b pb-2">Profile Abstract</h2>
                    <p className="text-xs text-slate-600 leading-relaxed italic">{data.personalInfo.summary}</p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-4 h-4" style={{ backgroundColor: primaryColor }}></div>
                        <h2 className="text-xs font-black uppercase tracking-[0.5em]">Professional Dataset</h2>
                    </div>
                    <div className="space-y-6">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="p-8 bg-white border border-slate-100 hover:shadow-xl transition-all">
                                <div className="flex justify-between items-baseline mb-4">
                                    <h3 className="text-lg font-black uppercase tracking-tight">{exp.company}</h3>
                                    <span className="text-[10px] tabular-nums font-bold text-slate-300">{exp.startDate} :: {exp.endDate || 'NULL'}</span>
                                </div>
                                <div className="h-px w-full bg-slate-50 mb-4"></div>
                                <p className="text-xs font-bold uppercase mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                    {data.skills && data.skills.length > 0 && (
                        <section className="bg-white p-8 border border-slate-100">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 border-b pb-4">Skills Metadata</h2>
                            <div className="grid grid-cols-2 gap-y-2">
                                {data.skills.map((s, i) => (
                                    <div key={i} className="text-[10px] font-bold text-slate-600 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-slate-200"></div>
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.education && data.education.length > 0 && (
                        <section className="bg-white p-8 border border-slate-100">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 border-b pb-4">Education Logs</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="text-[10px]">
                                        <p className="font-black uppercase">{edu.school}</p>
                                        <p className="text-slate-400 mt-1">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {data.projects && data.projects.length > 0 && (
                    <section className="bg-white p-8 border border-slate-200">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 border-b pb-4">Project Fragments</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="flex justify-between items-start gap-8">
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black uppercase mb-1">{proj.name}</h3>
                                        <p className="text-[10px] text-slate-400">{proj.description}</p>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 italic">TAG_{i}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.certifications && data.certifications.length > 0 && (
                    <section className="bg-white p-8 border border-slate-200">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 border-b pb-4">Auth/Cert</h2>
                        <div className="space-y-4">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="flex justify-between items-start gap-8">
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black uppercase mb-1">{cert.name}</h3>
                                        <p className="text-[10px] text-slate-400">{cert.issuer}</p>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 italic">CRT_{i}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section className="bg-white p-8 border border-slate-200">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 border-b pb-4">Achievements</h2>
                        <div className="space-y-4">
                            {data.awards.map((award, i) => (
                                <div key={i} className="flex justify-between items-start gap-8">
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black uppercase mb-1">{award.title}</h3>
                                        <p className="text-[10px] text-slate-400">{award.issuer}</p>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 italic">AWD_{i}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section className="bg-white p-8 border border-slate-200">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 border-b pb-4">Interests Metadata</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 border border-slate-100">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),

    organic: ({ data, primaryColor }) => (
        <div className="bg-[#fffcf9] w-[794px] mx-auto shadow-2xl p-16 resume-page font-outfit text-slate-800 relative overflow-hidden">
            <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-[0.05] blur-3xl" style={{ backgroundColor: primaryColor }}></div>
            <header className="mb-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-2 border-slate-100 p-1 mb-8">
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-3xl" style={{ backgroundColor: primaryColor }}>
                        {data.personalInfo.fullName.charAt(0)}
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-900">{data.personalInfo.fullName}</h1>
                <p className="text-lg text-slate-400 font-medium italic mb-8 max-w-lg leading-relaxed">"{data.personalInfo.summary}"</p>
                <div className="flex gap-10 items-center justify-center">
                    <div className="h-px w-10 bg-slate-100"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">{data.personalInfo.email}</span>
                    <div className="h-px w-10 bg-slate-100"></div>
                </div>
            </header>
            <div className="grid grid-cols-1 gap-16">
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12 text-center">Journey Timeline</h2>
                    <div className="space-y-16">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="relative text-center max-w-2xl mx-auto">
                                <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{exp.company}</h3>
                                <p className="text-sm font-bold mb-6 italic" style={{ color: primaryColor }}>{exp.position} • {exp.startDate} - {exp.endDate || 'Now'}</p>
                                <p className="text-sm text-slate-500 leading-relaxed font-light">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-20">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Specializations</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            {data.skills.map((s, i) => (
                                <span key={i} className="text-xs font-bold text-slate-600 italic">{s}</span>
                            ))}
                        </div>
                    </section>
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 border-b pb-4">Academic roots</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-slate-800">{edu.school}</h3>
                                        <p className="text-xs text-slate-400 italic mt-1">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12 text-center">Crafted Works</h2>
                        <div className="grid grid-cols-2 gap-12">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="text-center">
                                    <h3 className="text-lg font-black text-slate-800 mb-2">{proj.name}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-light">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12 text-center">Certified</h2>
                        <div className="space-y-6 text-center">
                            {data.certifications.map((cert, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-bold text-slate-800">{cert.name}</h3>
                                    <p className="text-xs text-slate-400 italic mt-1">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12 text-center">Honors</h2>
                        <div className="space-y-6 text-center">
                            {data.awards.map((award, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-bold text-slate-800">{award.title}</h3>
                                    <p className="text-xs text-slate-400 italic mt-1">{award.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12 text-center">Passions</h2>
                        <div className="space-y-6 text-center">
                            {data.languages.map((l, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-bold text-slate-800">{l.language}</h3>
                                    <p className="text-xs text-slate-400 italic mt-1">{l.proficiency}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12 text-center">Passions</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="text-xs font-bold text-slate-600 italic px-3 py-1 bg-white shadow-sm rounded-full">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),

    terminal: ({ data, primaryColor }) => (
        <div className="bg-[#1a1b26] w-[794px] mx-auto shadow-2xl p-12 resume-page font-mono text-[#a9b1d6] border-t-8" style={{ borderColor: primaryColor }}>
            <header className="mb-12 border-b border-white/5 pb-8">
                <div className="flex items-center gap-2 mb-4 text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="ml-4 opacity-30">resume_v2.terminal</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 underline decoration-dashed decoration-white/20 underline-offset-8">{data.personalInfo.fullName}</h1>
                <div className="mt-8 text-[11px] leading-relaxed text-white/40 italic font-bold">
                    <span className="text-[#00ff41] opacity-50 mr-2"># whoami</span>
                    {data.personalInfo.summary}
                </div>
                <div className="flex gap-6 text-[11px] font-medium mt-6">
                    <span style={{ color: primaryColor }}>$ contact --email</span>
                    <span className="text-white opacity-60">{data.personalInfo.email}</span>
                </div>
            </header>
            <div className="space-y-12">
                <section>
                    <h2 className="text-sm font-bold text-[#bb9af7] mb-8 flex items-center gap-2">
                        <span className="text-white opacity-20">❯</span> ls ~/experience
                    </h2>
                    <div className="space-y-10 pl-6 border-l border-white/5">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-white font-bold">{exp.company} <span className="text-[#7aa2f7] opacity-60">({exp.startDate})</span></h3>
                                    <span className="text-[10px] opacity-30 font-bold uppercase">PID: {1000 + i}</span>
                                </div>
                                <p className="text-xs font-bold mb-4 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-xs leading-relaxed opacity-60 text-justify">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-sm font-bold text-[#7dcfff] mb-6 flex items-center gap-2">
                            <span className="text-white opacity-20">❯</span> cat ~/skills.json
                        </h2>
                        <div className="bg-black/20 p-6 rounded-lg font-bold text-[10px] grid grid-cols-2 gap-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-orange-400">"</span>
                                    <span className="text-white/80">{s}</span>
                                    <span className="text-orange-400">"</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-[#e0af68] mb-6 flex items-center gap-2">
                                <span className="text-white opacity-20">❯</span> source ~/edu.sh
                            </h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="text-[10px]">
                                        <p className="text-white font-bold italic"># {edu.school}</p>
                                        <p className="text-white/40 mt-1">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-[#9ece6a] mb-6 flex items-center gap-2">
                            <span className="text-white opacity-20">❯</span> ./run_projects.bin
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="p-4 bg-black/20 border border-white/5 rounded">
                                    <h3 className="text-[10px] font-black text-white/80 mb-2 uppercase">{proj.name}</h3>
                                    <p className="text-[9px] text-white/30 leading-tight">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-[#f7768e] mb-6 flex items-center gap-2">
                            <span className="text-white opacity-20">❯</span> cat ~/.ssh/certs
                        </h2>
                        <div className="space-y-4">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="text-[10px]">
                                    <p className="text-white font-bold italic"># {cert.name}</p>
                                    <p className="text-white/40 mt-1">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-[#2ac3de] mb-6 flex items-center gap-2">
                            <span className="text-white opacity-20">❯</span> grep "AWARD" ./history.log
                        </h2>
                        <div className="space-y-4">
                            {data.awards.map((award, i) => (
                                <div key={i} className="text-[10px]">
                                    <p className="text-white font-bold italic"># {award.title}</p>
                                    <p className="text-white/40 mt-1">{award.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-[#bb9af7] mb-6 flex items-center gap-2">
                            <span className="text-white opacity-20">❯</span> cat ~/languages.conf
                        </h2>
                        <div className="space-y-2 pl-6">
                            {data.languages.map((l, i) => (
                                <div key={i} className="text-[10px] font-bold">
                                    <span className="text-orange-400">{l.language}:</span> <span className="text-white/60 italic">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-[#bb9af7] mb-6 flex items-center gap-2">
                            <span className="text-white opacity-20">❯</span> ps aux | grep "interest"
                        </h2>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-white/60 font-mono">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),

    nebula: ({ data, primaryColor }) => (
        <div className="bg-slate-900 w-[794px] mx-auto shadow-2xl resume-page font-inter relative overflow-hidden text-white min-h-[1123px]">
            <div className="absolute top-0 right-0 w-full h-full">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-20" style={{ backgroundColor: primaryColor }}></div>
                <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.15]" style={{ backgroundColor: '#a855f7' }}></div>
            </div>
            <div className="relative z-10 p-20 flex flex-col items-center">
                <header className="mb-32 text-center w-full">
                    <div className="h-px w-20 bg-white/20 mx-auto mb-10"></div>
                    <h1 className="text-8xl font-black text-white tracking-widest leading-none mb-6 uppercase" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{data.personalInfo.fullName.split(' ')[0]}<br /><span className="text-transparent border border-white/20 bg-clip-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span></h1>
                    <p className="text-xs font-black uppercase tracking-[0.8em] text-white/40 mb-8 italic">{data.experience[0]?.position}</p>
                    <p className="text-sm text-white/30 leading-relaxed font-light italic mb-12 max-w-xl mx-auto border-x border-white/5 px-12">"{data.personalInfo.summary}"</p>
                    <div className="flex justify-center gap-12 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                    </div>
                </header>
                <div className="grid grid-cols-12 gap-16 w-full">
                    <div className="col-span-12 space-y-24">
                        <section className="relative">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-16 text-center italic">Professional Orbit</h2>
                            <div className="space-y-20">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="group relative">
                                        <div className="absolute -left-10 top-2 w-1.5 h-1.5 rounded-full border border-white/20 group-hover:scale-150 group-hover:bg-white/50 transition-all duration-500"></div>
                                        <div className="flex justify-between items-baseline mb-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white/90">{exp.company}</h3>
                                            <span className="text-[11px] font-bold text-white/20 tabular-nums">{exp.startDate} - {exp.endDate || 'INF'}</span>
                                        </div>
                                        <p className="text-xs font-bold uppercase mb-6 tracking-widest italic" style={{ color: primaryColor }}>{exp.position}</p>
                                        <p className="text-sm text-white/40 leading-relaxed font-light text-justify max-w-2xl">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="grid grid-cols-3 gap-16">
                            <section className="col-span-1">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10 italic">Core Clusters</h2>
                                <div className="space-y-4">
                                    {data.skills.map((s, i) => (
                                        <div key={i} className="flex items-center gap-4 text-xs font-bold text-white/60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </section>
                            {data.education && data.education.length > 0 && (
                                <section className="col-span-2">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10 italic">Academic Pulse</h2>
                                    <div className="grid grid-cols-2 gap-10">
                                        {data.education.map((edu, i) => (
                                            <div key={i}>
                                                <h3 className="text-base font-black text-white italic">{edu.school}</h3>
                                                <p className="text-[10px] text-white/30 uppercase mt-2">{edu.degree}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-16 text-center italic">Project Systems</h2>
                                <div className="grid grid-cols-2 gap-20">
                                    {data.projects.map((proj, i) => (
                                        <div key={i} className="border-t border-white/5 pt-8">
                                            <h3 className="text-xl font-black italic mb-4" style={{ color: primaryColor }}>{proj.name}</h3>
                                            <p className="text-xs text-white/30 leading-relaxed">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-16 text-center italic">Stellar Credentials</h2>
                                <div className="grid grid-cols-2 gap-20">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i} className="border-t border-white/5 pt-8">
                                            <h3 className="text-lg font-black italic mb-2 text-white/90">{cert.name}</h3>
                                            <p className="text-xs text-white/30 leading-relaxed uppercase">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-16 text-center italic">Galactic Honors</h2>
                                <div className="grid grid-cols-2 gap-20">
                                    {data.awards.map((award, i) => (
                                        <div key={i} className="border-t border-white/5 pt-8">
                                            <h3 className="text-lg font-black italic mb-2 text-white/90">{award.title}</h3>
                                            <p className="text-xs text-white/30 leading-relaxed uppercase">{award.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10 italic">Communication Satellites</h2>
                                <div className="space-y-4">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs font-bold text-white/40">
                                            <span>{l.language}</span>
                                            <span className="italic opacity-50">{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10 italic">Orbiting Interests</h2>
                                <div className="flex flex-wrap gap-4">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="px-4 py-2 border border-white/10 rounded-full text-xs font-bold text-white/40 uppercase tracking-widest">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),

    prism: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-900 border-x-[20px] relative overflow-hidden" style={{ borderImage: `linear-gradient(to bottom, ${primaryColor}, #a855f7, #ec4899) 1` }}>
            <header className="mb-20">
                <h1 className="text-7xl font-black tracking-tighter mb-4 italic leading-none">{data.personalInfo.fullName}</h1>
                <div className="h-1.5 w-full bg-slate-900 mb-8 flex">
                    <div className="h-full w-1/3" style={{ backgroundColor: primaryColor }}></div>
                    <div className="h-full w-1/3 bg-purple-500"></div>
                    <div className="h-full w-1/3 bg-pink-500"></div>
                </div>
                <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
                    <div>
                        <p className="mb-2">{data.experience[0]?.position}</p>
                        <p className="italic normal-case font-medium text-slate-400 max-w-sm">"{data.personalInfo.summary}"</p>
                    </div>
                    <div className="flex gap-8">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-12 space-y-16">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-4 border-b border-slate-50">Experience Portfolio</h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="grid grid-cols-12 gap-8 items-start">
                                    <div className="col-span-3 text-[10px] tabular-nums font-black text-slate-300 pt-2 italic">{exp.startDate} — {exp.endDate || 'NOW'}</div>
                                    <div className="col-span-9 border-l-4 border-slate-50 pl-10 group hover:border-slate-900 transition-colors">
                                        <h3 className="text-2xl font-black mb-1 uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:[background-image:var(--gradient-bg)] transition-all" style={{ '--gradient-bg': `linear-gradient(to right, ${primaryColor}, #a855f7)` } as React.CSSProperties}>{exp.company}</h3>
                                        <p className="text-xs font-bold uppercase mb-4 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-16">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 pb-4 border-b border-slate-50">Core Spectrum</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.skills.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5" style={{ backgroundColor: i % 2 === 0 ? primaryColor : '#a855f7' }}></div>
                                        <span className="text-[11px] font-black uppercase tracking-tighter text-slate-600">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-8 pb-4 border-b border-slate-50">Knowledge Base</h2>
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-black italic text-slate-800">{edu.school}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-4 border-b border-slate-50">Visual Projects</h2>
                            <div className="grid grid-cols-3 gap-10">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="p-6 bg-slate-50 border-t-4" style={{ borderColor: i % 2 === 0 ? primaryColor : '#ec4899' }}>
                                        <h3 className="text-xs font-black uppercase mb-2 tracking-wide">{proj.name}</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium line-clamp-3">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}


                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-4 border-b border-slate-50">Certifications</h2>
                            <div className="grid grid-cols-2 gap-10">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black italic text-slate-800">{cert.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-4 border-b border-slate-50">Awards</h2>
                            <div className="grid grid-cols-2 gap-10">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black italic text-slate-800">{award.title}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-4 border-b border-slate-50">Linguistic Spectrum</h2>
                            <div className="space-y-4">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-slate-800">{l.language}</span>
                                        <span className="text-slate-300 italic">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-4 border-b border-slate-50">Interests</h2>
                            <div className="flex flex-wrap gap-3">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    quantum: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-[5px] flex">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex-1 h-full" style={{ backgroundColor: primaryColor, opacity: (20 - i) / 20 }}></div>
                ))}
            </div>
            <header className="mb-20 grid grid-cols-12 gap-8 items-end">
                <div className="col-span-8">
                    <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-6 uppercase">{data.personalInfo.fullName}</h1>
                    <div className="flex gap-4 items-center">
                        <div className="h-4 w-4 bg-slate-900 rotate-45"></div>
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">{data.experience[0]?.position}</p>
                    </div>
                </div>
                <div className="col-span-4 text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Access Point</div>
                    <p className="text-sm font-bold">{data.personalInfo.email}</p>
                    <p className="text-sm font-bold">{data.personalInfo.phone}</p>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-0 border border-slate-100">
                <div className="col-span-12 border-b border-slate-100 p-8">
                    <p className="text-sm text-slate-400 font-medium italic leading-relaxed max-w-3xl">"{data.personalInfo.summary}"</p>
                </div>
                <div className="col-span-12 border-b border-slate-100 p-8 flex flex-wrap gap-4">
                    {data.skills.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{s}</span>
                        </div>
                    ))}
                </div>
                {data.experience.map((exp, i) => (
                    <div key={i} className="col-span-12 border-b border-slate-100 grid grid-cols-12 hover:bg-slate-50 transition-colors group">
                        <div className="col-span-3 p-8 border-r border-slate-100 bg-slate-50/50">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{exp.startDate}</span>
                            <div className="h-px w-8 bg-slate-200 my-4"></div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{exp.endDate || 'INF'}</span>
                        </div>
                        <div className="col-span-9 p-8">
                            <h3 className="text-2xl font-black mb-1 group-hover:translate-x-2 transition-transform">{exp.company}</h3>
                            <p className="text-sm font-bold mb-6" style={{ color: primaryColor }}>{exp.position}</p>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 mt-20 gap-16">
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Academic Lattice</h2>
                        <div className="space-y-8">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="text-xl font-black text-slate-800 italic uppercase">{edu.school}</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Quantum Projects</h2>
                        <div className="space-y-8">
                            {data.projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">{proj.name}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Quantum Credentials</h2>
                        <div className="space-y-8">
                            {data.certifications.map((cert, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">{cert.name}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Quantum Rewards</h2>
                        <div className="space-y-8">
                            {data.awards.map((award, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">{award.title}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">{award.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Language Grid</h2>
                        <div className="space-y-4">
                            {data.languages.map((l, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>{l.language}</span>
                                    <span style={{ color: primaryColor }}>{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8 border-b pb-4">Spin States</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),

    atlas: ({ data, primaryColor }) => (
        <div className="bg-slate-900 w-[794px] mx-auto shadow-2xl resume-page font-inter text-white min-h-[1123px]">
            <header className="p-20 bg-white text-slate-900">
                <div className="flex justify-between items-start mb-16">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">{data.personalInfo.fullName}</h1>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Global Position</p>
                        <p className="text-sm font-bold">{data.personalInfo.address}</p>
                    </div>
                </div>
                <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                    <span className="flex items-center gap-3"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div> {data.personalInfo.email}</span>
                    <span className="flex items-center gap-3"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div> {data.personalInfo.phone}</span>
                </div>
                <div className="mt-16 border-t border-slate-100 pt-12">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-6 italic">Strategic Narrative</h2>
                    <p className="text-lg leading-relaxed italic text-slate-600 font-light">"{data.personalInfo.summary}"</p>
                </div>
            </header>
            <div className="p-20 grid grid-cols-12 gap-16">
                <div className="col-span-8 space-y-16">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.6em] text-white/20 mb-12 flex items-center gap-6">Exp <div className="flex-1 h-px bg-white/10"></div></h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-10 border-l border-white/10">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-900 border-2" style={{ borderColor: primaryColor }}></div>
                                    <div className="flex justify-between mb-2">
                                        <h3 className="text-2xl font-black">{exp.company}</h3>
                                        <span className="text-[10px] font-black text-white/20 tabular-nums">{exp.startDate} - {exp.endDate || 'NOW'}</span>
                                    </div>
                                    <p className="text-xs font-bold uppercase mb-6 tracking-widest text-white/40 italic">{exp.position}</p>
                                    <p className="text-sm text-white/50 leading-relaxed font-light text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="col-span-4 space-y-12">
                    <section className="bg-white/5 p-10 rounded-3xl border border-white/10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 underline decoration-white/10 underline-offset-8">Directives</h2>
                        <div className="space-y-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <span className="text-[11px] font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-tighter">{s}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:scale-150 transition-all" style={{ backgroundColor: i % 2 === 0 ? primaryColor : undefined }}></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section className="bg-white/5 p-10 rounded-3xl border border-white/10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Academic</h2>
                            <div className="space-y-8">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black text-white">{edu.school}</h3>
                                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section className="bg-white/5 p-10 rounded-3xl border border-white/10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Globals</h2>
                            <div className="space-y-3">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] font-bold text-white/60">
                                        <span>{l.language}</span>
                                        <span className="text-white/20">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}


                    {data.certifications && data.certifications.length > 0 && (
                        <section className="bg-white/5 p-10 rounded-3xl border border-white/10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Access Cards</h2>
                            <div className="space-y-4">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black text-white">{cert.name}</h3>
                                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.awards && data.awards.length > 0 && (
                        <section className="bg-white/5 p-10 rounded-3xl border border-white/10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Commendations</h2>
                            <div className="space-y-4">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black text-white">{award.title}</h3>
                                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section className="bg-white/5 p-10 rounded-3xl border border-white/10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Sectors</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/5 text-[10px] font-bold text-white/60 rounded uppercase tracking-wider border border-white/5">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    vector: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-900 rotate-[45deg] translate-x-1/2 -translate-y-1/2 flex items-end justify-start p-20">
                <div className="text-white text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-40 italic">System User</p>
                    <p className="text-sm font-bold">{data.personalInfo.fullName.split(' ')[0]}</p>
                </div>
            </div>
            <header className="mb-32 max-w-lg">
                <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-8 uppercase text-slate-900">{data.personalInfo.fullName}</h1>
                <div className="h-4 w-full mb-8 shadow-xl" style={{ backgroundColor: primaryColor, clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}></div>
                <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-300 italic mb-12">{data.experience[0]?.position}</p>
                <p className="text-sm leading-relaxed text-slate-500 italic">"{data.personalInfo.summary}"</p>
            </header>
            <div className="grid grid-cols-12 gap-12 border-t-2 border-slate-900 pt-16">
                <div className="col-span-5 flex flex-col gap-12">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Contact Info</h2>
                        <div className="text-sm font-bold flex flex-col gap-2">
                            <span>{data.personalInfo.email}</span>
                            <span>{data.personalInfo.phone}</span>
                            <span className="text-slate-300 font-medium">{data.personalInfo.address}</span>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Skill Vector</h2>
                        <div className="grid grid-cols-2 gap-y-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="text-xs font-black uppercase tracking-tighter text-slate-400 hover:text-slate-900 transition-colors">{s}</div>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Education</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black text-slate-900 uppercase">{edu.school}</h3>
                                        <p className="text-[10px] text-slate-400 mt-1 italic">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Project Array</h2>
                            <div className="space-y-6">
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black text-slate-900 uppercase">{proj.name}</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-light mt-1">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Dialects</h2>
                            <div className="space-y-3">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                        <span>{l.language}</span>
                                        <span className="opacity-40">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Commendations</h2>
                            <div className="space-y-6">
                                {(data.certifications || []).map((c, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black text-slate-900 uppercase">{c.name}</h3>
                                        <p className="text-[10px] text-slate-400 mt-1">{c.issuer}</p>
                                    </div>
                                ))}
                                {(data.awards || []).map((a, i) => (
                                    <div key={`a-${i}`}>
                                        <h3 className="text-sm font-black text-slate-900 uppercase">{a.title}</h3>
                                        <p className="text-[10px] text-slate-400 mt-1">{a.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Sectors</h2>
                            <div className="flex flex-wrap gap-4">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className="col-span-7 space-y-16">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Experience Log</h2>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:italic transition-all">{exp.company}</h3>
                                        <span className="text-[10px] font-black text-slate-300">{exp.startDate} - {exp.endDate || 'INF'}</span>
                                    </div>
                                    <p className="text-xs font-bold uppercase mb-6" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    ),

    aurora: ({ data, primaryColor }) => (
        <div className="bg-slate-50 w-[794px] mx-auto shadow-2xl resume-page font-outfit relative overflow-hidden min-h-[1123px]">
            <div className="absolute top-0 left-0 w-full h-[400px] opacity-20" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, #10b981, #3b82f6)` }}></div>
            <div className="relative z-10 p-20">
                <header className="mb-24 flex flex-col items-center text-center">
                    <div className="bg-white/50 backdrop-blur-xl p-12 rounded-[60px] shadow-2xl border border-white max-w-2xl">
                        <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-4 uppercase">{data.personalInfo.fullName}</h1>
                        <p className="text-sm font-bold uppercase tracking-[0.5em] text-slate-400 mb-8 italic">Next Gen {data.experience[0]?.position}</p>
                        <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                            <span>{data.personalInfo.email}</span>
                            <span>{data.personalInfo.phone}</span>
                        </div>
                        <p className="mt-8 text-sm text-slate-500 leading-relaxed font-light italic">"{data.personalInfo.summary}"</p>
                    </div>
                </header>
                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-8 space-y-12">
                        <section className="bg-white/30 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-sm">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-12 text-center">Journey Map</h2>
                            <div className="space-y-16">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-12">
                                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: `${primaryColor}22` }}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                        </div>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{exp.company}</h3>
                                            <span className="text-[10px] font-bold text-slate-300">{exp.startDate} - {exp.endDate || 'Now'}</span>
                                        </div>
                                        <p className="text-sm font-bold mb-4 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                        <p className="text-[13px] text-slate-500 leading-relaxed font-light text-justify">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.projects && data.projects.length > 0 && (
                            <section className="bg-white/30 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-sm">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-12 text-center">Project Constellations</h2>
                                <div className="grid grid-cols-2 gap-10">
                                    {data.projects.map((proj, i) => (
                                        <div key={i}>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2">{proj.name}</h3>
                                            <p className="text-xs text-slate-500 leading-relaxed italic">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="col-span-4 space-y-8">
                        <section className="bg-white/30 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-sm">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-8 italic">Vitals</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="px-5 py-2.5 bg-white/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-600 border border-white shadow-sm">{s}</span>
                                ))}
                            </div>
                        </section>

                        {data.education && data.education.length > 0 && (
                            <section className="bg-white/30 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-sm">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-8 italic">Academic Pulse</h2>
                                <div className="space-y-6 text-center">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-black text-slate-800">{edu.school}</h3>
                                            <p className="text-[10px] text-slate-400 italic mt-1">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section className="bg-white/30 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-sm">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-8 italic">Dialects</h2>
                                <div className="space-y-4">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                            <span>{l.language}</span>
                                            <span className="opacity-40">{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                            <section className="bg-white/30 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-sm text-center">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-8 italic">Honors</h2>
                                <div className="space-y-6">
                                    {(data.certifications || []).map((c, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-black text-slate-800 uppercase">{c.name}</h3>
                                            <p className="text-[10px] text-slate-400 mt-1">{c.issuer}</p>
                                        </div>
                                    ))}
                                    {(data.awards || []).map((a, i) => (
                                        <div key={`a-${i}`}>
                                            <h3 className="text-sm font-black text-slate-800 uppercase">{a.title}</h3>
                                            <p className="text-[10px] text-slate-400 mt-1">{a.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section className="bg-white/30 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-sm">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-8 italic">Passions</h2>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="px-4 py-1.5 bg-white/50 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div >
        </div >
    ),

    cryptic: ({ data, primaryColor }) => (
        <div className="bg-black w-[794px] mx-auto shadow-2xl p-16 resume-page font-mono text-[#00ff41] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-[8px] leading-none overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i}>{Array.from({ length: 100 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}</div>
                ))}
            </div>
            <header className="mb-20 border-b border-[#00ff41]/20 pb-12 relative z-10">
                <h1 className="text-5xl font-bold mb-4 tracking-tighter uppercase glitch-text" style={{ textShadow: `2px 0 #ff00c1, -2px 0 #00fff9` }}>{data.personalInfo.fullName}</h1>
                <div className="flex flex-col gap-2 opacity-50 text-[10px]">
                    <p>UUID: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                    <p>LEVEL: SENIOR_ENGR_{new Date().getFullYear()}</p>
                    <p>STATUS: ACTIVE</p>
                </div>
                <div className="mt-8 flex gap-8 text-xs font-bold">
                    <span>{`{ ${data.personalInfo.email} }`}</span>
                    <span>{`[ ${data.personalInfo.phone} ]`}</span>
                </div>
                <div className="mt-8 max-w-2xl text-[11px] leading-relaxed text-[#00ff41]/60 italic uppercase">
                    {`# cat info.txt`} <br />
                    {data.personalInfo.summary}
                </div>
            </header>
            <div className="space-y-16 relative z-10">
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.5em] mb-10 bg-[#00ff41]/10 px-4 py-1 inline-block border-l-4 border-[#00ff41]">Core_Data.exe</h2>
                    <div className="space-y-12">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="group border border-[#00ff41]/5 p-8 hover:bg-[#00ff41]/5 transition-all">
                                <div className="flex justify-between items-baseline mb-4">
                                    <h3 className="text-xl font-bold text-white uppercase">{exp.company}</h3>
                                    <span className="text-[10px] opacity-40 font-mono tracking-tighter">{exp.startDate} {">>"} {exp.endDate || 'NULL'}</span>
                                </div>
                                <p className="text-xs font-bold mb-6 italic" style={{ color: primaryColor }}>@Role: {exp.position}</p>
                                <p className="text-xs leading-relaxed text-[#00ff41]/70 font-medium whitespace-pre-line border-l border-[#00ff41]/20 pl-6">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.5em] mb-10 bg-[#00ff41]/10 px-4 py-1 inline-block border-l-4 border-[#00ff41]">Academic_Records</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, i) => (
                                <div key={i} className="border border-[#00ff41]/5 p-8">
                                    <h3 className="text-xl font-bold text-white uppercase mb-2">{edu.school}</h3>
                                    <p className="text-[10px] opacity-40 italic">{edu.degree} // {edu.startDate}-{edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.5em] mb-10 bg-[#00ff41]/10 px-4 py-1 inline-block border-l-4 border-[#00ff41]">Linguistic_Modules</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.languages.map((l, i) => (
                                <div key={i} className="border border-[#00ff41]/5 p-4 flex justify-between">
                                    <span className="text-xs font-bold">{l.language}</span>
                                    <span className="text-[10px] opacity-30">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.5em] mb-10 bg-[#00ff41]/10 px-4 py-1 inline-block border-l-4 border-[#00ff41]">Project_Protocols</h2>
                        <div className="space-y-12">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="group border border-[#00ff41]/5 p-8 hover:bg-[#00ff41]/5 transition-all">
                                    <h3 className="text-xl font-bold text-white uppercase mb-2">{proj.name}</h3>
                                    <p className="text-xs leading-relaxed text-[#00ff41]/70 font-medium whitespace-pre-line border-l border-[#00ff41]/20 pl-6">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.5em] mb-10 bg-[#00ff41]/10 px-4 py-1 inline-block border-l-4 border-[#00ff41]">Auth_Keys</h2>
                        <div className="space-y-6">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="border border-[#00ff41]/5 p-6">
                                    <h3 className="text-sm font-bold text-white uppercase">{cert.name}</h3>
                                    <p className="text-[10px] text-[#00ff41]/50 mt-1 font-mono">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.awards && data.awards.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.5em] mb-10 bg-[#00ff41]/10 px-4 py-1 inline-block border-l-4 border-[#00ff41]">System_Rewards</h2>
                        <div className="space-y-6">
                            {data.awards.map((award, i) => (
                                <div key={i} className="border border-[#00ff41]/5 p-6">
                                    <h3 className="text-sm font-bold text-white uppercase">{award.title}</h3>
                                    <p className="text-[10px] text-[#00ff41]/50 mt-1 font-mono">{award.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.5em] mb-10 bg-[#00ff41]/10 px-4 py-1 inline-block border-l-4 border-[#00ff41]">Background_Tasks</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map((interest, i) => (
                                <span key={i} className="px-3 py-1 bg-[#00ff41]/5 text-[10px] font-bold text-[#00ff41]/70 border border-[#00ff41]/20 uppercase tracking-widest">{interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),

    zenith: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-playfair text-slate-900 border-t-[12px]" style={{ borderColor: primaryColor }}>
            <header className="mb-24 text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6 italic">— Excellence Profile —</div>
                <h1 className="text-7xl font-bold mb-4 tracking-tighter italic">{data.personalInfo.fullName}</h1>
                <p className="text-sm font-light tracking-[0.3em] uppercase text-slate-400 mb-12">{data.experience[0]?.position}</p>
                <div className="h-px w-24 bg-slate-100 mx-auto mb-12"></div>
                <div className="flex justify-center gap-12 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
                <div className="mt-12 max-w-lg mx-auto">
                    <p className="text-base font-lora text-slate-500 leading-relaxed italic">"{data.personalInfo.summary}"</p>
                </div>
            </header>
            <div className="max-w-2xl mx-auto space-y-24">
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-200 mb-16 text-center italic">Professional Chronicles</h2>
                    <div className="space-y-20">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="text-center group">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] mb-4 block italic">{exp.startDate} - {exp.endDate || 'Now'}</span>
                                <h3 className="text-3xl font-bold mb-2 italic" style={{ color: primaryColor }}>{exp.company}</h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">{exp.position}</p>
                                <p className="text-sm font-lora text-slate-500 leading-relaxed italic last:mb-0">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-200 mb-16 text-center italic">Academic Foundation</h2>
                        <div className="space-y-12">
                            {data.education.map((edu, i) => (
                                <div key={i} className="text-center">
                                    <h3 className="text-xl font-bold text-slate-800 italic">{edu.school}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">{edu.degree}</p>
                                    <p className="text-[10px] text-slate-300 mt-1">{edu.startDate} — {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-200 mb-16 text-center italic">Curated Projects</h2>
                        <div className="grid grid-cols-2 gap-12">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="text-center">
                                    <h3 className="text-sm font-black text-slate-800 uppercase italic mb-4">{proj.name}</h3>
                                    <p className="text-xs font-lora text-slate-500 leading-relaxed italic">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                <div className="grid grid-cols-2 gap-16">
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 text-center italic">Dialect</h2>
                            <div className="space-y-4 text-center">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        {l.language} / <span className="text-slate-200">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                        <section>
                            <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 text-center italic">Distinctions</h2>
                            <div className="space-y-6 text-center">
                                {(data.certifications || []).map((c, i) => (
                                    <div key={i}>
                                        <p className="text-[11px] font-bold text-slate-800 italic">{c.name}</p>
                                        <p className="text-[9px] text-slate-300 uppercase mt-1">{c.issuer}</p>
                                    </div>
                                ))}
                                {(data.awards || []).map((a, i) => (
                                    <div key={`a-${i}`}>
                                        <p className="text-[11px] font-bold text-slate-800 italic">{a.title}</p>
                                        <p className="text-[9px] text-slate-300 uppercase mt-1">{a.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                {data.interests && data.interests.length > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 text-center italic">Interests</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 text-center">
                            {data.interests.join(" • ")}
                        </p>
                    </section>
                )}
            </div>
        </div>
    ),

    orbit: ({ data, primaryColor }) => (
        <div className="bg-slate-50 w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full border border-slate-200 -mr-20 -mt-20 opacity-20 animate-spin-slow"></div>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full border border-slate-200 -mr-10 -mt-10 opacity-30 animate-spin-reverse-slow"></div>
            <header className="mb-20 flex justify-between items-center relative z-10">
                <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-white flex-1 mr-8">
                    <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-2 uppercase">{data.personalInfo.fullName}</h1>
                    <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-300 italic mb-6">Master Domain: {data.experience[0]?.position}</p>
                    <div className="flex gap-8 text-[10px] font-bold text-slate-400 mb-6">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed italic font-medium">"{data.personalInfo.summary}"</p>
                </div>
                <div className="w-32 h-32 rounded-full p-1 border-2 border-slate-100 flex items-center justify-center bg-white shadow-xl">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black text-white" style={{ backgroundColor: primaryColor }}>
                        {data.personalInfo.fullName.charAt(0)}
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-12 relative z-10">
                <div className="col-span-12 space-y-12">
                    <section className="bg-white p-10 rounded-[40px] shadow-sm border border-white/50">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 flex items-center gap-6 underline underline-offset-8 decoration-slate-100">Experience Orbit</h2>
                        <div className="grid grid-cols-2 gap-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="group hover:bg-slate-50 p-6 rounded-3xl transition-colors">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black" style={{ backgroundColor: `${primaryColor}${i % 2 === 0 ? 'ff' : '88'}` }}>
                                            0{i + 1}
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{exp.startDate} - {exp.endDate || 'Now'}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-1">{exp.company}</h3>
                                    <p className="text-xs font-bold mb-4 opacity-40 uppercase tracking-widest">{exp.position}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-4 italic">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-3 gap-12">
                        {data.education && data.education.length > 0 && (
                            <section className="bg-white p-10 rounded-[40px] shadow-sm border border-white/50 col-span-1">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Academy</h2>
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{edu.school}</p>
                                            <p className="text-[9px] text-slate-400 mt-1 italic">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {data.projects && data.projects.length > 0 && (
                            <section className="bg-white p-10 rounded-[40px] shadow-sm border border-white/50 col-span-2">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Project Constellations</h2>
                                <div className="grid grid-cols-2 gap-8">
                                    {data.projects.map((proj, i) => (
                                        <div key={i}>
                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-2">{proj.name}</p>
                                            <p className="text-[9px] text-slate-400 leading-relaxed line-clamp-2">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-12">
                        {data.languages && data.languages.length > 0 && (
                            <section className="bg-white p-10 rounded-[40px] shadow-sm border border-white/50 col-span-1">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Voices</h2>
                                <div className="space-y-3">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
                                            <span>{l.language}</span>
                                            <span className="opacity-40">{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                            <section className="bg-white p-10 rounded-[40px] shadow-sm border border-white/50 col-span-2">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Auth & Honors</h2>
                                <div className="grid grid-cols-2 gap-8">
                                    {(data.certifications || []).map((c, i) => (
                                        <div key={i}>
                                            <p className="text-xs font-bold text-slate-800 uppercase">{c.name}</p>
                                            <p className="text-[9px] text-slate-300 italic">{c.issuer}</p>
                                        </div>
                                    ))}
                                    {(data.awards || []).map((a, i) => (
                                        <div key={`a-${i}`}>
                                            <p className="text-xs font-bold text-slate-800 uppercase">{a.title}</p>
                                            <p className="text-[9px] text-slate-300 italic">{a.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {data.interests && data.interests.length > 0 && (
                            <section className="bg-white p-10 rounded-[40px] shadow-sm border border-white/50 col-span-1">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Passions</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-[9px] font-bold text-slate-400 italic">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),

    pulse: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-900 border-l-[24px]" style={{ borderLeftColor: primaryColor }}>
            <header className="mb-24 flex justify-between items-start">
                <div className="max-w-lg">
                    <h1 className="text-7xl font-black tracking-tighter leading-none mb-6 uppercase italic underline decoration-slate-100 decoration-[16px] underline-offset-[-8px]">{data.personalInfo.fullName}</h1>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest italic">{data.experience[0]?.position}</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-4">Pulse ID</div>
                    <div className="h-8 w-1 flex flex-col gap-1 ml-auto">
                        <div className="h-4 w-full" style={{ backgroundColor: primaryColor }}></div>
                        <div className="h-2 w-full bg-slate-200"></div>
                        <div className="h-1 w-full bg-slate-100"></div>
                    </div>
                </div>
            </header>
            <div className="mb-16 px-12">
                <p className="text-sm leading-relaxed text-slate-500 italic max-w-2xl mx-auto text-center font-medium">"{data.personalInfo.summary}"</p>
            </div>
            <div className="grid grid-cols-12 gap-16">

                <div className="col-span-4 space-y-12">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Signal</h2>
                        <div className="flex flex-col gap-4 text-sm font-bold">
                            <span className="p-3 bg-slate-50 rounded-2xl border border-slate-100">{data.personalInfo.email}</span>
                            <span className="p-3 bg-slate-50 rounded-2xl border border-slate-100">{data.personalInfo.phone}</span>
                            <span className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400">{data.personalInfo.address}</span>
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Academy</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="p-4 border-l-2" style={{ borderColor: primaryColor }}>
                                        <p className="text-xs font-black text-slate-800 uppercase">{edu.school}</p>
                                        <p className="text-[10px] text-slate-400 italic">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Dialect</h2>
                            <div className="space-y-3">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                        <span>{l.language}</span>
                                        <span className="opacity-30">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Passions</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-300 uppercase italic tracking-tighter">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className="col-span-8 space-y-16">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">History Wave</h2>
                        <div className="space-y-12">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-10 h-full w-1 bg-slate-50 group-hover:bg-current transition-colors overflow-hidden" style={{ color: primaryColor }}>
                                        <div className="h-full w-full animate-pulse bg-current opacity-20"></div>
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter mb-1 uppercase">{exp.company}</h3>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-sm font-bold italic" style={{ color: primaryColor }}>{exp.position}</p>
                                        <span className="text-[10px] font-black text-slate-300 tabular-nums uppercase">{exp.startDate} :: {exp.endDate || 'NOW'}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Visual Pulse</h2>
                            <div className="grid grid-cols-2 gap-10">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 group hover:border-slate-900 transition-colors">
                                        <h3 className="text-lg font-black uppercase tracking-tighter mb-4">{proj.name}</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed italic">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">High Signals</h2>
                            <div className="grid grid-cols-2 gap-10">
                                {(data.certifications || []).map((c, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-black text-slate-800 uppercase mb-2">{c.name}</h3>
                                        <p className="text-[10px] text-slate-400 italic">{c.issuer} // {c.date}</p>
                                    </div>
                                ))}
                                {(data.awards || []).map((a, i) => (
                                    <div key={`a-${i}`}>
                                        <h3 className="text-sm font-black text-slate-800 uppercase mb-2">{a.title}</h3>
                                        <p className="text-[10px] text-slate-400 italic">{a.issuer} // {a.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    fission: ({ data, primaryColor }) => (
        <div className="bg-slate-900 w-[794px] mx-auto shadow-2xl resume-page font-inter flex min-h-[1123px]">
            <div className="w-[340px] bg-white p-16 flex flex-col gap-16 shadow-2xl z-10">
                <header>
                    <div className="w-16 h-1 bg-slate-900 mb-8" style={{ backgroundColor: primaryColor }}></div>
                    <h1 className="text-6xl font-black tracking-tighter leading-none uppercase mb-6">{data.personalInfo.fullName.split(' ')[0]}<br /><span className="text-slate-300">{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span></h1>
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8 italic">{data.experience[0]?.position}</p>
                    <p className="text-sm text-slate-400 leading-relaxed font-light italic mb-12">"{data.personalInfo.summary}"</p>
                </header>
                <div className="space-y-12">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-8 pb-2 border-b">Directives</h2>
                        <div className="flex flex-col gap-4">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-1.5 h-1.5 rotate-45 border border-slate-200 group-hover:bg-slate-900 transition-all" style={{ backgroundColor: i % 2 === 0 ? primaryColor : undefined }}></div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{s}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-8 pb-2 border-b">Academy</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-black text-slate-800 uppercase">{edu.school}</p>
                                        <p className="text-[9px] text-slate-400 italic">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-8 pb-2 border-b">Dialects</h2>
                            <div className="space-y-3">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                        <span>{l.language}</span>
                                        <span className="opacity-30">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-8 pb-2 border-b">Fissions</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="text-[10px] font-bold text-slate-300 uppercase italic">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <footer className="mt-auto pt-12 border-t border-slate-50 text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-loose">
                    <p>{data.personalInfo.email}</p>
                    <p>{data.personalInfo.phone}</p>
                </footer>
            </div>
            <div className="flex-1 p-20 bg-slate-900 text-white flex flex-col gap-12 overflow-hidden">
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12 flex items-center gap-6 italic">Professional Core <div className="h-px flex-1 bg-white/5"></div></h2>
                    <div className="space-y-16">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -left-10 top-2 text-[10px] font-black text-white/10 uppercase origin-left rotate-90">{exp.startDate}</div>
                                <h3 className="text-3xl font-black text-white tracking-widest mb-2 italic" style={{ textShadow: `0 0 20px ${primaryColor}44` }}>{exp.company}</h3>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] mb-6" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-sm text-white/40 leading-relaxed font-light text-justify italic">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12 flex items-center gap-6 italic">Visual Fission <div className="h-px flex-1 bg-white/5"></div></h2>
                        <div className="grid grid-cols-2 gap-12 text-white/40">
                            {data.projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="text-lg font-black italic mb-2 uppercase tracking-tighter" style={{ color: primaryColor }}>{proj.name}</h3>
                                    <p className="text-xs leading-relaxed italic">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12 flex items-center gap-6 italic">Credentials <div className="h-px flex-1 bg-white/5"></div></h2>
                        <div className="grid grid-cols-2 gap-12 text-white/40">
                            {(data.certifications || []).map((c, i) => (
                                <div key={i}>
                                    <h3 className="text-lg font-black italic mb-2 uppercase tracking-tighter" style={{ color: primaryColor }}>{c.name}</h3>
                                    <p className="text-xs italic">{c.issuer}</p>
                                </div>
                            ))}
                            {(data.awards || []).map((a, i) => (
                                <div key={`a-${i}`}>
                                    <h3 className="text-lg font-black italic mb-2 uppercase tracking-tighter" style={{ color: primaryColor }}>{a.title}</h3>
                                    <p className="text-xs italic">{a.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),

    glitch: ({ data, primaryColor }) => (
        <div className="bg-black w-[794px] mx-auto shadow-2xl p-16 resume-page font-mono text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,#111,black)]"></div>
            <header className="mb-24 relative z-10 group">
                <h1 className="text-8xl font-black tracking-tighter leading-none mb-4 uppercase inline-block relative border-b-8 border-white/10 italic">
                    <span className="relative z-10">{data.personalInfo.fullName}</span>
                    <span className="absolute top-1 left-1 z-0 text-red-500 opacity-50 group-hover:translate-x-1 transition-transform">{data.personalInfo.fullName}</span>
                    <span className="absolute -top-1 -left-1 z-0 text-cyan-500 opacity-50 group-hover:-translate-x-1 transition-transform">{data.personalInfo.fullName}</span>
                </h1>
                <div className="flex justify-between items-center mt-8 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <p>{`>>> IDENTIFIED: ${data.experience[0]?.position}`}</p>
                    <div className="flex gap-8">
                        <span className="bg-white/5 px-2 py-1">{data.personalInfo.email}</span>
                        <span className="bg-white/5 px-2 py-1">{data.personalInfo.phone}</span>
                    </div>
                </div>
                <div className="mt-8 p-4 bg-white/5 border border-white/10">
                    <p className="text-xs text-white/40 leading-relaxed uppercase tracking-tighter">
                        <span className="text-cyan-500 mr-2">SUMMARY_INIT:</span>
                        {data.personalInfo.summary}
                    </p>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-12 relative z-10">
                <div className="col-span-12 space-y-16">
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.8em] text-white/20 mb-12 border-l-8 pl-6 flex justify-between" style={{ borderColor: primaryColor }}>
                            LOG_EXTRACT // HISTORY
                            <span className="opacity-10">BUILD_{Date.now().toString(36).toUpperCase()}</span>
                        </h2>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="border-l border-white/5 pl-10 hover:border-white/20 transition-colors relative">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full border border-white/20 bg-black"></div>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-3xl font-black italic tracking-widest uppercase" style={{ color: i === 0 ? primaryColor : 'white' }}>{exp.company}</h3>
                                        <span className="text-[10px] font-bold text-white/10 tabular-nums">{exp.startDate} - {exp.endDate || 'INF'}</span>
                                    </div>
                                    <p className="text-sm font-bold mb-6 italic text-white/40 tracking-[0.2em]">{exp.position}</p>
                                    <p className="text-xs text-white/30 leading-relaxed font-medium text-justify uppercase tracking-tighter sm:tracking-normal">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.8em] text-white/20 mb-12 border-l-8 pl-6" style={{ borderColor: primaryColor }}>
                                COMPILED_ASSETS // PROJECTS
                            </h2>
                            <div className="grid grid-cols-2 gap-12">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="bg-white/5 p-8 border border-white/10 group hover:border-white/40 transition-all">
                                        <h3 className="text-xl font-bold italic mb-4 uppercase" style={{ color: primaryColor }}>{proj.name}</h3>
                                        <p className="text-xs text-white/30 leading-relaxed uppercase tracking-tighter">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-2 gap-12">
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-[0.8em] text-white/20 mb-12 border-l-8 pl-6" style={{ borderColor: primaryColor }}>
                                    KNOWLEDGE_BASE
                                </h2>
                                <div className="space-y-8">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-bold text-white uppercase">{edu.school}</h3>
                                            <p className="text-xs text-white/30 mt-1 uppercase italic">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-[0.8em] text-white/20 mb-12 border-l-8 pl-6" style={{ borderColor: primaryColor }}>
                                    ENCODINGS
                                </h2>
                                <div className="space-y-4">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                                            <span>{l.language}</span>
                                            <span style={{ color: primaryColor }}>{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),

    echo: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-900 overflow-hidden relative">
            <header className="mb-24 relative">
                <div className="absolute -left-16 -top-16 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10"></div>
                <h1 className="text-8xl font-black tracking-tighter leading-none mb-8 opacity-10 absolute -top-8 -left-4 select-none whitespace-nowrap">{data.personalInfo.fullName}</h1>
                <h1 className="text-7xl font-black tracking-tighter leading-none mb-8 relative z-10">{data.personalInfo.fullName}</h1>
                <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-12">
                    <span style={{ color: primaryColor }}>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
                <p className="text-xl font-bold text-slate-400 italic leading-relaxed max-w-2xl">"{data.personalInfo.summary}"</p>
            </header>
            <div className="space-y-24">
                {data.experience.map((exp, i) => (
                    <section key={i} className="relative">
                        <div className="absolute -left-8 top-0 text-[80px] font-black opacity-[0.03] select-none leading-none -mt-4">{i + 1}</div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-baseline mb-4">
                                <h3 className="text-3xl font-black tracking-tighter">{exp.company}</h3>
                                <span className="text-[10px] font-bold text-slate-200 tabular-nums uppercase">{exp.startDate} - {exp.endDate || 'Present'}</span>
                            </div>
                            <p className="text-sm font-bold uppercase mb-6 italic tracking-widest" style={{ color: primaryColor }}>{exp.position}</p>
                            <p className="text-base text-slate-400 leading-relaxed font-medium text-justify max-w-2xl">{exp.description}</p>
                        </div>
                    </section>
                ))}

                {data.education && data.education.length > 0 && (
                    <section className="relative pt-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Academic Reverberations</h2>
                        <div className="grid grid-cols-2 gap-16">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="text-2xl font-black tracking-tighter mb-2 italic">{edu.school}</h3>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.projects && data.projects.length > 0 && (
                    <section className="relative pt-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Visual Resonance</h2>
                        <div className="space-y-20">
                            {data.projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="text-4xl font-black tracking-tighter mb-4 opacity-40">{proj.name}</h3>
                                    <p className="text-base text-slate-400 leading-relaxed italic">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-24 pt-12">
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Echoes</h2>
                            <div className="space-y-4">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between text-sm font-bold italic">
                                        <span>{l.language}</span>
                                        <span className="text-slate-200">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Certifications</h2>
                            <div className="space-y-4">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-slate-800 italic">{cert.name}</h3>
                                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Awards</h2>
                            <div className="space-y-4">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-slate-800 italic">{award.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Vibrations</h2>
                            <div className="flex flex-wrap gap-4">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    void: ({ data, primaryColor }) => (
        <div className="bg-black w-[794px] mx-auto shadow-2xl p-24 resume-page font-inter text-white">
            <header className="mb-32 border-b-2 border-white pb-16">
                <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-12 uppercase">{data.personalInfo.fullName}</h1>
                <div className="flex gap-16 text-xs font-black uppercase tracking-[0.5em] text-white/40">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="space-y-24">
                <section>
                    <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-8">Base_Protocol</div>
                    <p className="text-lg text-white/60 leading-relaxed font-light italic">"{data.personalInfo.summary}"</p>
                </section>
                <section>
                    <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-16">Selected_Experience</div>
                    <div className="space-y-20">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="group">
                                <span className="text-[10px] font-black text-white/10 uppercase mb-4 block tracking-[0.4em]">{exp.startDate} — {exp.endDate || 'LATEST'}</span>
                                <h3 className="text-4xl font-black uppercase mb-2 group-hover:italic transition-all">{exp.company}</h3>
                                <p className="text-sm font-bold uppercase mb-8" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-sm text-white/40 leading-relaxed font-medium text-justify">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-24">
                    {data.education && data.education.length > 0 && (
                        <section>
                            <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-12">Education_Void</div>
                            <div className="space-y-12">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-2xl font-black uppercase">{edu.school}</h3>
                                        <p className="text-xs font-bold text-white/40 mt-1 uppercase italic tracking-widest">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-12">Project_Horizon</div>
                            <div className="space-y-12">
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="text-2xl font-black uppercase italic" style={{ color: primaryColor }}>{proj.name}</h3>
                                        <p className="text-xs text-white/40 leading-relaxed uppercase tracking-tighter mt-2">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-24">
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-8">Languages</div>
                            <div className="space-y-4">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="flex justify-between text-xs font-black uppercase tracking-widest">
                                        <span>{l.language}</span>
                                        <span className="text-white/20">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-8">Certifications</div>
                            <div className="space-y-4">
                                {data.certifications.map((cert, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-white uppercase">{cert.name}</h3>
                                        <p className="text-[10px] text-white/40 mt-1 font-mono">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-8">Awards</div>
                            <div className="space-y-4">
                                {data.awards.map((award, i) => (
                                    <div key={i}>
                                        <h3 className="text-sm font-bold text-white uppercase">{award.title}</h3>
                                        <p className="text-[10px] text-white/40 mt-1 font-mono">{award.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <div className="text-sm font-black uppercase tracking-[0.8em] text-white/20 mb-8">Sectors</div>
                            <div className="flex flex-wrap gap-4">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="text-xs font-black uppercase tracking-widest text-white/40">{interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    stellar: ({ data, primaryColor }) => (
        <div className="bg-[#020617] w-[794px] mx-auto shadow-2xl resume-page font-outfit text-white min-h-[1123px] relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="absolute bg-white rounded-full" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: Math.random() * 2 + 'px',
                        height: Math.random() * 2 + 'px',
                        opacity: Math.random() * 0.5
                    }}></div>
                ))}
            </div>
            <div className="relative z-10 p-20 flex flex-col h-full">
                <header className="mb-32">
                    <h1 className="text-7xl font-black tracking-tighter mb-4 leading-none uppercase" style={{ textShadow: `0 0 20px ${primaryColor}77` }}>{data.personalInfo.fullName}</h1>
                    <p className="text-sm font-bold uppercase tracking-[0.6em] text-slate-500 italic mb-8">Professional Trajectory: {data.experience[0]?.position}</p>
                    <p className="text-sm text-slate-400 font-light italic leading-relaxed max-w-xl mb-12">"{data.personalInfo.summary}"</p>
                    <div className="h-px w-full bg-white/10"></div>
                </header>
                <div className="grid grid-cols-12 gap-16 flex-1">
                    <div className="col-span-8 space-y-20">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 mb-12 italic">Experience Nodes</h2>
                            <div className="space-y-16">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-12">
                                        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: primaryColor }}></div>
                                        <div className="flex justify-between items-baseline mb-4">
                                            <h3 className="text-2xl font-black text-white/90">{exp.company}</h3>
                                            <span className="text-[10px] font-bold text-slate-600 tabular-nums uppercase">{exp.startDate} - {exp.endDate || 'INF'}</span>
                                        </div>
                                        <p className="text-xs font-bold uppercase mb-6 tracking-widest text-slate-400 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                        <p className="text-sm text-slate-500 leading-relaxed font-light text-justify">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 mb-12 italic">Visual Constellations</h2>
                                <div className="grid grid-cols-2 gap-12 text-slate-400">
                                    {data.projects.map((proj, i) => (
                                        <div key={i} className="border-l border-white/5 pl-8">
                                            <h3 className="text-lg font-black italic mb-2 uppercase tracking-tighter" style={{ color: primaryColor }}>{proj.name}</h3>
                                            <p className="text-xs leading-relaxed italic">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="col-span-4 space-y-16">
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 mb-8 italic">Academy</h2>
                                <div className="space-y-8">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-bold text-white uppercase">{edu.school}</h3>
                                            <p className="text-[10px] text-slate-500 italic uppercase tracking-widest mt-1">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 mb-8 italic">Signals</h2>
                                <div className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span>{l.language}</span>
                                            <span className="text-white/20">{l.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 mb-8 italic">Auth Tokens</h2>
                                <div className="space-y-8">
                                    {data.certifications.map((cert, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-bold text-white uppercase">{cert.name}</h3>
                                            <p className="text-[10px] text-slate-500 italic uppercase tracking-widest mt-1">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.awards && data.awards.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 mb-8 italic">Achievements</h2>
                                <div className="space-y-8">
                                    {data.awards.map((award, i) => (
                                        <div key={i}>
                                            <h3 className="text-sm font-bold text-white uppercase">{award.title}</h3>
                                            <p className="text-[10px] text-slate-500 italic uppercase tracking-widest mt-1">{award.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.interests && data.interests.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 mb-8 italic">Passions</h2>
                                <div className="flex flex-wrap gap-3">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ),

    pixel: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-mono text-slate-900 border-8 border-slate-900 border-double">
            <header className="mb-16 border-b-4 border-slate-900 pb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter underline underline-offset-8 decoration-4">{data.personalInfo.fullName}</h1>
                    <p className="text-xs font-bold uppercase tracking-widest">_SYSTEM_INIT: {data.experience[0]?.position}</p>
                </div>
                <div className="text-right text-[10px] font-black uppercase leading-relaxed">
                    <p>EMAIL: {data.personalInfo.email}</p>
                    <p>PHON: {data.personalInfo.phone}</p>
                    <p>ADDR: {data.personalInfo.address}</p>
                </div>
            </header>
            <div className="space-y-12">
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 bg-slate-900 text-white px-4 py-1 inline-block">CORE_SUMMARY</h2>
                    <p className="text-xs font-bold leading-relaxed">{data.personalInfo.summary}</p>
                </section>

                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 bg-slate-900 text-white px-4 py-1 inline-block">DEPLOYMENT_LOG</h2>
                    <div className="space-y-10">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="border-l-4 border-slate-100 pl-8 hover:border-slate-900 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-black uppercase">{exp.company}</h3>
                                    <span className="text-[10px] font-bold opacity-30">[{exp.startDate} - {exp.endDate || 'CURR'}]</span>
                                </div>
                                <p className="text-xs font-black mb-4 italic" style={{ color: primaryColor }}>@Role: {exp.position}</p>
                                <p className="text-xs text-slate-500 leading-relaxed font-bold">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 bg-slate-900 text-white px-4 py-1 inline-block">ACADEMIC_DATA</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <p className="text-sm font-black uppercase">{edu.school}</p>
                                    <p className="text-[10px] font-bold opacity-50">{edu.degree} IN {edu.fieldOfStudy}</p>
                                    <p className="text-[10px] tabular-nums mt-1">{edu.startDate} &gt;&gt; {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 bg-slate-900 text-white px-4 py-1 inline-block">SKILLSET_INDEX</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="text-[10px] font-black border-2 border-slate-900 px-2 py-0.5 uppercase">{skill}</span>
                            ))}
                        </div>
                    </section>
                </div>

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 bg-slate-900 text-white px-4 py-1 inline-block">PROJECT_BUILDS</h2>
                        <div className="grid grid-cols-2 gap-8">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="border-2 border-slate-100 p-6 hover:border-slate-900 transition-colors">
                                    <h3 className="text-lg font-black uppercase mb-4">{proj.name}</h3>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-4">{proj.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {proj.technologies.map((tech, t) => (
                                            <span key={t} className="text-[9px] font-black opacity-30">#{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-8">
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase mb-4 border-b-2 border-slate-900">ENCODINGS</h2>
                            <div className="space-y-2">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="text-[10px] font-bold uppercase flex justify-between">
                                        <span>{l.language}</span>
                                        <span className="opacity-40">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {((data.certifications?.length || 0) > 0) && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase mb-4 border-b-2 border-slate-900">CERTS</h2>
                            <div className="space-y-4">
                                {(data.certifications || []).map((c, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-black uppercase leading-tight">{c.name}</p>
                                        <p className="text-[9px] opacity-40">{c.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.awards && data.awards.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase mb-4 border-b-2 border-slate-900">AWARDS</h2>
                            <div className="space-y-4">
                                {data.awards.map((a, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-black uppercase leading-tight">{a.title}</p>
                                        <p className="text-[9px] opacity-40">{a.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                {data.interests && data.interests.length > 0 && (
                    <section className="pt-8 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">
                            FIELDS_OF_INTEREST: {data.interests.join(" // ")}
                        </p>
                    </section>
                )}
            </div>
        </div>
    ),

    apex: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-20 resume-page font-inter text-slate-900 border-[24px] border-slate-50">
            <header className="mb-24 flex flex-col items-center">
                <div className="w-px h-16 bg-slate-200 mb-8"></div>
                <h1 className="text-6xl font-black tracking-[0.2em] mb-4 uppercase leading-none text-center transform scale-y-110">{data.personalInfo.fullName}</h1>
                <p className="text-xs font-black uppercase tracking-[0.6em] text-slate-300 mb-12 italic">{data.experience[0]?.position}</p>
                <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{data.personalInfo.email}</span>
                    <span className="text-slate-200">/</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="max-w-xl mx-auto space-y-24">
                <section>
                    <p className="text-lg text-slate-400 text-center italic leading-relaxed font-light">"{data.personalInfo.summary}"</p>
                </section>
                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-200 mb-16 text-center italic">— Experience Apex —</h2>
                    <div className="space-y-20">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -left-16 top-2 text-[8px] font-black text-slate-100 uppercase tracking-widest rotate-[-90deg] origin-right">{exp.startDate}</div>
                                <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter text-center italic" style={{ color: i === 0 ? primaryColor : 'inherit' }}>{exp.company}</h3>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-8 text-center">{exp.position}</p>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium text-center italic opacity-80">{exp.description}</p>
                                {i < data.experience.length - 1 && <div className="h-px w-12 bg-slate-100 mx-auto mt-20"></div>}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-200 mb-16 text-center italic">— Education —</h2>
                    <div className="space-y-12">
                        {data.education.map((edu, i) => (
                            <div key={i} className="text-center group">
                                <h3 className="text-xl font-black mb-1 text-slate-800">{edu.school}</h3>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">{edu.degree} in {edu.fieldOfStudy}</p>
                                <p className="text-xs font-bold text-slate-400 opacity-60 italic">{edu.startDate} — {edu.endDate}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-200 mb-16 text-center italic">— Projects —</h2>
                    <div className="space-y-12">
                        {data.projects.map((project, i) => (
                            <div key={i} className="text-center group">
                                <div className="flex justify-center items-baseline gap-4 mb-2">
                                    <h3 className="text-xl font-black text-slate-800">{project.name}</h3>
                                    {project.link && <a href={project.link} className="text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-600 transition-colors">Link ↗</a>}
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium italic opacity-80 max-w-2xl mx-auto mb-4">{project.description}</p>
                                <div className="flex justify-center flex-wrap gap-2">
                                    {project.technologies.map((tech, t) => (
                                        <span key={t} className="text-[8px] font-black uppercase tracking-[0.2em] bg-slate-50 text-slate-400 px-2 py-1 rounded">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-200 mb-16 text-center italic">— Skills —</h2>
                    <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                        {data.skills.map((s, i) => (
                            <span key={i} className="text-xs font-bold text-slate-600 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">{s}</span>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-200 mb-8 text-center italic">Languages</h2>
                        <div className="space-y-2 text-center">
                            {data.languages.map((l, i) => (
                                <div key={i} className="text-sm font-bold text-slate-600">
                                    {l.language} <span className="opacity-40 font-normal italic">/ {l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-200 mb-8 text-center italic">Honors</h2>
                        <div className="space-y-4 text-center">
                            {(data.certifications || []).map((c, i) => (
                                <div key={i} className="text-sm font-bold text-slate-600">
                                    {c.name} <span className="text-[10px] block opacity-40 font-normal italic uppercase tracking-widest">{c.issuer}</span>
                                </div>
                            ))}
                            {(data.awards || []).map((a, i) => (
                                <div key={`a-${i}`} className="text-sm font-bold text-slate-600">
                                    {a.title} <span className="text-[10px] block opacity-40 font-normal italic uppercase tracking-widest">{a.issuer}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {(data.interests?.length || 0) > 0 && (
                    <section>
                        <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-200 mb-8 text-center italic">Interests</h2>
                        <div className="flex justify-center flex-wrap gap-4">
                            {(data.interests || []).map((interest, i) => (
                                <span key={i} className="text-sm font-medium text-slate-500 italic">• {interest}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    ),

    simple_sidebar: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-12 resume-page font-serif text-slate-900 grid grid-cols-12 gap-12">
            <div className="col-span-8 pr-8 border-r border-slate-100 min-h-[900px]">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold mb-2 tracking-tight">{data.personalInfo.fullName}</h1>
                    <p className="text-lg text-slate-500 italic">{data.experience[0]?.position}</p>
                </header>
                <section className="mb-12">
                    <p className="text-sm text-slate-600 leading-relaxed italic">{data.personalInfo.summary}</p>
                </section>
                <section className="mb-12">
                    <h2 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b-2" style={{ color: primaryColor }}>Experience</h2>
                    <div className="space-y-8">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-xl font-bold text-slate-800">{exp.company}</h3>
                                    <span className="text-sm text-slate-400 italic">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                </div>
                                <p className="text-sm font-semibold mb-3 italic opacity-70">{exp.position}</p>
                                <p className="text-sm text-slate-600 leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b-2" style={{ color: primaryColor }}>Education</h2>
                    <div className="space-y-6">
                        {data.education.map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{edu.school}</h3>
                                    <span className="text-sm text-slate-400 italic">{edu.startDate} — {edu.endDate}</span>
                                </div>
                                <p className="text-sm text-slate-600 italic">{edu.degree} in {edu.fieldOfStudy}</p>
                                {edu.description && <p className="text-sm text-slate-500 mt-2">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b-2" style={{ color: primaryColor }}>Projects</h2>
                    <div className="space-y-6">
                        {data.projects.map((project, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                                    {project.link && <a href={project.link} className="text-sm text-blue-600 underline decoration-1 underline-offset-2">{project.link}</a>}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.technologies.map((tech, tIndex) => (
                                        <span key={tIndex} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <div className="col-span-4 pl-4 space-y-12">
                <section>
                    <p className="text-sm leading-relaxed text-slate-500">{data.personalInfo.address}</p>
                    <p className="text-sm font-bold mt-2">{data.personalInfo.phone}</p>
                    <p className="text-sm font-bold text-blue-600 underline cursor-pointer">{data.personalInfo.email}</p>
                </section>
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6" style={{ color: primaryColor }}>Skills</h2>
                    <div className="flex flex-col gap-3">
                        {data.skills.map((s, i) => (
                            <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                {s}
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6" style={{ color: primaryColor }}>Languages</h2>
                    <div className="flex flex-col gap-2">
                        {data.languages.map((l, i) => (
                            <div key={i} className="text-sm text-slate-600">
                                <span className="font-bold">{l.language}:</span> {l.proficiency}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6" style={{ color: primaryColor }}>Certifications</h2>
                    <div className="space-y-4">
                        {(data.certifications || []).map((cert, i) => (
                            <div key={i} className="text-sm text-slate-600">
                                <h4 className="font-bold">{cert.name}</h4>
                                <p className="text-slate-400 italic">{cert.issuer}, {cert.date}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6" style={{ color: primaryColor }}>Awards</h2>
                    <div className="space-y-4">
                        {(data.awards || []).map((award, i) => (
                            <div key={i} className="text-sm text-slate-600">
                                <h4 className="font-bold">{award.title}</h4>
                                <p className="text-slate-400 italic">{award.issuer}, {award.date}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6" style={{ color: primaryColor }}>Interests</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {(data.interests || []).map((interest, i) => (
                            <span key={i} className="text-sm text-slate-600">• {interest}</span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    ),

    modern_elegant: ({ data, primaryColor }) => (
        <div className="bg-[#fdfdfd] w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-800">
            <header className="mb-20 text-center">
                <h1 className="text-6xl font-black tracking-tighter mb-4 text-slate-900">{data.personalInfo.fullName}</h1>
                <div className="flex justify-center items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                    <span>{data.personalInfo.email}</span>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                    <span>{data.personalInfo.phone}</span>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                    <span>{data.personalInfo.address}</span>
                </div>
            </header>
            <div className="space-y-16">
                <section className="relative">
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 absolute -left-20 top-2 rotate-[-90deg] origin-right">Profile</h2>
                    <p className="text-sm leading-relaxed text-slate-500 italic max-w-2xl mx-auto text-center">"{data.personalInfo.summary}"</p>
                </section>
                <section className="relative border-t border-slate-100 pt-12">
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 absolute -left-20 top-14 rotate-[-90deg] origin-right">History</h2>
                    <div className="space-y-12">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="grid grid-cols-12 gap-8 outline-none">
                                <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-300 pt-2 tabular-nums">
                                    {exp.startDate} <br /> {exp.endDate || 'Present'}
                                </div>
                                <div className="col-span-9">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-1">{exp.company}</h3>
                                    <p className="text-sm font-bold uppercase tracking-widest mb-4 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="relative border-t border-slate-100 pt-12">
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 absolute -left-20 top-14 rotate-[-90deg] origin-right">Education</h2>
                    <div className="space-y-12">
                        {data.education.map((edu, i) => (
                            <div key={i} className="grid grid-cols-12 gap-8">
                                <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-300 pt-2 tabular-nums">
                                    {edu.startDate} <br /> {edu.endDate}
                                </div>
                                <div className="col-span-9">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">{edu.school}</h3>
                                    <p className="text-sm font-bold uppercase tracking-widest mb-2 italic opacity-60">{edu.degree} in {edu.fieldOfStudy}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="relative border-t border-slate-100 pt-12">
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 absolute -left-20 top-14 rotate-[-90deg] origin-right">Projects</h2>
                    <div className="space-y-12">
                        {data.projects.map((project, i) => (
                            <div key={i} className="grid grid-cols-12 gap-8">
                                <div className="col-span-3 pt-2">
                                    {project.link && <a href={project.link} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-600 transition-colors">View Project ↗</a>}
                                </div>
                                <div className="col-span-9">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{project.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, t) => (
                                            <span key={t} className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-400 px-2 py-1 rounded">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-16 border-t border-slate-100 pt-12">
                    <section className="relative">
                        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 absolute -left-20 top-0 rotate-[-90deg] origin-right">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">{skill}</span>
                            ))}
                        </div>
                    </section>
                    <section className="space-y-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Languages</h3>
                            {data.languages.map((l, i) => (
                                <div key={i} className="flex justify-between text-sm mb-2">
                                    <span className="font-bold text-slate-700">{l.language}</span>
                                    <span className="text-slate-400 italic">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Honors</h3>
                            {(data.certifications || []).map((c, i) => (
                                <div key={i} className="mb-2">
                                    <div className="text-sm font-bold text-slate-700">{c.name}</div>
                                    <div className="text-xs text-slate-400">{c.issuer}</div>
                                </div>
                            ))}
                            {(data.awards || []).map((a, i) => (
                                <div key={`a-${i}`} className="mb-2">
                                    <div className="text-sm font-bold text-slate-700">{a.title}</div>
                                    <div className="text-xs text-slate-400">{a.issuer}</div>
                                </div>
                            ))}
                        </div>
                        {(data.interests?.length || 0) > 0 && (
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Interests</h3>
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    {(data.interests || []).map((interest, i) => (
                                        <span key={i} className="text-sm font-medium text-slate-600 italic">• {interest}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div >
        </div >
    ),

    airy_minimal: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-24 resume-page font-outfit text-slate-900 border-x-[40px] border-slate-50">
            <header className="mb-24">
                <h1 className="text-7xl font-light tracking-tighter mb-4">{data.personalInfo.fullName.split(' ')[0]} <span className="font-black" style={{ color: primaryColor }}>{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span></h1>
                <p className="text-2xl font-light text-slate-400 italic">Exploring {data.experience[0]?.position}</p>
                <div className="h-px w-20 bg-slate-900 mt-12 mb-8"></div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.4em]">{data.personalInfo.email} // {data.personalInfo.phone}</p>
            </header>
            <section className="mb-24">
                <p className="text-xl font-light text-slate-500 leading-relaxed italic border-l-4 pl-12" style={{ borderColor: primaryColor }}>"{data.personalInfo.summary}"</p>
            </section>
            <div className="space-y-24">
                <section>
                    <div className="flex gap-12">
                        <div className="w-1 bg-slate-100"></div>
                        <div className="flex-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">The Journey</h2>
                            <div className="space-y-16">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-4">
                                            <h3 className="text-3xl font-black tracking-tighter text-slate-800">{exp.company}</h3>
                                            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">{exp.startDate} - {exp.endDate || 'Now'}</span>
                                        </div>
                                        <p className="text-xs font-bold uppercase mb-6 tracking-widest italic" style={{ color: primaryColor }}>{exp.position}</p>
                                        <p className="text-base text-slate-400 leading-relaxed font-light">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex gap-12">
                        <div className="w-1 bg-slate-100"></div>
                        <div className="flex-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Academic Path</h2>
                            <div className="space-y-10">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-2xl font-bold tracking-tight text-slate-800">{edu.school}</h3>
                                            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</span>
                                        </div>
                                        <p className="text-sm font-medium opacity-60 italic">{edu.degree} in {edu.fieldOfStudy}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex gap-12">
                        <div className="w-1 bg-slate-100"></div>
                        <div className="flex-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Key Selected Projects</h2>
                            <div className="space-y-12">
                                {data.projects.map((project, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-black text-slate-800">{project.name}</h3>
                                            {project.link && <a href={project.link} className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-slate-500 transition-colors">Link ↗</a>}
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed font-light mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, t) => (
                                                <span key={t} className="text-[10px] uppercase tracking-widest font-bold text-slate-300">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex gap-12">
                        <div className="w-1 bg-slate-100"></div>
                        <div className="flex-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Skillset</h2>
                            <div className="flex flex-wrap gap-4">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-sm font-light text-slate-500 pb-1 border-b border-slate-100">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Languages</h2>
                        <div className="space-y-2">
                            {data.languages.map((l, i) => (
                                <div key={i} className="flex justify-between text-sm text-slate-500 font-light">
                                    <span>{l.language}</span>
                                    <span className="opacity-50">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Honors & Certs</h2>
                        <div className="space-y-4">
                            {(data.certifications || []).map((c, i) => (
                                <div key={i} className="text-sm text-slate-500 font-light">
                                    <p className="font-medium text-slate-700">{c.name}</p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-50">{c.issuer}</p>
                                </div>
                            ))}
                            {(data.awards || []).map((a, i) => (
                                <div key={i} className="text-sm text-slate-500 font-light">
                                    <p className="font-medium text-slate-700">{a.title}</p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-50">{a.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {(data.interests?.length || 0) > 0 && (
                        <section>
                            <div className="flex gap-12">
                                <div className="w-1 bg-slate-100"></div>
                                <div className="flex-1">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 mb-12 italic">Side Quests</h2>
                                    <div className="flex flex-wrap gap-6">
                                        {(data.interests || []).map((interest, i) => (
                                            <span key={i} className="text-sm font-light text-slate-500 pb-1 border-b border-slate-50 italic">{interest}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    traditional_clean: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-inter text-slate-900">
            <header className="mb-12 border-b-2 border-slate-900 pb-8 text-center uppercase">
                <h1 className="text-4xl font-black mb-4 tracking-[0.2em]">{data.personalInfo.fullName}</h1>
                <div className="flex justify-center gap-8 text-[11px] font-bold text-slate-500">
                    <span>{data.personalInfo.address}</span>
                    <span>•</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>•</span>
                    <span>{data.personalInfo.email}</span>
                </div>
            </header>
            <div className="space-y-10">
                <section>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Professional Summary</h2>
                    <p className="text-[13px] leading-relaxed text-slate-600 text-justify">{data.personalInfo.summary}</p>
                </section>
                <section>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Employment History</h2>
                    <div className="space-y-8">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between font-bold text-slate-800 mb-1">
                                    <div className="flex gap-4 items-center">
                                        <span className="text-base font-black">{exp.company}</span>
                                        <span className="text-slate-200">|</span>
                                        <span className="text-sm font-bold uppercase italic opacity-60">{exp.position}</span>
                                    </div>
                                    <span className="text-[11px] tabular-nums">{exp.startDate} — {exp.endDate || 'Current'}</span>
                                </div>
                                <p className="text-[13px] text-slate-600 leading-relaxed mt-3">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Key Projects</h2>
                    <div className="space-y-6">
                        {data.projects.map((project, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-black text-slate-800">{project.name}</h3>
                                    {project.link && <a href={project.link} className="text-xs text-blue-600 underline">{project.link}</a>}
                                </div>
                                <p className="text-[13px] text-slate-600 leading-relaxed">{project.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Skills Area</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {data.skills.map((s, i) => (
                                <span key={i} className="text-[12px] font-medium text-slate-600">• {s}</span>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Academic Credentials</h2>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <p className="text-[13px] font-black text-slate-800">{edu.school}</p>
                                    <p className="text-[11px] font-bold text-slate-500 italic">{edu.degree} in {edu.fieldOfStudy}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Languages</h2>
                        <ul className="space-y-2">
                            {data.languages.map((l, i) => (
                                <li key={i} className="text-[13px] text-slate-600">
                                    <span className="font-bold">{l.language}</span>: {l.proficiency}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Certifications & Awards</h2>
                        <div className="space-y-3">
                            {(data.certifications || []).map((c, i) => (
                                <div key={i} className="text-[12px] text-slate-600">
                                    <span className="font-bold">{c.name}</span> <span className="text-slate-400">({c.issuer})</span>
                                </div>
                            ))}
                            {(data.awards || []).map((a, i) => (
                                <div key={i} className="text-[12px] text-slate-600">
                                    <span className="font-bold">{a.title}</span> <span className="text-slate-400">({a.issuer})</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="col-span-2">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b" style={{ color: primaryColor }}>Interests</h2>
                        <p className="text-[13px] text-slate-600 leading-relaxed">
                            {(data.interests || []).join(" • ")}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    ),

    compact_modern: ({ data, primaryColor }) => (
        <div className="bg-slate-50 w-[794px] mx-auto shadow-2xl p-12 resume-page font-inter text-slate-900 border-t-8" style={{ borderColor: primaryColor }}>
            <div className="bg-white p-12 shadow-sm rounded-xl">
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2 text-slate-950">{data.personalInfo.fullName}</h1>
                        <p className="text-sm font-bold text-slate-400 tracking-[0.4em] uppercase">{data.experience[0]?.position}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-xs font-bold">{data.personalInfo.email}</p>
                        <p className="text-xs font-bold">{data.personalInfo.phone}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest pt-2 italic">{data.personalInfo.address}</p>
                    </div>
                </header>
                <div className="mb-12">
                    <p className="text-sm text-slate-500 leading-relaxed italic">"{data.personalInfo.summary}"</p>
                </div>
                <div className="space-y-12">

                    <section>
                        <div className="h-0.5 w-12 bg-slate-900 mb-6" style={{ backgroundColor: primaryColor }}></div>
                        <h2 className="text-xs font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Experience Dataset</h2>
                        <div className="space-y-8">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="group overflow-hidden rounded-lg hover:bg-slate-50 transition-colors p-4 -ml-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{exp.company}</h3>
                                        <span className="text-[10px] font-bold text-slate-300 tabular-nums uppercase">{exp.startDate} :: {exp.endDate || 'Now'}</span>
                                    </div>
                                    <p className="text-xs font-black uppercase mb-3 opacity-60 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-[13px] text-slate-500 leading-relaxed text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="h-0.5 w-12 bg-slate-900 mb-6" style={{ backgroundColor: primaryColor }}></div>
                        <h2 className="text-xs font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Education Dataset</h2>
                        <div className="space-y-8">
                            {data.education.map((edu, i) => (
                                <div key={i} className="p-4 -ml-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{edu.school}</h3>
                                        <span className="text-[10px] font-bold text-slate-300 tabular-nums uppercase">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <p className="text-xs font-black uppercase mb-2 opacity-60 italic">{edu.degree} in {edu.fieldOfStudy}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="h-0.5 w-12 bg-slate-900 mb-6" style={{ backgroundColor: primaryColor }}></div>
                        <h2 className="text-xs font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Project Dataset</h2>
                        <div className="space-y-8">
                            {data.projects.map((project, i) => (
                                <div key={i} className="p-4 -ml-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{project.name}</h3>
                                        {project.link && <span className="text-[10px] font-bold text-slate-300 uppercase">{project.link}</span>}
                                    </div>
                                    <p className="text-[13px] text-slate-500 leading-relaxed text-justify mb-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, t) => (
                                            <span key={t} className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-400 px-2 py-1 rounded">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-12">
                        <section>
                            <div className="h-0.5 w-12 bg-slate-900 mb-6" style={{ backgroundColor: primaryColor }}></div>
                            <h2 className="text-xs font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Skillset</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded">{skill}</span>
                                ))}
                            </div>
                        </section>
                        <section>
                            <div className="h-0.5 w-12 bg-slate-900 mb-6" style={{ backgroundColor: primaryColor }}></div>
                            <h2 className="text-xs font-black uppercase tracking-[0.6em] text-slate-200 mb-8 italic">Addenda</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Languages</h3>
                                    {data.languages.map((l, i) => (
                                        <div key={i} className="text-xs font-bold text-slate-700">{l.language} / {l.proficiency}</div>
                                    ))}
                                </div>
                                {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Honors</h3>
                                        {(data.certifications || []).map((c, i) => <div key={`c-${i}`} className="text-xs font-bold text-slate-700 mb-1">{c.name}</div>)}
                                        {(data.awards || []).map((a, i) => <div key={`a-${i}`} className="text-xs font-bold text-slate-700 mb-1">{a.title}</div>)}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    ),

    executive_minimal: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-20 resume-page font-lora text-slate-900 border-x-8 border-slate-100">
            <header className="mb-24 text-center border-b-2 border-slate-50 pb-12">
                <h1 className="text-6xl font-black italic tracking-tighter mb-6">{data.personalInfo.fullName}</h1>
                <div className="flex justify-center gap-12 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                    <span>{data.personalInfo.email}</span>
                    <span>•</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="grid grid-cols-12 gap-16">
                <div className="col-span-12">
                    <section className="mb-16">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 mb-10 text-center italic">— The Executive Profile —</h2>
                        <p className="text-base text-slate-500 leading-relaxed text-center font-medium max-w-2xl mx-auto italic opacity-80 leading-loose">"{data.personalInfo.summary}"</p>
                    </section>
                    <div className="h-px w-20 bg-slate-100 mx-auto mb-20"></div>
                    <section>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="text-center group">
                                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em] mb-4 block italic">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                    <h3 className="text-4xl font-black mb-2 italic" style={{ color: i === 0 ? primaryColor : 'inherit' }}>{exp.company}</h3>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-loose font-light max-w-2xl mx-auto">{exp.description}</p>
                                    {i < data.experience.length - 1 && <div className="h-px w-12 bg-slate-50 mx-auto mt-20"></div>}
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="h-px w-20 bg-slate-100 mx-auto mb-20"></div>

                    <section className="mb-16">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 mb-10 text-center italic">— Academic Background —</h2>
                        <div className="space-y-8 max-w-2xl mx-auto text-center">
                            {data.education.map((edu, i) => (
                                <div key={i} className="text-center group">
                                    <h3 className="text-2xl font-black mb-1 italic text-slate-800">{edu.school}</h3>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{edu.degree} in {edu.fieldOfStudy}</p>
                                    <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em]">{edu.startDate} — {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="h-px w-20 bg-slate-100 mx-auto mb-20"></div>

                    <section className="mb-16">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 mb-10 text-center italic">— Strategic Initiatives —</h2>
                        <div className="space-y-12 max-w-3xl mx-auto">
                            {data.projects.map((project, i) => (
                                <div key={i} className="text-center">
                                    <h3 className="text-xl font-black mb-2 italic text-slate-900">{project.name}</h3>
                                    <p className="text-sm text-slate-500 leading-loose font-light">{project.description}</p>
                                    {project.link && <a href={project.link} className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-800 transition-colors">View Resource</a>}
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="h-px w-20 bg-slate-100 mx-auto mb-20"></div>

                    <div className="grid grid-cols-2 gap-16 max-w-4xl mx-auto">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 mb-10 text-center italic whitespace-nowrap">— Core Competencies —</h2>
                            <div className="flex flex-wrap justify-center gap-4">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="text-xs font-bold uppercase tracking-widest text-slate-500">{s}</span>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 mb-10 text-center italic">— Additional Info —</h2>
                            <div className="text-center space-y-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Languages</p>
                                    {data.languages.map((l, i) => <p key={i} className="text-xs font-bold text-slate-600 mb-1">{l.language}</p>)}
                                </div>
                                {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Qualifications</p>
                                        {(data.certifications || []).map((c, i) => <p key={i} className="text-xs font-bold text-slate-600 mb-1">{c.name}</p>)}
                                        {(data.awards || []).map((a, i) => <p key={`a-${i}`} className="text-xs font-bold text-slate-600 mb-1">{a.title}</p>)}
                                    </div>
                                )}
                                {(data.interests?.length || 0) > 0 && (
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Interests</p>
                                        <p className="text-xs font-bold text-slate-600">{(data.interests || []).join(" / ")}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    ),

    technical_lite: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-mono text-slate-800 flex flex-col min-h-[1123px]">
            <header className="mb-12 flex justify-between items-end border-b-4 border-slate-900 pb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase mb-1">{data.personalInfo.fullName}</h1>
                    <p className="text-xs font-bold opacity-60">Status: {data.experience[0]?.position}</p>
                </div>
                <div className="text-right text-[10px] font-bold space-y-1">
                    <p>PORT: {data.personalInfo.email}</p>
                    <p>UUID: {data.personalInfo.phone}</p>
                    <p>HOST: {data.personalInfo.address}</p>
                </div>
            </header>
            <div className="mb-12 p-6 bg-slate-50 border-l-4 border-slate-900">
                <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-tighter sm:tracking-normal">{data.personalInfo.summary}</p>
            </div>
            <div className="flex-1 grid grid-cols-12 gap-12">
                <div className="col-span-12 space-y-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-1 inline-block mb-8 underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>01 // EXECUTION_HISTORY</h2>
                        <div className="space-y-12 pl-4 border-l border-slate-100">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[21px] top-1 w-2 h-2 bg-slate-200 group-hover:bg-slate-950 transition-colors"></div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-black uppercase tracking-tighter">{exp.company}</h3>
                                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{exp.startDate} - {exp.endDate || '∞'}</span>
                                    </div>
                                    <p className="text-xs font-bold mb-4 italic" style={{ color: primaryColor }}>cmd &gt; role --init "{exp.position}"</p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-bold lowercase opacity-70 tracking-tight">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-1 inline-block mb-8 underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>02 // COMPILED_MODULES</h2>
                        <div className="space-y-12 pl-4 border-l border-slate-100">
                            {data.projects.map((project, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[21px] top-1 w-2 h-2 bg-slate-200 group-hover:bg-slate-950 transition-colors"></div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-black uppercase tracking-tighter">{project.name}</h3>
                                        {project.link && <a href={project.link} className="text-[10px] font-bold opacity-40 uppercase tracking-widest hover:text-blue-600">source_code ↗</a>}
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed font-bold lowercase opacity-70 tracking-tight">{project.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.technologies.map((tech, t) => (
                                            <span key={t} className="text-[9px] font-mono bg-slate-100 px-1 rounded text-slate-600">import {tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-1 inline-block mb-8 underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>03 // DEPENDENCIES</h2>
                        <div className="pl-4 border-l border-slate-100 flex flex-wrap gap-x-6 gap-y-3">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="text-xs font-bold font-mono text-slate-700">
                                    <span style={{ color: primaryColor }}>npm i</span> {skill} @latest
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-1 inline-block mb-8 underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>04 // KERNEL_VERSION</h2>
                        <div className="space-y-8 pl-4 border-l border-slate-100">
                            {data.education.map((edu, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[21px] top-1 w-2 h-2 bg-slate-200 group-hover:bg-slate-950 transition-colors"></div>
                                    <h3 className="text-base font-black uppercase tracking-tighter">{edu.school}</h3>
                                    <p className="text-xs font-bold mt-1" style={{ color: primaryColor }}>{edu.degree} :: {edu.fieldOfStudy}</p>
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block mt-1">{edu.startDate} - {edu.endDate}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-1 inline-block mb-8 underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>05 // I/O_INTERFACES</h2>
                            <div className="pl-4 border-l border-slate-100 space-y-2">
                                {data.languages.map((l, i) => (
                                    <div key={i} className="text-xs font-mono">
                                        <span className="font-bold">{l.language}</span>: <span className="text-slate-500">{l.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                            <section>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-1 inline-block mb-8 underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>06 // CERT_KEYS</h2>
                                <div className="pl-4 border-l border-slate-100 space-y-2">
                                    {(data.certifications || []).map((c, i) => <div key={i} className="text-xs font-mono text-slate-600">[{c.issuer}] {c.name}</div>)}
                                    {(data.awards || []).map((a, i) => <div key={`a-${i}`} className="text-xs font-mono text-slate-600">[{a.issuer}] {a.title}</div>)}
                                </div>
                            </section>
                        )}
                    </div>
                    {data.interests && data.interests.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-1 inline-block mb-8 underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>07 // IDLE_PROCESSES</h2>
                            <div className="pl-4 border-l border-slate-100 flex flex-wrap gap-4">
                                {data.interests.map((interest, i) => (
                                    <span key={i} className="text-[10px] font-mono text-slate-400"># {interest}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    basic_academic: ({ data, primaryColor }) => (
        <div className="bg-[#fcf8f4] w-[794px] mx-auto shadow-2xl p-16 resume-page font-serif text-slate-900">
            <header className="mb-16 border-b border-slate-200 pb-12 text-center">
                <h1 className="text-5xl font-bold mb-4 tracking-tight">{data.personalInfo.fullName}</h1>
                <p className="text-sm text-slate-500 italic mb-8 max-w-lg mx-auto leading-relaxed">{data.personalInfo.summary.substring(0, 180)}...</p>
                <div className="flex justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>
            <div className="space-y-16">
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-8 border-l-4 pl-6" style={{ borderColor: primaryColor }}>Scholarly Path</h2>
                    <div className="space-y-10 pl-6">
                        {data.education.map((edu, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-xl font-bold">{edu.school}</h3>
                                    <span className="text-sm font-medium italic text-slate-400">{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <p className="text-sm font-bold opacity-60 italic">{edu.degree} in {edu.fieldOfStudy}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-8 border-l-4 pl-6" style={{ borderColor: primaryColor }}>Contribution Log</h2>
                    <div className="space-y-12 pl-6">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-2xl font-black text-slate-800">{exp.company}</h3>
                                    <span className="text-xs font-medium tabular-nums text-slate-300">{exp.startDate} :: {exp.endDate || 'Active'}</span>
                                </div>
                                <p className="text-sm font-bold mb-4 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-sm text-slate-500 leading-relaxed font-light text-justify">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-8 border-l-4 pl-6" style={{ borderColor: primaryColor }}>Research Grants & Projects</h2>
                    <div className="space-y-8 pl-6">
                        {data.projects.map((project, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                                    {project.link && <a href={project.link} className="text-xs font-medium italic text-slate-400 hover:text-blue-600 transition-colors">View Research ↗</a>}
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-light text-justify">{project.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-8 border-l-4 pl-6" style={{ borderColor: primaryColor }}>Core Competencies</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 pl-6">
                        {data.skills.map((s, i) => (
                            <span key={i} className="text-sm italic font-medium text-slate-600">• {s}</span>
                        ))}
                    </div>
                </section>
                <div className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-8 border-l-4 pl-6" style={{ borderColor: primaryColor }}>Languages</h2>
                        <div className="pl-6 space-y-2">
                            {data.languages.map((l, i) => (
                                <div key={i} className="text-sm text-slate-600 italic"><span className="font-bold not-italic">{l.language}</span>: {l.proficiency}</div>
                            ))}
                        </div>
                    </section>
                    {((data.certifications?.length || 0) > 0 || (data.awards?.length || 0) > 0) && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 mb-8 border-l-4 pl-6" style={{ borderColor: primaryColor }}>Distinctions</h2>
                            <div className="pl-6 space-y-4">
                                {(data.certifications || []).map((c, i) => <div key={i} className="text-sm text-slate-600 italic"><span className="font-bold not-italic">{c.name}</span> ({c.issuer})</div>)}
                                {(data.awards || []).map((a, i) => <div key={`a-${i}`} className="text-sm text-slate-600 italic"><span className="font-bold not-italic">{a.title}</span> ({a.issuer})</div>)}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    ),

    airy_professional: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-20 resume-page font-inter text-slate-800 relative">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primaryColor }}></div>
            <header className="mb-20 flex justify-between items-center">
                <div className="max-w-xl">
                    <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-4">{data.personalInfo.fullName}</h1>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest italic">{data.experience[0]?.position}</p>
                </div>
                <div className="w-px h-24 bg-slate-100"></div>
            </header>
            <div className="grid grid-cols-12 gap-16">
                <div className="col-span-12">
                    <section className="mb-20">
                        <div className="flex items-center gap-6 mb-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic whitespace-nowrap">The Professional</h2>
                            <div className="h-px flex-1 bg-slate-50"></div>
                        </div>
                        <p className="text-xl font-light text-slate-400 leading-loose italic max-w-3xl mx-auto text-center">"{data.personalInfo.summary}"</p>
                    </section>
                    <section className="mb-20">

                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic whitespace-nowrap">Professional Base</h2>
                            <div className="h-px flex-1 bg-slate-50"></div>
                        </div>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-12">
                                    <div className="absolute left-[-2px] top-1.5 w-1 h-[120%] bg-slate-50"></div>
                                    <div className="absolute left-[-2px] top-1.5 w-1 h-8 group-hover:h-full transition-all duration-500" style={{ backgroundColor: primaryColor }}></div>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{exp.company}</h3>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                    </div>
                                    <p className="text-xs font-bold uppercase mb-6 tracking-widest italic" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-400 leading-loose font-medium text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-20">
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic whitespace-nowrap">Academic History</h2>
                            <div className="h-px flex-1 bg-slate-50"></div>
                        </div>
                        <div className="space-y-12">
                            {data.education.map((edu, i) => (
                                <div key={i} className="relative pl-12">
                                    <div className="absolute left-[-2px] top-1.5 w-1 h-[120%] bg-slate-50"></div>
                                    <div className="absolute left-[-2px] top-1.5 w-1 h-8 group-hover:h-full transition-all duration-500" style={{ backgroundColor: primaryColor }}></div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{edu.school}</h3>
                                    <p className="text-xs font-bold uppercase mb-2 tracking-widest italic opacity-50">{edu.degree} in {edu.fieldOfStudy}</p>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-20">
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic whitespace-nowrap">Key Projects</h2>
                            <div className="h-px flex-1 bg-slate-50"></div>
                        </div>
                        <div className="space-y-12">
                            {data.projects.map((project, i) => (
                                <div key={i} className="relative pl-12">
                                    <div className="absolute left-[-2px] top-1.5 w-1 h-[120%] bg-slate-50"></div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{project.name}</h3>
                                        {project.link && <a href={project.link} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500 transition-colors">Link ↗</a>}
                                    </div>
                                    <p className="text-sm text-slate-400 leading-loose font-medium text-justify">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-16">
                        <section>
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic whitespace-nowrap">Competencies</h2>
                                <div className="h-px flex-1 bg-slate-50"></div>
                            </div>
                            <div className="pl-12 flex flex-wrap gap-4">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="text-xs font-bold uppercase tracking-widest text-slate-400">{s}</span>
                                ))}
                            </div>
                        </section>
                        <section>
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic whitespace-nowrap">Distinctions</h2>
                                <div className="h-px flex-1 bg-slate-50"></div>
                            </div>
                            <div className="pl-12 space-y-4">
                                {data.languages.map((l, i) => <div key={i} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{l.language} / {l.proficiency}</div>)}
                                {(data.certifications || []).map((c, i) => <div key={`c-${i}`} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{c.name}</div>)}
                                {(data.awards || []).map((a, i) => <div key={`a-${i}`} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{a.title}</div>)}
                            </div>
                        </section>
                        {data.interests && data.interests.length > 0 && (
                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic whitespace-nowrap">The Person</h2>
                                    <div className="h-px flex-1 bg-slate-50"></div>
                                </div>
                                <div className="pl-12 flex flex-wrap gap-6">
                                    {data.interests.map((interest, i) => (
                                        <span key={i} className="text-xs font-medium text-slate-400 italic"># {interest}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

            </div>
            <footer className="mt-auto flex justify-between pt-12 border-t border-slate-50 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">
                <span>{data.personalInfo.email}</span>
                <span>{data.personalInfo.phone}</span>
                <span>{data.personalInfo.address}</span>
            </footer>
        </div>
    ),

    minimal_classic: ({ data, primaryColor }) => (
        <div className="bg-white w-[794px] mx-auto shadow-2xl p-16 resume-page font-serif text-slate-900">
            <header className="mb-16 border-b-2 border-slate-900 pb-12 flex flex-col items-start">
                <h1 className="text-6xl font-black mb-6 tracking-tight">{data.personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-12 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 italic">
                    <span className="flex items-center gap-4">Email: {data.personalInfo.email}</span>
                    <span className="flex items-center gap-4">Phone: {data.personalInfo.phone}</span>
                    <span className="flex items-center gap-4">Location: {data.personalInfo.address}</span>
                </div>
            </header>
            <div className="space-y-12">
                <section>
                    <p className="text-sm text-slate-500 leading-relaxed italic border-l-4 pl-8 mb-12" style={{ borderColor: `${primaryColor}44` }}>"{data.personalInfo.summary}"</p>
                </section>
                <section>

                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-2 border-b-2" style={{ borderBottomColor: `${primaryColor}22` }}>Experience Record</h2>
                    <div className="space-y-12">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline mb-4 border-l-4 pl-8 group-hover:border-slate-950 transition-colors" style={{ borderLeftColor: i === 0 ? primaryColor : undefined }}>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-2xl font-black text-slate-800 italic uppercase">{exp.company}</h3>
                                        <p className="text-sm font-bold opacity-60 tracking-widest">{exp.position}</p>
                                    </div>
                                    <span className="text-sm font-medium italic text-slate-300">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed text-left pl-9 italic font-medium opacity-80 mt-6 whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-2 border-b-2" style={{ borderBottomColor: `${primaryColor}22` }}>Academic Record</h2>
                    <div className="space-y-8">
                        {data.education.map((edu, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline mb-2 pl-8 border-l-4 border-transparent group-hover:border-slate-100 transition-colors">
                                    <h3 className="text-xl font-black text-slate-800 italic">{edu.school}</h3>
                                    <span className="text-sm font-medium italic text-slate-300">{edu.startDate} — {edu.endDate}</span>
                                </div>
                                <p className="text-sm text-slate-500 pl-9 font-medium italic">{edu.degree} in {edu.fieldOfStudy}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-2 border-b-2" style={{ borderBottomColor: `${primaryColor}22` }}>Project Portfolio</h2>
                    <div className="space-y-8">
                        {data.projects.map((project, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline mb-2 pl-8 border-l-4 border-transparent group-hover:border-slate-100 transition-colors">
                                    <h3 className="text-lg font-black text-slate-800 italic">{project.name}</h3>
                                    {project.link && <a href={project.link} className="text-xs font-medium italic text-slate-300 hover:text-slate-500">View ↗</a>}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed text-left pl-9 italic font-medium opacity-80 whitespace-pre-line">{project.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-16">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-2 border-b-2" style={{ borderBottomColor: `${primaryColor}22` }}>Skills Overview</h2>
                        <div className="pl-8 flex flex-wrap gap-x-8 gap-y-3">
                            {data.skills.map((s, i) => (
                                <span key={i} className="text-sm italic font-medium text-slate-500">• {s}</span>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-10 pb-2 border-b-2" style={{ borderBottomColor: `${primaryColor}22` }}>Et Cetera</h2>
                        <div className="pl-8 space-y-4">
                            {data.languages.map((l, i) => (
                                <div key={i} className="text-sm text-slate-500 italic"><span className="font-bold text-slate-700">{l.language}</span> — {l.proficiency}</div>
                            ))}
                            {(data.certifications?.length || 0) > 0 && <div className="h-px w-8 bg-slate-100 my-4"></div>}
                            {(data.certifications || []).map((c, i) => (
                                <div key={i} className="text-sm text-slate-500 italic"><span className="font-bold text-slate-700">{c.name}</span></div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    ),
};

export default function ResumeTemplate({ data, template, primaryColor = '#3b82f6' }: ResumeTemplateProps) {
    const Template = templates[template] || templates.modern;
    return (
        <div className="select-none">
            <PageBreakStyles />
            <Template data={data} primaryColor={primaryColor} />
        </div>
    );
}
