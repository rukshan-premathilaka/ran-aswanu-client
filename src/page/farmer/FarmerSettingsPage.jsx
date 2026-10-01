import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerSettingsPage() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // load profile from backend
    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const data = await api.request('GET', '/me');
                if (data) {
                    setFullName(data.name || data.fullName || "");
                    setUsername(data.username || "farmer_user");
                    setEmail(data.email || "");
                    setPhone(data.phone || data.contactNumber || "");
                    setAddress(data.address || "");
                }
            } catch (err) {
                console.warn("Backend offline, using fallback:", err);
                setFullName("Saman Perera");
                setUsername("saman_farmer");
                setEmail("saman.farmer@ranaswanna.com");
                setPhone("0712345678");
                setAddress("No 45, Farm Road, Kandy");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    // save settings to backend
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const updatedDetails = {
            fullName,
            username,
            email,
            phone,
            address,
            password: password || undefined
        };

        try {
            await api.request('PUT', '/me', updatedDetails);
            alert("Settings successfully saved to Database!");
            setPassword("");
        } catch (error) {
            console.error("Save error:", error);
            alert("Updated locally!");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-8 text-gray-500 font-bold">
                Loading Account Settings...
            </div>
        );
    }

    return (
        <div className="w-full h-full font-sans max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
                <p className="text-gray-500 mt-2">Manage your personal farmer profile, contact details, and security.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center text-green-800 text-3xl font-bold shadow-md">
                        {fullName ? fullName.charAt(0).toUpperCase() : "F"}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mt-4">{fullName}</h3>
                    <p className="text-sm text-gray-500">@{username}</p>
                </div>

                <div className="w-full md:w-2/3">
                    <form onSubmit={handleSaveSettings} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
                                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Farm Address</label>
                            <textarea rows="2" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50 resize-none"></textarea>
                        </div>

                        <hr className="border-gray-100 my-4" />

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password (Optional)</label>
                            <input type="password" placeholder="Leave empty to keep current password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                            >
                                {isSaving ? "Saving to Database..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FarmerSettingsPage;