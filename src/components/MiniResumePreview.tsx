import { User, Mail, Phone, MapPin } from 'lucide-react'

type TemplateStyle = 'modern' | 'classic' | 'creative' | 'professional'

interface MiniResumePreviewProps {
    style: TemplateStyle
    color: string
}

export default function MiniResumePreview({ style, color }: MiniResumePreviewProps) {
    // Mock Data for Visual
    const data = {
        name: 'ANANYA',
        surname: 'SUPAKORN',
        job: 'PROCESS ENGINEER',
        summary: 'Experienced engineer with a focus on process optimization and design.',
        exp: ['Process Engineer at Tech Corp', 'Junior Analyst at Data Inc'],
        edu: ['B.Eng at Chula', 'High School']
    }

    /* --- STYLE 1: MODERN (Sidebar Left) --- */
    if (style === 'modern') {
        return (
            <div className="w-full h-full bg-white text-[4px] overflow-hidden flex shadow-sm relative pointer-events-none select-none">
                <div className="w-[30%] h-full p-2 flex flex-col gap-2 text-white" style={{ backgroundColor: color }}>
                    <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-1" />
                    <div className="space-y-1 opacity-80">
                        <div className="h-1 w-full bg-white/30 rounded" />
                        <div className="h-1 w-2/3 bg-white/30 rounded" />
                    </div>
                    <div className="mt-auto space-y-1 opacity-60">
                        <div className="h-1 w-full bg-white/30 rounded" />
                        <div className="h-1 w-full bg-white/30 rounded" />
                    </div>
                </div>
                <div className="flex-1 p-2 flex flex-col gap-2">
                    <div className="border-b pb-1" style={{ borderColor: color }}>
                        <h1 className="font-bold text-[6px] text-gray-800 tracking-wider">{data.name} {data.surname}</h1>
                        <p className="text-[4px] text-gray-500">{data.job}</p>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div>
                            <div className="font-bold text-gray-700 mb-0.5">Experience</div>
                            {data.exp.map((e, i) => (
                                <div key={i} className="mb-1">
                                    <div className="font-semibold text-gray-600 truncate">{e}</div>
                                    <div className="text-gray-400 h-0.5 w-full bg-gray-100 mt-0.5" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="font-bold text-gray-700 mb-0.5">Education</div>
                            {data.edu.map((e, i) => (
                                <div key={i} className="mb-1">
                                    <div className="font-semibold text-gray-600 truncate">{e}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* --- STYLE 2: CLASSIC (Centered, Serif) --- */
    if (style === 'classic') {
        return (
            <div className="w-full h-full bg-white text-[4px] overflow-hidden flex flex-col p-3 shadow-sm relative pointer-events-none select-none font-serif">
                <div className="text-center border-b-2 border-gray-800 pb-2 mb-2">
                    <h1 className="font-bold text-[8px] text-gray-900">{data.name} {data.surname}</h1>
                    <p className="text-gray-600 tracking-widest mt-0.5 uppercase">{data.job}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <div>
                        <h3 className="font-bold border-b border-gray-300 mb-1 uppercase text-gray-700">Experience</h3>
                        {data.exp.map((e, i) => (
                            <div key={i} className="mb-1">
                                <div className="flex justify-between font-bold text-gray-800">
                                    <span>{e}</span>
                                    <span>2020-2024</span>
                                </div>
                                <div className="text-gray-500 leading-tight">Responsible for main system optimization...</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-bold border-b border-gray-300 mb-1 uppercase text-gray-700">Summary</h3>
                        <p className="text-gray-600 leading-relaxed text-justify">{data.summary}</p>
                    </div>
                </div>
            </div>
        )
    }

    /* --- STYLE 3: CREATIVE (Header Bg) --- */
    if (style === 'creative') {
        return (
            <div className="w-full h-full bg-white text-[4px] overflow-hidden flex flex-col shadow-sm relative pointer-events-none select-none">
                <div className="h-[25%] w-full flex items-center px-3 gap-2" style={{ backgroundColor: color }}>
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-white/50" />
                    <div className="text-white">
                        <h1 className="font-bold text-[7px]">{data.name}</h1>
                        <p className="opacity-90">{data.job}</p>
                    </div>
                </div>
                <div className="flex-1 p-3 grid grid-cols-[1fr_2fr] gap-3">
                    <div className="bg-gray-50 p-1 rounded space-y-2">
                        <div className="font-bold text-gray-700">Skills</div>
                        <div className="flex flex-wrap gap-1">
                            {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded px-1 py-0.5 border">Skill {i}</div>)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="font-bold text-gray-800 uppercase tracking-wider text-[5px]" style={{ color: color }}>Experience</div>
                        {data.exp.map((e, i) => (
                            <div key={i} className="mb-1 pl-1 border-l-2" style={{ borderColor: color }}>
                                <div className="font-bold text-gray-700">{e}</div>
                                <div className="text-gray-400">2022 - Present</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    /* --- STYLE 4: PROFESSIONAL (Clean Grid) --- */
    if (style === 'professional') {
        return (
            <div className="w-full h-full bg-slate-50 text-[4px] overflow-hidden p-3 shadow-sm relative pointer-events-none select-none">
                <div className="grid grid-cols-[1fr_2fr] gap-3 h-full">
                    <div className="flex flex-col gap-2 text-right border-r pr-2 border-gray-300">
                        <div>
                            <h1 className="font-bold text-[7px] text-gray-900 leading-tight">{data.name}<br />{data.surname}</h1>
                            <p className="text-gray-500 mt-1">{data.job}</p>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="font-bold text-gray-700">Contact</div>
                            <div className="text-gray-500">123 Street, City</div>
                            <div className="text-gray-500">089-123-4567</div>
                            <div className="text-gray-500">email@test.com</div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="bg-white p-2 shadow-sm rounded-sm">
                            <div className="font-bold text-gray-800 mb-1 border-b" style={{ borderColor: color }}>SUMMARY</div>
                            <p className="text-gray-500 leading-relaxed">{data.summary}</p>
                        </div>
                        <div className="bg-white p-2 shadow-sm rounded-sm flex-1">
                            <div className="font-bold text-gray-800 mb-1 border-b" style={{ borderColor: color }}>EXPERIENCE</div>
                            {data.exp.map((e, i) => (
                                <div key={i} className="mb-2">
                                    <div className="font-bold text-gray-700">{e}</div>
                                    <div className="text-gray-400">Company Inc. | 2020</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
