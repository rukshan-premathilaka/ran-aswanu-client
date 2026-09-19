import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { farmerService } from '@/api/farmerService';

function FarmerManageHarvestPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await farmerService.getProducts();
            setProducts(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to remove this product?")) {
            try {
                await farmerService.deleteProduct(id);
                setProducts(products.filter(item => item.id !== id));
                alert("නිෂ්පාදනය සාර්ථකව ඉවත් කරන ලදී!");
            } catch (error) {
                alert("අසාර්ථකයි.");
            }
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await farmerService.updateProduct(editingProduct.id, editingProduct);
            alert("සාර්ථකව යාවත්කාලීන විය!");
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            alert("යාවත්කාලීන කිරීම අසාර්ථක විය.");
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Harvest</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Active Market Listings</h3>

                {loading ? <Loader2 className="w-8 h-8 animate-spin text-[#8dc63f] mx-auto" /> :
                    <div className="space-y-4">
                        {products.map(item => (
                            <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                {editingProduct?.id === item.id ? (
                                    <form onSubmit={handleSaveEdit} className="space-y-4">
                                        <input type="text" value={editingProduct.productName} onChange={(e) => setEditingProduct({...editingProduct, productName: e.target.value})} className="border p-2 rounded w-full" required/>
                                        <input type="number" value={editingProduct.pricePerUnit} onChange={(e) => setEditingProduct({...editingProduct, pricePerUnit: e.target.value})} className="border p-2 rounded w-full" required/>
                                        <div className="flex gap-2">
                                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold text-sm">Save</button>
                                            <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold text-sm">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{item.productName}</h4>
                                            <p className="text-sm text-gray-600">Stock: {item.availableStock} {item.unitOfMeasurement} | Price: LKR {item.pricePerUnit}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingProduct(item)} className="text-blue-500 font-bold px-3 py-1 border border-blue-200 rounded">Edit</button>
                                            <button onClick={() => handleDeleteProduct(item.id)} className="text-red-500 font-bold px-3 py-1 border border-red-200 rounded">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

export default FarmerManageHarvestPage;