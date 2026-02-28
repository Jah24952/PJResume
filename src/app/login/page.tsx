'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const login = useAuthStore((state) => state.login)

    const handleLogin = async () => {
        try {
            setError('')
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()

            if (data.success) {
                login(data.user)
                router.push('/dashboard') // Go to dashboard after login
            } else {
                setError(data.error || 'Login failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
            <div className="bg-[#9CC5DF] p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center">
                <h1 className="text-3xl font-bold text-black mb-8">เข้าสู่ระบบ</h1>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <div className="space-y-6">
                    <input
                        type="email"
                        placeholder="อีเมล"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-lg bg-white text-black placeholder-gray-500"
                    />
                    <input
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-lg bg-white text-black placeholder-gray-500"
                    />

                    <div className="flex justify-between items-center text-sm font-medium text-slate-800 px-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500" />
                            จดจำฉัน
                        </label>
                        <Link href="/forgot-password" className="hover:underline">ลืมรหัสผ่าน?</Link>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-[#437393] text-white py-3 rounded-2xl font-bold text-lg hover:bg-[#365d75] transition-colors shadow-lg"
                    >
                        เข้าสู่ระบบ
                    </button>
                </div>

                <div className="mt-6 text-sm font-medium text-slate-800">
                    ยังไม่มีบัญชี? <Link href="/register" className="font-bold hover:underline">ลงทะเบียน</Link>
                </div>
            </div>
        </div>
    )
}
