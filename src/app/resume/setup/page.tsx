'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume.store'
import { ArrowLeft, Check, Briefcase, GraduationCap, Languages, FileText, User } from 'lucide-react'
import Link from 'next/link'

export default function SetupPage() {
    const router = useRouter()
    const { update } = useResumeStore()

    // Refs for auto-scrolling
    const languageRef = useRef<HTMLElement>(null)
    const educationRef = useRef<HTMLElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)

    const [selections, setSelections] = useState({
        experienceLevel: '',
        resumeLanguage: '',
        educationLevel: ''
    })

    const handleSelect = (key: string, value: string) => {
        setSelections(prev => ({ ...prev, [key]: value }))

        // Auto-scroll logic
        setTimeout(() => {
            if (key === 'experienceLevel') {
                languageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            } else if (key === 'resumeLanguage') {
                educationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            } else if (key === 'educationLevel') {
                // Scroll to bottom to show Next button clearly
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            }
        }, 300) // Small delay for better UX
    }

    const handleNext = () => {
        // Save to store
        update('experienceLevel', selections.experienceLevel)
        update('resumeLanguage', selections.resumeLanguage)
        update('educationLevel', selections.educationLevel)

        // Navigate to templates
        router.push('/resume/templates')
    }

    const isComplete = selections.experienceLevel && selections.resumeLanguage && selections.educationLevel

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
            {/* Header */}
            <header className="h-[60px] bg-white border-b px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/resume/select-mode" className="text-slate-400 hover:text-[#437393] transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <span className="text-xl font-serif text-[#437393] font-bold">SRG-TJS</span>
                </div>
                <div className="text-sm text-slate-500 font-medium">
                    ตั้งค่าเริ่มต้น
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 pb-40">

                {/* 1. Experience Level */}
                <section className="mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 scroll-mt-24">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-[#437393] mb-3">คุณทำงานมานานแค่ไหนแล้ว?</h2>
                        <p className="text-slate-500">เราจะค้นหาเทมเพลตที่ดีที่สุดสำหรับระดับประสบการณ์ของคุณ</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { id: 'Intern', label: 'นักศึกษาฝึกงาน', sub: 'กำลังหาที่ฝึกงาน', icon: FileText },
                            { id: 'Entry Level', label: 'นักศึกษาจบใหม่', sub: 'หางานแรกของคุณ', icon: GraduationCap },
                            { id: 'Experienced', label: 'ผู้หางาน', sub: 'มีประสบการณ์ทำงาน', icon: Briefcase },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect('experienceLevel', item.id)}
                                className={`p-8 rounded-2xl border-2 flex flex-col items-center text-center transition-all duration-300 group hover:-translate-y-1 ${selections.experienceLevel === item.id
                                    ? 'border-[#437393] bg-blue-50/50 shadow-md ring-2 ring-[#437393] ring-offset-2'
                                    : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'
                                    }`}
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${selections.experienceLevel === item.id ? 'bg-[#437393] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-[#437393]'
                                    }`}>
                                    <item.icon size={36} />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${selections.experienceLevel === item.id ? 'text-[#437393]' : 'text-slate-700'}`}>{item.label}</h3>
                                <p className="text-slate-500">{item.sub}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Resume Language */}
                <section ref={languageRef} className="mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 scroll-mt-24">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-[#437393] mb-3">คุณต้องการสร้างเรซูเม่ภาษาอะไร?</h2>
                    </div>
                    <div className="flex justify-center gap-8">
                        {[
                            { id: 'th', label: 'ภาษาไทย', sub: 'สร้างเรซูเม่ภาษาไทย' },
                            { id: 'en', label: 'English', sub: 'Create a resume in English' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect('resumeLanguage', item.id)}
                                className={`w-56 p-10 rounded-2xl border-2 flex flex-col items-center text-center transition-all duration-300 group hover:-translate-y-1 ${selections.resumeLanguage === item.id
                                    ? 'border-[#437393] bg-blue-50/50 shadow-md ring-2 ring-[#437393] ring-offset-2'
                                    : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'
                                    }`}
                            >
                                <div className={`w-16 h-20 mb-6 border-2 rounded-lg flex items-center justify-center shadow-sm relative overflow-hidden ${selections.resumeLanguage === item.id ? 'border-[#437393] bg-white' : 'border-slate-200 bg-slate-50'}`}>
                                    <div className="w-10 h-1 mt-2 bg-slate-200 rounded-sm absolute top-2"></div>
                                    <div className="w-8 h-1 mt-2 bg-slate-200 rounded-sm absolute top-4"></div>
                                    <div className="w-10 h-1 mt-2 bg-slate-200 rounded-sm absolute top-6"></div>
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${selections.resumeLanguage === item.id ? 'text-[#437393]' : 'text-slate-700'}`}>{item.label}</h3>
                                <p className="text-sm text-slate-500">{item.sub}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Education Level */}
                <section ref={educationRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 scroll-mt-24">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-[#437393] mb-3">ระดับการศึกษาของคุณที่ดีที่สุด</h2>
                        <p className="text-slate-500">ประวัติการศึกษาของคุณสามารถช่วยให้เราแนะนำคุณผ่านส่วนต่างๆ ที่เกี่ยวข้องในประวัติย่อของคุณได้</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            'มัธยมตอนต้น/ปลาย',
                            'ปวช. / ปวส. (อาชีวะ)',
                            'หลักสูตรระยะสั้น',
                            'ใบรับรอง / ประกาศนียบัตร',
                            'ปริญญาตรี',
                            'ปริญญาโท',
                            'ปริญญาเอก / JD'
                        ].map((label) => (
                            <button
                                key={label}
                                onClick={() => handleSelect('educationLevel', label)}
                                className={`p-5 rounded-2xl border-2 transition-all duration-200 font-bold text-base hover:shadow-md ${selections.educationLevel === label
                                    ? 'border-[#437393] bg-blue-50/50 text-[#437393] shadow-md ring-2 ring-[#437393] ring-offset-1'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:text-[#437393]'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

            </main>

            {/* Floating Bottom Bar */}
            <div ref={footerRef} className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-50 px-6 md:px-12 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link href="/resume/select-mode" className="px-6 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition-colors">
                    กลับ
                </Link>
                <button
                    onClick={handleNext}
                    disabled={!isComplete}
                    className="px-8 py-2 rounded-lg bg-[#437393] text-white hover:bg-[#365d75] font-bold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    ถัดไป
                </button>
            </div>
        </div>
    )
}
