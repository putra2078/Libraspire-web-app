import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 flex-shrink-0 flex flex-col py-8 px-6 bg-white border-r border-gray-100 z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 pl-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white">
                    <i className='bx bxs-book-open text-2xl'></i>
                </div>
                <h1 className="font-bold text-xl text-gray-800">E-Book</h1>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                <Link href="/"
                    className="flex items-center gap-4 px-4 py-3.5 bg-gray-100 text-gray-900 rounded-2xl font-bold text-sm">
                    <i className='bx bx-home-alt text-xl'></i> Home
                </Link>
                <Link href="/discover"
                    className="flex items-center gap-4 px-4 py-3.5 text-gray-500 hover:bg-gray-50 rounded-2xl font-semibold text-sm transition-colors">
                    <i className='bx bx-compass text-xl'></i> Discover
                </Link>
                <Link href="/bookmark"
                    className="flex items-center gap-4 px-4 py-3.5 text-gray-500 hover:bg-gray-50 rounded-2xl font-semibold text-sm transition-colors">
                    <i className='bx bx-bookmark text-xl'></i> Bookmark
                </Link>
                <Link href="/settings"
                    className="flex items-center gap-4 px-4 py-3.5 text-gray-500 hover:bg-gray-50 rounded-2xl font-semibold text-sm transition-colors">
                    <i className='bx bx-cog text-xl'></i> Settings
                </Link>
                <Link href="/help"
                    className="flex items-center gap-4 px-4 py-3.5 text-gray-500 hover:bg-gray-50 rounded-2xl font-semibold text-sm transition-colors">
                    <i className='bx bx-info-circle text-xl'></i> Help
                </Link>
            </nav>
        </aside>
    );
}
