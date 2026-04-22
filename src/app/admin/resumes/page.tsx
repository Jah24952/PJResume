'use client'
import { useEffect, useState } from 'react'
import { fetchAdminResumes, deleteAdminResume } from '@/lib/adminApi'
import { FileText, Search, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminResumesPage() {
    const [resumes, setResumes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAdminResumes()
                if (res.success) setResumes(res.resumes)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this resume? This cannot be undone.')) return
        try {
            await deleteAdminResume(id)
            setResumes(resumes.filter(r => r.resume_id !== id))
        } catch (e) {
            toast.error('Failed to delete resume')
        }
    }

    const filtered = resumes.filter(r => 
        (r.resume_title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (r.user_email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resumes</h1>
                    <p className="text-sm text-slate-500 mt-1">Review and manage all resumes created on the platform.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="search" 
                        placeholder="Search title or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-500">Loading resumes...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">No resumes found.</div>
                ) : (
                    filtered.map((r) => (
                        <div key={r.resume_id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                            <div className="p-5 flex-1 break-words">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-semibold text-slate-900 line-clamp-1 truncate" title={r.resume_title}>{r.resume_title || 'Untitled Resume'}</h3>
                                <p className="text-sm text-slate-500 mt-1 truncate" title={r.user_email}>{r.user_email || 'Unknown User'}</p>
                                <p className="text-xs text-slate-400 mt-3">
                                    Created: {new Date(r.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                    {r.selected_template_id || 'Static'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleDelete(r.resume_id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
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
