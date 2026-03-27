import React, { useState, useRef, useEffect } from 'react'
import { Camera, User, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, Save } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { updateUserProfile } from '@/lib/api'

const PROVINCES = [
    "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", 
    "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", 
    "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", 
    "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", 
    "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "พะเยา", "ภูเก็ต", 
    "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยะลา", "ยโสธร", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", 
    "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", 
    "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", 
    "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
].map(p => `${p}, ประเทศไทย`);

export default function ProfileSettings({ user }: { user: any }) {
    const { updateUser } = useAuthStore()
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        jobTitle: user?.jobTitle || '',
        portfolio: user?.portfolio || '',
        avatarUrl: user?.avatarUrl || ''
    })
    
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    
    // Add state for image preview functionality
    const [imagePreview, setImagePreview] = useState<string | null>(user?.avatarUrl || null)
    
    // Autocomplete state
    const [showLocationDropdown, setShowLocationDropdown] = useState(false)
    const locationRef = useRef<HTMLDivElement>(null)

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowLocationDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle specific photo upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file size and type (optional but good practice)
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'รูปภาพต้องมีขนาดไม่เกิน 2MB' })
                return
            }
            
            // Read file as Base64 for persistence
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setImagePreview(base64String)
                setFormData(prev => ({ ...prev, avatarUrl: base64String }))
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        setFormData(prev => ({ ...prev, avatarUrl: '' }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            // Update the global store so data persists when changing tabs
            updateUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                jobTitle: formData.jobTitle,
                portfolio: formData.portfolio,
                avatarUrl: formData.avatarUrl,
            })
            
            // Save to database via API
            if (user?.id) {
                await updateUserProfile(user.id, {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    location: formData.location,
                    jobTitle: formData.jobTitle,
                    portfolioUrl: formData.portfolio,
                    avatarUrl: formData.avatarUrl,
                })
            }

            setLoading(false)
            setMessage({ type: 'success', text: 'บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว' })
        } catch (error) {
            setLoading(false)
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' })
        }
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
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-gray-400" />
                            )}
                        </div>
                        {/* Make the camera icon also clickable */}
                        <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow border text-gray-600 hover:text-[#437393] transition-colors cursor-pointer">
                            <Camera size={16} />
                            <input 
                                type="file" 
                                accept="image/jpeg, image/png, image/gif" 
                                className="hidden" 
                                onChange={handleImageUpload} 
                            />
                        </label>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">รูปโปรไฟล์</h4>
                        <p className="text-sm text-gray-500 mb-3">รองรับ JPG, PNG หรือ GIF (สูงสุด 2MB)</p>
                        <div className="flex gap-3">
                            <label className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center inline-block">
                                เปลี่ยนรูป
                                <input 
                                    type="file" 
                                    accept="image/jpeg, image/png, image/gif" 
                                    className="hidden" 
                                    onChange={handleImageUpload} 
                                />
                            </label>
                            {imagePreview && (
                                <button type="button" onClick={removeImage} className="px-4 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                                    ลบ
                                </button>
                            )}
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
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
                                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                                title="กรุณากรอกอีเมลให้ถูกต้อง ต้องมี @ และโดเมน"
                                required
                                placeholder="example@email.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
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
                                pattern="[0-9]{10}"
                                title="กรุณากรอกตัวเลข 10 หลักเท่านั้น"
                                maxLength={10}
                                minLength={10}
                                required
                                placeholder="08x-xxx-xxxx (พิมพ์เฉพาะตัวเลข)"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div ref={locationRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเทศ/เมือง (Location)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={(e) => {
                                    handleChange(e);
                                    setShowLocationDropdown(true);
                                }}
                                onFocus={() => setShowLocationDropdown(true)}
                                placeholder="พิมพ์เพื่อค้นหา กทม, เชียงใหม่, ฯลฯ"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
                                autoComplete="off"
                            />
                            
                            {/* Autocomplete Dropdown */}
                            {showLocationDropdown && (
                                <ul className="absolute z-10 w-full mt-1 bg-[#23272f] text-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-[#3e4552] py-2">
                                    {PROVINCES.filter(p => p.toLowerCase().includes(formData.location.toLowerCase())).length > 0 ? (
                                        PROVINCES.filter(p => p.toLowerCase().includes(formData.location.toLowerCase())).map((province, index) => (
                                            <li 
                                                key={index}
                                                className="px-4 py-2.5 hover:bg-[#343b47] hover:text-white cursor-pointer transition-colors text-sm"
                                                onClick={() => {
                                                    setFormData({ ...formData, location: province });
                                                    setShowLocationDropdown(false);
                                                }}
                                            >
                                                {province}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-sm text-gray-500 text-center flex items-center justify-center">
                                            ไม่พบข้อมูลที่ค้นหา
                                        </li>
                                    )}
                                </ul>
                            )}
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
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
