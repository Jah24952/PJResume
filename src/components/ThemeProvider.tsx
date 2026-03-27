'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settings.store'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettingsStore()

    useEffect(() => {
        const root = document.documentElement

        // Apply theme
        if (settings.theme === 'dark') {
            root.classList.add('dark')
        } else if (settings.theme === 'light') {
            root.classList.remove('dark')
        } else {
            // System preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }

        // Apply size
        if (settings.size === 'large') {
            root.style.fontSize = '18px'
        } else {
            root.style.fontSize = '16px'
        }
    }, [settings.theme, settings.size])

    return <>{children}</>
}
