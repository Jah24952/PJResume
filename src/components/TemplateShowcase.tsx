'use client';
import Link from 'next/link';
import MiniResumePreview from './MiniResumePreview';

export default function TemplateShowcase() {
    return (
        <section className="w-full bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
                <h2 className="text-4xl font-bold text-black font-serif">เลือกเทมเพลต CV</h2>
                <p className="text-gray-500 max-w-2xl text-center">
                    เริ่มต้นอาชีพของคุณด้วยเรซูเม่ที่ออกแบบมาอย่างมืออาชีพ รองรับทั้งภาษาไทยและอังกฤษ
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {[
                        { id: 1, name: 'Modern Blue', style: 'modern', color: '#437393' },
                        { id: 2, name: 'Classic Elegance', style: 'classic', color: '#333333' },
                        { id: 3, name: 'Creative Teal', style: 'creative', color: '#2dd4bf' },
                        { id: 4, name: 'Professional Gray', style: 'professional', color: '#94a3b8' },
                    ].map((item) => (
                        <div key={item.id} className="aspect-[210/297] bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer group relative">
                            {/* Live Preview */}
                            <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-105">
                                <MiniResumePreview
                                    style={item.style as any}
                                    color={item.color}
                                />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-[#437393]/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                                <Link
                                    href={`/resume/create?template=${item.id}`}
                                    className="px-6 py-2 bg-[#437393] text-white rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-[#345b75]"
                                >
                                    เลือกเทมเพลตนี้
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 mt-8">
                    <Link
                        href="/resume/templates"
                        className="px-8 py-3 bg-[#9CC5DF] text-[#437393] rounded-full font-bold hover:bg-[#8bb4ce] transition-colors text-lg"
                    >
                        ดูเทมเพลตทั้งหมด (8 แบบ)
                    </Link>
                </div>
            </div>
        </section>
    );
}
