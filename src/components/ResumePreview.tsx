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
