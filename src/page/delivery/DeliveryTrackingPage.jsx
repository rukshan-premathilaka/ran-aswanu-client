import { Fragment } from "react";
import {
    MoreHorizontal,
    Check,
    Truck,
    MapPin,
    Phone,
    MessageCircle,
    Package,
    Car,
    Star,
    Maximize2,
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";

const STEPS = [
    { label: "Requested", status: "done" },
    { label: "Assigned", status: "done" },
    { label: "In Transit", status: "current" },
    { label: "Delivered", status: "upcoming" },
];

const UPDATES = [
    { label: "Assigned to driver", time: "May 24, 2025 · 01:45 PM", status: "done" },
    { label: "In transit", time: "May 24, 2025 · 02:10 PM", status: "current" },
    { label: "Delivered", time: "", status: "upcoming" },
];

function StepIcon({ status }) {
    if (status === "done")
        return (
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={14} className="text-white" strokeWidth={3} />
            </div>
        );
    if (status === "current")
        return (
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <Truck size={14} className="text-white" />
            </div>
        );
    return <div className="w-7 h-7 rounded-full border-2 border-gray-200 bg-white" />;
}

export default function DeliveryTrackingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="tracking" />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-6 max-w-6xl w-full mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Track Delivery</h1>
                        <p className="text-sm text-gray-500 mt-1">Your delivery is on the way · Estimated arrival 02:45 PM</p>
                    </div>
                    <MoreHorizontal size={20} className="text-gray-700" />
                </div>

                {/* Progress steps */}
                <div className="px-8 max-w-6xl w-full mx-auto">
                    <div className="flex items-center max-w-xl">
                        {STEPS.map((s, i) => (
                            <Fragment key={s.label}>
                                <StepIcon status={s.status} />
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-1 ${
                                            s.status === "done" ? "bg-emerald-500" : "bg-gray-200"
                                        }`}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </div>
                    <div className="flex justify-between max-w-xl mt-2">
                        {STEPS.map((s) => (
                            <span
                                key={s.label}
                                className={`text-xs w-16 text-center ${
                                    s.status === "upcoming" ? "text-gray-400" : "text-gray-800 font-medium"
                                }`}
                            >
                {s.label}
              </span>
                        ))}
                    </div>
                </div>

                <div className="flex-1 px-8 pb-10 pt-6 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
                    {/* Map - hero */}
                    <div className="rounded-2xl overflow-hidden h-[520px] relative bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 border border-gray-100">
                        <svg viewBox="0 0 400 520" className="w-full h-full">
                            <path
                                d="M 60 80 C 150 140, 190 80, 240 220 S 320 400, 340 460"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute" style={{ top: 50, left: 60 }}>
                            <MapPin size={26} className="text-blue-600 fill-blue-600" />
                        </div>
                        <div className="absolute" style={{ top: 260, left: 240 }}>
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow">
                                <Car size={18} className="text-white" />
                            </div>
                        </div>
                        <div className="absolute" style={{ top: 440, left: 330 }}>
                            <MapPin size={26} className="text-emerald-600 fill-emerald-600" />
                        </div>
                        <button className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 flex items-center gap-1.5 shadow">
                            View Full Map <Maximize2 size={12} />
                        </button>
                    </div>

                    {/* Right rail */}
                    <div className="space-y-5">
                        {/* Driver card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                                        NP
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Driver</p>
                                        <p className="text-sm text-gray-700">Namal Perera</p>
                                        <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                      <Star size={12} className="fill-amber-400 text-amber-400" /> 4.8
                    </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Phone size={16} className="text-blue-600" />
                                    </button>
                                    <button className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                                        <MessageCircle size={16} className="text-blue-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle / package */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 border border-gray-100 bg-white rounded-xl px-3 py-2.5">
                                <Car size={16} className="text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Vehicle</p>
                                    <p className="text-sm font-medium text-gray-800">WP AB 1234</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 border border-gray-100 bg-white rounded-xl px-3 py-2.5">
                                <Package size={16} className="text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Package</p>
                                    <p className="text-sm font-medium text-gray-800">1 Item · 5 kg</p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery updates */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Delivery Updates</p>
                            <div className="space-y-4">
                                {UPDATES.map((u, i) => (
                                    <div key={u.label} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            {u.status === "done" ? (
                                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <Check size={10} className="text-white" strokeWidth={3} />
                                                </div>
                                            ) : u.status === "current" ? (
                                                <div className="w-4 h-4 rounded-full bg-blue-600" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                                            )}
                                            {i < UPDATES.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                                        </div>
                                        <div className="pb-2">
                                            <p
                                                className={`text-sm font-medium ${
                                                    u.status === "upcoming" ? "text-gray-400" : "text-gray-900"
                                                }`}
                                            >
                                                {u.label}
                                            </p>
                                            {u.time && <p className="text-xs text-gray-400 mt-0.5">{u.time}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
