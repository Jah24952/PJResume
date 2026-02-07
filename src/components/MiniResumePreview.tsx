import { User, Mail, Phone, MapPin } from 'lucide-react'

type TemplateStyle = 'modern' | 'classic' | 'creative' | 'professional' | 'soft-block' | 'creative-curve' | 'tech-dark' | 'modern-curve' | 'professional-box'

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

    /* --- STYLE 5: SOFT BLOCK (Wanida - Peach/Orange) --- */
    if (style === 'soft-block') {
        const primary = color || '#fb923c' // Default Orange
        const secondary = '#ffe4e6' // Light Peach
        return (
            <div className="w-full h-full bg-white text-[4px] overflow-hidden flex shadow-sm relative pointer-events-none select-none">
                {/* Sidebar */}
                <div className="w-[35%] h-full p-2 flex flex-col gap-2" style={{ backgroundColor: '#fff7ed' }}>
                    <div className="w-12 h-12 rounded-full bg-gray-300 mx-auto mb-1 border-2" style={{ borderColor: primary }} />
                    <div className="space-y-2 text-center">
                        <div className="bg-white p-1 rounded shadow-sm">
                            <div className="h-1 w-full bg-gray-200 rounded" />
                        </div>
                        <div className="bg-white p-1 rounded shadow-sm">
                            <div className="h-1 w-full bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
                {/* Main */}
                <div className="flex-1 p-2 flex flex-col gap-2">
                    <div className="bg-gray-50 p-2 border-l-4" style={{ borderColor: primary }}>
                        <h1 className="font-bold text-[7px]" style={{ color: primary }}>{data.name}</h1>
                        <p className="text-[5px] text-gray-500 uppercase">{data.surname}</p>
                    </div>
                    {/* Blocks */}
                    <div className="space-y-2">
                        <div>
                            <div className="font-bold text-white px-1 py-0.5 mb-1 inline-block rounded-sm" style={{ backgroundColor: primary }}>EXP</div>
                            <div className="h-0.5 bg-gray-100 w-full mb-1" />
                            {data.exp.map((e, i) => <div key={i} className="mb-1 h-1 bg-gray-50 rounded" />)}
                        </div>
                        <div>
                            <div className="font-bold text-white px-1 py-0.5 mb-1 inline-block rounded-sm" style={{ backgroundColor: primary }}>EDU</div>
                            <div className="h-0.5 bg-gray-100 w-full mb-1" />
                            {data.edu.map((e, i) => <div key={i} className="mb-1 h-1 bg-gray-50 rounded" />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* --- STYLE 6: CREATIVE CURVE (Claudia - Purple) --- */
    if (style === 'creative-curve') {
        const primary = color || '#a855f7'
        return (
            <div className="w-full h-full bg-white text-[4px] overflow-hidden flex shadow-sm relative pointer-events-none select-none">
                {/* Purple Curve Sidebar */}
                <div className="w-[35%] h-full p-2 text-white flex flex-col items-center relative" style={{ backgroundColor: primary, borderTopRightRadius: '20px', borderBottomRightRadius: '0px' }}>
                    <div className="w-10 h-10 rounded-full bg-white/20 mb-2 border-2 border-white/50" />
                    <div className="w-full space-y-2 mt-4">
                        <div className="bg-white/20 h-1 w-full rounded" />
                        <div className="bg-white/20 h-1 w-2/3 rounded" />
                        <div className="bg-white/20 h-1 w-full rounded" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-white/10 rounded-tl-full" />
                </div>
                {/* Main */}
                <div className="flex-1 p-3">
                    <div className="border-b-2 border-dashed pb-2 mb-2" style={{ borderColor: primary }}>
                        <h1 className="font-bold text-[8px]" style={{ color: primary }}>{data.name}</h1>
                        <p className="text-gray-400 text-[5px]">{data.job}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="bg-gray-50 p-1 rounded-lg border border-dashed" style={{ borderColor: primary }}>
                            <div className="font-bold mb-1 text-[5px]" style={{ color: primary }}>EXPERIENCE</div>
                            {data.exp.map((e, i) => <div key={i} className="mb-0.5 h-0.5 bg-gray-200 w-full" />)}
                        </div>
                        <div className="bg-gray-50 p-1 rounded-lg border border-dashed" style={{ borderColor: primary }}>
                            <div className="font-bold mb-1 text-[5px]" style={{ color: primary }}>EDUCATION</div>
                            {data.edu.map((e, i) => <div key={i} className="mb-0.5 h-0.5 bg-gray-200 w-full" />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* --- STYLE 7: TECH DARK (Connor - Black/White) --- */
    if (style === 'tech-dark') {
        const primary = color === '#000000' ? '#111' : color
        return (
            <div className="w-full h-full bg-white text-[4px] overflow-hidden flex flex-col shadow-sm relative pointer-events-none select-none">
                {/* Header Dark */}
                <div className="h-[25%] flex items-center px-3 gap-3 text-white" style={{ backgroundColor: '#111' }}>
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                    <div>
                        <h1 className="font-bold text-[7px] tracking-widest uppercase">{data.name}</h1>
                        <p className="text-gray-400 text-[5px] font-mono">&lt;{data.job} /&gt;</p>
                    </div>
                </div>
                <div className="flex-1 grid grid-cols-[1fr_2fr]">
                    <div className="bg-gray-100 p-2 border-r border-gray-300">
                        <div className="font-bold mb-1">SKILLS</div>
                        <div className="flex flex-wrap gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="bg-black text-white px-1 rounded-[1px]">{`Skill${i}`}</div>)}
                        </div>
                    </div>
                    <div className="p-2 space-y-2">
                        <div>
                            <div className="font-bold border-l-2 bg-gray-50 pl-1" style={{ borderColor: '#111' }}>WORK_HISTORY</div>
                            {data.exp.map((e, i) => (
                                <div key={i} className="mt-1">
                                    <div className="font-bold text-[5px]">{e}</div>
                                    <div className="text-gray-400 font-mono">2020 - NOW</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* --- STYLE 8: MODERN CURVE (Olivia - Orange/Red) --- */
    if (style === 'modern-curve') {
        const primary = color || '#f97316'
        return (
            <div className="w-full h-full bg-white text-[4px] overflow-hidden shadow-sm relative pointer-events-none select-none">
                <div className="absolute top-0 right-0 w-[60%] h-[40%] rounded-bl-[100px] z-0 opacity-20" style={{ backgroundColor: primary }} />
                <div className="relative z-10 p-3 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="font-bold text-[8px] text-gray-800">{data.name}</h1>
                            <h2 className="font-bold text-[8px] text-gray-600">{data.surname}</h2>
                            <p className="mt-1 px-1 py-0.5 text-white inline-block rounded" style={{ backgroundColor: primary }}>{data.job}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 shadow-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        <div className="space-y-2">
                            <div className="font-bold text-gray-700 border-b border-gray-200 pb-0.5">ABOUT</div>
                            <div className="text-gray-500 leading-tight">{data.summary.substring(0, 50)}...</div>
                            <div className="font-bold text-gray-700 border-b border-gray-200 pb-0.5 mt-2">CONTACT</div>
                            <div className="text-gray-500">123 Street</div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-bold text-gray-700 border-b border-gray-200 pb-0.5">EXPERIENCE</div>
                            {data.exp.map((e, i) => (
                                <div key={i} className="mb-1">
                                    <div className="font-bold text-[5px]" style={{ color: primary }}>{e}</div>
                                    <div className="h-0.5 w-full bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* --- STYLE 9: PROFESSIONAL BOX (Olivia - Blue) --- */
    if (style === 'professional-box') {
        const primary = color || '#3b82f6'
        return (
            <div className="w-full h-full bg-gray-50 text-[4px] overflow-hidden flex flex-col shadow-sm relative pointer-events-none select-none p-2">
                <div className="bg-white rounded-lg shadow-sm p-2 mb-2 flex items-center gap-2 border-t-4" style={{ borderColor: primary }}>
                    <div className="w-10 h-10 rounded bg-gray-200 shrink-0" />
                    <div>
                        <h1 className="font-bold text-[7px]" style={{ color: primary }}>{data.name} {data.surname}</h1>
                        <p className="text-gray-400 text-[5px] uppercase tracking-wider">{data.job}</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-1">
                    <div className="w-[30%] space-y-2">
                        <div className="bg-white p-1 rounded shadow-sm h-full">
                            <div className="font-bold mb-1 text-gray-700 bg-gray-100 p-0.5 rounded text-center">SKILLS</div>
                            <div className="space-y-1">
                                {[1, 2, 3].map(i => <div key={i} className="h-1 bg-gray-100 rounded w-full" />)}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="bg-white p-1 rounded shadow-sm">
                            <div className="font-bold mb-1 text-gray-700 border-b pb-0.5">EXPERIENCE</div>
                            {data.exp.map((e, i) => <div key={i} className="mb-1 text-[5px] text-gray-600">{e}</div>)}
                        </div>
                        <div className="bg-white p-1 rounded shadow-sm">
                            <div className="font-bold mb-1 text-gray-700 border-b pb-0.5">EDUCATION</div>
                            {data.edu.map((e, i) => <div key={i} className="mb-1 text-[5px] text-gray-600">{e}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
