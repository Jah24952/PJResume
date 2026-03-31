'use client'
import { useEffect, useState } from 'react'
import { fetchAdminSettings, updateAdminSetting } from '@/lib/adminApi'
import { Save, Settings2 } from 'lucide-react'

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({
        website_name: 'Resume Builder Pro',
        allow_ai_generate: 'true',
        max_resume_per_user: '5'
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAdminSettings()
                if (res.success && res.settings.length > 0) {
                    const mapped: any = {}
                    res.settings.forEach((s: any) => mapped[s.setting_key] = s.setting_value)
                    setSettings(prev => ({ ...prev, ...mapped }))
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            for (const [key, value] of Object.entries(settings)) {
                await updateAdminSetting(key, String(value))
            }
            alert('Settings saved successfully!')
        } catch (e) {
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-10 text-center">Loading settings...</div>

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Settings2 size={18} className="text-indigo-600" /> Platform Configuration
                    </h3>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* General Settings */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">General</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Website Name</label>
                                <input 
                                    type="text" 
                                    value={settings.website_name}
                                    onChange={(e) => setSettings({...settings, website_name: e.target.value})}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4" />

                    {/* AI Settings */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">AI Configuration</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Allow AI Generation</label>
                                    <p className="text-xs text-slate-500">Enable or disable AI template generation globally.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={settings.allow_ai_generate === 'true'}
                                    onChange={(e) => setSettings({...settings, allow_ai_generate: e.target.checked ? 'true' : 'false'})}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4" />

                    {/* Usage Limits */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Usage Limits</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Resumes Per User</label>
                                <input 
                                    type="number" 
                                    value={settings.max_resume_per_user}
                                    onChange={(e) => setSettings({...settings, max_resume_per_user: e.target.value})}
                                    className="w-full md:w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
                    </button>
                </div>
            </div>
        </div>
    )
}
