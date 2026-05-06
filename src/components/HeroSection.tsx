'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { MapPin, Phone, Mail, Mic, Music, Film } from 'lucide-react';
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
                        <div className="w-full h-full relative bg-[#fafafa] font-sans text-slate-800 overflow-hidden">
                            {/* Top Header Background */}
                            <div className="absolute top-0 left-0 w-full h-[23%] bg-[#b4c6ff]"></div>
                            
                            {/* Left Sidebar Column background */}
                            <div className="absolute top-[23%] left-0 w-[38%] h-[77%] bg-[#eef2ff]"></div>
                            
                            {/* The extended rounded part of the top header over the left sidebar */}
                            <div className="absolute top-[23%] left-0 w-[38%] h-[12%] bg-[#b4c6ff] rounded-b-3xl"></div>

                            {/* Profile Picture Placeholder */}
                            <div className="absolute top-[20%] left-[19%] -translate-x-1/2 -translate-y-1/2 w-[24%] aspect-square bg-[#ffffff] rounded-full flex flex-col items-center justify-center overflow-hidden z-10 shadow-sm border-[4px] border-white">
                                <div className="w-[45%] h-[45%] bg-slate-100 rounded-full mt-2"></div>
                                <div className="w-[80%] h-[50%] bg-slate-100 rounded-t-full mt-1"></div>
                            </div>

                            {/* Text Content Overlay */}
                            <div className="absolute inset-0 z-20 flex">
                                {/* Left Sidebar Content */}
                                <div className="w-[38%] h-full pt-[42%] px-3 flex flex-col items-center text-center">
                                    {/* ข้อมูลส่วนตัว */}
                                    <h3 className="text-[#5a6b8c] font-bold text-xs sm:text-sm mb-3 sm:mb-4">ข้อมูลส่วนตัว</h3>
                                    <div className="text-[#64748b] text-[6px] sm:text-[8px] space-y-2 mb-4 font-medium">
                                        <p>26 มีนาคม 2548</p>
                                        <p>18 ปี</p>
                                        <p className="flex items-center justify-center gap-1.5 mt-3"><MapPin size={10} className="inline"/> 123 Anywhere St., Any City</p>
                                        <p className="flex items-center justify-center gap-1.5"><Phone size={10} className="inline"/> +123-456-7890</p>
                                        <p className="flex items-center justify-center gap-1.5"><Mail size={10} className="inline"/> hello@reallygreatsite.com</p>
                                    </div>

                                    <div className="w-10 h-px bg-[#a6b8ff]/40 mb-4 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#b4c6ff]/80 rotate-45"></div></div>

                                    {/* ทักษะด้านภาษา */}
                                    <h3 className="text-[#5a6b8c] font-bold text-xs sm:text-sm mb-3 sm:mb-4">ทักษะด้านภาษา</h3>
                                    <div className="text-[#64748b] text-[7px] sm:text-[9px] space-y-1.5 mb-4 font-medium">
                                        <p>Thai</p>
                                        <p>English</p>
                                        <p>Chinese</p>
                                    </div>

                                    <div className="w-10 h-px bg-[#a6b8ff]/40 mb-4 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#b4c6ff]/80 rotate-45"></div></div>

                                    {/* ความสามารถพิเศษ */}
                                    <h3 className="text-[#5a6b8c] font-bold text-xs sm:text-[13px] mb-3 sm:mb-4">ความสามารถพิเศษ</h3>
                                    <div className="flex justify-center gap-2 sm:gap-3 text-[#64748b]">
                                        <div className="flex flex-col items-center">
                                            <Mic size={14} className="mb-1" />
                                            <span className="text-[5px] sm:text-[6px]">ร้องเพลง</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Music size={14} className="mb-1" />
                                            <span className="text-[5px] sm:text-[6px]">เล่นดนตรี</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Film size={14} className="mb-1" />
                                            <span className="text-[5px] sm:text-[6px]">ตัดต่อวิดีโอ</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Main Content */}
                                <div className="w-[62%] h-full">
                                    {/* Header Text */}
                                    <div className="h-[23%] flex flex-col justify-center pl-6 pt-2">
                                        <p className="text-white text-[11px] sm:text-sm font-medium tracking-wide opacity-90">Resume</p>
                                        <h1 className="text-white text-3xl sm:text-[40px] font-bold leading-[1.1] mt-0.5 tracking-wide">Ananya<br/>Supakorn</h1>
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="pt-6 sm:pt-8 pl-6 pr-6">
                                        {/* ประวัติการศึกษา */}
                                        <h2 className="text-[#5a6b8c] font-bold text-sm sm:text-[15px] mb-4 sm:mb-5">
                                            ประวัติการศึกษา
                                        </h2>
                                        
                                        <div className="space-y-4 sm:space-y-5 mb-8">
                                            <div className="flex items-center text-[7px] sm:text-[9px] gap-2 sm:gap-3">
                                                <div className="w-[25%] shrink-0 text-[#5a6b8c] font-medium">ปี 2563-2566</div>
                                                <div className="flex-1 border-l-2 border-[#eef2ff] pl-2 sm:pl-3 relative">
                                                    <div className="absolute w-1.5 h-1.5 rounded-full bg-[#eef2ff] -left-[4px] top-1/2 -translate-y-1/2"></div>
                                                    <p className="font-bold text-[#64748b] text-[9px] sm:text-[11px]">ระดับมัธยมปลาย</p>
                                                    <p className="text-[#94a3b8] mt-0.5">โรงเรียน Borcelle</p>
                                                </div>
                                                <div className="bg-white px-2 py-1 rounded-full text-[5px] sm:text-[7px] text-[#7d93e8] font-semibold shadow-sm whitespace-nowrap">เกรดเฉลี่ย 3.30</div>
                                            </div>
                                            
                                            <div className="flex items-center text-[7px] sm:text-[9px] gap-2 sm:gap-3">
                                                <div className="w-[25%] shrink-0 text-[#5a6b8c] font-medium">ปี 2560-2563</div>
                                                <div className="flex-1 border-l-2 border-[#eef2ff] pl-2 sm:pl-3 relative">
                                                    <div className="absolute w-1.5 h-1.5 rounded-full bg-[#eef2ff] -left-[4px] top-1/2 -translate-y-1/2"></div>
                                                    <p className="font-bold text-[#64748b] text-[9px] sm:text-[11px]">ระดับมัธยมต้น</p>
                                                    <p className="text-[#94a3b8] mt-0.5">โรงเรียน Borcelle</p>
                                                </div>
                                                <div className="bg-white px-2 py-1 rounded-full text-[5px] sm:text-[7px] text-[#7d93e8] font-semibold shadow-sm whitespace-nowrap">เกรดเฉลี่ย 3.30</div>
                                            </div>

                                            <div className="flex items-center text-[7px] sm:text-[9px] gap-2 sm:gap-3">
                                                <div className="w-[25%] shrink-0 text-[#5a6b8c] font-medium">ปี 2554-2560</div>
                                                <div className="flex-1 border-l-2 border-[#eef2ff] pl-2 sm:pl-3 relative">
                                                    <div className="absolute w-1.5 h-1.5 rounded-full bg-[#eef2ff] -left-[4px] top-1/2 -translate-y-1/2"></div>
                                                    <p className="font-bold text-[#64748b] text-[9px] sm:text-[11px]">ระดับประถม</p>
                                                    <p className="text-[#94a3b8] mt-0.5">โรงเรียน Rimberio</p>
                                                </div>
                                                <div className="bg-white px-2 py-1 rounded-full text-[5px] sm:text-[7px] text-[#7d93e8] font-semibold shadow-sm whitespace-nowrap">เกรดเฉลี่ย 3.30</div>
                                            </div>
                                        </div>

                                        {/* เกียรติบัตร */}
                                        <h2 className="text-[#5a6b8c] font-bold text-sm sm:text-[15px] mb-4 sm:mb-5">
                                            เกียรติบัตร
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            <div className="flex gap-2 sm:gap-3 items-start text-[7px] sm:text-[9px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#b4c6ff] mt-1 shrink-0"></div>
                                                <div>
                                                    <p className="font-bold text-[#64748b] text-[9px] sm:text-[11px]">Lorem ipsum dolor sit amet</p>
                                                    <p className="text-[#94a3b8] leading-tight mt-1 max-w-[85%]">consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 sm:gap-3 items-start text-[7px] sm:text-[9px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#b4c6ff] mt-1 shrink-0"></div>
                                                <div>
                                                    <p className="font-bold text-[#64748b] text-[9px] sm:text-[11px]">Lorem ipsum dolor sit amet</p>
                                                    <p className="text-[#94a3b8] leading-tight mt-1 max-w-[85%]">consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
