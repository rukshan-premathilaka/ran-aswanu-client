import { useState } from "react";
import { MapPin, X, LocateFixed, Calendar, Clock, Package, Users, ArrowRight } from "lucide-react";
import Sidebar from "./Sidebar.jsx";

export default function DeliveryRequestPage() {
    const [pickup, setPickup] = useState("No. 25, Galle Road, Colombo 03");
    const [destination, setDestination] = useState("Katunayake, Sri Lanka");
    const [date, setDate] = useState("2025-05-24");
    const [time, setTime] = useState("14:30");
    const [weight, setWeight] = useState("");
    const [size, setSize] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar active="request" />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 max-w-6xl w-full mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Create Delivery Request</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tell us what needs to move and we'll find people already headed that way.
                    </p>
                </div>

                <div className="flex-1 px-8 pb-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
                    {/* Form column */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
                        {/* Pickup + Destination side by side on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="min-w-0">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <MapPin size={16} className="text-blue-600 fill-blue-600" />
                                    Pickup Location
                                </label>
                                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3">
                                    <input
                                        className="flex-1 min-w-0 text-sm text-gray-800 outline-none"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                    />
                                    <button onClick={() => setPickup("")}>
                                        <X size={16} className="text-gray-400 shrink-0" />
                                    </button>
                                </div>
                                <button className="w-full mt-2 border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                                    <LocateFixed size={16} />
                                    Use Current Location
                                </button>
                            </div>

                            <div className="min-w-0">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <MapPin size={16} className="text-emerald-600 fill-emerald-600" />
                                    Destination
                                </label>
                                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3">
                                    <input
                                        className="flex-1 min-w-0 text-sm text-gray-800 outline-none"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                    <button onClick={() => setDestination("")}>
                                        <X size={16} className="text-gray-400 shrink-0" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Date & Time + Package details side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="min-w-0">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <Calendar size={16} className="text-gray-700" />
                                    Date &amp; Time
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex-1 min-w-[130px]">
                                        <span className="text-xs text-gray-500">Date</span>
                                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 mt-1">
                                            <Calendar size={16} className="text-gray-400 shrink-0" />
                                            <input
                                                type="date"
                                                className="flex-1 min-w-0 w-full text-sm text-gray-800 outline-none bg-transparent"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-[130px]">
                                        <span className="text-xs text-gray-500">Time</span>
                                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 mt-1">
                                            <Clock size={16} className="text-gray-400 shrink-0" />
                                            <input
                                                type="time"
                                                className="flex-1 min-w-0 w-full text-sm text-gray-800 outline-none bg-transparent
                                                    [&::-webkit-calendar-picker-indicator]:opacity-0
                                                    [&::-webkit-calendar-picker-indicator]:hidden
                                                    [&::-webkit-datetime-edit-fields-wrapper]:bg-transparent
                                                    [&::-webkit-datetime-edit-text]:text-gray-800
                                                    [&::-webkit-datetime-edit-hour-field]:bg-transparent
                                                    [&::-webkit-datetime-edit-minute-field]:bg-transparent
                                                    [&::-webkit-datetime-edit-ampm-field]:bg-transparent
                                                    [&::-webkit-datetime-edit-hour-field]:text-gray-800
                                                    [&::-webkit-datetime-edit-minute-field]:text-gray-800
                                                    [&::-webkit-datetime-edit-ampm-field]:text-gray-800
                                                    [&::-webkit-datetime-edit-hour-field:focus]:bg-transparent
                                                    [&::-webkit-datetime-edit-minute-field:focus]:bg-transparent
                                                    [&::-webkit-datetime-edit-ampm-field:focus]:bg-transparent
                                                    [&::-webkit-datetime-edit-hour-field:focus]:text-gray-800
                                                    [&::-webkit-datetime-edit-minute-field:focus]:text-gray-800
                                                    [&::-webkit-datetime-edit-ampm-field:focus]:text-gray-800"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="min-w-0">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <Package size={16} className="text-gray-700" />
                                    Package Details <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex-1 min-w-[100px]">
                                        <span className="text-xs text-gray-500">Weight (kg)</span>
                                        <input
                                            placeholder="e.g., 5"
                                            className="w-full min-w-0 mt-1 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Size (cm)</span>
                                        <input
                                            placeholder="e.g., 30 x 20 x 15"
                                            className="w-full min-w-0 mt-1 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none"
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Info banner */}
                        <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-start gap-3">
                            <Users size={20} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-700 leading-snug">
                                We'll find nearby deliveries going the same way so you can save on delivery costs.
                            </p>
                        </div>

                        {/* CTA */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2">
                            Match with Nearby Deliveries
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Map column - sticky on desktop */}
                    <div className="lg:sticky lg:top-8">
                        <div className="rounded-2xl overflow-hidden h-[420px] relative bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 border border-gray-100">
                            <svg viewBox="0 0 400 420" className="w-full h-full">
                                <path
                                    d="M 60 60 C 140 120, 180 60, 230 180 S 320 320, 340 380"
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute top-12 left-16 -translate-x-1/2 -translate-y-full">
                                <MapPin size={28} className="text-blue-600 fill-blue-600" strokeWidth={1.5} />
                            </div>
                            <div className="absolute bottom-12 right-16 translate-x-1/2 -translate-y-full">
                                <MapPin size={28} className="text-emerald-600 fill-emerald-600" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
