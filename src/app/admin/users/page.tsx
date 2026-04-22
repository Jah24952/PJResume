'use client'
import { useEffect, useState } from 'react'
import { fetchAdminUsers, updateAdminUserRole, updateAdminUserStatus } from '@/lib/adminApi'
import { Search, Shield, UserX, UserCheck, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAdminUsers()
                if (res.success) setUsers(res.users)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const toggleRole = async (user: any) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin'
        try {
            await updateAdminUserRole(user.user_id, newRole)
            setUsers(users.map(u => u.user_id === user.user_id ? { ...u, role: newRole } : u))
        } catch (e) {
            toast.error('Error updating role')
        }
    }

    const toggleStatus = async (user: any) => {
        const newStatus = user.status === 'banned' ? 'active' : 'banned'
        try {
            await updateAdminUserStatus(user.user_id, newStatus)
            setUsers(users.map(u => u.user_id === user.user_id ? { ...u, status: newStatus } : u))
        } catch (e) {
            toast.error('Error updating status')
        }
    }

    const filteredUsers = users.filter(u => 
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (u.full_name_en || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage platform access, roles, and review accounts.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="search" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Resumes</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.user_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                                    {u.full_name_en?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{u.full_name_en || 'Anon User'}</p>
                                                    <p className="text-xs text-slate-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'}
                                            `}>
                                                {u.role === 'admin' && <Shield size={12} className="mr-1" />}
                                                {u.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                ${u.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}
                                            `}>
                                                {u.status === 'banned' ? 'Banned' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {u.resumeCount}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => toggleRole(u)}
                                                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                                    title={u.role === 'admin' ? "Remove Admin" : "Make Admin"}
                                                >
                                                    <Shield size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => toggleStatus(u)}
                                                    className={`p-1 transition-colors ${u.status === 'banned' ? 'text-emerald-500 hover:text-emerald-700' : 'text-slate-400 hover:text-red-600'}`}
                                                    title={u.status === 'banned' ? "Unban User" : "Ban User"}
                                                >
                                                    {u.status === 'banned' ? <UserCheck size={18} /> : <UserX size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
