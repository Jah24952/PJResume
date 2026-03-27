import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserSettings = {
    theme: string
    language: string
    size: string
    defaultLanguage: string
    defaultTemplate: string
    defaultFont: string
    defaultPaperSize: string
    autoSave: boolean
    systemAlerts: boolean
    aiReady: boolean
}

const defaultSettings: UserSettings = {
    theme: 'system',
    language: 'th',
    size: 'normal',
    defaultLanguage: 'th',
    defaultTemplate: 'modern',
    defaultFont: 'inter',
    defaultPaperSize: 'a4',
    autoSave: true,
    systemAlerts: true,
    aiReady: true
}

type SettingsState = {
    settings: UserSettings
    updateSettings: (data: Partial<UserSettings>) => void
    setSettings: (data: UserSettings) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            settings: defaultSettings,
            updateSettings: (data) => set((state) => ({ settings: { ...state.settings, ...data } })),
            setSettings: (data) => set({ settings: data })
        }),
        {
            name: 'settings-storage',
        }
    )
)
