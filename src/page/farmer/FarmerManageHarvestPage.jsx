import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

// Helper to resolve product image URL
const resolveFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return 'http://localhost:8080' + (path.startsWith('/files/') ? path : '/files/' + path);
};

function FarmerManageHarvestPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Editing State variables
    const [editingListId, setEditingListId] = useState(null);
    const [editProductName, setEditProductName] = useState("");
    const [editPricePerUnit, setEditPricePerUnit] = useState("");
    const [editAvailableStock, setEditAvailableStock] = useState("");
    const [editUnitOfMeasurement, setEditUnitOfMeasurement] = useState("kg");
    const [editCategory, setEditCategory] = useState("Vegetables");
    const [editMinimumOrderQuantity, setEditMinimumOrderQuantity] = useState("1");
    const [editDeliveryOption, setEditDeliveryOption] = useState("Pickup");
    const [editDescription, setEditDescription] = useState("");

    // Single photo edit states
    const [editSelectedFile, setEditSelectedFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

    // 1. Load all products (GET /api/farmer/products)[cite: 5]
    const loadProductsFromDb = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await api.request('GET', '/farmer/products');
            let list = [];

            if (Array.isArray(data)) {
                list = data;
            } else if (data && Array.isArray(data.content)) {
                list = data.content;
            }

            setProducts(list);
        } catch (error) {
            console.error("Failed to load products:", error);
            setErrorMessage("Could not load products. Please check connection.");
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProductsFromDb();
    }, []);

    // 2. Publish / Unpublish Toggle (PATCH /api/farmer/products/{listId}/status)[cite: 5]
    const handleTogglePublish = async (listId, currentStatus) => {
        setSuccessMessage("");
        setErrorMessage("");
        const newStatus = !currentStatus;

        try {
            await api.request('PATCH', `/farmer/products/${listId}/status`, { published: newStatus });
            setSuccessMessage(`Product ${newStatus ? 'Published to Marketplace' : 'Unpublished (Moved to Draft)'}!`);
            await loadProductsFromDb();
        } catch (error) {
            console.error("Status toggle error:", error);
            const serverMsg = error.response?.data?.error || "Failed to update publish status.";
            setErrorMessage(serverMsg);
        }
    };

    // 3. Product Delete (DELETE /api/farmer/products/{listId})[cite: 5]
    const handleDeleteProduct = async (listId) => {
        if (!window.confirm("Are you sure you want to permanently delete this product?")) {
            return;
        }

        setSuccessMessage("");
        setErrorMessage("");

        try {
            await api.request('DELETE', `/farmer/products/${listId}`);
            setSuccessMessage("Product removed successfully!");
            await loadProductsFromDb();
        } catch (error) {
            console.error("Delete product error:", error);
            const serverMsg = error.response?.data?.error || "Failed to delete product.";
            setErrorMessage(serverMsg);
        }
    };

    // 4. Quick Direct Photo Upload[cite: 5]
    const handleDirectPhotoUpload = async (listId, file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("The image file is too large. Maximum size is 5 MB.");
            return;
        }

        setIsUpdatingPhoto(true);
        setSuccessMessage("");
        setErrorMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.client.post(`/farmer/products/${listId}/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSuccessMessage("Product photo updated successfully!");
            await loadProductsFromDb();
        } catch (error) {
            console.error("Upload error:", error);
            setErrorMessage("Failed to upload new product photo.");
        } finally {
            setIsUpdatingPhoto(false);
        }
    };

    // 5. Start Editing
    const handleStartEdit = (item) => {
        const id = item.listId || item.id;
        setEditingListId(id);
        setEditProductName(item.productName || item.name || "");
        setEditPricePerUnit(item.pricePerUnit || item.price || "");
        setEditAvailableStock(item.availableStock || item.stock || "");
        setEditUnitOfMeasurement(item.unitOfMeasurement || item.unit || "kg");
        setEditCategory(item.category || "Vegetables");
        setEditMinimumOrderQuantity(item.minimumOrderQuantity || item.minOrder || "1");
        setEditDeliveryOption(item.deliveryOption || "Pickup");
        setEditDescription(item.description || "");

        // Set current image preview
        setEditSelectedFile(null);
        setEditImagePreview(item.productImage ? resolveFileUrl(item.productImage) : null);
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleCancelEdit = () => {
        if (editImagePreview && editSelectedFile) {
            URL.revokeObjectURL(editImagePreview);
        }
        setEditingListId(null);
        setEditSelectedFile(null);
        setEditImagePreview(null);
    };

    // Choose photo inside edit modal
    const handleEditPhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("The image file is too large. Maximum size is 5 MB.");
                return;
            }
            setEditSelectedFile(file);
            setEditImagePreview(URL.createObjectURL(file));
            setErrorMessage("");
        }
    };

    // 6. Save Edited Product & Photo (PUT /api/farmer/products/{listId})[cite: 5]
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const updatedPayload = {
            productName: editProductName.trim(),
            category: editCategory,
            unitOfMeasurement: editUnitOfMeasurement,
            pricePerUnit: Number(editPricePerUnit),
            availableStock: Number(editAvailableStock),
            minimumOrderQuantity: Number(editMinimumOrderQuantity) || 1,
            deliveryOption: editDeliveryOption,
            description: editDescription.trim()
        };

        try {
            await api.request('PUT', `/farmer/products/${editingListId}`, updatedPayload);

            // Upload new photo if selected during edit[cite: 5]
            if (editSelectedFile) {
                const formData = new FormData();
                formData.append("file", editSelectedFile);
                try {
                    await api.client.post(`/farmer/products/${editingListId}/image`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                } catch (imgErr) {
                    console.warn("Image upload failed during product edit:", imgErr);
                }
            }

            setSuccessMessage("Product details and photo successfully updated!");
            if (editImagePreview && editSelectedFile) {
                URL.revokeObjectURL(editImagePreview);
            }
            setEditingListId(null);
            setEditSelectedFile(null);
            setEditImagePreview(null);
            await loadProductsFromDb();
        } catch (error) {
            console.error("Update product error:", error);
            const serverMsg = error.response?.data?.error || "Failed to update product details.";
            setErrorMessage(serverMsg);
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Harvest</h1>
                    <p className="text-sm text-gray-500 mt-1">Review produce details, change photos, or publish directly to the marketplace.</p>
                </div>
                <button
                    onClick={loadProductsFromDb}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
                >
                    Refresh List
                </button>
            </div>

            {/* Status & Error Alerts */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
                    {errorMessage}
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="mb-5 border-b border-gray-100 pb-3 flex justify-between items-center">
                    <h3 className="text-base font-bold text-gray-700">My Product Listings ({products.length})</h3>
                    {isUpdatingPhoto && (
                        <span className="text-xs font-semibold text-green-600 animate-pulse">
                            Updating product photo...
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 font-semibold">
                        Loading inventory...
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                        No product listings found. Publish your first produce using "Add Harvest".
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((item) => {
                            const listId = item.listId || item.id;
                            const isEditing = editingListId === listId;
                            const imgUrl = item.productImage ? resolveFileUrl(item.productImage) : null;

                            return (
                                <div key={listId} className="p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100">
                                    {isEditing ? (
                                        /* Edit Form */
                                        <form onSubmit={handleSaveEdit} className="space-y-4">
                                            {/* Photo Edit Section */}
                                            <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-white rounded-xl border border-gray-200">
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                    {editImagePreview ? (
                                                        <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Photo</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <label className="text-xs font-bold text-gray-700 block mb-1">Product Photo</label>
                                                    <p className="text-xs text-gray-400 mb-2">Upload a single fresh image (PNG, JPG, WEBP up to 5MB)</p>
                                                    <label className="inline-block px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg cursor-pointer border border-gray-300 transition-colors">
                                                        Change Photo
                                                        <input type="file" accept="image/*" onChange={handleEditPhotoSelect} className="hidden" />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Product Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={editProductName}
                                                        onChange={(e) => setEditProductName(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Category</label>
                                                    <select
                                                        value={editCategory}
                                                        onChange={(e) => setEditCategory(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                                                    >
                                                        <option value="Vegetables">Vegetables</option>
                                                        <option value="Fruits">Fruits</option>
                                                        <option value="Grains">Grains & Rice</option>
                                                        <option value="Spices">Spices</option>
                                                        <option value="Fertilizer">Organic Fertilizer</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Unit</label>
                                                    <select
                                                        value={editUnitOfMeasurement}
                                                        onChange={(e) => setEditUnitOfMeasurement(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                                                    >
                                                        <option value="kg">kg</option>
                                                        <option value="g">g</option>
                                                        <option value="items">items</option>
                                                        <option value="bunches">bunches</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Price (LKR)</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="1"
                                                        value={editPricePerUnit}
                                                        onChange={(e) => setEditPricePerUnit(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Stock</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="0"
                                                        value={editAvailableStock}
                                                        onChange={(e) => setEditAvailableStock(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">Min Order</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="1"
                                                        value={editMinimumOrderQuantity}
                                                        onChange={(e) => setEditMinimumOrderQuantity(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-600 block mb-1">Delivery Option</label>
                                                <select
                                                    value={editDeliveryOption}
                                                    onChange={(e) => setEditDeliveryOption(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                                                >
                                                    <option value="Pickup">Buyer must pick up from farm</option>
                                                    <option value="Delivery">Seller provides delivery</option>
                                                    <option value="Both">Both pickup and delivery available</option>
                                                </select>
                                            </div>

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    type="submit"
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg text-xs cursor-pointer shadow-sm transition-all"
                                                >
                                                    Save Updates
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-5 rounded-lg text-xs cursor-pointer transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        /* Normal Product Card View */
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                {/* Single Photo with Quick Direct Change Button */}
                                                <div className="relative group w-20 h-20 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 flex-shrink-0">
                                                    {imgUrl ? (
                                                        <img src={imgUrl} alt={item.productName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-semibold text-center p-1">
                                                            No Photo
                                                        </div>
                                                    )}

                                                    {/* Quick Hover Overlay to Change Photo directly */}
                                                    <label
                                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-bold cursor-pointer text-center px-1"
                                                        title="Click to change photo"
                                                    >
                                                        Change Photo
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleDirectPhotoUpload(listId, e.target.files[0])}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-800 text-base">{item.productName}</h4>
                                                        <span className="bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded text-xs">
                                                            {item.category}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                            item.listingStatus ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {item.listingStatus ? 'Published' : 'Draft / Unpublished'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-gray-600">
                                                        <p>Price: <span className="font-bold text-green-700">LKR {item.pricePerUnit} / {item.unitOfMeasurement}</span></p>
                                                        <p>Available: <span className="font-bold text-gray-800">{item.availableStock} {item.unitOfMeasurement}</span></p>
                                                        <p>Min Order: <span className="font-bold text-gray-800">{item.minimumOrderQuantity} {item.unitOfMeasurement}</span></p>
                                                        <p>Logistics: <span className="font-medium text-gray-700">{item.deliveryOption}</span></p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end md:self-center">
                                                <button
                                                    onClick={() => handleTogglePublish(listId, item.listingStatus)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer border ${
                                                        item.listingStatus
                                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                    }`}
                                                >
                                                    {item.listingStatus ? 'Unpublish' : 'Publish'}
                                                </button>

                                                <button
                                                    onClick={() => handleStartEdit(item)}
                                                    className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteProduct(listId)}
                                                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer border border-red-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FarmerManageHarvestPage;