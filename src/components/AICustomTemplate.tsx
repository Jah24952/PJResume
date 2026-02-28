import React from 'react'
import { ResumeData, AICustomSchema } from '@/store/resume.store'
import { Phone, Mail, MapPin, Globe } from 'lucide-react'
import { t } from '@/lib/i18n'
import { formatMonthYear } from '@/lib/date'

interface Props {
    data: ResumeData
}

export default React.forwardRef<HTMLDivElement, Props>(function AICustomTemplate({ data }, ref) {
    const schema = data.aiTemplateSchema
    if (!schema) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                AI Schema Not Found
            </div>
        )
    }

    const {
        theme = {
            primaryColor: '#437393',
            secondaryColor: '#2c5282',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            fontFamily: "'Prompt', sans-serif",
            headingStyle: 'uppercase',
            headingColor: '#437393'
        },
        layoutType = 'one-column',
        structure = {
            header: { alignment: 'left', hasBackground: false, showProfileImage: true, profileImageShape: 'circle' },
            mainColumn: ['contact', 'summary', 'experience', 'education', 'skills'],
            sideColumn: []
        },
        decorations = { sectionDivider: 'solid' }
    } = schema || {}

    const { resumeLanguage } = data
    const lang = resumeLanguage as 'en' | 'th'

    const headingClass = theme.headingStyle === 'uppercase' ? 'uppercase' : 'normal-case'
    const dividerClass = decorations.sectionDivider === 'solid'
        ? 'border-b-2 mb-4 pb-2'
        : decorations.sectionDivider === 'dashed'
            ? 'border-b-2 border-dashed mb-4 pb-2'
            : 'mb-4'

    const SectionHeader = ({ title }: { title: string }) => (
        <h3
            className={`${headingClass} font-bold tracking-wider ${dividerClass}`}
            style={{ color: theme.headingColor, borderColor: theme.primaryColor + '40' }}
        >
            {title}
        </h3>
    )

    const renderSection = (sectionName: string) => {
        switch (sectionName) {
            case 'contact':
                return (
                    <div key="contact" className="space-y-2 text-sm mb-6">
                        <SectionHeader title={t('section.contact', lang)} />
                        {data.phone && <div className="flex items-center gap-2"><Phone size={14} style={{ color: theme.primaryColor }} /> {data.phone}</div>}
                        {data.email && <div className="flex items-center gap-2"><Mail size={14} style={{ color: theme.primaryColor }} /> {data.email}</div>}
                        {data.address && <div className="flex items-center gap-2"><MapPin size={14} style={{ color: theme.primaryColor }} /> {data.address}</div>}
                        {data.socialLink && <div className="flex items-center gap-2"><Globe size={14} style={{ color: theme.primaryColor }} /> {data.socialLink}</div>}
                    </div>
                )

            case 'summary':
                if (!data.summary) return null
                return (
                    <div key="summary" className="mb-6">
                        <SectionHeader title={t('section.summary', lang)} />
                        <p className="text-sm leading-relaxed text-justify opacity-90">{data.summary}</p>
                    </div>
                )

            case 'experience':
                if (data.experience.length === 0) return null
                return (
                    <div key="experience" className="mb-6">
                        <SectionHeader title={t('section.experience', lang)} />
                        <div className="space-y-4">
                            {data.experience.map(exp => (
                                <div key={exp.id} className={`
                                    ${decorations.itemStyle === 'card' ? 'bg-white/40 p-4 rounded-xl shadow-sm border border-gray-100/50' : ''}
                                    ${decorations.itemStyle === 'line-left' ? 'border-l-2 pl-4 py-1' : ''}
                                `} style={{ borderLeftColor: decorations.itemStyle === 'line-left' ? theme.primaryColor : undefined }}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-base" style={{ color: theme.secondaryColor || theme.textColor }}>{exp.position}</h4>
                                        <span className="text-xs font-semibold opacity-70">
                                            {formatMonthYear(exp.startDate, lang)} - {formatMonthYear(exp.endDate, lang)}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold mb-1 opacity-90" style={{ color: theme.primaryColor }}>{exp.company}</div>
                                    <p className="text-sm opacity-80 whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case 'education':
                if (data.education.length === 0) return null
                return (
                    <div key="education" className="mb-6">
                        <SectionHeader title={t('section.education', lang)} />
                        <div className="space-y-4">
                            {data.education.map(edu => (
                                <div key={edu.id} className={`
                                    ${decorations.itemStyle === 'card' ? 'bg-white/40 p-4 rounded-xl shadow-sm border border-gray-100/50' : ''}
                                    ${decorations.itemStyle === 'line-left' ? 'border-l-2 pl-4 py-1' : ''}
                                `} style={{ borderLeftColor: decorations.itemStyle === 'line-left' ? theme.primaryColor : undefined }}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-base" style={{ color: theme.secondaryColor || theme.textColor }}>{edu.degree}</h4>
                                        <span className="text-xs font-semibold opacity-70">
                                            {formatMonthYear(edu.startDate, lang)} - {formatMonthYear(edu.endDate, lang)}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold mb-1 opacity-90" style={{ color: theme.primaryColor }}>{edu.school}</div>
                                    {edu.fieldOfStudy && <div className="text-sm opacity-80">{edu.fieldOfStudy}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case 'skills':
                if (data.skills.length === 0) return null
                return (
                    <div key="skills" className="mb-6">
                        <SectionHeader title={t('section.skills', lang)} />
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span
                                    key={skill}
                                    className="px-2 py-1 flex items-center justify-center rounded text-xs font-medium"
                                    style={{ backgroundColor: theme.primaryColor + '20', color: theme.primaryColor }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    // Base wrapper style depending on AI theme response
    const containerStyle = {
        fontFamily: (theme?.fontFamily || "'Prompt', sans-serif").replace(/"/g, ''),
        backgroundColor: theme?.backgroundColor || '#ffffff',
        color: theme?.textColor || '#333333',
    }

    const headerAlignClass =
        structure?.header?.alignment === 'center' ? 'text-center' :
            structure?.header?.alignment === 'right' ? 'text-right' : 'text-left'

    // Profile Image Dynamic Shape
    const shapeClass =
        structure?.header?.profileImageShape === 'circle' ? 'rounded-full' :
            structure?.header?.profileImageShape === 'rounded' ? 'rounded-xl' : 'rounded-none'

    return (
        <div className={`w-full min-h-full flex flex-col shadow-sm overflow-hidden ${data.fontSize || 'text-sm'} ${data.lineHeight || 'leading-relaxed'}`} style={containerStyle}>

            {/* Dynamic Header */}
            <header
                className={`px-8 py-10 ${headerAlignClass} flex ${structure?.header?.alignment === 'center' ? 'flex-col items-center' : structure?.header?.alignment === 'right' ? 'flex-row-reverse items-center justify-between' : 'flex-row items-center justify-between'}`}
                style={{
                    backgroundColor: structure?.header?.hasBackground ? theme?.primaryColor : 'transparent',
                    color: structure?.header?.hasBackground ? '#ffffff' : theme?.textColor
                }}
            >
                <div className={structure?.header?.alignment === 'center' ? 'order-last mt-6' : ''}>
                    <h1 className={`${headingClass} text-4xl font-bold tracking-tight mb-2`} style={{ color: structure?.header?.hasBackground ? '#ffffff' : theme?.primaryColor }}>
                        {data.name} {data.surname}
                    </h1>
                    <h2 className={`text-xl font-medium tracking-widest ${headingClass}`} style={{ color: structure?.header?.hasBackground ? 'rgba(255,255,255,0.8)' : theme?.secondaryColor || theme?.textColor }}>
                        {data.jobTitle}
                    </h2>
                </div>

                {/* Profile Image (Optional) */}
                {structure?.header?.showProfileImage && data.profileImage && (
                    <div className={structure?.header?.alignment === 'center' ? 'order-first' : ''}>
                        <div className={`w-32 h-32 overflow-hidden border-4 flex items-center justify-center bg-gray-100 ${shapeClass}`} style={{ borderColor: structure?.header?.hasBackground ? 'rgba(255,255,255,0.3)' : theme?.primaryColor }}>
                            <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </header>

            {/* Dynamic Main Body Content */}
            <div className={`flex-1 p-8 ${layoutType?.startsWith('two-column') ? 'flex gap-8' : 'flex flex-col'}`}>

                {layoutType === 'two-column-left' && (
                    <>
                        <aside className={`w-[35%] p-6 ${structure?.sidebarStyle === 'fill' ? '' : 'pr-4'} ${structure?.sidebarStyle === 'border' ? 'border-r border-gray-200/50' : ''}`}
                            style={{ backgroundColor: structure?.sidebarStyle === 'fill' ? theme?.primaryColor + '10' : undefined }}>
                            {structure?.sideColumn?.map(renderSection)}
                        </aside>
                        <main className={`w-[65%] ${structure?.sidebarStyle === 'fill' ? 'pl-6' : ''}`}>
                            {structure?.mainColumn?.map(renderSection)}
                        </main>
                    </>
                )}

                {layoutType === 'two-column-right' && (
                    <>
                        <main className={`w-[65%] ${structure?.sidebarStyle === 'fill' ? 'pr-6' : ''} ${structure?.sidebarStyle === 'border' ? 'pr-4 border-r border-gray-200/50' : ''}`}>
                            {structure?.mainColumn?.map(renderSection)}
                        </main>
                        <aside className={`w-[35%] p-6 ${structure?.sidebarStyle === 'fill' ? '' : 'pl-4'}`}
                            style={{ backgroundColor: structure?.sidebarStyle === 'fill' ? theme?.primaryColor + '10' : undefined }}>
                            {structure?.sideColumn?.map(renderSection)}
                        </aside>
                    </>
                )}

                {layoutType === 'one-column' && (
                    <main className="w-full flex-col md:grid md:grid-cols-2 md:gap-x-12 block">
                        <div className="col-span-2">
                            {structure?.mainColumn?.map(renderSection)}
                        </div>
                    </main>
                )}

            </div>
        </div>
    )
})
