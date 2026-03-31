'use client'
import { useEffect, useState } from 'react'
import { fetchAdminLogs } from '@/lib/adminApi'
import { Activity, Clock } from 'lucide-react'

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAdminLogs()
                if (res.success) setLogs(res.logs)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Activity Logs</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Activity size={18} className="text-indigo-600" /> Recent System Activity
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-6 text-center text-slate-500">Loading logs...</div>
                    ) : logs.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">No activity logged yet.</div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                                <div className="mt-1">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{log.action}</p>
                                    <p className="text-xs text-slate-500 mt-1">{log.description || 'System event'}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(log.created_at).toLocaleString()}</span>
                                        <span>•</span>
                                        <span className="font-mono">{log.user_email || `User #${log.user_id}`}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
