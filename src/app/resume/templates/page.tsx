'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import MiniResumePreview from '@/components/MiniResumePreview'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

const FILTERS = {
    language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
    type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
    style: ['Modern', 'Professional', 'Creative', 'Simple'],
    color: ['Color', 'B&W'],
    level: ['Entry Level', 'Senior', 'Manager']
}

/* Real Template Configurations */
const TEMPLATES = [
    { id: 1, name: 'Modern Blue', style: 'modern', color: '#437393', tags: ['Modern', 'Entry Level'] },
    { id: 2, name: 'Classic Elegance', style: 'classic', color: '#333333', tags: ['Professional', 'Senior'] },
    { id: 3, name: 'Creative Teal', style: 'creative', color: '#2dd4bf', tags: ['Creative', 'Designer'] },
    { id: 4, name: 'Professional Gray', style: 'professional', color: '#94a3b8', tags: ['Professional', 'Manager'] },
    { id: 5, name: 'Modern Orange', style: 'modern', color: '#f97316', tags: ['Modern', 'Warm'] },
    { id: 6, name: 'Creative Purple', style: 'creative', color: '#a855f7', tags: ['Creative', 'Artist'] },
    { id: 7, name: 'Classic Minimal', style: 'classic', color: '#000000', tags: ['Simple', 'Clean'] },
    { id: 8, name: 'Professional Blue', style: 'professional', color: '#3b82f6', tags: ['Professional', 'Corporate'] },
] as const

export default function TemplateSelectionPage() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])
    const { user } = useAuthStore()
    const router = useRouter()

    // Auth Guard
    useEffect(() => {
        // Small delay to allow hydration
        const timer = setTimeout(() => {
            if (!user) {
                router.push('/login')
            }
        }, 100)
        return () => clearTimeout(timer)
    }, [user, router])

    const toggleFilter = (filter: string) => {
        setSelectedFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            {/* Header */}
            <header className="h-[60px] bg-[#9CC5DF] px-6 flex items-center shadow-sm sticky top-0 z-50">
                <Link href="/" className="text-2xl font-serif text-[#437393] font-bold">
                    SRG-TJS
                </Link>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#437393]">เทมเพลตที่ดีที่สุดสำหรับคุณ</h1>
                    <p className="text-gray-500 mt-2">เลือกรูปแบบที่ใช่ แล้วเริ่มต้นสร้างเรซูเม่ของคุณได้ทันที</p>
                </div>

                <div className="flex gap-8">
                    {/* Left Sidebar Filters */}
                    <aside className="w-64 flex-shrink-0 space-y-6 hidden lg:block">
                        {Object.entries(FILTERS).map(([category, options]) => (
                            <div key={category}>
                                <h3 className="font-bold text-[#437393] mb-3 capitalize text-sm">{category}</h3>
                                <div className="space-y-2">
                                    {options.map(option => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedFilters.includes(option) ? 'bg-[#437393] border-[#437393]' : 'border-gray-300 group-hover:border-[#437393]'}`}>
                                                {selectedFilters.includes(option) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedFilters.includes(option)}
                                                onChange={() => toggleFilter(option)}
                                            />
                                            <span className={`text-sm ${selectedFilters.includes(option) ? 'text-[#437393] font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {TEMPLATES.map((template) => (
                                <div key={template.id} className="group relative cursor-pointer">
                                    {/* Card Container */}
                                    <div className="aspect-[210/297] bg-white rounded-lg shadow-md border hover:shadow-xl transition-all overflow-hidden relative">

                                        {/* LIVE PREVIEW COMPONENT */}
                                        <div className={`w-full h-full transform transition-transform duration-300 group-hover:scale-105`}>
                                            <MiniResumePreview style={template.style} color={template.color} />
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-[#437393]/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                                            <Link href={`/resume/create?template=${template.id}`} className="bg-[#437393] text-white px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-[#345b75]">
                                                เลือกใช้นี้
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-sm font-bold text-[#437393]">{template.name}</p>
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {template.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
