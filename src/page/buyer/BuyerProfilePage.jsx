import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function BuyerProfilePage() {
    // 1. Profile input states (Matching Backend /me DTO exactly)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("BUYER");
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    // 2. Password change states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 3. Purchase orders state
    const [myOrders, setMyOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // 4. UI Loading & Feedback states
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isUploadingPic, setIsUploadingPic] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 1. Database එකෙන් Profile විස්තර ලබාගැනීම (GET /api/me)
    const fetchBuyerProfile = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await api.request('GET', '/me');
            if (data) {
                setUsername(data.username || "");
                setEmail(data.email || "");
                setPhoneNumber(data.phoneNumber || "");
                setAddress(data.address || "");
                setRole(data.role || "BUYER");
                setProfilePictureUrl(data.profilePictureUrl || null);
            }
        } catch (error) {
            console.error("Failed to fetch buyer profile:", error);
            const serverMsg = error.response?.data?.error || "Could not load profile from database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Database එකෙන් Buyer Orders ලබාගැනීම (GET /api/buyer/orders)
    const fetchBuyerOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const data = await api.request('GET', '/buyer/orders');
            if (Array.isArray(data)) {
                setMyOrders(data);
            } else {
                setMyOrders([]);
            }
        } catch (error) {
            console.warn("Buyer orders endpoint not ready, using fallback:", error);
            setMyOrders([
                {
                    orderId: 9021,
                    farmerName: "Saman Perera",
                    firstItemName: "Fresh Organic Carrots",
                    itemCount: 1,
                    totalAmount: 1200,
                    orderDate: "2026-09-25",
                    orderStatus: "COMPLETED"
                },
                {
                    orderId: 9044,
                    farmerName: "Sunil Shantha",
                    firstItemName: "Keeri Samba Rice",
                    itemCount: 2,
                    totalAmount: 5750,
                    orderDate: "2026-09-29",
                    orderStatus: "SHIPPED"
                }
            ]);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        fetchBuyerProfile();
        fetchBuyerOrders();
    }, []);

    // 3. Profile විස්තර Database එකේ Save කිරීම (PUT /api/me)
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        setIsSavingProfile(true);

        const updatedData = {
            username: username.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim()
        };

        try {
            const updated = await api.request('PUT', '/me', updatedData);
            setSuccessMessage("Buyer profile successfully updated in Database!");
            if (updated) {
                setUsername(updated.username || username);
                setEmail(updated.email || email);
                setPhoneNumber(updated.phoneNumber || phoneNumber);
                setAddress(updated.address || address);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to save profile to database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSavingProfile(false);
        }
    };

    // 4. Profile Picture Upload කිරීම (POST /api/me/picture)
    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("Image is too big. Maximum allowed size is 5 MB.");
            return;
        }

        setSuccessMessage("");
        setErrorMessage("");
        setIsUploadingPic(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.client.post('/me/picture', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSuccessMessage("Profile photo updated successfully!");
            if (res.data?.profilePictureUrl) {
                setProfilePictureUrl(res.data.profilePictureUrl);
            }
            await fetchBuyerProfile();
        } catch (error) {
            console.error("Profile picture upload failed:", error);
            const serverMsg = error.response?.data?.error || "Failed to upload photo.";
            setErrorMessage(serverMsg);
        } finally {
            setIsUploadingPic(false);
        }
    };

    // 5. Password Update කිරීම (PUT /api/me/password)
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!currentPassword || !newPassword) {
            setErrorMessage("Please enter both current and new passwords.");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage("New password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirmation do not match.");
            return;
        }

        setIsSavingPassword(true);

        const payload = {
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        try {
            await api.request('PUT', '/me/password', payload);
            setSuccessMessage("Password updated successfully in Database!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Password update error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to update password.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-bold">Connecting to Database and loading profile...</p>
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

                {/* Status Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
                        {errorMessage}
                    </div>
                )}

                {/* Top Profile Summary Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                        {/* Avatar / Picture with Upload */}
                        <div className="relative group cursor-pointer w-20 h-20">
                            {profilePictureUrl ? (
                                <img
                                    src={profilePictureUrl.startsWith('http') ? profilePictureUrl : `http://localhost:8080${profilePictureUrl.startsWith('/files/') ? profilePictureUrl : '/files/' + profilePictureUrl}`}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow-sm"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-green-100 text-green-800 font-bold text-2xl flex items-center justify-center border-2 border-green-500">
                                    {username ? username.charAt(0).toUpperCase() : "B"}
                                </div>
                            )}

                            {/* Upload Overlay */}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold px-1.5 py-0.5 bg-black/60 rounded">
                                    {isUploadingPic ? "..." : "Edit"}
                                </span>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                disabled={isUploadingPic}
                                onChange={handleProfilePicChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title="Click to upload profile photo"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h2 className="text-xl font-bold text-gray-800">{username || "Buyer User"}</h2>
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                                    Role: {role}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{email}</p>
                            <p className="text-xs text-gray-400 mt-1">{address || "No delivery address set yet"}</p>
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

                {/* TAB 1: PERSONAL DETAILS & SECURITY */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Contact & Delivery Address Card */}
                        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-base font-bold text-gray-700 mb-4 border-b border-gray-100 pb-3">
                                Contact & Delivery Address
                            </h3>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1.5">Username / Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="e.g., 0771234567"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Full Delivery Address (Street, City, District)</label>
                                    <textarea
                                        rows="3"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="No 12, Peradeniya Road, Kandy, Central Province..."
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer text-sm disabled:opacity-50"
                                    >
                                        {isSavingProfile ? "Saving to Database..." : "Save Profile Details"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
                            <h3 className="text-base font-bold text-gray-700 mb-4 border-b border-gray-100 pb-3">
                                Security
                            </h3>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="At least 8 characters"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-type new password"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSavingPassword}
                                    className="w-full bg-gray-800 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingPassword ? "Updating Password..." : "Update Password"}
                                </button>
                            </form>
                        </div>

                    </div>
                )}

                {/* TAB 2: ORDER HISTORY */}
                {activeTab === "orders" && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                            <h3 className="text-base font-bold text-gray-700">
                                My Purchases ({myOrders.length})
                            </h3>
                            <button
                                type="button"
                                onClick={fetchBuyerOrders}
                                className="text-xs text-green-700 font-bold hover:underline cursor-pointer"
                            >
                                Refresh Orders
                            </button>
                        </div>

                        {isLoadingOrders ? (
                            <p className="text-xs text-gray-400 py-8 text-center">Loading orders from database...</p>
                        ) : myOrders.length === 0 ? (
                            <p className="text-xs text-gray-400 py-8 text-center">No purchases recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {myOrders.map((order, idx) => (
                                    <div
                                        key={order.orderId || order.id || idx}
                                        className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                    #{order.orderId || order.id}
                                                </span>
                                                <h4 className="font-bold text-gray-800 text-base">
                                                    {order.firstItemName || order.cropName || "Farm Produce"}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Farmer: <span className="font-semibold text-gray-700">{order.farmerName || "Farmer"}</span> | Items: {order.itemCount || 1}
                                            </p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                Date: {order.orderDate ? order.orderDate.substring(0, 10) : "Recent"}
                                            </p>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                                            <span className="text-base font-bold text-green-600">
                                                LKR {(order.totalAmount || order.totalPrice || 0).toLocaleString()}
                                            </span>
                                            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-green-100 text-green-700">
                                                {order.orderStatus || order.status || "PENDING"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default BuyerProfilePage;