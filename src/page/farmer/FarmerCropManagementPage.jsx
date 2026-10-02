import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerCropManagementPage() {
    const [crops, setCrops] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [editNotes, setEditNotes] = useState("");
    const [editQuantity, setEditQuantity] = useState("");

    // Form inputs matching backend CropRequestDto
    const [newCropName, setNewCropName] = useState("");
    const [newCategory, setNewCategory] = useState("Vegetables");
    const [newQuantity, setNewQuantity] = useState("");
    const [newUnit, setNewUnit] = useState("kg");
    const [newHarvestDate, setNewHarvestDate] = useState("");
    const [newNotes, setNewNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Database එකෙන් Crops Load කරගැනීම (GET /farmer/crops)
    const loadCropsFromDb = async () => {
        setIsLoading(true);
        try {
            const res = await api.request('GET', '/farmer/crops');
            let list = [];

            if (Array.isArray(res)) {
                list = res;
            } else if (res && Array.isArray(res.content)) {
                list = res.content;
            } else if (res && Array.isArray(res.data)) {
                list = res.data;
            }

            const normalized = list.map((c, idx) => ({
                id: c.cropId || c.id || idx + 1,
                cropName: c.cropName || c.name || "Unnamed Crop",
                category: c.category || "Vegetables",
                harvestQuantity: c.harvestQuantity || c.quantity || 0,
                unit: c.unit || "kg",
                harvestDate: c.harvestDate || c.date || "",
                notes: c.notes || ""
            }));

            setCrops(normalized);
            if (normalized.length > 0) {
                setEditNotes(normalized[0].notes || "");
                setEditQuantity(normalized[0].harvestQuantity || "");
            }
        } catch (error) {
            console.error("Failed to load crops from DB:", error);
            setCrops([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCropsFromDb();
    }, []);

    const handleSelectCrop = (index) => {
        setSelectedIndex(index);
        setEditNotes(crops[index]?.notes || "");
        setEditQuantity(crops[index]?.harvestQuantity || "");
    };

    // 2. Crop එක Update කිරීම (PUT /farmer/crops/{id})
    const handleUpdateCrop = async (e) => {
        e.preventDefault();
        const selectedCrop = crops[selectedIndex];
        if (!selectedCrop) return;

        const payload = {
            cropName: selectedCrop.cropName,
            name: selectedCrop.cropName,
            category: selectedCrop.category,
            harvestQuantity: Number(editQuantity) || selectedCrop.harvestQuantity,
            quantity: Number(editQuantity) || selectedCrop.harvestQuantity,
            unit: selectedCrop.unit,
            harvestDate: selectedCrop.harvestDate,
            notes: editNotes
        };

        try {
            await api.request('PUT', `/farmer/crops/${selectedCrop.id}`, payload);
            alert("Crop details successfully updated in Database!");
            loadCropsFromDb();
        } catch (error) {
            console.error("Update failed:", error);
            const msg = error.response?.data?.message || error.message;
            alert(`Database update failed: ${msg}`);
        }
    };

    // 3. නව Crop එකක් කෙලින්ම Database එකට Save කිරීම (POST /farmer/crops)
    const handleAddCrop = async (e) => {
        e.preventDefault();
        if (!newCropName.trim()) {
            alert("Please enter a crop name!");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            cropName: newCropName.trim(),
            name: newCropName.trim(),
            category: newCategory,
            harvestQuantity: Number(newQuantity) > 0 ? Number(newQuantity) : 10,
            quantity: Number(newQuantity) > 0 ? Number(newQuantity) : 10,
            unit: newUnit,
            harvestDate: newHarvestDate || new Date().toISOString().split('T')[0],
            date: newHarvestDate || new Date().toISOString().split('T')[0],
            notes: newNotes.trim() || "Field crop"
        };

        try {
            await api.request('POST', '/farmer/crops', payload);
            alert("Success! New crop saved to Database!");
            setNewCropName("");
            setNewQuantity("");
            setNewHarvestDate("");
            setNewNotes("");
            // Database එකෙන් නැවත නැවුම් දත්ත ගෙන්වා ගැනීම
            await loadCropsFromDb();
        } catch (error) {
            console.error("Backend Save Error:", error);
            const status = error.response?.status;
            const msg = error.response?.data?.message || error.message;
            alert(`Backend Error (${status}): ${msg}\nDatabase එකට save වුණේ නැත.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 4. Active Plot එකක් Database එකෙන් Delete කිරීම (DELETE /farmer/crops/{id})
    const handleDeleteCrop = async (cropId, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this crop from Database?")) return;

        try {
            await api.request('DELETE', `/farmer/crops/${cropId}`);
            alert("Crop deleted from Database successfully!");
            await loadCropsFromDb();
            setSelectedIndex(0);
        } catch (error) {
            console.error("Delete error:", error);
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to delete from Database: ${msg}`);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Crop Management</h1>
                <p className="text-gray-500 mt-2">Manage field crop records and track harvest milestones.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-gray-500 font-bold">
                    Connecting to Database and loading crops...
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-700">Active Crop Plots ({crops.length})</h3>
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">Real Database</span>
                        </div>

                        {crops.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-400">
                                No crops found in Database. Register your first crop below.
                            </div>
                        ) : (
                            crops.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    onClick={() => handleSelectCrop(index)}
                                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                                        index === selectedIndex ? 'bg-white border-green-500 ring-2 ring-green-100' : 'bg-white border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-800">{item.cropName}</h4>
                                            <p className="text-sm text-gray-400 mt-0.5">Category: {item.category}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-800">
                                                {item.harvestQuantity} {item.unit}
                                            </span>
                                            {/* Plot එක Delete කිරීමේ Button එක */}
                                            <button
                                                onClick={(e) => handleDeleteCrop(item.id, e)}
                                                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                                                title="Delete this Crop from DB"
                                            >
                                                Delete Plot
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4 border-t border-gray-50 pt-2 text-sm text-gray-500">
                                        <div>Harvest: <span className="font-bold text-gray-700">{item.harvestDate || "N/A"}</span></div>
                                        <div>Notes: <span className="font-bold text-gray-700 truncate block">{item.notes || "None"}</span></div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Add Crop Box */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2">
                            <h4 className="font-bold text-gray-700 text-sm mb-4 uppercase">Register New Crop Plot</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Crop Name (e.g., Potatoes)"
                                    value={newCropName}
                                    onChange={(e) => setNewCropName(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                />
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 cursor-pointer"
                                >
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Grains">Grains & Rice</option>
                                    <option value="Spices">Spices</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Quantity (e.g. 100)"
                                    value={newQuantity}
                                    onChange={(e) => setNewQuantity(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                />
                                <select
                                    value={newUnit}
                                    onChange={(e) => setNewUnit(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 cursor-pointer"
                                >
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="items">items</option>
                                </select>
                                <input
                                    type="date"
                                    value={newHarvestDate}
                                    onChange={(e) => setNewHarvestDate(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 sm:col-span-2 cursor-pointer focus:bg-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Field Notes & Soil Status"
                                    value={newNotes}
                                    onChange={(e) => setNewNotes(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 sm:col-span-2 focus:bg-white focus:outline-none focus:border-green-500"
                                />
                                <button
                                    onClick={handleAddCrop}
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all sm:col-span-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving to Database..." : "Register Crop to Database"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {crops.length > 0 && (
                        <div className="w-full lg:w-1/2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-4">
                            <div className="border-b border-gray-100 pb-4 mb-6">
                                <span className="text-xs text-gray-400 font-bold uppercase">Plot Inspector</span>
                                <h2 className="text-2xl font-bold text-gray-800 mt-1">{crops[selectedIndex]?.cropName}</h2>
                            </div>

                            <form onSubmit={handleUpdateCrop} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Quantity ({crops[selectedIndex]?.unit})</label>
                                    <input
                                        type="number"
                                        value={editQuantity}
                                        onChange={(e) => setEditQuantity(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Field Observation & Notes</label>
                                    <textarea
                                        rows="4"
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 resize-none focus:bg-white focus:outline-none focus:border-green-500"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm"
                                >
                                    Save Track Updates to Backend
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FarmerCropManagementPage;