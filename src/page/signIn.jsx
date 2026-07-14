import React from 'react';
import Navbar from "@/component/Navbar.jsx";
import { Settings, User, ShieldCheck } from 'lucide-react';

// 🔘 Simple reusable button component
// active={true} දුන්නොත් green color එක, නැත්නම් normal color එක
function SidebarButton({ icon: Icon, label, active }) {
    return (
        <button
            className={
                active
                    ? "w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-[#54B435] font-semibold rounded-xl border border-green-100 transition-all text-left group"
                    : "w-full flex items-center gap-3 px-4 py-3 text-gray-650 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-xl transition-all text-left"
            }
        >
            <Icon size={20} className={active ? "transition-transform duration-700 group-hover:rotate-90" : ""} />
            <span className="text-sm">{label}</span>
        </button>
    );
}

function UserProfileSettings() {
    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50">
            {/* 🌿 Top Navbar */}
            <Navbar />

            <div className="w-full flex flex-1 pt-16">

                {/* 📂 LEFT SIDE - Sidebar */}
                <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col gap-1.5">
                    <SidebarButton icon={Settings} label="Profile Settings" active={true} />
                    <SidebarButton icon={User} label="Personal Info" active={false} />
                    <SidebarButton icon={ShieldCheck} label="Password & Security" active={false} />
                </div>

                {/* ⬜ RIGHT SIDE - Content */}
                <div className="flex-1 p-8 bg-gray-50">
                    <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm max-w-2xl">
                        <h1 className="text-xl font-bold text-gray-850 mb-2">Hello World</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {/* content මෙතනට */}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserProfileSettings;