'use client'
import { generateSummary, rewriteText, translateText } from '@/lib/ai'
import { useResumeStore } from '@/store/resume.store'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import ResumePreview from '@/components/ResumePreview'
import { t } from '@/lib/i18n'
import { analyzeATS, saveResume, fetchResumeById } from '@/lib/api'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, Suspense } from 'react'
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
type SectionType = 'contact' | 'experience' | 'education' | 'skills' | 'languages' | 'summary' | 'certifications' | 'portfolio'


export default function ResumeCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeCreateContent />
    </Suspense>
  )
}

function ResumeCreateContent() {
  const previewRef = useRef<HTMLDivElement>(null)

  // FIXED: Added setTemplate to destructuring
  const { data, update, addItem, removeItem, updateItem, addSkill, removeSkill, setTemplate, setResumeData } = useResumeStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const [activeSection, setActiveSection] = useState<SectionType>('contact')
  const [isSaving, setIsSaving] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false) // New state for modal
  const [newSkill, setNewSkill] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

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

            // Helper for parsing arrays from DB safely
            const safeParseArray = (jsonString: any) => {
              if (!jsonString) return []
              try {
                return JSON.parse(jsonString)
              } catch (e) {
                console.error('Failed to parse array:', jsonString)
                return []
              }
            }

            const parseSocialLinks = (portfolioUrl: any, linkedinUrl: any) => {
              let links = []
              if (portfolioUrl) {
                try {
                  const parsed = JSON.parse(portfolioUrl)
                  if (Array.isArray(parsed)) return parsed
                } catch (e) {
                  links.push({ id: crypto.randomUUID(), platform: 'Portfolio', url: portfolioUrl })
                }
              }
              if (linkedinUrl && links.length === 0) {
                links.push({ id: crypto.randomUUID(), platform: 'LinkedIn', url: linkedinUrl })
              }
              return links
            }

            const mappedData = {
              ...data,
              // Load saved contact info if available, otherwise keep current or fallback
              name: r.name || data.name, // Fallback to current state if null
              email: r.email || data.email,
              phone: r.phone || data.phone,
              address: r.address || data.address,
              linkedin: r.linkedin,
              socialLinks: parseSocialLinks(r.portfolio_url, r.linkedin),

              summary: r.summary || '',
              experience: r.experience?.map((e: any) => ({
                id: e.exp_id || crypto.randomUUID(),
                position: e.position,
                company: e.company,
                startDate: e.start_date,
                endDate: e.end_date,
                description: e.responsibility,
                type: e.type || 'work',
                skillsUsed: e.skills_used || '',
                projectUrl: e.project_url || '',
                department: e.department || ''
              })) || [],
              education: r.education?.map((e: any) => ({
                id: e.edu_id || crypto.randomUUID(),
                degree: e.degree,
                school: e.institute,
                startDate: e.start_year,
                endDate: e.end_year,
                faculty: e.faculty || '',
                major: e.major || '',
                gpa: e.gpa || '',
                status: e.status || 'Graduated'
              })) || [],
              skills: r.skills?.map((s: any) => s.skill_name) || [],
              hardSkills: safeParseArray(r.hard_skills),
              softSkills: safeParseArray(r.soft_skills),
              portfolioUrl: r.portfolio_url || '',
              // Fix Template Loading
              selectedTemplate: r.selected_template_id === 99 ? 'ai-custom' : TEMPLATES.find(t => t.id === r.selected_template_id)?.style || 'modern',
              themeColor: r.ai_theme_color || (r.selected_template_id === 99 ? undefined : TEMPLATES.find(t => t.id === r.selected_template_id)?.color) || '#437393',
              fontFamily: r.ai_font_family || 'Inter',
              resumeTitle: r.resume_title || '',
              aiTemplateSchema: r.ai_template_html ? { html: r.ai_template_html } : undefined
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
      // Skip lookup for ai-custom — schema is already stored via setAiSchema
      if (templateId === 'ai-custom') return
      const t = TEMPLATES.find(t => t.id === Number(templateId))
      if (t) {
        setTemplate(t.style, t.color)
      }
    }
  }, [templateId])

  const handleSave = async () => {
    try {
      const newErrors: Record<string, string> = {}
      if (!data.name?.trim()) newErrors.name = 'กรุณากรอกชื่อจริง'
      if (!data.surname?.trim()) newErrors.surname = 'กรุณากรอกนามสกุล'
      if (!data.jobTitle?.trim()) newErrors.jobTitle = 'กรุณากรอกตำแหน่งงาน'

      if (!data.phone?.trim()) {
        newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
      } else if (!/^\d{10}$/.test(data.phone.replace(/-/g, '').trim())) {
        newErrors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
      }

      if (!data.email?.trim()) {
        newErrors.email = 'กรุณากรอกอีเมล'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setIsSaveModalOpen(false)
        setActiveSection('contact')
        alert('กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วนและถูกต้องในหัวข้อข้อมูลส่วนตัว')
        return
      }
      setErrors({})

      setIsSaving(true)

      // Transform Data for Backend (POST /resume)
      const payload = {
        user_id: user?.id,
        // Add selected_template_id
        selected_template_id: data.selectedTemplate === 'ai-custom'
          ? 99
          : TEMPLATES.find(t => t.style === data.selectedTemplate && t.color === data.themeColor)?.id || 1,
        resume_title: data.resumeTitle || `Resume - ${new Date().toLocaleDateString('th-TH')}`,
        language: aiLanguage,
        name: data.name,
        surname: data.surname, // Ensure surname is sent if backend supports it or merge with name if not
        email: data.email,
        phone: data.phone,
        address: data.address,
        linkedin: data.socialLinks?.find(s => s.platform === 'LinkedIn')?.url || '',
        jobTitle: data.jobTitle, // Backend might not have this column in root, but keeping for now
        summary: data.summary,
        profileImage: data.profileImage, // Send base64 image
        ai_template_html: data.aiTemplateSchema?.html || null,
        ai_theme_color: data.themeColor || null,
        ai_font_family: data.fontFamily || null,

        // Map Experience
        experience: data.experience.map(exp => ({
          company: exp.company,
          position: exp.position,
          responsibility: exp.description, // Map description -> responsibility
          start_date: exp.startDate,      // Map startDate -> start_date
          end_date: exp.endDate,          // Map endDate -> end_date
          type: exp.type || 'work',
          skills_used: exp.skillsUsed || null,
          project_url: exp.projectUrl || null,
          department: exp.department || null
        })),

        // Map Education
        education: data.education.map(edu => ({
          institute: edu.school,          // Map school -> institute
          degree: edu.degree,
          faculty: edu.faculty || '',     // New mapping
          major: edu.major || '',         // New mapping
          gpa: edu.gpa || null,           // New mapping
          status: edu.status || 'Graduated', // New mapping
          start_year: edu.startDate,      // Map startDate -> start_year
          end_year: edu.endDate           // Map endDate -> end_year
        })),

        // Map Skills
        skills: data.skills.map(skill => ({
          skill_name: skill,
          proficiency_level: 'Intermediate' // Default level
        })),

        // New Dynamic Fields
        portfolio_url: JSON.stringify(data.socialLinks || []),
        hard_skills: data.hardSkills || [],
        soft_skills: data.softSkills || []
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
      setIsSaveModalOpen(false) // Close modal after save finishes
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
    try {
      const payload = {
        name: `${data.name} ${data.surname}`,
        experience: data.experience.map(e => `${e.position} at ${e.company}`).join(', '),
        education: data.education.map(e => `${e.degree} from ${e.school}`).join(', '),
        skills: data.skills.join(', '),
        jobStyle,
        tone,
        language: aiLanguage,
        experienceLevel: data.experienceLevel
      }
      const res = await generateSummary(payload)
      update('summary', res.summary)
    } catch (e) {
      console.error(e)
      alert('AI Summary Failed')
    }
  }

  const handleRewrite = async (id: string, text: string) => {
    if (!text) return
    try {
      const res = await rewriteText({
        text,
        language: data.resumeLanguage,
        jobStyle,
        experienceLevel: data.experienceLevel
      })
      if (res.rewritten) {
        updateItem('experience', id, { ...data.experience.find(e => e.id === id), description: res.rewritten })
      }
    } catch (e) {
      console.error(e)
      alert(t('action.rewrite', data.resumeLanguage as 'en' | 'th') + ' Failed')
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

  // --- Sidebar Menu Items (Dynamic based on Experience Level) ---
  const getMenuItems = (): { id: SectionType; label: string; icon: any }[] => {
    const isThai = data.resumeLanguage === 'th'
    const baseContact = { id: 'contact' as SectionType, label: t('section.contact', data.resumeLanguage as 'en' | 'th'), icon: User }
    const baseEducation = { id: 'education' as SectionType, label: t('section.education', data.resumeLanguage as 'en' | 'th'), icon: GraduationCap }
    const baseSkills = { id: 'skills' as SectionType, label: isThai ? 'ทักษะความสามารถ' : 'Skills', icon: CheckSquare }
    const basePortfolio = { id: 'portfolio' as SectionType, label: isThai ? 'แฟ้มสะสมผลงาน (Portfolio)' : 'Portfolio', icon: Globe }
    const baseSummary = { id: 'summary' as SectionType, label: t('section.summary', data.resumeLanguage as 'en' | 'th'), icon: FileText }
    const baseCertifications = { id: 'certifications' as SectionType, label: t('section.certifications', data.resumeLanguage as 'en' | 'th'), icon: Award }
    const baseLanguages = { id: 'languages' as SectionType, label: t('section.languages', data.resumeLanguage as 'en' | 'th'), icon: Globe }

    if (data.experienceLevel === 'Intern') {
      return [
        baseContact,
        baseEducation,
        { id: 'experience' as SectionType, label: isThai ? 'โปรเจคที่ทำ / กิจกรรม' : 'Projects & Activities', icon: Briefcase },
        baseSkills,
        basePortfolio,
        baseLanguages
      ]
    } else if (data.experienceLevel === 'Entry Level') {
      return [
        baseContact,
        baseEducation,
        { id: 'experience' as SectionType, label: isThai ? 'ประสบการณ์ฝึกงาน / โปรเจค' : 'Internships & Projects', icon: Briefcase },
        baseSkills,
        basePortfolio,
        baseCertifications,
        baseLanguages
      ]
    } else {
      // Experienced
      return [
        baseContact,
        baseSummary,
        { id: 'experience' as SectionType, label: isThai ? 'ประสบการณ์ทำงาน / ผลงาน' : 'Work Experience', icon: Briefcase },
        baseSkills,
        baseCertifications,
        baseLanguages,
        baseEducation // Moved Education to the bottom for experienced pros
      ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="h-[60px] bg-[#9CC5DF] px-6 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[#437393] hover:text-[#2c4f6d] transition-colors" title={t('nav.back.dashboard', data.resumeLanguage as 'en' | 'th')}>
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

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex bg-white/50 rounded-lg p-1">
            <button
              onClick={() => useResumeStore.getState().setLanguage('th')}
              className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${data.resumeLanguage === 'th' ? 'bg-[#437393] text-white shadow' : 'text-[#437393] hover:bg-white/70'}`}
            >
              TH
            </button>
            <button
              onClick={() => useResumeStore.getState().setLanguage('en')}
              className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${data.resumeLanguage === 'en' ? 'bg-[#437393] text-white shadow' : 'text-[#437393] hover:bg-white/70'}`}
            >
              EN
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/resume/templates"
              className="bg-[#437393] px-5 py-2 rounded-full flex items-center gap-2 text-white font-bold hover:bg-[#2c4f6d] transition-colors shadow-md"
            >
              <Layout size={18} /> เลือกเทมเพลต (Select Template)
            </Link>

            <button
              onClick={exportPDF}
              className="bg-white px-4 py-2 rounded-full flex items-center gap-2 text-[#437393] font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FileDown size={18} className="text-red-500" /> {t('nav.download.pdf', data.resumeLanguage as 'en' | 'th')}
            </button>
          </div>
        </div>
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
              {t('nav.change.template', data.resumeLanguage as 'en' | 'th')}
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
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSaveModalOpen(true)} disabled={isSaving} className="text-[#437393] border border-[#437393] px-4 py-2 rounded hover:bg-blue-50 text-sm">
                  {isSaving ? t('nav.saving', data.resumeLanguage as 'en' | 'th') : t('nav.save', data.resumeLanguage as 'en' | 'th')}
                </button>
              </div>
            </div>

            {/* FORM CONTENT */}

            {/* 1. Contact Info */}
            {activeSection === 'contact' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-[1fr_auto] gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">{t('field.firstName', data.resumeLanguage as 'en' | 'th')} <span className="text-red-500">*</span></label>
                      <input className={`w-full p-3 border rounded-lg bg-gray-50 text-black ${errors.name ? 'border-red-500' : ''}`} value={data.name} onChange={e => { update('name', e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })) }} placeholder={t('field.firstName', data.resumeLanguage as 'en' | 'th')} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">{t('field.lastName', data.resumeLanguage as 'en' | 'th')} <span className="text-red-500">*</span></label>
                      <input className={`w-full p-3 border rounded-lg bg-gray-50 text-black ${errors.surname ? 'border-red-500' : ''}`} value={data.surname} onChange={e => { update('surname', e.target.value); if (errors.surname) setErrors(prev => ({ ...prev, surname: '' })) }} placeholder={t('field.lastName', data.resumeLanguage as 'en' | 'th')} />
                      {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                    </div>
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
                <div>
                  <label className="text-sm text-gray-500">{t('field.jobTitle', data.resumeLanguage as 'en' | 'th')} <span className="text-red-500">*</span></label>
                  <input className={`w-full p-3 border rounded-lg bg-gray-50 text-black ${errors.jobTitle ? 'border-red-500' : ''}`} value={data.jobTitle} onChange={e => { update('jobTitle', e.target.value); if (errors.jobTitle) setErrors(prev => ({ ...prev, jobTitle: '' })) }} />
                  {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                </div>
                <div><label className="text-sm text-gray-500">{t('field.address', data.resumeLanguage as 'en' | 'th')}</label><input className="w-full p-3 border rounded-lg bg-gray-50 text-black" value={data.address} onChange={e => update('address', e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">{t('field.phone', data.resumeLanguage as 'en' | 'th')} <span className="text-red-500">*</span></label>
                    <input className={`w-full p-3 border rounded-lg bg-gray-50 text-black ${errors.phone ? 'border-red-500' : ''}`} value={data.phone} onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      update('phone', val);
                      if (!val.trim()) setErrors(prev => ({ ...prev, phone: 'กรุณากรอกเบอร์โทรศัพท์' }));
                      else if (val.length < 10) setErrors(prev => ({ ...prev, phone: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักเท่านั้น' }));
                      else setErrors(prev => { const n = { ...prev }; delete n.phone; return n; });
                    }} placeholder="08xxxxxxxx" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">{t('field.email', data.resumeLanguage as 'en' | 'th')} <span className="text-red-500">*</span></label>
                    <input className={`w-full p-3 border rounded-lg bg-gray-50 text-black ${errors.email ? 'border-red-500' : ''}`} value={data.email} onChange={e => {
                      const val = e.target.value;
                      update('email', val);
                      if (!val.trim()) setErrors(prev => ({ ...prev, email: 'กรุณากรอกอีเมล' }));
                      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) setErrors(prev => ({ ...prev, email: 'รูปแบบอีเมลไม่ถูกต้อง' }));
                      else setErrors(prev => { const n = { ...prev }; delete n.email; return n; });
                    }} placeholder="email@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">{t('field.nationality', data.resumeLanguage as 'en' | 'th')}</label>
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
                    <label className="text-sm text-gray-500">{t('field.birthDate', data.resumeLanguage as 'en' | 'th')}</label>
                    <input
                      type="date"
                      className="w-full p-3 border rounded-lg bg-gray-50 text-black"
                      value={data.birthDate}
                      onChange={e => update('birthDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">ช่องทางการติดต่ออื่นๆ และ โซเชียลมีเดีย</label>
                    <button onClick={() => addItem('socialLinks', { id: crypto.randomUUID(), platform: 'LinkedIn', url: '' })} className="text-xs flex items-center gap-1 text-[#437393] hover:underline bg-blue-50 px-3 py-1.5 rounded-full"><Plus size={14} /> เพิ่มช่องทางติดต่อ</button>
                  </div>

                  {data.socialLinks?.length === 0 && (
                    <div className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed">ยังไม่มีช่องทางการติดต่อเพิ่มเติม</div>
                  )}

                  {data.socialLinks?.map(social => (
                    <div key={social.id} className="flex gap-3 relative group items-start">
                      <div className="w-1/3">
                        <select className="w-full p-3 border rounded-lg bg-gray-50 text-black outline-none transition-all text-sm" value={social.platform} onChange={e => updateItem('socialLinks', social.id, { ...social, platform: e.target.value })}>
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
                        <input className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#437393] text-black outline-none transition-all text-sm" value={social.url} onChange={e => updateItem('socialLinks', social.id, { ...social, url: e.target.value })} placeholder="ลิงก์ หรือ ไอดีติดต่อ (เช่น john.doe)" />
                        <button onClick={() => removeItem('socialLinks', social.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Experience */}
            {activeSection === 'experience' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {data.experience.map(exp => (
                  <div key={exp.id} className="bg-white border rounded-lg p-6 relative shadow-sm group">
                    <button onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div><label className="text-sm text-gray-500">{data.resumeLanguage === 'en' ? 'Position' : 'ตำแหน่ง'}</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={exp.position} onChange={e => updateItem('experience', exp.id, { ...exp, position: e.target.value })} /></div>
                      <div><label className="text-sm text-gray-500">{data.resumeLanguage === 'en' ? 'Company' : 'บริษัท'}</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={exp.company} onChange={e => updateItem('experience', exp.id, { ...exp, company: e.target.value })} /></div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-500 flex justify-between items-center mb-1">
                        {data.resumeLanguage === 'en' ? 'Description' : 'รายละเอียด'}
                        <div className="flex gap-2">
                          <button onClick={() => handleRewrite(exp.id, exp.description)} className="text-xs text-[#437393] hover:underline flex items-center gap-1">✨ {t('action.rewrite', data.resumeLanguage as 'en' | 'th')}</button>
                          <button onClick={() => handleTranslate(exp.description, (val) => updateItem('experience', exp.id, { ...exp, description: val }))} className="text-xs text-gray-500 hover:text-black flex items-center gap-1"><Globe size={12} /> {t('action.translate', data.resumeLanguage as 'en' | 'th')}</button>
                        </div>
                      </label>
                      <textarea className="w-full p-2 border rounded bg-gray-50 h-24 text-black" value={exp.description} onChange={e => updateItem('experience', exp.id, { ...exp, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs text-gray-500 block mb-1">{data.resumeLanguage === 'en' ? 'Start Date' : 'เริ่ม'}</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black text-sm" value={exp.startDate} onChange={e => updateItem('experience', exp.id, { ...exp, startDate: e.target.value })} /></div>
                      <div><label className="text-xs text-gray-500 block mb-1">{data.resumeLanguage === 'en' ? 'End Date' : 'สิ้นสุด'}</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black text-sm" value={exp.endDate} onChange={e => updateItem('experience', exp.id, { ...exp, endDate: e.target.value })} /></div>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddExperience} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">{t('action.add.experience', data.resumeLanguage as 'en' | 'th')}</button>
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
                        <label className="text-sm text-gray-500">{data.resumeLanguage === 'th' ? 'วุฒิการศึกษา' : 'Degree'}</label>
                        <select
                          className="w-full p-2 border rounded bg-gray-50 text-black h-[42px]"
                          value={edu.degree}
                          onChange={e => updateItem('education', edu.id, { ...edu, degree: e.target.value })}
                        >
                          {data.resumeLanguage === 'th' ? (
                            <>
                              <option value="">-- เลือกวุฒิการศึกษา --</option>
                              <option value="ไม่มีวุฒิการศึกษา">ไม่มีวุฒิการศึกษา</option>
                              <option value="ประถมศึกษา">ประถมศึกษา</option>
                              <option value="มัธยมศึกษาตอนต้น (ม.3)">มัธยมศึกษาตอนต้น (ม.3)</option>
                              <option value="มัธยมศึกษาตอนปลาย (ม.6 / ปวช.)">มัธยมศึกษาตอนปลาย (ม.6 / ปวช.)</option>
                              <option value="ปวส. / อนุปริญญา">ปวส. / อนุปริญญา</option>
                              <option value="ปริญญาตรี">ปริญญาตรี</option>
                              <option value="ปริญญาโท">ปริญญาโท</option>
                              <option value="ปริญญาเอก">ปริญญาเอก</option>
                            </>
                          ) : (
                            <>
                              <option value="">-- Select Degree --</option>
                              <option value="None">None</option>
                              <option value="Primary School">Primary School</option>
                              <option value="Middle School">Middle School</option>
                              <option value="High School">High School</option>
                              <option value="Associate Degree">Associate Degree</option>
                              <option value="Bachelor's Degree">Bachelor's Degree</option>
                              <option value="Master's Degree">Master's Degree</option>
                              <option value="Doctorate">Doctorate</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div><label className="text-sm text-gray-500">{data.resumeLanguage === 'th' ? 'คณะ' : 'Faculty'}</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.faculty || ''} onChange={e => updateItem('education', edu.id, { ...edu, faculty: e.target.value })} /></div>
                      <div><label className="text-sm text-gray-500">{data.resumeLanguage === 'th' ? 'สาขาวิชา' : 'Major'}</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.major || ''} onChange={e => updateItem('education', edu.id, { ...edu, major: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div><label className="text-sm text-gray-500">{data.resumeLanguage === 'th' ? 'สถานศึกษา' : 'School/University'}</label><input className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.school} onChange={e => updateItem('education', edu.id, { ...edu, school: e.target.value })} /></div>
                      <div><label className="text-sm text-gray-500">{data.resumeLanguage === 'th' ? 'เกรดเฉลี่ย' : 'GPA'}</label><input type="text" className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.gpa || ''} onChange={e => updateItem('education', edu.id, { ...edu, gpa: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm text-gray-500">{data.resumeLanguage === 'th' ? 'สถานะ' : 'Status'}</label>
                        <select
                          className="w-full p-2 border rounded bg-gray-50 text-black h-[42px]"
                          value={edu.status || 'Graduated'}
                          onChange={e => updateItem('education', edu.id, { ...edu, status: e.target.value as 'Studying' | 'Graduated' })}
                        >
                          <option value="Studying">{data.resumeLanguage === 'th' ? 'กำลังศึกษา' : 'Studying'}</option>
                          <option value="Graduated">{data.resumeLanguage === 'th' ? 'จบการศึกษาแล้ว' : 'Graduated'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm text-gray-500">{data.resumeLanguage === 'th' ? 'เริ่ม' : 'Start'}</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.startDate} onChange={e => updateItem('education', edu.id, { ...edu, startDate: e.target.value })} /></div>
                      <div><label className="text-sm text-gray-500">{edu.status === 'Studying' ? (data.resumeLanguage === 'th' ? 'คาดว่าจะจบ' : 'Expected End') : (data.resumeLanguage === 'th' ? 'สิ้นสุด' : 'End')}</label><input type="date" className="w-full p-2 border rounded bg-gray-50 text-black" value={edu.endDate} onChange={e => updateItem('education', edu.id, { ...edu, endDate: e.target.value })} /></div>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddEducation} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">{t('action.add.education', data.resumeLanguage as 'en' | 'th')}</button>
              </div>
            )}

            {/* 4. Skills (Split into Hard and Soft Skills via store data) */}
            {activeSection === 'skills' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Hard Skills Block */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold text-[#437393] mb-4">Hard Skills (ทักษะทางวิชาชีพ)</h3>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {data.hardSkills.map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill} <button onClick={() => useResumeStore.getState().removeHardSkill(skill)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-2 border rounded bg-gray-50 text-black"
                      placeholder={data.resumeLanguage === 'th' ? "เช่น React, Excel, SEO" : "e.g., React, Excel, SEO"}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          useResumeStore.getState().addHardSkill(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button onClick={(e) => {
                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        useResumeStore.getState().addHardSkill(input.value.trim());
                        input.value = '';
                      }
                    }} className="bg-[#9CC5DF] text-white px-4 py-2 rounded">{t('action.add', data.resumeLanguage as 'en' | 'th')}</button>
                  </div>
                </div>

                {/* Soft Skills Block */}
                <div className="bg-white border rounded-lg p-6 shadow-sm mt-6">
                  <h3 className="font-bold text-[#437393] mb-4">Soft Skills (ทักษะทางสังคมและการทำงาน)</h3>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {data.softSkills.map(skill => (
                      <span key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill} <button onClick={() => useResumeStore.getState().removeSoftSkill(skill)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-2 border rounded bg-gray-50 text-black"
                      placeholder={data.resumeLanguage === 'th' ? "เช่น การสื่อสาร, ความเป็นผู้นำ, การแก้ปัญหา" : "e.g., Leadership, Communication"}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          useResumeStore.getState().addSoftSkill(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button onClick={(e) => {
                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        useResumeStore.getState().addSoftSkill(input.value.trim());
                        input.value = '';
                      }
                    }} className="bg-[#9CC5DF] text-white px-4 py-2 rounded">{t('action.add', data.resumeLanguage as 'en' | 'th')}</button>
                  </div>
                </div>

              </div>
            )}

            {/* Portfolio (NEW) */}
            {activeSection === 'portfolio' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold text-[#437393] mb-2">{data.resumeLanguage === 'th' ? 'ลิงก์แฟ้มสะสมผลงาน (Portfolio URL)' : 'Portfolio Link'}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {data.resumeLanguage === 'th'
                      ? 'เพิ่มลิงก์รวมผลงานออนไลน์เพื่อให้ HR หรือกรรมการดูตัวอย่างงานจริงของคุณ (เช่น GitHub, Behance, Google Drive)'
                      : 'Add a link to your online portfolio (e.g., GitHub, Behance, Google Drive).'}
                  </p>
                  <div>
                    <input
                      className="w-full p-3 border rounded-lg bg-gray-50 text-black"
                      value={data.portfolioUrl}
                      onChange={e => update('portfolioUrl', e.target.value)}
                      placeholder="https://yourawesomeportfolio.com"
                    />
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
                      <label className="text-sm text-gray-500">{data.resumeLanguage === 'en' ? 'Language' : 'ภาษา'}</label>
                      <input className="w-full p-2 border rounded bg-gray-50 text-black" value={lang.language} onChange={e => updateItem('languages', lang.id, { ...lang, language: e.target.value })} placeholder="English" />
                    </div>
                    <div className="w-1/3">
                      <label className="text-sm text-gray-500">{data.resumeLanguage === 'en' ? 'Level' : 'ระดับ'}</label>
                      <select className="w-full p-2 border rounded bg-gray-50 text-black" value={lang.level} onChange={e => updateItem('languages', lang.id, { ...lang, level: e.target.value })}>
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Good">Good</option>
                        <option value="Basic">Basic</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddLanguage} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">{t('action.add.language', data.resumeLanguage as 'en' | 'th')}</button>
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

                <textarea className="w-full h-64 p-4 border rounded-lg bg-gray-50 text-black" placeholder={t('placeholder.summary', data.resumeLanguage as 'en' | 'th')} value={data.summary} onChange={e => update('summary', e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={generateAISummary} className="flex-1 text-[#437393] border border-[#437393] px-4 py-2 rounded hover:bg-blue-50 flex justify-center gap-2 items-center font-medium">
                    ✨ Generate Summary
                  </button>
                  <button onClick={() => handleTranslate(data.summary, (val) => update('summary', val))} className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2">
                    <Globe size={18} /> {t('action.translate', data.resumeLanguage as 'en' | 'th')}
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
                      <label className="text-sm text-gray-500">{data.resumeLanguage === 'en' ? 'Certification Name' : 'ชื่อใบรับรอง / หลักสูตร'}</label>
                      <input className="w-full p-2 border rounded bg-gray-50 text-black" value={cert.name} onChange={e => updateItem('certifications', cert.id, { ...cert, name: e.target.value })} />
                    </div>
                    <div className="w-1/3">
                      <label className="text-sm text-gray-500">{data.resumeLanguage === 'en' ? 'Year' : 'ปีที่ได้รับ'}</label>
                      <input className="w-full p-2 border rounded bg-gray-50 text-black" value={cert.year} onChange={e => updateItem('certifications', cert.id, { ...cert, year: e.target.value })} placeholder="YYYY" />
                    </div>
                  </div>
                ))}
                <button onClick={handleAddCertification} className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50">{t('action.add.certification', data.resumeLanguage as 'en' | 'th')}</button>
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

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-[#437393] mb-2">
              {data.resumeLanguage === 'th' ? 'บันทึกเรซูเม่' : 'Save Resume'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {data.resumeLanguage === 'th' ? 'ตั้งชื่อเพื่อให้ง่ายต่อการค้นหาในภายหลัง' : 'Name your resume to easily find it later.'}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {data.resumeLanguage === 'th' ? 'ชื่อเรซูเม่ (Resume Title)' : 'Resume Title'}
              </label>
              <input
                type="text"
                autoFocus
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                placeholder={`Resume - ${new Date().toLocaleDateString('th-TH')}`}
                value={data.resumeTitle}
                onChange={(e) => update('resumeTitle', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave()
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
                disabled={isSaving}
              >
                {t('action.cancel', data.resumeLanguage as 'en' | 'th')}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-[#437393] text-white rounded-lg hover:bg-[#2c4f6d] transition-colors text-sm font-medium shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving && <span className="animate-spin text-white">⏳</span>}
                {isSaving ? t('nav.saving', data.resumeLanguage as 'en' | 'th') : t('nav.save', data.resumeLanguage as 'en' | 'th')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}