'use client'
import { useEffect, useState } from 'react'
import { fetchAdminDashboardStats } from '@/lib/adminApi'
import { Users, FileText, Bot, LayoutTemplate, Activity, ArrowUpRight, BarChart } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetchAdminDashboardStats()
                if (res.success) {
                    setStats(res.stats)
                    setError(null)
                } else {
                    setError(res.error || 'Failed to load stats')
                }
            } catch (err: any) {
                console.error(err)
                setError(err.message || 'An unexpected error occurred while fetching data from the backend.')
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 font-medium animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
        )
    }

    const statCards = [
        { label: 'Total Users', value: stats?.users || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Resumes Created', value: stats?.resumes || 0, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'AI Usages', value: stats?.aiUsages || 0, icon: Bot, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Templates', value: stats?.activeTemplates || 0, icon: LayoutTemplate, color: 'text-purple-600', bg: 'bg-purple-50' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-sm text-slate-500 mt-1">Key metrics and recent activity for your SaaS platform.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                    <div className="h-5 w-5 shrink-0 mt-0.5 text-red-500 rounded-full border border-red-500 flex items-center justify-center text-xs font-bold">!</div>
                    <div>
                        <h3 className="text-sm font-semibold">Error Loading Dashboard Data</h3>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => {
                    const Icon = card.icon
                    return (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-500">{card.label}</span>
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                    <Icon size={18} className={card.color} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Chart Placeholder (Left 2 columns) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-slate-900">Growth Overview</h3>
                        <Link href="/admin/reports" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                            View Report <ArrowUpRight size={16} />
                        </Link>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                        {/* Placeholder for Recharts / Chart.js */}
                        <div className="flex flex-col items-center">
                            <BarChart className="text-slate-300 w-12 h-12 mb-2" />
                            <p className="text-sm text-slate-500 font-medium text-center max-w-xs">
                                Chart module will be placed here representing Monthly Active Users and Resumes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Right 1 column) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3 flex-1">
                        <Link href="/admin/users" className="block w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Users size={18} className="text-slate-400 group-hover:text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Manage Users</p>
                                    <p className="text-xs text-slate-500">Edit roles, suspend accounts</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/templates" className="block w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <LayoutTemplate size={18} className="text-slate-400 group-hover:text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Templates</p>
                                    <p className="text-xs text-slate-500">Add or deactivate styles</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/ai-generator" className="block w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Bot size={18} className="text-slate-400 group-hover:text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">AI Controls</p>
                                    <p className="text-xs text-slate-500">View prompt outputs</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
