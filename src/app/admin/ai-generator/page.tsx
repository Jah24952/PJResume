'use client'
import { Bot, Terminal, Code } from 'lucide-react'

export default function AdminAIGeneratorPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Controls</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage AI Template Prompts and Monitor Gemini API.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden text-slate-300 font-mono text-sm leading-relaxed p-6">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold border-b border-slate-700 pb-2">
                        <Terminal size={18} /> Active System Prompt
                    </div>
                    <p className="text-pink-400 mb-2">// This is the prompt injected before user requests</p>
                    <p className="text-blue-300">Role: Professional Resume Designer</p>
                    <p>Task: Generate HTML code using exclusively Tailwind CSS V4.</p>
                    <p className="mt-4 text-yellow-300">Rules:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Do not use arbitrary colors, use strict inline colors.</li>
                        <li>Respect the specific {`{{PLACEHOLDERS}}`} strictly for frontend parsing.</li>
                        <li>Be extremely creative and bold in UI presentation.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                        <Bot size={32} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2">Sandbox Generator</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs">
                        Admins can test the AI prompt safely without affecting user tokens or quotas.
                    </p>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                        <Code size={18} /> Open AI Sandbox
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Recent AI Queries</h3>
                    <p className="text-slate-500 text-center py-6">Logs of specific AI Text Prompts will appear here (Requires Backend Query Sync).</p>
            </div>
        </div>
    )
}
