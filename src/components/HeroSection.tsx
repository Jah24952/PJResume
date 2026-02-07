'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function HeroSection() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
                <h1 className="text-6xl font-bold text-slate-700">Resume</h1>
                <h2 className="text-3xl text-slate-500 font-normal">ทำเรซูเม่สอนไลน์ฟรี</h2>

                <div className="pt-4">
                    <button
                        onClick={() => {
                            const user = useAuthStore.getState().user
                            if (!user) {
                                window.location.href = '/login'
                            } else {
                                window.location.href = '/resume/select-mode'
                            }
                        }}
                        className="inline-block px-12 py-4 border-2 border-slate-300 text-slate-600 text-xl rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                        เริ่มสร้างเรซูเม่
                    </button>
                </div>

                <p className="text-slate-500 text-lg pt-2">
                    สร้างเรซูเม่ได้ทั้งภาษาไทย ภาษาอังกฤษ
                </p>
            </div>

            <div className="flex-1 relative">
                {/* Resume Preview Image */}
                <div className="relative w-full aspect-[3/4] max-w-[500px] mx-auto">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-4 -right-4 w-full h-full bg-slate-200 rounded-lg transform rotate-6 opacity-40"></div>
                    <div className="absolute top-2 -right-2 w-full h-full bg-slate-300 rounded-lg transform rotate-3 opacity-40"></div>

                    {/* Main Resume Preview */}
                    <div className="relative w-full h-full bg-white shadow-2xl rounded-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl border border-slate-100">
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
