import React, { useState, useEffect } from 'react';
import { farmerService } from '@/api/farmerService';

function FarmerCropManagementPage() {
    const [crops, setCrops] = useState([]);
    const [newCrop, setNewCrop] = useState({
        name: '',
        variety: '',
        date: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            setLoading(true);
            const data = await farmerService.getCrops();
            setCrops(data || []);
        } catch (error) {
            console.error('Failed to load crops:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        if (!newCrop.name || !newCrop.variety || !newCrop.quantity) return;

        try {
            // Field names match CropRequestDto on the backend
            const payload = {
                cropName: newCrop.name,
                category: newCrop.variety,
                unit: 'kg',
                harvestQuantity: Number(newCrop.quantity),
                harvestDate: newCrop.date
            };
            const created = await farmerService.createCrop(payload);
            setCrops(prev => [...prev, created]);
            setNewCrop({ name: '', variety: '', date: '', quantity: '' });
            alert('නව බෝග කොටස සාර්ථකව එක් කරන ලදී!');
        } catch (error) {
            console.error('Crop creation error:', error);
            alert('බෝග කොටස එක් කිරීම අසාර්ථක විය.');
        }
    };

    const handleDeleteCrop = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this plot record?');
        if (!isConfirmed) return;

        try {
            await farmerService.deleteCrop(id);
            setCrops(prev => prev.filter(c => c.cropId !== id));
        } catch (error) {
            console.error('Failed to delete crop:', error);
            alert('ඉවත් කිරීම අසාර්ථක විය.');
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Crop Management</h1>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Active Plots List */}
                <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Active Field Plots</h2>
                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-sm text-gray-400">Loading crops data...</p>
                        ) : crops.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm">
                                No active field plots found. Register one using the form.
                            </div>
                        ) : (
                            crops.map(item => (
                                <div
                                    key={item.cropId}
                                    className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.cropName}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Category: {item.category} | Stock: {item.harvestQuantity} {item.unit}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCrop(item.cropId)}
                                        className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add New Plot Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-gray-700 mb-4 text-lg">Register New Field Plot</h2>
                    <form onSubmit={handleAddCrop} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase">Crop Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Potato, Green Chili"
                                value={newCrop.name}
                                onChange={e => setNewCrop({ ...newCrop, name: e.target.value })}
                                className="w-full border border-green-700 rounded-xl p-3 bg-white text-gray-800 text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase">Variety / Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Granola / Organic"
                                value={newCrop.variety}
                                onChange={e => setNewCrop({ ...newCrop, variety: e.target.value })}
                                className="w-full border border-green-700 rounded-xl p-3 bg-white text-gray-800 text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase">Harvest Quantity (kg)</label>
                            <input
                                type="number"
                                placeholder="500"
                                value={newCrop.quantity}
                                onChange={e => setNewCrop({ ...newCrop, quantity: e.target.value })}
                                className="w-full border border-green-700 rounded-xl p-3 bg-white text-gray-800 text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 shadow-sm"
                                required
                                min="0"
                                step="0.1"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase">Harvest Date</label>
                            <input
                                type="date"
                                value={newCrop.date}
                                onChange={e => setNewCrop({ ...newCrop, date: e.target.value })}
                                className="w-full border border-green-700 rounded-xl p-3 bg-white text-gray-800 text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 shadow-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm mt-2"
                        >
                            Register Plot
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FarmerCropManagementPage;