import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Truck, PlusCircle, MessageCircle, Settings2 } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import logoImg from "@/assets/farmerImg/logo.png";
import { hasRole, roleLabels } from "@/utils/roleUtils.js";

const CUSTOMER_NAV = [
    { key: "request", label: "Request Delivery", icon: PlusCircle, path: "/delivery/request" },
    { key: "matches", label: "Shared Matches", icon: Users, path: "/delivery/matches" },
    { key: "tracking", label: "Track Delivery", icon: Truck, path: "/delivery/tracking" },
    { key: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
];

const TRANSPORT_NAV = [
    { key: "vehicles", label: "My Vehicles", icon: Truck, path: "/delivery/vehicles" },
    { key: "incoming", label: "Delivery Requests", icon: Users, path: "/delivery/incoming" },
    { key: "request", label: "My Delivery Request", icon: PlusCircle, path: "/delivery/request" },
    { key: "matches", label: "Shared Matches", icon: Users, path: "/delivery/matches?view=customer" },
    { key: "tracking", label: "Active Deliveries", icon: Settings2, path: "/delivery/tracking" },
    { key: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
];

export default function DeliverySidebar({ active, minimal = false }) {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (minimal) return;
        let cancelled = false;
        api.call(ENDPOINTS.ME.GET_PROFILE)
            .then((data) => !cancelled && setMe(data))
            .catch(() => !cancelled && setMe(null));
        return () => { cancelled = true; };
    }, [minimal]);

    const items = hasRole(me, "TRANSPORT") ? TRANSPORT_NAV : CUSTOMER_NAV;

    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r border-gray-100 bg-white h-screen sticky top-0">
            <div className="flex items-center gap-2 px-6 py-6">
                <img src={logoImg} alt="Ran Aswanu logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-semibold text-gray-900">Ranaswanu</span>
            </div>

            {minimal ? <div className="flex-1" /> : (
                <nav className="flex-1 px-3 space-y-1">
                    {items.map(({ key, label, icon: Icon, path }) => (
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
                            <p className="text-xs text-gray-400 truncate">{roleLabels(me).join(" + ")}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
