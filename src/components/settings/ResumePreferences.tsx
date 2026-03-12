import { useState } from 'react'
import { FileText, Type, LayoutTemplate, Maximize, Save } from 'lucide-react'

export default function ResumePreferences() {
    const [preferences, setPreferences] = useState({
        language: 'th',
        template: 'modern',
        font: 'inter',
        paperSize: 'a4',
        autoSave: true
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target
        setPreferences({
            ...preferences,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        // Mock API call
        setTimeout(() => {
            setLoading(false)
            setMessage({ type: 'success', text: 'บันทึกการตั้งค่าเรซูเม่เริ่มต้นเรียบร้อยแล้ว' })
        }, 800)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-in fade-in duration-300">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <FileText size={20} className="text-[#437393]" /> การตั้งค่าเรซูเม่ (Resume Preferences)
                </h3>
                <p className="text-gray-500 text-sm mb-6">ตั้งค่าเริ่มต้นสำหรับการสร้างเรซูเม่ใหม่ในครั้งถัดไป</p>
            </div>

            {message.text && (
                <div className={`p-3 mb-6 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default Language */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">ภาษาเริ่มต้น (Default Language)</label>
                        <select
                            name="language"
                            value={preferences.language}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all bg-white"
                        >
                            <option value="th">ภาษาไทย (Thai)</option>
                            <option value="en">English (อังกฤษ)</option>
                        </select>
                    </div>

                    {/* Default Template */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">เทมเพลตเริ่มต้น (Default Template)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LayoutTemplate size={16} className="text-gray-400" />
                            </div>
                            <select
                                name="template"
                                value={preferences.template}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="modern">Modern (ทันสมัย)</option>
                                <option value="classic">Classic (มาตรฐาน)</option>
                                <option value="minimalist">Minimalist (เรียบง่าย)</option>
                                <option value="creative">Creative (สร้างสรรค์)</option>
                            </select>
                        </div>
                    </div>

                    {/* Default Font */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">ฟอนต์เริ่มต้น (Default Font)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Type size={16} className="text-gray-400" />
                            </div>
                            <select
                                name="font"
                                value={preferences.font}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="inter">Inter (ดีที่สุดสำหรับการอ่าน)</option>
                                <option value="sarabun">Sarabun (ทางการไทย)</option>
                                <option value="roboto">Roboto (มาตรฐานสากล)</option>
                                <option value="prompt">Prompt (ทันสมัยแบบไทย)</option>
                            </select>
                        </div>
                    </div>

                    {/* Paper Size */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">ขนาดกระดาษ (Paper Size)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Maximize size={16} className="text-gray-400" />
                            </div>
                            <select
                                name="paperSize"
                                value={preferences.paperSize}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="a4">A4 (มาตรฐานสากล/ไทย)</option>
                                <option value="letter">US Letter (อเมริกา)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Auto Save Toggle */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-gray-800">บันทึกอัตโนมัติ (Auto Save)</h4>
                        <p className="text-sm text-gray-500">บันทึกข้อมูลทุกๆ 30 วินาทีขณะแก้ไขเรซูเม่</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="autoSave"
                            checked={preferences.autoSave} 
                            onChange={handleChange}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#437393]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#437393]"></div>
                    </label>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#437393] text-white rounded-lg hover:bg-[#355b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                        <Save size={18} />
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าเริ่มต้น'}
                    </button>
                </div>
            </form>
        </div>
    )
}
