import { Package, Users, Truck, PlusCircle } from "lucide-react";

const NAV_ITEMS = [
    { key: "request", label: "New Request", icon: PlusCircle },
    { key: "matches", label: "Matching Deliveries", icon: Users },
    { key: "tracking", label: "Track Delivery", icon: Truck },
];

export default function Sidebar({ active }) {
    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r border-gray-100 bg-white h-screen sticky top-0">
            <div className="flex items-center gap-2 px-6 py-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Package size={18} className="text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">ParcelPool</span>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            active === key
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </nav>

            <div className="px-6 py-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                        SK
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Sanduni K.</p>
                        <p className="text-xs text-gray-400">Colombo 03</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
