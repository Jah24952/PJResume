'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResumeUploadPage() {
    const router = useRouter()
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleNext = () => {
        // In a real app, we would upload the file here.
        // For now, we simulate success and go to the editor.
        if (file) {
            // Passing a query param to indicate import mode if needed
            router.push('/resume/create?mode=import')
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
            {/* Header */}
            <header className="h-[60px] bg-[#9CC5DF] px-6 flex items-center shadow-md">
                <Link href="/" className="text-2xl font-serif text-[#437393] font-bold">
                    SRG-TJS
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-bold text-[#1e293b] mb-4">
                        ดำเนินการนำเข้าต่อ
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        อัปโหลดประวัติย่อปัจจุบันของคุณในรูปแบบ Word หรือ PDF และเราจะดึงข้อมูล (เท่าที่เราทำได้) ลงในเทมเพลต
                    </p>
                </div>

                <div
                    className={`w-full max-w-3xl bg-[#F1F8FD] border-2 border-dashed rounded-xl h-80 flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'border-[#437393] bg-blue-50 scale-[1.02]' : 'border-[#437393]/30 hover:border-[#437393]/60'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div className="text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <p className="text-lg font-bold text-slate-700 mb-2">{file.name}</p>
                            <p className="text-sm text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button onClick={() => setFile(null)} className="text-red-500 text-sm hover:underline">
                                ยกเลิกและเลือกใหม่
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-[#437393] mb-8 font-medium">ลากและวางไฟล์ของคุณที่นี่เพื่ออัพโหลด</p>
                            <p className="text-slate-400 text-sm mb-6 font-bold">หรือ</p>
                            <label className="cursor-pointer">
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileSelect} />
                                <div className="bg-white border border-[#437393] text-[#437393] px-8 py-3 rounded-lg font-medium hover:bg-[#437393] hover:text-white transition-all shadow-sm">
                                    เลือกไฟล์ประวัติย่อของคุณ
                                </div>
                            </label>
                        </>
                    )}
                </div>
            </main>

            {/* Bottom Navigation */}
            <div className="bg-white border-t p-4 px-6 md:px-12 flex justify-between items-center sticky bottom-0 z-50">
                <Link
                    href="/resume/select-mode"
                    className="bg-[#D1E5F4] text-[#1e293b] px-8 py-3 rounded-lg font-bold hover:bg-[#b0d4ef] transition-colors"
                >
                    กลับ
                </Link>

                <button
                    onClick={handleNext}
                    disabled={!file}
                    className={`px-8 py-3 rounded-lg font-bold transition-all shadow-md ${file ? 'bg-[#437393] text-white hover:bg-[#365d75] active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                    ถัดไป
                </button>
            </div>
        </div>
    )
}
