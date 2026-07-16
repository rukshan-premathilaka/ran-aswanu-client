import React, { useState } from 'react';
import { UploadCloud, Tag, FileText, DollarSign, Package, Layers, ImagePlus, Calendar, Truck, ShoppingBag } from 'lucide-react';

function FarmerAddHarvestPage() {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [unit, setUnit] = useState("kg");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [totalStock, setTotalStock] = useState("");
    const [minOrderQuantity, setMinOrderQuantity] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState("Pickup");
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalProductObj = {
            name: productName,
            category: category,
            unitType: unit,
            price: pricePerUnit,
            totalAvailable: totalStock,
            minOrder: minOrderQuantity,
            harvestedDate: harvestDate,
            shipping: deliveryMethod,
            description: description,
            image: selectedImage
        };

        console.log("Publishing Harvest Listing:", finalProductObj);
        alert("Harvest successfully published to marketplace catalog!");

        setProductName("");
        setCategory("");
        setUnit("kg");
        setPricePerUnit("");
        setTotalStock("");
        setMinOrderQuantity("");
        setHarvestDate("");
        setDeliveryMethod("Pickup");
        setDescription("");
        setSelectedImage(null);
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Add Harvest</h1>
                <p className="text-gray-500 mt-2">Log crop data indicators, stock metrics, and delivery methods into public grids.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

                {/* Left Media Block */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[300px] relative overflow-hidden group">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-[#D2E9C4]/50 rounded-full flex items-center justify-center mb-4">
                                    <ImagePlus className="w-8 h-8 text-[#8dc63f]" />
                                </div>
                                <p className="text-sm font-bold text-gray-700">Upload Product Image</p>
                                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                        <UploadCloud className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-xs text-blue-700 font-medium">Clear photos of fresh crops build better customer trust and quick sales.</p>
                    </div>
                </div>

                {/* Right Form Block */}
                <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Tag className="w-4 h-4 text-gray-400" /> Product Name
                            </label>
                            <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Fresh Organic Carrots, Keeri Samba Rice..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Layers className="w-4 h-4 text-gray-400" /> Category
                            </label>
                            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white cursor-pointer">
                                <option value="">Select category...</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Grains">Grains & Rice</option>
                                <option value="Spices">Spices</option>
                                <option value="Fertilizer">Organic Fertilizer</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Package className="w-4 h-4 text-gray-400" /> Unit of Measurement
                            </label>
                            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 cursor-pointer">
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Gram (g)</option>
                                <option value="items">Items (Pieces)</option>
                                <option value="bunches">Bunches</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Package className="w-4 h-4 text-gray-400" /> Total Stock Available ({unit})
                            </label>
                            <input type="number" required min="1" value={totalStock} onChange={(e) => setTotalStock(e.target.value)} placeholder="e.g., 100" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 text-gray-400" /> Price per 1 {unit} (LKR)
                            </label>
                            <input type="number" required min="0" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} placeholder="e.g., 100" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <ShoppingBag className="w-4 h-4 text-gray-400" /> Minimum Order Quantity ({unit})
                            </label>
                            <input type="number" required min="1" value={minOrderQuantity} onChange={(e) => setMinOrderQuantity(e.target.value)} placeholder="e.g., 5" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 focus:bg-white" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 text-gray-400" /> Harvest Date
                            </label>
                            <input type="date" required value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 cursor-pointer" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Truck className="w-4 h-4 text-gray-400" /> Delivery / Logistics Option
                            </label>
                            <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 cursor-pointer">
                                <option value="Pickup">Buyer must pick up from farm</option>
                                <option value="Delivery">Seller provides delivery options</option>
                                <option value="Both">Flexible (Both pickup and delivery available)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <FileText className="w-4 h-4 text-gray-400" /> Product Description
                            </label>
                            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="4" placeholder="Enter organic status, quality tier, storage conditions..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50 resize-none"></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button type="submit" className="bg-[#8dc63f] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer w-full md:w-auto">
                            Publish Product
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default FarmerAddHarvestPage;