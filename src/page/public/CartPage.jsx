import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import Navbar from "@/component/Navbar.jsx";
import CheckoutModal from "@/component/CheckoutModal.jsx";
import { fileUrl } from "@/api/fileurl.js";
import { getCart, onCartChange, removeFromCart, removeManyFromCart, updateCartQuantity } from "@/utils/cart.js";

const UNKNOWN_SELLER = "unknown"; // items added before the cart stored the farmer


const num = (n) => Number(n) || 0;
const money = (n) => num(n).toFixed(2);
const lineTotal = (i) => num(i.pricePerUnit) * num(i.quantity);

function quantityProblem(i) {
    const qty = Number(i.quantity);
    if (!(qty > 0)) return "Enter a quantity above 0.";
    if (i.minimumOrderQuantity && qty < Number(i.minimumOrderQuantity)) {
        return `The minimum order is ${i.minimumOrderQuantity} ${i.unitOfMeasurement ?? ""}.`;
    }
    if (i.availableStock != null && qty > Number(i.availableStock)) {
        return `Only ${i.availableStock} ${i.unitOfMeasurement ?? ""} in stock.`;
    }
    return "";
}

//  "Buy now" sends it to POST /buyer/orders,

export default function CartPage() {
    const [items, setItems] = useState(() => getCart()); // reads localStorage
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        setItems(getCart());
        return onCartChange(() => setItems(getCart()));
    }, []);

    // group the items by seller
    const groups = useMemo(() => {
        const map = new Map();
        for (const i of items) {
            const key = i.farmerId ?? UNKNOWN_SELLER;
            if (!map.has(key)) {
                map.set(key, { key, name: key === UNKNOWN_SELLER ? "Other items" : i.farmerName || "Seller", items: [] });
            }
            map.get(key).items.push(i);
        }
        return [...map.values()];
    }, [items]);

    const total = items.reduce((sum, i) => sum + lineTotal(i), 0);
    const hasProblem = items.some((i) => quantityProblem(i));
    const hasUnknownSeller = groups.some((g) => g.key === UNKNOWN_SELLER);

    return (
        <div className="w-full min-h-screen bg-white">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Your cart</h1>

                {items.length === 0 && !showCheckout ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 py-16 text-center">
                        <ShoppingBag size={40} className="text-gray-300" />
                        <p className="text-sm text-gray-500">Your cart is empty.</p>
                        <Link to="/products" className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 text-sm">
                            Browse produce
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-5">
                            {groups.map((group) => (
                                <section key={group.key} aria-label={`Items from ${group.name}`} className="rounded-2xl border border-gray-100 overflow-hidden">
                                    <header className="flex items-center justify-between gap-3 bg-gray-50 px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-800">
                                            <span className="font-normal text-gray-500">Seller: </span>{group.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Subtotal: <span className="font-semibold text-gray-800">LKR {money(group.items.reduce((s, i) => s + lineTotal(i), 0))}</span>
                                        </p>
                                    </header>

                                    <ul className="divide-y divide-gray-100">
                                        {group.items.map((i) => {
                                            const image = fileUrl(i.productImage);
                                            const problem = quantityProblem(i);
                                            return (
                                                <li key={i.listId} className="flex flex-wrap items-center gap-4 p-4">
                                                    {image ? (
                                                        <img src={image} alt={i.productName} className="h-16 w-16 rounded-xl border border-gray-100 object-cover" />
                                                    ) : (
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-50 text-lg font-semibold text-green-700">
                                                            {(i.productName ?? "?").charAt(0).toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="min-w-[8rem] flex-1">
                                                        <Link to={`/product/${i.listId}`} className="font-medium text-gray-800 hover:text-green-700">
                                                            {i.productName}
                                                        </Link>
                                                        <p className="text-xs text-gray-500">LKR {i.pricePerUnit} / {i.unitOfMeasurement}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            inputMode="decimal"
                                                            aria-label={`Quantity of ${i.productName}`}
                                                            min={i.minimumOrderQuantity ?? 1}
                                                            max={i.availableStock ?? undefined}
                                                            value={i.quantity ?? ""}
                                                            onChange={(e) => updateCartQuantity(i.listId, e.target.value)}
                                                            className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                                                        />
                                                        <span className="text-sm text-gray-500">{i.unitOfMeasurement}</span>
                                                    </div>

                                                    <div className="w-32 text-right">
                                                        <p className="text-xs text-gray-400">{num(i.quantity)} {i.unitOfMeasurement} × LKR {i.pricePerUnit}</p>
                                                        <p className="text-sm font-semibold text-gray-800">LKR {money(lineTotal(i))}</p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(i.listId)}
                                                        aria-label={`Remove ${i.productName}`}
                                                        className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>

                                                    {problem && <p role="alert" className="basis-full text-xs text-red-600">{problem}</p>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            ))}
                        </div>

                        {/* summary */}
                        {items.length > 0 && (
                            <div className="mt-6 rounded-2xl border border-gray-100 p-5">
                                {(groups.length > 1 || hasUnknownSeller) && (
                                    <p className="mb-3 text-sm text-gray-500">
                                        {hasUnknownSeller
                                            ? "Items from different sellers are placed as separate orders (one order for each seller)."
                                            : `Your cart has items from ${groups.length} sellers, so ${groups.length} separate orders will be placed (one for each seller).`}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>
                                    <p className="text-lg font-bold text-gray-800">Total: LKR {money(total)}</p>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <Link
                                        to="/products"
                                        className="flex-1 rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-3 text-sm text-center"
                                    >
                                        Buy more
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setShowCheckout(true)}
                                        disabled={hasProblem}
                                        className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Buy now
                                    </button>
                                </div>
                                {hasProblem && <p className="mt-2 text-xs text-red-600">Fix the quantities marked in red to continue.</p>}
                            </div>
                        )}
                    </>
                )}
            </div>

            {showCheckout && (
                <CheckoutModal
                    items={items}
                    onClose={() => setShowCheckout(false)}
                    // Order placed" screen,
                    onSuccess={() => removeManyFromCart(items.map((i) => i.listId))}
                />
            )}
        </div>
    );
}
