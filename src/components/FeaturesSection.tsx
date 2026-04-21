import { Sparkles, Zap, Shield, Globe, LayoutTemplate, Download } from 'lucide-react'

export default function FeaturesSection() {
    const features = [
        {
            icon: <LayoutTemplate size={24} className="text-indigo-600" />,
            title: 'เทมเพลตระดับมืออาชีพ',
            description: 'เลือกรูปแบบเรซูเม่ที่ผ่านการออกแบบตามมาตรฐานสากล รองรับทั้งรูปแบบคลาสสิกและโมเดิร์น',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100'
        },
        {
            icon: <Zap size={24} className="text-emerald-600" />,
            title: 'AI ช่วยเขียนอัจฉริยะ',
            description: 'ไม่ต้องปวดหัวกับการคิดคำอีกต่อไป ให้ AI ช่วยสรุปและเกลาเนื้อหาให้ดูเป็นมืออาชีพ',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
        {
            icon: <Globe size={24} className="text-blue-600" />,
            title: 'รองรับสองภาษา',
            description: 'สลับระหว่างภาษาไทยและภาษาอังกฤษได้ง่ายๆ พร้อมระบบแนะนำคำศัพท์ที่เหมาะสม',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            icon: <Shield size={24} className="text-purple-600" />,
            title: 'ATS-Friendly 100%',
            description: 'โครงสร้างและรูปแบบถูกออกแบบมาให้อ่านง่ายสำหรับระบบคัดกรองเรซูเม่ขององค์กร (ATS)',
            bg: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            icon: <Sparkles size={24} className="text-amber-600" />,
            title: 'กำหนดสีและดีไซน์',
            description: 'ปรับแต่งสีสันให้ตรงกับคาแรคเตอร์ของคุณ หรือเลือกใช้สีมาตรฐานของแต่ละสายอาชีพ',
            bg: 'bg-amber-50',
            border: 'border-amber-100'
        },
        {
            icon: <Download size={24} className="text-rose-600" />,
            title: 'ดาวน์โหลด PDF ได้ทันที',
            description: 'ส่งออกเอกสารได้ความละเอียดสูงพร้อมนำไปใช้สมัครงานทันที ไม่มีลายน้ำ',
            bg: 'bg-rose-50',
            border: 'border-rose-100'
        }
    ]

    return (
        <section className="w-full bg-slate-50 py-24 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">คุณสมบัติเด่น</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">ทำไมถึงต้องสร้างเรซูเม่กับเรา?</h3>
                    <p className="text-lg text-slate-500">
                        แพลตฟอร์มที่รวมเครื่องมือทุกอย่างที่คุณต้องการ เพื่อร่างเรซูเม่ให้ออกมาสมบูรณ์แบบ เพิ่มโอกาสได้งานที่ฝัน
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.bg} border ${feature.border}`}>
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h4>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
