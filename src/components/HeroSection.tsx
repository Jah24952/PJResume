'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function HeroSection() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    AI Resume Builder 2026
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-800 tracking-tight leading-[1.1]">
                    สร้าง <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                        เรซูเม่ระดับโปร
                    </span>
                </h1>
                <h2 className="text-2xl lg:text-3xl text-slate-500 font-medium">
                    ทำให้คุณโดดเด่นกว่าใครแบบออนไลน์ฟรี
                </h2>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <button
                        onClick={() => {
                            const user = useAuthStore.getState().user
                            if (!user) {
                                window.location.href = '/login'
                            } else {
                                window.location.href = '/resume/select-mode'
                            }
                        }}
                        className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white border border-transparent text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/25 hover:-translate-y-1 active:translate-y-0 active:shadow-md transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        เริ่มสร้างเรซูเม่เลย <span className="text-xl">✨</span>
                    </button>
                    <Link
                        href="/resume/templates"
                        className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border-2 border-slate-200 text-lg font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                    >
                        ดูรูปแบบทั้งหมด
                    </Link>
                </div>

                <p className="text-slate-400 text-sm pt-4 flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    รองรับภาษาไทยและภาษาอังกฤษ
                </p>
            </div>

            <div className="flex-1 relative w-full mt-10 md:mt-0">
                {/* Resume Preview Image */}
                <div className="relative w-[85%] sm:w-[70%] max-w-[450px] mx-auto md:ml-auto">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-4 -right-4 w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl transform rotate-6 opacity-40 blur-[2px]"></div>
                    <div className="absolute top-2 -right-2 w-full h-full bg-slate-50 border border-slate-200 rounded-2xl transform rotate-3 shadow-inner"></div>

                    {/* Main Resume Preview */}
                    <div className="relative w-full aspect-[1/1.4] bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-3xl border border-slate-100 z-10 group">
                        <img
                            src="/hero-resume.png"
                            alt="Resume Example"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
