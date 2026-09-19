import React, { useState, useEffect } from 'react';
import { farmerService } from '@/api/farmerService';

function FarmerCropManagementPage() {
    const [crops, setCrops] = useState([]);
    const [newCrop, setNewCrop] = useState({ name: "", variety: "", date: "", quantity: "" });

    useEffect(() => { fetchCrops(); }, []);

    const fetchCrops = async () => {
        try {
            const data = await farmerService.getCrops();
            setCrops(data || []);
        } catch (error) {
            console.error(error);
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
                unit: "kg",
                harvestQuantity: Number(newCrop.quantity),
                harvestDate: newCrop.date
            };
            const created = await farmerService.createCrop(payload);
            setCrops([...crops, created]);
            setNewCrop({ name: "", variety: "", date: "", quantity: "" });
            alert("නව බෝග කොටස සාර්ථකව එක් කරන ලදී!");
        } catch (error) {
            alert("අසාර්ථකයි.");
        }
    };

    const handleDeleteCrop = async (id) => {
        if(!window.confirm("Delete this plot?")) return;
        try {
            await farmerService.deleteCrop(id);
            setCrops(crops.filter(c => c.cropId !== id));
        } catch(e) { alert("Failed to delete."); }
    }

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Crop Management</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Active Plots */}
                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Active Field Plots</h3>
                    <div className="space-y-3">
                        {crops.map((item) => (
                            <div key={item.cropId} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800">{item.cropName}</h4>
                                    <p className="text-sm text-gray-500">Category: {item.category} | Stock: {item.harvestQuantity} {item.unit}</p>
                                </div>
                                <button onClick={() => handleDeleteCrop(item.cropId)} className="text-red-500 text-sm font-bold">Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add New Plot */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-4">Add New Field Plot</h4>
                    <form onSubmit={handleAddCrop} className="flex flex-col gap-4">
                        <input type="text" placeholder="Crop Name" value={newCrop.name} onChange={e => setNewCrop({...newCrop, name: e.target.value})} className="border p-3 rounded-xl bg-gray-50" required />
                        <input type="text" placeholder="Variety" value={newCrop.variety} onChange={e => setNewCrop({...newCrop, variety: e.target.value})} className="border p-3 rounded-xl bg-gray-50" required />
                        <input type="number" placeholder="Harvest Quantity (kg)" value={newCrop.quantity} onChange={e => setNewCrop({...newCrop, quantity: e.target.value})} className="border p-3 rounded-xl bg-gray-50" required min="0" step="0.1" />
                        <input type="date" value={newCrop.date} onChange={e => setNewCrop({...newCrop, date: e.target.value})} className="border p-3 rounded-xl bg-gray-50" required />
                        <button type="submit" className="bg-[#8dc63f] text-white font-bold py-3 rounded-xl">Register Plot</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FarmerCropManagementPage;