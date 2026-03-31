'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { LogOut, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.push('/');
  };

  return (
    <header className="w-full h-[60px] bg-white border-b px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link href="/" className="text-2xl font-serif text-[#437393] font-bold">
        SRG-TJS
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-[#437393] font-medium transition-colors flex items-center gap-2"
            >
              <User size={18} />
              <span className="hidden sm:inline">บัญชีของฉัน</span>
            </Link>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg"
              >
                <Shield size={16} />
                <span className="hidden sm:inline">ระบบแอดมิน</span>
              </Link>
            )}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium ml-2"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-[#437393] text-white px-6 py-2 rounded-full shadow-sm hover:bg-[#355b74] transition-all font-medium"
          >
            เข้าสู่ระบบ
          </Link>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-50 rounded-full">
                <LogOut size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">ยืนยันการออกจากระบบ</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6 pb-4 border-b border-gray-100">
              คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบบัญชีของคุณ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm border border-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
              >
                <LogOut size={16} /> ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
