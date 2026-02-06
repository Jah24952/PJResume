import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
                <h1 className="text-6xl font-bold text-slate-700">Resume</h1>
                <h2 className="text-3xl text-slate-500 font-normal">ทำเรซูเม่สอนไลน์ฟรี</h2>

                <div className="pt-4">
                    <Link
                        href="/resume/create"
                        className="inline-block px-12 py-4 border-2 border-slate-300 text-slate-600 text-xl rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                        เริ่มสร้างเรซูเม่
                    </Link>
                </div>

                <p className="text-slate-500 text-lg pt-2">
                    สร้างเรซูเม่ได้ทั้งภาษาไทย ภาษาอังกฤษ
                </p>
            </div>

            <div className="flex-1 relative">
                {/* Placeholder for Resume Preview Request Image */}
                <div className="relative w-full aspect-[3/4] bg-white shadow-2xl p-4 rounded-sm rotate-2 transform hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full bg-slate-50 border-2 border-slate-100 p-8 flex flex-col gap-4">
                        {/* Simple mockup content */}
                        <div className="flex gap-4 items-center border-b pb-4">
                            <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="w-32 h-4 bg-slate-300 rounded"></div>
                                <div className="w-24 h-3 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-2 bg-slate-200 rounded"></div>
                            <div className="w-full h-2 bg-slate-200 rounded"></div>
                            <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <div className="w-20 h-4 bg-slate-300 rounded"></div>
                                <div className="w-full h-2 bg-slate-200 rounded"></div>
                                <div className="w-full h-2 bg-slate-200 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="w-20 h-4 bg-slate-300 rounded"></div>
                                <div className="w-full h-2 bg-slate-200 rounded"></div>
                                <div className="w-full h-2 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
