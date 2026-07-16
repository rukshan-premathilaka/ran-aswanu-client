import { useState } from "react";
import { SlidersHorizontal, MapPin, Calendar, Clock, Users, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar.jsx";

const MATCHES = [
    {
        id: 1,
        from: "Nugegoda, Colombo 05",
        to: "Katunayake, Sri Lanka",
        savings: 35,
        date: "May 24, 2025",
        time: "02:30 PM",
        joined: 2,
        match: 92,
    },
    {
        id: 2,
        from: "Maharagama, Colombo 10",
        to: "Katunayake, Sri Lanka",
        savings: 30,
        date: "May 24, 2025",
        time: "03:00 PM",
        joined: 3,
        match: 88,
    },
    {
        id: 3,
        from: "Rajagiriya, Colombo 07",
        to: "Katunayake, Sri Lanka",
        savings: 28,
        date: "May 24, 2025",
        time: "03:15 PM",
        joined: 2,
        match: 85,
    },
];

const TABS = ["Closest Match", "Cheapest", "Fastest"];

export default function MatchingDeliveriesPage() {
    const [activeTab, setActiveTab] = useState("Closest Match");

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="matches" />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 max-w-6xl w-full mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Matching Deliveries</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        3 requests are already heading toward Katunayake, Sri Lanka.
                    </p>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mt-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                    activeTab === tab
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                        <button className="ml-auto flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full bg-white text-sm text-gray-600 hover:bg-gray-50">
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Match cards */}
                <div className="flex-1 px-8 pb-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                    {MATCHES.map((m) => (
                        <div
                            key={m.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center pt-1">
                                        <MapPin size={14} className="text-blue-600 fill-blue-600" />
                                        <div className="w-px flex-1 bg-gray-200 my-1" style={{ minHeight: 18 }} />
                                        <MapPin size={14} className="text-emerald-600 fill-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 leading-tight">{m.from}</p>
                                        <p className="text-sm text-gray-500 mt-2 leading-tight">{m.to}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg whitespace-nowrap">
                  Savings {m.savings}%
                </span>
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {m.date}
                </span>
                                <span className="flex items-center gap-1">
                  <Clock size={13} /> {m.time}
                </span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={13} /> {m.joined} people joined
                </span>
                                <span className="text-xs font-semibold text-emerald-600">{m.match}% match</span>
                            </div>

                            <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-semibold rounded-xl py-2.5 text-sm">
                                Join Shared Delivery
                            </button>
                        </div>
                    ))}

                    <button className="lg:col-span-2 w-full flex items-center justify-center gap-2 text-sm text-gray-500 py-3 hover:text-gray-700">
                        More matches may be available
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
