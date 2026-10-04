import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

// Helper to resolve profile image path safely
const resolveFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return 'http://localhost:8080' + (path.startsWith('/files/') ? path : '/files/' + path);
};

function BuyerProfilePage() {
    const navigate = useNavigate();

    // User Profile States
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("BUYER");
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Orders State
    const [myOrders, setMyOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState("");

    // UI States
    const [activeTab, setActiveTab] = useState("details");
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isSwitchingRole, setIsSwitchingRole] = useState(false);

    const [formMessage, setFormMessage] = useState({ type: "", text: "" });
    const [securityMessage, setSecurityMessage] = useState({ type: "", text: "" });
    const [farmerMessage, setFarmerMessage] = useState({ type: "", text: "" });

    // Load Profile from Backend
    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const data = await api.request('GET', '/me');
            if (data) {
                setUsername(data.username || "");
                setEmail(data.email || "");
                setPhoneNumber(data.phoneNumber || "");
                setAddress(data.address || "");
                setRole(data.role || "BUYER");
                setProfilePictureUrl(data.profilePictureUrl || null);

                // LocalStorage එකත් Backend Role එක සමඟ sync කරගැනීම
                if (data.role) {
                    localStorage.setItem("user_role", data.role);
                }
            }
        } catch (error) {
            const errorText = error.response?.data?.error || error.response?.data?.message || "Failed to load profile details.";
            setFormMessage({ type: "error", text: errorText });
        } finally {
            setIsLoading(false);
        }
    };

    // Load Orders from Backend
    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        setOrdersError("");
        try {
            const data = await api.request('GET', '/buyer/orders');
            setMyOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load buyer orders:", error);
            const status = error.response?.status;
            setMyOrders([]);
            setOrdersError(
                status === 401 ? "Your session has expired. Please log in again."
                    : status === 403 ? "You don't have permission to view these orders."
                        : "Could not load order history from database."
            );
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
        fetchOrders();
    }, []);

    // Logout Action
    const handleLogout = () => {
        localStorage.removeItem("my_app_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user");
        navigate("/");
    };

    // Update Profile Details
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setFormMessage({ type: "", text: "" });
        setIsSavingProfile(true);

        const updateData = {
            username: username.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim()
        };

        try {
            const updated = await api.request('PUT', '/me', updateData);
            setFormMessage({ type: "success", text: "Profile details saved successfully." });
            if (updated) {
                setUsername(updated.username || username);
                setEmail(updated.email || email);
                setPhoneNumber(updated.phoneNumber || phoneNumber);
                setAddress(updated.address || address);
            }
        } catch (error) {
            const errorText = error.response?.data?.error || error.response?.data?.message || "Failed to save profile details.";
            setFormMessage({ type: "error", text: errorText });
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Upload Profile Photo
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormMessage({ type: "", text: "" });
        setIsUploadingPhoto(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.client.post('/me/picture', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFormMessage({ type: "success", text: "Profile photo updated successfully." });
            if (res.data?.profilePictureUrl) {
                setProfilePictureUrl(res.data.profilePictureUrl);
            }
            await fetchUserProfile();
        } catch (error) {
            const errorText = error.response?.data?.error || error.response?.data?.message || "Failed to upload photo.";
            setFormMessage({ type: "error", text: errorText });
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSecurityMessage({ type: "", text: "" });

        if (!currentPassword || !newPassword || !confirmPassword) {
            setSecurityMessage({ type: "error", text: "Please fill in all password fields." });
            return;
        }

        if (newPassword.length < 8) {
            setSecurityMessage({ type: "error", text: "New password must be at least 8 characters long." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setSecurityMessage({ type: "error", text: "New password and confirm password do not match." });
            return;
        }

        setIsSavingPassword(true);
        try {
            await api.request('PUT', '/me/password', {
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            setSecurityMessage({ type: "success", text: "Password updated successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            const errorText = error.response?.data?.error || error.response?.data?.message || "Failed to update password.";
            setSecurityMessage({ type: "error", text: errorText });
        } finally {
            setIsSavingPassword(false);
        }
    };

    // Become a Farmer / Go to Farmer Dashboard Action
    const handleFarmerButtonClick = async () => {
        if (role === "FARMER") {
            navigate("/farmer/home");
            return;
        }

        setFarmerMessage({ type: "", text: "" });
        setIsSwitchingRole(true);

        try {
            await api.request('PUT', '/me/role', { role: "FARMER" });
            setRole("FARMER");
            localStorage.setItem("user_role", "FARMER");

            setFarmerMessage({
                type: "success",
                text: "Account switched to Farmer mode successfully. Redirecting to Farmer Dashboard..."
            });

            setTimeout(() => {
                navigate("/farmer/home", { replace: true });
            }, 600);
        } catch (error) {
            const errorText = error.response?.data?.error || error.response?.data?.message || "Failed to switch role.";
            setFarmerMessage({ type: "error", text: errorText });
            setIsSwitchingRole(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-sm font-semibold text-gray-600">Loading Profile Details...</p>
            </div>
        );
    }

    const ordersCountLabel = ordersError ? "—" : myOrders.length;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Top Bar with Title, Home Button and Logout Button */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Personal Profile</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Ran Aswanna Personal Profile & Order Management
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold px-4 py-2 rounded-xl text-sm transition cursor-pointer shadow-sm"
                        >
                            Home
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-5 py-2 rounded-xl text-sm transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Top Summary Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full sm:w-auto">
                        <div className="relative w-20 h-20 shrink-0">
                            {profilePictureUrl ? (
                                <img
                                    src={resolveFileUrl(profilePictureUrl)}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow-sm"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 font-bold text-2xl flex items-center justify-center border-2 border-green-500">
                                    {username ? username.charAt(0).toUpperCase() : "U"}
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                disabled={isUploadingPhoto}
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title="Click to upload profile photo"
                            />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h2 className="text-xl font-bold text-gray-900">{username || "User"}</h2>
                                <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                                    Role: {role}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{email}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{address || "No address provided"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                        <div className="bg-gray-50 border border-gray-100 px-5 py-3 rounded-xl text-center">
                            <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Purchases</span>
                            <span className="text-lg font-bold text-gray-900">{ordersCountLabel}</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 px-5 py-3 rounded-xl text-center">
                            <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Status</span>
                            <span className="text-lg font-bold text-green-600">Active</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab("details")}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                            activeTab === "details"
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        Personal Details
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                            activeTab === "orders"
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        Order History ({ordersCountLabel})
                    </button>
                </div>

                {/* Tab 1: Personal Details */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Contact & Delivery Address Card */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                                Contact & Delivery Address
                            </h3>

                            {formMessage.text && (
                                <div className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
                                    formMessage.type === "success"
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                    {formMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1.5">Username / Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1.5">Phone Number</label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="07XXXXXXXX"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
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
                                        className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Full Delivery Address (Street, City, District)</label>
                                    <textarea
                                        rows="3"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter delivery address..."
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition cursor-pointer disabled:opacity-50"
                                    >
                                        {isSavingProfile ? "Saving Details..." : "Save Profile Details"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: Security Card & Farmer Mode Action Card */}
                        <div className="space-y-6">

                            {/* 1. Security Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                                    Security
                                </h3>

                                {securityMessage.text && (
                                    <div className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
                                        securityMessage.type === "success"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}>
                                        {securityMessage.text}
                                    </div>
                                )}

                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1.5">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
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
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
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
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSavingPassword}
                                        className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
                                    >
                                        {isSavingPassword ? "Updating Password..." : "Update Password"}
                                    </button>
                                </form>
                            </div>

                            {/* 2. Farmer Mode Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-base font-bold text-gray-800 mb-2 border-b border-gray-100 pb-3">
                                    Farmer Mode
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    {role === "FARMER"
                                        ? "Your account is in Farmer mode. Access your farm plots, crops, and sales management."
                                        : "Want to sell your harvest on Ran Aswanna? Switch your account to Farmer mode."}
                                </p>

                                {farmerMessage.text && (
                                    <div className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
                                        farmerMessage.type === "success"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}>
                                        {farmerMessage.text}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleFarmerButtonClick}
                                    disabled={isSwitchingRole}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
                                >
                                    {isSwitchingRole
                                        ? "Updating to Farmer..."
                                        : role === "FARMER"
                                            ? "Go to Farmer Dashboard"
                                            : "Become a Farmer"}
                                </button>
                            </div>

                        </div>

                    </div>
                )}

                {/* Tab 2: Orders */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                            My Orders ({ordersCountLabel})
                        </h3>

                        {isLoadingOrders ? (
                            <p className="text-sm text-gray-500 py-6 text-center">Loading orders...</p>
                        ) : ordersError ? (
                            <div className="py-8 text-center flex flex-col items-center">
                                <p className="text-sm text-red-600 mb-3">{ordersError}</p>
                                <button
                                    type="button"
                                    onClick={fetchOrders}
                                    className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : myOrders.length === 0 ? (
                            <p className="text-sm text-gray-500 py-6 text-center">No orders recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {myOrders.map((order, index) => (
                                    <div
                                        key={order.orderId || index}
                                        className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                Order #{order.orderId} - {order.firstItemName || "Items"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Date: {order.orderDate ? order.orderDate.substring(0, 10) : "N/A"} | Farmer: {order.farmerName || "Farmer"}
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-sm font-bold text-green-700">
                                                LKR {(order.totalAmount || 0).toLocaleString()}
                                            </p>
                                            <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">
                                                {order.orderStatus || "PENDING"}
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