import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Camera, Check } from 'lucide-react';

function FarmerSettingsPage() {
    // Farmer Account States
    const [fullName, setFullName] = useState("Saman Perera");
    const [username, setUsername] = useState("saman_farmer");
    const [email, setEmail] = useState("saman.farmer@kataka.com");
    const [phone, setPhone] = useState("0712345678");
    const [address, setAddress] = useState("No 45, Farm Road, Kandy");
    const [password, setPassword] = useState(""); // Leave empty for security input

    // Profile Image State
    const [profileImg, setProfileImg] = useState("https://placehold.co/150x150");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImg(URL.createObjectURL(file));
        }
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();

        const updatedDetails = {
            fullName, username, email, phone, address, profileImg,
            passwordChanged: password !== ""
        };

        console.log("Saving Account Details:", updatedDetails);
        alert("Account settings successfully updated!");
        setPassword(""); // Clear password field after saving
    };

    return (
        <div className="w-full h-full font-sans max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
                <p className="text-gray-500 mt-2">Manage your personal farmer profile, contact details, and security.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">

                {/* Left Side: Profile Picture Upload */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#D2E9C4] shadow-md">
                            <img src={profileImg} alt="Profile DP" className="w-full h-full object-cover" />
                        </div>
                        {/* Hover Overlay for Camera Icon */}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mt-4">{fullName}</h3>
                    <p className="text-sm text-gray-500">@{username}</p>
                </div>

                {/* Right Side: Account Details Form */}
                <div className="w-full md:w-2/3">
                    <form onSubmit={handleSaveSettings} className="space-y-5">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5"><User className="w-4 h-4 text-gray-400" /> Full Name</label>
                                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5"><User className="w-4 h-4 text-gray-400" /> Username</label>
                                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5"><Mail className="w-4 h-4 text-gray-400" /> Email Address</label>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5"><Phone className="w-4 h-4 text-gray-400" /> Phone Number</label>
                                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5"><MapPin className="w-4 h-4 text-gray-400" /> Farm Address</label>
                            <textarea rows="2" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50 resize-none"></textarea>
                        </div>

                        <hr className="border-gray-100 my-4" />

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5"><Lock className="w-4 h-4 text-gray-400" /> New Password (Optional)</label>
                            <input type="password" placeholder="Leave empty to keep current password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="bg-[#8dc63f] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2">
                                <Check className="w-5 h-5" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default FarmerSettingsPage;