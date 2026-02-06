import { create } from 'zustand'

/* ===== 1. โครงสร้างข้อมูล (อิงจากงานวิจัย) ===== */
export type ResumeData = {
  name: string
  email: string
  experience: string
  education: string
  skills: string
  summary: string
}

/* ===== 2. State ของ Resume Builder ===== */
type ResumeState = {
  step: number
  data: ResumeData
  next: () => void
  back: () => void
  update: (
    field: keyof ResumeData,
    value: string
  ) => void
}

/* ===== 3. Zustand Store ===== */
export const useResumeStore = create<ResumeState>((set) => ({
  step: 1,
  data: {
    name: '',
    email: '',
    experience: '',
    education: '',
    skills: '',
    summary: ''
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
    }))
}))
