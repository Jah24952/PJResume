'use client'
import { useEffect, useState } from 'react'
import { fetchAdminUniversities } from '@/lib/adminApi'
import { GraduationCap, MapPin, Building, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUniversitiesPage() {
    const [universities, setUniversities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newUni, setNewUni] = useState({ name: '', country: 'Thailand' })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const res = await fetchAdminUniversities()
            if (res.success) setUniversities(res.universities)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newUni.name.trim()) return
        
        try {
            const tokenJson = localStorage.getItem('auth-storage')
            const userId = tokenJson ? JSON.parse(tokenJson)?.state?.user?.id : ''
            
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/api/admin/universities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': String(userId) },
                body: JSON.stringify(newUni)
            })
            if (res.ok) {
                setNewUni({ name: '', country: 'Thailand' })
                loadData()
            }
        } catch (e) {
            toast.error('Failed to add university')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this university?')) return
        try {
            const tokenJson = localStorage.getItem('auth-storage')
            const userId = tokenJson ? JSON.parse(tokenJson)?.state?.user?.id : ''

            const res = await fetch(`https://project-rs-ats.project-rs-ats.workers.dev/api/admin/universities/${id}`, {
                method: 'DELETE',
                headers: { 'x-user-id': String(userId) }
            })
            if (res.ok) {
                setUniversities(universities.filter(u => u.id !== id))
            }
        } catch (e) {
            toast.error('Failed to delete university')
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Universities Directory</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage standard universities and institutions for education section.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Institution Name</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. Chulalongkorn University"
                        value={newUni.name}
                        onChange={(e) => setNewUni({...newUni, name: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. Thailand"
                        value={newUni.country}
                        onChange={(e) => setNewUni({...newUni, country: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button onClick={handleAdd} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 h-[38px]">
                    <Plus size={18} /> Add
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {loading ? (
                        <p className="col-span-full text-center text-slate-500">Loading...</p>
                    ) : universities.length === 0 ? (
                        <p className="col-span-full text-center text-slate-500">No universities found. Please add some.</p>
                    ) : (
                        universities.map(u => (
                            <div key={u.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors bg-slate-50 relative group">
                                <Building className="text-slate-400 mb-2" size={24} />
                                <h3 className="font-semibold text-slate-800 line-clamp-2" title={u.name}>{u.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                                    <MapPin size={12} /> {u.country}
                                </p>
                                <button 
                                    onClick={() => handleDelete(u.id)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 p-1.5 rounded shadow-sm border border-slate-200 hover:border-red-200"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
