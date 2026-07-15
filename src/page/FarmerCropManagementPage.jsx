import React, { useState } from 'react';
import { Leaf, Calendar, Heart, AlertCircle, CheckCircle, Plus, Info, RefreshCw, Activity } from 'lucide-react';

function FarmerCropManagementPage() {
    // Initial mock data for active crops in the field
    const [crops, setCrops] = useState([
        { id: 1, name: "Organic Carrots", variety: "Early Nantes", date: "2026-05-10", stage: "Vegetative", health: "Excellent", notes: "Regular watering active." },
        { id: 2, name: "Red Lady Papaya", variety: "Hybrid F1", date: "2026-01-15", stage: "Flowering", health: "Good", notes: "Added organic compost last week." },
        { id: 3, name: "Potatoes", variety: "Granola", date: "2026-06-01", stage: "Seedling", health: "Alert", notes: "Check for potential fungal leaf spots." }
    ]);

    // Track which crop is currently selected for managing
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Form states for updating the selected crop
    const [editStage, setEditStage] = useState(crops[0].stage);
    const [editHealth, setEditHealth] = useState(crops[0].health);
    const [editNotes, setEditNotes] = useState(crops[0].notes);

    // Form states for adding a completely new crop listing
    const [newCropName, setNewCropName] = useState("");
    const [newVariety, setNewVariety] = useState("");
    const [newDate, setNewDate] = useState("");

    // Change form values when user clicks a different crop card
    const handleSelectCrop = (index) => {
        setSelectedIndex(index);
        setEditStage(crops[index].stage);
        setEditHealth(crops[index].health);
        setEditNotes(crops[index].notes);
    };

    // Save changes made to the selected crop
    const handleUpdateCrop = (e) => {
        e.preventDefault();

        // Copy the current crops array
        let updatedCrops = [...crops];

        // Modify the selected crop item properties
        updatedCrops[selectedIndex].stage = editStage;
        updatedCrops[selectedIndex].health = editHealth;
        updatedCrops[selectedIndex].notes = editNotes;

        setCrops(updatedCrops);
        alert("Crop tracking matrix updated successfully!");
    };

    // Add a new crop to the active tracking list
    const handleAddCrop = (e) => {
        e.preventDefault();
        if (newCropName.trim() === "" || newVariety.trim() === "") return;

        const newCropItem = {
            id: crops.length + 1,
            name: newCropName,
            variety: newVariety,
            date: newDate || new Date().toISOString().split('T')[0],
            stage: "Seedling", // Default starting stage
            health: "Good",     // Default starting health
            notes: "Newly planted item."
        };

        setCrops([...crops, newCropItem]);

        // Clear input entry fields
        setNewCropName("");
        setNewVariety("");
        setNewDate("");
        alert("New crop successfully added to fields list!");
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">

            {/* Page Header Layout */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Crop Management</h1>
                <p className="text-gray-500 mt-2">Monitor crop growth milestones, log field observation parameters, and track plant health indices.</p>
            </div>

            {/* Split Grid Screen System */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Dynamic Panel: List of Registered Field Crops */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#8dc63f]" />
                        Active Field Plots ({crops.length})
                    </h3>

                    {/* Simple array iteration map to output field plot cards */}
                    {crops.map((item, index) => {
                        let isCurrentSelection = index === selectedIndex;

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleSelectCrop(index)}
                                className={`p-5 rounded-2xl border transition-all shadow-sm cursor-pointer relative overflow-hidden ${
                                    isCurrentSelection
                                        ? 'bg-white border-green-500 ring-2 ring-green-100'
                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <div className="absolute top-0 left-0 h-full w-2 bg-[#8dc63f]"></div>

                                <div className="flex justify-between items-start pl-2">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-400 font-medium mt-0.5">Variety: {item.variety}</p>
                                    </div>

                                    {/* Render dynamic color badges depending on crop health metric */}
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                        item.health === "Excellent" ? 'bg-green-100 text-green-800' :
                                            item.health === "Good" ? 'bg-blue-100 text-blue-800' :
                                                'bg-orange-100 text-orange-800 flex items-center gap-1'
                                    }`}>
                                        {item.health === "Alert" && <AlertCircle className="w-3 h-3" />}
                                        {item.health}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4 pl-2 pt-2 border-t border-gray-50 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Planted: {item.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-green-500" />
                                        Stage: <span className="font-bold text-gray-700">{item.stage}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Form Component Box to quick add a new crop container item */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-4">
                        <h4 className="font-bold text-gray-700 text-sm mb-4 tracking-wider uppercase flex items-center gap-2">
                            <Plus className="w-4 h-4 text-[#8dc63f]" /> Add New Field Plot
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Crop Name (e.g., Tomatoes)"
                                value={newCropName}
                                onChange={(e) => setNewCropName(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50"
                            />
                            <input
                                type="text"
                                placeholder="Variety (e.g., Granola)"
                                value={newVariety}
                                onChange={(e) => setNewVariety(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50"
                            />
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 cursor-pointer sm:col-span-2"
                            />
                            <button
                                onClick={handleAddCrop}
                                className="bg-[#8dc63f] hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-all sm:col-span-2 text-sm cursor-pointer shadow-sm active:scale-95"
                            >
                                Register Plot
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel Layout: Deep Management & Status Settings Modifier */}
                <div className="w-full lg:w-1/2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <div className="p-3 bg-[#D2E9C4]/60 rounded-xl text-green-700">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Plot Management Inspector</span>
                            <h2 className="text-2xl font-bold text-gray-800">{crops[selectedIndex].name}</h2>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateCrop} className="space-y-6">

                        {/* Dropdown for growth milestone indicators */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <RefreshCw className="w-4 h-4 text-gray-400" />
                                Growth Lifecycle Stage
                            </label>
                            <select
                                value={editStage}
                                onChange={(e) => setEditStage(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white cursor-pointer"
                            >
                                <option value="Seedling">Seedling Stage</option>
                                <option value="Vegetative">Vegetative Growth</option>
                                <option value="Flowering">Flowering Milestone</option>
                                <option value="Harvest">Harvest Ready Period</option>
                            </select>
                        </div>

                        {/* Dropdown for physiological health indexing */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Heart className="w-4 h-4 text-gray-400" />
                                Health Condition Matrix
                            </label>
                            <select
                                value={editHealth}
                                onChange={(e) => setEditHealth(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white cursor-pointer"
                            >
                                <option value="Excellent">Excellent Condition (No issues)</option>
                                <option value="Good">Good Condition (Stable growth)</option>
                                <option value="Alert">Alert Condition (Needs attention)</option>
                            </select>
                        </div>

                        {/* Text area logging box for specific farmer notes input */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Info className="w-4 h-4 text-gray-400" />
                                Observation Field Logs
                            </label>
                            <textarea
                                rows="4"
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Enter specific field notes regarding treatment methods, fertilization history, or general remarks..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white resize-none"
                            ></textarea>
                        </div>

                        {/* Action submission save handler button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm"
                            >
                                <CheckCircle className="w-4 h-4" /> Save Track Updates
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default FarmerCropManagementPage;