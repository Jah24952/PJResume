'use client'
import { useEffect, useState } from 'react'
import { fetchAdminSkills } from '@/lib/adminApi'
import { Wrench, Plus, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [newSkill, setNewSkill] = useState({ name: '', type: 'hard' })

    useEffect(() => {
        loadSkills()
    }, [])

    const loadSkills = async () => {
        try {
            const res = await fetchAdminSkills()
            if (res.success) setSkills(res.skills)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSkill.name.trim()) return
        
        try {
            // Note: Use standard fetch to API here since we don't have addAdminSkill exported yet 
            // Better to add it to adminApi, but we'll fetch direct for speed in this component
            const tokenJson = localStorage.getItem('auth-storage')
            const userId = tokenJson ? JSON.parse(tokenJson)?.state?.user?.id : ''
            
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/api/admin/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': String(userId) },
                body: JSON.stringify(newSkill)
            })
            if (res.ok) {
                setNewSkill({ name: '', type: 'hard' })
                loadSkills()
            } else {
                toast.error('Duplicate or invalid skill')
            }
        } catch (e) {
            toast.error('Failed to add skill')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this master skill?')) return
        try {
            const tokenJson = localStorage.getItem('auth-storage')
            const userId = tokenJson ? JSON.parse(tokenJson)?.state?.user?.id : ''

            const res = await fetch(`https://project-rs-ats.project-rs-ats.workers.dev/api/admin/skills/${id}`, {
                method: 'DELETE',
                headers: { 'x-user-id': String(userId) }
            })
            if (res.ok) {
                setSkills(skills.filter(s => s.id !== id))
            }
        } catch (e) {
            toast.error('Failed to delete skill')
        }
    }

    const filtered = skills.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Skills Master Data</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage global Hard and Soft skills for the autocomplete dictionary.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Col */}
                <div className="md:col-span-1">
                    <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 sticky top-24">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Plus size={18} className="text-indigo-600"/> Add New Skill
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Skill Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. React.js, Leadership"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select 
                                value={newSkill.type}
                                onChange={(e) => setNewSkill({...newSkill, type: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="hard">Hard Skill (Technical)</option>
                                <option value="soft">Soft Skill (Interpersonal)</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors text-sm mt-2">
                            Add to Database
                        </button>
                    </form>
                </div>

                {/* List Col */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex mb-2 gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="search" 
                                    placeholder="Search skills..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm w-full text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                            {loading ? (
                                <p className="text-center text-slate-500 py-10">Loading...</p>
                            ) : filtered.length === 0 ? (
                                <p className="text-center text-slate-500 py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">No skills found.</p>
                            ) : (
                                filtered.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors group bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${s.type === 'hard' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                            <span className="font-medium text-slate-800">{s.name}</span>
                                            <span className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-0.5 rounded-full">{s.type}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(s.id)}
                                            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
