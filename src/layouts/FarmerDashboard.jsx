import React, { useState } from 'react';
import logoImg from '../assets/farmerImg/logo.png';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // ප්‍රධාන Navigation Items
    const navItems = [
        { path: '/farmer/home', label: 'Home' },
        { path: '/farmer/add-harvest', label: 'Add Harvest' },
        { path: '/farmer/manage-harvest', label: 'Manage Harvest' },
        { path: '/farmer/crop-management', label: 'Crop Management' },
        { path: '/farmer/livestock', label: 'Livestock' },
        { path: '/farmer/expenses', label: 'Expenses' },
        { path: '/farmer/calendar', label: 'Calendar' },
        { path: '/farmer/weather', label: 'Weather' },
    ];

    // පහළ Settings සහ Help & Support
    const bottomItems = [
        { path: '/farmer/settings', label: 'Settings' },
        { path: '/farmer/help', label: 'Help & Support' },
    ];

    const closeMobileSidebar = () => setIsMobileOpen(false);

    return (
        <div className="relative flex h-screen w-full bg-gray-50 overflow-hidden font-sans">

            {/* Mobile Backdrop Overlay */}
            {isMobileOpen && (
                <div
                    onClick={closeMobileSidebar}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
                />
            )}

            {/* Sidebar (Desktop සඳහා ස්ථිරව, Mobile වලදී drawer එකක් ලෙස) */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
                    isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="overflow-y-auto">
                    {/* Brand Logo & Name (Ran Aswanu) */}
                    <div className="flex items-center justify-between mb-8 pl-2">
                        <div className="flex items-center gap-3">
                            <img
                                src={logoImg}
                                alt="Ran Aswanu Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <h1 className="text-2xl font-bold text-green-600 tracking-tight">
                                Ran Aswanu
                            </h1>
                        </div>
                        <button
                            onClick={closeMobileSidebar}
                            className="lg:hidden text-gray-400 hover:text-gray-700 text-xl font-bold p-1 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* ප්‍රධාන මෙනු ලින්ක්ස් */}
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMobileSidebar}
                                className={({ isActive }) =>
                                    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-green-100/70 text-green-900 font-bold shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* පහළ කොටස: Settings, Help & Support සහ Switch to Personal Profile බටනය */}
                <div className="space-y-1.5 border-t border-gray-100 pt-4 mt-4">
                    {bottomItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeMobileSidebar}
                            className={({ isActive }) =>
                                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-green-100/70 text-green-900 font-bold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    {/* Switch to Personal Profile Button */}
                    <NavLink
                        to="/buyer-profile"
                        onClick={closeMobileSidebar}
                        className="block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 mt-2 text-center"
                    >
                        Switch to Personal Profile
                    </NavLink>
                </div>
            </aside>

            {/*Right side main part*/}
            <div className="flex flex-col flex-1 h-full overflow-hidden w-full">

                {/* Mobile Top Header with Hamburger Button */}
                <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between z-30">
                    <div className="flex items-center gap-2">
                        <img src={logoImg} alt="Ran Aswanu Logo" className="w-7 h-7 object-contain" />
                        <span className="font-bold text-green-600 text-lg">Ran Aswanu</span>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 cursor-pointer"
                        aria-label="Open Menu"
                    >
                        ☰
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default FarmerDashboard;