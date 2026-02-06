'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { fetchResumes } from '@/lib/api'
import { FileText, Plus, Edit, Trash2, Download, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const [resumes, setResumes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Auth Guard
        const timer = setTimeout(() => {
            if (!user) {
                router.push('/login')
            } else {
                loadResumes()
            }
        }, 100)
        return () => clearTimeout(timer)
    }, [user, router])

    const loadResumes = async () => {
        if (!user) return
        try {
            setLoading(true)
            const data = await fetchResumes(user.id)
            if (data.success) {
                setResumes(data.resumes)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#437393]">Loading...</div>

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Navbar */}
            <nav className="h-[60px] bg-white border-b px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <Link href="/" className="text-2xl font-serif text-[#437393] font-bold">
                    SRG-TJS
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm hidden md:inline">Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#437393]">My Resumes</h1>
                    <Link
                        href="/resume/templates"
                        className="bg-[#437393] text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-[#355b74] transition-colors shadow-md transform hover:scale-105"
                    >
                        <Plus size={20} /> Create New
                    </Link>
                </div>

                {resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-dashed border-2 border-gray-200 text-center">
                        <FileText size={64} className="text-gray-200 mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No resumes yet</h3>
                        <p className="text-gray-400 mb-6">Create your first professional resume today.</p>
                        <Link href="/resume/templates" className="text-[#437393] font-bold hover:underline">
                            Get Started &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div key={resume.resume_id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all group overflow-hidden">
                                <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                                    {/* Placeholder Preview */}
                                    <FileText size={48} className="text-gray-300" />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Link
                                            href={`/resume/create?id=${resume.resume_id}`}
                                            className="bg-white p-2 rounded-full text-gray-700 hover:text-[#437393] shadow-sm transform hover:scale-110 transition-transform"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        {/* Future: PDF Download link */}
                                        <button className="bg-white p-2 rounded-full text-gray-700 hover:text-green-600 shadow-sm transform hover:scale-110 transition-transform" title="Download PDF">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{resume.resume_title || 'Untitled Resume'}</h3>
                                    <p className="text-xs text-gray-500 mb-4">Last updated: {new Date(resume.updated_at).toLocaleDateString()} {new Date(resume.updated_at).toLocaleTimeString()}</p>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                            {resume.language?.toUpperCase() || 'EN'}
                                        </span>
                                        <button className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
