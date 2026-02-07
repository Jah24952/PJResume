'use client'

import Link from 'next/link'
import { FileText, Upload, ArrowLeft } from 'lucide-react'

export default function SelectModePage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
            {/* Header */}
            <header className="h-[60px] bg-white border-b px-6 flex items-center shadow-sm">
                <Link href="/" className="text-2xl font-serif text-[#437393] font-bold">
                    SRG-TJS
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#437393] mb-4">
                        คุณต้องการสร้างประวัติย่อของคุณอย่างไร?
                    </h1>
                    <p className="text-slate-500 text-lg">
                        เลือกวิธีที่คุณต้องการเริ่มต้นสร้างประวัติย่อแบบมืออาชีพ
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                    {/* Option 1: Create New */}
                    <Link
                        href="/resume/setup"
                        className="group bg-white p-8 rounded-3xl border-2 border-transparent hover:border-[#437393] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
                    >
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FileText size={40} className="text-[#437393]" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 mb-3 group-hover:text-[#437393] transition-colors">
                            สร้างประวัติย่อใหม่
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            เราจะช่วยคุณสร้างประวัติทีละขั้นตอน ด้วยเทมเพลตที่สวยงามและคำแนะนำจาก AI
                        </p>

                        <div className="mt-8 px-6 py-2 bg-[#437393] text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-medium">
                            เริ่มต้นใช้งาน
                        </div>
                    </Link>

                    {/* Option 2: Upload Existing */}
                    <Link
                        href="/resume/upload"
                        className="group bg-white p-8 rounded-3xl border-2 border-transparent hover:border-[#437393] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 mb-3 group-hover:text-green-600 transition-colors">
                            ปรับปรุงประวัติย่อที่มีอยู่
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            อัปโหลดประวัติย่อปัจจุบันของคุณ จากนั้นปรับแต่งเนื้อหาและการออกแบบด้วย AI
                        </p>

                        <div className="mt-8 px-6 py-2 bg-green-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-medium">
                            อัปโหลดไฟล์
                        </div>
                    </Link>
                </div>

                <div className="mt-12">
                    <Link href="/" className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} /> ย้อนกลับไปหน้าหลัก
                    </Link>
                </div>
            </main>
        </div>
    )
}
