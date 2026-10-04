import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Calendar, Clock, Plus, Truck, Search, ChevronLeft } from "lucide-react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";
import MessageBox from "@/component/MessageBox.jsx";
import Sidebar from "./Sidebar.jsx";
import { USE_DUMMY_DATA, DUMMY_VEHICLES, DUMMY_FARMER_REQUESTS } from "./deliveryDummyData.js";

// The 2 main categories
const CATEGORIES = [
    { key: "vehicles", label: "Available vehicles", tag: "Available Vehicle", hint: "Vehicles deliverers have offered. Pick one for your goods.", action: "Choose vehicle", fallbackEmoji: "🚚" },
    { key: "requests", label: "Farmer requests", tag: "Farmer Request", hint: "Farmers waiting for a vehicle. Accept one you can carry.", action: "Accept request", fallbackEmoji: "🌾" },
];

const SORTS = [
    { key: "all", label: "All" },
    { key: "az", label: "A to Z" },
    { key: "za", label: "Z to A" },
];

export default function MatchingDeliveriesPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("tab") === "requests" ? "requests" : "vehicles";

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [selectingId, setSelectingId] = useState(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("all");

    // 401 on a protected page = login expired
    const handleError = (error) => {
        const err = getApiError(error);
        if (err.status === 401) {
            localStorage.removeItem("my_app_token");
            navigate("/login");
            return;
        }
        setErrorText(err.message);
    };

    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);
            setErrorText("");
            if (USE_DUMMY_DATA) {
                setItems(category === "vehicles" ? DUMMY_VEHICLES : DUMMY_FARMER_REQUESTS);
                setIsLoading(false);
                return;
            }
            try {
                const endpoint =
                    category === "vehicles" ? ENDPOINTS.DELIVERY.LIST_VEHICLES : ENDPOINTS.DELIVERY.LIST_FARMER_REQUESTS;
                const data = await api.call(endpoint);
                setItems(Array.isArray(data) ? data : []); // the backend returns a plain array
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const handleSelect = async (id) => {
        if (USE_DUMMY_DATA) {
            navigate(`/DeliveryTracking?deliveryId=${id}`);
            return;
        }
        setSelectingId(id);
        setErrorText("");
        try {
            const result = await api.call(ENDPOINTS.DELIVERY.SELECT(id));
            navigate(`/DeliveryTracking?deliveryId=${result.deliveryId}`);
        } catch (error) {
            handleError(error);
        } finally {
            setSelectingId(null);
        }
    };

    const current = CATEGORIES.find((c) => c.key === category);

    // Search, then A to Z / Z to A
    const query = search.trim().toLowerCase();
    const shown = items
        .filter((m) =>
            !query ||
            [m.description, m.vehicleType, m.userName, m.pickupLocation, m.destination]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(query))
        )
        .sort((a, b) => {
            const A = (a.description ?? a.vehicleType ?? "").toLowerCase();
            const B = (b.description ?? b.vehicleType ?? "").toLowerCase();
            if (sort === "az") return A.localeCompare(B);
            if (sort === "za") return B.localeCompare(A);
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar minimal />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar: back, search, sort */}
                <div className="px-8 pt-5 max-w-7xl w-full mx-auto flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="relative w-full max-w-sm">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search deliveries"
                            className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        {SORTS.map((s) => (
                            <button
                                key={s.key}
                                onClick={() => setSort(s.key)}
                                className={`text-sm font-medium ${
                                    sort === s.key ? "text-green-700" : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-8 pt-8 pb-6 max-w-7xl w-full mx-auto">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">All Deliveries</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {current.hint}
                                {USE_DUMMY_DATA && " Showing sample deliveries for now."}
                            </p>
                        </div>
                        {/* Buttons on the right */}
                        <div className="shrink-0 flex items-center gap-2">
                            <button
                                onClick={() => navigate("/DeliveryTracking")}
                                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold rounded-xl px-4 py-2.5 text-sm flex items-center gap-2"
                            >
                                <Truck size={18} /> Track delivery
                            </button>
                            <button
                                onClick={() => navigate("/DeliveryRequest")}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm flex items-center gap-2"
                            >
                                <Plus size={18} /> Create request
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.key}
                                onClick={() => setSearchParams({ tab: c.key })}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                    category === c.key
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 px-8 pb-10 max-w-7xl w-full mx-auto">
                    <MessageBox type="error" text={errorText} />
                    {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
                    {!isLoading && !errorText && shown.length === 0 && (
                        <p className="text-sm text-gray-500">
                            {query ? "No deliveries match your search." : "Nothing here yet. Create a request to get started."}
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
                        {shown.map((m) => {
                            const when = new Date(m.preferredDateTime);
                            return (
                                <div key={m.requestId} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                                    <div className="h-44 rounded-xl bg-green-50 flex items-center justify-center text-6xl">
                                        {m.emoji ?? current.fallbackEmoji}
                                    </div>

                                    <p className="text-xs font-medium text-green-700 mt-4">{current.tag}</p>
                                    <div className="flex items-start justify-between gap-2 mt-1">
                                        <h3 className="text-lg font-bold text-gray-900">{m.description || m.vehicleType}</h3>
                                        <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-lg whitespace-nowrap">
                                            {m.estimatedWeight} kg
                                        </span>
                                    </div>

                                    <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                                        <MapPin size={14} className="shrink-0" />
                                        <span className="truncate">{m.userName}, {m.pickupLocation}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 pl-5">to {m.destination}</p>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar size={13} /> {when.toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={13} /> {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        {category === "requests" && (
                                            <span className="flex items-center gap-1"><Truck size={13} /> {m.vehicleType}</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleSelect(m.requestId)}
                                        disabled={selectingId !== null}
                                        className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl px-5 py-2.5 text-sm"
                                    >
                                        {selectingId === m.requestId ? "Selecting..." : current.action}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}