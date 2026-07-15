import React, { useState } from 'react';
import { ShoppingBag, Pencil, Trash2, X, Check } from 'lucide-react';

function FarmerManageHarvestPage() {
    const [products, setProducts] = useState([
        { id: 1, name: "Organic Carrots", price: 120, stock: 150, unit: "kg", category: "Vegetables", minOrder: 5, harvestDate: "2026-07-10", deliveryMethod: "Pickup" },
        { id: 2, name: "Red Lady Papaya", price: 250, stock: 80, unit: "items", category: "Fruits", minOrder: 2, harvestDate: "2026-07-12", deliveryMethod: "Both" },
        { id: 3, name: "Keeri Samba Rice", price: 230, stock: 500, unit: "kg", category: "Grains", minOrder: 10, harvestDate: "2026-06-25", deliveryMethod: "Delivery" }
    ]);

    const [editingProductId, setEditingProductId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editStock, setEditStock] = useState("");
    const [editUnit, setEditUnit] = useState("kg");
    const [editCategory, setEditCategory] = useState("");
    const [editMinOrder, setEditMinOrder] = useState("");
    const [editHarvestDate, setEditHarvestDate] = useState("");
    const [editDeliveryMethod, setEditDeliveryMethod] = useState("Pickup");

    const handleDeleteProduct = (id) => {
        let confirmation = window.confirm("Are you sure you want to remove this product from the marketplace?");
        if (confirmation === true) {
            let filteredProducts = products.filter(item => item.id !== id);
            setProducts(filteredProducts);
        }
    };

    const handleStartEdit = (product) => {
        setEditingProductId(product.id);
        setEditName(product.name);
        setEditPrice(product.price);
        setEditStock(product.stock);
        setEditUnit(product.unit);
        setEditCategory(product.category);
        setEditMinOrder(product.minOrder);
        setEditHarvestDate(product.harvestDate);
        setEditDeliveryMethod(product.deliveryMethod);
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        let updatedProducts = products.map((item) => {
            if (item.id === editingProductId) {
                return {
                    ...item, name: editName, price: Number(editPrice), stock: Number(editStock), unit: editUnit,
                    category: editCategory, minOrder: Number(editMinOrder), harvestDate: editHarvestDate, deliveryMethod: editDeliveryMethod
                };
            }
            return item;
        });
        setProducts(updatedProducts);
        setEditingProductId(null);
        alert("All product details updated successfully!");
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Harvest</h1>
                <p className="text-gray-500 mt-2">Update or remove your active marketplace crop listings.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-bold text-gray-700">Active Market Listings</h3>
                </div>

                <div className="space-y-4">
                    {products.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">No active product listings available.</div>
                    ) : (
                        products.map((item) => (
                            <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">

                                {editingProductId === item.id ? (
                                    <form onSubmit={handleSaveEdit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Product Name</label>
                                                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
                                                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white">
                                                    <option value="Fruits">Fruits</option><option value="Vegetables">Vegetables</option><option value="Grains">Grains & Rice</option><option value="Spices">Spices</option><option value="Fertilizer">Organic Fertilizer</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Unit Type</label>
                                                <select value={editUnit} onChange={(e) => setEditUnit(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white">
                                                    <option value="kg">kg</option><option value="g">g</option><option value="items">items</option><option value="bunches">bunches</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Price</label>
                                                <input type="number" required min="0" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Total Stock</label>
                                                <input type="number" required min="1" value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Min Order</label>
                                                <input type="number" required min="1" value={editMinOrder} onChange={(e) => setEditMinOrder(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Harvest Date</label>
                                                <input type="date" required value={editHarvestDate} onChange={(e) => setEditHarvestDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Logistics Option</label>
                                                <select value={editDeliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white cursor-pointer">
                                                    <option value="Pickup">Pickup From Farm</option><option value="Delivery">Seller Delivery</option><option value="Both">Flexible Options</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                                                <Check className="w-4 h-4" /> Save Updates
                                            </button>
                                            <button type="button" onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 px-6 rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                                                <X className="w-4 h-4" /> Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                                                <span className="bg-gray-200/60 text-gray-600 font-bold px-2 py-0.5 rounded text-[10px] uppercase">{item.category}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                                <p className="text-sm text-gray-600 font-medium">Price: <span className="text-green-600 font-bold">LKR {item.price} / {item.unit}</span></p>
                                                <p className="text-sm text-gray-600 font-medium">Stock: <span className="text-gray-900 font-bold">{item.stock} {item.unit}</span></p>
                                                <p className="text-sm text-gray-600 font-medium">Min Order: <span className="text-gray-900 font-bold">{item.minOrder} {item.unit}</span></p>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium mt-2">Harvest Date: {item.harvestDate} | Shipping: {item.deliveryMethod}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStartEdit(item)} className="p-3 text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center" title="Edit Entry">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(item.id)} className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center" title="Remove Product">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default FarmerManageHarvestPage;