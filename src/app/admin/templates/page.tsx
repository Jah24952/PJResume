'use client'
import { useEffect, useState } from 'react'
import { fetchAdminTemplates, updateAdminTemplateStatus, addAdminTemplate, deleteAdminTemplate } from '@/lib/adminApi'
import { LayoutTemplate, Plus, CheckCircle, XCircle, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminTemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)

    const loadTemplates = async () => {
        try {
            const res = await fetchAdminTemplates()
            if (res.success) setTemplates(res.templates)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTemplates()
    }, [])

    const toggleStatus = async (template: any) => {
        const newStatus = template.status === 'active' ? 'inactive' : 'active'
        try {
            await updateAdminTemplateStatus(template.id, newStatus)
            setTemplates(templates.map(t => t.id === template.id ? { ...t, status: newStatus } : t))
        } catch (e) {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('คุณต้องการลบเทมเพลตนี้หรือไม่?')) return
        try {
            await deleteAdminTemplate(id)
            setTemplates(templates.filter(t => t.id !== id))
        } catch (e) {
            toast.error('Failed to delete template')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Templates</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage resume templates and control what users see.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
                >
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
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                                        {t.style || '—'}
                                    </span>
                                    {t.is_ai_generated === 1 && (
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded border border-amber-200">
                                            AI Variant
                                        </span>
                                    )}
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-mono">ID: {t.id}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
                        </div>
                    ))
                )}
            </div>

            {/* Add Template Modal */}
            {showAddModal && (
                <AddTemplateModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false)
                        loadTemplates()
                    }}
                />
            )}
        </div>
    )
}

function AddTemplateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({
        name: '',
        category: 'General',
        style: 'modern',
        preview_image_url: '',
        status: 'active'
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return toast.error('กรุณาใส่ชื่อเทมเพลต')

        setSaving(true)
        try {
            await addAdminTemplate(form)
            onSuccess()
        } catch (err) {
            toast.error('Failed to add template')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Add New Template</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Template Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Template Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Modern Violet"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="General">General</option>
                            <option value="Modern">Modern</option>
                            <option value="Professional">Professional</option>
                            <option value="Creative">Creative</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Finance">Finance</option>
                            <option value="Government">Government</option>
                            <option value="Education">Education</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </div>

                    {/* Style */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Render Style</label>
                        <select
                            value={form.style}
                            onChange={e => setForm({ ...form, style: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="creative">Creative</option>
                            <option value="professional">Professional</option>
                            <option value="soft-block">Soft Block</option>
                            <option value="creative-curve">Creative Curve</option>
                            <option value="tech-dark">Tech Dark</option>
                            <option value="modern-curve">Modern Curve</option>
                            <option value="professional-box">Professional Box</option>
                        </select>
                    </div>

                    {/* Preview Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Preview Image URL <span className="text-slate-400 text-xs">(optional)</span></label>
                        <input
                            type="url"
                            placeholder="https://example.com/preview.png"
                            value={form.preview_image_url}
                            onChange={e => setForm({ ...form, preview_image_url: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Active Status</p>
                            <p className="text-xs text-slate-500">Template will be visible to users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.status === 'active'}
                                onChange={e => setForm({ ...form, status: e.target.checked ? 'active' : 'inactive' })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : <><Plus size={16} /> Add Template</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
