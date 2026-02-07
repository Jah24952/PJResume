'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // UI State
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    // Validation
    const isPasswordMatch = password === confirmPassword && password !== ''
    const isPasswordLengthValid = password.length >= 8
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isFormValid = firstName && lastName && isEmailValid && isPasswordLengthValid && isPasswordMatch

    const handleRegister = async () => {
        if (!isFormValid) return

        try {
            setLoading(true)
            setError('')
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password })
            })
            const data = await res.json()

            if (data.success) {
                // Success feedback
                alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ')
                router.push('/login')
            } else {
                setError(data.error || 'Registration failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
            <div className="bg-[#9CC5DF] p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-center transition-all animate-in fade-in zoom-in duration-300">
                <h1 className="text-3xl font-bold text-black mb-2">ลงทะเบียน</h1>
                <p className="text-slate-700 mb-6 text-sm">สร้างบัญชีเพื่อเริ่มต้นใช้งาน</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-in shake">
                        <X size={16} /> {error}
                    </div>
                )}

                <div className="space-y-4 text-left">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="ชื่อ"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-base bg-white text-black placeholder-gray-400 shadow-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="นามสกุล"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-base bg-white text-black placeholder-gray-400 shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="อีเมล"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 text-base bg-white text-black placeholder-gray-400 shadow-sm ${email && !isEmailValid ? 'ring-2 ring-red-400' : 'focus:ring-slate-500'
                                }`}
                        />
                        {email && !isEmailValid && <p className="text-red-600 text-xs mt-1 ml-1">รูปแบบอีเมลไม่ถูกต้อง</p>}
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่าน (ขั้นต่ำ 8 ตัวอักษร)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 text-base bg-white text-black placeholder-gray-400 shadow-sm ${password && !isPasswordLengthValid ? 'ring-2 ring-red-400' : 'focus:ring-slate-500'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="ยืนยันรหัสผ่าน"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-none outline-none focus:ring-2 text-base bg-white text-black placeholder-gray-400 shadow-sm ${confirmPassword && !isPasswordMatch ? 'ring-2 ring-red-400' : 'focus:ring-slate-500'
                                }`}
                        />
                        {confirmPassword && isPasswordMatch && (
                            <div className="absolute right-3 top-3.5 text-green-600">
                                <Check size={20} />
                            </div>
                        )}
                    </div>

                    {/* Validation Hints */}
                    {password && (
                        <div className="text-xs space-y-1 text-slate-700 px-1">
                            <div className={`flex items-center gap-1 ${isPasswordLengthValid ? 'text-green-700' : 'text-slate-500'}`}>
                                {isPasswordLengthValid ? <Check size={12} /> : <div className="w-3 h-3 rounded-full bg-slate-400" />}
                                รหัสผ่านอย่างน้อย 8 ตัวอักษร
                            </div>
                            <div className={`flex items-center gap-1 ${isPasswordMatch ? 'text-green-700' : 'text-slate-500'}`}>
                                {isPasswordMatch ? <Check size={12} /> : <div className="w-3 h-3 rounded-full bg-slate-400" />}
                                รหัสผ่านตรงกัน
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleRegister}
                        disabled={!isFormValid || loading}
                        className="w-full bg-[#437393] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#365d75] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                    >
                        {loading ? <> <Loader2 size={20} className="animate-spin" /> กำลังลงทะเบียน... </> : 'ลงทะเบียน'}
                    </button>
                </div>

                <div className="mt-8 text-sm font-medium text-slate-800">
                    มีบัญชีอยู่แล้ว? <Link href="/login" className="font-bold hover:underline text-[#2c4f6d]">เข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    )
}
