'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'' | 'loading' | 'success' | 'error'>('')
    const [message, setMessage] = useState('')
    const [devLink, setDevLink] = useState('')

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')
        setDevLink('')

        try {
            const res = await fetch('https://project-rs-ats.project-rs-ats.workers.dev/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()

            if (data.success) {
                setStatus('success')
                setMessage(data.message || 'ส่งลิงก์สำหรับเปลี่ยนรหัสผ่านไปที่อีเมลของคุณแล้ว (หากมีอีเมลนี้ในระบบ)')
                if (data.dev_reset_link) {
                    setDevLink(data.dev_reset_link)
                }
            } else {
                setStatus('error')
                setMessage(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
            }
        } catch (err) {
            setStatus('error')
            setMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
            <div className="bg-[#9CC5DF] p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center">
                <h1 className="text-3xl font-bold text-black mb-4">ลืมรหัสผ่าน</h1>
                <p className="text-sm text-slate-800 mb-8">
                    กรุณากรอกอีเมลที่ใช้สมัครบัญชี เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้คุณ
                </p>

                {status === 'error' && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{message}</div>}
                {status === 'success' && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm break-words">
                        <p>{message}</p>
                        {devLink && (
                            <div className="mt-2 p-2 border border-green-300 rounded bg-green-50 text-xs">
                                <p className="font-bold text-slate-800">[สำหรับ DEV เท่านั้น] คลิกลิงก์ด้านล่างเพื่อเปลี่ยนรหัส:</p>
                                <a href={devLink} className="text-blue-600 hover:underline">{devLink}</a>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-6">
                    <input
                        type="email"
                        placeholder="อีเมล"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-500 text-lg bg-white text-black placeholder-gray-500"
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-[#437393] text-white py-3 rounded-2xl font-bold text-lg hover:bg-[#365d75] transition-colors shadow-lg disabled:opacity-70"
                    >
                        {status === 'loading' ? 'กำลังส่ง...' : 'ขอลิงก์เปลี่ยนรหัสผ่าน'}
                    </button>
                </form>

                <div className="mt-6 text-sm font-medium text-slate-800">
                    <Link href="/login" className="font-bold hover:underline">กลับไปหน้าเข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    )
}
