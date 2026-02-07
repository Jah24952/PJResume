'use client'

import { useResumeStore } from '@/store/resume.store'
import { forwardRef } from 'react'
import { Phone, Mail, MapPin, Globe } from 'lucide-react'

const ResumePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { data } = useResumeStore()
  const { selectedTemplate = 'modern', themeColor = '#437393' } = data

  /* =========================================
     STYLE 1: MODERN (Sidebar Left)
     - Sidebar with contact, skills, education
     - Main content with summary, experience
  ========================================= */
  if (selectedTemplate === 'modern') {
    return (
      <div
        ref={ref}
        className="bg-white w-full h-full flex flex-row overflow-hidden"
        style={{ fontFamily: "'Prompt', sans-serif" }}
      >
        {/* Sidebar */}
        <div className="w-[35%] py-8 px-6 text-white h-full space-y-8" style={{ backgroundColor: themeColor }}>
          <div className="text-center mb-6">
            <div className="w-32 h-32 rounded-full bg-white/20 mx-auto mb-4 overflow-hidden border-4 border-white/30 flex items-center justify-center">
              {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : <span className="text-4xl font-bold opacity-50">{data.name.charAt(0)}</span>}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4 text-sm">
            <h3 className="uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3">Contact</h3>
            {data.phone && <div className="flex items-center gap-2"><Phone size={14} /> {data.phone}</div>}
            {data.email && <div className="flex items-center gap-2"><Mail size={14} /> {data.email}</div>}
            {data.address && <div className="flex items-center gap-2"><MapPin size={14} /> {data.address}</div>}
            {data.socialLink && <div className="flex items-center gap-2"><Globe size={14} /> {data.socialLink}</div>}
          </div>

          {/* Education */}
          <div className="space-y-4 text-sm">
            <h3 className="uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3">Education</h3>
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="font-bold">{edu.degree}</div>
                <div className="opacity-80">{edu.school}</div>
                <div className="text-xs opacity-60">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-4 text-sm">
            <h3 className="uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <span key={skill} className="bg-white/20 px-2 py-1 rounded text-xs">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 text-slate-800 space-y-8">
          <div>
            <h1 className="text-5xl font-bold uppercase tracking-tight text-black mb-2">{data.name}<br />{data.surname}</h1>
            <h2 className="text-xl font-medium tracking-widest uppercase" style={{ color: themeColor }}>{data.jobTitle}</h2>
          </div>

          <div>
            <h3 className="uppercase font-bold tracking-widest border-b-2 pb-2 mb-4 text-black" style={{ borderColor: themeColor }}>About Me</h3>
            <p className="text-sm leading-relaxed text-justify text-gray-700">{data.summary}</p>
          </div>

          <div>
            <h3 className="uppercase font-bold tracking-widest border-b-2 pb-2 mb-4 text-black" style={{ borderColor: themeColor }}>Experience</h3>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-lg text-black">{exp.position}</h4>
                    <span className="text-sm font-semibold text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.company}</div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Languages / Certs */}
          {(data.languages.length > 0 || data.certifications.length > 0) && (
            <div>
              <h3 className="uppercase font-bold tracking-widest border-b-2 pb-2 mb-4 text-black" style={{ borderColor: themeColor }}>Others</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {data.languages.length > 0 && (
                  <div>
                    <strong className="block mb-1">Languages</strong>
                    <ul className="list-disc ml-4 text-gray-600">
                      {data.languages.map(l => <li key={l.id}>{l.language} ({l.level})</li>)}
                    </ul>
                  </div>
                )}
                {data.certifications.length > 0 && (
                  <div>
                    <strong className="block mb-1">Certifications</strong>
                    <ul className="list-disc ml-4 text-gray-600">
                      {data.certifications.map(c => <li key={c.id}>{c.name} ({c.year})</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 2: CLASSIC (Serif, Elegant)
  ========================================= */
  if (selectedTemplate === 'classic') {
    return (
      <div
        ref={ref}
        className="bg-white w-full h-full p-12 text-black"
        style={{ fontFamily: "'Times New Roman', serif" }}
      >
        <div className="text-center border-b-2 border-black pb-6 mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.name} {data.surname}</h1>
          <p className="text-lg italic text-gray-600 mb-4">{data.jobTitle}</p>
          <div className="flex justify-center gap-4 text-sm text-gray-700 italic">
            {data.phone && <span>{data.phone}</span>}
            <span>|</span>
            {data.email && <span>{data.email}</span>}
            <span>|</span>
            {data.address && <span>{data.address}</span>}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-center font-bold uppercase tracking-widest text-lg mb-4 border-b border-gray-200 pb-2">Professional Summary</h3>
            <p className="text-center leading-relaxed text-gray-800 max-w-2xl mx-auto">{data.summary}</p>
          </section>

          <section>
            <h3 className="text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2">Experience</h3>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-end mb-1">
                    <div className="font-bold text-lg">{exp.company}</div>
                    <div className="italic text-gray-600">{exp.startDate} – {exp.endDate}</div>
                  </div>
                  <div className="italic font-medium mb-1">{exp.position}</div>
                  <p className="text-sm leading-relaxed text-gray-800">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-12">
            <section>
              <h3 className="text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2">Education</h3>
              {data.education.map(edu => (
                <div key={edu.id} className="mb-4 text-center">
                  <div className="font-bold">{edu.school}</div>
                  <div className="italic">{edu.degree}</div>
                  <div className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </section>
            <section>
              <h3 className="text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2">Skills</h3>
              <div className="text-center leading-loose">
                {data.skills.join(' • ')}
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 3: CREATIVE (Header Bg, Columns)
  ========================================= */
  if (selectedTemplate === 'creative') {
    return (
      <div
        ref={ref}
        className="bg-white w-full h-full flex flex-col"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Header */}
        <div className="h-48 flex items-center px-12 gap-8 text-white relative overflow-hidden" style={{ backgroundColor: themeColor }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <div className="bg-white p-1 rounded-full z-10">
            <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
              {data.profileImage && <img src={data.profileImage} className="w-full h-full object-cover" />}
            </div>
          </div>
          <div className="z-10">
            <h1 className="text-5xl font-bold">{data.name} <span className="font-light">{data.surname}</span></h1>
            <p className="text-xl opacity-90 tracking-widest uppercase mt-2">{data.jobTitle}</p>
          </div>
        </div>

        <div className="flex-1 p-12 grid grid-cols-[1fr_2fr] gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4" style={{ color: themeColor }}>CONTACT</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {data.email && <div className="flex items-center gap-2"><Mail size={16} /> {data.email}</div>}
                {data.phone && <div className="flex items-center gap-2"><Phone size={16} /> {data.phone}</div>}
                {data.address && <div className="flex items-center gap-2"><MapPin size={16} /> {data.address}</div>}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: themeColor }}>SKILLS</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">{skill}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: themeColor }}>EDUCATION</h3>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-bold text-gray-800">{edu.degree}</div>
                    <div className="text-sm text-gray-600">{edu.school}</div>
                    <div className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="prose prose-sm text-gray-600">
              <h3 className="font-bold text-lg mb-4 uppercase border-b-2 inline-block pb-1" style={{ borderColor: themeColor, color: themeColor }}>Profile</h3>
              <p>{data.summary}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 uppercase border-b-2 inline-block pb-1" style={{ borderColor: themeColor, color: themeColor }}>Work Experience</h3>
              <div className="space-y-8 border-l-2 border-gray-100 pl-6 ml-2">
                {data.experience.map(exp => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: themeColor }}></div>
                    <div className="font-bold text-xl text-gray-800">{exp.position}</div>
                    <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
                      <span>{exp.company}</span>
                      <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 5: SOFT BLOCK (Wanida - Peach/Orange)
     - Sidebar Left (Colored)
     - Blocks for Exp/Edu
  ========================================= */
  if (selectedTemplate === 'soft-block') {
    const primary = themeColor || '#fb923c'
    const secondary = '#fff7ed' // Very light orange/peach
    return (
      <div ref={ref} className="w-full h-full bg-white flex flex-row overflow-hidden font-sans text-sm">
        {/* Sidebar */}
        <div className="w-[35%] py-8 px-6 flex flex-col gap-6" style={{ backgroundColor: secondary }}>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full bg-white mx-auto mb-4 border-4 p-1" style={{ borderColor: primary }}>
              {data.profileImage ? <img src={data.profileImage} className="w-full h-full rounded-full object-cover" /> : <div className="w-full h-full rounded-full bg-gray-200"></div>}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">CONTACT</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {data.phone && <div className="flex items-center gap-2"><Phone size={14} style={{ color: primary }} /> {data.phone}</div>}
              {data.email && <div className="flex items-center gap-2"><Mail size={14} style={{ color: primary }} /> {data.email}</div>}
              {data.address && <div className="flex items-center gap-2"><MapPin size={14} style={{ color: primary }} /> {data.address}</div>}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 space-y-8">
          <div className="pl-4 border-l-8" style={{ borderColor: primary }}>
            <h1 className="text-5xl font-bold text-gray-800">{data.name}</h1>
            <h2 className="text-3xl font-light text-gray-600">{data.surname}</h2>
            <p className="text-xl mt-2 font-medium tracking-widest uppercase" style={{ color: primary }}>{data.jobTitle}</p>
          </div>

          <div className="prose max-w-none text-gray-600">
            <p>{data.summary}</p>
          </div>

          <div>
            <div className="inline-block text-white px-4 py-1 rounded-r-full font-bold mb-4 text-lg" style={{ backgroundColor: primary }}>EXPERIENCE</div>
            <div className="space-y-6 border-l-2 border-gray-100 ml-4 pl-6 relative">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: primary }}></div>
                  <h4 className="font-bold text-lg text-gray-800">{exp.position}</h4>
                  <div className="text-sm font-semibold mb-2" style={{ color: primary }}>{exp.company} | {exp.startDate} - {exp.endDate}</div>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="inline-block text-white px-4 py-1 rounded-r-full font-bold mb-4 text-lg" style={{ backgroundColor: primary }}>EDUCATION</div>
            <div className="space-y-4 ml-4">
              {data.education.map(edu => (
                <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: primary }}>
                  <div className="font-bold text-gray-800">{edu.school}</div>
                  <div className="text-gray-600">{edu.degree}</div>
                  <div className="text-sm text-gray-400">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 6: CREATIVE CURVE (Claudia - Purple)
     - Rounded Sidebar
  ========================================= */
  if (selectedTemplate === 'creative-curve') {
    const primary = themeColor || '#a855f7'
    return (
      <div ref={ref} className="w-full h-full bg-white flex flex-row overflow-hidden font-sans text-sm">
        <div className="w-[35%] h-full text-white p-6 relative flex flex-col items-center pt-12" style={{ backgroundColor: primary, borderTopRightRadius: '60px' }}>
          <div className="w-48 h-48 rounded-full border-4 border-white/30 mb-6 overflow-hidden">
            {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : <div className="bg-white/20 w-full h-full"></div>}
          </div>

          <div className="w-full space-y-6 mt-8">
            <div>
              <h3 className="text-center uppercase font-bold tracking-widest border-b border-white/20 pb-2 mb-4">Contact</h3>
              <div className="space-y-3 text-sm text-white/90">
                {data.phone && <div className="flex items-center gap-2 justify-center"><Phone size={14} /> {data.phone}</div>}
                {data.email && <div className="flex items-center gap-2 justify-center"><Mail size={14} /> {data.email}</div>}
                {data.address && <div className="flex items-center gap-2 justify-center text-center"><MapPin size={14} /> {data.address}</div>}
              </div>
            </div>

            <div>
              <h3 className="text-center uppercase font-bold tracking-widest border-b border-white/20 pb-2 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {data.skills.map(skill => (
                  <span key={skill} className="bg-white/20 px-3 py-1 rounded-full text-xs">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-10 rounded-tl-full"></div>
        </div>

        <div className="flex-1 p-12">
          <div className="border-b-2 border-dashed pb-6 mb-8" style={{ borderColor: primary }}>
            <h1 className="text-6xl font-bold mb-2" style={{ color: primary }}>{data.name}</h1>
            <h2 className="text-4xl font-light text-gray-400">{data.surname}</h2>
            <p className="text-2xl mt-2 tracking-widest uppercase text-gray-600">{data.jobTitle}</p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: primary }}>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: primary }}>
                <span>WORK EXPERIENCE</span>
              </h3>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between font-bold text-gray-800 text-lg">
                      <span>{exp.position}</span>
                      <span className="text-sm font-normal text-gray-500">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-gray-500 mb-2">{exp.company}</div>
                    <p className="text-gray-600 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: primary }}>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: primary }}>
                <span>EDUCATION</span>
              </h3>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-bold text-gray-800">{edu.school}</div>
                    <div className="text-gray-600">{edu.degree}</div>
                    <div className="text-sm text-gray-400">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 7: TECH DARK (Connor - Dark Mode)
     - High Contrast
  ========================================= */
  if (selectedTemplate === 'tech-dark') {
    const primary = '#000000'
    const accent = themeColor === '#000000' ? '#ffffff' : themeColor
    return (
      <div ref={ref} className="w-full h-full bg-white flex flex-col font-mono text-sm">
        <header className="bg-black text-white p-12 flex items-center gap-8">
          <div className="w-32 h-32 bg-white rounded-full p-1 shrink-0">
            {data.profileImage ? <img src={data.profileImage} className="w-full h-full rounded-full object-cover" /> : <div className="bg-gray-200 w-full h-full rounded-full" />}
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-widest uppercase mb-2">{data.name} <span className="text-gray-400">{data.surname}</span></h1>
            <p className="text-xl text-green-400">&lt; {data.jobTitle} /&gt;</p>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-[1fr_2fr]">
          <aside className="bg-gray-100 p-8 border-r border-gray-300">
            <div className="mb-8">
              <h3 className="font-bold text-black border-b-2 border-black pb-2 mb-4">CONTACT_INFO</h3>
              <div className="space-y-2 text-sm">
                <div className="break-all">root@: {data.email}</div>
                <div>tel: {data.phone}</div>
                <div>loc: {data.address}</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-black border-b-2 border-black pb-2 mb-4">SKILL_SET</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="bg-black text-white px-2 py-1 text-xs font-bold">{skill}</span>
                ))}
              </div>
            </div>
          </aside>

          <main className="p-8 space-y-8">
            <section>
              <h3 className="font-bold text-2xl text-black border-l-4 border-black pl-4 mb-4">OBJECTIVE // SUMMARY</h3>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>

            <section>
              <h3 className="font-bold text-2xl text-black border-l-4 border-black pl-4 mb-4">SYSTEM_LOG // EXPERIENCE</h3>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id} className="group">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-lg">{exp.position}</h4>
                      <span className="font-bold font-sans text-xs bg-black text-white px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-green-600 font-bold mb-2">@ {exp.company}</div>
                    <p className="text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-2xl text-black border-l-4 border-black pl-4 mb-4">BUILD // EDUCATION</h3>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-bold">{edu.school}</div>
                    <div className="text-gray-600 italic">{edu.degree}</div>
                    <div className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 8: MODERN CURVE (Olivia - Curve)
  ========================================= */
  if (selectedTemplate === 'modern-curve') {
    const primary = themeColor || '#f97316'
    return (
      <div ref={ref} className="w-full h-full bg-white relative overflow-hidden font-sans text-sm">
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-opacity-20 rounded-bl-[200px] z-0" style={{ backgroundColor: primary }}></div>

        <div className="relative z-10 p-12 h-full flex flex-col">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-2">{data.name}</h1>
              <h1 className="text-6xl font-bold text-gray-500 mb-4">{data.surname}</h1>
              <div className="bg-gray-900 text-white px-6 py-2 rounded-full inline-block text-xl tracking-wider" style={{ backgroundColor: primary }}>
                {data.jobTitle}
              </div>
            </div>
            <div className="w-48 h-48 rounded-full border-8 border-white shadow-xl overflow-hidden bg-gray-200">
              {data.profileImage && <img src={data.profileImage} className="w-full h-full object-cover" />}
            </div>
          </header>

          <div className="grid grid-cols-[1fr_1.5fr] gap-12 flex-1">
            <aside className="space-y-8">
              <div>
                <h3 className="font-bold text-xl mb-4 border-b-2 pb-2" style={{ borderColor: primary }}>CONTACT</h3>
                <div className="space-y-3 text-gray-600">
                  {data.phone && <div className="flex items-center gap-3"><Phone size={18} style={{ color: primary }} /> {data.phone}</div>}
                  {data.email && <div className="flex items-center gap-3"><Mail size={18} style={{ color: primary }} /> {data.email}</div>}
                  {data.address && <div className="flex items-center gap-3"><MapPin size={18} style={{ color: primary }} /> {data.address}</div>}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4 border-b-2 pb-2" style={{ borderColor: primary }}>ABOUT ME</h3>
                <p className="text-gray-600 leading-relaxed text-justify">{data.summary}</p>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4 border-b-2 pb-2" style={{ borderColor: primary }}>SKILLS</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            </aside>

            <main className="space-y-8">
              <div>
                <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                  <span className="w-3 h-8 rounded-full" style={{ backgroundColor: primary }}></span> EXPERIENCE
                </h3>
                <div className="space-y-8">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <h4 className="text-xl font-bold text-gray-800">{exp.position}</h4>
                      <div className="text-sm font-semibold mb-2" style={{ color: primary }}>{exp.company} | {exp.startDate} - {exp.endDate}</div>
                      <p className="text-gray-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                  <span className="w-3 h-8 rounded-full" style={{ backgroundColor: primary }}></span> EDUCATION
                </h3>
                <div className="space-y-4">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                      <div className="text-lg font-bold text-gray-800">{edu.school}</div>
                      <div className="text-gray-600">{edu.degree}</div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 9: PROFESSIONAL BOX (Olivia - Box)
  ========================================= */
  if (selectedTemplate === 'professional-box') {
    const primary = themeColor || '#3b82f6'
    return (
      <div ref={ref} className="w-full h-full bg-gray-50 p-8 font-sans text-sm flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex items-center gap-8 border-t-8" style={{ borderColor: primary }}>
          <div className="w-40 h-40 rounded-xl bg-gray-200 overflow-hidden shrink-0">
            {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : null}
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">{data.name} {data.surname}</h1>
            <p className="text-2xl font-medium tracking-widest uppercase" style={{ color: primary }}>{data.jobTitle}</p>
            <p className="mt-4 text-gray-600 max-w-2xl">{data.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2.5fr] gap-8 flex-1">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">CONTACT</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {data.email && <div>{data.email}</div>}
                {data.phone && <div>{data.phone}</div>}
                {data.address && <div>{data.address}</div>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm h-full">
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">SKILLS</h3>
              <ul className="space-y-2">
                {data.skills.map(skill => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-xl text-gray-900 mb-6 border-b pb-2">WORK EXPERIENCE</h3>
              <div className="space-y-8">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-lg text-gray-800">{exp.position}</h4>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-md font-medium mb-3" style={{ color: primary }}>{exp.company}</div>
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-xl text-gray-900 mb-6 border-b pb-2">EDUCATION</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.education.map(edu => (
                  <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-bold text-gray-800">{edu.school}</div>
                    <div className="text-sm text-gray-600">{edu.degree}</div>
                    <div className="text-xs text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================
     STYLE 4: PROFESSIONAL (Clean Grid, Default Fallback)
  ========================================= */
  const primaryColor = themeColor || '#437393' // Default to Professional Gray-Blue
  return (
    <div
      ref={ref}
      className="bg-white p-12 w-full h-full text-sm leading-relaxed flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="flex justify-between items-start border-b-4 pb-6 mb-8" style={{ borderColor: primaryColor }}>
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">{data.name} {data.surname}</h1>
          <p className="text-xl font-medium" style={{ color: primaryColor }}>{data.jobTitle}</p>
        </div>
        <div className="text-right text-gray-500 space-y-1 text-sm">
          <div className="font-medium text-black">Contact</div>
          <div>{data.address}</div>
          <div>{data.email}</div>
          <div>{data.phone}</div>
        </div>
      </header>

      <div className="grid grid-cols-[2fr_1fr] gap-12 flex-1">
        {/* Main Left */}
        <div className="space-y-8">
          <section>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> Summary
            </h3>
            <p className="text-gray-600 text-justify">{data.summary}</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> Experience
            </h3>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-bold text-gray-800 text-lg">{exp.position}</div>
                    <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate}</div>
                  </div>
                  <div className="text-md font-medium mb-2" style={{ color: primaryColor }}>{exp.company}</div>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Right */}
        <div className="space-y-8">
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Education</h3>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold text-gray-800">{edu.school}</div>
                  <div className="text-gray-600 text-sm">{edu.degree}</div>
                  <div className="text-xs text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded hover:border-gray-400 transition-colors">{skill}</span>
              ))}
            </div>
          </section>

          {(data.languages.length > 0) && (
            <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Languages</h3>
              <ul className="space-y-2 text-gray-600">
                {data.languages.map(l => (
                  <li key={l.id} className="flex justify-between">
                    <span>{l.language}</span>
                    <span className="text-gray-400">{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
})

ResumePreview.displayName = 'ResumePreview'
export default ResumePreview
