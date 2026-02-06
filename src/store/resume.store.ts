import { create } from 'zustand'

/* ===== 1. โครงสร้างข้อมูล (อิงจากงานวิจัย) ===== */
export type Experience = {
  id: string
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export type Education = {
  id: string
  degree: string
  school: string
  startDate: string
  endDate: string
}

export type Language = {
  id: string
  language: string
  level: string
}

export type Certification = {
  id: string
  name: string
  year: string
}

export type ResumeData = {
  name: string
  surname: string
  jobTitle: string
  address: string
  phone: string
  email: string
  nationality: string
  birthDate: string
  socialLink: string
  profileImage: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages: Language[]
  certifications: Certification[]
  summary: string
  selectedTemplate: string
  themeColor: string
}

/* ===== 2. State ของ Resume Builder ===== */
type ResumeState = {
  step: number
  data: ResumeData
  next: () => void
  back: () => void
  update: (
    field: keyof ResumeData,
    value: any
  ) => void
  addItem: (field: 'experience' | 'education' | 'languages' | 'certifications', item: any) => void
  removeItem: (field: 'experience' | 'education' | 'languages' | 'certifications', id: string) => void
  updateItem: (field: 'experience' | 'education' | 'languages' | 'certifications', id: string, item: any) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  setTemplate: (template: string, color: string) => void
  setResumeData: (data: ResumeData) => void
}

/* ===== 3. Zustand Store ===== */
export const useResumeStore = create<ResumeState>((set) => ({
  step: 1,
  data: {
    name: '',
    surname: '',
    jobTitle: '',
    address: '',
    phone: '',
    email: '',
    nationality: '',
    birthDate: '',
    socialLink: '',
    profileImage: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    summary: '',
    selectedTemplate: 'modern',
    themeColor: '#437393'
  },

  next: () =>
    set((state) => ({
      step: state.step + 1
    })),

  back: () =>
    set((state) => ({
      step: state.step - 1
    })),

  update: (field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [field]: value
      }
    })),

  addItem: (field, item) =>
    set((state) => ({
      data: {
        ...state.data,
        [field]: [...(state.data[field] as any[]), item]
      }
    })),

  removeItem: (field, id) =>
    set((state) => ({
      data: {
        ...state.data,
        [field]: (state.data[field] as any[]).filter((i) => i.id !== id)
      }
    })),

  updateItem: (field, id, item) =>
    set((state) => ({
      data: {
        ...state.data,
        [field]: (state.data[field] as any[]).map((i) => (i.id === id ? item : i))
      }
    })),

  addSkill: (skill) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: [...state.data.skills, skill]
      }
    })),

  removeSkill: (skill) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.filter((s) => s !== skill)
      }
    })),

  setTemplate: (template, color) =>
    set((state) => ({
      data: {
        ...state.data,
        selectedTemplate: template,
        themeColor: color
      }
    })),

  setResumeData: (data) => set({ data })
}))
