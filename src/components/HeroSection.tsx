'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 overflow-hidden">
            {/* ========== LEFT CONTENT ========== */}
            <div className="flex-1 space-y-4 text-center md:text-left relative z-10">

                {/* Large Resumate Branding */}
                <div className="relative inline-block">
                    {/* Decorative dots */}
                    <span className="absolute -top-3 -left-4 w-3 h-3 rounded-full bg-[#437393]/70 animate-pulse hidden md:block"></span>
                    <span className="absolute -top-1 -left-1 w-1.5 h-1.5 rounded-full bg-[#437393]/40 hidden md:block"></span>
                    <span className="absolute top-1 right-0 w-2 h-2 rounded-full bg-[#437393]/30 hidden md:block"></span>

                    <h1
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] font-bold tracking-tight leading-none"
                        style={{
                            fontFamily: "'Playfair Display', 'Georgia', serif",
                            color: '#3a5a78',
                            letterSpacing: '-2px',
                        }}
                    >
                        Resumate<span className="text-[#437393]/40">.</span>
                    </h1>
                </div>

                {/* Thai Subtitle */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3a5a78]"
                        style={{
                            fontFamily: "'Prompt', sans-serif",
                        }}
                    >
                        สร้างเรซูเม่
                    </h2>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-lg mx-auto md:mx-0 leading-relaxed" style={{ fontFamily: "'Prompt', sans-serif" }}>
                    ออกแบบ ประวัติส่วนตัวในฉบับของคุณได้ง่ายใน 5 ขั้นตอน
                </p>

                {/* CTA Buttons - Hand-drawn / Sketch style */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <button
                        onClick={() => {
                            const user = useAuthStore.getState().user
                            if (!user) {
                                window.location.href = '/login'
                            } else {
                                window.location.href = '/resume/select-mode'
                            }
                        }}
                        className="hero-btn-primary group relative px-8 py-3.5 text-lg font-semibold text-[#3a5a78] rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                        style={{ fontFamily: "'Prompt', sans-serif" }}
                    >
                        เริ่มสร้างเรซูเม่
                    </button>
                    <Link
                        href="/resume/templates"
                        className="hero-btn-secondary group relative px-8 py-3.5 text-lg font-semibold text-slate-600 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                        style={{ fontFamily: "'Prompt', sans-serif" }}
                    >
                        ดูรูปแบบทั้งหมด
                    </Link>
                </div>

                {/* Bottom Features */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-6 text-slate-500 text-sm" style={{ fontFamily: "'Prompt', sans-serif" }}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        รองรับภาษาไทย และ ภาษาอังกฤษ
                    </span>
                    <span className="hidden sm:block text-slate-300">•</span>
                    <span className="flex items-center gap-2" title="โครงสร้าง PDF ถูกออกแบบมาให้อ่าน Text ได้เต็มประสิทธิภาพ ไม่มีตารางซ้อนทับ เพิ่มโอกาสผ่านระบบคัดกรอง ATS">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ATS-Optimized PDF
                    </span>
                </div>
            </div>

            {/* ========== RIGHT CONTENT - Resume Preview ========== */}
            <div className="flex-1 relative w-full mt-6 lg:mt-0">
                {/* Background Raw Input Layer */}
                <div className="absolute top-10 right-4 lg:-right-4 w-[75%] max-w-[350px] bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-sm rotate-6 z-0 p-5 hidden sm:block">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-[10px] text-slate-400 font-mono ml-2">raw_input.txt</span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px] opacity-70 space-y-1.5">
                        <p className="text-indigo-500">{"// Prompt"}</p>
                        <p>Write me a good resume for UI/UX designer role.</p>
                        <p className="text-indigo-500 mt-2">{"// My rough experience"}</p>
                        <p>- Did UI design at Tech Startup for 3 months</p>
                        <p>- Got 1st place in university startup contest 2024</p>
                        <p>- Have 3.65 GPA from university</p>
                    </div>
                </div>

                <div className="relative w-[85%] sm:w-[70%] max-w-[450px] mx-auto md:ml-auto z-10">
                    {/* Decorative Glowing Background */}
                    <div className="absolute top-4 -right-4 w-full h-full bg-gradient-to-br from-indigo-300 to-purple-300 rounded-2xl transform rotate-3 opacity-50 blur-[8px]"></div>

                    {/* AI Mini Dashboard */}
                    <div className="absolute -left-8 lg:-left-16 top-16 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-indigo-100 z-30 hidden sm:block group/card hover:-translate-y-1 transition-transform cursor-default">
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            <h4 className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">AI Analysis</h4>
                        </div>
                        <div className="space-y-2 text-[11px] font-medium">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-600">Grammar</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Perfect</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-600">Impact</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> High</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-600">Tone</span>
                                <span className="text-indigo-600 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Professional</span>
                            </div>
                        </div>
                    </div>

                    {/* ATS Score Badge */}
                    <div className="absolute -right-6 top-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg shadow-lg z-30 hidden sm:block rotate-6 hover:rotate-0 transition-transform cursor-default border border-white/20">
                        <span className="text-xs font-bold tracking-wide">ATS-Optimized</span>
                    </div>

                    {/* Main Resume Preview Card */}
                    <div className="relative w-full aspect-[1/1.4] bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-500/30 border border-slate-100 group">
                        
                        {/* Interactive Callout Badges (Hover-to-reveal) */}
                        <div className="absolute inset-0 z-50 pointer-events-none">
                            {/* Summary Badge */}
                            <div className="absolute top-[32%] left-[38%] pointer-events-auto">
                                <div className="group/callout flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white shadow-sm relative"><div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75"></div></div>
                                    <div className="h-px w-6 bg-purple-400"></div>
                                    <div className="bg-white border border-purple-200 text-purple-700 px-2 py-1 rounded shadow-md text-[9px] font-bold cursor-default flex items-center gap-1 hover:pr-3 transition-all duration-300 relative overflow-hidden group-hover/callout:bg-purple-50">
                                        <span>Auto-Written</span>
                                        <span className="hidden group-hover/callout:inline-block text-slate-600 font-medium ml-1 whitespace-nowrap animate-in fade-in slide-in-from-left-1">
                                            | AI generated professional summary
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Verbs Badge */}
                            <div className="absolute bottom-[20%] left-[28%] pointer-events-auto">
                                <div className="group/callout flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm relative"><div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></div></div>
                                    <div className="h-px w-6 bg-blue-400"></div>
                                    <div className="bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded shadow-md text-[9px] font-bold cursor-default flex items-center gap-1 hover:pr-3 transition-all duration-300 relative overflow-hidden group-hover/callout:bg-blue-50">
                                        <span>Action Verbs</span>
                                        <span className="hidden group-hover/callout:inline-block text-slate-600 font-medium ml-1 whitespace-nowrap animate-in fade-in slide-in-from-left-1">
                                            | Changed &apos;Did UI&apos; to &apos;Spearheaded&apos;
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resume Layout Design */}
                        <div className="w-full h-full relative bg-[#fafafa] font-sans text-slate-800 overflow-hidden">
                            {/* Top Header Background */}
                            <div className="absolute top-0 left-0 w-full h-[23%] bg-[#437393]"></div>
                            
                            {/* Left Sidebar Column */}
                            <div className="absolute top-[23%] left-0 w-[38%] h-[77%] bg-[#eef2ff] border-r border-[#b4c6ff]/30"></div>
                            
                            {/* Header Extension */}
                            <div className="absolute top-[23%] left-0 w-[38%] h-[12%] bg-[#437393] rounded-b-[40px]"></div>

                            {/* Profile Picture Placeholder */}
                            <div className="absolute top-[20%] left-[19%] -translate-x-1/2 -translate-y-1/2 w-[24%] aspect-square bg-white rounded-full flex flex-col items-center justify-center overflow-hidden z-10 shadow-md border-[4px] border-white group-hover:border-indigo-200 transition-colors duration-500">
                                <div className="w-[45%] h-[45%] bg-slate-200 rounded-full mt-2"></div>
                                <div className="w-[80%] h-[50%] bg-slate-200 rounded-t-full mt-1"></div>
                            </div>

                            {/* Text Content Overlay */}
                            <div className="absolute inset-0 z-20 flex">
                                {/* Left Sidebar Content */}
                                <div className="w-[38%] h-full pt-[42%] px-3 flex flex-col items-center text-center">
                                    <h3 className="text-[#5a6b8c] font-bold text-[10px] sm:text-xs mb-3">CONTACT</h3>
                                    <div className="text-slate-500 text-[6px] sm:text-[7px] space-y-2 mb-5 font-medium w-full">
                                        <p className="flex items-center justify-center gap-1.5"><MapPin size={8} className="inline text-slate-400"/> Bangkok, TH</p>
                                        <p className="flex items-center justify-center gap-1.5"><Phone size={8} className="inline text-slate-400"/> +66 89 123 4567</p>
                                        <p className="flex items-center justify-center gap-1.5"><Mail size={8} className="inline text-slate-400"/> ananya.s@email.com</p>
                                    </div>

                                    <div className="w-8 h-[2px] bg-indigo-100 mb-5"></div>

                                    <h3 className="text-[#5a6b8c] font-bold text-[10px] sm:text-xs mb-3">SKILLS</h3>
                                    <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 px-1">
                                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[5px] sm:text-[6px] font-semibold border border-indigo-100">Figma</span>
                                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[5px] sm:text-[6px] font-semibold border border-indigo-100">UI/UX</span>
                                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[5px] sm:text-[6px] font-semibold border border-indigo-100">Prototyping</span>
                                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[5px] sm:text-[6px] font-semibold border border-indigo-100">Wireframing</span>
                                    </div>
                                </div>

                                {/* Right Main Content */}
                                <div className="w-[62%] h-full">
                                    {/* Header Text */}
                                    <div className="h-[23%] flex flex-col justify-center pl-6 pt-2">
                                        <p className="text-indigo-300 text-[9px] sm:text-[11px] font-bold tracking-[0.2em] uppercase">UI/UX Designer</p>
                                        <h1 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight mt-1 tracking-tight">Ananya<br/>Supakorn</h1>
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="pt-6 sm:pt-7 pl-6 pr-6">
                                        
                                        {/* Professional Summary */}
                                        <div className="mb-5 sm:mb-6">
                                            <h2 className="text-slate-800 font-bold text-[11px] sm:text-[13px] mb-2 uppercase tracking-wide border-b-2 border-indigo-100 inline-block pb-0.5">Summary</h2>
                                            <p className="text-[6.5px] sm:text-[8px] text-slate-600 leading-[1.6]">
                                                <span className="bg-purple-100 text-purple-700 px-0.5 rounded-sm font-semibold transition-colors duration-300 hover:bg-purple-200 cursor-default">Auto-Written</span> with a passion for <span className="bg-purple-100 text-purple-700 px-0.5 rounded-sm font-semibold transition-colors duration-300 hover:bg-purple-200 cursor-default">crafting</span> intuitive digital experiences. Proven ability to <span className="bg-purple-100 text-purple-700 px-0.5 rounded-sm font-semibold transition-colors duration-300 hover:bg-purple-200 cursor-default">optimize</span> user journeys and increase engagement.
                                            </p>
                                        </div>

                                        {/* Experience Section */}
                                        <h2 className="text-slate-800 font-bold text-[11px] sm:text-[13px] mb-3 uppercase tracking-wide border-b-2 border-indigo-100 inline-block pb-0.5">
                                            Experience
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute left-[-9px] top-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                <div className="absolute left-[-6px] top-3 bottom-[-16px] w-[1px] bg-slate-200"></div>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <p className="font-bold text-slate-800 text-[8px] sm:text-[10px]">Product Designer</p>
                                                    <span className="text-slate-400 text-[6px] sm:text-[7px] font-medium">2025 - Present</span>
                                                </div>
                                                <p className="text-indigo-600 text-[6.5px] sm:text-[7.5px] font-semibold mb-1">Tech Startup Co.</p>
                                                <ul className="text-slate-600 text-[6.5px] sm:text-[7.5px] space-y-1 list-disc pl-2.5">
                                                    <li><span className="bg-blue-100 text-blue-700 px-0.5 rounded-sm font-semibold transition-colors duration-300 hover:bg-blue-200 cursor-default">Spearheaded</span> the redesign of core mobile app.</li>
                                                    <li><span className="bg-blue-100 text-blue-700 px-0.5 rounded-sm font-semibold transition-colors duration-300 hover:bg-blue-200 cursor-default">Collaborated</span> with engineering teams.</li>
                                                </ul>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute left-[-9px] top-1.5 w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <p className="font-bold text-slate-800 text-[8px] sm:text-[10px]">UI/UX Intern</p>
                                                    <span className="text-slate-400 text-[6px] sm:text-[7px] font-medium">Summer 2024</span>
                                                </div>
                                                <p className="text-indigo-600 text-[6.5px] sm:text-[7.5px] font-semibold mb-1">Creative Agency</p>
                                                <ul className="text-slate-600 text-[6.5px] sm:text-[7.5px] space-y-1 list-disc pl-2.5">
                                                    <li><span className="bg-blue-100 text-blue-700 px-0.5 rounded-sm font-semibold transition-colors duration-300 hover:bg-blue-200 cursor-default">Awarded</span> 1st place in design hackathon.</li>
                                                </ul>
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
