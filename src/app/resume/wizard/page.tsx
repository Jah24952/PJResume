'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useResumeStore } from '@/store/resume.store'
import { ArrowLeft, ArrowRight, User, Briefcase, GraduationCap, CheckSquare, FileText, Plus, Trash2, Globe, Award, Upload, X, Zap, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { generateSummary, rewriteText } from '@/lib/ai'
import MonthYearPicker from '@/components/MonthYearPicker'
import { UNIVERSITIES, FACULTY_MAJOR_MAP, FACULTIES } from '@/lib/education'

// Wizard Steps Configuration


export default function ResumeWizardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">กำลังโหลด...</div>}>
            <ResumeWizardContent />
        </Suspense>
    )
}

function ResumeWizardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const { data, update, addItem, removeItem, updateItem, addHardSkill, removeHardSkill, addSoftSkill, removeSoftSkill } = useResumeStore()
    const queryTemplateId = searchParams.get('template')
    const templateId = (queryTemplateId && queryTemplateId !== 'undefined') ? queryTemplateId : data.selectedTemplate || 'modern'

    const [currentStep, setCurrentStep] = useState(1)
    const [newHardSkill, setNewHardSkill] = useState('')
    const [newSoftSkill, setNewSoftSkill] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    
    // AI Summary States
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
    const [isRewritingSummary, setIsRewritingSummary] = useState(false)
    const [summaryLanguage, setSummaryLanguage] = useState<'th' | 'en'>('th')
    const [summaryTone, setSummaryTone] = useState<'professional' | 'creative' | 'neutral'>('professional')
    const [summaryPrompt, setSummaryPrompt] = useState('')

    const validateContact = () => {
        const newErrors: Record<string, string> = {}
        if (!data.name?.trim()) newErrors.name = 'กรุณากรอกชื่อจริง'
        if (!data.surname?.trim()) newErrors.surname = 'กรุณากรอกนามสกุล'
        if (!data.jobTitle?.trim()) newErrors.jobTitle = 'กรุณากรอกตำแหน่งงานที่ต้องการ'

        if (!data.phone?.trim()) {
            newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
        } else if (!/^\d{10}$/.test(data.phone.replace(/-/g, '').trim())) {
            newErrors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักเท่านั้น'
        }

        if (!data.email?.trim()) {
            newErrors.email = 'กรุณากรอกอีเมล'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isFirstStep = currentStep === 1
    const isLastStep = currentStep === STEPS.length

    const nextStep = () => {
        if (currentStep === 1) {
            if (!validateContact()) return
        }

        if (isLastStep) {
            router.push('/resume/templates')
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
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-1 block">ชื่อจริง <span className="text-red-500">*</span></label>
                                <input className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all ${errors.name ? 'border-red-500' : ''}`} value={data.name || ''} onChange={e => { update('name', e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })) }} placeholder="ชื่อจริงของคุณ" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-1 block">นามสกุล <span className="text-red-500">*</span></label>
                                <input className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all ${errors.surname ? 'border-red-500' : ''}`} value={data.surname || ''} onChange={e => { update('surname', e.target.value); if (errors.surname) setErrors(prev => ({ ...prev, surname: '' })) }} placeholder="นามสกุลของคุณ" />
                                {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">อาชีพ / ตำแหน่งงานที่ต้องการสมัคร <span className="text-red-500">*</span></label>
                            <input className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all ${errors.jobTitle ? 'border-red-500' : ''}`} value={data.jobTitle || ''} onChange={e => { update('jobTitle', e.target.value); if (errors.jobTitle) setErrors(prev => ({ ...prev, jobTitle: '' })) }} placeholder="เช่น Marketing Manager, Software Engineer" />
                            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-1 block">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                                <input className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all ${errors.phone ? 'border-red-500' : ''}`} value={data.phone || ''} onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    update('phone', val);
                                    if (!val.trim()) setErrors(prev => ({ ...prev, phone: 'กรุณากรอกเบอร์โทรศัพท์' }));
                                    else if (val.length < 10) setErrors(prev => ({ ...prev, phone: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักเท่านั้น' }));
                                    else setErrors(prev => { const n = { ...prev }; delete n.phone; return n; });
                                }} placeholder="08xxxxxxxx" />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-1 block">อีเมล <span className="text-red-500">*</span></label>
                                <input className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all ${errors.email ? 'border-red-500' : ''}`} value={data.email || ''} onChange={e => {
                                    const val = e.target.value;
                                    update('email', val);
                                    if (!val.trim()) setErrors(prev => ({ ...prev, email: 'กรุณากรอกอีเมล' }));
                                    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) setErrors(prev => ({ ...prev, email: 'รูปแบบอีเมลไม่ถูกต้อง' }));
                                    else setErrors(prev => { const n = { ...prev }; delete n.email; return n; });
                                }} placeholder="email@example.com" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">ที่อยู่</label><input className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all" value={data.address || ''} onChange={e => update('address', e.target.value)} placeholder="ที่อยู่ปัจจุบัน" /></div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">ช่องทางการติดต่ออื่นๆ และ โซเชียลมีเดีย</label>
                                <button onClick={() => addItem('socialLinks', { id: crypto.randomUUID(), platform: 'LinkedIn', url: '' })} className="text-xs flex items-center gap-1 text-[#437393] hover:underline font-bold bg-blue-50 px-3 py-1.5 rounded-full"><Plus size={14} /> เพิ่มช่องทางติดต่อ</button>
                            </div>

                            {data.socialLinks?.length === 0 && (
                                <div className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed text-black">ยังไม่มีช่องทางการติดต่อเพิ่มเติม</div>
                            )}

                            {data.socialLinks?.map(social => (
                                <div key={social.id} className="flex gap-3 relative group items-start">
                                    <div className="w-1/3">
                                        <select className="w-full p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all text-sm text-black" value={social.platform} onChange={e => updateItem('socialLinks', social.id, { ...social, platform: e.target.value })}>
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="Portfolio">Portfolio</option>
                                            <option value="GitHub">GitHub</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="LINE ID">LINE ID</option>
                                            <option value="Behance">Behance</option>
                                            <option value="Dribbble">Dribbble</option>
                                            <option value="Other">อื่นๆ</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input className="w-full p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all text-sm text-black" value={social.url} onChange={e => updateItem('socialLinks', social.id, { ...social, url: e.target.value })} placeholder="ลิงก์ หรือ ไอดีติดต่อ (เช่น john.doe)" />
                                        <button onClick={() => removeItem('socialLinks', social.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            case 2: // Experience
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {data.experience.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">ยังไม่มีข้อมูลประสบการณ์ทำงาน โปรเจค หรือกิจกรรม</p>
                                <p className="text-slate-400 text-sm mb-4">กดปุ่มด้านล่างเพื่อเพิ่มประวัติ</p>
                            </div>
                        )}

                        {data.experience.map(exp => {
                            // Determine labels and fields based on type
                            const type = exp.type || 'work';
                            let posLabel = 'ตำแหน่ง';
                            let compLabel = 'บริษัท / องค์กร';
                            let descLabel = 'รายละเอียดความรับผิดชอบ';
                            let skillsLabel = 'ทักษะที่ใช้';
                            let showProjectUrl = false;
                            let showDepartment = false;

                            if (type === 'work') {
                                posLabel = 'ชื่อตำแหน่งงาน';
                                compLabel = 'ชื่อบริษัท / องค์กร';
                                descLabel = 'รายละเอียดงาน';
                            } else if (type === 'project') {
                                posLabel = 'ชื่อโปรเจค';
                                compLabel = 'วิชา / องค์กร / แหล่งที่มา';
                                descLabel = 'คำอธิบายโปรเจค และผลลัพธ์';
                                skillsLabel = 'เทคโนโลยี / เครื่องมือที่ใช้';
                                showProjectUrl = true;
                            } else if (type === 'internship') {
                                posLabel = 'ตำแหน่งฝึกงาน';
                                compLabel = 'บริษัท / องค์กร';
                                descLabel = 'สิ่งที่ได้รับจากการฝึกงาน';
                                skillsLabel = 'ทักษะที่ได้';
                                showDepartment = true;
                            } else if (type === 'activity') {
                                posLabel = 'บทบาท / ตำแหน่ง';
                                compLabel = 'ชื่อกิจกรรม / ชมรม';
                                descLabel = 'รายละเอียด หน้าที่ และสิ่งที่ได้รับ';
                            }

                            return (
                                <div key={exp.id} className="bg-white border p-6 rounded-xl shadow-sm relative group hover:border-[#437393] transition-colors">
                                    <div className="absolute top-4 right-12 bg-blue-50 text-[#437393] text-xs px-2 py-1 rounded border border-blue-100 font-semibold">
                                        {type === 'work' ? '💼 ประสบการณ์ทำงาน' : type === 'project' ? '🧑‍💻 โปรเจค' : type === 'internship' ? '🎓 ฝึกงาน' : '🤝 กิจกรรม / อาสา'}
                                    </div>
                                    <button onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                                        <div><label className="text-xs font-bold text-slate-500 mb-1 block">{posLabel}</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.position || ''} onChange={e => updateItem('experience', exp.id, { ...exp, position: e.target.value })} /></div>
                                        <div><label className="text-xs font-bold text-slate-500 mb-1 block">{compLabel}</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.company || ''} onChange={e => updateItem('experience', exp.id, { ...exp, company: e.target.value })} /></div>
                                    </div>

                                    {showDepartment && (
                                        <div className="mb-4">
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">แผนก</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.department || ''} onChange={e => updateItem('experience', exp.id, { ...exp, department: e.target.value })} />
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">{descLabel}</label>
                                        <textarea className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none h-24" value={exp.description || ''} onChange={e => updateItem('experience', exp.id, { ...exp, description: e.target.value })} placeholder={`อธิบาย${descLabel}`} />
                                    </div>

                                    {type !== 'activity' && (
                                        <div className="mb-4">
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">{skillsLabel}</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.skillsUsed || ''} onChange={e => updateItem('experience', exp.id, { ...exp, skillsUsed: e.target.value })} placeholder="เช่น React, Python, Microsoft Excel" />
                                        </div>
                                    )}

                                    {showProjectUrl && (
                                        <div className="mb-4">
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">ลิงก์ผลงาน (ถ้ามี)</label><input className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none" value={exp.projectUrl || ''} onChange={e => updateItem('experience', exp.id, { ...exp, projectUrl: e.target.value })} placeholder="https://github.com/..." />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <MonthYearPicker label="สิ้นสุด" value={exp.endDate || ''} onChange={val => updateItem('experience', exp.id, { ...exp, endDate: val })} />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                            <button onClick={() => addItem('experience', { id: crypto.randomUUID(), type: 'work', position: '', company: '', startDate: '', endDate: '', description: '', skillsUsed: '' })} className="py-3 border-2 border-dashed border-[#437393]/30 text-[#437393] font-bold rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-[#437393]/5 transition-colors text-sm">
                                <span className="text-lg">💼</span> ประสบการณ์ทำงาน
                            </button>
                            <button onClick={() => addItem('experience', { id: crypto.randomUUID(), type: 'project', position: '', company: '', startDate: '', endDate: '', description: '', skillsUsed: '', projectUrl: '' })} className="py-3 border-2 border-dashed border-[#437393]/30 text-[#437393] font-bold rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-[#437393]/5 transition-colors text-sm">
                                <span className="text-lg">🧑‍💻</span> โปรเจค / โครงงาน
                            </button>
                            <button onClick={() => addItem('experience', { id: crypto.randomUUID(), type: 'internship', position: '', company: '', startDate: '', endDate: '', description: '', skillsUsed: '', department: '' })} className="py-3 border-2 border-dashed border-[#437393]/30 text-[#437393] font-bold rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-[#437393]/5 transition-colors text-sm">
                                <span className="text-lg">🎓</span> ฝึกงาน (Intern)
                            </button>
                            <button onClick={() => addItem('experience', { id: crypto.randomUUID(), type: 'activity', position: '', company: '', startDate: '', endDate: '', description: '' })} className="py-3 border-2 border-dashed border-[#437393]/30 text-[#437393] font-bold rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-[#437393]/5 transition-colors text-sm">
                                <span className="text-lg">🤝</span> กิจกรรม / อาสา
                            </button>
                        </div>
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
                        {data.education.map(edu => {
                            // Helper to filter options
                            const matchUniversities = (search: string) => search ? UNIVERSITIES.filter(u => u.toLowerCase().includes(search.toLowerCase())) : UNIVERSITIES.slice(0, 10);
                            const currentFaculty = edu.faculty || '';
                            const availableMajors = FACULTY_MAJOR_MAP[currentFaculty] || [];

                            return (
                                <div key={edu.id} className="bg-white border p-6 rounded-xl shadow-sm relative group hover:border-[#437393] transition-colors overflow-visible">
                                    <button onClick={() => removeItem('education', edu.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors z-10"><Trash2 size={20} /></button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">วุฒิการศึกษา</label>
                                            <select
                                                className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none"
                                                value={edu.degree || ''}
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

                                        {/* University Input with Datalist alternative for combobox experience */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">สถาบันการศึกษา</label>
                                            <input
                                                className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none"
                                                value={edu.school || ''}
                                                onChange={e => updateItem('education', edu.id, { ...edu, school: e.target.value })}
                                                placeholder="พิมพ์เพื่อค้นหา หรือพิมพ์สถาบันใหม่..."
                                                list={`uni-list-${edu.id}`}
                                            />
                                            <datalist id={`uni-list-${edu.id}`}>
                                                {UNIVERSITIES.map(u => <option key={u} value={u} />)}
                                            </datalist>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">คณะ (Faculty)</label>
                                            <input
                                                className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none"
                                                value={edu.faculty || ''}
                                                onChange={e => updateItem('education', edu.id, { ...edu, faculty: e.target.value })}
                                                placeholder="เลือกคณะ หรือพิมพ์ใหม่..."
                                                list={`faculty-list-${edu.id}`}
                                            />
                                            <datalist id={`faculty-list-${edu.id}`}>
                                                {FACULTIES.map(f => <option key={f} value={f} />)}
                                            </datalist>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">สาขาวิชา (Major)</label>
                                            <input
                                                className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none"
                                                value={edu.major || ''}
                                                onChange={e => updateItem('education', edu.id, { ...edu, major: e.target.value })}
                                                placeholder={currentFaculty ? "เลือกสาขาวิชา หรือพิมพ์ใหม่..." : "กรุณาเลือกคณะก่อน หรือพิมพ์สาขาได้เลย"}
                                                list={`major-list-${edu.id}`}
                                            />
                                            <datalist id={`major-list-${edu.id}`}>
                                                {availableMajors.map(m => <option key={m} value={m} />)}
                                            </datalist>
                                        </div>
                                    </div>

                                    {/* GPA & Status Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">เกรดเฉลี่ย (GPA)</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#437393] outline-none"
                                                value={edu.gpa || ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    // Allow numeric and dot only, max 4.00 logic can be soft
                                                    if (/^[\d.]*$/.test(val) && val.length <= 4) {
                                                        updateItem('education', edu.id, { ...edu, gpa: val });
                                                    }
                                                }}
                                                placeholder="เช่น 3.45"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">สถานะการศึกษา</label>
                                            <div className="flex gap-2 bg-slate-50 p-1 rounded border">
                                                <button
                                                    className={`flex-1 text-sm py-1 rounded transition-colors ${edu.status === 'Studying' ? 'bg-[#437393] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                                                    onClick={() => updateItem('education', edu.id, { ...edu, status: 'Studying' })}
                                                >
                                                    กำลังศึกษา
                                                </button>
                                                <button
                                                    className={`flex-1 text-sm py-1 rounded transition-colors ${(!edu.status || edu.status === 'Graduated') ? 'bg-green-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                                                    onClick={() => updateItem('education', edu.id, { ...edu, status: 'Graduated' })}
                                                >
                                                    สำเร็จการศึกษา
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {edu.status !== 'Studying' && (
                                        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2 border-slate-100">
                                            <MonthYearPicker label="เริ่ม" value={edu.startDate || ''} onChange={val => updateItem('education', edu.id, { ...edu, startDate: val })} />
                                            <MonthYearPicker label="สิ้นสุด" value={edu.endDate || ''} onChange={val => updateItem('education', edu.id, { ...edu, endDate: val })} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <button onClick={() => addItem('education', { id: crypto.randomUUID(), degree: '', school: '', faculty: '', major: '', gpa: '', status: 'Graduated', startDate: '', endDate: '' })} className="w-full py-4 border-2 border-dashed border-[#437393]/30 text-[#437393] font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-[#437393]/5 transition-colors">
                            <Plus size={20} /> เพิ่มประวัติการศึกษา
                        </button>
                    </div>
                )
            case 4: // Skills
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                        {/* ภาคส่วน Hard Skills */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#437393] mb-4">Hard Skills (ทักษะเชิงเทคนิค / ความรู้เฉพาะทาง)</h3>
                            <div className="flex gap-2 flex-wrap mb-6 min-h-[40px]">
                                {data.hardSkills.map(skill => (
                                    <span key={skill} className="bg-blue-50 text-[#437393] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100 animate-in zoom-in duration-200">
                                        {skill} <button onClick={() => removeHardSkill(skill)} className="hover:text-red-500 bg-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                                    </span>
                                ))}
                                {data.hardSkills.length === 0 && <span className="text-slate-400 text-sm italic">ยังไม่มี Hard Skills (พิมพ์ด้านล่างเพื่อเพิ่ม)</span>}
                            </div>

                            <div className="flex gap-3">
                                <input
                                    className="flex-1 p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all text-sm"
                                    placeholder="พิมพ์ทักษะแล้วกด Enter หรือปุ่มเพิ่ม..."
                                    value={newHardSkill}
                                    onChange={e => setNewHardSkill(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (addHardSkill(newHardSkill), setNewHardSkill(''))}
                                />
                                <button onClick={() => { if (newHardSkill) { addHardSkill(newHardSkill); setNewHardSkill('') } }} className="bg-[#437393] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#365d75] transition-colors shadow-md">
                                    เพิ่ม
                                </button>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-slate-500 mb-2">Hard Skills ที่แนะนำ:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Python', 'SQL', 'Microsoft Excel', 'Data Analysis', 'Adobe Photoshop', 'Project Management'].map(s => (
                                        <button key={s} onClick={() => addHardSkill(s)} className="text-xs border border-slate-200 px-3 py-1.5 rounded-full hover:border-[#437393] hover:text-[#437393] transition-colors bg-white text-slate-600">
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ภาคส่วน Soft Skills */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#437393] mb-4">Soft Skills (ทักษะด้านพฤติกรรม / การทำงานร่วมกับผู้อื่น)</h3>
                            <div className="flex gap-2 flex-wrap mb-6 min-h-[40px]">
                                {data.softSkills.map(skill => (
                                    <span key={skill} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-emerald-100 animate-in zoom-in duration-200">
                                        {skill} <button onClick={() => removeSoftSkill(skill)} className="hover:text-red-500 bg-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                                    </span>
                                ))}
                                {data.softSkills.length === 0 && <span className="text-slate-400 text-sm italic">ยังไม่มี Soft Skills (พิมพ์ด้านล่างเพื่อเพิ่ม)</span>}
                            </div>

                            <div className="flex gap-3">
                                <input
                                    className="flex-1 p-3 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition-all text-sm"
                                    placeholder="พิมพ์ทักษะแล้วกด Enter หรือปุ่มเพิ่ม..."
                                    value={newSoftSkill}
                                    onChange={e => setNewSoftSkill(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (addSoftSkill(newSoftSkill), setNewSoftSkill(''))}
                                />
                                <button onClick={() => { if (newSoftSkill) { addSoftSkill(newSoftSkill); setNewSoftSkill('') } }} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-md">
                                    เพิ่ม
                                </button>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-slate-500 mb-2">Soft Skills ที่แนะนำ:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management', 'Adaptability'].map(s => (
                                        <button key={s} onClick={() => addSoftSkill(s)} className="text-xs border border-slate-200 px-3 py-1.5 rounded-full hover:border-emerald-600 hover:text-emerald-700 transition-colors bg-white text-slate-600">
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 5: // Summary
                const maxSummaryLength = 800;
                const currentLength = (data.summary || '').length;
                const isOverLimit = currentLength > maxSummaryLength;

                const handleGenerateSummary = async () => {
                    setIsGeneratingSummary(true);
                    try {
                        // Prepare data for AI
                        const expText = data.experience.map(e => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`).join(' | ');
                        const eduText = data.education.map(e => `${e.degree} in ${e.major} from ${e.school} (Current Status: ${e.status === 'Studying' ? 'Currently Studying / Not Graduated' : 'Graduated'})`).join(' | ');
                        const skillsText = [...data.hardSkills, ...data.softSkills].join(', ');
                        
                        const response = await generateSummary({
                            name: `${data.name} ${data.surname}`,
                            experience: expText || 'No experience provided',
                            education: eduText || 'No education provided',
                            skills: skillsText || 'No skills provided',
                            language: summaryLanguage,
                            tone: summaryTone,
                            prompt: summaryPrompt
                        });
                        
                        if (response.summary) {
                            update('summary', response.summary);
                        }
                    } catch (error) {
                        console.error('Failed to generate summary:', error);
                        alert('เกิดข้อผิดพลาดในการสร้างบทสรุป กรุณาลองใหม่อีกครั้ง');
                    } finally {
                        setIsGeneratingSummary(false);
                    }
                };

                const handleRewriteSummary = async (tone: 'professional' | 'creative' | 'neutral') => {
                    if (!data.summary) return;
                    setIsRewritingSummary(true);
                    try {
                        const response = await rewriteText({
                            text: data.summary,
                            language: summaryLanguage,
                            jobStyle: tone,
                            section: 'summary'
                        });
                        
                        if (response.rewritten) {
                            update('summary', response.rewritten);
                        }
                    } catch (error) {
                        console.error('Failed to rewrite summary:', error);
                        alert('เกิดข้อผิดพลาดในการปรับปรุงบทสรุป กรุณาลองใหม่อีกครั้ง');
                    } finally {
                        setIsRewritingSummary(false);
                    }
                };
                
                const SUMMARY_TEMPLATES = [
                    { label: 'เด็กจบใหม่', text: 'นักศึกษาจบใหม่ที่มีความกระตือรือร้นและพร้อมเรียนรู้สิ่งใหม่ๆ มีพื้นฐานทางวิชาการที่แข็งแกร่งและประสบการณ์จากการทำโปรเจค/ฝึกงาน มุ่งมั่นที่จะนำความรู้มาประยุกต์ใช้เพื่อสร้างคุณค่าให้กับองค์กร' },
                    { label: 'มีประสบการณ์', text: 'ผู้เชี่ยวชาญที่มีประสบการณ์การทำงานมากกว่า [X] ปีในสายงาน [ระบุสายงาน] มีประวัติความสำเร็จในการผลักดันให้เกิดผลลัพธ์เชิงบวกและพัฒนาประสิทธิภาพการทำงานอย่างต่อเนื่อง' },
                    { label: 'สายเทคนิค', text: 'นักพัฒนา/วิศวกรที่มีความเชี่ยวชาญในเทคโนโลยี [ระบุเครื่องมือ/ภาษา] มีประสบการณ์ในการออกแบบและพัฒนาระบบที่ซับซ้อนให้ใช้งานได้จริง พร้อมทักษะการแก้ปัญหาที่รวดเร็วและแม่นยำ' },
                    { label: 'สายธุรกิจ', text: 'นักบริหารวิสัยทัศน์ไกลที่มีความสามารถในการวิเคราะห์ข้อมูล วางแผนกลยุทธ์ และบริหารทีมงานเพื่อบรรลุเป้าหมายทางธุรกิจขององค์กร' },
                ];

                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Header Box */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500"><FileText size={24} /></div>
                                    <h3 className="font-bold text-[#437393] text-lg">บทสรุปเกี่ยวกับตัวคุณ</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">เขียนสรุปสั้นๆ 3-4 บรรทัด เพื่อดึงดูดความสนใจ HR เน้นประสบการณ์ ทักษะที่โดดเด่น และเป้าหมายอาชีพของคุณ</p>
                            </div>
                            
                            {/* Tips Box */}
                            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm w-full md:w-64 text-sm shrink-0">
                                <h4 className="font-bold text-[#437393] flex items-center gap-2 mb-2"><Sparkles size={16}/> Tips การเขียน</h4>
                                <ul className="text-slate-600 space-y-1.5 list-disc list-inside">
                                    <li>เขียนสั้นๆ กระชับ (3-4 บรรทัด)</li>
                                    <li>เน้นทักษะหรือผลงานเด่น</li>
                                    <li>ระบุเป้าหมายการทำงาน</li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* AI Tools Section */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <div className="mb-5 space-y-4">
                                <div className="flex gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">ภาษา (Language)</label>
                                        <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border inline-flex">
                                            <button onClick={() => setSummaryLanguage('th')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${summaryLanguage === 'th' ? 'bg-white text-[#437393] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>ไทย</button>
                                            <button onClick={() => setSummaryLanguage('en')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${summaryLanguage === 'en' ? 'bg-white text-[#437393] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>English</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">สไตล์ (Tone)</label>
                                        <select 
                                            value={summaryTone} 
                                            onChange={(e) => setSummaryTone(e.target.value as any)}
                                            className="p-1.5 text-sm border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-[#437393] text-slate-700"
                                        >
                                            <option value="professional">ทางการ / น่าเชื่อถือ</option>
                                            <option value="creative">สร้างสรรค์ / ทันสมัย</option>
                                            <option value="neutral">เรียบง่าย / กระชับ</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                                    <div className="flex-1 w-full relative">
                                        <label className="text-xs font-bold text-slate-500 mb-1 block flex items-center gap-1">
                                            บอกความต้องการเพิ่มเติม <span className="text-indigo-400 font-normal">(Prompt)</span>
                                        </label>
                                        <input 
                                            type="text"
                                            className="w-full p-2.5 text-sm border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 transition-all placeholder:text-slate-300"
                                            placeholder="เช่น อยากให้กระชับอ่านง่าย, เขียนในฉบับนักศึกษาจบใหม่..."
                                            value={summaryPrompt}
                                            onChange={(e) => setSummaryPrompt(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateSummary() }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleGenerateSummary}
                                        disabled={isGeneratingSummary}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center shrink-0"
                                    >
                                        {isGeneratingSummary ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                                        {isGeneratingSummary ? 'กำลังสร้างข้อความ...' : 'ให้ AI ช่วยเขียนจากประวัติ'}
                                    </button>
                                </div>
                            </div>

                            {/* Templates Quick Insert */}
                            <div className="mb-4">
                                <label className="text-xs font-bold text-slate-500 mb-2 block">รูปแบบข้อความสำเร็จรูป (Templates):</label>
                                <div className="flex flex-wrap gap-2">
                                    {SUMMARY_TEMPLATES.map((t, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => update('summary', t.text)}
                                            className="text-xs border border-slate-200 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full hover:border-[#437393] hover:text-[#437393] hover:bg-blue-50 transition-colors"
                                        >
                                            + {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Input Textarea */}
                            <div className="relative">
                                <textarea
                                    className={`w-full h-48 p-4 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 outline-none text-slate-700 leading-relaxed transition-all ${isOverLimit ? 'border-red-400 focus:ring-red-400' : 'focus:ring-[#437393]'}`}
                                    placeholder="พิมพ์บทสรุปของคุณที่นี่... หรือเลือกรูปแบบจากด้านบน หรือกดปุ่ม AI เพื่อสร้าง"
                                    value={data.summary || ''}
                                    onChange={e => update('summary', e.target.value)}
                                />
                                <div className={`absolute bottom-3 right-4 text-xs font-bold ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
                                    {currentLength} / {maxSummaryLength} {isOverLimit && <AlertCircle size={12} className="inline ml-1" />}
                                </div>
                            </div>

                            {/* AI Rewrite Actions */}
                            {data.summary && data.summary.trim() !== '' && (
                                <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
                                    <label className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-1"><Sparkles size={14} className="text-indigo-500"/> ให้ AI ปรับปรุงข้อความให้ดีขึ้น:</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => handleRewriteSummary('professional')}
                                            disabled={isRewritingSummary}
                                            className="text-xs font-medium bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isRewritingSummary ? <Loader2 size={12} className="animate-spin" /> : null}
                                            ปรับให้เป็นทางการ
                                        </button>
                                        <button 
                                            onClick={() => handleRewriteSummary('neutral')}
                                            disabled={isRewritingSummary}
                                            className="text-xs font-medium bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isRewritingSummary ? <Loader2 size={12} className="animate-spin" /> : null}
                                            ย่อให้กระชับ
                                        </button>
                                        <button 
                                            onClick={() => handleRewriteSummary('creative')}
                                            disabled={isRewritingSummary}
                                            className="text-xs font-medium bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isRewritingSummary ? <Loader2 size={12} className="animate-spin" /> : null}
                                            เพิ่มความน่าสนใจ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                    {isLastStep ? 'เลือกรูปแบบเทมเพลต' : 'ถัดไป'} {!isLastStep && <ArrowRight size={18} />}
                </button>
            </div>
        </div>
    )
}
