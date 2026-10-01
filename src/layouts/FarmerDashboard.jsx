import React from 'react';
import logoImg from '../assets/farmerImg/logo.png';
import { Outlet, NavLink } from 'react-router-dom';

const FarmerDashboard = () => {
    // Icons ඉවත් කර පිරිසිදු navigation array එකක් පමණක් තබා ගැනීම
    const navItems = [
        { path: '/farmer/home', label: 'Home' },
        { path: '/farmer/add-harvest', label: 'Add Harvest' },
        { path: '/farmer/manage-harvest', label: 'Manage Harvest' },
        { path: '/farmer/crop-management', label: 'Crop Management' },
        { path: '/farmer/calendar', label: 'Calendar' },
        { path: '/farmer/weather', label: 'Weather' },
    ];

    const bottomItems = [
        { path: '/farmer/settings', label: 'Settings' },
        { path: '/farmer/help', label: 'Help & Support' },
    ];

    return (
        <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden font-sans">
            {/* වම් පස ස්ථිර Sidebar එක */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 flex-shrink-0">
                <div>
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 mb-10 pl-2">
                        <img
                            src={logoImg}
                            alt="Ran Aswanna Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <h1 className="text-2xl font-bold text-[#8dc63f] tracking-tight">
                            Ran Aswanna
                        </h1>
                    </div>

                    {/* ප්‍රධාන මෙනු ලින්ක්ස් (Clean Text Navigation) */}
                    <nav className="space-y-1.5">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-[#D2E9C4]/70 text-gray-900 font-bold shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* පහළ Settings සහ Help ලින්ක්ස් */}
                <div className="space-y-1.5 border-t border-gray-100 pt-4">
                    {bottomItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-[#D2E9C4]/70 text-gray-900 font-bold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </aside>

            {/* දකුණු පස Header එක සහ පිටු පෙන්වන කොටස */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Outlet හරහා පිටු මාරු වන ප්‍රධාන කොටස */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FarmerDashboard;