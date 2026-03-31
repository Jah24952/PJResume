'use client'
import { BarChart, Search, Download } from 'lucide-react'

export default function AdminReportsPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Reports</h1>
                    <p className="text-sm text-slate-500 mt-1">Platform usage statistics and raw data extraction.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                    <Download size={18} /> Export PDF Report
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-96 flex flex-col items-center justify-center text-center group">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm group-hover:bg-indigo-100 group-hover:text-indigo-400 transition-colors">
                    <BarChart size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Analytics Engine Offline</h3>
                <p className="text-slate-500 max-w-md">
                    The advanced charting module is currently not connected. For this demonstration, 
                    the export feature and live charts are placed here structurally to represent SaaS Capabilities.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Most Used Templates</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 font-medium">Modern Classic</span>
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">540 uses</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 font-medium">Minimal Block</span>
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">320 uses</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Top Inserted Skills</h3>
                    <div className="space-y-3 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold">JavaScript (120)</span>
                        <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold">React (105)</span>
                        <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold">Leadership (89)</span>
                        <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold">Project Management (45)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
