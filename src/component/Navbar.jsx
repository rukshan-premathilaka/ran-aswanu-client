import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, ShoppingCart } from 'lucide-react';
import ProfileMenu from '@/component/ProfileMenu.jsx';
import { cartCount, onCartChange } from '@/utils/cart.js';
import logoImg from "@/assets/farmerImg/logo.png";

function Navbar() {
    const navigate = useNavigate();
    // number of different items in the cart (3 items added -> 3), updates live
    const [count, setCount] = useState(() => cartCount());
    const [keyword, setKeyword] = useState('');

    // useState above already read the cart once, so the effect only listens for later changes
    useEffect(() => onCartChange(() => setCount(cartCount())), []);

    // Enter in the search box opens the products page with the keyword (ProductsPage reads ?keyword=)
    const handleSearch = (e) => {
        e.preventDefault();
        const q = keyword.trim();
        navigate(q ? `/products?keyword=${encodeURIComponent(q)}` : '/products');
    };

    return (
        <nav className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 sticky top-0 left-0 z-50">

            {/* 🌿 1. Logo & Site Name */}
            <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => navigate('/home')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/home')}
            >
                {/*logo*/}
                <div className="w-9 h-9  rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    <img
                        src={logoImg}
                        alt="Ran Aswanna Logo"
                        className="w-8 h-8 object-contain"
                    />
                </div>
                {/* Site Name  */}
                <span className="text-xl font-bold text-gray-800 tracking-wide">
                     <span className="text-[#54B435]">Ran Aswanna</span>
                </span>
            </div>

            {/* 🔍 2. Item Search Bar */}
            <form onSubmit={handleSearch} role="search" className="flex-1 max-w-md mx-4 md:mx-8">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        aria-label="Search fresh items"
                        placeholder="Search fresh items..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#54B435] focus:bg-white transition-all placeholder:text-gray-400"
                    />
                    {/* Search bar */}
                    <Search className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                </div>
            </form>

            {/* 👤 3. Action Icons & User Profile */}
            <div className="flex items-center gap-3">

                {/* 🛒 Cart Button  */}
                <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
                    className="p-2 text-gray-600 hover:text-[#54B435] hover:bg-gray-50 rounded-xl transition-all relative"
                >
                    {/*shoooping carts*/}
                    <ShoppingCart size={22} />
                    {count > 0 && (
                        <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {count > 99 ? '99+' : count}
                        </span>
                    )}
                </button>

                {/* 👤 User Profile Icon: opens a popup with the profile and a Logout button */}
                <ProfileMenu />

            </div>
        </nav>
    );
}

export default Navbar;