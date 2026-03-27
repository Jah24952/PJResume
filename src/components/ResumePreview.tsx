'use client'

import { useResumeStore, ResumeData } from '@/store/resume.store'
import { forwardRef } from 'react'
import { Phone, Mail, MapPin, Globe } from 'lucide-react'
import { t } from '@/lib/i18n'
import { formatMonthYear } from '@/lib/date'
import AICustomTemplate from './AICustomTemplate'

interface ResumePreviewProps {
  data?: ResumeData
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>((props, ref) => {
  const storeData = useResumeStore((state) => state.data)
  const data = props.data || storeData
  const { selectedTemplate = 'modern', themeColor = '#437393', fontFamily, fontSize, lineHeight, headingStyle } = data

  // Helper function to apply heading styles dynamically natively instead of hardcoding 'uppercase'
  const getHeadingClass = (baseClasses: string) => {
    return `${baseClasses.replace(/\buppercase\b/g, '')} ${headingStyle}`.trim().replace(/\s+/g, ' ')
  }

  // --- Dynamic Experience Item Renderer ---
  // Reusable component block that handles all types of experiences (work, project, internship, etc.)
  const renderExperienceItem = (exp: any, themeColor: string = '#437393', layout: 'classic' | 'modern' | 'timeline' | 'clean' | 'compact' = 'clean') => {
    const isProject = exp.type === 'project';
    const isInternship = exp.type === 'internship';
    const isActivity = exp.type === 'activity';
    const isWork = !isProject && !isInternship && !isActivity;

    // Some themes map `themeColor` differently.
    const primary = themeColor;

    // Mapping Labels based on the document language.
    const isEn = data.resumeLanguage === 'en';
    const deptLabel = isEn ? 'Dept: ' : 'แผนก: ';
    const techLabel = isEn ? 'Tools: ' : 'เทคโนโลยี: ';
    const skillsLabel = isEn ? 'Skills: ' : 'ทักษะ: ';

    // Formatter for Date
    const startStr = formatMonthYear(exp.startDate, data.resumeLanguage as 'en' | 'th');
    const endStr = formatMonthYear(exp.endDate, data.resumeLanguage as 'en' | 'th');
    const dateStr = startStr && endStr ? `${startStr} - ${endStr}` : startStr || endStr;

    switch (layout) {
      case 'timeline':
        return (
          <div key={exp.id} className="relative group">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: primary }}></div>
            <div className="font-bold text-lg text-gray-800 flex flex-wrap gap-2 items-center">
              {exp.position}
              {isProject && exp.projectUrl && <a href={exp.projectUrl.startsWith('http') ? exp.projectUrl : `https://${exp.projectUrl}`} target="_blank" rel="noreferrer" className="text-xs font-normal text-blue-500 hover:underline inline-flex items-center"><Globe size={12} className="mr-1" /> Link</a>}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700 font-medium mb-1">
              <span style={{ color: primary }}>{exp.company} {exp.department && <span className="text-gray-600">| {deptLabel}{exp.department}</span>}</span>
              <span>{dateStr}</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mt-1">{exp.description}</p>
            {exp.skillsUsed && (
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                <span className="font-semibold text-gray-600 mr-1">{isProject ? techLabel : skillsLabel}</span>
                <span className="text-gray-700">{exp.skillsUsed}</span>
              </div>
            )}
          </div>
        );
      case 'compact':
        return (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline mb-0.5">
              <h4 className="font-bold text-md text-gray-900">{exp.position} {isProject && exp.projectUrl && <a href={exp.projectUrl.startsWith('http') ? exp.projectUrl : `https://${exp.projectUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-normal text-blue-500 hover:underline">🔗 Link</a>}</h4>
              <span className="text-xs font-semibold text-gray-500">{dateStr}</span>
            </div>
            <div className="text-sm font-medium mb-1" style={{ color: primary }}>{exp.company} {exp.department && <span className="text-gray-600">| {deptLabel}{exp.department}</span>}</div>
            <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            {exp.skillsUsed && <div className="text-[10px] text-gray-600 mt-1"><span className="font-semibold">{isProject ? techLabel : skillsLabel}</span> {exp.skillsUsed}</div>}
          </div>
        );
      case 'classic':
        return (
          <div key={exp.id} className="mb-5 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-end mb-1">
              <div className="font-bold text-lg text-gray-900">{exp.company} {exp.department && <span className="font-normal text-sm text-gray-500 block">{deptLabel}{exp.department}</span>}</div>
              <div className="italic text-gray-600 text-sm">{dateStr}</div>
            </div>
            <div className="italic font-medium text-gray-800 mb-1 flex items-center gap-2">
              {exp.position}
              {isProject && exp.projectUrl && <a href={exp.projectUrl.startsWith('http') ? exp.projectUrl : `https://${exp.projectUrl}`} target="_blank" rel="noreferrer" className="text-xs font-normal text-blue-600 not-italic hover:underline">[Link]</a>}
            </div>
            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{exp.description}</p>
            {exp.skillsUsed && <div className="text-xs text-gray-600 mt-1 italic"><span className="font-semibold">{isProject ? techLabel : skillsLabel}</span> {exp.skillsUsed}</div>}
          </div>
        );
      case 'modern':
      default:
        return (
          <div key={exp.id} className="mb-6">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-lg text-black">{exp.position} {isProject && exp.projectUrl && <a href={exp.projectUrl.startsWith('http') ? exp.projectUrl : `https://${exp.projectUrl}`} target="_blank" rel="noreferrer" className="text-xs font-normal text-blue-500 hover:underline inline-flex items-center align-middle"><Globe size={12} className="mr-1" /> Link</a>}</h4>
              <span className="text-sm font-semibold text-gray-500 whitespace-nowrap ml-4">{dateStr}</span>
            </div>
            <div className="text-sm font-semibold mb-2" style={{ color: primary }}>{exp.company} {exp.department && <span className="text-gray-600 font-medium">| {deptLabel}{exp.department}</span>}</div>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            {exp.skillsUsed && (
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                <span className="font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{isProject ? techLabel : skillsLabel}</span>
                <span className="px-2 py-0.5 text-gray-700">{exp.skillsUsed}</span>
              </div>
            )}
          </div>
        );
    }
  }

  // --- Dynamic Education Item Renderer ---
  const renderEducationItem = (edu: any, themeColor: string = '#437393', layout: 'classic' | 'modern' | 'timeline' | 'clean' | 'compact' = 'clean') => {
    const isEn = data.resumeLanguage === 'en';
    const primary = themeColor;
    const gpaLabel = isEn ? 'GPA' : 'เกรดเฉลี่ย';
    const statusLabel = isEn ? 'Expected' : 'คาดว่าจะจบ';

    const isStudying = edu.status === 'Studying';
    const dateStr = `${formatMonthYear(edu.startDate, data.resumeLanguage as 'en' | 'th')} - ${formatMonthYear(edu.endDate, data.resumeLanguage as 'en' | 'th')} ${isStudying ? `(${statusLabel})` : ''}`;

    // Combine Faculty + Major or FieldOfStudy
    let fieldText = edu.fieldOfStudy || '';
    if (edu.faculty || edu.major) {
      fieldText = [edu.faculty, edu.major].filter(Boolean).join(' - ');
    }

    switch (layout) {
      case 'timeline':
        return (
          <div key={edu.id} className="relative group mb-6 last:mb-0">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: primary }}></div>
            <div className="font-bold text-lg text-gray-800">{edu.degree}</div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 font-medium mb-1">
              <span style={{ color: primary }}>{edu.school}</span>
              <span>{dateStr}</span>
            </div>
            {fieldText && <p className="text-sm text-gray-800">{fieldText}</p>}
            {edu.gpa && <p className="text-sm font-semibold text-gray-600 mt-1">{gpaLabel}: {edu.gpa}</p>}
          </div>
        );

      case 'modern':
      case 'compact':
        return (
          <div key={edu.id} className="mb-4 last:mb-0">
            <div className="font-bold">{edu.degree}</div>
            <div className="opacity-80">{edu.school}</div>
            {fieldText && <div className="text-xs opacity-70 mt-1">{fieldText}</div>}
            <div className="text-xs opacity-60 mt-1 flex justify-between">
              <span>{dateStr}</span>
              {edu.gpa && <span className="font-semibold">{gpaLabel}: {edu.gpa}</span>}
            </div>
          </div>
        );

      case 'classic':
      case 'clean':
      default:
        return (
          <div key={edu.id} className="mb-6 last:mb-0">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="text-lg font-bold text-gray-800">{edu.degree} {edu.gpa && <span className="text-sm font-normal text-gray-500">({gpaLabel}: {edu.gpa})</span>}</h4>
              <span className="text-sm font-bold text-gray-500">{dateStr}</span>
            </div>
            <div className="text-md font-medium mb-2" style={{ color: primary }}>{edu.school}</div>
            {fieldText && <p className="text-sm text-gray-600">{fieldText}</p>}
          </div>
        );
    }
  }

