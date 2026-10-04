import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerCropManagementPage() {
    // Page state variables
    const [crops, setCrops] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Form inputs for new Crop (Exact keys required by Backend CropRequestDto)
    const [newCropName, setNewCropName] = useState("");
    const [newCategory, setNewCategory] = useState("Vegetables");
    const [newQuantity, setNewQuantity] = useState("");
    const [newUnit, setNewUnit] = useState("kg");
    const [newHarvestDate, setNewHarvestDate] = useState("");
    const [newNotes, setNewNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Inspector Edit inputs
    const [editNotes, setEditNotes] = useState("");
    const [editQuantity, setEditQuantity] = useState("");

    // 1. Load all crops from Database (GET /api/farmer/crops)
    const loadCropsFromDatabase = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await api.request('GET', '/farmer/crops');
            if (Array.isArray(data)) {
                setCrops(data);
                if (data.length > 0) {
                    setEditNotes(data[0].notes || "");
                    setEditQuantity(data[0].harvestQuantity || "");
                }
            } else {
                setCrops([]);
            }
        } catch (error) {
            console.error("Failed to load crops from database:", error);
            setErrorMessage("Could not load crops from database. Please check your backend.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCropsFromDatabase();
    }, []);

    // Change selected crop for inspector
    const handleSelectCrop = (index) => {
        setSelectedIndex(index);
        setEditNotes(crops[index]?.notes || "");
        setEditQuantity(crops[index]?.harvestQuantity || "");
    };

    // 2. Add New Crop to Database (POST /api/farmer/crops)
    const handleAddCrop = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setErrorMessage("");

        if (!newCropName.trim()) {
            setErrorMessage("Please enter a crop name.");
            return;
        }

        setIsSaving(true);

        // Convert user date to Full ISO Date-Time String (Required by Backend)
        const dateObj = newCropDateToIso(newHarvestDate);

        const payload = {
            cropName: newCropName.trim(),
            category: newCategory,
            unit: newUnit,
            harvestQuantity: Number(newQuantity) || 1,
            harvestDate: dateObj,
            notes: newNotes.trim()
        };

        try {
            await api.request('POST', '/farmer/crops', payload);
            setStatusMessage("New crop successfully saved to Database!");

            // Clear input fields
            setNewCropName("");
            setNewQuantity("");
            setNewHarvestDate("");
            setNewNotes("");

            // Reload fresh list from Database
            await loadCropsFromDatabase();
        } catch (error) {
            console.error("Backend add crop error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to save crop to database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSaving(false);
        }
    };

    // 3. Delete Crop Plot from Database (DELETE /api/farmer/crops/{cropId})
    const handleDeleteCrop = async (cropId, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this crop plot from Database?")) {
            return;
        }

        setStatusMessage("");
        setErrorMessage("");

        try {
            await api.request('DELETE', `/farmer/crops/${cropId}`);
            setStatusMessage("Crop plot deleted from Database!");
            await loadCropsFromDatabase();
            setSelectedIndex(0);
        } catch (error) {
            console.error("Delete crop error:", error);
            const serverMsg = error.response?.data?.error || "Failed to delete crop from database.";
            setErrorMessage(serverMsg);
        }
    };

    // 4. Update Crop Details (PUT /api/farmer/crops/{cropId})
    const handleUpdateCrop = async (e) => {
        e.preventDefault();
        const selectedCrop = crops[selectedIndex];
        if (!selectedCrop) return;

        setStatusMessage("");
        setErrorMessage("");

        const updatedPayload = {
            cropName: selectedCrop.cropName,
            category: selectedCrop.category,
            unit: selectedCrop.unit,
            harvestQuantity: Number(editQuantity) || selectedCrop.harvestQuantity,
            harvestDate: selectedCrop.harvestDate,
            notes: editNotes
        };

        try {
            await api.request('PUT', `/farmer/crops/${selectedCrop.cropId}`, updatedPayload);
            setStatusMessage("Crop details updated successfully!");
            await loadCropsFromDatabase();
        } catch (error) {
            console.error("Update crop error:", error);
            setErrorMessage("Failed to update crop details in Database.");
        }
    };

    // Helper: Turn yyyy-mm-dd into Full ISO string
    function newCropDateToIso(dateStr) {
        if (!dateStr) return new Date().toISOString();
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    }

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Crop Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage, update, and track all your crops in one place.</p>
            </div>

            {/* Status & Error Alerts */}
            {statusMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                    {statusMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
                    {errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12 text-gray-500 font-semibold">
                    Connecting to Database and loading crops...
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Panel: Crop List */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-700">Active Field Plots ({crops.length})</h3>
                            <button
                                onClick={loadCropsFromDatabase}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                                Refresh
                            </button>
                        </div>

                        {crops.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm">
                                No crops found in Database. Register your first crop plot below.
                            </div>
                        ) : (
                            crops.map((item, index) => (
                                <div
                                    key={item.cropId || index}
                                    onClick={() => handleSelectCrop(index)}
                                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                                        index === selectedIndex
                                            ? 'bg-white border-green-500 ring-2 ring-green-100 shadow-sm'
                                            : 'bg-white border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-800">{item.cropName}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">Category: {item.category}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-800">
                                                {item.harvestQuantity} {item.unit}
                                            </span>

                                            {/* Delete Plot Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => handleDeleteCrop(item.cropId, e)}
                                                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                                                title="Delete this Crop Plot from DB"
                                            >
                                                Delete Plot
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4 border-t border-gray-50 pt-2 text-xs text-gray-500">
                                        <div>Harvest: <span className="font-bold text-gray-700">{item.harvestDate ? item.harvestDate.substring(0, 10) : "N/A"}</span></div>
                                        <div>Notes: <span className="font-bold text-gray-700 truncate block">{item.notes || "None"}</span></div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Add New Crop Plot Box */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2">
                            <h4 className="font-bold text-gray-700 text-sm mb-4 uppercase">Register New Crop Plot</h4>
                            <form onSubmit={handleAddCrop} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    required
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
                                    required
                                    min="1"
                                    placeholder="Estimated Qty (e.g. 100)"
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
                                    required
                                    value={newHarvestDate}
                                    onChange={(e) => setNewHarvestDate(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 sm:col-span-2 cursor-pointer focus:bg-white focus:outline-none focus:border-green-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Field Notes & Treatments"
                                    value={newNotes}
                                    onChange={(e) => setNewNotes(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 sm:col-span-2 focus:bg-white focus:outline-none focus:border-green-500"
                                />

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all sm:col-span-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving ? "Saving to Database..." : "Register Crop to Database"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Panel: Selected Crop Inspector */}
                    {crops.length > 0 && (
                        <div className="w-full lg:w-1/2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-4">
                            <div className="border-b border-gray-100 pb-4 mb-6">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Plot Inspector</span>
                                <h2 className="text-2xl font-bold text-gray-800 mt-1">{crops[selectedIndex]?.cropName}</h2>
                            </div>

                            <form onSubmit={handleUpdateCrop} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Estimated Harvest Quantity ({crops[selectedIndex]?.unit})
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={editQuantity}
                                        onChange={(e) => setEditQuantity(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Observation Field Notes
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        placeholder="Treatment methods, soil condition remarks..."
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