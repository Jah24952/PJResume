'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleRegister = async () => {
        try {
            setError('')
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password })
            })
            const data = await res.json()

            if (data.success) {
                alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ')
                router.push('/login')
            } else {
                setError(data.error || 'Registration failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
            <div className="bg-[#9CC5DF] p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center">
                <h1 className="text-3xl font-bold text-black mb-8">ลงทะเบียน</h1>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <div className="space-y-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="ชื่อ"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-lg bg-white text-black placeholder-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="นามสกุล"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-lg bg-white text-black placeholder-gray-500"
                        />
                    </div>
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

                    <button
                        onClick={handleRegister}
                        className="w-full bg-[#437393] text-white py-3 rounded-2xl font-bold text-lg hover:bg-[#365d75] transition-colors shadow-lg"
                    >
                        ลงทะเบียน
                    </button>
                </div>

                <div className="mt-6 text-sm font-medium text-slate-800">
                    มีบัญชีอยู่แล้ว? <Link href="/login" className="font-bold hover:underline">เข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    )
}
