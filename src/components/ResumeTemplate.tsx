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
                <div className="col-span-8">
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
                <div className="col-span-5">
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
                <div className="col-span-4 row-span-1 bg-slate-50 p-10">
                    <h2 className="text-xs font-black uppercase tracking-widest opacity-30 mb-2 italic">Degree</h2>
                    <p className="text-xs font-bold text-slate-600">{data.education[0]?.degree}</p>
                </div>
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
                    <section>
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
        </div>
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
            <section className="mb-12">
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
        </div>
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
        </div>
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
                    <section className="col-span-2">
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
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-40 border-b border-white/20 pb-2">Awards</h2>
                    <div className="space-y-4">
                        {data.certifications?.map((c, i) => (
                            <div key={i} className="text-[10px]">
                                <p className="font-bold">{c.name}</p>
                                <p className="opacity-60">{c.issuer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <div className="w-2/3 p-16 space-y-12">
                <section>
                    <SectionHeader title="Experience" color={primaryColor} variant="line" />
                    <div className="space-y-10">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{exp.company}</h3>
                                    <span className="text-xs font-bold text-slate-400">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: primaryColor }}>{exp.position}</p>
                                <p className="text-sm text-slate-500 leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
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
                    <div className="columns-2 gap-20">
                        <section className="break-inside-avoid">
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] mb-12" style={{ color: primaryColor }}>Experience</h2>
                            {data.experience.map((exp, i) => (
                                <div key={i} className="mb-12 border-l-2 pl-8" style={{ borderColor: primaryColor }}>
                                    <h3 className="text-2xl font-bold mb-1">{exp.company}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-4">{exp.position} / {exp.startDate}-{exp.endDate}</p>
                                    <p className="text-sm opacity-60 leading-relaxed mb-6">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                        <section className="break-inside-avoid">
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
                </div>
                <div className="col-span-8 flex flex-col gap-12">
                    <section>
                        <SectionHeader title="Work History" color={primaryColor} variant="line" />
                        <div className="space-y-8">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                                        <span>{exp.company}</span>
                                        <span className="text-xs opacity-40 uppercase">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-3 italic" style={{ color: primaryColor }}>{exp.position}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-light">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
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
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-center opacity-30">Selection of Works</h2>
                    <div className="space-y-16">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end border-b border-black/5 pb-2 mb-6">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">{exp.company}</h3>
                                    <span className="text-xs font-bold italic opacity-40">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest mb-6 border-l-4 pl-4 border-black">{exp.position}</p>
                                <p className="text-sm leading-relaxed text-justify opacity-60">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
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
