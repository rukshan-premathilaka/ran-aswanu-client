import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

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

    // 1. Database එකෙන් තමන්ගේ සියලුම Products Load කිරීම (GET /api/farmer/products)
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
            console.error("Failed to load products from database:", error);
            setErrorMessage("Could not load products from Database. Check backend connection.");
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProductsFromDb();
    }, []);

    // 2. Publish / Unpublish Toggle කිරීම (PATCH /api/farmer/products/{listId}/status)
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

    // 3. Product Delete කිරීම (DELETE /api/farmer/products/{listId})
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

    // Start Editing
    const handleStartEdit = (item) => {
        setEditingListId(item.listId || item.id);
        setEditProductName(item.productName || item.name || "");
        setEditPricePerUnit(item.pricePerUnit || item.price || "");
        setEditAvailableStock(item.availableStock || item.stock || "");
        setEditUnitOfMeasurement(item.unitOfMeasurement || item.unit || "kg");
        setEditCategory(item.category || "Vegetables");
        setEditMinimumOrderQuantity(item.minimumOrderQuantity || item.minOrder || "1");
        setEditDeliveryOption(item.deliveryOption || "Pickup");
        setEditDescription(item.description || "");
    };

    const handleCancelEdit = () => {
        setEditingListId(null);
    };

    // 4. Save Edited Product (PUT /api/farmer/products/{listId})
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
            setSuccessMessage("Product details successfully !");
            setEditingListId(null);
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
                    <p className="text-sm text-gray-500 mt-1">Review, edit, publish or remove active market catalog items.</p>
                </div>
                <button
                    onClick={loadProductsFromDb}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-xl text-sm transition-all cursor-pointer"
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
                    <h3 className="text-base font-bold text-gray-700">My Database Listings ({products.length})</h3>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 font-semibold">
                        Connecting to database and loading inventory...
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                        No product listings found in Database. Publish your first produce using "Add Harvest".
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((item) => {
                            const listId = item.listId || item.id;
                            const isEditing = editingListId === listId;

                            return (
                                <div key={listId} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    {isEditing ? (
                                        <form onSubmit={handleSaveEdit} className="space-y-4">
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

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    type="submit"
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg text-xs cursor-pointer"
                                                >
                                                    Save Updates
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-5 rounded-lg text-xs cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

                                            <div className="flex items-center gap-2">
                                                {/* Publish / Unpublish Status Toggle */}
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

                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleStartEdit(item)}
                                                    className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg cursor-pointer"
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteProduct(listId)}
                                                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer border border-red-100"
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