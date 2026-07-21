// AdminDashboard.jsx
// ------------------------------------------------------
// Admin dashboard with dummy data.
// Admin can:
//   1. Remove a product
//   2. Ban a user (buyer or seller)
//
// Uses lucide-react for icons (npm install lucide-react if not installed).
// Dummy data lives in useState — swap for a real API call later using
// ApiService + ENDPOINTS, same pattern as your other pages.

import { useState } from "react";
import { Package, Users, ShieldBan, Trash2, Ban } from "lucide-react";

function AdminDashboard() {
    // ---- DUMMY PRODUCTS ----
    const [products, setProducts] = useState([
        { id: 1, name: "Fresh Tomatoes", sellerName: "Nimal Perera" },
        { id: 2, name: "King Coconut", sellerName: "Kamal Silva" },
        { id: 3, name: "Organic Carrots", sellerName: "Sunil Fernando" },
    ]);

    // ---- DUMMY USERS ----
    const [users, setUsers] = useState([
        { id: 1, username: "rukshan_farmer", role: "SELLER", banned: false },
        { id: 2, username: "amali_buyer", role: "BUYER", banned: false },
        { id: 3, username: "kasun_seller", role: "SELLER", banned: false },
        { id: 4, username: "dilani_buyer", role: "BUYER", banned: false },
    ]);

    // ---- REMOVE A PRODUCT ----
    const handleRemoveProduct = (productId) => {
        const sure = window.confirm("Remove this product?");
        if (!sure) return;
        setProducts((prev) => prev.filter((p) => p.id !== productId));
    };

    // ---- BAN A USER ----
    const handleBanUser = (userId) => {
        const sure = window.confirm("Ban this user?");
        if (!sure) return;
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, banned: true } : u))
        );
    };

    // small helper: turn a username into initials for the avatar circle
    const getInitials = (username) => username.slice(0, 2).toUpperCase();

    const bannedCount = users.filter((u) => u.banned).length;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-4xl mx-auto">

                {/* ---- HEADER ---- */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage products and users across the platform
                    </p>
                </div>

                {/* ---- SUMMARY STAT CARDS ---- */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <div className="bg-lime-100 text-lime-600 rounded-xl p-3">
                            <Package size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                            <p className="text-xs text-gray-500">Active Products</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <div className="bg-lime-100 text-lime-600 rounded-xl p-3">
                            <Users size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                            <p className="text-xs text-gray-500">Total Users</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <div className="bg-red-100 text-red-500 rounded-xl p-3">
                            <ShieldBan size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{bannedCount}</p>
                            <p className="text-xs text-gray-500">Banned Users</p>
                        </div>
                    </div>
                </div>

                {/* ---- PRODUCTS SECTION ---- */}
                <div className="mb-10">
                    <h2 className="text-base font-semibold text-gray-700 mb-4">Products</h2>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {products.length === 0 && (
                            <p className="text-sm text-gray-400 px-5 py-6 text-center">
                                No products left.
                            </p>
                        )}

                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className={`flex items-center justify-between px-5 py-4 ${
                                    index !== products.length - 1 ? "border-b border-gray-100" : ""
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 text-gray-500 rounded-lg p-2.5">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-400">by {product.sellerName}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRemoveProduct(product.id)}
                                    className="flex items-center gap-1.5 text-red-500 border border-red-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ---- USERS SECTION ---- */}
                <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-4">Users</h2>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {users.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between px-5 py-4 ${
                                    index !== users.length - 1 ? "border-b border-gray-100" : ""
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* avatar circle with initials */}
                                    <div className="w-9 h-9 rounded-full bg-lime-600 text-white text-xs font-semibold flex items-center justify-center">
                                        {getInitials(user.username)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">{user.username}</p>
                                        <span
                                            className={`inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                user.role === "SELLER"
                                                    ? "bg-lime-100 text-lime-700"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                {user.banned ? (
                                    <span className="text-xs text-red-500 font-medium">Banned</span>
                                ) : (
                                    <button
                                        onClick={() => handleBanUser(user.id)}
                                        className="flex items-center gap-1.5 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                                    >
                                        <Ban size={14} />
                                        Ban
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;