import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FileText, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 rounded-lg p-2">
                            <FileText className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                            QuickPDF Tools
                        </span>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-500 rounded-lg p-2">
                            <FileText className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                            QuickPDF Tools
                        </span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-gray-600 hover:text-gray-800">
                        Home
                    </Link>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                        Features
                    </a>
                    <Link href="/svg" className="text-gray-600 hover:text-gray-800">
                        Image to SVG
                    </Link>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                        Pricing
                    </a>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <User size={20} />
                                <span>{user.name}</span>
                            </div>
                            <button onClick={logout} className="text-gray-600 hover:text-red-600 flex items-center gap-1">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-600 hover:text-gray-800">
                                Login
                            </Link>
                            <Link href="/register" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                Register
                            </Link>
                        </>
                    )}

                    {!user && (
                        <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                            Upgrade to Pro
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
