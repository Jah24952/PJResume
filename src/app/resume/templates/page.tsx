'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import MiniResumePreview from '@/components/MiniResumePreview'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ResumePreview from '@/components/ResumePreview'
import { useResumeStore } from '@/store/resume.store'

const FILTERS = {
    language: {
        title: 'Language',
        options: ['ภาษาอังกฤษ', 'ภาษาไทย']
    },
    type: {
        title: 'Type',
        options: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์']
    },
    style: {
        title: 'Style',
        options: ['Modern', 'Professional', 'Creative', 'Simple']
    },
    color: {
        title: 'Color',
        options: ['Color', 'B&W']
    },
    level: {
        title: 'Level',
        options: ['Entry Level', 'Senior', 'Manager']
    },
    career: {
        title: 'Career Field',
        options: [
            'เทคโนโลยี / IT / ดิจิทัล',
            'ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ',
            'ธุรกิจ / การจัดการ / องค์กร',
            'การตลาด / การขาย / สื่อสาร',
            'การเงิน / บัญชี / วิเคราะห์',
            'ทรัพยากรบุคคล / องค์กร',
            'การศึกษา / วิชาการ',
            'อุตสาหกรรม / วิศวกรรม',
            'ราชการ / รัฐวิสาหกิจ'
        ]
    }
}

import { TEMPLATES } from '../../../lib/constants'

