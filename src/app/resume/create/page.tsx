'use client'
import { generateSummary, rewriteText, translateText } from '@/lib/ai'
import { useResumeStore } from '@/store/resume.store'
import { useAuthStore } from '@/store/auth.store' // Add this
import { useRouter } from 'next/navigation' // Add this
import ResumePreview from '@/components/ResumePreview'
import { analyzeATS, saveResume, fetchResumeById } from '@/lib/api'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  User,
  Briefcase,
  GraduationCap,
  CheckSquare,
  Globe,
  FileText,
  Award,
  Download,
  FileDown,
  ChevronDown,
  Layout,
  Plus,
  Trash2,
  ArrowLeft,
  Upload,
  X
} from 'lucide-react'
import { TEMPLATES } from '../../../lib/constants'

// Define Section Types for Sidebar
type SectionType = 'contact' | 'experience' | 'education' | 'skills' | 'languages' | 'summary' | 'certifications'


export default function ResumeCreatePage() {
  const previewRef = useRef<HTMLDivElement>(null)

  // FIXED: Added setTemplate to destructuring
  const { data, update, addItem, removeItem, updateItem, addSkill, removeSkill, setTemplate, setResumeData } = useResumeStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const [activeSection, setActiveSection] = useState<SectionType>('contact')
  const [isSaving, setIsSaving] = useState(false)
  const [newSkill, setNewSkill] = useState('')


  // ATS State
  const [atsResult, setAtsResult] = useState<{
    score: number
    matchedKeywords: string[]
  } | null>(null)

  // AI Options
  const [jobStyle, setJobStyle] = useState('private')
  const [tone, setTone] = useState('professional')
  const [aiLanguage, setAiLanguage] = useState('en')



  const PREDEFINED_NATIONALITIES = ['Thai', 'American', 'British', 'Chinese', 'Japanese', 'Korean', 'German', 'French', 'Australian', 'Canadian', 'Indian', 'Singaporean', 'Malaysian', 'Indonesian', 'Filipino', 'Vietnamese', 'Myanmar', 'Laotian']
  const [showCustomNationality, setShowCustomNationality] = useState(false)

  // Initialize Template from URL
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  const resumeId = searchParams.get('id')
  const [loading, setLoading] = useState(false)

  // Initialize Template from URL

  // Auth & Prefill & Load Resume Effect
  useEffect(() => {
    const init = async () => {
      // 1. Auth Guard
      if (!user) {
        // router.push('/login')
        return
      }

      // 2. Load Existing Resume if ID present
      if (resumeId) {
        try {
          setLoading(true)
          const res = await fetchResumeById(resumeId)
          if (res.success && res.resume) {
            const r = res.resume
            // Map DB to Store
            const nameParts = r.resume_title ? r.resume_title.split(' ') : ['My', 'Resume'] // Fallback
            // We need user name actually

            const mappedData = {
              ...data,
              // Load saved contact info if available, otherwise keep current or fallback
              name: r.name || data.name, // Fallback to current state if null
              email: r.email || data.email,
              phone: r.phone || data.phone,
              address: r.address || data.address,
              linkedin: r.linkedin || data.socialLink, // Note: schema says linkedin, store says socialLink
              socialLink: r.linkedin || data.socialLink,

              summary: r.summary || '',
              experience: r.experience?.map((e: any) => ({
                id: e.exp_id || crypto.randomUUID(),
                position: e.position,
                company: e.company,
                startDate: e.start_date,
                endDate: e.end_date,
                description: e.responsibility
              })) || [],
              education: r.education?.map((e: any) => ({
                id: e.edu_id || crypto.randomUUID(),
                degree: e.degree,
                school: e.institute,
                startDate: e.start_year,
                endDate: e.end_year
              })) || [],
              skills: r.skills?.map((s: any) => s.skill_name) || [],
              selectedTemplate: 'modern',
              themeColor: '#437393'
            }

            setResumeData(mappedData)
          }
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
        return // Skip prefill if loading existing
      }

      // 3. New Resume: Prefill Data if empty
      if (!data.name && !data.email) {
        const nameParts = user.name ? user.name.split(' ') : ['']
        update('name', nameParts[0] || '')
        update('surname', nameParts.slice(1).join(' ') || '')
        update('email', user.email || '')
      }
    }
    init()
  }, [user, resumeId])

  useEffect(() => {
    if (templateId) {
      const t = TEMPLATES.find(t => t.id === Number(templateId))
      if (t) {
        setTemplate(t.style, t.color)
      }
    }
  }, [templateId])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Transform Data for Backend (POST /resume)
      const payload = {
        user_id: user?.id,
        resume_title: `Resume - ${new Date().toLocaleDateString('th-TH')}`,
        language: aiLanguage,
        name: data.name,
        surname: data.surname, // Ensure surname is sent if backend supports it or merge with name if not
        email: data.email,
        phone: data.phone,
        address: data.address,
        linkedin: data.socialLink,
        jobTitle: data.jobTitle, // Backend might not have this column in root, but keeping for now
        summary: data.summary,
        profileImage: data.profileImage, // Send base64 image

        // Map Experience
        experience: data.experience.map(exp => ({
          company: exp.company,
          position: exp.position,
          responsibility: exp.description, // Map description -> responsibility
          start_date: exp.startDate,      // Map startDate -> start_date
          end_date: exp.endDate           // Map endDate -> end_date
        })),

        // Map Education
        education: data.education.map(edu => ({
          institute: edu.school,          // Map school -> institute
          degree: edu.degree,
          major: edu.fieldOfStudy || '',  // Map fieldOfStudy -> major
          start_year: edu.startDate,      // Map startDate -> start_year
          end_year: edu.endDate           // Map endDate -> end_year
        })),

        // Map Skills
        skills: data.skills.map(skill => ({
          skill_name: skill,
          proficiency_level: 'Intermediate' // Default level
        }))
      }

      const res = await saveResume(payload)
      if (res.success) {
        alert('บันทึกข้อมูลเรียบร้อยแล้ว (Saved Successfully)')
      } else {
        throw new Error(res.error || 'Unknown error')
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก (Save Failed)')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const exportPDF = async () => {
    if (!previewRef.current) return
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = (canvas.height * pageWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
    pdf.save('resume.pdf')
  }

  const generateAISummary = async () => {
    const expStr = data.experience.map(e => `${e.position} at ${e.company}`).join(', ')
    const eduStr = data.education.map(e => `${e.degree} at ${e.school}`).join(', ')
    const skillStr = data.skills.join(', ')
    try {
      const result = await generateSummary({
        name: data.name,
        experience: expStr,
        education: eduStr,
        skills: skillStr,
        jobStyle,
        tone,
        language: aiLanguage
      })
      update('summary', result.summary)
    } catch (e) {
      console.error(e)
      alert('AI Summary Failed')
    }
  }

  const handleRewrite = async (id: string, text: string) => {
    if (!text) return
    try {
      const res = await rewriteText({ text, jobStyle, language: aiLanguage })
      if (res.rewritten) {
        // Find experience and update
        const exp = data.experience.find(e => e.id === id)
        if (exp) {
          updateItem('experience', id, { ...exp, description: res.rewritten })
        }
      }
    } catch (e) {
      console.error(e)
      alert('Rewrite Failed')
    }
  }

  const handleTranslate = async (text: string, onComplete: (val: string) => void) => {
    if (!text) return
    try {
      const res = await translateText({ text, targetLang: aiLanguage as 'th' | 'en' })
      if (res.translation) {
        onComplete(res.translation)
      }
    } catch (e) {
      console.error(e)
      alert('Translate Failed')
    }
  }

  const analyzeResume = async () => {
    const resumeText = `
      Name: ${data.name} ${data.surname}
      Experience: ${data.experience.map(e => e.position).join(' ')}
      Skills: ${data.skills.join(', ')}
    `
    const jobKeywords = data.skills
    const result = await analyzeATS({ resumeText, jobKeywords })
    setAtsResult(result)
  }

  // --- Add Item Handlers ---
  const handleAddExperience = () => {
    addItem('experience', {
      id: crypto.randomUUID(),
      position: '', company: '', location: '', startDate: '', endDate: '', description: ''
    })
  }

  const handleAddEducation = () => {
    addItem('education', {
      id: crypto.randomUUID(),
      degree: '', fieldOfStudy: '', school: '', startDate: '', endDate: ''
    })
  }

  const handleAddLanguage = () => {
    addItem('languages', {
      id: crypto.randomUUID(),
      language: '', level: 'Good'
    })
  }

  const handleAddCertification = () => {
    addItem('certifications', {
      id: crypto.randomUUID(),
      name: '', year: ''
    })
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim())
      setNewSkill('')
    }
  }

  // --- Sidebar Menu Items ---
  const menuItems: { id: SectionType; label: string; icon: any }[] = [
    { id: 'contact', label: 'ข้อมูลการติดต่อ', icon: User },
    { id: 'experience', label: 'ประสบการณ์', icon: Briefcase },
    { id: 'education', label: 'การศึกษา', icon: GraduationCap },
    { id: 'skills', label: 'ทักษะ', icon: CheckSquare },
    { id: 'languages', label: 'ภาษา', icon: Globe },
    { id: 'summary', label: 'สรุป', icon: FileText },
    { id: 'certifications', label: 'การรับรองและหลักสูตร', icon: Award },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="h-[60px] bg-[#9CC5DF] px-6 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[#437393] hover:text-[#2c4f6d] transition-colors" title="Back to Dashboard">
            <ArrowLeft size={24} />
          </Link>
          <Link href="/" className="text-2xl font-serif text-[#437393] font-bold">
            SRG-TJS
          </Link>
        </div>

        {data.selectedTemplate && (
          <div className="text-xs font-bold px-3 py-1 bg-white/50 rounded-full text-[#437393] uppercase tracking-wider hidden md:block">
            Current Template: {data.selectedTemplate}
          </div>
        )}

        {/* Download Bar */}
        <button
          onClick={exportPDF}
          className="bg-white/80 px-4 py-2 rounded-full flex items-center gap-2 text-[#437393] font-medium hover:bg-white transition-colors"
        >
          <FileDown size={18} className="text-red-500" /> ดาวน์โหลด PDF
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-[280px] bg-[#EAF6FF] border-r border-blue-100 flex flex-col overflow-y-auto">
          <div className="p-4">
            <div className="text-[#437393] font-bold mb-4 flex items-center gap-2">
              <Layout size={20} /> ส่วนต่างๆ
            </div>
            <div className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id
                    ? 'bg-[#9CC5DF] text-white shadow-sm'
                    : 'text-[#64748b] hover:bg-[#DCF1FF]/50'
                    }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color / Template Preview (Placeholder) */}
          <div className="mt-auto p-4 space-y-4">
            <Link href="/resume/templates" className="block w-full text-center py-2 border border-[#437393] text-[#437393] rounded hover:bg-blue-50 text-sm font-bold">
              เปลี่ยนเทมเพลต
            </Link>
          </div>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-2xl font-bold text-[#437393]">
                {menuItems.find(m => m.id === activeSection)?.label}
              </h1>
              <button onClick={handleSave} disabled={isSaving} className="text-[#437393] border border-[#437393] px-4 py-2 rounded hover:bg-blue-50 text-sm">
                {isSaving ? 'Saving...' : 'Save Data'}
              </button>
            </div>

            {/* FORM CONTENT */}

            {/* 1. Contact Info */}
            {activeSection === 'contact' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-[1fr_auto] gap-6">
                  <div className="space-y-4">
                    <div><label className="text-sm text-gray-500">ชื่อจริง</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.name} onChange={e => update('name', e.target.value)} placeholder="ชื่อ" /></div>
                    <div><label className="text-sm text-gray-500">นามสกุล</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.surname} onChange={e => update('surname', e.target.value)} placeholder="นามสกุล" /></div>
                  </div>

                  {/* Profile Image */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                      {data.profileImage ? (
                        <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-gray-300" />
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
                <div><label className="text-sm text-gray-500">อาชีพ</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.jobTitle} onChange={e => update('jobTitle', e.target.value)} placeholder="อาชีพของคุณ" /></div>
                <div><label className="text-sm text-gray-500">ที่อยู่</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.address} onChange={e => update('address', e.target.value)} placeholder="ที่อยู่" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-500">เบอร์โทรศัพท์</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="08x-xxx-xxxx" /></div>
                  <div><label className="text-sm text-gray-500">อีเมล</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">สัญชาติ</label>
                    <select
                      className="w-full p-3 border rounded-lg bg-gray-50 text-black appearance-none mb-2"
                      value={PREDEFINED_NATIONALITIES.includes(data.nationality) ? data.nationality : 'Other'}
                      onChange={e => {
                        const val = e.target.value
                        if (val === 'Other') {
                          setShowCustomNationality(true)
                          update('nationality', '')
                        } else {
                          setShowCustomNationality(false)
                          update('nationality', val)
                        }
                      }}
                    >
                      <option value="">-- เลือกสัญชาติ --</option>
                      <option value="Thai">Thai (ไทย)</option>
                      <option value="American">American (สหรัฐอเมริกา)</option>
                      <option value="British">British (สหราชอาณาจักร)</option>
                      <option value="Chinese">Chinese (จีน)</option>
                      <option value="Japanese">Japanese (ญี่ปุ่น)</option>
                      <option value="Korean">Korean (เกาหลีใต้)</option>
                      <option value="German">German (เยอรมนี)</option>
                      <option value="French">French (ฝรั่งเศส)</option>
                      <option value="Australian">Australian (ออสเตรเลีย)</option>
                      <option value="Canadian">Canadian (แคนาดา)</option>
                      <option value="Indian">Indian (อินเดีย)</option>
                      <option value="Singaporean">Singaporean (สิงคโปร์)</option>
                      <option value="Malaysian">Malaysian (มาเลเซีย)</option>
                      <option value="Indonesian">Indonesian (อินโดนีเซีย)</option>
                      <option value="Filipino">Filipino (ฟิลิปปินส์)</option>
                      <option value="Vietnamese">Vietnamese (เวียดนาม)</option>
                      <option value="Myanmar">Myanmar / Burmese (เมียนมา)</option>
                      <option value="Laotian">Laotian (ลาว)</option>
                      <option value="Other">Other (อื่นๆ - โปรดระบุ)</option>
                    </select>
                    {(showCustomNationality || (!PREDEFINED_NATIONALITIES.includes(data.nationality) && data.nationality !== '')) && (
                      <input
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#437393] outline-none transition-all placeholder-gray-400 text-black animate-in fade-in slide-in-from-top-1 duration-200 mt-2"
                        placeholder="ระบุสัญชาติของคุณ..."
                        value={data.nationality}
                        onChange={e => update('nationality', e.target.value)}
                        autoFocus
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">วันเกิด</label>
                    <input
                      type="date"
                      className="w-full p-3 border rounded-lg bg-gray-50 text-black"
                      value={data.birthDate}
                      onChange={e => update('birthDate', e.target.value)}
                    />
                  </div>
                </div>
                <div><label className="text-sm text-gray-500">ลิงค์โซเชียล</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.socialLink} onChange={e => update('socialLink', e.target.value)} placeholder="URL" /></div>
              </div>
            )}

            {/* 2. Experience */}
            {activeSection === 'experience' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {data.experience.map(exp => (
                  <div key={exp.id} className="bg-white border rounded-lg p-6 relative shadow-sm group">
                    <button onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div><label className="text-sm text-gray-500">ตำแหน่ง</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={exp.position} onChange={e => updateItem('experience', exp.id, { ...exp, position: e.target.value })} /></div>
                      <div><label className="text-sm text-gray-500">บริษัท</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={exp.company} onChange={e => updateItem('experience', exp.id, { ...exp, company: e.target.value })} /></div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-500 flex justify-between items-center mb-1">
                        รายละเอียด
                        <div className="flex gap-2">
                          <button onClick={() => handleRewrite(exp.id, exp.description)} className="text-xs text-[#437393] hover:underline flex items-center gap-1">✨ Rewrite</button>
                          <button onClick={() => handleTranslate(exp.description, (val) => updateItem('experience', exp.id, { ...exp, description: val }))} className="text-xs text-gray-500 hover:text-black flex items-center gap-1"><Globe size={12} /> Translate</button>
                        </div>
                      </label>
                      <textarea className="w-full p-2 border rounded bg-gray-50 h-24 text-black" value={exp.description} onChange={e => updateItem('experience', exp.id, { ...exp, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs text-gray-500 block mb-1">เริ่ม</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black text-sm" value={exp.startDate} onChange={e => updateItem('experience', exp.id, { ...exp, startDate: e.target.value })} /></div>
                      <div><label className="text-xs text-gray-500 block mb-1">สิ้นสุด</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black text-sm" value={exp.endDate} onChange={e => updateItem('experience', exp.id, { ...exp, endDate: e.target.value })} /></div>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddExperience} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">+ เพิ่มประสบการณ์</button>
              </div>
            )}

            {/* 3. Education */}
            {activeSection === 'education' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {data.education.map(edu => (
                  <div key={edu.id} className="bg-white border rounded-lg p-6 relative shadow-sm group">
                    <button onClick={() => removeItem('education', edu.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm text-gray-500">วุฒิการศึกษา</label>
                        <select
                          className="w-full p-2 border rounded bg-gray-50 text-black h-[42px]"
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
                      <div><label className="text-sm text-gray-500">คณะ / สาขาวิชา</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.fieldOfStudy || ''} onChange={e => updateItem('education', edu.id, { ...edu, fieldOfStudy: e.target.value })} placeholder="เช่น วิศวกรรมศาสตร์" /></div>
                      <div><label className="text-sm text-gray-500">สถานศึกษา</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.school} onChange={e => updateItem('education', edu.id, { ...edu, school: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm text-gray-500">เริ่ม</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.startDate} onChange={e => updateItem('education', edu.id, { ...edu, startDate: e.target.value })} /></div>
                      <div><label className="text-sm text-gray-500">สิ้นสุด</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.endDate} onChange={e => updateItem('education', edu.id, { ...edu, endDate: e.target.value })} /></div>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddEducation} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">+ เพิ่มการศึกษา</button>
              </div>
            )}

            {/* 4. Skills */}
            {activeSection === 'skills' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex gap-2 flex-wrap mb-4">
                    {data.skills.map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill} <button onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input className="flex-1 p-2 border rounded bg-gray-50 text-black" placeholder="เพิ่มทักษะ..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
                    <button onClick={handleAddSkill} className="bg-[#9CC5DF] text-white px-4 py-2 rounded">เพิ่ม</button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Languages (NEW) */}
            {activeSection === 'languages' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {data.languages.map(lang => (
                  <div key={lang.id} className="bg-white border rounded-lg p-4 flex gap-4 items-center relative group">
                    <button onClick={() => removeItem('languages', lang.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                    <div className="flex-1">
                      <label className="text-sm text-gray-500">ภาษา</label>
                      <input className="w-full p-2 border rounded bg-gray-50 text-black" value={lang.language} onChange={e => updateItem('languages', lang.id, { ...lang, language: e.target.value })} placeholder="English" />
                    </div>
                    <div className="w-1/3">
                      <label className="text-sm text-gray-500">ระดับ</label>
                      <select className="w-full p-2 border rounded bg-gray-50 text-black" value={lang.level} onChange={e => updateItem('languages', lang.id, { ...lang, level: e.target.value })}>
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Good">Good</option>
                        <option value="Basic">Basic</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddLanguage} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">+ เพิ่มภาษา</button>
              </div>
            )}

            {/* 6. Summary */}
            {activeSection === 'summary' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <h3 className="font-bold text-[#437393] mb-3 flex items-center gap-2">🤖 AI Generator Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#1e40af] block mb-1">Job Style</label>
                      <select className="w-full p-2 text-sm border border-blue-200 rounded text-[#1e3a8a] bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={jobStyle} onChange={e => setJobStyle(e.target.value)}>
                        <option value="private">Private Sector (เอกชน)</option>
                        <option value="government">Government (ราชการ)</option>
                        <option value="specific">Specialist (เฉพาะทาง)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1e40af] block mb-1">Tone</label>
                      <select className="w-full p-2 text-sm border border-blue-200 rounded text-[#1e3a8a] bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={tone} onChange={e => setTone(e.target.value)}>
                        <option value="professional">Professional (ทางการ)</option>
                        <option value="neutral">Neutral (ทั่วไป)</option>
                        <option value="creative">Creative (สร้างสรรค์)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1e40af] block mb-1">Language</label>
                      <select className="w-full p-2 text-sm border border-blue-200 rounded text-[#1e3a8a] bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={aiLanguage} onChange={e => setAiLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="th">Thai</option>
                      </select>
                    </div>
                  </div>
                </div>

                <textarea className="w-full h-64 p-4 border rounded-lg bg-gray-50 text-black" placeholder="เขียนสรุปเกี่ยวกับตัวคุณ..." value={data.summary} onChange={e => update('summary', e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={generateAISummary} className="flex-1 text-[#437393] border border-[#437393] px-4 py-2 rounded hover:bg-blue-50 flex justify-center gap-2 items-center font-medium">
                    ✨ Generate Summary
                  </button>
                  <button onClick={() => handleTranslate(data.summary, (val) => update('summary', val))} className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2">
                    <Globe size={18} /> Translate
                  </button>
                </div>
              </div>
            )}

            {/* 7. Certifications (NEW) */}
            {activeSection === 'certifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="bg-white border rounded-lg p-4 flex gap-4 items-center relative group">
                    <button onClick={() => removeItem('certifications', cert.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                    <div className="flex-1">
                      <label className="text-sm text-gray-500">ชื่อใบรับรอง / หลักสูตร</label>
                      <input className="w-full p-2 border rounded bg-gray-50 text-black" value={cert.name} onChange={e => updateItem('certifications', cert.id, { ...cert, name: e.target.value })} />
                    </div>
                    <div className="w-1/3">
                      <label className="text-sm text-gray-500">ปีที่ได้รับ</label>
                      <input className="w-full p-2 border rounded bg-gray-50 text-black" value={cert.year} onChange={e => updateItem('certifications', cert.id, { ...cert, year: e.target.value })} placeholder="YYYY" />
                    </div>
                  </div>
                ))}
                <button onClick={handleAddCertification} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">+ เพิ่มการรับรอง</button>
              </div>
            )}

          </div>
        </main>

        {/* Right Preview Area */}
        <div className="w-[800px] bg-gray-100 p-8 overflow-y-auto flex justify-center shadow-inner">
          <div className="bg-white shadow-xl min-h-[1123px] w-[794px] origin-top scale-90">
            <ResumePreview ref={previewRef} />
          </div>
        </div>

      </div>
    </div>
  )
}
