import { useState } from 'react';
import {CircleHelp} from "lucide-react";

const DashboardLayout = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState('Home');

    const [isMobileOpen, setIsMobileOpen] = useState(false);


    const menuItems = [
        { name: 'Home', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.505-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
        { name: 'Add', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> },
        { name: 'Crop management', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21V9.75M3.284 14.253A8.998 8.998 0 0 1 12 3c4.192 0 7.643 2.87 8.716 6.75m-17.432 4.503a9.005 9.005 0 0 1 1.956-3.721m13.52 3.721a9.005 9.005 0 0 0-1.956-3.721M12 9.75A3.75 3.75 0 1 0 12 2.25 3.75 3.75 0 0 0 12 9.75Z" /></svg> },
        { name: 'Calendar', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg> },
        { name: 'Weather', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" /></svg> }
    ];
    const ButtomMenuItem = [
        {name: 'Settings',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       className="lucide lucide-settings-icon lucide-settings">
                <path
                    d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>

        },
        {name: 'Help & Support', icon:<CircleHelp className="w-5 h-5"/>

        }
    ];


    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden relative">

            {/* 1. Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* 2. Side Menu Bar  */}
            <div
                className={`w-64 h-screen bg-white border-r border-gray-100 p-4 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>


                <div className="flex items-center justify-between mb-10 px-4">
                    <span className="text-xl font-bold text-brandGreen mb-6">Ran Aswanna</span>


                    <button className="md:hidden text-gray-500 hover:text-gray-800" onClick={() => setIsMobileOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>


                <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = activeMenu === item.name;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setActiveMenu(item.name);
                                        setIsMobileOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        isActive
                                            ? 'bg-[#D2E9C4] text-gray-800'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <span className={isActive ? 'text-brandGreen' : 'text-gray-400'}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </button>
                            );
                        })}



                </nav>
                {/*Setting && Help buttons*/}
                <div className="mt-auto pt-4 border-t border-gray-100 space-y-1 ">
                    {ButtomMenuItem.map((item) => {
                        const isActive = activeMenu === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setActiveMenu(item.name);
                                    setIsMobileOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-[#D2E9C4] text-gray-800'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`}
                            >
                                            <span className={isActive ? 'text-brandGreen' : 'text-gray-400'}>
                                                {item.icon}
                                            </span>
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Rightside content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Header */}
                <header className="w-full h-16 bg-white flex items-center justify-between md:justify-end px-8 relative border-b border-gray-100">


                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="md:hidden text-gray-700 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                   {/*notification and profile icon*/}
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile Button */}
                        <button className="w-8 h-8 rounded-full border border-gray-300 overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Dynamic Children Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;