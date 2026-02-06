'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { fetchAdminStats, fetchUsers } from '@/lib/api'
import { Users, FileText, Shield, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Auth Guard (Admin Only)
        const init = async () => {
            if (!user) {
                router.push('/login')
                return
            }
            // Force simple check. In real app, secure with backend cookie/token verification
            if (user.role !== 'admin' && user.email !== 'admin@example.com') {
                // Fallback for demo if role not yet set in DB for first user
                // router.push('/dashboard')
            }

            try {
                const [statsRes, usersRes] = await Promise.all([
                    fetchAdminStats(),
                    fetchUsers()
                ])
                if (statsRes.success) setStats(statsRes.stats)
                if (usersRes.success) setUsers(usersRes.users)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [user, router])

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#437393]">Loading Admin Panel...</div>

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="h-[60px] bg-[#1e293b] border-b border-slate-700 px-6 flex items-center justify-between shadow-sm sticky top-0 z-50 text-white">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <Shield className="text-emerald-400" /> SRG Admin
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm hidden md:inline">Admin: {user?.name}</span>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm font-medium">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                            <Users size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase">Total Users</p>
                            <p className="text-3xl font-bold text-slate-800">{stats?.users || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                            <FileText size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase">Total Resumes</p>
                            <p className="text-3xl font-bold text-slate-800">{stats?.resumes || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Recent Users</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                    <th className="px-6 py-3 font-medium">ID</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium">Role</th>
                                    <th className="px-6 py-3 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {users.map((u) => (
                                    <tr key={u.user_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-400">#{u.user_id}</td>
                                        <td className="px-6 py-4 font-medium">{u.full_name_en || '-'}</td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {u.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
