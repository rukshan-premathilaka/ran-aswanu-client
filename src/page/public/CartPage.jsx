import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/component/Navbar.jsx";
import CheckoutModal from "@/component/CheckoutModal.jsx";
import { getCart, onCartChange, removeFromCart, removeManyFromCart, updateCartQuantity } from "@/utils/cart.js";

// The cart is kept in the browser (localStorage). Checkout sends it to POST /buyer/orders.
export default function CartPage() {
    const [items, setItems] = useState(getCart());
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => onCartChange(() => setItems(getCart())), []);

    const total = items.reduce((sum, i) => sum + Number(i.pricePerUnit) * Number(i.quantity), 0);

    return (
        <div className="w-full min-h-screen bg-white">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Your cart</h1>

                {items.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Your cart is empty.{" "}
                        <Link to="/home" className="text-green-700 font-medium underline">Browse produce</Link>
                    </p>
                ) : (
                    <>
                        <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
                            {items.map((i) => (
                                <li key={i.listId} className="flex flex-wrap items-center justify-between gap-3 p-4">
                                    <div>
                                        <Link to={`/product/${i.listId}`} className="font-medium text-gray-800 hover:text-green-700">
                                            {i.productName}
                                        </Link>
                                        <p className="text-xs text-gray-500">LKR {i.pricePerUnit} / {i.unitOfMeasurement}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min={i.minimumOrderQuantity ?? 1}
                                            max={i.availableStock}
                                            value={i.quantity}
                                            onChange={(e) => updateCartQuantity(i.listId, e.target.value)}
                                            className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                                        />
                                        <span className="text-sm font-semibold text-gray-800 w-28 text-right">
                                            LKR {(Number(i.pricePerUnit) * Number(i.quantity || 0)).toFixed(2)}
                                        </span>
                                        <button onClick={() => removeFromCart(i.listId)} className="text-sm text-red-600 hover:underline">
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center justify-between mt-6">
                            <p className="text-lg font-bold text-gray-800">Total: LKR {total.toFixed(2)}</p>
                            <button
                                onClick={() => setShowCheckout(true)}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-6 py-3 text-sm"
                            >
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>

            {showCheckout && (
                <CheckoutModal
                    items={items}
                    onClose={() => setShowCheckout(false)}
                    onSuccess={() => removeManyFromCart(items.map((i) => i.listId))}
                />
            )}
        </div>
    );
}