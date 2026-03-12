import { useState } from 'react'
import { Shield, Key, Smartphone, Monitor, Globe, LogOut } from 'lucide-react'
import { changePassword } from '@/lib/api'

export default function SecuritySettings({ user }: { user: any }) {
    const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const [passLoading, setPassLoading] = useState(false)
    const [passMessage, setPassMessage] = useState({ type: '', text: '' })
    
    // 2FA state mapped to local initially
    const [is2FAEnabled, setIs2FAEnabled] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passForm.newPassword !== passForm.confirmPassword) {
            setPassMessage({ type: 'error', text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' })
            return
        }
        if (!user) return

        try {
            setPassLoading(true)
            setPassMessage({ type: '', text: '' })
            const res = await changePassword({
                userId: user.id,
                oldPassword: passForm.oldPassword,
                newPassword: passForm.newPassword
            })

            if (res.success) {
                setPassMessage({ type: 'success', text: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' })
                setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                setPassMessage({ type: 'error', text: res.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้' })
            }
        } catch (error: any) {
            setPassMessage({ type: 'error', text: error.message || 'เกิดข้อผิดพลาดบางอย่าง' })
        } finally {
            setPassLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Key size={20} className="text-[#437393]" /> เปลี่ยนรหัสผ่าน (Change Password)
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
                    {passMessage.text && (
                        <div className={`p-3 rounded-lg text-sm ${passMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {passMessage.text}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านปัจจุบัน</label>
                        <input
                            type="password"
                            required
                            value={passForm.oldPassword}
                            onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
                        <input
                            type="password"
                            required
                            value={passForm.newPassword}
                            onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                        <input
                            type="password"
                            required
                            value={passForm.confirmPassword}
                            onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={passLoading}
                            className="px-6 py-2.5 bg-[#437393] text-white rounded-lg hover:bg-[#355b74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                        >
                            {passLoading ? 'กำลังอัปเดต...' : 'เปลี่ยนรหัสผ่าน'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Two Factor Authentication (2FA) */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                            <Shield size={20} className="text-[#437393]" /> การยืนยันตัวตน 2 ขั้นตอน (2FA)
                        </h3>
                        <p className="text-gray-500 text-sm">เพิ่มความปลอดภัยให้บัญชีของคุณด้วยการยืนยันรหัสจากแอปพลิเคชัน</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${is2FAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Status: {is2FAEnabled ? 'ON' : 'OFF'}
                        </span>
                        <button 
                            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                is2FAEnabled ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#437393] text-white hover:bg-[#355b74]'
                            }`}
                        >
                            {is2FAEnabled ? 'ปิดใช้งาน 2FA' : 'เปิดใช้งาน 2FA'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Login Sessions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                            <Globe size={20} className="text-[#437393]" /> อุปกรณ์ที่เข้าสู่ระบบ (Active Sessions)
                        </h3>
                        <p className="text-gray-500 text-sm">ตรวจสอบว่ามีอุปกรณ์ใดกำลังใช้งานบัญชีของคุณอยู่บ้าง</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap">
                        <LogOut size={16} /> ออกจากระบบอุปกรณ์อื่นทั้งหมด
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Current Session */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-white rounded-full shadow-sm text-green-600">
                                <Monitor size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Chrome / Windows (อุปกรณ์ปัจจุบัน)</h4>
                                <p className="text-sm text-gray-500">Bangkok, Thailand</p>
                                <p className="text-xs text-green-600 mt-1 font-medium">ออนไลน์ในขณะนี้</p>
                            </div>
                        </div>
                    </div>

                    {/* Other Session */}
                    <div className="flex items-start justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-gray-50 rounded-full text-gray-500">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Safari / iOS</h4>
                                <p className="text-sm text-gray-500">Chiang Mai, Thailand</p>
                                <p className="text-xs text-gray-400 mt-1">ใช้งานล่าสุด: 5 ชั่วโมงที่แล้ว</p>
                            </div>
                        </div>
                        <button className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
