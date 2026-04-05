'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  FileText, 
  LayoutTemplate, 
  Wrench, 
  GraduationCap, 
  Bot, 
  BarChart, 
  Settings, 
  Activity,
  LogOut,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }
        if (user.role !== 'admin' && user.email !== 'admin@example.com') {
            router.push('/dashboard')
            return
        }
        setLoading(false)
    }, [user, router])

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#437393]">Loading Admin Panel...</div>

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Resumes', href: '/admin/resumes', icon: FileText },
        { label: 'Templates', href: '/admin/templates', icon: LayoutTemplate },
        { label: 'Skills', href: '/admin/skills', icon: Wrench },
        { label: 'Universities', href: '/admin/universities', icon: GraduationCap },
        { label: 'AI Generator', href: '/admin/ai-generator', icon: Bot },
        { label: 'Reports', href: '/admin/reports', icon: BarChart },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
        { label: 'Logs', href: '/admin/logs', icon: Activity },
    ]

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 flex flex-col
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-slate-800">
                        <Shield className="text-indigo-600" size={24} /> 
                        <span className="tracking-tight">SRG Admin</span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-3 border-b border-slate-100">
                    <Link 
                        href="/"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        Back to Main Site
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                                    ${isActive 
                                        ? 'bg-indigo-50 text-indigo-700' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:hidden">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 mr-3 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="font-semibold text-slate-800 tracking-tight">SRG Admin</h1>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    )
}
