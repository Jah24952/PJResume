'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useResumeStore } from '@/store/resume.store'
import { ArrowLeft, ArrowRight, User, Briefcase, GraduationCap, CheckSquare, FileText, Plus, Trash2, Globe, Award, Upload, X } from 'lucide-react'
import Link from 'next/link'

// Wizard Steps Configuration
const STEPS = [
    { id: 1, key: 'contact', title: 'ข้อมูลส่วนตัว', icon: User, description: 'เริ่มต้นด้วยข้อมูลพื้นฐานของคุณ' },
    { id: 2, key: 'experience', title: 'ประสบการณ์', icon: Briefcase, description: 'งานที่คุณเคยทำหรือกำลังทำอยู่' },
    { id: 3, key: 'education', title: 'การศึกษา', icon: GraduationCap, description: 'วุฒิการศึกษาและสถาบัน' },
    { id: 4, key: 'skills', title: 'ทักษะ', icon: CheckSquare, description: 'ความสามารถพิเศษที่คุณมี' },
    { id: 5, key: 'summary', title: 'บทสรุป', icon: FileText, description: 'แนะนำตัวสั้นๆ และน่าสนใจ' },
]

export default function ResumeWizardPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const templateId = searchParams.get('template')

    const { data, update, addItem, removeItem, updateItem, addSkill, removeSkill } = useResumeStore()

    const [currentStep, setCurrentStep] = useState(1)
    const [newSkill, setNewSkill] = useState('')

    const isFirstStep = currentStep === 1
    const isLastStep = currentStep === STEPS.length

    const nextStep = () => {
        if (isLastStep) {
            router.push(`/resume/create?template=${templateId || '1'}`)
        } else {
            setCurrentStep(prev => prev + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const prevStep = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    // Helper to render current step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Contact
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Profile Image Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
                                    {data.profileImage ? (
                                        <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-slate-300" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-[#437393] text-white p-2 rounded-full cursor-pointer hover:bg-[#345b75] transition-colors shadow-sm">
                                    <Upload size={16} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const reader = new FileReader()
                                                reader.onloadend = () => {
                                                    update('profileImage', reader.result as string)
                                                }
                                                reader.readAsDataURL(file)
                                            }
                                        }}
                                    />
                                </label>
                                {data.profileImage && (
                                    <button
                                        onClick={() => update('profileImage', '')}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-sm font-bold text-slate-700 mb-1 block">ชื่อจริง</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.name} onChange={e => update('name', e.target.value)} placeholder="ชื่อจริงของคุณ" /></div>
                            <div><label className="text-sm font-bold text-slate-700 mb-1 block">นามสกุล</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.surname} onChange={e => update('surname', e.target.value)} placeholder="นามสกุลของคุณ" /></div>
                        </div>
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">อาชีพ / ตำแหน่งงานที่ต้องการสมัคร</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.jobTitle} onChange={e => update('jobTitle', e.target.value)} placeholder="เช่น Marketing Manager, Software Engineer" /></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-sm font-bold text-slate-700 mb-1 block">เบอร์โทรศัพท์</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="08x-xxx-xxxx" /></div>
                            <div><label className="text-sm font-bold text-slate-700 mb-1 block">อีเมล</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" /></div>
                        </div>
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">ที่อยู่</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.address} onChange={e => update('address', e.target.value)} placeholder="ที่อยู่ปัจจุบัน" /></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-sm font-bold text-slate-700 mb-1 block">LinkedIn / Portfolio URL</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.socialLink} onChange={e => update('socialLink', e.target.value)} placeholder="https://..." /></div>
                        </div>
                    </div>
                )
            case 2: // Experience
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {data.experience.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">ยังไม่มีข้อมูลประสบการณ์ทำงาน</p>
                                <p className="text-slate-400 text-sm mb-4">กดปุ่มด้านล่างเพื่อเพิ่มประวัติ</p>
                            </div>
                        )}

                        {data.experience.map(exp => (
                            <div key={exp.id} className="bg-white border p-6 rounded-xl shadow-sm relative group hover:border-[#437393] transition-colors">
                                <button onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">ตำแหน่ง</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.position} onChange={e => updateItem('experience', exp.id, { ...exp, position: e.target.value })} /></div>
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">บริษัท</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.company} onChange={e => updateItem('experience', exp.id, { ...exp, company: e.target.value })} /></div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">รายละเอียดความรับผิดชอบ</label>
                                    <textarea className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none h-24" value={exp.description} onChange={e => updateItem('experience', exp.id, { ...exp, description: e.target.value })} placeholder="อธิบายหน้าที่ความรับผิดชอบและผลงานของคุณ" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">เริ่ม</label><input type="date" className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.startDate} onChange={e => updateItem('experience', exp.id, { ...exp, startDate: e.target.value })} /></div>
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">สิ้นสุด</label><input type="date" className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.endDate} onChange={e => updateItem('experience', exp.id, { ...exp, endDate: e.target.value })} /></div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem('experience', { id: crypto.randomUUID(), position: '', company: '', startDate: '', endDate: '', description: '' })} className="w-full py-4 border-2 border-dashed border-[#437393]/30 text-[#437393] font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-[#437393]/5 transition-colors">
                            <Plus size={20} /> เพิ่มประสบการณ์ทำงาน
                        </button>
                    </div>
                )
            case 3: // Education
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {data.education.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">ยังไม่มีข้อมูลการศึกษา</p>
                                <p className="text-slate-400 text-sm mb-4">เพิ่มประวัติการศึกษาของคุณ</p>
                            </div>
                        )}
                        {data.education.map(edu => (
                            <div key={edu.id} className="bg-white border p-6 rounded-xl shadow-sm relative group hover:border-[#437393] transition-colors">
                                <button onClick={() => removeItem('education', edu.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">วุฒิการศึกษา</label>
                                        <select
                                            className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none"
                                            value={edu.degree}
                                            onChange={e => updateItem('education', edu.id, { ...edu, degree: e.target.value })}
                                        >
                                            <option value="">-- เลือกวุฒิการศึกษา --</option>
                                            <option value="ไม่มีวุฒิการศึกษา">ไม่มีวุฒิการศึกษา</option>
                                            <option value="ประถมศึกษา">ประถมศึกษา</option>
                                            <option value="มัธยมศึกษาตอนต้น (ม.3)">มัธยมศึกษาตอนต้น (ม.3)</option>
                                            <option value="มัธยมศึกษาตอนปลาย (ม.6 / ปวช.)">มัธยมศึกษาตอนปลาย (ม.6 / ปวช.)</option>
                                            <option value="ปวส. / อนุปริญญา">ปวส. / อนุปริญญา</option>
                                            <option value="ปริญญาตรี">ปริญญาตรี</option>
                                            <option value="ปริญญาโท">ปริญญาโท</option>
                                            <option value="ปริญญาเอก">ปริญญาเอก</option>
                                        </select>
                                    </div>
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">คณะ / สาขาวิชา</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={edu.fieldOfStudy || ''} onChange={e => updateItem('education', edu.id, { ...edu, fieldOfStudy: e.target.value })} placeholder="เช่น วิศวกรรมศาสตร์" /></div>
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">สถาบันการศึกษา</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={edu.school} onChange={e => updateItem('education', edu.id, { ...edu, school: e.target.value })} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">เริ่ม</label><input type="date" className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={edu.startDate} onChange={e => updateItem('education', edu.id, { ...edu, startDate: e.target.value })} /></div>
                                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">สิ้นสุด</label><input type="date" className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={edu.endDate} onChange={e => updateItem('education', edu.id, { ...edu, endDate: e.target.value })} /></div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem('education', { id: crypto.randomUUID(), degree: '', fieldOfStudy: '', school: '', startDate: '', endDate: '' })} className="w-full py-4 border-2 border-dashed border-[#437393]/30 text-[#437393] font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-[#437393]/5 transition-colors">
                            <Plus size={20} /> เพิ่มประวัติการศึกษา
                        </button>
                    </div>
                )
            case 4: // Skills
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-700 mb-4">รายการทักษะของคุณ</h3>
                            <div className="flex gap-2 flex-wrap mb-6 min-h-[40px]">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-blue-50 text-[#437393] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100 animate-in zoom-in duration-200">
                                        {skill} <button onClick={() => removeSkill(skill)} className="hover:text-red-500 bg-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                                    </span>
                                ))}
                                {data.skills.length === 0 && <span className="text-slate-400 text-sm italic">ยังไม่มีทักษะ (พิมพ์ด้านล่างเพื่อเพิ่ม)</span>}
                            </div>

                            <div className="flex gap-3">
                                <input
                                    className="flex-1 p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all"
                                    placeholder="พิมพ์ทักษะแล้วกด Enter หรือปุ่มเพิ่ม..."
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (addSkill(newSkill), setNewSkill(''))}
                                />
                                <button onClick={() => { if (newSkill) { addSkill(newSkill); setNewSkill('') } }} className="bg-[#437393] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#365d75] transition-colors shadow-md">
                                    เพิ่ม
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-sm font-bold text-slate-500 mb-3">ทักษะที่แนะนำ</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Microsoft Excel', 'Communication', 'Teamwork', 'English', 'Problem Solving', 'Leadership', 'Project Management'].map(s => (
                                    <button key={s} onClick={() => addSkill(s)} className="text-xs border border-slate-200 px-3 py-1.5 rounded-full hover:border-[#437393] hover:text-[#437393] transition-colors bg-white text-slate-600">
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 5: // Summary
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-2 rounded-full shadow-sm text-blue-500"><FileText size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-[#437393] text-lg">บทสรุปเกี่ยวกับตัวคุณ</h3>
                                    <p className="text-slate-600 text-sm mt-1">เขียนสรุปสั้นๆ ที่น่าสนใจเกี่ยวกับประสบการณ์และเป้าหมายของคุณ เพื่อดึงดูดความสนใจ HR (คุณสามารถใช้ AI ในหน้าถัดไปเพื่อช่วยเขียนได้)</p>
                                </div>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-48 p-4 border rounded-xl bg-white focus:ring-2 focus:ring-[#437393] outline-none text-slate-700 leading-relaxed shadow-sm"
                            placeholder="ตัวอย่าง: นักการตลาดดิจิทัลที่มีประสบการณ์ 3 ปี เชี่ยวชาญด้าน SEO และ Content Marketing..."
                            value={data.summary}
                            onChange={e => update('summary', e.target.value)}
                        />
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
            {/* Header */}
            <header className="h-[60px] bg-white border-b px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/resume/templates" className="text-slate-400 hover:text-[#437393] transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <span className="text-xl font-serif text-[#437393] font-bold">SRG-TJS Setup</span>
                </div>
                <div className="text-xs font-bold text-[#437393] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    ขั้นตอนที่ {currentStep} จาก {STEPS.length}
                </div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 pb-32 md:pb-40">
                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between mb-2 px-2">
                        {STEPS.map((step) => (
                            <div key={step.id} className={`flex flex-col items-center ${step.id <= currentStep ? 'opacity-100' : 'opacity-40'} transition-opacity duration-300`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors duration-300 ${step.id === currentStep ? 'bg-[#437393] text-white shadow-md scale-110' : step.id < currentStep ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {step.id < currentStep ? <CheckSquare size={14} /> : step.id}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 hidden md:block">{step.title}</span>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-[#437393] h-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{STEPS[currentStep - 1].title}</h1>
                    <p className="text-slate-500">{STEPS[currentStep - 1].description}</p>
                </div>

                {/* Dynamic Content */}
                {renderStepContent()}
            </main>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 md:px-12 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isFirstStep ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <ArrowLeft size={18} /> ย้อนกลับ
                </button>

                <button
                    onClick={nextStep}
                    className="px-8 py-3 rounded-lg bg-[#437393] text-white hover:bg-[#365d75] font-bold transition-transform active:scale-95 shadow-lg flex items-center gap-2"
                >
                    {isLastStep ? 'เสร็จสิ้น & ไปที่หน้าหลัก' : 'ถัดไป'} {!isLastStep && <ArrowRight size={18} />}
                </button>
            </div>
        </div>
    )
}
