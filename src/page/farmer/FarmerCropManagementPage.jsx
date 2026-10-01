import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerCropManagementPage() {
    const [crops, setCrops] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [editStage, setEditStage] = useState("Vegetative");
    const [editHealth, setEditHealth] = useState("Excellent");
    const [editNotes, setEditNotes] = useState("");

    const [newCropName, setNewCropName] = useState("");
    const [newVariety, setNewVariety] = useState("");
    const [newDate, setNewDate] = useState("");

    // load crops from backend
    const loadCrops = async () => {
        setIsLoading(true);
        try {
            const data = await api.request('GET', '/farmer/crops');
            if (data && Array.isArray(data) && data.length > 0) {
                setCrops(data);
                setEditStage(data[0].stage || "Seedling");
                setEditHealth(data[0].health || "Good");
                setEditNotes(data[0].notes || "");
            }
        } catch (error) {
            console.warn("Backend crops fetch failed, using fallback:", error);
            const fallback = [
                { id: 1, name: "Organic Carrots", variety: "Early Nantes", date: "2026-05-10", stage: "Vegetative", health: "Excellent", notes: "Regular watering active." },
                { id: 2, name: "Red Lady Papaya", variety: "Hybrid F1", date: "2026-01-15", stage: "Flowering", health: "Good", notes: "Added organic compost last week." }
            ];
            setCrops(fallback);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCrops();
    }, []);

    const handleSelectCrop = (index) => {
        setSelectedIndex(index);
        setEditStage(crops[index].stage || "Seedling");
        setEditHealth(crops[index].health || "Good");
        setEditNotes(crops[index].notes || "");
    };

    // update crop in backend
    const handleUpdateCrop = async (e) => {
        e.preventDefault();
        const selectedCrop = crops[selectedIndex];
        if (!selectedCrop) return;

        const updatedData = {
            ...selectedCrop,
            stage: editStage,
            health: editHealth,
            notes: editNotes
        };

        try {
            await api.request('PUT', `/farmer/crops/${selectedCrop.id}`, updatedData);
            alert("Crop tracking updated in Database!");
        } catch (error) {
            console.error("Update failed:", error);
            alert("Updated locally!");
        }

        let updatedCrops = [...crops];
        updatedCrops[selectedIndex] = updatedData;
        setCrops(updatedCrops);
    };

    // add new crop to backend
    const handleAddCrop = async (e) => {
        e.preventDefault();
        if (!newCropName.trim() || !newVariety.trim()) return;

        const newCropItem = {
            name: newCropName,
            variety: newVariety,
            date: newDate || new Date().toISOString().split('T')[0],
            stage: "Seedling",
            health: "Good",
            notes: "Newly planted item."
        };

        try {
            const savedCrop = await api.request('POST', '/farmer/crops', newCropItem);
            setCrops([...crops, savedCrop || { ...newCropItem, id: crops.length + 1 }]);
            alert("New crop added to Database!");
        } catch (error) {
            console.error("Add crop failed:", error);
            setCrops([...crops, { ...newCropItem, id: crops.length + 1 }]);
            alert("Added locally!");
        }

        setNewCropName("");
        setNewVariety("");
        setNewDate("");
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Crop Management</h1>
                <p className="text-gray-500 mt-2">Monitor crop growth milestones and track plant health indices.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading crops from database...</div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-gray-700">Active Field Plots ({crops.length})</h3>

                        {crops.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => handleSelectCrop(index)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                                    index === selectedIndex ? 'bg-white border-green-500 ring-2 ring-green-100' : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-400 mt-0.5">Variety: {item.variety}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-800">
                                        {item.health}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4 border-t border-gray-50 pt-2 text-sm text-gray-500">
                                    <div>Planted: <span className="font-bold text-gray-700">{item.date}</span></div>
                                    <div>Stage: <span className="font-bold text-gray-700">{item.stage}</span></div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2">
                            <h4 className="font-bold text-gray-700 text-sm mb-4 uppercase">Add New Field Plot</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" placeholder="Crop Name (e.g., Tomatoes)" value={newCropName} onChange={(e) => setNewCropName(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50" />
                                <input type="text" placeholder="Variety (e.g., Granola)" value={newVariety} onChange={(e) => setNewVariety(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50" />
                                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 sm:col-span-2" />
                                <button onClick={handleAddCrop} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all sm:col-span-2 cursor-pointer">
                                    Register Plot to Database
                                </button>
                            </div>
                        </div>
                    </div>

                    {crops.length > 0 && (
                        <div className="w-full lg:w-1/2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-4">
                            <div className="border-b border-gray-100 pb-4 mb-6">
                                <span className="text-xs text-gray-400 font-bold uppercase">Plot Management Inspector</span>
                                <h2 className="text-2xl font-bold text-gray-800 mt-1">{crops[selectedIndex]?.name}</h2>
                            </div>

                            <form onSubmit={handleUpdateCrop} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Growth Lifecycle Stage</label>
                                    <select value={editStage} onChange={(e) => setEditStage(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white cursor-pointer">
                                        <option value="Seedling">Seedling Stage</option>
                                        <option value="Vegetative">Vegetative Growth</option>
                                        <option value="Flowering">Flowering Milestone</option>
                                        <option value="Harvest">Harvest Ready Period</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Health Condition Matrix</label>
                                    <select value={editHealth} onChange={(e) => setEditHealth(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white cursor-pointer">
                                        <option value="Excellent">Excellent Condition</option>
                                        <option value="Good">Good Condition</option>
                                        <option value="Alert">Alert (Needs attention)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Observation Field Logs</label>
                                    <textarea rows="4" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Field treatment notes..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 resize-none"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm">
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