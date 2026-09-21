import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Phone, MapPin, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { farmerService } from '@/api/farmerService';

function FarmerSettingsPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        address: ''
    });
    const [profileImg, setProfileImg] = useState('https://placehold.co/150x150');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const data = await farmerService.getProfile();
            if (data) {
                setFormData({
                    username: data.username || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                    address: data.address || ''
                });
                if (data.profilePictureUrl) {
                    setProfileImg(data.profilePictureUrl);
                }
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setStatusMessage(null);
            // Payload matches UpdateProfileDto on the backend
            await farmerService.updateProfile(formData);
            setStatusMessage({ type: 'success', text: 'Account settings updated successfully!' });
        } catch (error) {
            console.error('Settings update error:', error);
            setStatusMessage({ type: 'error', text: 'Failed to update profile settings.' });
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = () => {
        const confirmed = window.confirm('Are you sure you want to sign out?');
        if (!confirmed) return;

        localStorage.removeItem('my_app_token');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="w-full h-full font-sans max-w-4xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your farm profile, contact information, and security</p>
                </div>
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-5 rounded-xl border border-red-200 transition-colors text-sm shadow-sm"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>

            {/* Status Alerts */}
            {statusMessage && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                    statusMessage.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-10">
                    {/* Left: Avatar Section */}
                    <div className="w-full md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                        <div className="relative group cursor-pointer w-36 h-36 rounded-full overflow-hidden border-4 border-green-100 shadow-inner">
                            <img src={profileImg} alt="Farmer Avatar" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-green-950/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                                <Camera className="w-7 h-7 mb-1" />
                                <span className="text-xs font-semibold">Change Photo</span>
                            </div>
                        </div>
                        <h2 className="font-bold text-gray-800 mt-4 text-lg">{formData.username || 'Farmer Profile'}</h2>
                        <p className="text-xs text-gray-400 mt-1">{formData.email || 'Registered Member'}</p>

                        <div className="mt-6 w-full bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                            <span className="text-xs font-bold text-green-800 uppercase tracking-wider block">Farmer Account</span>
                            <span className="text-xs text-green-700 mt-1 block">Active Verified Profile</span>
                        </div>
                    </div>

                    {/* Right: Form Details */}
                    <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-bold text-gray-800 mb-5">Personal & Farm Details</h3>
                        <form onSubmit={handleSaveSettings} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-green-700" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-green-700" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="farmer@example.com"
                                        className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-green-700" />
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="07X XXX XXXX"
                                        className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-green-700" />
                                        Farm Address
                                    </label>
                                    <textarea
                                        rows="3"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Plot location, Village, City"
                                        className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm resize-none transition-all shadow-sm"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 text-sm"
                                >
                                    {saving ? 'Saving Details...' : 'Save Profile Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerSettingsPage;