import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full h-20 bg-gradient-to-r from-blue-200 to-blue-300 px-8 flex items-center justify-between shadow-sm">
      <div className="text-2xl font-serif text-slate-700 tracking-wide">
        SRG-TJS
      </div>
      <Link 
        href="/login" 
        className="bg-white text-slate-700 px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
      >
        เข้าสู่ระบบ
      </Link>
    </header>
  );
}
