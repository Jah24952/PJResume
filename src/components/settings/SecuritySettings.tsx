import { useState } from 'react'
import { Shield, Key, Smartphone, Monitor, Globe, LogOut, X, QrCode } from 'lucide-react'
import { changePassword } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SecuritySettings({ user }: { user: any }) {
    const { logout } = useAuthStore()
    const router = useRouter()

    const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const [passLoading, setPassLoading] = useState(false)
    const [passMessage, setPassMessage] = useState({ type: '', text: '' })
    
    // 2FA state 
    const [is2FAEnabled, setIs2FAEnabled] = useState(false)
    const [show2FAModal, setShow2FAModal] = useState(false)
    const [authCode, setAuthCode] = useState('')

    // Sessions state
    const [sessions, setSessions] = useState([
        { id: '1', name: 'Chrome / Windows (อุปกรณ์ปัจจุบัน)', location: 'Bangkok, Thailand', isCurrent: true, lastActive: 'ออนไลน์ในขณะนี้', icon: <Monitor size={20} /> }
    ])

    // Custom Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} })

    const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }))

    const handleLogoutSession = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'ยืนยันการออกจากระบบ',
            message: 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบบัญชีของคุณบนอุปกรณ์นี้?',
            onConfirm: () => {
                closeConfirmModal()
                logout()
                router.push('/login')
            }
        })
    }

    const handleToggle2FA = () => {
        if (is2FAEnabled) {
            setConfirmModal({
                isOpen: true,
                title: 'ยืนยันการปิด 2FA',
                message: 'คุณแน่ใจหรือไม่ว่าต้องการปิดใช้งาน 2FA? การปิดใช้งานจะลดความปลอดภัยของบัญชีลง',
                onConfirm: () => {
                    setIs2FAEnabled(false);
                    closeConfirmModal();
                }
            })
        } else {
            setShow2FAModal(true);
        }
    }

    const handleVerify2FA = () => {
        if (authCode.length === 6) {
            setIs2FAEnabled(true)
            setShow2FAModal(false)
            setAuthCode('')
            toast.success('เปิดใช้งาน 2FA สำเร็จแล้ว!')
        } else {
            toast.error('กรุณากรอกรหัส 6 หลักให้ครบถ้วน')
        }
    }


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
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
                        <input
                            type="password"
                            required
                            value={passForm.newPassword}
                            onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                        <input
                            type="password"
                            required
                            value={passForm.confirmPassword}
                            onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-gray-800"
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
                            onClick={handleToggle2FA}
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
                        <p className="text-gray-500 text-sm">การเชื่อมต่ออุปกรณ์ปัจจุบันของคุณ</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {sessions.map(session => (
                        <div key={session.id} className={`flex items-start justify-between p-4 rounded-lg border ${session.isCurrent ? 'bg-gray-50 border-gray-200' : 'border-gray-100'}`}>
                            <div className="flex gap-4">
                                <div className={`mt-1 p-2 rounded-full ${session.isCurrent ? 'bg-white shadow-sm text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                                    {session.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{session.name}</h4>
                                    <p className="text-sm text-gray-500">{session.location}</p>
                                    <p className={`text-xs mt-1 font-medium ${session.isCurrent ? 'text-green-600' : 'text-gray-400'}`}>
                                        {session.lastActive}
                                    </p>
                                </div>
                            </div>
                            {session.isCurrent && (
                                <button 
                                    onClick={() => handleLogoutSession(session.id)}
                                    className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 flex gap-1.5 items-center border border-red-100"
                                >
                                    <LogOut size={16} />
                                    ออกจากระบบ
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2FA Setup Modal */}
            {show2FAModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">ตั้งค่า Authenticator App</h3>
                            <button onClick={() => setShow2FAModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-4 mb-6">
                            <p>1. ดาวน์โหลดแอป Authenticator (เช่น Google Authenticator, Authy) บนสมาร์ทโฟนของคุณ</p>
                            <p>2. ใช้แอปสแกน QR Code ด้านล่างนี้ หรือกรอกคีย์ตั้งค่าแบบแมนนวล</p>
                            
                            <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <div className="text-center">
                                    <QrCode size={120} className="mx-auto text-gray-800 mb-2" />
                                    <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-800 font-mono">
                                        JBSWY3DPEHPK3PXP
                                    </code>
                                </div>
                            </div>

                            <p>3. นำรหัส 6 หลักที่ปรากฏในแอปมากรอกเพื่อยืนยัน</p>
                            
                            <div>
                                <input
                                    type="text"
                                    placeholder="กรอกรหัส 6 หลัก"
                                    maxLength={6}
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#437393] focus:border-transparent outline-none transition-all text-center text-xl tracking-widest font-mono text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShow2FAModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={handleVerify2FA}
                                disabled={authCode.length !== 6}
                                className="px-4 py-2 bg-[#437393] text-white rounded-lg hover:bg-[#355b74] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยืนยันการตั้งค่า
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Confirm Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{confirmModal.title}</h3>
                        <p className="text-gray-600 text-sm mb-6">{confirmModal.message}</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={closeConfirmModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={confirmModal.onConfirm}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm"
                            >
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