export default function TemplateSelectionPage() {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        language: [],
        type: [],
        style: [],
        color: [],
        level: [],
        career: []
    })
    const [customizingTemplate, setCustomizingTemplate] = useState<any>(null)
    const [showAIModal, setShowAIModal] = useState(false)

    const { setTemplate, updateCustomization, setAiSchema } = useResumeStore()

    // Set default filters (example: Thai language and Entry Level)
    useEffect(() => {
        setSelectedFilters(prev => ({
            ...prev,
            language: ['ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา']
        }))
    }, [])

    const { user } = useAuthStore()
    const router = useRouter()

    // Auth Guard
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                router.push('/login')
            }
        }, 100)
        return () => clearTimeout(timer)
    }, [user, router])

    const toggleFilter = (category: string, option: string) => {
        setSelectedFilters(prev => {
            const current = prev[category] || []
            const updated = current.includes(option)
                ? current.filter(item => item !== option)
                : [...current, option]
            return { ...prev, [category]: updated }
        })
    }

    // Filter Logic
    const filteredTemplates = TEMPLATES.filter(template => {
        return Object.entries(selectedFilters).every(([category, selectedOptions]) => {
            if (selectedOptions.length === 0) return true
            // OR logic within category (e.g. Modern OR Creative)
            const templateOptions = template.categories[category as keyof typeof template.categories]
            return selectedOptions.some(option => (templateOptions as readonly string[]).includes(option))
        })
    })

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            {/* Header */}
            <Header />

            <div className="container mx-auto px-6 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#437393]">เทมเพลตที่ดีที่สุดสำหรับคุณ</h1>
                    <p className="text-gray-500 mt-2 text-lg">เลือกรูปแบบที่ใช่ แล้วเริ่มต้นสร้างเรซูเม่ของคุณได้ทันที</p>
                </div>

                <div className="flex justify-center mb-10">
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center gap-2 border-2 border-transparent hover:border-purple-300"
                    >
                        ✨ Generate Template ด้วย AI
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        {Object.entries(FILTERS).map(([key, section]) => (
                            <div key={key}>
                                <h3 className="font-bold text-[#2c5282] text-lg mb-3">{section.title}</h3>
                                <div className="space-y-2">
                                    {section.options.map(option => (
                                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${selectedFilters[key]?.includes(option)
                                                ? 'bg-[#437393] border-[#437393]'
                                                : 'border-slate-300 group-hover:border-[#437393]'
                                                }`}>
                                                {selectedFilters[key]?.includes(option) && (
                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedFilters[key]?.includes(option)}
                                                onChange={() => toggleFilter(key, option)}
                                            />
                                            <span className={`text-base ${selectedFilters[key]?.includes(option)
                                                ? 'text-[#437393] font-medium'
                                                : 'text-slate-500 group-hover:text-slate-700'
                                                }`}>
                                                {option}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </aside>

                    {/* Right Template Grid */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {filteredTemplates.length > 0 ? (
                                filteredTemplates.map((template) => (
                                    <div key={template.id} className="group relative cursor-pointer">
                                        {/* Card Container */}
                                        <div className="aspect-[210/297] bg-white rounded-lg shadow-md border hover:shadow-xl transition-all overflow-hidden relative">

                                            {/* LIVE PREVIEW COMPONENT */}
                                            <div className={`w-full h-full transform transition-transform duration-300 group-hover:scale-105`}>
                                                <MiniResumePreview style={template.style as any} color={template.color} />
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-[#437393]/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                                                <button onClick={() => setCustomizingTemplate(template)} className="bg-[#437393] text-white px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-[#345b75]">
                                                    ปรับแต่งเทมเพลต
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-sm font-bold text-[#437393]">{template.name}</p>
                                            <div className="flex gap-1 mt-1 flex-wrap">
                                                {template.categories.style.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-gray-400">
                                    <p className="text-lg">ไม่พบเทมเพลตที่ตรงกับตัวเลือกของคุณ</p>
                                    <button
                                        onClick={() => setSelectedFilters({ language: [], type: [], style: [], color: [], level: [], career: [] })}
                                        className="mt-4 text-[#437393] hover:underline"
                                    >
                                        ล้างตัวกรองทั้งหมด
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {customizingTemplate && (
                <CustomizationModal
                    template={customizingTemplate}
                    onClose={() => setCustomizingTemplate(null)}
                    onConfirm={(customizedData) => {
                        setTemplate(customizedData.selectedTemplate, customizedData.themeColor);
                        updateCustomization({
                            fontFamily: customizedData.fontFamily,
                            fontSize: customizedData.fontSize,
                            lineHeight: customizedData.lineHeight,
                            headingStyle: customizedData.headingStyle
                        });
                        router.push(`/resume/wizard?template=${customizedData.selectedTemplate}`);
                    }}
                />
            )}

            {showAIModal && (
                <AITemplateModal
                    onClose={() => setShowAIModal(false)}
                    onSuccess={(schema) => {
                        setShowAIModal(false);
                        setAiSchema(schema);
                        router.push(`/resume/wizard?template=ai-custom`);
                    }}
                />
            )}
        </div>
    )
}

function CustomizationModal({ template, onClose, onConfirm }: {
    template: any,
    onClose: () => void,
    onConfirm: (data: any) => void
}) {
    const defaultColor = template.color || '#437393'

    const [mockData, setMockData] = useState<any>({
        name: 'ANANYA',
        surname: 'SUPAKORN',
        jobTitle: 'PROCESS ENGINEER',
        address: 'Bangkok, Thailand',
        phone: '089-123-4567',
        email: 'ananya@example.com',
        nationality: 'Thai',
        birthDate: '1995-01-01',
        socialLink: 'linkedin.com/in/ananya',
        profileImage: '',
        experience: [
            { id: '1', position: 'Process Engineer', company: 'Tech Corp', location: '', startDate: '2020-01-01', endDate: '2024-01-01', description: 'Experienced engineer with a focus on process optimization and design.' },
            { id: '2', position: 'Junior Analyst', company: 'Data Inc', location: '', startDate: '2018-01-01', endDate: '2019-12-31', description: 'Analyzed production data and created daily reports.' }
        ],
        education: [
            { id: '1', degree: 'B.Eng', school: 'Chulalongkorn University', startDate: '2014-08-01', endDate: '2018-05-31', fieldOfStudy: 'Chemical Engineering' }
        ],
        skills: ['Process Optimization', 'Data Analysis', 'AutoCAD', 'Lean Six Sigma'],
        languages: [
            { id: '1', language: 'Thai', level: 'Native' },
            { id: '2', language: 'English', level: 'Fluent' }
        ],
        certifications: [],
        summary: 'Experienced engineer with a focus on process optimization and design. Proven track record in improving efficiency.',
        selectedTemplate: template.style,
        themeColor: defaultColor,
        experienceLevel: '',
        resumeLanguage: 'en',
        educationLevel: '',
        fontFamily: "'Prompt', sans-serif",
        fontSize: 'text-sm',
        lineHeight: 'leading-relaxed',
        headingStyle: 'uppercase'
    })

    const updateMockData = (key: string, value: string) => {
        setMockData((prev: any) => ({ ...prev, [key]: value }))
    }

    const { t } = require('@/lib/i18n')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Left Preview */}
                <div className="flex-1 bg-gray-100 p-8 flex flex-col items-center justify-center border-r border-gray-200 overflow-hidden relative">
                    <div className="absolute top-4 left-4 text-gray-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Live Preview
                    </div>
                    {/* Maintain A4 aspect ratio 210:297. Use CSS scale. */}
                    <div className="w-[794px] h-[1123px] bg-white shadow-lg origin-center" style={{ transform: 'scale(0.5)' }}>
                        <div className="w-full h-full pointer-events-none select-none">
                            <ResumePreview data={mockData} />
                        </div>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="w-full md:w-96 p-8 overflow-y-auto flex flex-col gap-8 bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">ปรับแต่งก่อนสร้าง</h2>
                        <p className="text-sm text-gray-500 mt-1">คุณสามารถปรับแต่งดีไซน์ให้เป็นตัวคุณมากที่สุด</p>
                    </div>

                    <div className="space-y-6">
                        {/* 1. Primary Color */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">สีหลัก (Primary Color)</label>
                            <div className="flex flex-wrap gap-3">
                                {['#437393', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444', '#10b981', '#3f3f46', '#000000'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => updateMockData('themeColor', color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${mockData.themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer relative hover:border-gray-400">
                                    <input type="color" className="absolute inset-[-10px] w-12 h-12 cursor-pointer opacity-0" value={mockData.themeColor} onChange={(e) => updateMockData('themeColor', e.target.value)} />
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* 2. Font Family */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">รูปแบบฟอนต์ (Font Family)</label>
                            <select
                                className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={mockData.fontFamily}
                                onChange={(e) => updateMockData('fontFamily', e.target.value)}
                            >
                                <option value="'Prompt', sans-serif">Prompt (Modern Thai)</option>
                                <option value="'Sarabun', sans-serif">Sarabun (Official Thai)</option>
                                <option value="'Inter', sans-serif">Inter (Clean English)</option>
                                <option value="'Times New Roman', serif">Times New Roman (Classic)</option>
                                <option value="'Poppins', sans-serif">Poppins (Playful)</option>
                                <option value="'Roboto Mono', monospace">Roboto Mono (Techy)</option>
                            </select>
                        </div>

                        {/* 3. Typography Size */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">ขนาดข้อความ (Font Size)</label>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {[
                                    { value: 'text-xs', label: 'เล็ก' },
                                    { value: 'text-sm', label: 'ปกติ' },
                                    { value: 'text-base', label: 'ใหญ่' }
                                ].map(size => (
                                    <button
                                        key={size.value}
                                        onClick={() => updateMockData('fontSize', size.value)}
                                        className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${mockData.fontSize === size.value ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Line Height */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">ระยะบรรทัด (Line Spacing)</label>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {[
                                    { value: 'leading-tight', label: 'ชิด' },
                                    { value: 'leading-relaxed', label: 'ปกติ' },
                                    { value: 'leading-loose', label: 'กว้าง' }
                                ].map(spacing => (
                                    <button
                                        key={spacing.value}
                                        onClick={() => updateMockData('lineHeight', spacing.value)}
                                        className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${mockData.lineHeight === spacing.value ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {spacing.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5. Heading Style */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">สไตล์หัวข้อ (Heading Style)</label>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {[
                                    { value: 'uppercase', label: 'ตัวพิมพ์ใหญ่ (UPPER)' },
                                    { value: 'normal-case', label: 'ปกติ (Normal)' }
                                ].map(style => (
                                    <button
                                        key={style.value}
                                        onClick={() => updateMockData('headingStyle', style.value)}
                                        className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${mockData.headingStyle === style.value ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 flex gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                            ยกเลิก
                        </button>
                        <button onClick={() => onConfirm(mockData)} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex justify-center items-center gap-2">
                            เริ่มสร้างเรซูเม่ <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AITemplateModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: (data: any) => void }) {
    const [career, setCareer] = useState('')
    const [companyType, setCompanyType] = useState('Corporate')
    const [tone, setTone] = useState('Professional')
    const [customPrompt, setCustomPrompt] = useState('')
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        if (!career) return alert('กรุณาระบุสายงาน หรือ ตำแหน่งที่คุณต้องการสมัคร')

        setLoading(true)
        try {
            const res = await fetch('http://localhost:8787/ai/generate-custom-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tone, career, companyType, language: 'th', customPrompt })
            })
            const data = await res.json()
            if (data.success && data.schema) {
                onSuccess(data.schema)
            } else {
                alert('เกิดข้อผิดพลาดในการดึงข้อมูลจาก AI ลองอีกครั้ง')
            }
        } catch (error) {
            console.error('AI match error:', error)
            alert('ไม่สามารถเชื่อมต่อ AI ได้ในขณะนี้')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 relative border border-gray-100">

                {/* Decorative background */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-t-3xl -z-10 blur-xl"></div>

                <div className="flex justify-between items-center mb-8 relative">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                            AI Template Match
                        </span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">สายงาน / อาชีพ (Career Field) <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={career}
                            onChange={e => setCareer(e.target.value)}
                            placeholder="เช่น Programmer, นักการตลาด, วิศวกร..."
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-300 shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทองค์กร (Company Type)</label>
                        <select
                            value={companyType}
                            onChange={e => setCompanyType(e.target.value)}
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-sm"
                        >
                            <option value="Startup">🚀 Startup / เอเจนซี่ (คล่องตัว, สมัยใหม่)</option>
                            <option value="Corporate">🏢 Corporate / บริษัทมหาชน (มั่นคง, เป็นทางการ)</option>
                            <option value="Government">🏛️ Government / ราชการ (อนุรักษ์นิยม, ระเบียบชัดเจน)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">โทนของออกแบบ (Tone & Style)</label>
                        <select
                            value={tone}
                            onChange={e => setTone(e.target.value)}
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-sm"
                        >
                            <option value="Minimal">🖋️ Minimal (เรียบง่าย, สะอาดตา)</option>
                            <option value="Professional">💼 Professional (น่าเชื่อถือ, ดูเป็นมืออาชีพ)</option>
                            <option value="Creative">🎨 Creative (โดดเด่น, มีดึงดูด)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">คำสั่งเพิ่มเติม (Optional)</label>
                        <textarea
                            value={customPrompt}
                            onChange={e => setCustomPrompt(e.target.value)}
                            placeholder="เช่น ขอโทนสีชมพูพาสเทล, จัดเรียงแบบ 2 คอลัมน์, เอาแบบดู Cyberpunk..."
                            rows={3}
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-3 group relative overflow-hidden"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 relative z-10">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                ⏳ ให้ AI ประมวลผล...
                            </span>
                        ) : (
                            <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
                                🚀 สร้างเทมเพลตเรซูเม่เลย
                            </span>
                        )}
                        {!loading && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        AI จะเลือก Layout, สี, ฟอนต์ และจัด Section ให้เหมาะสมแบบอัตโนมัติ
                    </p>
                </div>
            </div>
        </div>
    )
}
