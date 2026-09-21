import React, { useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { farmerService } from '@/api/farmerService';

function FarmerAddHarvestPage() {
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        unit: 'kg',
        pricePerUnit: '',
        totalStock: '',
        minOrderQuantity: '',
        harvestDate: '',
        deliveryMethod: 'Pickup',
        description: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Field names exactly match ProductListingRequestDto on the backend
        const payload = {
            productName: formData.productName,
            category: formData.category,
            description: formData.description,
            unitOfMeasurement: formData.unit,
            pricePerUnit: Number(formData.pricePerUnit),
            availableStock: Number(formData.totalStock),
            minimumOrderQuantity: Number(formData.minOrderQuantity),
            harvestedDate: formData.harvestDate,
            deliveryOption: formData.deliveryMethod
        };

        try {
            const created = await farmerService.createProduct(payload);
            if (selectedFile && created?.listId) {
                await farmerService.uploadProductImage(created.listId, selectedFile);
            }
            alert('අස්වනු නිෂ්පාදනය සාර්ථකව පද්ධතියට ඇතුළත් කරන ලදී!');
            setFormData({
                productName: '',
                category: '',
                unit: 'kg',
                pricePerUnit: '',
                totalStock: '',
                minOrderQuantity: '',
                harvestDate: '',
                deliveryMethod: 'Pickup',
                description: ''
            });
            setSelectedImage(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Product publish error:', error);
            alert('නිෂ්පාදනය ඇතුළත් කිරීම අසාර්ථක විය.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-5xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Harvest Listing</h1>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                {/* Image Upload Box */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[320px] relative overflow-hidden group">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Product Preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-200">
                                    <ImagePlus className="w-8 h-8 text-green-700" />
                                </div>
                                <p className="text-sm font-bold text-gray-700">Upload Product Image</p>
                                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Form Fields Section */}
                <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Product Name</label>
                            <input
                                type="text"
                                required
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="e.g. Organic Red Tomatoes"
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Category</label>
                            <select
                                required
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            >
                                <option value="">Select category...</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Grains">Grains & Rice</option>
                                <option value="Spices">Spices</option>
                                <option value="Fertilizer">Organic Fertilizer</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Unit of Measurement</label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Gram (g)</option>
                                <option value="items">Items (Pieces)</option>
                                <option value="bunches">Bunches</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Total Stock Available</label>
                            <input
                                type="number"
                                required
                                min="1"
                                name="totalStock"
                                value={formData.totalStock}
                                onChange={handleChange}
                                placeholder="50"
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Price per Unit (LKR)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                name="pricePerUnit"
                                value={formData.pricePerUnit}
                                onChange={handleChange}
                                placeholder="250"
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Minimum Order Quantity</label>
                            <input
                                type="number"
                                required
                                min="1"
                                name="minOrderQuantity"
                                value={formData.minOrderQuantity}
                                onChange={handleChange}
                                placeholder="1"
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Harvest Date</label>
                            <input
                                type="date"
                                required
                                name="harvestDate"
                                value={formData.harvestDate}
                                onChange={handleChange}
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Delivery / Logistics Option</label>
                            <select
                                name="deliveryMethod"
                                value={formData.deliveryMethod}
                                onChange={handleChange}
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm shadow-sm"
                            >
                                <option value="Pickup">Buyer must pick up from farm</option>
                                <option value="Delivery">Seller provides delivery options</option>
                                <option value="Both">Flexible Options</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Product Description</label>
                            <textarea
                                required
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Provide freshness details, variety, organic certifications..."
                                className="w-full border border-green-700 rounded-xl px-4 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 text-sm resize-none shadow-sm"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-md transition-all active:scale-95 text-sm"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Publish Product
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default FarmerAddHarvestPage;