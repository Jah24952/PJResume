import { useState, useEffect } from 'react'
import { Palette, Globe, Monitor, Save } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useSettingsStore } from '@/store/settings.store'
import { updateUserSettings } from '@/lib/api'

export default function AppearanceSettings() {
    const { user } = useAuthStore()
    const { settings, updateSettings } = useSettingsStore()

    const [appearance, setAppearance] = useState({
        theme: settings.theme || 'system',
        language: settings.language || 'th',
        size: settings.size || 'normal'
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setAppearance({ ...appearance, [e.target.name]: e.target.value })
    }

    // Apply theme immediately when changed
    const applyTheme = (theme: string) => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else if (theme === 'light') {
            root.classList.remove('dark')
        } else {
            // System: detect user preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }
    }

    // Apply size immediately when changed
    const applySize = (size: string) => {
        const root = document.documentElement
        if (size === 'large') {
            root.style.fontSize = '18px'
        } else {
            root.style.fontSize = '16px'
        }
    }

    // Apply initial settings on mount
    useEffect(() => {
        applyTheme(appearance.theme)
        applySize(appearance.size)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            // Apply immediately
            applyTheme(appearance.theme)
            applySize(appearance.size)

            // Update global store
            updateSettings({
                theme: appearance.theme,
                language: appearance.language,
                size: appearance.size,
            })

            // Save to database
            if (user?.id) {
                const currentSettings = useSettingsStore.getState().settings
                await updateUserSettings(user.id, currentSettings)
            }

            setLoading(false)
            setMessage({ type: 'success', text: 'บันทึกรูปแบบการแสดงผลเรียบร้อยแล้ว' })
        } catch (error) {
            setLoading(false)
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึก' })
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 animate-in fade-in duration-300">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
                    <Palette size={20} className="text-[#437393]" /> รูปแบบการแสดงผล (Appearance)
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">จัดการหน้าตาและภาษาของระบบให้เหมาะกับคุณ</p>
            </div>

            {message.text && (
                <div className={`p-3 mb-6 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                
                {/* Theme Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">ธีมระบบ (Theme)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${appearance.theme === 'light' ? 'border-[#437393] bg-[#437393]/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                            <input type="radio" name="theme" value="light" checked={appearance.theme === 'light'} onChange={handleChange} className="sr-only" />
                            <div className="w-full flex justify-center">
                                <div className="w-16 h-10 bg-white border border-gray-200 rounded-md shadow-sm"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">สว่าง (Light)</span>
                        </label>
                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${appearance.theme === 'dark' ? 'border-[#437393] bg-[#437393]/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                            <input type="radio" name="theme" value="dark" checked={appearance.theme === 'dark'} onChange={handleChange} className="sr-only" />
                            <div className="w-full flex justify-center">
                                <div className="w-16 h-10 bg-gray-800 border-gray-700 rounded-md shadow-sm"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">มืด (Dark)</span>
                        </label>
                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${appearance.theme === 'system' ? 'border-[#437393] bg-[#437393]/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                            <input type="radio" name="theme" value="system" checked={appearance.theme === 'system'} onChange={handleChange} className="sr-only" />
                            <div className="w-full flex justify-center">
                                <div className="w-16 h-10 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-md shadow-sm"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ตามระบบ (System)</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    {/* UI Language */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ภาษาของอินเทอร์เฟซ (Interface Language)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe size={16} className="text-gray-400" />
                            </div>
                            <select
                                name="language"
                                value={appearance.language}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            >
                                <option value="th">ภาษาไทย (Thai)</option>
                                <option value="en">English (อังกฤษ)</option>
                            </select>
                        </div>
                    </div>

                    {/* Interface Size */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ขนาดการแสดงผล (Interface Size)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Monitor size={16} className="text-gray-400" />
                            </div>
                            <select
                                name="size"
                                value={appearance.size}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            >
                                <option value="normal">ปกติ (Normal)</option>
                                <option value="large">ใหญ่ (Large)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#437393] text-white rounded-lg hover:bg-[#355b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                        <Save size={18} />
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการแสดงผล'}
                    </button>
                </div>
            </form>
        </div>
    )
}
