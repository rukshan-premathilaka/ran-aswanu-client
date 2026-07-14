import React from 'react';
import Navbar from "@/component/Navbar.jsx";
import { Settings, User, ShieldCheck } from 'lucide-react';


const SIDEBAR_ITEMS = [
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Password & Security', icon: ShieldCheck },
];

// 🔘 Reusable Sidebar Button
function SidebarButton({ label, Icon, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${
                isActive
                    ? 'bg-green-50 text-[#54B435] font-semibold border border-green-100'
                    : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 font-medium'
            }`}
        >
            <Icon
                size={20}
                className={isActive ? 'transition-transform duration-700 group-hover:rotate-90' : ''}
            />
            <span className="text-sm">{label}</span>
        </button>
    );
}

// 📂 Sidebar Section - navigation ට
function ProfileSidebar({ activeTab, setActiveTab }) {
    return (
        <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col gap-1.5">
            {SIDEBAR_ITEMS.map((item) => (
                <SidebarButton
                    key={item.id}
                    label={item.label}
                    Icon={item.icon}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                />
            ))}
        </div>
    );
}

// ⬜ Content Section
function ProfileContent({ activeTab }) {
    return (
        <div className="flex-1 p-8 bg-gray-50">
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm max-w-2xl">
                <h1 className="text-xl font-bold text-gray-850 mb-2">
                    {SIDEBAR_ITEMS.find((i) => i.id === activeTab)?.label ?? 'Hello World'}
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {/* Selected tab put content */}
                </p>
            </div>
        </div>
    );
}

// 🌿 Main Component - layout
function UserProfileSettings() {
    const [activeTab, setActiveTab] = React.useState('profile');

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="w-full flex flex-1 pt-16">
                <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <ProfileContent activeTab={activeTab} />
            </div>
        </div>
    );
}

export default UserProfileSettings;