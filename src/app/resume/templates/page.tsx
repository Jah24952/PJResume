'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import MiniResumePreview from '@/components/MiniResumePreview'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ResumePreview from '@/components/ResumePreview'
import { useResumeStore } from '@/store/resume.store'



import { TEMPLATES } from '../../../lib/constants'

export default function TemplateSelectionPage() {

    const [customizingTemplate, setCustomizingTemplate] = useState<any>(null)
    const [showAIModal, setShowAIModal] = useState(false)

    const { setTemplate, updateCustomization, setAiSchema } = useResumeStore()



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

                <div>
                    <main className="w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {TEMPLATES.map((template) => (
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
                            }
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
                        router.push(`/resume/create?template=${customizedData.selectedTemplate}`);
                    }}
                />
            )}

            {showAIModal && (
                <AITemplateModal
                    onClose={() => setShowAIModal(false)}
                    onSuccess={(schema) => {
                        setShowAIModal(false);
                        setAiSchema(schema);
                        router.push(`/resume/create?template=ai-custom`);
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
                <div className="flex-1 bg-gray-100 p-4 md:p-8 flex flex-col items-center justify-center lg:border-r border-gray-200 overflow-hidden relative min-h-[300px] md:min-h-auto">
                    <div className="absolute top-4 left-4 text-gray-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2 z-10">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Live Preview
                    </div>
                    {/* Maintain A4 aspect ratio 210:297. Use CSS scale responsive. */}
                    <div className="w-[794px] h-[1123px] bg-white shadow-lg origin-top md:origin-center scale-[0.35] sm:scale-[0.45] md:scale-50 lg:scale-[0.6] mt-10 md:mt-0">
                        <div className="w-[794px] h-[1123px] pointer-events-none select-none">
                            <ResumePreview data={mockData} />
                        </div>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="w-full md:w-96 p-6 md:p-8 overflow-y-auto flex flex-col gap-8 bg-white">
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
    const [selectedChips, setSelectedChips] = useState<string[]>([])
    const [extraText, setExtraText] = useState('')
    const [includeProfileImage, setIncludeProfileImage] = useState(true)
    const [loading, setLoading] = useState(false)

    const QUICK_CHIPS = [
        { emoji: '🎨', label: 'สีสดใส โดดเด่น' },
        { emoji: '🖋️', label: 'มินิมอล เรียบหรู' },
        { emoji: '💜', label: 'โทนสีม่วง' },
        { emoji: '💙', label: 'โทนสีน้ำเงิน' },
        { emoji: '🌸', label: 'สีชมพูพาสเทล' },
        { emoji: '⚫', label: 'สีเข้ม ดูน่าเชื่อถือ' },
        { emoji: '📊', label: '2 คอลัมน์ sidebar' },
        { emoji: '🤩', label: 'Creative สายดีไซน์' },
        { emoji: '💼', label: 'Professional สายธุรกิจ' },
        { emoji: '💻', label: 'Techy สาย IT' },
        { emoji: '🎓', label: 'นักศึกษา จบใหม่' },
        { emoji: '🏛️', label: 'ราชการ / การศึกษา' },
    ]

    const toggleChip = (label: string) => {
        setSelectedChips(prev =>
            prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
        )
    }

    // Count: each chip = 1 item, typed text = 1 item
    const itemCount = selectedChips.length + (extraText.trim() ? 1 : 0)
    const MIN_ITEMS = 2
    const canGenerate = itemCount >= MIN_ITEMS && !loading

    const { data: resumeData } = useResumeStore()

    const handleGenerate = async () => {
        if (itemCount < MIN_ITEMS) return

        // Combine chips + extra text into one description for the AI
        const parts = [...selectedChips]
        if (extraText.trim()) parts.push(extraText.trim())
        if (includeProfileImage) {
            parts.push('[REQ: MUST INCLUDE A PROFILE IMAGE PLACEHOLDER]')
        } else {
            parts.push('[REQ: DO NOT INCLUDE A PROFILE IMAGE PLACEHOLDER]')
        }
        const userDescription = parts.join(', ')

        setLoading(true)
        try {
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/ai/generate-custom-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userDescription,
                    language: 'th',
                    resumeData
                })
            })
            const data = await res.json()
            if (data.success && data.schema && Object.keys(data.schema).length > 0) {
                onSuccess(data.schema)
            } else if (data.isRateLimit) {
                alert('ขณะนี้เกินขีดจำกัดการใช้งาน AI ชั่วคราว กรุณารอประมาณ 1 นาทีแล้วกดสร้างใหม่อีกครั้ง')
            } else {
                alert('AI ไม่สามารถสร้างเทมเพลตได้ในขณะนี้ ลองเลือกสไตล์ใหม่แล้วลองอีกครั้ง')
            }
        } catch (error) {
            console.error('AI generate error:', error)
            alert('ไม่สามารถเชื่อมต่อ AI ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Gradient blobs */}
                <div className="absolute -top-12 -right-12 w-52 h-52 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

                <div className="p-8 pb-0 relative">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span>✨</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
                                    AI ออกแบบเรซูเม่ให้คุณ
                                </span>
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">เลือกอย่างน้อย 2 อย่าง เพื่อให้ AI ออกแบบได้ตรงกับคุณที่สุด</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ml-4">✕</button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-semibold text-gray-500">
                                {itemCount === 0 ? 'ยังไม่ได้เลือก' : `เลือกแล้ว ${itemCount} อย่าง`}
                            </span>
                            <span className={`text-xs font-bold ${itemCount >= MIN_ITEMS ? 'text-green-500' : 'text-orange-400'}`}>
                                {itemCount >= MIN_ITEMS ? '✓ พร้อมสร้างแล้ว!' : `ต้องการอีก ${MIN_ITEMS - itemCount} อย่าง`}
                            </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${itemCount >= MIN_ITEMS ? 'bg-green-400' : 'bg-purple-400'}`}
                                style={{ width: `${Math.min((itemCount / MIN_ITEMS) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Scrollable chip + text area */}
                <div className="overflow-y-auto px-8 pb-2 flex-1">
                    {/* Quick Chips */}
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">กดเลือกสไตล์ที่ชอบ (เลือกได้หลายอย่าง)</p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_CHIPS.map(chip => {
                                const active = selectedChips.includes(chip.label)
                                return (
                                    <button
                                        key={chip.label}
                                        onClick={() => toggleChip(chip.label)}
                                        className={`text-sm px-3 py-1.5 rounded-full border transition-all font-medium ${active
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200 scale-105'
                                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                            }`}
                                    >
                                        {chip.emoji} {chip.label}
                                        {active && <span className="ml-1 text-purple-200">✓</span>}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Extra free-text */}
                    <div className="relative mb-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            เพิ่มรายละเอียด (ไม่บังคับ แต่ช่วยให้ AI ออกแบบตรงกว่า)
                        </label>
                        <textarea
                            value={extraText}
                            onChange={e => setExtraText(e.target.value)}
                            placeholder="เช่น: สายงาน UX Designer, บริษัท Startup, ต้องการรูปภาพโปรไฟล์แบบวงกลม..."
                            rows={2}
                            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none text-gray-800 placeholder:text-gray-300 text-sm"
                        />
                    </div>
                </div>

                {/* Bottom actions — always visible */}
                <div className="px-8 pb-8 pt-4 relative">
                    {/* Image Toggle */}
                    <div className="relative mb-4 flex items-center justify-between bg-purple-50 p-4 border border-purple-100 rounded-2xl">
                        <div>
                            <label className="block text-sm font-bold text-purple-900">
                                ใส่รูปโปรไฟล์
                            </label>
                            <p className="text-xs text-purple-600 mt-0.5">ให้ AI เตรียมพื้นที่สำหรับรูปภาพของคุณ</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                checked={includeProfileImage}
                                onChange={() => setIncludeProfileImage(!includeProfileImage)}
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Warning message when under minimum */}
                    {itemCount > 0 && itemCount < MIN_ITEMS && (
                        <div className="mb-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
                            <span>⚠️</span>
                            <span>เลือกอย่างน้อย {MIN_ITEMS} อย่าง เพื่อให้ AI ออกแบบได้ดีและ ATS-friendly กว่านี้</span>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all flex justify-center items-center gap-3 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>AI กำลังออกแบบให้คุณ...</span>
                            </>
                        ) : (
                            <>✨ ให้ AI สร้างเรซูเม่ให้ฉัน</>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">AI จะเลือกสี, Layout, ฟอนต์ และจัดวาง Section ให้เหมาะกับที่คุณเลือก</p>
                </div>
            </div>
        </div>
    )
}

