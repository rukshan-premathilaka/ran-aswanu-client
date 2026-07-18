import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Leaf, Calendar as CalendarIcon, Cloud, Settings, CircleHelp, Bell, Menu, X, Package, Plus, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // States for topbar dropdowns
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const menuItems = [
        { name: 'Home', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { name: 'Add Harvest', path: '/dashboard/add-harvest', icon: <Plus className="w-5 h-5" /> },
        { name: 'Manage Harvest', path: '/dashboard/manage-harvest', icon: <Package className="w-5 h-5" /> },
        { name: 'Crop management', path: '/dashboard/crop-management', icon: <Leaf className="w-5 h-5" /> },
        { name: 'Calendar', path: '/dashboard/calendar', icon: <CalendarIcon className="w-5 h-5" /> },
        { name: 'Weather', path: '/dashboard/weather', icon: <Cloud className="w-5 h-5" /> },
    ];

    const handleLinkClick = () => {
        setIsMobileOpen(false);
        setIsProfileOpen(false);
        setIsNotifOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">

            {isMobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" onClick={() => setIsMobileOpen(false)}></div>
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <div>
                    <div className="h-20 flex items-center justify-between px-8">
                        <h1 className="text-2xl font-bold text-[#8dc63f]">Ran Aswanna</h1>
                        <button className="lg:hidden p-2 text-gray-500 hover:text-gray-800" onClick={() => setIsMobileOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="px-4 space-y-1 mt-4">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                            return (
                                <Link key={item.name} to={item.path} onClick={handleLinkClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#D2E9C4] text-gray-800' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                                    <span className={isActive ? 'text-green-700' : 'text-gray-400'}>{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="px-4 pb-8 space-y-1">
                    <hr className="my-4 border-gray-100" />
                    <Link to="/dashboard/settings" onClick={handleLinkClick} className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all cursor-pointer">
                        <Settings className="w-5 h-5 text-gray-400" /> Settings
                    </Link>
                    <Link to="/dashboard/help" onClick={handleLinkClick} className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all cursor-pointer">
                        <CircleHelp className="w-5 h-5 text-gray-400" /> Help & Support
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
                <header className="h-20 bg-white flex items-center justify-between lg:justify-end px-4 lg:px-8 gap-4 lg:gap-6 border-b border-gray-100 relative z-20">
                    <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" onClick={() => setIsMobileOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 lg:gap-6 relative">

                        {/* Notifications Button */}
                        <div className="relative">
                            <button
                                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                    <div className="px-4 py-2 border-b border-gray-50"><h4 className="font-bold text-gray-700 text-sm">Notifications</h4></div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                                            <p className="text-sm text-gray-800 font-medium">New Order Received!</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Kamal bought 5kg Carrots.</p>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <p className="text-sm text-gray-800 font-medium">Weather Alert</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Heavy rain expected tonight.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Button (Using Farmer DP) */}
                        <div className="relative">
                            <button
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                                className="w-10 h-10 rounded-full border-2 border-[#8dc63f] overflow-hidden cursor-pointer"
                            >
                                <img src="https://placehold.co/100x100" alt="Farmer DP" className="w-full h-full object-cover" />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-bold text-gray-800">Saman Perera</p>
                                        <p className="text-xs text-gray-500 font-medium">saman.farmer@gmail.com</p>
                                    </div>
                                    <div className="py-1">
                                        <Link to="/dashboard/settings" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#8dc63f]">
                                            <Settings className="w-4 h-4" /> Account Settings
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-50 py-1">
                                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 relative z-10" onClick={() => { setIsProfileOpen(false); setIsNotifOpen(false); }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;