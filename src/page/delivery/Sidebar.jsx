import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Truck, PlusCircle } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import logoImg from "@/assets/farmerImg/logo.png";

// Routes: /DeliveryRequest, /MatchineDeliveries and /DeliveryTracking match Routes.config.js.
const NAV_ITEMS = [
    { key: "request", label: "Create Request", icon: PlusCircle, path: "/DeliveryRequest" },
    { key: "matches", label: "Matching Deliveries", icon: Users, path: "/MatchineDeliveries" },
    { key: "tracking", label: "Track Delivery", icon: Truck, path: "/DeliveryTracking" },
];

export default function Sidebar({ active, minimal = false }) {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);

    // Real user instead of the hard-coded "Sanduni K."
    useEffect(() => {
        if (minimal) return; // minimal sidebar has no profile
        const loadMe = async () => {
            try {
                setMe(await api.call(ENDPOINTS.ME.GET_PROFILE));
            } catch {
                setMe(null); // the sidebar still works without the profile
            }
        };
        loadMe();
    }, [minimal]);

    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r border-gray-100 bg-white h-screen sticky top-0">
            <div className="flex items-center gap-2 px-6 py-6">
                <img src={logoImg} alt="Ran Aswanu logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-semibold text-gray-900">Ranaswanu</span>
            </div>

            {minimal ? <div className="flex-1" /> : (
                <nav className="flex-1 px-3 space-y-1">
                    {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => (
                        <button
                            key={key}
                            onClick={() => navigate(path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                active === key ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </nav>
            )}

            {!minimal && me && (
                <div className="px-6 py-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
                            {(me.username ?? "").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{me.username ?? ""}</p>
                            {me.address && <p className="text-xs text-gray-400 truncate">{me.address}</p>}
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}