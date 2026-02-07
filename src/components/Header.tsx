'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
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
            <button
              onClick={handleLogout}
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
    </header>
  );
}
