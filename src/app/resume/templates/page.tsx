'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import MiniResumePreview from '@/components/MiniResumePreview'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

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
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#437393]">เทมเพลตที่ดีที่สุดสำหรับคุณ</h1>
                    <p className="text-gray-500 mt-2">เลือกรูปแบบที่ใช่ แล้วเริ่มต้นสร้างเรซูเม่ของคุณได้ทันที</p>
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
                                                <Link href={`/resume/wizard?template=${template.id}`} className="bg-[#437393] text-white px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-[#345b75]">
                                                    เลือกใช้นี้
                                                </Link>
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
        </div>
    )
}
