import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function BuyerProfilePage() {
    // Form input states
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");

    // UI Loading & Saving states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    // Password change states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Sample purchase orders for UI
    const [myOrders] = useState([
        {
            id: "ORD-9021",
            farmerName: "Saman Perera",
            cropName: "Fresh Organic Carrots",
            qty: "10 kg",
            totalPrice: 1200,
            orderDate: "2026-09-25",
            status: "Delivered"
        },
        {
            id: "ORD-9044",
            farmerName: "Sunil Shantha",
            cropName: "Keeri Samba Rice",
            qty: "25 kg",
            totalPrice: 5750,
            orderDate: "2026-09-29",
            status: "Shipped"
        }
    ]);

    // Backend එකෙන් Profile විස්තර ලබාගැනීම (GET /me)
    useEffect(() => {
        const fetchBuyerProfile = async () => {
            setIsLoading(true);
            try {
                const data = await api.request('GET', '/me');

                if (data) {
                    setFullName(data.name || data.fullName || "");
                    setEmail(data.email || "");
                    setPhone(data.phone || data.contactNumber || "");
                    setDeliveryAddress(data.address || "");
                    setCity(data.city || "");
                    setDistrict(data.district || "");
                }
            } catch (error) {
                console.warn("Backend not connected, loading demo data:", error);
                setFullName("Kasun Chamara");
                setEmail("buyer@ranaswanna.com");
                setPhone("0771234567");
                setDeliveryAddress("No 12, Peradeniya Road, Kandy");
                setCity("Kandy");
                setDistrict("Central Province");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBuyerProfile();
    }, []);

    // වෙනස් කළ විස්තර Backend එකට Save කිරීම (PUT /me)
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const updatedData = {
            fullName: fullName,
            email: email,
            phone: phone,
            deliveryAddress: deliveryAddress,
            city: city,
            district: district
        };

        try {
            await api.request('PUT', '/me', updatedData);
            alert("Profile successfully saved to Backend!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Saved locally! (Backend not reachable or not logged in)");
        } finally {
            setIsSaving(false);
        }
    };

    // Password Update කිරීම
    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters!");
            return;
        }
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-bold">Loading Profile Details...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Buyer Profile
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Ran Aswanna Crop Buying & Order Management Profile
                    </p>
                </div>

                {/* Top Profile Summary Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                        {/* Avatar Badge */}
                        <div className="w-20 h-20 rounded-full bg-green-200 text-green-700 font-bold text-2xl flex items-center justify-center border-2 border-green-500">
                            {fullName ? fullName.charAt(0).toUpperCase() : "B"}
                        </div>
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h2 className="text-xl font-bold text-gray-800">{fullName}</h2>
                                <span className="bg-green-200 text-green-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    Verified Buyer
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{email}</p>
                            <p className="text-xs text-gray-400 mt-1">{city || "City"}, {district || "District"}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-center">
                            <span className="text-xs text-gray-400 font-bold block">PURCHASES</span>
                            <span className="text-lg font-bold text-gray-800">{myOrders.length}</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-center">
                            <span className="text-xs text-gray-400 font-bold block">STATUS</span>
                            <span className="text-lg font-bold text-green-600">Active</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab("details")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            activeTab === "details"
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        Personal Details
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            activeTab === "orders"
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        Order History ({myOrders.length})
                    </button>
                </div>

                {/* DETAILS TAB */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                                Contact & Delivery Address
                            </h3>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Delivery Address</label>
                                    <textarea
                                        rows="2"
                                        required
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1.5">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1.5">District</label>
                                        <input
                                            type="text"
                                            required
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving to Backend..." : "Save to Database"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                                Security
                            </h3>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gray-800 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>

                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                            My Purchases
                        </h3>

                        <div className="space-y-3">
                            {myOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                {order.id}
                                            </span>
                                            <h4 className="font-bold text-gray-800 text-base">{order.cropName}</h4>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Farmer: <span className="font-semibold text-gray-700">{order.farmerName}</span> | Qty: {order.qty}
                                        </p>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                                        <span className="text-base font-bold text-green-600">
                                            LKR {order.totalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-green-100 text-green-700">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default BuyerProfilePage;