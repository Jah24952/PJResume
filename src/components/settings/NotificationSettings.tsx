import { useState } from 'react'
import { Bell, Sparkles, ShieldAlert, Save } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useSettingsStore } from '@/store/settings.store'
import { updateUserSettings } from '@/lib/api'

export default function NotificationSettings() {
    const { user } = useAuthStore()
    const { settings, updateSettings } = useSettingsStore()

    const [notifications, setNotifications] = useState({
        systemAlerts: settings.systemAlerts !== undefined ? settings.systemAlerts : true,
        aiReady: settings.aiReady !== undefined ? settings.aiReady : true,
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications({ ...notifications, [key]: !notifications[key] })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            // Update global store
            updateSettings({
                systemAlerts: notifications.systemAlerts,
                aiReady: notifications.aiReady,
            })

            // Save to database
            if (user?.id) {
                const currentSettings = useSettingsStore.getState().settings
                await updateUserSettings(user.id, currentSettings)
            }

            setLoading(false)
            setMessage({ type: 'success', text: 'บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อยแล้ว' })
        } catch (error) {
            setLoading(false)
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึก' })
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-in fade-in duration-300">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <Bell size={20} className="text-[#437393]" /> การแจ้งเตือนทางอีเมล (Email Notifications)
                </h3>
                <p className="text-gray-500 text-sm mb-6">เลือกประเภทอีเมลที่คุณต้องการรับจากเรา</p>
            </div>

            {message.text && (
                <div className={`p-3 mb-6 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                
                {/* System Alerts */}
                <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                    <div className="flex gap-4">
                        <div className="mt-1 flex-shrink-0 text-red-500 bg-red-50 p-2 rounded-full">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">แจ้งเตือนระบบ (System Alerts)</h4>
                            <p className="text-sm text-gray-500 mt-1">การแจ้งเตือนเกี่ยวกับความปลอดภัย การเข้าสู่ระบบ และการเปลี่ยนแปลงบัญชีที่สำคัญ</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1 md:mt-0">
                        <input 
                            type="checkbox" 
                            checked={notifications.systemAlerts} 
                            onChange={() => toggleNotification('systemAlerts')}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#437393]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#437393]"></div>
                    </label>
                </div>

                {/* AI Ready */}
                <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl">
                    <div className="flex gap-4">
                        <div className="mt-1 flex-shrink-0 text-[#437393] bg-[#437393]/10 p-2 rounded-full">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">เรซูเม่ AI พร้อมใช้งาน (AI Resume Ready)</h4>
                            <p className="text-sm text-gray-500 mt-1">รับอีเมลแจ้งเตือนเมื่อระบบ AI ประมวลผลและสร้างเรซูเม่ของคุณเสร็จสมบูรณ์</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1 md:mt-0">
                        <input 
                            type="checkbox" 
                            checked={notifications.aiReady} 
                            onChange={() => toggleNotification('aiReady')}
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
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                    </button>
                </div>
            </form>
        </div>
    )
}
