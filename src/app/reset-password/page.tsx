'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState<'' | 'loading' | 'success' | 'error'>('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('ไม่พบ Token สำหรับเปลี่ยนรหัสผ่าน หรือลิงก์อาจไม่ถูกต้อง')
        }
    }, [token])

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setStatus('error')
            setMessage('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
            return
        }

        if (newPassword.length < 6) {
            setStatus('error')
            setMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
            return
        }

        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            })
            const data = await res.json()

            if (data.success) {
                setStatus('success')
                setMessage('เปลี่ยนรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว')
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            } else {
                setStatus('error')
                setMessage(data.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้ ลองอีกครั้ง')
            }
        } catch (err) {
            setStatus('error')
            setMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
        }
    }

    if (!token && status === 'error') {
        return (
            <div className="bg-[#9CC5DF] p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center">
                <h1 className="text-3xl font-bold text-black mb-4">ลิงก์ไม่ถูกต้อง</h1>
                <div className="bg-red-100 text-red-600 p-3 rounded mb-6 text-sm">{message}</div>
                <Link href="/forgot-password" className="text-blue-800 font-bold hover:underline">
                    ขอลิงก์เปลี่ยนรหัสผ่านใหม่
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-[#9CC5DF] p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center">
            <h1 className="text-3xl font-bold text-black mb-8">ตั้งรหัสผ่านใหม่</h1>

            {status === 'error' && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{message}</div>}
            {status === 'success' && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}

            <form onSubmit={handleResetPassword} className="space-y-6">
                <input
                    type="password"
                    placeholder="รหัสผ่านใหม่"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={status === 'success'}
                    className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-lg bg-white text-black placeholder-gray-500"
                />

                <input
                    type="password"
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={status === 'success'}
                    className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-lg bg-white text-black placeholder-gray-500"
                />

                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-[#437393] text-white py-3 rounded-2xl font-bold text-lg hover:bg-[#365d75] transition-colors shadow-lg disabled:opacity-70"
                >
                    {status === 'loading' ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
                </button>
            </form>

            <div className="mt-6 text-sm font-medium text-slate-800">
                <Link href="/login" className="font-bold hover:underline">กลับไปหน้าเข้าสู่ระบบ</Link>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
            <Suspense fallback={<div className="text-lg">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
