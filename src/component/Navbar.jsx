import React from 'react';

import { Search, User, ShoppingCart } from 'lucide-react';

function Navbar() {
    return (
        <nav className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 fixed top-0 left-0 z-50">

            {/* 🌿 1. Logo & Site Name */}
            <div className="flex items-center gap-2.5 cursor-pointer">
                {/*logo*/}
                <div className="w-9 h-9 bg-[#54B435] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    R
                </div>
                {/* Site Name  */}
                <span className="text-xl font-bold text-gray-800 tracking-wide">
                    Ran <span className="text-[#54B435]">Aswanna</span>
                </span>
            </div>

            {/* 🔍 2. Item Search Bar */}

            <div className="flex-1 max-w-md mx-4 md:mx-8">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="සොයන්න / Search fresh items..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#54B435] focus:bg-white transition-all placeholder:text-gray-400"
                    />
                    {/* Search bar */}
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* 👤 3. Action Icons & User Profile */}
            <div className="flex items-center gap-3">

                {/* 🛒 Cart Button  */}
                <button className="p-2 text-gray-600 hover:text-[#54B435] hover:bg-gray-50 rounded-xl transition-all relative">
                    <ShoppingCart size={22} />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        0
                    </span>
                </button>

                {/* 👤 User Profile Icon */}
                <button className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-[#54B435] hover:bg-green-50 border border-gray-100 transition-all shadow-sm">
                    <User size={20} />
                </button>

            </div>
        </nav>
    );
}

export default Navbar;