import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { farmerService } from '@/api/farmerService';

function FarmerSettingsPage() {
    const [formData, setFormData] = useState({ username: "", email: "", phoneNumber: "", address: "" });
    const [profileImg, setProfileImg] = useState("https://placehold.co/150x150");

    useEffect(() => {
        farmerService.getProfile().then(data => {
            if(data) {
                setFormData({
                    username: data.username || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    address: data.address || ""
                });
                if (data.profilePictureUrl) setProfileImg(data.profilePictureUrl);
            }
        }).catch(console.error);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            // Field names match UpdateProfileDto on the backend
            await farmerService.updateProfile(formData);
            alert("Account settings successfully updated!");
        } catch(error) { alert("Failed to update profile."); }
    };

    const handleSignOut = () => {
        localStorage.removeItem('my_app_token');
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
    };

    return (
        <div className="w-full h-full font-sans max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
                <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl transition-all">Sign Out</button>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="relative group cursor-pointer w-32 h-32 rounded-full overflow-hidden border-4 border-[#D2E9C4]">
                        <img src={profileImg} alt="Profile DP" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-2/3">
                    <form onSubmit={handleSaveSettings} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div><label className="text-sm font-bold block mb-1">Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 bg-gray-50" /></div>
                            <div><label className="text-sm font-bold block mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 bg-gray-50" /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div><label className="text-sm font-bold block mb-1">Phone</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 bg-gray-50" /></div>
                            <div><label className="text-sm font-bold block mb-1">Farm Address</label><textarea name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-xl px-4 py-2.5 bg-gray-50"></textarea></div>
                        </div>
                        <button type="submit" className="bg-[#8dc63f] text-white font-bold py-3 px-8 rounded-xl w-full">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FarmerSettingsPage;