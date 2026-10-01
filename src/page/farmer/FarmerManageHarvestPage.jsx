import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerManageHarvestPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingProductId, setEditingProductId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editStock, setEditStock] = useState("");
    const [editUnit, setEditUnit] = useState("kg");
    const [editCategory, setEditCategory] = useState("");
    const [editMinOrder, setEditMinOrder] = useState("");
    const [editHarvestDate, setEditHarvestDate] = useState("");
    const [editDeliveryMethod, setEditDeliveryMethod] = useState("Pickup");

    // load products from backend
    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await api.request('GET', '/farmer/products');
            if (data && Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.warn("Backend products fetch failed, using fallback:", error);
            setProducts([
                { id: 1, name: "Organic Carrots", price: 120, totalAvailable: 150, unit: "kg", category: "Vegetables", minOrder: 5, harvestDate: "2026-07-10", deliveryMethod: "Pickup" },
                { id: 2, name: "Red Lady Papaya", price: 250, totalAvailable: 80, unit: "items", category: "Fruits", minOrder: 2, harvestDate: "2026-07-12", deliveryMethod: "Both" }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // delete product from backend
    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to remove this product?")) return;

        try {
            await api.request('DELETE', `/farmer/products/${id}`);
            setProducts(products.filter(item => item.id !== id));
            alert("Product deleted successfully!");
        } catch (error) {
            console.error("Delete failed:", error);
            setProducts(products.filter(item => item.id !== id));
            alert("Deleted locally!");
        }
    };

    const handleStartEdit = (product) => {
        setEditingProductId(product.id);
        setEditName(product.name);
        setEditPrice(product.price);
        setEditStock(product.totalAvailable || product.stock);
        setEditUnit(product.unit);
        setEditCategory(product.category);
        setEditMinOrder(product.minOrder);
        setEditHarvestDate(product.harvestDate);
        setEditDeliveryMethod(product.deliveryMethod);
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
    };

    // update product in backend
    const handleSaveEdit = async (e) => {
        e.preventDefault();

        const updatedData = {
            name: editName,
            price: Number(editPrice),
            totalAvailable: Number(editStock),
            unit: editUnit,
            category: editCategory,
            minOrder: Number(editMinOrder),
            harvestDate: editHarvestDate,
            deliveryMethod: editDeliveryMethod
        };

        try {
            await api.request('PUT', `/farmer/products/${editingProductId}`, updatedData);
            alert("Product updated successfully in Database!");
        } catch (error) {
            console.error("Update failed:", error);
            alert("Updated locally!");
        }

        setProducts(products.map(item => item.id === editingProductId ? { ...item, ...updatedData } : item));
        setEditingProductId(null);
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Harvest</h1>
                <p className="text-gray-500 mt-2">Update or remove your active marketplace crop listings.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-bold text-gray-700">Active Market Listings</h3>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading products from database...</div>
                ) : (
                    <div className="space-y-4">
                        {products.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">No active product listings found.</div>
                        ) : (
                            products.map((item) => (
                                <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    {editingProductId === item.id ? (
                                        <form onSubmit={handleSaveEdit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Product Name</label>
                                                    <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
                                                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                                                        <option value="Fruits">Fruits</option><option value="Vegetables">Vegetables</option><option value="Grains">Grains & Rice</option><option value="Spices">Spices</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Unit</label>
                                                    <select value={editUnit} onChange={(e) => setEditUnit(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                                                        <option value="kg">kg</option><option value="g">g</option><option value="items">items</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Price</label>
                                                    <input type="number" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Stock</label>
                                                    <input type="number" required value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Min Order</label>
                                                    <input type="number" required value={editMinOrder} onChange={(e) => setEditMinOrder(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg text-sm cursor-pointer">
                                                    Save Updates
                                                </button>
                                                <button type="button" onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-5 rounded-lg text-sm cursor-pointer">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                                                    <span className="bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded text-xs">{item.category}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                                    <p className="text-sm text-gray-600">Price: <span className="text-green-600 font-bold">LKR {item.price} / {item.unit}</span></p>
                                                    <p className="text-sm text-gray-600">Stock: <span className="text-gray-900 font-bold">{item.totalAvailable || item.stock} {item.unit}</span></p>
                                                    <p className="text-sm text-gray-600">Min: <span className="text-gray-900 font-bold">{item.minOrder} {item.unit}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStartEdit(item)} className="px-3.5 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg cursor-pointer">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteProduct(item.id)} className="px-3.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FarmerManageHarvestPage;