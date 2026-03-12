import { useState } from 'react'
import { Camera, User, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, Save } from 'lucide-react'

export default function ProfileSettings({ user }: { user: any }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        jobTitle: user?.jobTitle || '',
        portfolio: user?.portfolio || '',
    })
    
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        // 📝 In a real app, this would be an API call
        setTimeout(() => {
            setLoading(false)
            setMessage({ type: 'success', text: 'บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว' })
        }, 1000)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-[#437393]" /> ข้อมูลผู้ใช้ (Profile)
            </h3>

            {message.text && (
                <div className={`p-3 mb-6 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Profile Photo Section */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-gray-400" />
                            )}
                        </div>
                        <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow border text-gray-600 hover:text-[#437393] transition-colors">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">รูปโปรไฟล์</h4>
                        <p className="text-sm text-gray-500 mb-3">รองรับ JPG, PNG หรือ GIF (สูงสุด 2MB)</p>
                        <div className="flex gap-3">
                            <button type="button" className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                เปลี่ยนรูป
                            </button>
                            <button type="button" className="px-4 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล (Full Name)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="เช่น นายสมใจ รักดี"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล (Email Address)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรติดต่อ (Phone Number)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="08x-xxx-xxxx"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเทศ/เมือง (Location)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="กรุงเทพมหานคร, ประเทศไทย"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่งงาน (Job Title / Headline)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="เช่น Frontend Developer"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์ผลงาน (Portfolio / Website)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="url"
                                name="portfolio"
                                value={formData.portfolio}
                                onChange={handleChange}
                                placeholder="https://yourportfolio.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#437393] text-white rounded-lg hover:bg-[#355b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                        <Save size={18} />
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </button>
                </div>
            </form>
        </div>
    )
}
