import { useState } from 'react'
import { UserRoundCog, Download, FileJson, AlertTriangle, Trash2 } from 'lucide-react'

export default function AccountSettings() {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')

    const handleExportData = () => {
        alert('Downloading your account data in JSON format...')
    }

    const handleDownloadResumes = () => {
        alert('Downloading all your resumes in a ZIP file...')
    }

    const handleDeleteAccount = () => {
        if (deleteConfirmText === 'DELETE') {
            alert('Account deleted. Logging out...')
            // Call API -> Logout -> Redirect to home
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Export & Download Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                        <UserRoundCog size={20} className="text-[#437393]" /> ข้อมูลบัญชี (Data Export)
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">คุณสามารถตรวจสอบและส่งออกข้อมูลส่วนตัวของคุณที่อยู่ในระบบ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <button 
                        onClick={handleExportData}
                        className="flex items-center justify-center gap-2 w-full px-5 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
                    >
                        <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                            <FileJson size={20} className="text-gray-600" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-semibold text-gray-800">ส่งออกข้อมูลบัญชี</p>
                            <p className="text-xs text-gray-500">ดาวน์โหลดข้อมูลทั้งหมดของคุณในรูปแบบ JSON</p>
                        </div>
                    </button>

                    <button 
                        onClick={handleDownloadResumes}
                        className="flex items-center justify-center gap-2 w-full px-5 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
                    >
                        <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                            <Download size={20} className="text-gray-600" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-semibold text-gray-800">ดาวน์โหลดเรซูเม่ทั้งหมด</p>
                            <p className="text-xs text-gray-500">บันทึกเรซูเม่ทั้งหมดของคุณมาเป็นไฟล์ ZIP</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div>
                    <h3 className="text-lg font-bold text-red-600 mb-1 flex items-center gap-2">
                        <AlertTriangle size={20} /> ลบบัญชีผู้ใช้ (Delete Account)
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 max-w-2xl">
                        การลบบัญชีจะเป็นการลบข้อมูลทั้งหมดของคุณ รวมถึงเรซูเม่ที่ถูกสร้างขึ้นทั้งหมด และไม่สามารถกู้คืนกลับมาได้อีก โปรดคิดให้ดีก่อนดำเนินการ
                    </p>
                </div>

                <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-200 hover:border-red-600"
                >
                    ลบบัญชีของฉัน
                </button>
            </div>

            {/* Danger Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">คุณแน่ใจหรือไม่ที่จะลบบัญชี?</h3>
                        <p className="text-gray-500 text-sm text-center mb-6">
                            ข้อมูลทั้งหมดของคุณ รวมทั้งเรซูเม่และโปรไฟล์จะหายไปอย่างถาวร หากคุณแน่ใจโปรดพิมพ์คำว่า <span className="font-bold text-gray-800">DELETE</span> เพื่อยืนยัน
                        </p>

                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4 text-center font-bold tracking-widest"
                            placeholder="พิมพ์ DELETE"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                        />

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setDeleteConfirmText('')
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE'}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยืนยันการลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