  // --- AI Custom Template Logic ---
  if (selectedTemplate === 'ai-custom') {
    return (
      <div ref={ref} className="w-full h-full bg-white">
        <AICustomTemplate data={data} />
      </div>
    )
  }

  /* =========================================
     STYLE 1: MODERN (Sidebar Left)
     - Sidebar with contact, skills, education
     - Main content with summary, experience
  ========================================= */
  if (selectedTemplate === 'modern') {
    return (
      <div
        ref={ref}
        className={`bg-white w-full h-full flex flex-row overflow-hidden ${fontSize} ${lineHeight}`}
        style={{ fontFamily: fontFamily || "'Prompt', sans-serif" }}
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
            <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3")}>{t('section.contact', data.resumeLanguage as 'en' | 'th')}</h3>
            {data.phone && <div className="flex items-center gap-2"><Phone size={14} /> {data.phone}</div>}
            {data.email && <div className="flex items-center gap-2"><Mail size={14} /> {data.email}</div>}
            {data.address && <div className="flex items-center gap-2"><MapPin size={14} /> {data.address}</div>}
            {data.socialLinks?.filter(l => l.url.trim()).map(link => (
              <div key={link.id} className="flex items-center gap-2">
                <Globe size={14} />
                <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                  {link.platform === 'Other' ? '' : `${link.platform}: `}{link.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4 text-sm">
            <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3")}>{t('section.education', data.resumeLanguage as 'en' | 'th')}</h3>
            {data.education.map(edu => renderEducationItem(edu, themeColor, 'modern'))}
          </div>

          {/* Legacy Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="space-y-4 text-sm">
              <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3")}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="bg-white/20 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Hard Skills */}
          {data.hardSkills && data.hardSkills.length > 0 && (
            <div className="space-y-4 text-sm">
              <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3")}>{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
              <div className="flex flex-wrap gap-2">
                {data.hardSkills.map(skill => (
                  <span key={skill} className="bg-white/20 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {data.softSkills && data.softSkills.length > 0 && (
            <div className="space-y-4 text-sm">
              <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b border-white/30 pb-2 mb-3")}>{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
              <div className="flex flex-wrap gap-2">
                {data.softSkills.map(skill => (
                  <span key={skill} className="bg-white/20 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 text-slate-800 space-y-8">
          <div>
            <h1 className={getHeadingClass("text-5xl font-bold uppercase tracking-tight text-black mb-2")}>{data.name}<br />{data.surname}</h1>
            <h2 className={getHeadingClass("text-xl font-medium tracking-widest uppercase")} style={{ color: themeColor }}>{data.jobTitle}</h2>
          </div>

          <div>
            <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b-2 pb-2 mb-4 text-black")} style={{ borderColor: themeColor }}>{t('section.summary', data.resumeLanguage as 'en' | 'th')}</h3>
            <p className="text-sm leading-relaxed text-justify text-gray-700">{data.summary}</p>
          </div>

          <div>
            <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b-2 pb-2 mb-4 text-black")} style={{ borderColor: themeColor }}>{t('section.experience', data.resumeLanguage as 'en' | 'th')}</h3>
            <div className="space-y-6">
              {data.experience.map(exp => renderExperienceItem(exp, themeColor, 'modern'))}
            </div>
          </div>

          {/* Languages / Certs */}
          {(data.languages.length > 0 || data.certifications.length > 0) && (
            <div>
              <h3 className={getHeadingClass("uppercase font-bold tracking-widest border-b-2 pb-2 mb-4 text-black")} style={{ borderColor: themeColor }}>{data.resumeLanguage === 'th' ? 'ข้อมูลอื่นๆ' : 'Others'}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {data.languages.length > 0 && (
                  <div>
                    <strong className="block mb-1">{t('section.languages', data.resumeLanguage as 'en' | 'th')}</strong>
                    <ul className="list-disc ml-4 text-gray-600">
                      {data.languages.map(l => <li key={l.id}>{l.language} ({l.level})</li>)}
                    </ul>
                  </div>
                )}
                {data.certifications.length > 0 && (
                  <div>
                    <strong className="block mb-1">{t('section.certifications', data.resumeLanguage as 'en' | 'th')}</strong>
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
        className={`bg-white w-full h-full p-12 text-black ${fontSize} ${lineHeight}`}
        style={{ fontFamily: fontFamily || "'Times New Roman', serif" }}
      >
        <div className="text-center border-b-2 border-black pb-6 mb-8">
          <h1 className={getHeadingClass("text-4xl font-bold uppercase tracking-widest mb-2")}>{data.name} {data.surname}</h1>
          <p className="text-lg italic text-gray-600 mb-4">{data.jobTitle}</p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-700 italic">
            {[
              data.phone && <span key="phone">{data.phone}</span>,
              data.email && <span key="email">{data.email}</span>,
              data.address && <span key="address">{data.address}</span>,
              ...(data.socialLinks?.filter(l => l.url.trim()).map(link => (
                <a key={link.id} href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline break-all text-gray-700">
                  {link.platform === 'Other' ? '' : `${link.platform}: `}{link.url.replace(/^https?:\/\//, '')}
                </a>
              )) || [])
            ].filter(Boolean).map((item, index, arr) => (
              <span key={index} className="flex items-center gap-2">
                {item}
                {index < arr.length - 1 && <span>|</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-4 border-b border-gray-200 pb-2")}>{t('section.summary', data.resumeLanguage as 'en' | 'th')}</h3>
            <p className="text-center leading-relaxed text-gray-800 max-w-2xl mx-auto">{data.summary}</p>
          </section>

          <section>
            <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2")}>{t('section.experience', data.resumeLanguage as 'en' | 'th')}</h3>
            <div className="space-y-6">
              {data.experience.map(exp => renderExperienceItem(exp, themeColor, 'classic'))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-12">
            <section>
              <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2")}>{t('section.education', data.resumeLanguage as 'en' | 'th')}</h3>
              {data.education.map(edu => renderEducationItem(edu, themeColor, 'compact'))}
            </section>
            <section className="space-y-6">
              {data.skills && data.skills.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2")}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
                  <div className="text-center leading-loose">{data.skills.join(' • ')}</div>
                </div>
              )}
              {data.hardSkills && data.hardSkills.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2")}>{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
                  <div className="text-center leading-loose">{data.hardSkills.join(' • ')}</div>
                </div>
              )}
              {data.softSkills && data.softSkills.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2")}>{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
                  <div className="text-center leading-loose">{data.softSkills.join(' • ')}</div>
                </div>
              )}
            </section>
          </div>

          {(data.languages.length > 0 || data.certifications.length > 0) && (
            <div className="grid grid-cols-2 gap-12 pt-4">
              {data.languages.length > 0 ? (
                <section>
                  <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2")}>{t('section.languages', data.resumeLanguage as 'en' | 'th')}</h3>
                  <div className="space-y-2 text-center text-gray-800">
                    {data.languages.map(l => <div key={l.id} className="flex justify-center items-baseline gap-2"><span className="font-bold">{l.language}</span> <span className="text-sm italic text-gray-600">({l.level})</span></div>)}
                  </div>
                </section>
              ) : <div></div>}
              {data.certifications.length > 0 ? (
                <section>
                  <h3 className={getHeadingClass("text-center font-bold uppercase tracking-widest text-lg mb-6 border-b border-gray-200 pb-2")}>{t('section.certifications', data.resumeLanguage as 'en' | 'th')}</h3>
                  <div className="space-y-4 text-center">
                    {data.certifications.map(c => (
                      <div key={c.id}>
                        <div className="font-bold text-gray-800">{c.name}</div>
                        <div className="text-sm italic text-gray-600">{c.year}</div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : <div></div>}
            </div>
          )}
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
        className={`bg-white w-full h-full flex flex-col ${fontSize} ${lineHeight}`}
        style={{ fontFamily: fontFamily || "'Poppins', sans-serif" }}
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
            <h1 className={getHeadingClass("text-5xl font-bold uppercase")}>{data.name}<span className="font-light ml-3">{data.surname}</span></h1>
            <p className={getHeadingClass("text-xl opacity-90 tracking-widest uppercase mt-2")}>{data.jobTitle}</p>
          </div>
        </div>

        <div className="flex-1 p-12 grid grid-cols-[1fr_2fr] gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className={getHeadingClass("font-bold text-lg mb-4 uppercase")} style={{ color: themeColor }}>{t('section.contact', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-3 text-sm text-gray-800 font-medium">
                {data.email && <div className="flex items-center gap-2"><Mail size={16} /> {data.email}</div>}
                {data.phone && <div className="flex items-center gap-2"><Phone size={16} /> {data.phone}</div>}
                {data.address && <div className="flex items-center gap-2"><MapPin size={16} /> {data.address}</div>}
                {data.socialLinks?.filter(l => l.url.trim()).map(link => (
                  <div key={link.id} className="flex items-center gap-2">
                    <Globe size={16} />
                    <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                      {link.platform === 'Other' ? '' : `${link.platform}: `}{link.url.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {data.skills && data.skills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-lg mb-4 uppercase")} style={{ color: themeColor }}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.hardSkills && data.hardSkills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-lg mb-4 uppercase")} style={{ color: themeColor }}>{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.hardSkills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.softSkills && data.softSkills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-lg mb-4 uppercase")} style={{ color: themeColor }}>{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.softSkills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className={getHeadingClass("font-bold text-lg mb-4 uppercase")} style={{ color: themeColor }}>{t('section.education', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-4">
                {data.education.map(edu => renderEducationItem(edu, themeColor, 'modern'))}
              </div>
            </div>

            {data.languages.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-lg mb-4 uppercase")} style={{ color: themeColor }}>{t('section.languages', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="space-y-2">
                  {data.languages.map(l => (
                    <div key={l.id} className="flex justify-between text-sm text-gray-800">
                      <span className="font-bold">{l.language}</span>
                      <span className="text-gray-600 font-medium">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
              <h3 className={getHeadingClass("font-bold text-lg mb-4 uppercase border-b-2 inline-block pb-1")} style={{ borderColor: themeColor, color: themeColor }}>{t('section.summary', data.resumeLanguage as 'en' | 'th')}</h3>
              <p>{data.summary}</p>
            </div>

            <div>
              <h3 className={getHeadingClass("font-bold text-lg mb-6 uppercase border-b-2 inline-block pb-1")} style={{ borderColor: themeColor, color: themeColor }}>{t('section.experience', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-8 border-l-2 border-gray-100 pl-6 ml-2">
                {data.experience.map(exp => renderExperienceItem(exp, themeColor, 'timeline'))}
              </div>
            </div>

            {data.certifications.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-lg mb-6 uppercase border-b-2 inline-block pb-1")} style={{ borderColor: themeColor, color: themeColor }}>{t('section.certifications', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="space-y-5 border-l-2 border-gray-100 pl-6 ml-2">
                  {data.certifications.map(c => (
                    <div key={c.id} className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white bg-gray-300"></div>
                      <div className="font-bold text-lg text-gray-800">{c.name}</div>
                      <div className="text-sm text-gray-500 font-medium">{c.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
      <div ref={ref} className={`w-full h-full bg-white flex flex-row overflow-hidden ${fontSize} ${lineHeight}`} style={{ fontFamily: fontFamily || "'Inter', sans-serif" }}>
        {/* Sidebar */}
        <div className="w-[35%] py-8 px-6 flex flex-col gap-6" style={{ backgroundColor: secondary }}>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full bg-white mx-auto mb-4 border-4 p-1" style={{ borderColor: primary }}>
              {data.profileImage ? <img src={data.profileImage} className="w-full h-full rounded-full object-cover" /> : <div className="w-full h-full rounded-full bg-gray-200"></div>}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className={getHeadingClass("font-bold text-gray-800 border-b pb-2 mb-2 uppercase")}>{t('section.contact', data.resumeLanguage as 'en' | 'th')}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {data.phone && <div className="flex items-center gap-2"><Phone size={14} style={{ color: primary }} /> {data.phone}</div>}
              {data.email && <div className="flex items-center gap-2"><Mail size={14} style={{ color: primary }} /> {data.email}</div>}
              {data.address && <div className="flex items-center gap-2"><MapPin size={14} style={{ color: primary }} /> {data.address}</div>}
              {data.portfolioUrl && <div className="flex items-center gap-2"><Globe size={14} style={{ color: primary }} /> <a href={data.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{data.portfolioUrl.replace(/^https?:\/\//, '')}</a></div>}
            </div>
          </div>

          {data.skills && data.skills.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className={getHeadingClass("font-bold text-gray-800 border-b pb-2 mb-2 uppercase")}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {data.hardSkills && data.hardSkills.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className={getHeadingClass("font-bold text-gray-800 border-b pb-2 mb-2 uppercase")}>{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
              <div className="flex flex-wrap gap-2">
                {data.hardSkills.map(skill => (
                  <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {data.softSkills && data.softSkills.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className={getHeadingClass("font-bold text-gray-800 border-b pb-2 mb-2 uppercase")}>{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
              <div className="flex flex-wrap gap-2">
                {data.softSkills.map(skill => (
                  <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className={getHeadingClass("font-bold text-gray-800 border-b pb-2 mb-2 uppercase")}>{t('section.languages', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-2 border-l-2 pl-2" style={{ borderColor: primary }}>
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700">{l.language}</span>
                    <span className="text-gray-500 text-xs">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 space-y-8">
          <div className="pl-4 border-l-8" style={{ borderColor: primary }}>
            <h1 className={getHeadingClass("text-5xl font-bold text-gray-800")}>{data.name}</h1>
            <h2 className={getHeadingClass("text-3xl font-light text-gray-600")}>{data.surname}</h2>
            <p className={getHeadingClass("text-xl mt-2 font-medium tracking-widest uppercase")} style={{ color: primary }}>{data.jobTitle}</p>
          </div>

          <div className="prose max-w-none text-gray-600">
            <p>{data.summary}</p>
          </div>

          <div>
            <div className={getHeadingClass("inline-block text-white px-4 py-1 rounded-r-full font-bold mb-4 text-lg uppercase")} style={{ backgroundColor: primary }}>{t('section.experience', data.resumeLanguage as 'en' | 'th')}</div>
            <div className="space-y-6 border-l-2 border-gray-100 ml-4 pl-6 relative">
              {data.experience.map(exp => renderExperienceItem(exp, primary, 'timeline'))}
            </div>
          </div>

          <div>
            <div className={getHeadingClass("inline-block text-white px-4 py-1 rounded-r-full font-bold mb-4 text-lg uppercase")} style={{ backgroundColor: primary }}>{t('section.education', data.resumeLanguage as 'en' | 'th')}</div>
            <div className="space-y-4 ml-4">
              {data.education.map(edu => renderEducationItem(edu, primary, 'timeline'))}
            </div>
          </div>

          {data.certifications.length > 0 && (
            <div>
              <div className={getHeadingClass("inline-block text-white px-4 py-1 rounded-r-full font-bold mb-4 text-lg uppercase")} style={{ backgroundColor: primary }}>{t('section.certifications', data.resumeLanguage as 'en' | 'th')}</div>
              <div className="space-y-4 ml-4">
                {data.certifications.map(c => (
                  <div key={c.id} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: primary }}>
                    <div className="font-bold text-gray-800">{c.name}</div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">{c.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
      <div ref={ref} className={`w-full h-full bg-white flex flex-row overflow-hidden ${fontSize} ${lineHeight}`} style={{ fontFamily: fontFamily || "'Poppins', sans-serif" }}>
        {/* Sidebar */}
        <div className="w-[35%] h-full text-white p-6 relative flex flex-col items-center pt-12" style={{ backgroundColor: primary, borderTopRightRadius: '60px' }}>
          <div className="w-48 h-48 rounded-full border-4 border-white/30 mb-6 overflow-hidden">
            {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : <div className="bg-white/20 w-full h-full"></div>}
          </div>

          <div className="w-full space-y-6 mt-8">
            <div>
              <h3 className={getHeadingClass("text-center font-bold tracking-widest border-b border-white/20 pb-2 mb-4")}>{t('section.contact', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-3 text-sm text-white/90">
                {data.phone && <div className="flex items-center gap-2 justify-center"><Phone size={14} /> {data.phone}</div>}
                {data.email && <div className="flex items-center gap-2 justify-center"><Mail size={14} /> {data.email}</div>}
                {data.address && <div className="flex items-center gap-2 justify-center text-center"><MapPin size={14} /> {data.address}</div>}
                {data.portfolioUrl && <div className="flex items-center gap-2 justify-center text-center"><Globe size={14} /> <a href={data.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{data.portfolioUrl.replace(/^https?:\/\//, '')}</a></div>}
              </div>
            </div>

            {data.skills && data.skills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("text-center font-bold tracking-widest border-b border-white/20 pb-2 mb-4")}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.skills.map(skill => (
                    <span key={skill} className="bg-white/20 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.hardSkills && data.hardSkills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("text-center font-bold tracking-widest border-b border-white/20 pb-2 mb-4")}>{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.hardSkills.map(skill => (
                    <span key={skill} className="bg-white/20 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.softSkills && data.softSkills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("text-center font-bold tracking-widest border-b border-white/20 pb-2 mb-4")}>{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.softSkills.map(skill => (
                    <span key={skill} className="bg-white/20 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.languages.length > 0 && (
              <div>
                <h3 className={getHeadingClass("text-center font-bold tracking-widest border-b border-white/20 pb-2 mb-4")}>{t('section.languages', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="space-y-2 text-sm text-center">
                  {data.languages.map(l => (
                    <div key={l.id} className="text-white">
                      <span className="font-bold">{l.language}</span> <span className="text-white/70 italic">({l.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-10 rounded-tl-full"></div>
        </div>

        <div className="flex-1 p-12">
          <div className="border-b-2 border-dashed pb-6 mb-8" style={{ borderColor: primary }}>
            <h1 className={getHeadingClass("text-6xl font-bold mb-2")} style={{ color: primary }}>{data.name}</h1>
            <h2 className={getHeadingClass("text-4xl font-light text-gray-400")}>{data.surname}</h2>
            <p className={getHeadingClass("text-2xl mt-2 tracking-widest text-gray-600")}>{data.jobTitle}</p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: primary }}>
              <h3 className={getHeadingClass("font-bold text-xl mb-4 flex items-center gap-2")} style={{ color: primary }}>
                <span>{t('section.experience', data.resumeLanguage as 'en' | 'th')}</span>
              </h3>
              <div className="space-y-6">
                {data.experience.map(exp => renderExperienceItem(exp, primary, 'compact'))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: primary }}>
              <h3 className={getHeadingClass("font-bold text-xl mb-4 flex items-center gap-2")} style={{ color: primary }}>
                <span>{t('section.education', data.resumeLanguage as 'en' | 'th')}</span>
              </h3>
              <div className="space-y-4">
                {data.education.map(edu => renderEducationItem(edu, primary, 'compact'))}
              </div>
            </div>

            {data.certifications.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: primary }}>
                <h3 className={getHeadingClass("font-bold text-xl mb-4 flex items-center gap-2")} style={{ color: primary }}>
                  <span>{t('section.certifications', data.resumeLanguage as 'en' | 'th')}</span>
                </h3>
                <div className="space-y-4">
                  {data.certifications.map(c => (
                    <div key={c.id}>
                      <div className="font-bold text-gray-800">{c.name}</div>
                      <div className="text-sm text-gray-500">{c.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
      <div ref={ref} className={`w-full h-full bg-white flex flex-col relative overflow-hidden ${fontSize} ${lineHeight}`} style={{ fontFamily: fontFamily || "'Roboto Mono', monospace" }}>
        <header className="bg-black text-white p-12 flex items-center gap-8">
          <div className="w-32 h-32 bg-white rounded-full p-1 shrink-0">
            {data.profileImage ? <img src={data.profileImage} className="w-full h-full rounded-full object-cover" /> : <div className="bg-gray-200 w-full h-full rounded-full" />}
          </div>
          <div>
            <h1 className={getHeadingClass("text-5xl font-bold tracking-widest mb-2")}>{data.name} <span className="text-gray-400">{data.surname}</span></h1>
            <p className={getHeadingClass("text-xl text-green-400")}>&lt; {data.jobTitle} /&gt;</p>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-[1fr_2fr]">
          <aside className="bg-gray-100 p-8 border-r border-gray-300">
            <div className="mb-8">
              <h3 className={getHeadingClass("font-bold text-black border-b-2 border-black pb-2 mb-4")}>{t('section.contact', data.resumeLanguage as 'en' | 'th')}_INFO</h3>
              <div className="space-y-2 text-sm">
                <div className="break-all">root@: {data.email}</div>
                <div>tel: {data.phone}</div>
                <div>loc: {data.address}</div>
                {data.socialLinks?.filter(l => l.url.trim()).map(link => (
                  <div key={link.id} className="break-all">
                    {link.platform === 'Other' ? 'web' : link.platform.toLowerCase()}: <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 underline">{link.url.replace(/^https?:\/\//, '')}</a>
                  </div>
                ))}
              </div>
            </div>

            {data.skills && data.skills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-black border-b-2 border-black pb-2 mb-4")}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}_SET</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <span key={skill} className="bg-black text-white px-2 py-1 text-xs font-bold">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.hardSkills && data.hardSkills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-black border-b-2 border-black pb-2 mb-4 mt-8")}>{data.resumeLanguage === 'en' ? 'HARD_SKILLS' : 'HARD_SKILLS'}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.hardSkills.map(skill => (
                    <span key={skill} className="bg-black text-white px-2 py-1 text-xs font-bold">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.softSkills && data.softSkills.length > 0 && (
              <div>
                <h3 className={getHeadingClass("font-bold text-black border-b-2 border-black pb-2 mb-4 mt-8")}>{data.resumeLanguage === 'en' ? 'SOFT_SKILLS' : 'SOFT_SKILLS'}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.softSkills.map(skill => (
                    <span key={skill} className="bg-black text-white px-2 py-1 text-xs font-bold">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {data.languages.length > 0 && (
              <div className="mt-8">
                <h3 className={getHeadingClass("font-bold text-black border-b-2 border-black pb-2 mb-4")}>{t('section.languages', data.resumeLanguage as 'en' | 'th')}_SYS</h3>
                <div className="space-y-2 text-sm">
                  {data.languages.map(l => (
                    <div key={l.id} className="flex justify-between">
                      <span className="font-bold">{l.language}</span>
                      <span className="text-gray-500">[{l.level}]</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main className="p-8 space-y-8">
            <section>
              <h3 className={getHeadingClass("font-bold text-2xl text-black border-l-4 border-black pl-4 mb-4")}>OBJECTIVE // {t('section.summary', data.resumeLanguage as 'en' | 'th')}</h3>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>

            <section>
              <h3 className={getHeadingClass("font-bold text-2xl text-black border-l-4 border-black pl-4 mb-4")}>SYSTEM_LOG // {t('section.experience', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-6">
                {data.experience.map(exp => renderExperienceItem(exp, primary, 'compact'))}
              </div>
            </section>

            <section>
              <h3 className={getHeadingClass("font-bold text-2xl text-black border-l-4 border-black pl-4 mb-4")}>BUILD // {t('section.education', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-4">
                {data.education.map(edu => renderEducationItem(edu, primary, 'compact'))}
              </div>
            </section>

            {data.certifications.length > 0 && (
              <section>
                <h3 className={getHeadingClass("font-bold text-2xl text-black border-l-4 border-black pl-4 mb-4")}>AUTH_KEY // {t('section.certifications', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="space-y-4">
                  {data.certifications.map(c => (
                    <div key={c.id}>
                      <div className="font-bold">{c.name}</div>
                      <div className="text-green-600 font-mono text-xs">{c.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
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
      <div ref={ref} className={`w-full h-full bg-white relative overflow-hidden ${fontSize} ${lineHeight}`} style={{ fontFamily: fontFamily || "'Inter', sans-serif" }}>
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-opacity-20 rounded-bl-[200px] z-0" style={{ backgroundColor: primary }}></div>

        <div className="relative z-10 p-12 h-full flex flex-col">
          <header className="flex justify-between items-start mb-12">
            <div className="flex-1 max-w-2xl">
              <h1 className={getHeadingClass("text-6xl font-extrabold text-gray-900 tracking-tight")}>{data.name}</h1>
              <h2 className={getHeadingClass("text-4xl font-light text-gray-600 mt-2")}>{data.surname}</h2>
              <div className={getHeadingClass("mt-4 inline-block px-4 py-1.5 rounded-full text-white font-bold tracking-widest shadow-md")} style={{ backgroundColor: primary }}>
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
                <h3 className={getHeadingClass("font-bold text-xl mb-4 border-b-2 pb-2")}>{t('section.contact', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="space-y-3 text-gray-600">
                  {data.phone && <div className="flex items-center gap-3"><Phone size={18} style={{ color: primary }} /> {data.phone}</div>}
                  {data.email && <div className="flex items-center gap-3"><Mail size={18} style={{ color: primary }} /> {data.email}</div>}
                  {data.address && <div className="flex items-center gap-3"><MapPin size={18} style={{ color: primary }} /> {data.address}</div>}
                  {data.socialLinks?.filter(l => l.url.trim()).map(link => (
                    <div key={link.id} className="flex items-center gap-3">
                      <Globe size={18} style={{ color: primary }} />
                      <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                        {link.platform === 'Other' ? '' : `${link.platform}: `}{link.url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={getHeadingClass("font-bold text-xl mb-4 border-b-2 pb-2")}>{t('section.summary', data.resumeLanguage as 'en' | 'th')}</h3>
                <p className="text-gray-600 leading-relaxed text-justify">{data.summary}</p>
              </div>

              {data.skills && data.skills.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("font-bold text-xl mb-4 border-b-2 pb-2")}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map(skill => (
                      <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.hardSkills && data.hardSkills.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("font-bold text-xl mb-4 border-b-2 pb-2")}>{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.hardSkills.map(skill => (
                      <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.softSkills && data.softSkills.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("font-bold text-xl mb-4 border-b-2 pb-2")}>{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.softSkills.map(skill => (
                      <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.languages.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("font-bold text-xl mb-4 border-b-2 pb-2")}>{t('section.languages', data.resumeLanguage as 'en' | 'th')}</h3>
                  <div className="space-y-2 text-gray-700">
                    {data.languages.map(l => (
                      <div key={l.id} className="flex justify-between">
                        <span className="font-bold">{l.language}</span>
                        <span className="text-gray-500 text-sm">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            <main className="space-y-8">
              <div>
                <h3 className={getHeadingClass("font-bold text-2xl mb-6 flex items-center gap-3")}>
                  <span className="w-3 h-8 rounded-full" style={{ backgroundColor: primary }}></span> {t('section.experience', data.resumeLanguage as 'en' | 'th')}
                </h3>
                <div className="space-y-8">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <h4 className="text-xl font-bold text-gray-800">{exp.position}</h4>
                      <div className="text-sm font-semibold mb-2" style={{ color: primary }}>{exp.company} | {formatMonthYear(exp.startDate, data.resumeLanguage as 'en' | 'th')} - {formatMonthYear(exp.endDate, data.resumeLanguage as 'en' | 'th')}</div>
                      <p className="text-gray-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={getHeadingClass("font-bold text-2xl mb-6 flex items-center gap-3")}>
                  <span className="w-3 h-8 rounded-full" style={{ backgroundColor: primary }}></span> {t('section.education', data.resumeLanguage as 'en' | 'th')}
                </h3>
                <div className="space-y-4">
                  {data.education.map(edu => renderEducationItem(edu, primary, 'modern'))}
                </div>
              </div>

              {data.certifications.length > 0 && (
                <div>
                  <h3 className={getHeadingClass("font-bold text-2xl mb-6 flex items-center gap-3")}>
                    <span className="w-3 h-8 rounded-full" style={{ backgroundColor: primary }}></span> {t('section.certifications', data.resumeLanguage as 'en' | 'th')}
                  </h3>
                  <div className="space-y-4">
                    {data.certifications.map(c => (
                      <div key={c.id}>
                        <div className="text-lg font-bold text-gray-800">{c.name}</div>
                        <div className="text-sm font-semibold text-gray-500">{c.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
      <div ref={ref} className={`w-full h-full bg-gray-50 p-8 flex flex-col ${fontSize} ${lineHeight}`} style={{ fontFamily: fontFamily || "'Inter', sans-serif" }}>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex items-center gap-8 border-t-8" style={{ borderColor: primary }}>
          <div className="w-40 h-40 rounded-xl bg-gray-200 overflow-hidden shrink-0">
            {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : null}
          </div>
          <div className="flex-1">
            <h1 className={getHeadingClass("text-5xl font-bold text-gray-900 mb-2")}>{data.name} {data.surname}</h1>
            <p className={getHeadingClass("text-2xl font-medium tracking-widest")} style={{ color: primary }}>{data.jobTitle}</p>
            <p className="mt-4 text-gray-600 max-w-2xl">{data.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2.5fr] gap-8 flex-1">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className={getHeadingClass("font-bold text-gray-900 border-b pb-2 mb-4")}>{t('section.contact', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {data.email && <div>{data.email}</div>}
                {data.phone && <div>{data.phone}</div>}
                {data.address && <div>{data.address}</div>}
                {data.socialLinks?.filter(l => l.url.trim()).map(link => (
                  <div key={link.id} className="break-all">
                    <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                      {link.platform === 'Other' ? '' : `${link.platform}: `}{link.url.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {data.skills && data.skills.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className={getHeadingClass("font-bold text-gray-900 border-b pb-2 mb-4")}>{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
                <ul className="space-y-2">
                  {data.skills.map(skill => (
                    <li key={skill} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.hardSkills && data.hardSkills.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className={getHeadingClass("font-bold text-gray-900 border-b pb-2 mb-4")}>{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
                <ul className="space-y-2">
                  {data.hardSkills.map(skill => (
                    <li key={skill} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.softSkills && data.softSkills.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className={getHeadingClass("font-bold text-gray-900 border-b pb-2 mb-4")}>{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
                <ul className="space-y-2">
                  {data.softSkills.map(skill => (
                    <li key={skill} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.languages.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className={getHeadingClass("font-bold text-gray-900 border-b pb-2 mb-4")}>{t('section.languages', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="space-y-3">
                  {data.languages.map(l => (
                    <div key={l.id}>
                      <div className="font-bold text-gray-800">{l.language}</div>
                      <div className="text-sm text-gray-500">{l.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className={getHeadingClass("font-bold text-xl text-gray-900 mb-6 border-b pb-2")}>{t('section.experience', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="space-y-8">
                {data.experience.map(exp => renderExperienceItem(exp, themeColor, 'modern'))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className={getHeadingClass("font-bold text-xl text-gray-900 mb-6 border-b pb-2")}>{t('section.education', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.education.map(edu => renderEducationItem(edu, primary, 'modern'))}
              </div>
            </div>

            {data.certifications.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className={getHeadingClass("font-bold text-xl text-gray-900 mb-6 border-b pb-2")}>{t('section.certifications', data.resumeLanguage as 'en' | 'th')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.certifications.map(c => (
                    <div key={c.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-bold text-gray-800">{c.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{c.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          <div className="font-medium text-black">{t('section.contact', data.resumeLanguage as 'en' | 'th')}</div>
          <div>{data.address}</div>
          <div>{data.email}</div>
          <div>{data.phone}</div>
          {data.socialLinks?.filter(l => l.url.trim()).map(link => (
            <div key={link.id}>
              <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                {link.platform === 'Other' ? '' : `${link.platform}: `}{link.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-[2fr_1fr] gap-12 flex-1">
        {/* Main Left */}
        <div className="space-y-8">
          <section>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> {t('section.summary', data.resumeLanguage as 'en' | 'th')}
            </h3>
            <p className="text-gray-600 text-justify">{data.summary}</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> {t('section.experience', data.resumeLanguage as 'en' | 'th')}
            </h3>
            <div className="space-y-6">
              {data.experience.map(exp => renderExperienceItem(exp, primaryColor, 'modern'))}
            </div>
          </section>

          {data.certifications.length > 0 && (
            <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> {t('section.certifications', data.resumeLanguage as 'en' | 'th')}
              </h3>
              <div className="space-y-4">
                {data.certifications.map(c => (
                  <div key={c.id}>
                    <div className="font-bold text-gray-800 text-lg">{c.name}</div>
                    <div className="text-sm font-semibold text-gray-500">{c.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Right */}
        <div className="space-y-8">
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{t('section.education', data.resumeLanguage as 'en' | 'th')}</h3>
            <div className="space-y-4">
              {data.education.map(edu => renderEducationItem(edu, primaryColor, 'modern'))}
            </div>
          </section>

          {data.skills && data.skills.length > 0 && (
            <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{t('section.skills', data.resumeLanguage as 'en' | 'th')}</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded hover:border-gray-400 transition-colors">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {data.hardSkills && data.hardSkills.length > 0 && (
            <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{data.resumeLanguage === 'en' ? 'Hard Skills' : 'Hard Skills (ทักษะทางวิชาชีพ)'}</h3>
              <div className="flex flex-wrap gap-2">
                {data.hardSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded hover:border-gray-400 transition-colors">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {data.softSkills && data.softSkills.length > 0 && (
            <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{data.resumeLanguage === 'en' ? 'Soft Skills' : 'Soft Skills (ทักษะทางสังคม)'}</h3>
              <div className="flex flex-wrap gap-2">
                {data.softSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded hover:border-gray-400 transition-colors">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {(data.languages.length > 0) && (
            <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{t('section.languages', data.resumeLanguage as 'en' | 'th')}</h3>
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
