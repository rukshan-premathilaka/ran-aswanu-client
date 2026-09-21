import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { farmerService } from '@/api/farmerService';

function FarmerManageHarvestPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await farmerService.getProducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to remove this product?');
        if (!isConfirmed) return;

        try {
            await farmerService.deleteProduct(id);
            setProducts(prev => prev.filter(item => item.id !== id));
            alert('නිෂ්පාදනය සාර්ථකව ඉවත් කරන ලදී!');
        } catch (error) {
            console.error('Delete product error:', error);
            alert('ඉවත් කිරීම අසාර්ථකයි.');
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await farmerService.updateProduct(editingProduct.id, editingProduct);
            alert('සාර්ථකව යාවත්කාලීන විය!');
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error('Update product error:', error);
            alert('යාවත්කාලීන කිරීම අසාර්ථක විය.');
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Harvest Listings</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Active Market Listings</h2>

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">No products published yet.</p>
                ) : (
                    <div className="space-y-4">
                        {products.map(item => (
                            <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                {editingProduct?.id === item.id ? (
                                    <form onSubmit={handleSaveEdit} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                value={editingProduct.productName}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                                                className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Price Per Unit (LKR)</label>
                                            <input
                                                type="number"
                                                value={editingProduct.pricePerUnit}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, pricePerUnit: e.target.value })}
                                                className="w-full border border-green-700 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setEditingProduct(null)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{item.productName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Stock: {item.availableStock} {item.unitOfMeasurement} | Price: LKR {item.pricePerUnit}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingProduct(item)}
                                                className="text-blue-600 hover:text-blue-800 font-bold px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 text-xs transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProduct(item.id)}
                                                className="text-red-500 hover:text-red-700 font-bold px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-xs transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FarmerManageHarvestPage;