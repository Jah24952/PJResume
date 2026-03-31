'use client'
import { useEffect, useState } from 'react'
import { fetchAdminTemplates, updateAdminTemplateStatus } from '@/lib/adminApi'
import { LayoutTemplate, Plus, CheckCircle, XCircle } from 'lucide-react'

export default function AdminTemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAdminTemplates()
                if (res.success) setTemplates(res.templates)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const toggleStatus = async (template: any) => {
        const newStatus = template.status === 'active' ? 'inactive' : 'active'
        try {
            await updateAdminTemplateStatus(template.id, newStatus)
            setTemplates(templates.map(t => t.id === template.id ? { ...t, status: newStatus } : t))
        } catch (e) {
            alert('Failed to update status')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Templates</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage resume templates and control what users see.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                    <Plus size={18} /> Add Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-500">Loading templates...</div>
                ) : templates.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">No templates found.</div>
                ) : (
                    templates.map((t) => (
                        <div key={t.id} className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 overflow-hidden flex flex-col group">
                            {/* Template Preview Header */}
                            <div className="h-40 bg-slate-100 border-b border-slate-200 relative overflow-hidden flex items-center justify-center">
                                {t.preview_image_url ? (
                                    <img src={t.preview_image_url} alt={t.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <LayoutTemplate className="w-16 h-16 text-slate-300" />
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md shadow-sm ${t.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                                        {t.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Template Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-800 text-lg mb-1">{t.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">
                                        {t.category || 'General'}
                                    </span>
                                    {t.is_ai_generated === 1 && (
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded border border-amber-200">
                                            AI Variant
                                        </span>
                                    )}
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-mono">ID: {t.id}</span>
                                    <button 
                                        onClick={() => toggleStatus(t)}
                                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg
                                            ${t.status === 'active' 
                                                ? 'text-slate-600 hover:bg-slate-100' 
                                                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                            }
                                        `}
                                    >
                                        {t.status === 'active' ? (
                                            <><XCircle size={16} /> Disable</>
                                        ) : (
                                            <><CheckCircle size={16} /> Enable</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
