import React, { useState } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerAddHarvestPage() {
    // Form States
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("Vegetables");
    const [unitOfMeasurement, setUnitOfMeasurement] = useState("kg");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [availableStock, setAvailableStock] = useState("");
    const [minimumOrderQuantity, setMinimumOrderQuantity] = useState("1");
    const [harvestedDate, setHarvestedDate] = useState("");
    const [deliveryOption, setDeliveryOption] = useState("Pickup");
    const [description, setDescription] = useState("");

    // Image file upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Status & Loading states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("The file is too big. The maximum size is 5 MB.");
                return;
            }
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            setErrorMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!productName.trim()) {
            setErrorMessage("Product name is required.");
            return;
        }

        if (Number(pricePerUnit) <= 0) {
            setErrorMessage("Price per unit must be greater than 0.");
            return;
        }

        setIsSubmitting(true);

        const formattedDate = harvestedDate
            ? new Date(harvestedDate).toISOString()
            : new Date().toISOString();

        const payload = {
            productName: productName.trim(),
            category: category,
            unitOfMeasurement: unitOfMeasurement,
            pricePerUnit: Number(pricePerUnit),
            availableStock: Number(availableStock) || 0,
            minimumOrderQuantity: Number(minimumOrderQuantity) || 1,
            harvestedDate: formattedDate,
            deliveryOption: deliveryOption,
            description: description.trim()
        };

        try {
            const createdProduct = await api.request('POST', '/farmer/products', payload);
            const listId = createdProduct?.listId || createdProduct?.id;

            let imageFailed = false;

            // Step 2: Upload Product Image if selected
            if (selectedFile && listId) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                try {
                    await api.client.post(`/farmer/products/${listId}/image`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                } catch (imgErr) {
                    console.warn("Product image upload failed:", imgErr);
                    imageFailed = true;
                }
            }

            // F10 Fixed: Accurately reflect image upload status
            if (imageFailed) {
                setSuccessMessage("Product details saved, but the image upload failed. Please edit the product to attach the image.");
            } else {
                setSuccessMessage("Harvest product successfully saved to Database!");
            }

            // Form Reset
            setProductName("");
            setPricePerUnit("");
            setAvailableStock("");
            setMinimumOrderQuantity("1");
            setHarvestedDate("");
            setDescription("");
            setSelectedFile(null);
            setImagePreview(null);

        } catch (error) {
            console.error("Failed to save product:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to save product to database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Add Harvest</h1>
                <p className="text-sm text-gray-500 mt-1">Publish fresh crop inventory directly to the marketplace database.</p>
            </div>

            {/* Success and Error Alerts */}
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

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

                {/* Left Side: Product Image Upload */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[300px] relative overflow-hidden group">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-3 font-bold text-2xl">
                                    +
                                </div>
                                <p className="text-sm font-bold text-gray-700">Upload Product Image</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">Clear photos of fresh produce attract more customers and faster sales.</p>
                    </div>
                </div>

                {/* Right Side: Product Details Input Fields */}
                <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Name</label>
                            <input
                                type="text"
                                required
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="e.g., Fresh Organic Carrots, Keeri Samba Rice..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 cursor-pointer"
                            >
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Grains">Grains & Rice</option>
                                <option value="Spices">Spices</option>
                                <option value="Fertilizer">Organic Fertilizer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Unit of Measurement</label>
                            <select
                                value={unitOfMeasurement}
                                onChange={(e) => setUnitOfMeasurement(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 cursor-pointer"
                            >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Gram (g)</option>
                                <option value="items">Items (Pieces)</option>
                                <option value="bunches">Bunches</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Available Stock ({unitOfMeasurement})</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={availableStock}
                                onChange={(e) => setAvailableStock(e.target.value)}
                                placeholder="e.g., 100"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Price per 1 {unitOfMeasurement} (LKR)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={pricePerUnit}
                                onChange={(e) => setPricePerUnit(e.target.value)}
                                placeholder="e.g., 250"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Min Order Quantity ({unitOfMeasurement})</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={minimumOrderQuantity}
                                onChange={(e) => setMinimumOrderQuantity(e.target.value)}
                                placeholder="e.g., 5"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Harvest Date</label>
                            <input
                                type="date"
                                required
                                value={harvestedDate}
                                onChange={(e) => setHarvestedDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 cursor-pointer"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Option</label>
                            <select
                                value={deliveryOption}
                                onChange={(e) => setDeliveryOption(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 cursor-pointer"
                            >
                                <option value="Pickup">Buyer must pick up from farm</option>
                                <option value="Delivery">Seller provides delivery</option>
                                <option value="Both">Both pickup and delivery available</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Description</label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter organic quality status, storage temperature, packaging..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 text-sm"
                        >
                            {isSubmitting ? "Publishing to Database..." : "Publish Product"}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default FarmerAddHarvestPage;