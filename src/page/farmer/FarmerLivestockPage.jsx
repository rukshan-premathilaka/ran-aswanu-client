import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerLivestockPage() {
    const [livestockList, setLivestockList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Create Form inputs
    const [category, setCategory] = useState("Cattle");
    const [breed, setBreed] = useState("");
    const [amount, setAmount] = useState("");

    // Inline Editing states
    const [editingLiveStockId, setEditingLiveStockId] = useState(null);
    const [editCategory, setEditCategory] = useState("Cattle");
    const [editBreed, setEditBreed] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Load livestock from Database
    const loadLivestock = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await api.request('GET', '/farmer/livestock');
            if (Array.isArray(data)) {
                setLivestockList(data);
            } else {
                setLivestockList([]);
            }
        } catch (error) {
            console.error("Failed to load livestock:", error);
            const serverMsg = error.response?.data?.error || "Could not load livestock records.";
            setErrorMessage(serverMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLivestock();
    }, []);

    // Add New Livestock
    const handleAddLivestock = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!category.trim()) {
            setErrorMessage("Category is required.");
            return;
        }

        if (Number(amount) < 0 || amount === "") {
            setErrorMessage("Amount/Count must be 0 or greater.");
            return;
        }

        setIsSaving(true);

        const payload = {
            category: category.trim(),
            breed: breed.trim() || "Local / Mixed",
            amount: Math.round(Number(amount))
        };

        try {
            await api.request('POST', '/farmer/livestock', payload);
            setSuccessMessage("Livestock inventory saved successfully!");
            setBreed("");
            setAmount("");
            await loadLivestock();
        } catch (error) {
            console.error("Add livestock error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to save livestock record.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSaving(false);
        }
    };

    // Start Edit Mode
    const handleStartEdit = (item) => {
        setEditingLiveStockId(item.liveStockId);
        setEditCategory(item.category || "Cattle");
        setEditBreed(item.breed || "");
        setEditAmount(item.amount || 0);
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleCancelEdit = () => {
        setEditingLiveStockId(null);
    };

    // Save Edited Livestock
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!editCategory.trim()) {
            setErrorMessage("Category is required.");
            return;
        }

        if (Number(editAmount) < 0 || editAmount === "") {
            setErrorMessage("Amount/Count must be 0 or greater.");
            return;
        }

        setIsUpdating(true);

        const payload = {
            category: editCategory.trim(),
            breed: editBreed.trim() || "Local / Mixed",
            amount: Math.round(Number(editAmount))
        };

        try {
            await api.request('PUT', `/farmer/livestock/${editingLiveStockId}`, payload);
            setSuccessMessage("Livestock details updated successfully!");
            setEditingLiveStockId(null);
            await loadLivestock();
        } catch (error) {
            console.error("Update livestock error:", error);
            const serverMsg = error.response?.data?.error || "Failed to update livestock details.";
            setErrorMessage(serverMsg);
        } finally {
            setIsUpdating(false);
        }
    };

    // Delete Livestock
    const handleDeleteLivestock = async (id) => {
        if (!window.confirm("Are you sure you want to remove this livestock record?")) {
            return;
        }

        setSuccessMessage("");
        setErrorMessage("");

        try {
            await api.request('DELETE', `/farmer/livestock/${id}`);
            setSuccessMessage("Livestock entry removed successfully!");
            await loadLivestock();
        } catch (error) {
            console.error("Delete livestock error:", error);
            const serverMsg = error.response?.data?.error || "Failed to delete livestock record.";
            setErrorMessage(serverMsg);
        }
    };

    const totalAnimals = livestockList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Livestock Inventory</h1>
                <p className="text-sm text-gray-500 mt-1">Manage cattle, dairy, poultry, and animal counts on your farm.</p>
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

            {/* Summary Cards  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Livestock Heads</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700 mt-1">
                        {totalAnimals} Animals
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Herds / Flocks</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
                        {livestockList.length} Categories
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Form:Add New Livestock */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                        Add Livestock Entry
                    </h3>

                    <form onSubmit={handleAddLivestock} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Animal Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 cursor-pointer"
                            >
                                <option value="Cattle">Cattle / Cows</option>
                                <option value="Dairy Cows">Dairy Cows</option>
                                <option value="Poultry">Poultry / Chickens</option>
                                <option value="Goats">Goats</option>
                                <option value="Pigs">Pigs</option>
                                <option value="Sheep">Sheep</option>
                                <option value="Buffaloes">Buffaloes</option>
                                <option value="Beekeeping">Beekeeping Boxes</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Breed / Variety (Optional)</label>
                            <input
                                type="text"
                                maxLength={100}
                                placeholder="e.g., Jersey, Friesian, Broiler..."
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Count (Heads)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="e.g., 12"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow-sm text-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50 mt-2"
                        >
                            {isSaving ? "Saving..." : "Register Livestock"}
                        </button>
                    </form>
                </div>

                {/* Right List Livestock Holdings */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                        Current Livestock Holdings ({livestockList.length})
                    </h3>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-400 text-sm">Loading animals...</div>
                    ) : livestockList.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            No livestock records found. Add your animals using the form.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {livestockList.map((item) => {
                                const id = item.liveStockId;
                                const isEditing = editingLiveStockId === id;

                                return (
                                    <div
                                        key={id}
                                        className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between"
                                    >
                                        {isEditing ? (
                                            <form onSubmit={handleSaveEdit} className="space-y-3">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Category</label>
                                                    <select
                                                        value={editCategory}
                                                        onChange={(e) => setEditCategory(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                                                    >
                                                        <option value="Cattle">Cattle / Cows</option>
                                                        <option value="Dairy Cows">Dairy Cows</option>
                                                        <option value="Poultry">Poultry / Chickens</option>
                                                        <option value="Goats">Goats</option>
                                                        <option value="Pigs">Pigs</option>
                                                        <option value="Sheep">Sheep</option>
                                                        <option value="Buffaloes">Buffaloes</option>
                                                        <option value="Beekeeping">Beekeeping Boxes</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Breed / Variety</label>
                                                    <input
                                                        type="text"
                                                        value={editBreed}
                                                        onChange={(e) => setEditBreed(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Count (Heads)</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="0"
                                                        value={editAmount}
                                                        onChange={(e) => setEditAmount(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                    />
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isUpdating}
                                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs cursor-pointer disabled:opacity-50"
                                                    >
                                                        {isUpdating ? "Saving..." : "Save Updates"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelEdit}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-4 rounded-lg text-xs cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-lg">{item.category}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Breed: <span className="font-semibold text-gray-700">{item.breed || "Standard"}</span>
                                                    </p>
                                                    <div className="mt-3">
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-lg">
                                                            {item.amount} Animals
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartEdit(item)}
                                                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteLivestock(item.liveStockId)}
                                                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FarmerLivestockPage;