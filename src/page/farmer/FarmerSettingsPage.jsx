import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';
import { toFileUrl } from '@/api/config.js';

const api = new ApiService();

function FarmerSettingsPage() {
    // Profile Fields (Exact Backend DTO keys)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("FARMER");
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    // Password Change Fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Status & Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isUploadingPic, setIsUploadingPic] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 1. Database එකෙන් User Profile තොරතුරු Load කිරීම (GET /api/me)
    const loadProfile = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await api.request('GET', '/me');
            if (data) {
                setUsername(data.username || "");
                setEmail(data.email || "");
                setPhoneNumber(data.phoneNumber || "");
                setAddress(data.address || "");
                setRole(data.role || "FARMER");
                setProfilePictureUrl(data.profilePictureUrl || null);
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            const serverMsg = error.response?.data?.error || "Could not load profile from database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // 2. Profile Details Database එකේ Save කිරීම (PUT /api/me)
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        setIsSavingProfile(true);

        const payload = {
            username: username.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim()
        };

        try {
            const updated = await api.request('PUT', '/me', payload);
            setSuccessMessage("Profile details successfully updated in Database!");
            if (updated) {
                setUsername(updated.username || username);
                setEmail(updated.email || email);
                setPhoneNumber(updated.phoneNumber || phoneNumber);
                setAddress(updated.address || address);
            }
        } catch (error) {
            console.error("Profile update error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to update profile details.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSavingProfile(false);
        }
    };

    // 3. Profile Picture එක Upload කිරීම (POST /api/me/picture)
    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("The profile image is too big. Maximum allowed size is 5 MB.");
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
            setSuccessMessage("Profile picture updated successfully!");
            if (res.data?.profilePictureUrl) {
                setProfilePictureUrl(res.data.profilePictureUrl);
            }
            await loadProfile();
        } catch (error) {
            console.error("Picture upload error:", error);
            const serverMsg = error.response?.data?.error || "Failed to upload profile picture.";
            setErrorMessage(serverMsg);
        } finally {
            setIsUploadingPic(false);
        }
    };

    // 4. Password එක වෙනස් කිරීම (PUT /api/me/password)
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
            setErrorMessage("New password and confirm password do not match.");
            return;
        }

        setIsSavingPassword(true);

        const payload = {
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        try {
            await api.request('PUT', '/me/password', payload);
            setSuccessMessage("Password successfully changed in Database!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Password change error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to update password.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your farmer profile, personal details, and account security.</p>
            </div>

            {/* Notification Messages */}
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

            {isLoading ? (
                <div className="text-center py-12 text-gray-500 font-bold">
                    Connecting to Database and loading account settings...
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Card & DP Upload */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-fit">
                        <div className="relative group cursor-pointer w-32 h-32 mb-4">
                            {profilePictureUrl ? (
                                <img
                                    src={toFileUrl(profilePictureUrl)}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-4 border-green-100 shadow-sm"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center text-green-800 text-3xl font-bold shadow-sm">
                                    {username ? username.charAt(0).toUpperCase() : "F"}
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold px-2 py-1 bg-black/60 rounded-md">
                                    {isUploadingPic ? "Uploading..." : "Change Photo"}
                                </span>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                disabled={isUploadingPic}
                                onChange={handleProfilePicChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        <h3 className="text-lg font-bold text-gray-800">{username || "Farmer User"}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{email}</p>

                        <div className="mt-4 px-3 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-full border border-green-200">
                            Role: {role}
                        </div>

                        <p className="text-xs text-gray-400 mt-6 text-center">
                            Click on photo to upload a fresh image (JPG, PNG or WEBP up to 5MB).
                        </p>
                    </div>

                    {/* Right Column: Profile Form & Password Change */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* 1. Personal Information Form */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                                Personal Information
                            </h3>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Username</label>
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="e.g., 0712345678"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Farm / Residential Address</label>
                                    <textarea
                                        rows="2"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="No 45, Farm Road, Kandy..."
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm text-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSavingProfile ? "Saving to Database..." : "Save Profile Details"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 2. Change Password Form */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                                Change Password
                            </h3>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter your existing password"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            minLength="8"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="At least 8 characters"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            minLength="8"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-type new password"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingPassword}
                                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm text-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSavingPassword ? "Updating Password..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default FarmerSettingsPage;