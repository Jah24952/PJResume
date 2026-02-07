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

/* Real Template Configurations */
const TEMPLATES = [
    {
        id: 1,
        name: 'Modern Blue',
        style: 'modern',
        color: '#437393',
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Modern'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'อุตสาหกรรม / วิศวกรรม', 'ธุรกิจ / การจัดการ / องค์กร', 'การตลาด / การขาย / สื่อสาร']
        }
    },
    {
        id: 2,
        name: 'Classic Elegance',
        style: 'classic',
        color: '#333333',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional', 'Simple'],
            color: ['B&W'],
            level: ['Senior', 'Manager'],
            career: ['ธุรกิจ / การจัดการ / องค์กร', 'การเงิน / บัญชี / วิเคราะห์', 'ทรัพยากรบุคคล / องค์กร', 'ราชการ / รัฐวิสาหกิจ']
        }
    },
    {
        id: 3,
        name: 'Creative Teal',
        style: 'creative',
        color: '#2dd4bf',
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา'],
            style: ['Creative'],
            color: ['Color'],
            level: ['Entry Level'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'การตลาด / การขาย / สื่อสาร', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 4,
        name: 'Professional Gray',
        style: 'professional',
        color: '#94a3b8',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional'],
            color: ['B&W'],
            level: ['Manager', 'Senior'],
            career: ['ธุรกิจ / การจัดการ / องค์กร', 'การเงิน / บัญชี / วิเคราะห์', 'ราชการ / รัฐวิสาหกิจ', 'ทรัพยากรบุคคล / องค์กร']
        }
    },
    {
        id: 5,
        name: 'Modern Orange',
        style: 'modern',
        color: '#f97316',
        categories: {
            language: ['ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Entry Level'],
            career: ['การตลาด / การขาย / สื่อสาร', 'ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 6,
        name: 'Creative Purple',
        style: 'creative',
        color: '#a855f7',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Creative'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'การศึกษา / วิชาการ', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 7,
        name: 'Classic Minimal',
        style: 'classic',
        color: '#000000',
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Simple', 'Professional'],
            color: ['B&W'],
            level: ['Entry Level', 'Senior', 'Manager'],
            career: ['ราชการ / รัฐวิสาหกิจ', 'การศึกษา / วิชาการ', 'อุตสาหกรรม / วิศวกรรม', 'ทรัพยากรบุคคล / องค์กร']
        }
    },
    {
        id: 8,
        name: 'Professional Blue',
        style: 'professional',
        color: '#3b82f6',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional', 'Modern'],
            color: ['Color'],
            level: ['Senior', 'Manager'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'อุตสาหกรรม / วิศวกรรม', 'ธุรกิจ / การจัดการ / องค์กร', 'การเงิน / บัญชี / วิเคราะห์']
        }
    },
    /* --- NEW CAREER SPECIFIC TEMPLATES --- */
    {
        id: 9,
        name: 'Tech Lead',
        style: 'modern',
        color: '#334155', // Slate 700
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern'],
            color: ['B&W'],
            level: ['Senior', 'Manager'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 10,
        name: 'UX Designer',
        style: 'creative',
        color: '#ec4899', // Pink 500
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Creative'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 11,
        name: 'Marketing Pro',
        style: 'modern',
        color: '#ef4444', // Red 500
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Senior'],
            career: ['การตลาด / การขาย / สื่อสาร', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 12,
        name: 'Finance Analyst',
        style: 'professional',
        color: '#10b981', // Emerald 500
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Professional'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['การเงิน / บัญชี / วิเคราะห์', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 13,
        name: 'HR Manager',
        style: 'professional',
        color: '#7e22ce', // Purple 700
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional'],
            color: ['Color'],
            level: ['Manager'],
            career: ['ทรัพยากรบุคคล / องค์กร', 'ธุรกิจ / การจัดการ / องค์กร', 'ราชการ / รัฐวิสาหกิจ']
        }
    },
    {
        id: 14,
        name: 'Academic Scholar',
        style: 'classic',
        color: '#991b1b', // Red 800
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['คนมีประสบการณ์'],
            style: ['Simple', 'Professional'],
            color: ['Color'],
            level: ['Senior'],
            career: ['การศึกษา / วิชาการ', 'ราชการ / รัฐวิสาหกิจ']
        }
    },
    {
        id: 15,
        name: 'Industrial Engineer',
        style: 'modern',
        color: '#64748b', // Slate 500
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Modern'],
            color: ['B&W'],
            level: ['Entry Level', 'Senior'],
            career: ['อุตสาหกรรม / วิศวกรรม', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 16,
        name: 'Government Officer',
        style: 'classic',
        color: '#4b5563', // Gray 600
        categories: {
            language: ['ภาษาไทย'],
            type: ['คนมีประสบการณ์'],
            style: ['Simple', 'Professional'],
            color: ['B&W'],
            level: ['Senior', 'Manager'],
            career: ['ราชการ / รัฐวิสาหกิจ', 'ทรัพยากรบุคคล / องค์กร', 'การศึกษา / วิชาการ']
        }
    },
    {
        id: 17,
        name: 'Business Startup',
        style: 'modern',
        color: '#8b5cf6', // Violet 500
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Senior', 'Manager'],
            career: ['ธุรกิจ / การจัดการ / องค์กร', 'เทคโนโลยี / IT / ดิจิทัล', 'การตลาด / การขาย / สื่อสาร']
        }
    },

    /* --- USER CUSTOM REQUESTS --- */
    {
        id: 18,
        name: 'Wanida (Sales)',
        style: 'soft-block',
        color: '#fb923c', // Orange
        categories: {
            language: ['ภาษาไทย'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['การตลาด / การขาย / สื่อสาร', 'ธุรกิจ / การจัดการ / องค์กร', 'การบริการ / ท่องเที่ยว']
        }
    },
    {
        id: 19,
        name: 'Claudia (Creative)',
        style: 'creative-curve',
        color: '#a855f7', // Purple
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Creative', 'Modern'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'การตลาด / การขาย / สื่อสาร']
        }
    },
    {
        id: 20,
        name: 'Connor (Tech)',
        style: 'tech-dark',
        color: '#000000', // Black
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Modern', 'Professional'],
            color: ['B&W'],
            level: ['Senior', 'Manager', 'Entry Level'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'อุตสาหกรรม / วิศวกรรม']
        }
    },
    {
        id: 21,
        name: 'Olivia (Engineer)',
        style: 'modern-curve',
        color: '#f97316', // Orange Red
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern', 'Professional'],
            color: ['Color'],
            level: ['Senior', 'Manager'],
            career: ['อุตสาหกรรม / วิศวกรรม', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 22,
        name: 'Olivia (Healthcare)',
        style: 'professional-box',
        color: '#3b82f6', // Blue
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Professional', 'Simple'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['การแพทย์ / สุขภาพ', 'ราชการ / รัฐวิสาหกิจ', 'ทรัพยากรบุคคล / องค์กร']
        }
    },
] as const

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
            return selectedOptions.some(option => templateOptions.includes(option))
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
