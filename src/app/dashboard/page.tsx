'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { fetchResumes, changePassword, deleteResume } from '@/lib/api'
import { FileText, Plus, Edit, Trash2, Download, LogOut, ArrowLeft, Settings, User, Search } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const [resumes, setResumes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'resumes' | 'settings'>('resumes')

    // Search and Pagination State
    const [searchQuery, setSearchQuery] = useState('')
    const [visibleCount, setVisibleCount] = useState(3)

    // Password Change State
    const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const [passLoading, setPassLoading] = useState(false)
    const [passMessage, setPassMessage] = useState({ type: '', text: '' })

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

    const calculateCompleteness = (resume: any) => {
        let score = 0
        const stats = resume.stats || { experience: 0, education: 0, skills: 0 }

        if (resume.summary) score += 20
        if (stats.experience > 0) score += 30
        if (stats.education > 0) score += 20
        if (stats.skills >= 3) score += 30

        return Math.min(100, score)
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passForm.newPassword !== passForm.confirmPassword) {
            setPassMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }
        if (!user) return

        try {
            setPassLoading(true)
            setPassMessage({ type: '', text: '' })
            const res = await changePassword({
                userId: user.id,
                oldPassword: passForm.oldPassword,
                newPassword: passForm.newPassword
            })

            if (res.success) {
                setPassMessage({ type: 'success', text: 'Password changed successfully' })
                setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                setPassMessage({ type: 'error', text: res.error || 'Failed to change password' })
            }
        } catch (error: any) {
            setPassMessage({ type: 'error', text: error.message || 'Something went wrong' })
        } finally {
            setPassLoading(false)
        }
    }

    const handleDelete = async (resumeId: number) => {
        if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) return

        try {
            const res = await deleteResume(resumeId)
            if (res.success) {
                // Remove from state
                setResumes(prev => prev.filter(r => r.resume_id !== resumeId))
            } else {
                alert('Failed to delete resume: ' + res.error)
            }
        } catch (err) {
            alert('Failed to delete resume')
            console.error(err)
        }
    }

    // Filter resumes based on search query
    const filteredResumes = resumes.filter(resume =>
        (resume.resume_title || 'Untitled Resume').toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sliced resumes for display
    const displayedResumes = filteredResumes.slice(0, visibleCount)

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3)
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#437393]">Loading...</div>

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Navbar */}
            <nav className="h-[60px] bg-white border-b px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-500 hover:text-[#437393] transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <Link href="/" className="text-2xl font-serif text-[#437393] font-bold">
                        SRG-TJS
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm hidden md:inline">Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold text-[#437393] mb-6">My Account</h1>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('resumes')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'resumes'
                            ? 'border-[#437393] text-[#437393]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText size={18} /> My Resumes
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'settings'
                            ? 'border-[#437393] text-[#437393]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Settings size={18} /> Settings
                    </button>
                </div>

                {/* Tab Content: Resumes */}
                {activeTab === 'resumes' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อเรซูเม่..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500 font-medium"
                                />
                            </div>

                            <Link
                                href="/resume/select-mode"
                                className="bg-[#437393] text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#355b74] transition-colors shadow-sm whitespace-nowrap"
                            >
                                <Plus size={18} /> สร้างเรซูเม่ใหม่
                            </Link>
                        </div>

                        {filteredResumes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-dashed border-2 border-gray-200 text-center">
                                <FileText size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600 mb-2">
                                    {searchQuery ? 'ไม่พบเรซูเม่ที่ค้นหา' : 'ยังไม่มีเรซูเม่'}
                                </h3>
                                {!searchQuery && (
                                    <Link href="/resume/select-mode" className="text-[#437393] font-bold hover:underline mt-2">
                                        เริ่มสร้างเรซูเม่ &rarr;
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedResumes.map((resume) => {
                                        const completeness = calculateCompleteness(resume)
                                        return (
                                            <div key={resume.resume_id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all flex flex-col relative overflow-hidden">

                                                {/* Delete Button (Top Right) */}
                                                <button
                                                    onClick={() => handleDelete(resume.resume_id)}
                                                    className="absolute top-3 right-3 z-10 p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                                    title="ลบประวัติ"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                {/* Card Header (Icon Area) */}
                                                <div className="h-32 bg-gray-50 flex items-center justify-center relative border-b border-gray-100">
                                                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-semibold text-gray-500 shadow-sm border border-gray-100">
                                                        {resume.language?.toUpperCase() || 'EN'}
                                                    </div>
                                                    <FileText size={40} className="text-gray-300" />
                                                </div>

                                                {/* Card Body */}
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-gray-800 text-lg mb-2 truncate pr-10">{resume.resume_title || 'Untitled Resume'}</h3>

                                                    <div className="mt-1 mb-5 space-y-2">
                                                        <div className="flex justify-between text-xs text-gray-500">
                                                            <span>สร้างเมื่อ:</span>
                                                            <span>{new Date(resume.created_at || Date.now()).toLocaleDateString('th-TH')}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-500">
                                                            <span>แก้ไขล่าสุด:</span>
                                                            <span>{new Date(resume.updated_at).toLocaleDateString('th-TH')}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto mb-5">
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <span className="text-xs font-semibold text-gray-600">ความสมบูรณ์</span>
                                                            <span className={`text-xs font-bold ${completeness === 100 ? 'text-green-600' : 'text-[#437393]'}`}>
                                                                {completeness}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all duration-500 ${completeness === 100 ? 'bg-green-500' : 'bg-[#437393]'}`}
                                                                style={{ width: `${completeness}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Primary Actions */}
                                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                                        <Link
                                                            href={`/resume/create?id=${resume.resume_id}`}
                                                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#437393]/10 text-[#437393] hover:bg-[#437393]/20 rounded-lg text-sm font-semibold transition-colors"
                                                        >
                                                            <Edit size={16} /> แก้ไข
                                                        </Link>
                                                        <button
                                                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
                                                        >
                                                            <Download size={16} /> ดาวน์โหลด
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Load More Button */}
                                {filteredResumes.length > visibleCount && (
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={handleLoadMore}
                                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-600 font-medium rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            ดูเพิ่มเติม
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Tab Content: Settings */}
                {activeTab === 'settings' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl">
                        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <User size={20} className="text-[#437393]" /> Profile Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={user?.name || ''}
                                        disabled
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Settings size={20} className="text-[#437393]" /> Security
                            </h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                {passMessage.text && (
                                    <div className={`p-3 rounded-lg text-sm ${passMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {passMessage.text}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passForm.oldPassword}
                                        onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passForm.newPassword}
                                        onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passForm.confirmPassword}
                                        onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={passLoading}
                                        className="px-6 py-2 bg-[#437393] text-white rounded-lg hover:bg-[#355b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {passLoading ? 'Updating...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
